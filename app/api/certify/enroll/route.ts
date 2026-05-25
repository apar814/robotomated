import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { createServerClient as createSSRClient } from "@supabase/ssr";

function generateSessionToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { certificationId } = body as { certificationId?: string };

    if (!certificationId) {
      return NextResponse.json(
        { error: "Missing required field: certificationId" },
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

    // Verify certification exists and is active
    const { data: certification, error: certError } = await supabase
      .from("rco_certifications")
      .select("id, name, level, exam_duration, active")
      .eq("id", certificationId)
      .single();

    if (certError || !certification) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
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
      .eq("certification_id", certificationId)
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

    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + certification.exam_duration);

    const { data: session, error: sessionError } = await supabase
      .from("rco_exam_sessions")
      .insert({
        user_id: user.id,
        certification_id: certificationId,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
        status: "in_progress",
      })
      .select("id, session_token, expires_at")
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Failed to create exam session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      sessionToken: session.session_token,
      expiresAt: session.expires_at,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
