/**
 * Pipeline 1: Scrape and enrich robot specs using Firecrawl.
 * Fills gaps in robots.specs JSONB for robots with < 3 spec fields.
 * Run: npx tsx scripts/scrape-robot-specs.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

const SPEC_SCHEMA = {
  type: "object" as const,
  properties: {
    payload_kg: { type: "number" as const },
    reach_mm: { type: "number" as const },
    weight_kg: { type: "number" as const },
    max_speed: { type: "string" as const },
    battery_hrs: { type: "number" as const },
    dof: { type: "number" as const },
    ip_rating: { type: "string" as const },
    repeatability: { type: "string" as const },
    dimensions: { type: "string" as const },
    suction_pa: { type: "number" as const },
    noise_db: { type: "number" as const },
    operating_temp: { type: "string" as const },
  },
};

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("=== Pipeline 1: Scrape Robot Specs ===\n");

  // Get robots with sparse specs
  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, specs, manufacturers(name, website)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const sparse = (robots || []).filter(r => {
    const specs = r.specs as Record<string, unknown> | null;
    return !specs || Object.keys(specs).length < 3;
  });

  console.log(`Found ${sparse.length} robots with < 3 spec fields\n`);

  let updated = 0;
  const limit = Math.min(sparse.length, 15); // Rate limit: process 15 per run

  for (let i = 0; i < limit; i++) {
    const robot = sparse[i];
    const mfr = robot.manufacturers as { name: string; website: string | null } | null;
    const existingSpecs = (robot.specs || {}) as Record<string, unknown>;

    console.log(`[${i + 1}/${limit}] ${robot.name} (${mfr?.name || "unknown"})...`);

    try {
      // Search for the robot's spec page
      const searchResult = await firecrawl.search(
        `${robot.name} ${mfr?.name || ""} specifications technical specs`,
        { limit: 3 }
      );

      const webResults = searchResult.web || [];
      if (!webResults.length) {
        console.log(`  SKIP: no search results`);
        await delay(2000);
        continue;
      }

      const topUrl = webResults[0].url;
      if (!topUrl) {
        console.log(`  SKIP: no URL in search result`);
        await delay(2000);
        continue;
      }

      const scrapeResult = await firecrawl.scrape(topUrl, {
        formats: ["extract"],
        extract: { schema: SPEC_SCHEMA },
      });

      if (!scrapeResult.extract) {
        console.log(`  SKIP: scrape failed or no extract`);
        await delay(2000);
        continue;
      }

      const newSpecs = scrapeResult.extract as Record<string, unknown>;

      // Merge: only fill gaps, never overwrite existing values
      const merged = { ...existingSpecs };
      let addedCount = 0;
      for (const [key, value] of Object.entries(newSpecs)) {
        if (value != null && value !== "" && value !== 0 && !(key in merged)) {
          merged[key] = value;
          addedCount++;
        }
      }

      if (addedCount > 0) {
        await supabase.from("robots").update({ specs: merged }).eq("id", robot.id);
        console.log(`  OK: added ${addedCount} new spec fields`);
        updated++;
      } else {
        console.log(`  SKIP: no new specs extracted`);
      }
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(2000); // Rate limiting
  }

  console.log(`\nDone: ${updated} robots enriched with new specs`);
}

main().catch(console.error);
