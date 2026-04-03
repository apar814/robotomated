/**
 * Robot Data Enrichment
 * For each robot with data quality < 60, attempt to enrich via manufacturer website.
 * Run: npx tsx scripts/enrich-robots.ts
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

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
  specs: Record<string, unknown> | null;
  youtube_url: string | null;
  affiliate_url: string | null;
  robo_score: number | null;
  manufacturer_id: string;
}

function computeScore(r: RobotRow): number {
  let score = 0;
  if (Array.isArray(r.images) && r.images.length > 0) score += 20;
  if (r.price_current || r.price_msrp) score += 20;
  if (r.description_long && r.description_long.length > 50) score += 15;
  if (r.specs && Object.keys(r.specs).length > 0) score += 15;
  if (r.youtube_url) score += 10;
  if (r.affiliate_url) score += 10;
  if (r.robo_score && r.robo_score > 0) score += 10;
  return score;
}

async function main() {
  console.log("Robot Data Enrichment");
  console.log("=====================\n");

  const { data: robots, error } = await supabase
    .from("robots")
    .select("id, slug, name, images, price_current, price_msrp, description_long, specs, youtube_url, affiliate_url, robo_score, manufacturer_id")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("Failed to fetch robots:", error.message);
    process.exit(1);
  }

  const lowQuality = (robots as RobotRow[]).filter((r) => computeScore(r) < 60);

  console.log(`Found ${lowQuality.length} robots with quality score < 60\n`);

  if (!process.env.FIRECRAWL_API_KEY) {
    console.log("FIRECRAWL_API_KEY not set. Listing robots that need enrichment:\n");
    lowQuality.forEach((r) => {
      console.log(`  - ${r.name} (score: ${computeScore(r)}, slug: ${r.slug})`);
    });
    console.log("\nSet FIRECRAWL_API_KEY to enable automatic enrichment.");
    return;
  }

  // Dynamic import of Firecrawl
  const { default: FirecrawlApp } = await import("@mendable/firecrawl-js");
  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

  let enriched = 0;
  let failed = 0;

  for (const robot of lowQuality.slice(0, 20)) {
    try {
      // Get manufacturer website
      const { data: mfr } = await supabase
        .from("manufacturers")
        .select("name, website")
        .eq("id", robot.manufacturer_id)
        .single();

      if (!mfr?.website) {
        console.log(`  [SKIP] ${robot.name} — no manufacturer website`);
        continue;
      }

      console.log(`  [ENRICHING] ${robot.name} via ${mfr.website}...`);

      // Search for product page
      const searchQuery = `${robot.name} ${mfr.name} robot specifications`;
      const result = await firecrawl.search(searchQuery, { limit: 3 });

      if (!result.success || !result.data?.length) {
        console.log(`    No results found`);
        failed++;
        continue;
      }

      // Extract useful data from first result
      const page = result.data[0];
      const updates: Record<string, unknown> = {};

      // Extract description if missing
      if (!robot.description_long && page.markdown && page.markdown.length > 100) {
        const desc = page.markdown.substring(0, 2000);
        updates.description_long = desc;
      }

      if (Object.keys(updates).length > 0) {
        await supabase
          .from("robots")
          .update(updates)
          .eq("id", robot.id);
        enriched++;
        console.log(`    Updated ${Object.keys(updates).join(", ")}`);
      } else {
        console.log(`    No new data extracted`);
      }

      // Rate limit: 1 request per 2 seconds
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.log(`    Error: ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\nDone. Enriched: ${enriched}, Failed: ${failed}`);
}

main().catch(console.error);
