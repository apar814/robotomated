import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import {
  stratifiedSelect,
  makeOptionOrders,
  type PoolQuestion,
} from "@/lib/certify/exam-engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certification_slug } = body;

    if (!certification_slug) {
      return NextResponse.json(
        { error: "Missing required field: certification_slug" },
        { status: 400 }
      );
    }

    // Auth check
    const supabaseResponse = NextResponse.json({});
    const userSupabase = createSSRClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options));
          },
        },
      }
    );

    const { data: { user } } = await userSupabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    // Look up certification by slug
    const { data: certification, error: certError } = await supabase
      .from("rco_certifications")
      .select("id, slug, name, level, exam_duration, question_count, passing_score, active")
      .eq("slug", certification_slug)
      .single();

    if (certError || !certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 404 }
      );
    }

    if (!certification.active) {
      return NextResponse.json(
        { error: "This certification is not currently available" },
        { status: 400 }
      );
    }

    // Payment gate: user must have a completed payment for this cert
    const { data: enrollment } = await supabase
      .from("rco_payments")
      .select("id, status, created_at")
      .eq("user_id", user.id)
      .eq("certification_id", certification.id)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!enrollment) {
      return NextResponse.json(
        { error: "No active enrollment for this certification" },
        { status: 403 }
      );
    }

    // Enrollments are valid for 2 years from purchase date
    const enrolledAt = new Date(enrollment.created_at);
    const expiresAtEnrollment = new Date(enrolledAt);
    expiresAtEnrollment.setFullYear(expiresAtEnrollment.getFullYear() + 2);
    if (expiresAtEnrollment < new Date()) {
      return NextResponse.json(
        { error: "Enrollment has expired (valid for 2 years from purchase)" },
        { status: 403 }
      );
    }

    // Question pools are managed by the versioned seed script (Phase 1),
    // never auto-seeded at exam start. An empty pool is a hard error.
    const { count } = await supabase
      .from("rco_questions")
      .select("id", { count: "exact", head: true })
      .eq("certification_id", certification.id)
      .eq("active", true);

    if (!count || count === 0) {
      console.error(`[certify/start] no active questions for ${certification.slug}`);
      return NextResponse.json(
        { error: "No questions available for this certification" },
        { status: 400 }
      );
    }

    // Fetch the active pool with the fields stratified selection needs
    const { data: allQuestions, error: qError } = await supabase
      .from("rco_questions")
      .select("id, domain_code, difficulty, options")
      .eq("certification_id", certification.id)
      .eq("active", true);

    if (qError || !allQuestions || allQuestions.length === 0) {
      return NextResponse.json(
        { error: "Failed to load exam questions" },
        { status: 500 }
      );
    }

    // Retake bias: collect question ids this user has already been served
    const { data: priorSessions } = await supabase
      .from("rco_exam_sessions")
      .select("question_ids")
      .eq("user_id", user.id)
      .eq("certification_id", certification.id);
    const seenIds = new Set<string>(
      ((priorSessions || []) as { question_ids: string[] }[]).flatMap(
        (s) => s.question_ids || []
      )
    );

    // Stratified selection: domain + difficulty quotas, Fisher-Yates within
    // strata, unseen-first. Falls back to a flat shuffle for legacy pools.
    const selectedIds = stratifiedSelect(
      allQuestions as PoolQuestion[],
      certification.question_count,
      seenIds
    );

    // Per-session option shuffling: perm[servedIndex] = canonical index.
    // Stored on the session so scoring can remap submitted indices.
    const selectedSet = new Set(selectedIds);
    const optionOrders = makeOptionOrders(
      (allQuestions as PoolQuestion[]).filter((q) => selectedSet.has(q.id))
    );

    // Generate session token
    const sessionToken = crypto.randomUUID();

    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + certification.exam_duration);

    // Create exam session
    const { data: session, error: sessionError } = await supabase
      .from("rco_exam_sessions")
      .insert({
        user_id: user.id,
        certification_id: certification.id,
        session_token: sessionToken,
        status: "in_progress",
        expires_at: expiresAt.toISOString(),
        question_ids: selectedIds,
        option_orders: optionOrders,
        answers: {},
        ip_address:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          null,
        user_agent: request.headers.get("user-agent") || null,
      })
      .select("id, session_token, expires_at")
      .single();

    if (sessionError || !session) {
      console.error("Failed to create session:", sessionError);
      return NextResponse.json(
        { error: "Failed to create exam session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      session_id: session.id,
      session_token: session.session_token,
      expires_at: session.expires_at,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
