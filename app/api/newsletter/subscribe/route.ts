import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

function buildWelcomeEmail(): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#0A0F1E;color:#e0e0e0;font-family:'Space Grotesk',system-ui,sans-serif;padding:32px;max-width:600px;margin:0 auto;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#00C2FF;font-size:28px;margin:0;">The Robotomated Brief</h1>
    <p style="color:#888;font-size:13px;margin:8px 0 0;">Weekly robotics intelligence</p>
  </div>
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <h2 style="color:#fff;font-size:20px;margin:0 0 16px;">You're in. Your robotics edge starts now.</h2>
    <p style="line-height:1.7;font-size:15px;margin:0 0 16px;">
      Every Monday at 7am ET, you'll get a curated briefing covering:
    </p>
    <ul style="line-height:2;font-size:14px;padding-left:20px;margin:0 0 16px;">
      <li><strong style="color:#00C2FF;">Market Moves</strong> — Funding rounds, acquisitions, IPOs</li>
      <li><strong style="color:#00E5A0;">New Robots</strong> — Every robot added to our 305+ database</li>
      <li><strong style="color:#7B2FFF;">Price Drops</strong> — Weekly price movements you should know about</li>
      <li><strong style="color:#FF6B35;">Industry Intel</strong> — Trends, analysis, what operators need to know</li>
    </ul>
    <p style="line-height:1.7;font-size:15px;margin:0 0 20px;">
      No fluff. No sponsored content. Just the intelligence that matters.
    </p>
    <div style="text-align:center;">
      <a href="https://robotomated.com" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
        Explore Robotomated &rarr;
      </a>
    </div>
  </div>
  <div style="text-align:center;padding:16px 0;color:#555;font-size:12px;">
    <p>Robotomated — The robotics intelligence platform</p>
    <p style="margin-top:8px;">
      <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;">robotomated.com</a>
    </p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const { email, industry, source } = await request.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const cleanEmail = email.toLowerCase().trim();
  const supabase = createServerClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: cleanEmail,
      industry_preference: industry || null,
      source: source || "newsletter-page",
    });

  if (error) {
    if (error.code === "23505") {
      if (industry) {
        await supabase
          .from("newsletter_subscribers")
          .update({ industry_preference: industry })
          .eq("email", cleanEmail);
      }
      return NextResponse.json({ message: "You're already subscribed! Preference updated." });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

  // Send welcome email (fire-and-forget)
  resend.emails.send({
    from: EMAIL_FROM,
    to: cleanEmail,
    subject: "You're in. Your robotics edge starts now.",
    html: buildWelcomeEmail(),
  }).catch(() => {}); // Don't fail the subscription if email fails

  return NextResponse.json({
    message: "Welcome aboard! Check your inbox for a confirmation email. First brief arrives Monday.",
  });
}
