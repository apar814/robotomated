/**
 * Send Newsletter Issue #001 — The Robotomated Brief
 * Run: npx tsx scripts/send-newsletter-001.ts
 */
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.RESEND_API_KEY) {
  console.error("ERROR: RESEND_API_KEY is not set in .env.local");
  process.exit(1);
}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT = "The Robotomated Brief #001 — The Robot Buying Guide You've Been Missing";
const FROM = "Robotomated <digest@robotomated.com>";

// ── Why each robot ranks high ──
const ROBOT_WHYS: Record<string, string> = {
  "Intuitive da Vinci 5": "First surgical robot with force feedback — 9,000+ systems installed globally, 2.4M procedures/year.",
  "da Vinci 5": "Gold standard in robotic surgery. New gen adds haptics and 10K+ instrument ecosystem.",
  "S8 MaxV Ultra": "10,000Pa suction, ReactiveAI 2.0 obstacle avoidance, and 8-in-1 dock — best consumer robot vacuum.",
  "Roborock S8 MaxV Ultra": "10,000Pa suction, ReactiveAI 2.0 obstacle avoidance, and 8-in-1 dock — best consumer robot vacuum.",
  "Boston Dynamics Atlas (Electric)": "All-electric redesign with range of motion exceeding human flexibility. The benchmark for humanoid agility.",
  "Boston Dynamics Spot Security": "Quadruped with 360-degree thermal + visual, stairs, and rough terrain — unmatched for autonomous patrol.",
  "Boston Dynamics Spot": "1,500+ units deployed. The most versatile commercial quadruped for inspection and security.",
};

function getWhyText(name: string): string {
  return ROBOT_WHYS[name] || "Top-ranked across our 8-dimension RoboScore methodology.";
}

function formatUsd(n: number | null): string {
  if (n == null) return "Request quote";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

// ── Build email HTML ──
function buildEmailHtml(opts: {
  topRobots: { name: string; mfr: string; score: number; price: number | null }[];
  totalRobots: number;
  marketInsight: string;
  fundingHighlight: string;
  unsubParam: string;
}): string {
  const { topRobots, totalRobots, marketInsight, fundingHighlight, unsubParam } = opts;

  const robotRows = topRobots
    .map(
      (r, i) => `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #1E2642;color:#00C2FF;font-weight:700;font-size:20px;width:36px;vertical-align:top;">#${i + 1}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #1E2642;">
          <div style="color:#fff;font-weight:700;font-size:16px;">${r.name}</div>
          <div style="color:#888;font-size:13px;margin-top:2px;">${r.mfr} &middot; RoboScore <span style="color:#00E5A0;font-weight:700;">${r.score}/100</span> &middot; ${formatUsd(r.price)}</div>
          <div style="color:#aaa;font-size:13px;margin-top:6px;line-height:1.6;">${getWhyText(r.name)}</div>
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
  <div style="text-align:center;padding:24px 0 16px;">
    <h1 style="color:#00C2FF;font-size:26px;margin:0;letter-spacing:-0.5px;">The Robotomated Brief</h1>
    <p style="color:#555;font-size:13px;margin:8px 0 0;">Issue #001 &middot; Weekly Robotics Intelligence</p>
  </div>

  <!-- WHY WE BUILT THIS -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <p style="color:#E8E8E8;font-size:15px;line-height:1.75;margin:0;">
      We built <strong style="color:#00C2FF;">Robotomated</strong> because buying a robot shouldn't require a PhD or a sales pitch.
    </p>
    <p style="color:#bbb;font-size:15px;line-height:1.75;margin:14px 0 0;">
      We track <strong style="color:#fff;">${totalRobots} robots</strong> from 250+ manufacturers with independent, transparent scoring.
      No manufacturer pays us. No scores are influenced. Every recommendation is backed by verified specs and real deployment data.
    </p>
    <p style="color:#bbb;font-size:15px;line-height:1.75;margin:14px 0 0;">
      This is your weekly digest of what matters in robotics &mdash; the signal without the noise.
    </p>
  </div>

  <!-- TOP 3 ROBOTS -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#00C2FF;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;font-weight:700;">This Week's Top 3 Robots</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${robotRows}
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://robotomated.com/explore" style="display:inline-block;background:#00C2FF;color:#0A0F1E;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Explore ${totalRobots} Robots &rarr;</a>
    </div>
  </div>

  <!-- MARKET PULSE -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#7B2FFF;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">Market Pulse</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.75;margin:0;">
      ${marketInsight}
    </p>
  </div>

  <!-- FUNDING WATCH -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#00E5A0;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">Funding Watch</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.75;margin:0;">
      ${fundingHighlight}
    </p>
    <p style="color:#888;font-size:13px;margin:12px 0 0;">
      <a href="https://robotomated.com/market/funding" style="color:#00C2FF;text-decoration:none;">See all funding rounds &rarr;</a>
    </p>
  </div>

  <!-- NEW ON ROBOTOMATED -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#FF6B35;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">New on Robotomated</h2>
    <ul style="color:#bbb;font-size:15px;line-height:1.85;margin:0;padding-left:20px;">
      <li><strong style="color:#fff;">9 Industry Landing Pages</strong> &mdash; deep guides for warehouse, medical, manufacturing, agriculture, construction, delivery, security, hospitality, and eldercare. <a href="https://robotomated.com/industries" style="color:#00C2FF;text-decoration:none;">Explore &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">TCO Calculator</strong> &mdash; 5-year total cost of ownership with maintenance, training, and integration costs. <a href="https://robotomated.com/tools/tco-calculator" style="color:#00C2FF;text-decoration:none;">Try it &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">Fleet Management</strong> &mdash; track your robot assets, maintenance schedules, and service logs. <a href="https://robotomated.com/fleet" style="color:#00C2FF;text-decoration:none;">View demo &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">Investment Tracker</strong> &mdash; every VC/PE deal in robotics with investor profiles. <a href="https://robotomated.com/market/funding" style="color:#00C2FF;text-decoration:none;">Browse deals &rarr;</a></li>
    </ul>
  </div>

  <!-- FOOTER -->
  <div style="text-align:center;padding:24px 0;border-top:1px solid #1E2642;">
    <p style="color:#555;font-size:12px;margin:0 0 8px;">
      Robotomated &mdash; Independent robotics intelligence
    </p>
    <p style="margin:0 0 12px;">
      <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;font-size:13px;">robotomated.com</a>
    </p>
    <p style="margin:0;">
      <a href="https://robotomated.com/unsubscribe?${unsubParam}" style="color:#666;text-decoration:underline;font-size:11px;">Unsubscribe</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

// ── Main ──
async function main() {
  console.log("=== The Robotomated Brief #001 ===\n");

  // 1. Top 3 robots by RoboScore
  const { data: topRobots, error: robotsErr } = await sb
    .from("robots")
    .select("name, robo_score, price_current, manufacturers(name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(3);

  if (robotsErr) { console.error("Error fetching robots:", robotsErr.message); process.exit(1); }

  const top3 = (topRobots || []).map((r: Record<string, unknown>) => {
    const mfr = r.manufacturers as { name: string } | null;
    return {
      name: r.name as string,
      mfr: mfr?.name || "Unknown",
      score: r.robo_score as number,
      price: r.price_current as number | null,
    };
  });

  console.log("Top 3 robots:");
  top3.forEach((r, i) => console.log(`  ${i + 1}. ${r.name} (${r.mfr}) — ${r.score}/100 — ${formatUsd(r.price)}`));

  // 2. Total robot count
  const { count: totalRobots } = await sb
    .from("robots")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  console.log(`\nTotal active robots: ${totalRobots}`);

  // 3. Market insight from market_reports
  let marketInsight = "The global robotics market is projected to reach <strong style=\"color:#fff;\">$75.3B by 2030</strong> at 14.3% CAGR, with collaborative robots growing fastest at <strong style=\"color:#00E5A0;\">32.5% CAGR</strong>. Asia-Pacific leads with 42% of global revenue.";

  const { data: reports } = await sb
    .from("market_reports")
    .select("title, market_size_usd_billions, cagr_percent, key_findings")
    .not("market_size_usd_billions", "is", null)
    .order("market_size_usd_billions", { ascending: false })
    .limit(1);

  if (reports && reports.length > 0) {
    const r = reports[0] as Record<string, unknown>;
    const findings = (r.key_findings as string[]) || [];
    const topFinding = findings[0] || "";
    marketInsight = `<strong style="color:#fff;">${r.title}</strong>: The market is valued at <strong style="color:#00E5A0;">$${r.market_size_usd_billions}B</strong> with a projected CAGR of <strong style="color:#fff;">${r.cagr_percent}%</strong>. ${topFinding}`;
  }

  console.log("\nMarket insight loaded from DB");

  // 4. Funding highlight from funding_rounds
  let fundingHighlight = "<strong style=\"color:#fff;\">Figure AI</strong> raised <strong style=\"color:#00C2FF;\">$675M Series B</strong> led by Jeff Bezos, Microsoft, and NVIDIA &mdash; the largest humanoid robotics round ever. The round values Figure at $2.6B pre-money.";

  const { data: rounds } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors")
    .order("date", { ascending: false })
    .limit(1);

  if (rounds && rounds.length > 0) {
    const f = rounds[0] as Record<string, unknown>;
    fundingHighlight = `<strong style="color:#fff;">${f.company}</strong> raised <strong style="color:#00C2FF;">${f.amount} ${f.round || ""}</strong>${f.investors ? ` led by ${f.investors}` : ""}. Track all robotics funding rounds on our new investment tracker.`;
  }

  console.log("Funding highlight loaded from DB");

  // 5. Get ALL subscribers (confirmed and unconfirmed — send to all as requested)
  let subscribers: { email: string; unsubscribe_token?: string }[] = [];

  const { data: subs, error: subsErr } = await sb
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token");

  if (subsErr) {
    // Try without unsubscribe_token
    const { data: subs2, error: subsErr2 } = await sb
      .from("newsletter_subscribers")
      .select("email");

    if (subsErr2) { console.error("Error fetching subscribers:", subsErr2.message); process.exit(1); }
    subscribers = subs2 || [];
  } else {
    subscribers = subs || [];
  }

  if (subscribers.length === 0) {
    console.log("\nNo subscribers found in newsletter_subscribers table. Nothing to send.");
    console.log("Subscribers can sign up at robotomated.com/newsletter");
    process.exit(0);
  }

  console.log(`\nSubscribers found: ${subscribers.length}`);

  // 6. Send to each subscriber
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubParam = sub.unsubscribe_token
      ? `token=${sub.unsubscribe_token}`
      : `email=${encodeURIComponent(sub.email)}`;

    const html = buildEmailHtml({
      topRobots: top3,
      totalRobots: totalRobots || 464,
      marketInsight,
      fundingHighlight,
      unsubParam,
    });

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAIL: ${sub.email} — ${msg}`);
      failed++;
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`Sent: ${sent} | Failed: ${failed} | Total subscribers: ${subscribers.length}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
