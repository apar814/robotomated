import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

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
    const { certificationId, userName, userEmail, paidBy, employerName } = body;

    if (!certificationId || !userName || !userEmail || !paidBy) {
      return NextResponse.json(
        {
          error: "Missing required fields: certificationId, userName, userEmail, paidBy",
        },
        { status: 400 }
      );
    }

    if (!["self", "employer"].includes(paidBy)) {
      return NextResponse.json(
        { error: "paidBy must be 'self' or 'employer'" },
        { status: 400 }
      );
    }

    if (paidBy === "employer" && !employerName) {
      return NextResponse.json(
        { error: "employerName is required when paidBy is 'employer'" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Verify certification exists and is active
    const { data: certification, error: certError } = await supabase
      .from("rco_certifications")
      .select("id, name, level, exam_duration, active")
      .eq("id", certificationId)
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

    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72); // 72-hour window to start

    // TODO: Integrate Stripe payment before creating session
    // For now, create session directly (payment handling added later)

    const { data: session, error: sessionError } = await supabase
      .from("rco_exam_sessions")
      .insert({
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
