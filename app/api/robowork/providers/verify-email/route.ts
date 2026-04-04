import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

const verificationCodes = new Map<
  string,
  { code: string; expiresAt: number }
>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, action, code } = body as {
      email?: string;
      action?: string;
      code?: string;
    };

    if (!email || !action) {
      return NextResponse.json(
        { error: "Missing email or action" },
        { status: 400 }
      );
    }

    if (action === "send") {
      const verificationCode = generateCode();
      verificationCodes.set(email, {
        code: verificationCode,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: "Your Robotomated verification code",
        text: `Your verification code is: ${verificationCode}. It expires in 10 minutes.`,
      });

      return NextResponse.json({ sent: true });
    }

    if (action === "verify") {
      if (!code) {
        return NextResponse.json(
          { error: "Missing code" },
          { status: 400 }
        );
      }

      const stored = verificationCodes.get(email);
      if (!stored) {
        return NextResponse.json({ verified: false });
      }

      if (stored.code === code && stored.expiresAt > Date.now()) {
        verificationCodes.delete(email);
        return NextResponse.json({ verified: true });
      }

      return NextResponse.json({ verified: false });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (err) {
    console.error("verify-email error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
