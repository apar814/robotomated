/**
 * Populate buyer intelligence data for robots missing it, using AI estimation.
 * Uses Claude to estimate TCO, vendor health, compliance, deployment, and training
 * data based on robot name, category, manufacturer, price, and specs.
 *
 * Run: npx tsx scripts/populate-buyer-intelligence-ai.ts
 */

import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface RobotRow {
  id: string;
  slug: string;
  name: string;
  price_current: number | null;
  price_msrp: number | null;
  description_short: string | null;
  specs: Record<string, unknown> | null;
  year_released: number | null;
  manufacturers: { name: string; founded_year: number | null; country: string | null; website: string | null } | null;
  robot_categories: { name: string; slug: string } | null;
}

interface BuyerIntelligence {
  maintenance_annual_cost_low: number | null;
  maintenance_annual_cost_high: number | null;
  warranty_months: number | null;
  warranty_coverage: string | null;
  support_model: string | null;
  support_response_hours: number | null;
  spare_parts_availability: string | null;
  deployment_weeks_min: number | null;
  deployment_weeks_max: number | null;
  floor_space_sqft: number | null;
  power_requirements: string | null;
  network_requirements: string | null;
  operator_training_hours: number | null;
  safety_certifications: string[] | null;
  industry_certifications: string[] | null;
  vendor_funding_total: string | null;
  vendor_employees_range: string | null;
  vendor_health_score: number | null;
  api_available: boolean | null;
}

const SYSTEM_PROMPT = `You are a robotics industry analyst estimating buyer intelligence data for commercial and consumer robots. Given a robot's name, manufacturer, category, price, and specs, provide realistic estimates for procurement-relevant data.

IMPORTANT RULES:
- Base estimates on the robot's category and price tier
- Use industry-standard ranges — don't guess wildly
- For consumer robots (<$2K): low maintenance, short warranty, no professional support needed
- For industrial cobots ($20K-$80K): moderate maintenance, 12-month warranty, partner support
- For enterprise robots ($100K+): high maintenance, specialized support, longer deployment
- For medical robots: highest maintenance, specialist training, strict certifications
- vendor_health_score: 1-10 based on manufacturer age, size, and market presence. Established companies (Boston Dynamics, ABB, FANUC, iRobot, DJI) get 7-9. Startups get 3-5. Unknown/new companies get 4-6.
- safety_certifications: use real certification standards (CE, UL, FCC, ISO 10218, ISO/TS 15066, IP ratings, FDA, IEC 60601)
- support_model must be one of: on-site, remote, partner, none
- spare_parts_availability must be one of: stocked, order, custom, proprietary

Respond with ONLY valid JSON matching the schema. No markdown, no explanation.`;

async function estimateRobotIntelligence(robot: RobotRow): Promise<BuyerIntelligence | null> {
  const price = robot.price_current || robot.price_msrp;
  const mfr = robot.manufacturers;
  const cat = robot.robot_categories;

  const prompt = `Estimate buyer intelligence for this robot:

Name: ${robot.name}
Manufacturer: ${mfr?.name || "Unknown"} (Founded: ${mfr?.founded_year || "Unknown"}, Country: ${mfr?.country || "Unknown"})
Category: ${cat?.name || "Unknown"} (${cat?.slug || "unknown"})
Price: ${price ? `$${price.toLocaleString()}` : "Contact for pricing"}
Year: ${robot.year_released || "Unknown"}
Description: ${robot.description_short || "N/A"}
Specs: ${robot.specs ? JSON.stringify(robot.specs).slice(0, 500) : "N/A"}

Return JSON with these exact fields:
{
  "maintenance_annual_cost_low": <number or null>,
  "maintenance_annual_cost_high": <number or null>,
  "warranty_months": <number>,
  "warranty_coverage": "<string description>",
  "support_model": "<on-site|remote|partner|none>",
  "support_response_hours": <number or null>,
  "spare_parts_availability": "<stocked|order|custom|proprietary>",
  "deployment_weeks_min": <number>,
  "deployment_weeks_max": <number>,
  "floor_space_sqft": <number or null>,
  "power_requirements": "<string>",
  "network_requirements": "<string or null>",
  "operator_training_hours": <number>,
  "safety_certifications": ["<cert1>", "<cert2>"],
  "industry_certifications": ["<cert1>"] or [],
  "vendor_funding_total": "<string like '$2.4B' or 'Public' or 'Undisclosed'>",
  "vendor_employees_range": "<string like '500-1000' or '10000+'>",
  "vendor_health_score": <1-10>,
  "api_available": <true|false|null>
}`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(`  ⚠️ ${robot.slug}: No JSON in response`);
      return null;
    }

    const data = JSON.parse(jsonMatch[0]) as BuyerIntelligence;

    // Validate enums
    if (data.support_model && !["on-site", "remote", "partner", "none"].includes(data.support_model)) {
      data.support_model = "remote";
    }
    if (data.spare_parts_availability && !["stocked", "order", "custom", "proprietary"].includes(data.spare_parts_availability)) {
      data.spare_parts_availability = "order";
    }
    if (data.vendor_health_score && (data.vendor_health_score < 1 || data.vendor_health_score > 10)) {
      data.vendor_health_score = Math.max(1, Math.min(10, data.vendor_health_score));
    }

    return data;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ❌ ${robot.slug}: AI error — ${msg}`);
    return null;
  }
}

async function main() {
  console.log("🤖 Populating Buyer Intelligence (AI Estimation)\n");

  // Fetch robots that don't have buyer intelligence data yet
  const { data: robots, error } = await supabase
    .from("robots")
    .select(
      "id, slug, name, price_current, price_msrp, description_short, specs, year_released, " +
      "manufacturers(name, founded_year, country, website), " +
      "robot_categories(name, slug)"
    )
    .is("maintenance_annual_cost_low", null)
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false })
    .returns<RobotRow[]>();

  if (error) {
    console.error("Failed to fetch robots:", error.message);
    process.exit(1);
  }

  console.log(`Found ${robots.length} robots needing buyer intelligence data.\n`);

  if (robots.length === 0) {
    console.log("✅ All robots already have buyer intelligence data.");
    return;
  }

  let completed = 0;
  let failed = 0;

  // Process in batches of 10
  const BATCH_SIZE = 10;
  for (let i = 0; i < robots.length; i += BATCH_SIZE) {
    const batch = robots.slice(i, i + BATCH_SIZE);
    console.log(`\n── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1}-${Math.min(i + BATCH_SIZE, robots.length)} of ${robots.length}) ──`);

    const results = await Promise.all(
      batch.map(async (robot) => {
        const data = await estimateRobotIntelligence(robot);
        if (!data) {
          failed++;
          return;
        }

        const { error: updateError } = await supabase
          .from("robots")
          .update(data)
          .eq("id", robot.id);

        if (updateError) {
          console.error(`  ❌ ${robot.slug}: DB update failed — ${updateError.message}`);
          failed++;
        } else {
          console.log(`  ✅ ${robot.slug} (${robot.robot_categories?.slug || "?"}) — health: ${data.vendor_health_score}/10, maint: $${data.maintenance_annual_cost_low}-${data.maintenance_annual_cost_high}/yr`);
          completed++;
        }
      })
    );

    // Brief pause between batches to avoid rate limits
    if (i + BATCH_SIZE < robots.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log(`\n═══════════════════════════════════`);
  console.log(`✅ Complete: ${completed}/${robots.length}`);
  console.log(`❌ Failed: ${failed}/${robots.length}`);
  console.log(`═══════════════════════════════════`);
}

main().catch(console.error);
