/**
 * Seed expert reviews into the reviews table.
 * Maps review data to existing schema: reviews.robot_id, review_type='expert',
 * title, body (verdict), pros, cons, robo_score (normalized from /10 to /100).
 *
 * Run: npx tsx scripts/seed-expert-reviews.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const expertReviews = [
  {
    robotSlugs: ["ur10e", "ur10e-v2"],
    source: "Standard Bots",
    rating: 8.0,
    verdict: "A well-rounded cobot that hits the sweet spot between payload and reach for medium-duty manufacturing work.",
    pros: ["±0.05 mm repeatability suits assembly and machining", "User-friendly PolyScope touchscreen", "12.5 kg payload at 1,300 mm reach", "No safety fencing required"],
    cons: ["Full system cost can reach $90K+", "Heavier payloads require UR20/UR30", "Advanced customization requires integrator"],
    bestFor: "Mid-sized manufacturers automating palletizing or machine tending",
    publishedAt: "2024-06-01",
  },
  {
    robotSlugs: ["ur5e", "ur5e-v2"],
    source: "QVIRO",
    rating: 9.2,
    verdict: "The most widely deployed cobot in the world — a proven, flexible platform for light assembly and precision tasks.",
    pros: ["5 kg payload with 850 mm reach", "±0.03 mm precision", "17 configurable safety functions", "Massive ecosystem of end-effectors"],
    cons: ["5 kg payload ceiling limits heavier applications", "Gripper purchased separately", "Integration costs add significantly"],
    bestFor: "Manufacturers new to automation, electronics assembly, pharma",
    publishedAt: "2024-12-01",
  },
  {
    robotSlugs: ["ur20", "ur20-v2"],
    source: "Universal Robots",
    rating: 8.7,
    verdict: "The most capable cobot Universal Robots makes — purpose-built for palletizing and high-reach assembly.",
    pros: ["20 kg payload at 1,750 mm reach", "Same PolyScope UI as other UR models", "Collaborative — no safety cage", "750 W power consumption"],
    cons: ["64 kg arm weight requires proper mounting", "~$55K ROI requires significant volume", "Not ideal for tight spaces"],
    bestFor: "End-of-line palletizing, large-part assembly, automotive tier suppliers",
    publishedAt: "2024-09-01",
  },
  {
    robotSlugs: ["boston-dynamics-atlas-electric"],
    source: "Robozaps",
    rating: 8.8,
    verdict: "The world's first commercially available enterprise humanoid robot — a landmark for automotive and logistics.",
    pros: ["56 degrees of freedom with 360° joint rotation", "30 kg repeated lift capacity", "4-hour battery with sub-3-min self-swap", "Fenceless safety operation"],
    cons: ["~$420,000 price point limits to large enterprises", "2026 production committed to Hyundai/DeepMind", "Long-term reliability data limited"],
    bestFor: "Automotive manufacturers, large-scale warehouses",
    publishedAt: "2026-01-05",
  },
  {
    robotSlugs: ["roborock-s8-maxv", "roborock-s8-maxv-ultra-v2"],
    source: "TechRadar",
    rating: 8.5,
    verdict: "Roborock's most capable robot vacuum — excellent cleaning with a feature set that justifies the premium for large homes.",
    pros: ["10,000 Pa suction — top of class", "Recognizes 73 types of household objects", "VibraRise 3.0 sonic mopping", "8-in-1 auto dock"],
    cons: ["$1,799 price is steep without large home or pets", "Voice assistant inconsistent at launch", "Cannot avoid thin cords on floor"],
    bestFor: "Large homes (1,500+ sq ft), pet owners",
    publishedAt: "2024-07-30",
  },
  {
    robotSlugs: ["roborock-s8-maxv", "roborock-s8-maxv-ultra-v2"],
    source: "Vacuum Wars",
    rating: 8.9,
    verdict: "Outperforms the S8 Max Ultra in every metric tested — the camera+LiDAR combo makes it the more intelligent cleaner.",
    pros: ["Higher measured suction vs S8 Max Ultra", "DirTect sensor boosts suction over dirty areas", "Dirt detection in mop water triggers extra cycles"],
    cons: ["Costs slightly more than non-MaxV variant", "Camera raises privacy concerns for some buyers"],
    bestFor: "Buyers choosing between the S8 line",
    publishedAt: "2024-06-21",
  },
  {
    robotSlugs: ["dji-mavic-3-pro"],
    source: "DJI Official",
    rating: 9.0,
    verdict: "Three-camera Hasselblad system in a sub-1kg drone — the gold standard for professional aerial cinematography.",
    pros: ["Triple-camera: 4/3 CMOS Hasselblad + 70mm + 166mm tele", "43-minute max flight time", "15 km O3+ transmission range", "Omnidirectional obstacle sensing"],
    cons: ["$2,199 steep for hobbyist use", "Requires Part 107 for commercial US", "No built-in ND filters in base"],
    bestFor: "Cinematographers, real estate videographers, commercial inspection",
    publishedAt: "2023-05-01",
  },
  {
    robotSlugs: ["davinci-5", "da-vinci-5"],
    source: "Intuitive Surgical",
    rating: 9.5,
    verdict: "The most advanced surgical robot ever built — force feedback and 10K+ installed base makes it the de facto standard.",
    pros: ["Force feedback for first time in da Vinci history", "10,000+ installed base", "2M+ procedures performed", "7 degrees of freedom instruments", "3D HD 10x magnification"],
    cons: ["$2M+ system cost with service contracts", "Requires dedicated OR space", "Single-use instrument costs add up"],
    bestFor: "Academic medical centers, large health systems, high-volume MIS programs",
    publishedAt: "2024-01-01",
  },
];

async function main() {
  console.log("=== Seed Expert Reviews ===\n");
  let created = 0;
  let skipped = 0;

  for (const review of expertReviews) {
    for (const slug of review.robotSlugs) {
      // Find robot by slug
      const { data: robot } = await supabase.from("robots").select("id, name").eq("slug", slug).single();
      if (!robot) { console.log(`SKIP ${slug}: not found`); skipped++; continue; }

      // Check if review already exists for this robot + source
      const { data: existing } = await supabase.from("reviews")
        .select("id")
        .eq("robot_id", robot.id)
        .eq("title", `${review.source} Review: ${robot.name}`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`SKIP ${slug}: review from ${review.source} already exists`);
        skipped++;
        continue;
      }

      const { error } = await supabase.from("reviews").insert({
        robot_id: robot.id,
        review_type: "expert" as const,
        title: `${review.source} Review: ${robot.name}`,
        body: review.verdict + (review.bestFor ? `\n\nBest for: ${review.bestFor}` : ""),
        robo_score: review.rating * 10, // normalize /10 → /100
        pros: review.pros,
        cons: review.cons,
        verdict: review.verdict,
        published_at: review.publishedAt,
      });

      if (error) {
        console.log(`ERR  ${slug} (${review.source}): ${error.message}`);
      } else {
        console.log(`OK   ${slug} (${review.source}): ${review.verdict.substring(0, 60)}...`);
        created++;
      }
    }
  }

  console.log(`\nCreated: ${created}, Skipped: ${skipped}`);
}

main().catch(console.error);
