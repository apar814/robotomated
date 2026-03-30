/**
 * Send Newsletter Issue #002 — The Robotomated Brief
 * Theme: Humanoid Robots Are Coming to Your Warehouse
 * Run: npx tsx scripts/send-newsletter-002.ts
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

const SUBJECT = "The Robotomated Brief #002 — Humanoid Robots Are Coming to Your Warehouse";
const FROM = "Robotomated <digest@robotomated.com>";

function formatUsd(n: number | null): string {
  if (n == null) return "Request quote";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

// ── Build email HTML ──
function buildEmailHtml(opts: {
  humanoidRobots: { name: string; mfr: string; score: number; price: number | null; desc: string }[];
  totalRobots: number;
  marketInsight: string;
  fundingHighlight: string;
  unsubParam: string;
}): string {
  const { humanoidRobots, totalRobots, marketInsight, fundingHighlight, unsubParam } = opts;

  const robotRows = humanoidRobots
    .map(
      (r, i) => `
      <tr>
        <td style="padding:14px 16px;border-bottom:1px solid #1E2642;color:#7B2FFF;font-weight:700;font-size:20px;width:36px;vertical-align:top;">#${i + 1}</td>
        <td style="padding:14px 16px;border-bottom:1px solid #1E2642;">
          <div style="color:#fff;font-weight:700;font-size:16px;">${r.name}</div>
          <div style="color:#888;font-size:13px;margin-top:2px;">${r.mfr} &middot; RoboScore <span style="color:#00E5A0;font-weight:700;">${r.score}/100</span> &middot; ${formatUsd(r.price)}</div>
          <div style="color:#aaa;font-size:13px;margin-top:6px;line-height:1.6;">${r.desc}</div>
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
    <p style="color:#555;font-size:13px;margin:8px 0 0;">Issue #002 &middot; Weekly Robotics Intelligence</p>
  </div>

  <!-- LEAD -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#7B2FFF;font-size:22px;margin:0 0 14px;font-weight:700;">Humanoid Robots Are Coming to Your Warehouse</h2>
    <p style="color:#E8E8E8;font-size:15px;line-height:1.75;margin:0;">
      The humanoid robot market is exploding. <strong style="color:#fff;">Figure</strong>, <strong style="color:#fff;">Agility Robotics</strong>,
      <strong style="color:#fff;">1X Technologies</strong>, and <strong style="color:#fff;">Apptronik</strong> are all shipping commercial units in 2025-2026.
      Amazon is testing Digit in fulfillment centers. BMW has Figure 02 units on its production line.
    </p>
    <p style="color:#bbb;font-size:15px;line-height:1.75;margin:14px 0 0;">
      The question isn't <em>if</em> humanoid robots will enter your operations &mdash; it's <em>when</em>.
      Here's what the data shows.
    </p>
  </div>

  <!-- TOP 3 HUMANOID ROBOTS -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#7B2FFF;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;font-weight:700;">Top 3 Humanoid Robots by RoboScore</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${robotRows}
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://robotomated.com/explore/humanoid" style="display:inline-block;background:#7B2FFF;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Explore Humanoid Robots &rarr;</a>
    </div>
  </div>

  <!-- MARKET PULSE -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#7B2FFF;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">Market Pulse: Humanoid Segment</h2>
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

  <!-- FEATURE: HYPE VS REALITY -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#00C2FF;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">Reality Check: What Humanoids Can Actually Do Today</h2>
    <table style="width:100%;border-collapse:collapse;margin-top:8px;">
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#00E5A0;font-weight:700;font-size:13px;width:40%;">Works Today</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#888;font-size:13px;">Box moving, tote transfer, material handling in structured warehouse environments</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#00E5A0;font-weight:700;font-size:13px;">Works Today</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#888;font-size:13px;">Quality inspection walkthroughs with camera/sensor payloads</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#00E5A0;font-weight:700;font-size:13px;">Works Today</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#888;font-size:13px;">Simple pick-and-place in controlled environments (pilot deployments)</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#FF6B35;font-weight:700;font-size:13px;">Coming 2026-2027</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#888;font-size:13px;">Multi-step assembly tasks, complex manipulation, unstructured navigation</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#FF6B35;font-weight:700;font-size:13px;">Coming 2026-2027</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1E2642;color:#888;font-size:13px;">Fleet-scale deployment (100+ units per site) with centralized orchestration</td>
      </tr>
      <tr>
        <td style="padding:10px 12px;color:#666;font-weight:700;font-size:13px;">Still Years Away</td>
        <td style="padding:10px 12px;color:#888;font-size:13px;">General-purpose household tasks, outdoor unstructured work, full human replacement</td>
      </tr>
    </table>
  </div>

  <!-- NEW ON ROBOTOMATED -->
  <div style="background:#141A2E;border-radius:12px;padding:28px;margin-bottom:20px;">
    <h2 style="color:#FF6B35;font-size:13px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;font-weight:700;">New on Robotomated</h2>
    <ul style="color:#bbb;font-size:15px;line-height:1.85;margin:0;padding-left:20px;">
      <li><strong style="color:#fff;">Video Embeds</strong> &mdash; ${totalRobots > 45 ? "54" : "45"} robots now include manufacturer demo videos directly on their profile pages. <a href="https://robotomated.com/explore" style="color:#00C2FF;text-decoration:none;">Watch &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">Capability Radar</strong> &mdash; interactive RoboScore visualization on the homepage shows how different robot categories compare across all 8 dimensions. <a href="https://robotomated.com" style="color:#00C2FF;text-decoration:none;">See it &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">Careers Page</strong> &mdash; we launched our workforce development section. Training waitlists for Robot Technician, Drone Pilot, Fleet Manager, and more. <a href="https://robotomated.com/careers" style="color:#00C2FF;text-decoration:none;">Join &rarr;</a></li>
      <li style="margin-top:8px;"><strong style="color:#fff;">Database Expansion</strong> &mdash; now tracking <strong style="color:#00E5A0;">${totalRobots}+ robots</strong> with video demos, buyer intelligence, and comparison tools.</li>
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

// ── Humanoid robot descriptions for email ──
const HUMANOID_WHYS: Record<string, string> = {
  "Boston Dynamics Atlas (Electric)": "All-electric redesign. Range of motion exceeds human flexibility. The benchmark for humanoid agility and manipulation.",
  "Figure 02": "BMW production line pilot. $675M backing from Microsoft, NVIDIA, OpenAI. Multi-modal AI reasoning for complex tasks.",
  "Agility Digit": "First humanoid in Amazon fulfillment. Purpose-built for tote handling. RoboFab factory targeting 10K units/year.",
  "Agility Digit 5": "Next-gen Digit with improved dexterity and faster cycle times. Commercial fleet deployments in 2025.",
  "1X NEO": "Norwegian humanoid designed for household and light logistics. Soft robotics approach for safe human interaction.",
  "Apptronik Apollo": "Mercedes-Benz manufacturing pilot. 55 lb payload. Built for industrial environments from day one.",
  "Tesla Optimus": "Tesla's warehouse humanoid. Targeting sub-$25K price point. Leveraging FSD neural net for manipulation tasks.",
  "Unitree H1": "Chinese humanoid at fraction of Western pricing. 47 DoF. Already shipping to research institutions globally.",
  "Unitree G1": "Compact humanoid under $20K. Fastest bipedal running speed (3.3 m/s). Mass-market positioning.",
  "Sanctuary AI Phoenix": "AI-first humanoid with Carbon AI system. Focus on general-purpose cognition over raw athleticism.",
};

function getHumanoidWhy(name: string): string {
  return HUMANOID_WHYS[name] || "High-scoring humanoid robot in our independent RoboScore evaluation.";
}

// ── Main ──
async function main() {
  console.log("=== The Robotomated Brief #002 ===\n");

  // 1. Top 3 humanoid robots by RoboScore
  // First find humanoid category IDs
  const { data: humanoidCats } = await sb
    .from("robot_categories")
    .select("id")
    .in("slug", ["humanoid", "humanoids"]);

  let top3: { name: string; mfr: string; score: number; price: number | null; desc: string }[] = [];

  if (humanoidCats && humanoidCats.length > 0) {
    const catIds = humanoidCats.map(c => c.id);
    const { data: topRobots } = await sb
      .from("robots")
      .select("name, robo_score, price_current, manufacturers(name)")
      .in("category_id", catIds)
      .eq("status", "active")
      .not("robo_score", "is", null)
      .order("robo_score", { ascending: false })
      .limit(3);

    top3 = (topRobots || []).map((r: Record<string, unknown>) => {
      const mfr = r.manufacturers as { name: string } | null;
      const name = r.name as string;
      return {
        name,
        mfr: mfr?.name || "Unknown",
        score: r.robo_score as number,
        price: r.price_current as number | null,
        desc: getHumanoidWhy(name),
      };
    });
  }

  // Fallback: search by name if no humanoid category
  if (top3.length < 3) {
    const { data: fallback } = await sb
      .from("robots")
      .select("name, robo_score, price_current, manufacturers(name)")
      .eq("status", "active")
      .not("robo_score", "is", null)
      .or("name.ilike.%atlas%,name.ilike.%figure%,name.ilike.%digit%,name.ilike.%humanoid%,name.ilike.%optimus%,name.ilike.%neo%,name.ilike.%apollo%")
      .order("robo_score", { ascending: false })
      .limit(3);

    if (fallback && fallback.length > top3.length) {
      top3 = fallback.map((r: Record<string, unknown>) => {
        const mfr = r.manufacturers as { name: string } | null;
        const name = r.name as string;
        return {
          name,
          mfr: mfr?.name || "Unknown",
          score: r.robo_score as number,
          price: r.price_current as number | null,
          desc: getHumanoidWhy(name),
        };
      });
    }
  }

  console.log("Top 3 humanoid robots:");
  top3.forEach((r, i) => console.log(`  ${i + 1}. ${r.name} (${r.mfr}) -- ${r.score}/100 -- ${formatUsd(r.price)}`));

  // 2. Total robot count
  const { count: totalRobots } = await sb
    .from("robots")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  console.log(`\nTotal active robots: ${totalRobots}`);

  // 3. Market insight — humanoid segment
  let marketInsight = "The humanoid robot market is projected to reach <strong style=\"color:#fff;\">$38B by 2035</strong> at a <strong style=\"color:#00E5A0;\">55% CAGR</strong> from 2025. Goldman Sachs estimates 1.4M humanoid robot shipments annually by 2035. The warehouse/logistics segment leads adoption at 40% of projected deployments, followed by manufacturing at 30%.";

  const { data: reports } = await sb
    .from("market_reports")
    .select("title, market_size_usd_billions, cagr_percent, key_findings")
    .ilike("title", "%humanoid%")
    .limit(1);

  if (reports && reports.length > 0) {
    const r = reports[0] as Record<string, unknown>;
    const findings = (r.key_findings as string[]) || [];
    marketInsight = `<strong style="color:#fff;">${r.title}</strong>: Market valued at <strong style="color:#00E5A0;">$${r.market_size_usd_billions}B</strong> with <strong style="color:#fff;">${r.cagr_percent}% CAGR</strong>. ${findings[0] || ""} ${findings[1] || ""}`;
  }

  console.log("Market insight loaded");

  // 4. Latest funding round
  let fundingHighlight = "<strong style=\"color:#fff;\">Figure AI</strong> raised <strong style=\"color:#00C2FF;\">$675M Series B</strong> (Microsoft, NVIDIA, OpenAI, Jeff Bezos) at a $2.6B valuation &mdash; the largest humanoid robotics round to date. <strong style=\"color:#fff;\">1X Technologies</strong> closed $100M Series B for NEO humanoid production. <strong style=\"color:#fff;\">Apptronik</strong> raised $75M to scale Apollo manufacturing.";

  const { data: rounds } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors")
    .order("date", { ascending: false })
    .limit(1);

  if (rounds && rounds.length > 0) {
    const f = rounds[0] as Record<string, unknown>;
    fundingHighlight = `Latest: <strong style="color:#fff;">${f.company}</strong> raised <strong style="color:#00C2FF;">${f.amount} ${f.round || ""}</strong>${f.investors ? ` led by ${f.investors}` : ""}. The humanoid robot sector has attracted over $3B in venture capital in the past 18 months alone.`;
  }

  console.log("Funding highlight loaded");

  // 5. Get subscribers
  let subscribers: { email: string; unsubscribe_token?: string }[] = [];

  const { data: subs, error: subsErr } = await sb
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token");

  if (subsErr) {
    const { data: subs2, error: subsErr2 } = await sb
      .from("newsletter_subscribers")
      .select("email");

    if (subsErr2) { console.error("Error fetching subscribers:", subsErr2.message); process.exit(1); }
    subscribers = subs2 || [];
  } else {
    subscribers = subs || [];
  }

  if (subscribers.length === 0) {
    console.log("\nNo subscribers found. Nothing to send.");
    process.exit(0);
  }

  console.log(`\nSubscribers found: ${subscribers.length}`);

  // 6. Send
  let sent = 0;
  let failed = 0;

  for (const sub of subscribers) {
    const unsubParam = sub.unsubscribe_token
      ? `token=${sub.unsubscribe_token}`
      : `email=${encodeURIComponent(sub.email)}`;

    const html = buildEmailHtml({
      humanoidRobots: top3,
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
        console.error(`  FAIL: ${sub.email} -- ${error.message}`);
        failed++;
      } else {
        console.log(`  SENT: ${sub.email}`);
        sent++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  FAIL: ${sub.email} -- ${msg}`);
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
