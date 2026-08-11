import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { permuteOptions } from "@/lib/certify/exam-engine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing session token" },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from("rco_exam_sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("session_token", token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found or invalid token" },
        { status: 404 }
      );
    }

    // Check status
    if (session.status !== "in_progress") {
      return NextResponse.json(
        { error: "This exam session is no longer active", status: session.status },
        { status: 400 }
      );
    }

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      // Auto-expire the session
      await supabase
        .from("rco_exam_sessions")
        .update({ status: "abandoned", completed_at: new Date().toISOString() })
        .eq("id", sessionId);

      return NextResponse.json(
        { error: "This exam session has expired" },
        { status: 400 }
      );
    }

    // Fetch questions by IDs — exclude correct_answer/correct_answers and explanation
    const questionIds = session.question_ids as string[];

    const { data: questions, error: qError } = await supabase
      .from("rco_questions")
      .select("id, question_text, question_type, options, scenario_context, difficulty, category, time_limit, media_url")
      .in("id", questionIds);

    if (qError || !questions) {
      return NextResponse.json(
        { error: "Failed to load questions" },
        { status: 500 }
      );
    }

    // Preserve the order from question_ids and apply this session's option
    // permutation — the client only ever sees the served order.
    const optionOrders = (session.option_orders || {}) as Record<string, number[]>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questionMap = new Map((questions as any[]).map((q) => [q.id, q]));
    const orderedQuestions = questionIds
      .map((id) => questionMap.get(id))
      .filter(Boolean)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((q: any) => ({
        ...q,
        options: permuteOptions(q.options as unknown[], optionOrders[q.id]),
      }));

    return NextResponse.json({
      session: {
        id: session.id,
        certification_id: session.certification_id,
        status: session.status,
        started_at: session.started_at,
        expires_at: session.expires_at,
        answers: session.answers,
        tab_switch_count: session.tab_switch_count,
      },
      questions: orderedQuestions,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    // The exam UI posts `answer` (number for single-answer, number[] for
    // multi_select); `answer_index` kept for back-compat.
    const { question_id, answer, answer_index, tab_switch } = body;
    const submitted = answer !== undefined ? answer : answer_index;

    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Missing session token" },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createServerClient() as any;

    // Fetch session
    const { data: session, error: sessionError } = await supabase
      .from("rco_exam_sessions")
      .select("id, status, expires_at, answers, tab_switch_count")
      .eq("id", sessionId)
      .eq("session_token", token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session not found or invalid token" },
        { status: 404 }
      );
    }

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { error: "This exam session is no longer active" },
        { status: 400 }
      );
    }

    // Check expiration
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "This exam session has expired" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};

    // Save answer if provided — served indices only; validated as numbers
    if (question_id !== undefined && submitted !== undefined) {
      const valid =
        typeof submitted === "number" ||
        (Array.isArray(submitted) && submitted.every((v) => typeof v === "number"));
      if (!valid) {
        return NextResponse.json({ error: "Invalid answer format" }, { status: 400 });
      }
      const currentAnswers =
        (session.answers as Record<string, number | number[]>) || {};
      currentAnswers[question_id] = submitted;
      updates.answers = currentAnswers;
    }

    // Increment tab switch count if flagged
    if (tab_switch) {
      updates.tab_switch_count = (session.tab_switch_count || 0) + 1;
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from("rco_exam_sessions")
        .update(updates)
        .eq("id", sessionId);

      if (updateError) {
        console.error("Failed to update session:", updateError);
        return NextResponse.json(
          { error: "Failed to save answer" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
