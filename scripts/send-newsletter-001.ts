/**
 * Send Newsletter Issue #001 — The Robotomated Brief
 * Run: npx tsx scripts/send-newsletter-001.ts
 */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// ── Validate env ──────────────────────────────────────────────────────────
if (!process.env.RESEND_API_KEY) {
  console.error("ERROR: RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT =
  "The Robotomated Brief #001 — 464 Robots, $103B Market, Your First Issue";
const FROM = "Robotomated <brief@robotomated.com>";

// ── Build email HTML ──────────────────────────────────────────────────────
interface TopRobot {
  name: string;
  manufacturer_name: string;
  robo_score: number;
  price_current: number | null;
}

function buildEmailHtml(
  topRobots: TopRobot[],
  totalRobots: number,
  unsubscribeParam: string
): string {
  const robotRows = topRobots
    .map(
      (r, i) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1E2642;color:#00C2FF;font-weight:700;font-size:18px;width:30px;">#${i + 1}</td>
        <td style="padding:12px 16px;border-bottom:1px solid #1E2642;">
          <div style="color:#fff;font-weight:600;font-size:15px;">${r.name}</div>
          <div style="color:#888;font-size:13px;margin-top:2px;">${r.manufacturer_name}</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #1E2642;text-align:right;">
          <div style="color:#00E5A0;font-weight:700;font-size:16px;">${r.robo_score}/100</div>
          <div style="color:#888;font-size:12px;margin-top:2px;">${r.price_current ? "$" + Number(r.price_current).toLocaleString("en-US") : "Price TBD"}</div>
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- HEADER -->
  <div style="text-align:center;padding:24px 0 32px;">
    <h1 style="color:#00C2FF;font-size:28px;margin:0;letter-spacing:-0.5px;">The Robotomated Brief</h1>
    <p style="color:#666;font-size:13px;margin:8px 0 0;">Issue #001 &middot; Weekly Robotics Intelligence</p>
  </div>

  <!-- WELCOME -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <p style="color:#E8E8E8;font-size:15px;line-height:1.7;margin:0;">
      Welcome to <strong style="color:#00C2FF;">The Robotomated Brief</strong> &mdash; your weekly robotics intelligence digest.
      We track <strong style="color:#fff;">${totalRobots} robots</strong> across every category so you don't have to. No fluff. No sponsored content. Just signal.
    </p>
  </div>

  <!-- TOP ROBOTS -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <h2 style="color:#00C2FF;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 16px;font-weight:700;">This Week's Top Robots</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${robotRows}
    </table>
    <div style="text-align:center;margin-top:20px;">
      <a href="https://robotomated.com/browse" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Browse All Robots &rarr;</a>
    </div>
  </div>

  <!-- MARKET INSIGHT -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <h2 style="color:#7B2FFF;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 12px;font-weight:700;">Market Insight</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.7;margin:0;">
      The global robotics market hit <strong style="color:#fff;">$103B in 2026</strong>, with humanoid robots growing <strong style="color:#00E5A0;">847% YoY</strong>.
      Goldman Sachs projects the humanoid segment alone could reach <strong style="color:#fff;">$38B by 2035</strong>.
    </p>
  </div>

  <!-- FUNDING HIGHLIGHT -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <h2 style="color:#00E5A0;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 12px;font-weight:700;">Funding Highlight</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.7;margin:0;">
      <strong style="color:#fff;">Figure AI</strong> raised <strong style="color:#00C2FF;">$675M Series B</strong> led by Jeff Bezos, Microsoft, and NVIDIA &mdash; the largest humanoid robotics round ever.
    </p>
  </div>

  <!-- NEW ON ROBOTOMATED -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:24px;">
    <h2 style="color:#FF6B35;font-size:14px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 12px;font-weight:700;">New on Robotomated</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.7;margin:0;">
      We just launched our <strong style="color:#fff;">Investment Tracker</strong> at
      <a href="https://robotomated.com/market/funding" style="color:#00C2FF;text-decoration:none;">robotomated.com/market/funding</a>
      &mdash; track every VC deal in robotics, ranked by amount, with investor profiles.
    </p>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;padding:24px 0;border-top:1px solid #1E2642;">
    <p style="color:#555;font-size:12px;margin:0 0 8px;">
      Robotomated &mdash; The robotics intelligence platform
    </p>
    <p style="margin:0 0 12px;">
      <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;font-size:12px;">robotomated.com</a>
    </p>
    <p style="margin:0;">
      <a href="https://robotomated.com/unsubscribe?${unsubscribeParam}" style="color:#666;text-decoration:underline;font-size:11px;">Unsubscribe</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== The Robotomated Brief #001 ===\n");

  // 1. Fetch top 3 robots by robo_score
  const { data: topRobots, error: robotsErr } = await sb
    .from("robots")
    .select("name, robo_score, price_current, manufacturer:manufacturers(name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(3);

  if (robotsErr) {
    console.error("Error fetching top robots:", robotsErr.message);
    process.exit(1);
  }

  const formattedRobots: TopRobot[] = (topRobots || []).map((r: any) => ({
    name: r.name,
    manufacturer_name: r.manufacturer?.name ?? "Unknown",
    robo_score: r.robo_score,
    price_current: r.price_current,
  }));

  console.log("Top 3 robots:");
  formattedRobots.forEach((r, i) =>
    console.log(
      `  ${i + 1}. ${r.name} (${r.manufacturer_name}) — ${r.robo_score}/100 — ${r.price_current ? "$" + Number(r.price_current).toLocaleString("en-US") : "N/A"}`
    )
  );

  // 2. Total robot count
  const { count: totalRobots, error: countErr } = await sb
    .from("robots")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  if (countErr) {
    console.error("Error counting robots:", countErr.message);
    process.exit(1);
  }

  console.log(`\nTotal active robots: ${totalRobots}`);

  // 3. Fetch confirmed subscribers
  // Note: unsubscribe_token column may not exist yet (migration 008 not applied).
  // Try with token first, fall back to email-only.
  let subscribers: { email: string; unsubscribe_token?: string }[] | null = null;
  let subsErr: any = null;

  const tryWithToken = await sb
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true);

  if (tryWithToken.error?.message?.includes("does not exist")) {
    console.log("  (unsubscribe_token column not found, using email-based unsubscribe)");
    const fallback = await sb
      .from("newsletter_subscribers")
      .select("email")
      .eq("confirmed", true);
    subscribers = fallback.data;
    subsErr = fallback.error;
  } else {
    subscribers = tryWithToken.data;
    subsErr = tryWithToken.error;
  }

  if (subsErr) {
    console.error("Error fetching subscribers:", subsErr.message);
    process.exit(1);
  }

  if (!subscribers || subscribers.length === 0) {
    console.log("\nNo confirmed subscribers found. Nothing to send.");
    process.exit(0);
  }

  console.log(`\nConfirmed subscribers: ${subscribers.length}`);

  // 4. Send to each subscriber individually
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubscribeParam = sub.unsubscribe_token
      ? `token=${sub.unsubscribe_token}`
      : `email=${encodeURIComponent(sub.email)}`;
    const html = buildEmailHtml(
      formattedRobots,
      totalRobots ?? 0,
      unsubscribeParam
    );

    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject: SUBJECT,
        html,
      });

      if (error) {
        console.error(`  FAIL: ${sub.email} — ${error.message}`);
        failed++;
      } else {
        console.log(`  SENT: ${sub.email}`);
        sent++;
      }
    } catch (err: any) {
      console.error(`  FAIL: ${sub.email} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Sent: ${sent} | Failed: ${failed} | Total: ${subscribers.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
