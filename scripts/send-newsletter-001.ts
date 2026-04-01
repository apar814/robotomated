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
const FROM = "Robotomated <onboarding@resend.dev>";

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
  topRobots: { name: string; mfr: string; score: number; price: number | null; slug?: string }[];
  totalRobots: number;
  marketInsight: string;
  fundingHighlight: string;
  unsubParam: string;
}): string {
  const { topRobots, totalRobots, marketInsight, fundingHighlight, unsubParam } = opts;

  const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const BG = "#0A0A0A";
  const CARD = "#111111";
  const BORDER = "#222222";
  const DIVIDER = "#1E1E1E";
  const BODY_TEXT = "#CCCCCC";
  const BOLD_TEXT = "#FFFFFF";
  const LINK = "#0EA5E9";
  const LABEL = "#666666";
  const GHOST = "#555555";

  const sectionLabel = (text: string) =>
    `<div style="font-size:11px;letter-spacing:2px;color:${LABEL};text-transform:uppercase;font-weight:700;font-family:${FONT};margin-bottom:20px;">${text}</div>`;

  const sectionDivider = `<div style="border-top:1px solid ${DIVIDER};margin:48px 0;"></div>`;

  const robotCards = topRobots
    .map(
      (r) => `
      <div style="background:${CARD};border:1px solid ${BORDER};border-radius:4px;padding:24px 28px;margin-bottom:12px;">
        <table style="width:100%;border-collapse:collapse;" role="presentation">
          <tr>
            <td style="vertical-align:top;">
              <div style="color:${BOLD_TEXT};font-size:17px;font-weight:700;font-family:${FONT};line-height:1.3;">${r.name}</div>
              <div style="color:${GHOST};font-size:13px;font-family:${FONT};margin-top:4px;">${r.mfr}</div>
            </td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap;">
              <div style="color:${LINK};font-size:20px;font-weight:700;font-family:monospace;line-height:1.2;">${r.score.toFixed(1)}</div>
              <div style="color:${GHOST};font-size:11px;font-family:${FONT};">/ 100</div>
            </td>
          </tr>
        </table>
        <div style="color:${LABEL};font-size:13px;font-family:monospace;margin-top:12px;">${formatUsd(r.price)}</div>
        <div style="color:#999;font-size:14px;font-style:italic;font-family:${FONT};margin-top:10px;line-height:1.6;">${getWhyText(r.name)}</div>
        <div style="margin-top:14px;">
          <a href="https://robotomated.com/explore" style="color:${LINK};text-decoration:none;font-size:13px;font-weight:600;font-family:${FONT};">View Full Analysis &rarr;</a>
        </div>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>The Robotomated Brief #001</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};-webkit-font-smoothing:antialiased;">
<div style="max-width:600px;margin:0 auto;padding:0 16px;">

  <!-- 1. HEADER -->
  <div style="text-align:center;padding:40px 0 28px;border-bottom:1px solid ${BORDER};">
    <div style="color:${BOLD_TEXT};font-size:22px;font-weight:800;letter-spacing:6px;font-family:${FONT};">ROBOTOMATED</div>
    <div style="color:${GHOST};font-size:13px;letter-spacing:3px;margin-top:6px;font-family:${FONT};">THE BRIEF</div>
    <div style="color:#444;font-size:11px;margin-top:12px;font-family:${FONT};">Issue #001 &middot; Weekly Robotics Intelligence</div>
  </div>

  <!-- 2. HERO — THIS WEEK IN ROBOTICS -->
  <div style="background:#111111;border-radius:4px;padding:32px 28px;margin-top:32px;">
    ${sectionLabel("THIS WEEK IN ROBOTICS")}
    <p style="color:${BOLD_TEXT};font-size:22px;font-weight:700;line-height:1.4;margin:0 0 16px;font-family:${FONT};">
      We now track ${totalRobots} robots from 300+ manufacturers. The robotics market hit $103B and it is accelerating.
    </p>
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:0;font-family:${FONT};">
      This is your weekly signal. Independent scoring, verified specs, and real deployment data. No manufacturer pays us. No scores are influenced. Every recommendation earns its place.
    </p>
  </div>

  ${sectionDivider}

  <!-- 3. THE NUMBERS -->
  ${sectionLabel("THE NUMBERS")}
  <table style="width:100%;border-collapse:collapse;background:${CARD};border:1px solid ${BORDER};border-radius:4px;" role="presentation">
    <tr>
      <td style="width:33.33%;text-align:center;padding:28px 12px;border-right:1px solid ${BORDER};">
        <div style="color:${BOLD_TEXT};font-size:28px;font-weight:800;font-family:monospace;line-height:1;">${totalRobots}</div>
        <div style="color:${LABEL};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${FONT};">ROBOTS TRACKED</div>
      </td>
      <td style="width:33.33%;text-align:center;padding:28px 12px;border-right:1px solid ${BORDER};">
        <div style="color:${BOLD_TEXT};font-size:28px;font-weight:800;font-family:monospace;line-height:1;">$103B</div>
        <div style="color:${LABEL};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${FONT};">MARKET SIZE</div>
      </td>
      <td style="width:33.33%;text-align:center;padding:28px 12px;">
        <div style="color:${BOLD_TEXT};font-size:28px;font-weight:800;font-family:monospace;line-height:1;">+847%</div>
        <div style="color:${LABEL};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${FONT};">HUMANOID GROWTH</div>
      </td>
    </tr>
  </table>

  ${sectionDivider}

  <!-- 4. TOP ROBOTS THIS WEEK -->
  ${sectionLabel("TOP ROBOTS THIS WEEK")}
  ${robotCards}

  ${sectionDivider}

  <!-- 5. MARKET PULSE -->
  ${sectionLabel("MARKET PULSE")}
  <div style="background:${CARD};border:1px solid ${BORDER};border-radius:4px;padding:28px;">
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:0;font-family:${FONT};">
      ${marketInsight}
    </p>
  </div>

  ${sectionDivider}

  <!-- 6. FUNDING WATCH -->
  ${sectionLabel("FUNDING WATCH")}
  <div style="background:${CARD};border:1px solid ${BORDER};border-radius:4px;padding:28px;">
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:0;font-family:${FONT};">
      ${fundingHighlight}
    </p>
    <p style="margin:16px 0 0;">
      <a href="https://robotomated.com/market/funding" style="color:${LINK};text-decoration:none;font-size:13px;font-weight:600;font-family:${FONT};">See all funding rounds &rarr;</a>
    </p>
  </div>

  ${sectionDivider}

  <!-- 7. FROM THE DESK -->
  ${sectionLabel("FROM THE DESK")}
  <div style="background:${CARD};border:1px solid ${BORDER};border-radius:4px;padding:28px;">
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:0;font-family:${FONT};">
      We started Robotomated because the gap between "I need a robot" and "I bought the right robot" was absurdly wide. Manufacturers sell you features. We give you data. That is the whole thesis.
    </p>
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:16px 0 0;font-family:${FONT};">
      This week we crossed ${totalRobots} robots in the database. Every one of them scored independently across 8 dimensions. No manufacturer has ever paid to influence a score, and none ever will.
    </p>
    <p style="color:${BODY_TEXT};font-size:15px;line-height:1.7;margin:16px 0 0;font-family:${FONT};">
      If you are evaluating automation for your operation, we built this for you. Browse the data. Run the calculators. Forward this to whoever signs the PO.
    </p>
    <p style="color:${GHOST};font-size:14px;font-style:italic;margin:20px 0 0;font-family:${FONT};">
      &mdash; The Robotomated Team
    </p>
  </div>

  ${sectionDivider}

  <!-- 8. CTA -->
  <div style="text-align:center;padding:16px 0 32px;">
    <a href="https://robotomated.com/explore" style="display:inline-block;border:2px solid ${LINK};background:transparent;color:${BOLD_TEXT};padding:16px 40px;border-radius:4px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:1px;font-family:${FONT};">EXPLORE THIS WEEK'S TOP ROBOTS</a>
    <p style="color:${GHOST};font-size:13px;margin:20px 0 0;font-family:${FONT};">
      Forward this to a colleague evaluating automation.
    </p>
  </div>

  <!-- 9. FOOTER -->
  <div style="text-align:center;padding:32px 0;border-top:1px solid ${DIVIDER};">
    <p style="color:#444;font-size:11px;margin:0;font-family:${FONT};">
      <a href="https://robotomated.com/unsubscribe?${unsubParam}" style="color:${GHOST};text-decoration:underline;">Unsubscribe</a>
      &nbsp;&nbsp;&middot;&nbsp;&nbsp;
      <a href="https://robotomated.com" style="color:${GHOST};text-decoration:underline;">View in browser</a>
      &nbsp;&nbsp;&middot;&nbsp;&nbsp;
      <a href="https://robotomated.com" style="color:${GHOST};text-decoration:underline;">robotomated.com</a>
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
