import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import {
  scoreSubmission,
  type AnswerMap,
  type OptionOrders,
  type ScorableQuestion,
} from "@/lib/certify/exam-engine";

function generateCredentialId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "RCO-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(
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

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { error: "This exam session is no longer active" },
        { status: 400 }
      );
    }

    // Fetch certification for passing score and renewal years
    const { data: certification, error: certError } = await supabase
      .from("rco_certifications")
      .select("id, name, passing_score, renewal_years")
      .eq("id", session.certification_id)
      .single();

    if (certError || !certification) {
      return NextResponse.json(
        { error: "Certification not found" },
        { status: 500 }
      );
    }

    // Fetch all questions by IDs to score
    const questionIds = session.question_ids as string[];
    const { data: questions, error: qError } = await supabase
      .from("rco_questions")
      .select("id, question_type, correct_answers, correct_answer")
      .in("id", questionIds);

    if (qError || !questions) {
      return NextResponse.json(
        { error: "Failed to load questions for scoring" },
        { status: 500 }
      );
    }

    // Score the exam: submitted served indices are remapped through the
    // session's option permutation; multi_select is exact-set, no partial
    // credit; legacy sessions without permutations score as identity.
    const answers = (session.answers as AnswerMap) || {};
    const optionOrders = (session.option_orders || {}) as OptionOrders;
    const { correctCount, total: totalQuestions } = scoreSubmission(
      questions as ScorableQuestion[],
      answers,
      optionOrders
    );

    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100 * 100) / 100
      : 0;
    const passed = score >= (certification.passing_score || 75);

    // Update session
    const { error: updateError } = await supabase
      .from("rco_exam_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        score,
        passed,
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Failed to update session:", updateError);
      return NextResponse.json(
        { error: "Failed to save exam results" },
        { status: 500 }
      );
    }

    let credentialId: string | null = null;

    // If passed, create credential
    if (passed) {
      credentialId = generateCredentialId();

      const renewalYears = certification.renewal_years || 2;
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + renewalYears);

      // Resolve the holder's real identity. The credential is public on
      // /verify, so it must carry the person's actual name and email —
      // sources in order of trust: users profile, auth record, Stripe payer.
      let holderName = "";
      let holderEmail = "";
      if (session.user_id) {
        const { data: profile } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", session.user_id)
          .maybeSingle();
        holderName = profile?.name?.trim() || "";
        holderEmail = profile?.email?.trim() || "";

        if (!holderName || !holderEmail) {
          const { data: authData } = await supabase.auth.admin.getUserById(
            session.user_id
          );
          const meta = authData?.user?.user_metadata ?? {};
          holderEmail = holderEmail || authData?.user?.email || "";
          holderName =
            holderName || meta.full_name?.trim() || meta.name?.trim() || "";
        }

        if (!holderName || !holderEmail) {
          const { data: payment } = await supabase
            .from("rco_payments")
            .select("payer_name, payer_email")
            .eq("user_id", session.user_id)
            .eq("certification_id", certification.id)
            .eq("status", "completed")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          if (payment?.payer_name && payment.payer_name !== "Unknown") {
            holderName = holderName || payment.payer_name;
          }
          holderEmail = holderEmail || payment?.payer_email || "";
        }
      }

      const { error: credError } = await supabase
        .from("rco_credentials")
        .insert({
          user_id: session.user_id || null,
          certification_id: certification.id,
          exam_session_id: session.id,
          credential_id: credentialId,
          holder_name: holderName || "Exam Candidate",
          holder_email: holderEmail || "pending@robotomated.com",
          issued_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          status: "active",
          shareable_url: `https://robotomated.com/verify/${credentialId}`,
        });

      if (credError) {
        console.error("Failed to create credential:", credError);
        // Non-fatal: exam still scored, credential can be generated later
      }
    }

    return NextResponse.json({
      score,
      passed,
      total_questions: totalQuestions,
      correct_count: correctCount,
      credential_id: credentialId,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
