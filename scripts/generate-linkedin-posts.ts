/**
 * LinkedIn Post Generator
 * Produces 3 posts per week from DB data:
 *   Monday: Robot of the Week spotlight
 *   Wednesday: Market data insight
 *   Friday: Funding news
 *
 * Run: npx tsx scripts/generate-linkedin-posts.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE = "https://robotomated.com";

function fmtPrice(p: number | null): string {
  if (p == null) return "Contact for pricing";
  if (p >= 1_000_000) return `$${(p / 1_000_000).toFixed(1)}M`;
  return `$${p.toLocaleString("en-US")}`;
}

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const posts: string[] = [];

  console.log("=== LinkedIn Post Generator ===\n");

  // ── POST 1 (Monday): Robot of the Week ──
  const { data: topRobot } = await sb
    .from("robots")
    .select("slug, name, robo_score, price_current, description_short, manufacturers(name), robot_categories(slug, name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(10);

  if (topRobot?.length) {
    // Pick a random one from top 10 for variety
    const idx = Math.floor(Math.random() * Math.min(topRobot.length, 10));
    const r = topRobot[idx] as Record<string, unknown>;
    const mfr = (r.manufacturers as { name: string } | null)?.name || "Unknown";
    const cat = (r.robot_categories as { slug: string; name: string } | null);
    const catSlug = cat?.slug || "all";
    const desc = (r.description_short as string) || "";

    posts.push(`=== MONDAY: Robot of the Week ===

Robot of the Week: ${r.name}

${mfr} built something worth paying attention to.

${desc}

The data:
- RoboScore: ${r.robo_score}/100 (independently scored across 8 dimensions)
- Price: ${fmtPrice(r.price_current as number | null)}
- Category: ${cat?.name || "General"}

We score every robot on Performance, Reliability, Ease of Use, Intelligence, Value, Ecosystem, Safety, and Design. The methodology is public. No manufacturer has ever paid to influence a score.

If you are evaluating automation for ${cat?.name?.toLowerCase() || "your"} operations, start here:
${BASE}/explore/${catSlug}/${r.slug}

---

What robot are you evaluating right now? Drop it in the comments and I will pull the RoboScore data for you.

#robotics #automation #operations #${catSlug}`);

    console.log(`  [MON] Robot of the Week: ${r.name}`);
  }

  // ── POST 2 (Wednesday): Market Data Insight ──
  const { data: reports } = await sb
    .from("market_reports")
    .select("title, market_size_usd_billions, cagr_percent, key_findings, region")
    .not("market_size_usd_billions", "is", null)
    .order("market_size_usd_billions", { ascending: false })
    .limit(5);

  if (reports?.length) {
    const r = reports[0] as Record<string, unknown>;
    const findings = ((r.key_findings as string[]) || []).slice(0, 3);
    const findingsText = findings.map((f: string) => `- ${f}`).join("\n");

    posts.push(`=== WEDNESDAY: Market Intelligence ===

The robotics market is not slowing down.

${r.title}: $${r.market_size_usd_billions}B at ${r.cagr_percent}% CAGR.

What the data shows:
${findingsText || "- Growth accelerating across warehouse, manufacturing, and medical sectors"}

Operations teams making automation decisions in 2026 face a $103B market with almost no independent buying intelligence. Every "review" is funded by the company being reviewed. Every benchmark is a manufacturer claim.

We built Robotomated to fix that. ${(await sb.from("robots").select("id", { count: "exact", head: true }).eq("status", "active")).count || 975}+ robots. 8-dimension scoring. Zero manufacturer influence.

The full market data: ${BASE}/market

#robotics #automation #marketintelligence #operations`);

    console.log(`  [WED] Market Insight: ${r.title}`);
  }

  // ── POST 3 (Friday): Funding News ──
  const { data: rounds } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors, date")
    .order("date", { ascending: false })
    .limit(3);

  if (rounds?.length) {
    const latest = rounds[0] as Record<string, unknown>;
    const others = rounds.slice(1);

    let othersText = "";
    if (others.length > 0) {
      othersText = "\n\nAlso this month:\n" + others.map((o: Record<string, unknown>) =>
        `- ${o.company}: ${o.amount} ${o.round || ""}`
      ).join("\n");
    }

    posts.push(`=== FRIDAY: Funding Watch ===

Where the smart money is going in robotics:

${latest.company} just raised ${latest.amount} ${latest.round || ""}${latest.investors ? ` led by ${latest.investors}` : ""}.
${othersText}

The robotics funding landscape tells you where the industry is headed 2-3 years from now. We track every round, every investor, every valuation.

Full funding tracker: ${BASE}/market/funding

If you are in procurement or operations, the companies raising today are the vendors pitching you tomorrow. Know who they are before the sales call.

#robotics #venturecapital #automation #startups`);

    console.log(`  [FRI] Funding: ${latest.company}`);
  }

  // Write output
  const outPath = path.join(process.cwd(), "docs", `linkedin-posts-${today}.txt`);
  fs.writeFileSync(outPath, posts.join("\n\n\n"), "utf-8");
  console.log(`\n${posts.length} LinkedIn posts saved to docs/linkedin-posts-${today}.txt`);
}

main().catch(console.error);
