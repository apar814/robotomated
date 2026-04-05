import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { FOUNDATION_QUESTIONS } from "@/lib/data/sample-exam-questions";

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

    // Check if questions exist for this certification; seed if not
    const { count } = await supabase
      .from("rco_questions")
      .select("id", { count: "exact", head: true })
      .eq("certification_id", certification.id)
      .eq("active", true);

    if (!count || count === 0) {
      // Seed sample questions for foundation level
      if (certification.level === 1) {
        const rows = FOUNDATION_QUESTIONS.map((q) => ({
          certification_id: certification.id,
          question_text: q.question_text,
          question_type: q.question_type,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          category: q.category,
        }));

        const { error: seedError } = await supabase
          .from("rco_questions")
          .insert(rows);

        if (seedError) {
          console.error("Failed to seed questions:", seedError);
          return NextResponse.json(
            { error: "Failed to prepare exam questions" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "No questions available for this certification" },
          { status: 400 }
        );
      }
    }

    // Fetch all active questions for this certification
    const { data: allQuestions, error: qError } = await supabase
      .from("rco_questions")
      .select("id")
      .eq("certification_id", certification.id)
      .eq("active", true);

    if (qError || !allQuestions || allQuestions.length === 0) {
      return NextResponse.json(
        { error: "Failed to load exam questions" },
        { status: 500 }
      );
    }

    // Randomize and take question_count
    const shuffled = (allQuestions as { id: string }[])
      .map((q) => ({ id: q.id, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((q) => q.id);

    const selectedIds = shuffled.slice(
      0,
      Math.min(certification.question_count, shuffled.length)
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
        certification_id: certification.id,
        session_token: sessionToken,
        status: "in_progress",
        expires_at: expiresAt.toISOString(),
        question_ids: selectedIds,
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
