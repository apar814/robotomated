/**
 * Pipeline 1: Scrape and enrich robot specs using Firecrawl.
 * Fetches markdown from spec pages, extracts numbers via patterns.
 * Run: npx tsx scripts/scrape-robot-specs.ts
 */
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

// Extract spec values from markdown text using common patterns
function extractSpecs(md: string): Record<string, unknown> {
  const specs: Record<string, unknown> = {};
  const lower = md.toLowerCase();

  // Payload
  const payload = lower.match(/payload[:\s]*(\d+(?:\.\d+)?)\s*kg/);
  if (payload) specs.payload_kg = parseFloat(payload[1]);

  // Reach
  const reach = lower.match(/reach[:\s]*(\d+(?:\.\d+)?)\s*mm/);
  if (reach) specs.reach_mm = parseFloat(reach[1]);

  // Weight
  const weight = lower.match(/(?:weight|mass)[:\s]*(\d+(?:\.\d+)?)\s*kg/);
  if (weight) specs.weight_kg = parseFloat(weight[1]);

  // DOF
  const dof = lower.match(/(\d)\s*(?:dof|degrees?\s*of\s*freedom|axes|axis)/);
  if (dof) specs.dof = parseInt(dof[1]);

  // Repeatability
  const repeat = lower.match(/repeatability[:\s]*[±]?\s*(\d+(?:\.\d+)?)\s*mm/);
  if (repeat) specs.repeatability = `±${repeat[1]}mm`;

  // IP rating
  const ip = lower.match(/ip\s*([\d]{2,3})/);
  if (ip) specs.ip_rating = `IP${ip[1]}`;

  // Battery
  const battery = lower.match(/battery[:\s]*(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
  if (battery) specs.battery_hrs = parseFloat(battery[1]);

  // Suction
  const suction = lower.match(/(\d{3,6})\s*pa\s*(?:suction)?/);
  if (suction) specs.suction_pa = parseInt(suction[1]);

  // Max speed
  const speed = lower.match(/(?:max(?:imum)?\s*)?speed[:\s]*([\d.]+\s*(?:m\/s|km\/h|mph|°\/s))/);
  if (speed) specs.max_speed = speed[1];

  // Operating temp
  const temp = lower.match(/(?:operating|temperature)[:\s]*(-?\d+)\s*(?:°|to|–|-)\s*(-?\d+)\s*°?\s*c/);
  if (temp) specs.operating_temp = `${temp[1]}°C to ${temp[2]}°C`;

  return specs;
}

async function main() {
  console.log("=== Pipeline 1: Scrape Robot Specs ===\n");

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, specs, manufacturers(name)")
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false });

  const sparse = (robots || []).filter(r => {
    const specs = r.specs as Record<string, unknown> | null;
    return !specs || Object.keys(specs).length < 3;
  });

  console.log(`Found ${sparse.length} robots with < 3 spec fields\n`);

  let updated = 0;
  const limit = Math.min(sparse.length, 10);

  for (let i = 0; i < limit; i++) {
    const robot = sparse[i];
    const mfr = (robot.manufacturers as unknown as { name: string } | null)?.name || "";
    const existingSpecs = (robot.specs || {}) as Record<string, unknown>;

    console.log(`[${i + 1}/${limit}] ${robot.name} (${mfr})...`);

    try {
      // Search for the robot's spec page
      const searchResult = await firecrawl.search(
        `${robot.name} ${mfr} specifications technical specs`,
        { limit: 3 }
      );

      const webResults = (searchResult.web || []) as { url: string; title?: string }[];
      if (!webResults.length) {
        console.log(`  SKIP: no search results`);
        await delay(2000);
        continue;
      }

      // Scrape the top result as markdown
      const topUrl = webResults[0].url;
      const scrapeResult = await firecrawl.scrape(topUrl, { formats: ["markdown"] });

      if (!scrapeResult.markdown) {
        console.log(`  SKIP: no markdown content`);
        await delay(2000);
        continue;
      }

      // Extract specs from the markdown
      const newSpecs = extractSpecs(scrapeResult.markdown);

      // Merge: only fill gaps
      const merged = { ...existingSpecs };
      let addedCount = 0;
      for (const [key, value] of Object.entries(newSpecs)) {
        if (value != null && !(key in merged)) {
          merged[key] = value;
          addedCount++;
        }
      }

      if (addedCount > 0) {
        await supabase.from("robots").update({ specs: merged as any }).eq("id", robot.id);
        console.log(`  OK: added ${addedCount} fields → ${Object.keys(newSpecs).join(", ")}`);
        updated++;
      } else {
        console.log(`  SKIP: no new specs extracted from ${topUrl.substring(0, 50)}`);
      }
    } catch (err) {
      console.log(`  ERR: ${err instanceof Error ? err.message : String(err)}`);
    }

    await delay(2000);
  }

  console.log(`\nDone: ${updated} robots enriched with new specs`);
}

main().catch(console.error);
