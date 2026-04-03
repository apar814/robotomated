/**
 * Robot Data Quality Audit
 * Scans all robots and scores data completeness.
 * Run: npx tsx scripts/audit-robot-data.ts
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RobotRow {
  id: string;
  slug: string;
  name: string;
  images: { url: string }[] | null;
  price_current: number | null;
  price_msrp: number | null;
  description_long: string | null;
  description_short: string | null;
  specs: Record<string, unknown> | null;
  youtube_url: string | null;
  affiliate_url: string | null;
  robo_score: number | null;
  manufacturer_id: string;
}

interface MfrRow {
  id: string;
  name: string;
  website: string | null;
}

function scoreRobot(r: RobotRow): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  // Has image: +20
  if (Array.isArray(r.images) && r.images.length > 0 && r.images[0]?.url) {
    score += 20;
  } else {
    issues.push("Missing image");
  }

  // Has price: +20
  if (r.price_current || r.price_msrp) {
    score += 20;
  } else {
    issues.push("Missing price");
  }

  // Has full description: +15
  if (r.description_long && r.description_long.length > 50) {
    score += 15;
  } else {
    issues.push("Missing/short description");
  }

  // Has specs: +15
  if (r.specs && Object.keys(r.specs).length > 0) {
    score += 15;
  } else {
    issues.push("Missing specs");
  }

  // Has YouTube video: +10
  if (r.youtube_url) {
    score += 10;
  } else {
    issues.push("Missing video");
  }

  // Has affiliate/manufacturer link: +10
  if (r.affiliate_url) {
    score += 10;
  } else {
    issues.push("Missing affiliate link");
  }

  // RoboScore calculated: +10
  if (r.robo_score && r.robo_score > 0) {
    score += 10;
  } else {
    issues.push("Missing RoboScore");
  }

  return { score, issues };
}

async function main() {
  console.log("Robot Data Quality Audit");
  console.log("========================\n");

  const { data: robots, error } = await supabase
    .from("robots")
    .select("id, slug, name, images, price_current, price_msrp, description_long, description_short, specs, youtube_url, affiliate_url, robo_score, manufacturer_id")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Failed to fetch robots:", error.message);
    process.exit(1);
  }

  const { data: mfrs } = await supabase
    .from("manufacturers")
    .select("id, name, website");

  const mfrMap = new Map<string, MfrRow>();
  mfrs?.forEach((m: MfrRow) => mfrMap.set(m.id, m));

  const results: { slug: string; name: string; manufacturer: string; score: number; issues: string[] }[] = [];

  let totalScore = 0;
  for (const robot of (robots as RobotRow[]) || []) {
    const { score, issues } = scoreRobot(robot);
    totalScore += score;
    const mfr = mfrMap.get(robot.manufacturer_id);
    results.push({
      slug: robot.slug,
      name: robot.name,
      manufacturer: mfr?.name || "Unknown",
      score,
      issues,
    });
  }

  results.sort((a, b) => a.score - b.score);

  const total = results.length;
  const avgScore = total > 0 ? Math.round(totalScore / total) : 0;
  const needsAttention = results.filter((r) => r.score < 60);
  const excellent = results.filter((r) => r.score >= 80);

  // Generate report
  let report = `# Robot Data Quality Report\n\n`;
  report += `Generated: ${new Date().toISOString().split("T")[0]}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total robots:** ${total}\n`;
  report += `- **Average quality score:** ${avgScore}/100\n`;
  report += `- **Excellent (80+):** ${excellent.length}\n`;
  report += `- **Needs attention (<60):** ${needsAttention.length}\n\n`;

  // Score distribution
  const dist = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
  results.forEach((r) => {
    if (r.score <= 20) dist["0-20"]++;
    else if (r.score <= 40) dist["21-40"]++;
    else if (r.score <= 60) dist["41-60"]++;
    else if (r.score <= 80) dist["61-80"]++;
    else dist["81-100"]++;
  });
  report += `## Score Distribution\n\n`;
  report += `| Range | Count |\n|-------|-------|\n`;
  Object.entries(dist).forEach(([range, count]) => {
    report += `| ${range} | ${count} |\n`;
  });

  report += `\n## Robots Needing Attention (Score < 60)\n\n`;
  report += `| Robot | Manufacturer | Score | Issues |\n|-------|-------------|-------|--------|\n`;
  needsAttention.forEach((r) => {
    report += `| ${r.name} | ${r.manufacturer} | ${r.score} | ${r.issues.join(", ")} |\n`;
  });

  fs.writeFileSync("docs/data-quality-report.md", report);
  console.log(`Report saved to docs/data-quality-report.md`);
  console.log(`Total: ${total} robots, Average score: ${avgScore}/100`);
  console.log(`Needs attention: ${needsAttention.length} robots`);
}

main().catch(console.error);
