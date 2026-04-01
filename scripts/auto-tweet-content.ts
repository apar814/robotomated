/**
 * Auto-Tweet Content Generator
 * Queries DB for top robots, funding, and category leaders.
 * Outputs tweet-ready text to docs/tweets-[date].txt
 *
 * Run: npx tsx scripts/auto-tweet-content.ts
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

const INDUSTRY_TAGS: Record<string, string> = {
  warehouse: "#warehouse #logistics",
  manufacturing: "#manufacturing #industry40",
  medical: "#healthtech #medtech",
  consumer: "#smarthome #consumertech",
  construction: "#construction #contech",
  agricultural: "#agtech #farming",
  delivery: "#lastmile #logistics",
  drone: "#drones #UAV",
  security: "#security #surveillance",
  software: "#robotics #AI",
};

interface RobotRow {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  created_at: string;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
}

async function main() {
  const tweets: string[] = [];
  const today = new Date().toISOString().slice(0, 10);

  console.log("=== Auto-Tweet Content Generator ===\n");

  // 1. Newest robot added this week
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const { data: newest } = await sb
    .from("robots")
    .select("slug, name, robo_score, price_current, description_short, created_at, manufacturers(name), robot_categories(slug, name)")
    .eq("status", "active")
    .gte("created_at", weekAgo)
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<RobotRow[]>();

  if (newest?.length) {
    for (const r of newest) {
      const mfr = (r.manufacturers as { name: string } | null)?.name || "Unknown";
      const cat = (r.robot_categories as { slug: string; name: string } | null);
      const catSlug = cat?.slug || "all";
      const tags = INDUSTRY_TAGS[catSlug] || "#robotics";
      const score = r.robo_score ? `RoboScore ${r.robo_score}/100` : "RoboScore pending";
      const desc = r.description_short?.split(".")[0] || "Full specs and analysis available";

      tweets.push(
        `NEW: ${r.name} by ${mfr} — ${score}. ${desc}. ${fmtPrice(r.price_current)}.\n\nFull analysis: ${BASE}/explore/${catSlug}/${r.slug}\n\n#robotics #automation ${tags}`
      );
    }
    console.log(`  [NEW] ${newest.length} newest robots`);
  }

  // 2. Biggest funding round this month
  const monthAgo = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10);
  const { data: funding } = await sb
    .from("funding_rounds")
    .select("company, amount, round, investors, date")
    .gte("date", monthAgo)
    .order("date", { ascending: false })
    .limit(3);

  if (funding?.length) {
    for (const f of funding) {
      const r = f as Record<string, unknown>;
      tweets.push(
        `FUNDING: ${r.company} raised ${r.amount} ${r.round || ""}${r.investors ? ` (${r.investors})` : ""}.\n\nTrack every robotics deal: ${BASE}/market/funding\n\n#robotics #venturecapital #automation`
      );
    }
    console.log(`  [FUND] ${funding.length} funding rounds`);
  }

  // 3. Top robot per category
  const { data: categories } = await sb
    .from("robot_categories")
    .select("id, slug, name")
    .order("display_order");

  if (categories) {
    for (const cat of categories) {
      const { data: top } = await sb
        .from("robots")
        .select("slug, name, robo_score, price_current, description_short, manufacturers(name), robot_categories(slug, name)")
        .eq("category_id", cat.id)
        .eq("status", "active")
        .not("robo_score", "is", null)
        .order("robo_score", { ascending: false })
        .limit(1)
        .returns<RobotRow[]>();

      if (top?.[0]) {
        const r = top[0];
        const mfr = (r.manufacturers as { name: string } | null)?.name || "Unknown";
        const tags = INDUSTRY_TAGS[cat.slug] || "#robotics";
        const desc = r.description_short?.split(".")[0] || "";

        tweets.push(
          `#1 in ${cat.name}: ${r.name} by ${mfr} — RoboScore ${r.robo_score}/100. ${desc}. ${fmtPrice(r.price_current)}.\n\nCompare all ${cat.name.toLowerCase()} robots: ${BASE}/explore/${cat.slug}\n\n#robotics ${tags}`
        );
      }
    }
    console.log(`  [CAT] ${categories.length} category leaders`);
  }

  // 4. Overall top 3 robots (weekly spotlight)
  const { data: topOverall } = await sb
    .from("robots")
    .select("slug, name, robo_score, price_current, description_short, manufacturers(name), robot_categories(slug, name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(3)
    .returns<RobotRow[]>();

  if (topOverall?.length) {
    const names = topOverall.map((r, i) => {
      const mfr = (r.manufacturers as { name: string } | null)?.name || "";
      return `${i + 1}. ${r.name} (${mfr}) — ${r.robo_score}/100`;
    });
    tweets.push(
      `This week's top 3 robots by RoboScore:\n\n${names.join("\n")}\n\nIndependent scores. No manufacturer bias.\n${BASE}/explore\n\n#robotics #automation #industry40`
    );
    console.log(`  [TOP] Top 3 overall`);
  }

  // Write to file
  const outPath = path.join(process.cwd(), "docs", `tweets-${today}.txt`);
  const content = tweets.map((t, i) => `--- TWEET ${i + 1} ---\n${t}`).join("\n\n");

  fs.writeFileSync(outPath, content, "utf-8");
  console.log(`\n${tweets.length} tweets saved to docs/tweets-${today}.txt`);
}

main().catch(console.error);
