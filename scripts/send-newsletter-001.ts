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

const SUBJECT = "The Robotomated Brief #001 — The State of Robotics Buying Intelligence";
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
  topRobots: { name: string; mfr: string; score: number; price: number | null }[];
  totalRobots: number;
  marketInsight: string;
  fundingHighlight: string;
  unsubParam: string;
}): string {
  const { topRobots, totalRobots, marketInsight, fundingHighlight, unsubParam } = opts;

  const F = 'Arial, Helvetica, sans-serif';

  const sectionLabel = (text: string) => `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="border-bottom:1px solid #E5E5E5;padding-bottom:0;vertical-align:middle;width:40px;"><div style="height:1px;"></div></td>
        <td style="padding:0 12px 0 12px;vertical-align:middle;white-space:nowrap;">
          <span style="font-family:${F};font-size:10px;letter-spacing:2px;color:#999999;text-transform:uppercase;font-weight:700;">${text}</span>
        </td>
        <td style="border-bottom:1px solid #E5E5E5;padding-bottom:0;vertical-align:middle;"><div style="height:1px;"></div></td>
      </tr>
    </table>`;

  const robotRows = topRobots.map((r) => `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-bottom:1px solid #F0F0F0;">
      <tr>
        <td style="padding:20px 0;vertical-align:top;font-family:${F};">
          <div style="color:#1A1A1A;font-size:16px;font-weight:700;line-height:1.3;">${r.name}</div>
          <div style="color:#888888;font-size:13px;margin-top:3px;">${r.mfr}</div>
        </td>
        <td style="padding:20px 0;vertical-align:top;text-align:right;white-space:nowrap;font-family:${F};">
          <div style="color:#1A1A1A;font-size:20px;font-weight:700;line-height:1.2;">${r.score.toFixed(1)} <span style="color:#AAAAAA;font-size:13px;font-weight:400;">/ 100</span></div>
          <div style="color:#888888;font-size:12px;margin-top:3px;font-family:${F};">${formatUsd(r.price)}</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0 0 20px;font-family:${F};">
          <div style="color:#666666;font-size:13px;font-style:italic;line-height:1.6;">${getWhyText(r.name)}</div>
          <div style="margin-top:10px;">
            <a href="https://robotomated.com/explore" style="color:#0EA5E9;text-decoration:none;font-size:13px;font-weight:600;font-family:${F};">View Full Analysis &rarr;</a>
          </div>
        </td>
      </tr>
    </table>`).join("");

  const issueDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>The Robotomated Brief #001</title>
</head>
<body style="margin:0;padding:0;background:#F2F2F2;font-family:${F};-webkit-font-smoothing:antialiased;">

<!-- OUTER WRAPPER -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F2F2F2;">
<tr><td align="center" style="padding:24px 16px;">

<!-- EMAIL BODY -->
<table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#FFFFFF;">

  <!-- 1. HEADER -->
  <tr>
    <td style="background:#1A1A1A;padding:36px 32px 28px;text-align:center;">
      <div style="color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:4px;font-family:${F};">ROBOTOMATED</div>
      <div style="color:#888888;font-size:11px;letter-spacing:3px;margin-top:6px;font-family:${F};">THE BRIEF</div>
      <div style="color:#666666;font-size:11px;margin-top:14px;font-family:${F};">Issue #001 &middot; ${issueDate} &middot; Weekly Robotics Intelligence</div>
    </td>
  </tr>

  <!-- 2. HERO BANNER -->
  <tr>
    <td style="background:#FFFFFF;padding:32px 32px 28px;border-bottom:1px solid #E5E5E5;">
      <div style="color:#1A1A1A;font-size:24px;font-weight:700;line-height:1.35;font-family:${F};margin:0 0 16px;">The State of Robotics Buying Intelligence in 2026</div>
      <div style="color:#444444;font-size:15px;line-height:1.7;font-family:${F};">Operations teams evaluating automation face a $103B market with no independent guide. Manufacturer claims are everywhere. Verified deployment data is nowhere. This week we break down what the data actually shows &mdash; across ${totalRobots} robots scored on 8 dimensions, with zero manufacturer influence.</div>
    </td>
  </tr>

  <!-- 3. THE NUMBERS -->
  <tr>
    <td style="padding:32px 32px 0;">
      ${sectionLabel("THE NUMBERS")}
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F8F8;border:1px solid #E5E5E5;">
        <tr>
          <td width="33%" style="text-align:center;padding:24px 8px;border-right:1px solid #E5E5E5;">
            <div style="color:#1A1A1A;font-size:28px;font-weight:800;font-family:${F};line-height:1;">${totalRobots}</div>
            <div style="color:#888888;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${F};">ROBOTS TRACKED</div>
          </td>
          <td width="33%" style="text-align:center;padding:24px 8px;border-right:1px solid #E5E5E5;">
            <div style="color:#1A1A1A;font-size:28px;font-weight:800;font-family:${F};line-height:1;">$103B</div>
            <div style="color:#888888;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${F};">TOTAL MARKET</div>
          </td>
          <td width="34%" style="text-align:center;padding:24px 8px;">
            <div style="color:#1A1A1A;font-size:28px;font-weight:800;font-family:${F};line-height:1;">18 mo</div>
            <div style="color:#888888;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;margin-top:8px;font-family:${F};">AVG ROI PAYBACK</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 4. TOP ROBOTS THIS WEEK -->
  <tr>
    <td style="padding:16px 32px 0;">
      ${sectionLabel("TOP ROBOTS THIS WEEK")}
    </td>
  </tr>
  <tr>
    <td style="padding:8px 32px 24px;">
      ${robotRows}
    </td>
  </tr>

  <!-- 5. MARKET PULSE -->
  <tr>
    <td style="padding:24px 32px 0;">
      ${sectionLabel("MARKET PULSE")}
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAFAFA;border:1px solid #EEEEEE;">
        <tr>
          <td style="padding:24px;font-family:${F};">
            <div style="color:#555555;font-size:15px;line-height:1.7;">${marketInsight}</div>
            <div style="color:#AAAAAA;font-size:11px;margin-top:12px;font-family:${F};">Source: IFR World Robotics Report, Robotomated Market Intelligence</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 6. FUNDING WATCH -->
  <tr>
    <td style="padding:0 32px 0;">
      ${sectionLabel("FUNDING WATCH")}
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#FAFAFA;border:1px solid #EEEEEE;">
        <tr>
          <td style="padding:24px;font-family:${F};">
            <div style="color:#555555;font-size:15px;line-height:1.7;">${fundingHighlight}</div>
            <div style="margin-top:14px;">
              <a href="https://robotomated.com/market/funding" style="color:#0EA5E9;text-decoration:none;font-size:13px;font-weight:600;font-family:${F};">See all funding rounds &rarr;</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 7. ANALYST TAKE -->
  <tr>
    <td style="padding:0 32px 0;">
      ${sectionLabel("ANALYST TAKE")}
    </td>
  </tr>
  <tr>
    <td style="padding:16px 32px 32px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#F8F8F8;border-left:3px solid #1A1A1A;">
        <tr>
          <td style="padding:24px;font-family:${F};">
            <div style="color:#444444;font-size:15px;line-height:1.7;">We score ${totalRobots} robots across 8 weighted dimensions. No manufacturer has ever paid to influence a score. That matters more than it sounds, because in a $103B market, almost every "review" you find online is funded by the company being reviewed.</div>
            <div style="color:#444444;font-size:15px;line-height:1.7;margin-top:14px;">The operations teams making the best buying decisions in 2026 are the ones using independent data. When a cobot vendor claims 7-month payback, our data says the median is 11 months &mdash; still excellent, but the gap between claim and reality is where bad purchases happen.</div>
            <div style="color:#444444;font-size:15px;line-height:1.7;margin-top:14px;">That gap is exactly what we exist to close.</div>
            <div style="color:#999999;font-size:13px;font-style:italic;margin-top:18px;font-family:${F};">&mdash; Robotomated Research</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- 8. CTA -->
  <tr>
    <td style="text-align:center;padding:16px 32px 40px;">
      <table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center">
        <tr>
          <td style="background:#1A1A1A;padding:14px 28px;border-radius:3px;">
            <a href="https://robotomated.com/explore" style="color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1px;font-family:${F};display:block;">EXPLORE THIS WEEK'S TOP ROBOTS</a>
          </td>
        </tr>
      </table>
      <div style="color:#999999;font-size:12px;margin-top:20px;font-family:${F};">Forward this to a colleague evaluating automation &mdash; they'll thank you.</div>
    </td>
  </tr>

</table>
<!-- END EMAIL BODY -->

<!-- 9. FOOTER -->
<table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">
  <tr>
    <td style="text-align:center;padding:28px 32px;font-family:${F};">
      <div style="color:#AAAAAA;font-size:11px;">
        &copy; 2026 Robotomated &middot; <a href="https://robotomated.com" style="color:#AAAAAA;text-decoration:underline;">robotomated.com</a>
      </div>
      <div style="color:#AAAAAA;font-size:11px;margin-top:8px;">
        <a href="https://robotomated.com/unsubscribe?${unsubParam}" style="color:#AAAAAA;text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp;
        <a href="https://robotomated.com" style="color:#AAAAAA;text-decoration:underline;">View in browser</a>
        &nbsp;&middot;&nbsp;
        <a href="https://robotomated.com/privacy" style="color:#AAAAAA;text-decoration:underline;">Privacy Policy</a>
      </div>
    </td>
  </tr>
</table>

</td></tr>
</table>
<!-- END OUTER WRAPPER -->

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
  let marketInsight = "<strong style=\"color:#1A1A1A;\">Global robotics market:</strong> Projected to reach $75.3B by 2030 at 14.3% CAGR. Collaborative robots growing fastest at 32.5% CAGR. Asia-Pacific leads with 42% of global revenue.";

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
    marketInsight = `<strong style="color:#1A1A1A;">${r.title}:</strong> The market is valued at <strong style="color:#1A1A1A;">$${r.market_size_usd_billions}B</strong> with a projected CAGR of <strong style="color:#1A1A1A;">${r.cagr_percent}%</strong>. ${topFinding}`;
  }

  console.log("\nMarket insight loaded from DB");

  // 4. Funding highlight from funding_rounds
  let fundingHighlight = "<strong style=\"color:#1A1A1A;\">Figure AI</strong> raised <strong style=\"color:#0EA5E9;\">$675M Series B</strong> led by Jeff Bezos, Microsoft, and NVIDIA &mdash; the largest humanoid robotics round ever. The round values Figure at $2.6B pre-money.";

  const { data: rounds } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors")
    .order("date", { ascending: false })
    .limit(1);

  if (rounds && rounds.length > 0) {
    const f = rounds[0] as Record<string, unknown>;
    fundingHighlight = `<strong style="color:#1A1A1A;">${f.company}</strong> raised <strong style="color:#0EA5E9;">${f.amount} ${f.round || ""}</strong>${f.investors ? ` led by ${f.investors}` : ""}. Track all robotics funding rounds on our investment tracker.`;
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
