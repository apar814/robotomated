import { config } from "dotenv";
config({ path: ".env.local" });

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RobotRow {
  id: string;
  name: string;
  slug: string;
  description_short: string | null;
  price_current: number | null;
  robo_score: number | null;
  specs: Record<string, unknown> | null;
  manufacturers: { name: string } | null;
  robot_categories: { name: string } | null;
}

async function getTopRobots(): Promise<RobotRow[]> {
  const { data, error } = await supabase
    .from("robots")
    .select("id, name, slug, description_short, price_current, robo_score, specs, manufacturers(name), robot_categories(name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data || []) as unknown as RobotRow[];
}

async function generateDescription(robot: RobotRow): Promise<string> {
  const mfr = robot.manufacturers?.name || "Unknown";
  const cat = robot.robot_categories?.name || "robot";
  const price = robot.price_current ? `$${robot.price_current.toLocaleString()}` : "price TBD";

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 100,
    messages: [{
      role: "user",
      content: `Write a 1-sentence description of ${robot.name} by ${mfr} (${cat} category, ${price}). Focus on what job it does and who uses it. Under 20 words. No marketing language. No quotes around the text.`
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  return text.trim().replace(/^["']|["']$/g, "");
}

async function main() {
  console.log("=== Robot Enrichment Script ===");
  console.log(`Started: ${new Date().toISOString()}\n`);

  const robots = await getTopRobots();
  console.log(`Found ${robots.length} robots to process\n`);

  let enriched = 0;
  let skipped = 0;

  for (const robot of robots) {
    const mfr = robot.manufacturers?.name || "Unknown";
    console.log(`[${enriched + skipped + 1}/${robots.length}] ${robot.name} by ${mfr} (score: ${robot.robo_score})`);

    if (robot.description_short) {
      console.log("  Already has description — skipping");
      skipped++;
      continue;
    }

    try {
      const description = await generateDescription(robot);
      console.log(`  Generated: "${description}"`);

      const { error } = await supabase
        .from("robots")
        .update({ description_short: description })
        .eq("id", robot.id);

      if (error) {
        console.error(`  DB update failed: ${error.message}`);
      } else {
        console.log("  Saved to database");
        enriched++;
      }
    } catch (err) {
      console.error(`  Error: ${err}`);
    }

    // Rate limit: 1 second between API calls
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`\n=== Complete ===`);
  console.log(`Total: ${robots.length}`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Skipped (already had data): ${skipped}`);
  console.log(`Failed: ${robots.length - enriched - skipped}`);
}

main().catch(console.error);
