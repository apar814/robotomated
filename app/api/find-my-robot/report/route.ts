import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { createServerClient } from "@/lib/supabase/server";

interface Recommendation {
  name: string;
  category: string;
  priceRange: string;
  whyMatch: string;
  score: number;
}

interface WizardState {
  problem: string;
  industry: string;
  facilitySize: string;
  workers: string;
  urgency: string;
  priorities: string[];
  budget: string;
}

export async function POST(request: NextRequest) {
  let body: { email: string; wizardState: WizardState; recommendations: Recommendation[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, wizardState, recommendations } = body;

  if (!email || !wizardState || !recommendations) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Subscribe to newsletter with wizard tag
  const supabase = createServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;
  await db.from("newsletter_subscribers").insert({
    email: email.toLowerCase().trim(),
    source: "wizard",
  }).catch(() => {/* may already exist or table missing */});

  // Send personalized report email
  const robotRows = recommendations
    .map(
      (r, i) => `
      <tr style="border-bottom: 1px solid #1a1a1a;">
        <td style="padding: 12px 8px; color: #2563EB; font-weight: 600; font-size: 14px;">#${i + 1}</td>
        <td style="padding: 12px 8px;">
          <div style="font-weight: 600; font-size: 14px;">${r.name}</div>
          <div style="color: #888; font-size: 12px; margin-top: 2px;">${r.category}</div>
        </td>
        <td style="padding: 12px 8px; color: #60A5FA; font-family: monospace; font-size: 14px;">${r.score}/100</td>
        <td style="padding: 12px 8px; color: #ccc; font-size: 13px;">${r.priceRange}</td>
      </tr>
    `
    )
    .join("");

  const priorityList = wizardState.priorities
    .map((p, i) => `<li style="color: #ccc; padding: 2px 0;">${i + 1}. ${p}</li>`)
    .join("");

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Your Personalized Robot Recommendations from Robotomated",
      html: `
        <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #080808; color: #e0e0e0; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 3px;">
              <span style="color: #fff;">ROBOTO</span><span style="color: #555;">MATED</span><span style="color: #2563EB;">.</span>
            </span>
          </div>

          <h1 style="color: #2563EB; font-size: 22px; margin-bottom: 8px;">Your Robot Buyer Profile</h1>
          <p style="color: #888; font-size: 13px; margin-bottom: 24px;">Based on your requirements, here are our top recommendations.</p>

          <div style="background: #111; border: 1px solid #222; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="color: #fff; font-size: 14px; margin: 0 0 12px 0;">Your Requirements</h3>
            <table style="width: 100%; font-size: 13px;">
              <tr><td style="color: #888; padding: 4px 0;">Problem</td><td>${wizardState.problem}</td></tr>
              <tr><td style="color: #888; padding: 4px 0;">Industry</td><td>${wizardState.industry}</td></tr>
              <tr><td style="color: #888; padding: 4px 0;">Facility</td><td>${wizardState.facilitySize}</td></tr>
              <tr><td style="color: #888; padding: 4px 0;">Team Size</td><td>${wizardState.workers}</td></tr>
              <tr><td style="color: #888; padding: 4px 0;">Budget</td><td>${wizardState.budget}</td></tr>
              <tr><td style="color: #888; padding: 4px 0;">Timeline</td><td>${wizardState.urgency}</td></tr>
            </table>
            ${priorityList ? `<div style="margin-top: 12px;"><p style="color: #888; font-size: 12px; margin: 0 0 4px;">Priorities:</p><ol style="margin: 0; padding-left: 16px;">${priorityList}</ol></div>` : ""}
          </div>

          <h2 style="color: #fff; font-size: 16px; margin-bottom: 12px;">Top Robot Matches</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #333;">
              <th style="text-align: left; padding: 8px; color: #888; font-size: 11px; font-weight: 500;">RANK</th>
              <th style="text-align: left; padding: 8px; color: #888; font-size: 11px; font-weight: 500;">ROBOT</th>
              <th style="text-align: left; padding: 8px; color: #888; font-size: 11px; font-weight: 500;">SCORE</th>
              <th style="text-align: left; padding: 8px; color: #888; font-size: 11px; font-weight: 500;">PRICE</th>
            </tr>
            ${robotRows}
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://robotomated.com/find-my-robot" style="display: inline-block; background: #2563EB; color: #000; padding: 12px 32px; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 14px;">Compare These Robots</a>
          </div>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://robotomated.com/advisor" style="color: #7B2FFF; text-decoration: none; font-size: 13px;">Talk to our AI Robot Advisor &rarr;</a>
          </div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #222; text-align: center;">
            <p style="color: #555; font-size: 11px; margin: 0;">Robotomated -- robotomated.com</p>
            <p style="color: #444; font-size: 10px; margin-top: 4px;">
              <a href="https://robotomated.com/unsubscribe?email=${encodeURIComponent(email)}" style="color: #444;">Unsubscribe</a>
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("[FindMyRobot] Report email failed:", err);
  }

  // Trigger onboarding drip for wizard completions
  try {
    await db.from("drip_queue").insert({
      email,
      sequence: "wizard_buyer",
      step: 0,
      next_send_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: { problem: wizardState.problem, industry: wizardState.industry, budget: wizardState.budget },
    });
  } catch {
    // drip_queue table may not exist yet — non-critical
  }

  return NextResponse.json({ ok: true });
}
