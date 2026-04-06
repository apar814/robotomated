/**
 * Seed 15 humanoid / bipedal / delivery robots into the Supabase database.
 *
 * Usage:
 *   npx tsx scripts/seed-humanoid-robots.ts
 *
 * Safe to re-run: uses upsert with onConflict: "slug".
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "public" } }
);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getOrCreateHumanoidCategory(): Promise<string> {
  const { data: catData } = await supabase
    .from("robot_categories")
    .select("id")
    .eq("slug", "humanoid")
    .single();

  if (catData?.id) return catData.id;

  const { data: newCat, error } = await supabase
    .from("robot_categories")
    .insert({
      slug: "humanoid",
      name: "Humanoid",
      description: "Humanoid and bipedal robots",
      display_order: 0,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create humanoid category: ${error.message}`);
  return newCat!.id;
}

async function getOrCreateManufacturer(
  name: string,
  country: string,
  website?: string
): Promise<string> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Check by name first, then by slug (handles name variants)
  const { data } = await supabase
    .from("manufacturers")
    .select("id")
    .eq("name", name)
    .single();

  if (data) return data.id;

  const { data: bySlug } = await supabase
    .from("manufacturers")
    .select("id")
    .eq("slug", slug)
    .single();

  if (bySlug) return bySlug.id;

  const { data: newMfr, error } = await supabase
    .from("manufacturers")
    .insert({
      name,
      slug,
      country,
      website,
      verified: true,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Failed to create manufacturer "${name}": ${error.message}`);
  return newMfr!.id;
}

// ---------------------------------------------------------------------------
// Robot definitions
// ---------------------------------------------------------------------------

interface RobotSeed {
  name: string;
  slug: string;
  manufacturer_name: string;
  manufacturer_country: string;
  manufacturer_website?: string;
  robot_type: string;
  description_short: string;
  price_current?: number | null;
  price_range_min?: number | null;
  price_range_max?: number | null;
  height_cm: number;
  weight_kg: number;
  max_speed_kmh?: number | null;
  payload_kg?: number | null;
  degrees_of_freedom?: number | null;
  battery_life_hours?: number | null;
  manufacturing_origin: string;
  neural_network_based?: boolean;
  fleet_learning?: boolean;
  self_charging?: boolean;
  autonomy_level?: string | null;
  consecutive_hours_autonomous?: number | null;
  weather_rating?: string;
  raas_available?: boolean;
  raas_price_min?: number | null;
  raas_price_max?: number | null;
  safety_certified?: boolean;
  units_deployed?: number;
  manufacturing_capacity_annual?: number | null;
  bill_of_materials_cost?: number | null;
  target_price_2030?: number | null;
  key_features: string[];
  use_cases: string[];
  partners?: string[];
}

const ROBOTS: RobotSeed[] = [
  // 1. Tesla Optimus Gen 2.5
  {
    name: "Tesla Optimus Gen 2.5",
    slug: "optimus-gen-2-5",
    manufacturer_name: "Tesla",
    manufacturer_country: "US",
    manufacturer_website: "https://www.tesla.com",
    robot_type: "humanoid",
    description_short:
      "Tesla's flagship humanoid robot with fleet learning and neural-network-driven autonomy, targeting sub-$20K pricing by 2030.",
    price_range_min: 20000,
    price_range_max: 30000,
    height_cm: 173,
    weight_kg: 56,
    degrees_of_freedom: 22,
    battery_life_hours: 4,
    manufacturing_origin: "US",
    neural_network_based: true,
    fleet_learning: true,
    units_deployed: 1000,
    target_price_2030: 20000,
    bill_of_materials_cost: 55000,
    key_features: [
      "Neural-network-based control",
      "Fleet learning across deployed units",
      "22 degrees of freedom",
      "Sub-$30K target price",
    ],
    use_cases: ["manufacturing", "warehouse", "logistics", "general purpose"],
    partners: ["Tesla Gigafactory"],
  },
  // 2. Figure 03
  {
    name: "Figure 03",
    slug: "figure-03",
    manufacturer_name: "Figure AI",
    manufacturer_country: "US",
    manufacturer_website: "https://www.figure.ai",
    robot_type: "humanoid",
    description_short:
      "Figure AI's third-generation humanoid with 65 DoF, self-charging capability, and up to 67 hours of consecutive autonomous operation.",
    price_range_min: 30000,
    price_range_max: 50000,
    height_cm: 168,
    weight_kg: 61,
    degrees_of_freedom: 65,
    battery_life_hours: 5,
    manufacturing_origin: "US",
    fleet_learning: true,
    self_charging: true,
    consecutive_hours_autonomous: 67,
    units_deployed: 50,
    bill_of_materials_cost: 15000,
    key_features: [
      "65 degrees of freedom",
      "Self-charging docking",
      "67-hour autonomous operation",
      "Fleet learning",
    ],
    use_cases: ["warehouse", "manufacturing", "logistics"],
    partners: ["BMW", "OpenAI"],
  },
  // 3. 1X NEO Gamma
  {
    name: "1X NEO Gamma",
    slug: "neo-gamma",
    manufacturer_name: "1X Technologies",
    manufacturer_country: "US",
    manufacturer_website: "https://www.1x.tech",
    robot_type: "humanoid",
    description_short:
      "Lightweight humanoid from 1X Technologies at a $20K price point with RaaS availability and fleet learning.",
    price_current: 20000,
    price_range_min: 20000,
    price_range_max: 20000,
    height_cm: 165,
    weight_kg: 35,
    degrees_of_freedom: 25,
    battery_life_hours: 4,
    manufacturing_origin: "US",
    fleet_learning: true,
    raas_available: true,
    units_deployed: 0,
    bill_of_materials_cost: 20000,
    key_features: [
      "Ultra-lightweight 35kg frame",
      "Fleet learning",
      "RaaS pricing available",
      "$20K entry price",
    ],
    use_cases: ["home assistance", "elder care", "light logistics"],
  },
  // 4. Agility Digit
  {
    name: "Agility Digit",
    slug: "digit",
    manufacturer_name: "Agility Robotics",
    manufacturer_country: "US",
    manufacturer_website: "https://www.agilityrobotics.com",
    robot_type: "humanoid",
    description_short:
      "Purpose-built warehouse humanoid with 8-hour battery, safety certification, and RaaS pricing from $10-30/hr.",
    price_range_min: 10,
    price_range_max: 30,
    height_cm: 175,
    weight_kg: 93,
    degrees_of_freedom: 30,
    battery_life_hours: 8,
    manufacturing_origin: "US",
    fleet_learning: true,
    raas_available: true,
    raas_price_min: 10,
    raas_price_max: 30,
    safety_certified: true,
    units_deployed: 100,
    key_features: [
      "8-hour battery life",
      "Safety certified for human environments",
      "RaaS $10-30/hr",
      "Fleet learning",
    ],
    use_cases: ["warehouse", "logistics", "package handling"],
    partners: ["Amazon", "GXO Logistics"],
  },
  // 5. Apptronik Apollo
  {
    name: "Apptronik Apollo",
    slug: "apollo",
    manufacturer_name: "Apptronik",
    manufacturer_country: "US",
    manufacturer_website: "https://www.apptronik.com",
    robot_type: "humanoid",
    description_short:
      "High-dexterity 71-DoF humanoid designed for heavy industrial and logistics applications with 24-hour autonomous capability.",
    price_current: 50000,
    price_range_min: 50000,
    price_range_max: 50000,
    height_cm: 173,
    weight_kg: 72,
    degrees_of_freedom: 71,
    battery_life_hours: 4,
    manufacturing_origin: "US",
    fleet_learning: true,
    consecutive_hours_autonomous: 24,
    units_deployed: 10,
    bill_of_materials_cost: 40000,
    key_features: [
      "71 degrees of freedom",
      "24-hour autonomous operation",
      "Fleet learning",
      "Modular actuator design",
    ],
    use_cases: ["manufacturing", "warehouse", "logistics", "construction"],
    partners: ["NASA", "Mercedes-Benz"],
  },
  // 6. Boston Dynamics Atlas Electric
  {
    name: "Boston Dynamics Atlas Electric",
    slug: "atlas-electric",
    manufacturer_name: "Boston Dynamics",
    manufacturer_country: "US",
    manufacturer_website: "https://www.bostondynamics.com",
    robot_type: "humanoid",
    description_short:
      "The fully electric successor to Atlas hydraulic, featuring unmatched agility with a compact 150cm frame and premium research pricing.",
    price_range_min: 150000,
    price_range_max: 250000,
    height_cm: 150,
    weight_kg: 85,
    degrees_of_freedom: 28,
    battery_life_hours: 2,
    manufacturing_origin: "US",
    units_deployed: 10,
    bill_of_materials_cost: 100000,
    key_features: [
      "Full electric actuation",
      "Unmatched dynamic agility",
      "28 DoF compact frame",
      "Advanced perception stack",
    ],
    use_cases: ["research", "automotive manufacturing", "hazardous environments"],
    partners: ["Hyundai"],
  },
  // 7. Unitree G1
  {
    name: "Unitree G1",
    slug: "unitree-g1",
    manufacturer_name: "Unitree Robotics",
    manufacturer_country: "China",
    manufacturer_website: "https://www.unitree.com",
    robot_type: "humanoid",
    description_short:
      "Ultra-affordable compact humanoid at $16K with 43 DoF, targeting sub-$6K by 2030 through aggressive cost reduction.",
    price_current: 16000,
    price_range_min: 16000,
    price_range_max: 16000,
    height_cm: 127,
    weight_kg: 35,
    degrees_of_freedom: 43,
    battery_life_hours: 2,
    manufacturing_origin: "China",
    units_deployed: 500,
    bill_of_materials_cost: 10000,
    target_price_2030: 6000,
    key_features: [
      "43 DoF at $16K price point",
      "Compact 127cm form factor",
      "Aggressive cost reduction roadmap",
      "Open SDK for developers",
    ],
    use_cases: ["education", "research", "light home tasks", "entertainment"],
  },
  // 8. Unitree H1
  {
    name: "Unitree H1",
    slug: "unitree-h1",
    manufacturer_name: "Unitree Robotics",
    manufacturer_country: "China",
    manufacturer_website: "https://www.unitree.com",
    robot_type: "humanoid",
    description_short:
      "Full-size humanoid from Unitree with 180cm stature, 11 km/h top speed, and industrial-grade 19-DoF mobility.",
    price_current: 90000,
    price_range_min: 90000,
    price_range_max: 90000,
    height_cm: 180,
    weight_kg: 47,
    degrees_of_freedom: 19,
    battery_life_hours: 2,
    max_speed_kmh: 11,
    manufacturing_origin: "China",
    units_deployed: 200,
    key_features: [
      "11 km/h top speed",
      "Full-size 180cm humanoid",
      "Lightweight 47kg frame",
      "Industrial-grade actuators",
    ],
    use_cases: ["warehouse", "inspection", "security", "research"],
  },
  // 9. UBTECH Walker S2
  {
    name: "UBTECH Walker S2",
    slug: "walker-s2",
    manufacturer_name: "UBTECH Robotics",
    manufacturer_country: "China",
    manufacturer_website: "https://www.ubtrobot.com",
    robot_type: "humanoid",
    description_short:
      "Second-generation Walker with 42 DoF, fleet learning, and 500 units deployed across commercial and industrial sites in China.",
    price_current: 90000,
    price_range_min: 90000,
    price_range_max: 90000,
    height_cm: 170,
    weight_kg: 65,
    degrees_of_freedom: 42,
    battery_life_hours: 4,
    manufacturing_origin: "China",
    fleet_learning: true,
    units_deployed: 500,
    key_features: [
      "42 DoF full-body articulation",
      "Fleet learning capability",
      "Dual-arm manipulation",
      "Large-scale deployment proven",
    ],
    use_cases: ["hospitality", "retail", "exhibition", "smart city"],
  },
  // 10. EngineAI SE01
  {
    name: "EngineAI SE01",
    slug: "engineai-se01",
    manufacturer_name: "EngineAI Robotics",
    manufacturer_country: "China",
    robot_type: "humanoid",
    description_short:
      "Cost-effective 32-DoF humanoid from EngineAI at $21K, designed for warehouse and light industrial applications.",
    price_current: 21000,
    price_range_min: 21000,
    price_range_max: 21000,
    height_cm: 170,
    weight_kg: 55,
    degrees_of_freedom: 32,
    battery_life_hours: 2,
    manufacturing_origin: "China",
    units_deployed: 50,
    key_features: [
      "32 DoF at $21K",
      "Warehouse-optimized design",
      "Rapid deployment capability",
      "Modular limb system",
    ],
    use_cases: ["warehouse", "light industrial", "logistics"],
  },
  // 11. EngineAI T800
  {
    name: "EngineAI T800",
    slug: "engineai-t800",
    manufacturer_name: "EngineAI Robotics",
    manufacturer_country: "China",
    robot_type: "humanoid",
    description_short:
      "Heavy-duty 43-DoF humanoid with 5-hour battery life, built for sustained industrial operations and material handling.",
    price_current: 35000,
    price_range_min: 35000,
    price_range_max: 35000,
    height_cm: 173,
    weight_kg: 75,
    degrees_of_freedom: 43,
    battery_life_hours: 5,
    manufacturing_origin: "China",
    units_deployed: 20,
    key_features: [
      "43 DoF heavy-duty frame",
      "5-hour battery life",
      "75kg robust build",
      "Industrial material handling",
    ],
    use_cases: ["manufacturing", "material handling", "heavy logistics"],
  },
  // 12. Sanctuary AI Phoenix
  {
    name: "Sanctuary AI Phoenix",
    slug: "sanctuary-phoenix",
    manufacturer_name: "Sanctuary AI",
    manufacturer_country: "Canada",
    manufacturer_website: "https://www.sanctuary.ai",
    robot_type: "humanoid",
    description_short:
      "General-purpose humanoid with Carbon AI brain pursuing full autonomy, at a premium $300K research and pilot price point.",
    price_current: 300000,
    price_range_min: 300000,
    price_range_max: 300000,
    height_cm: 170,
    weight_kg: 70,
    degrees_of_freedom: 20,
    battery_life_hours: 4,
    manufacturing_origin: "Canada",
    autonomy_level: "full",
    units_deployed: 5,
    key_features: [
      "Carbon AI general-purpose brain",
      "Full autonomy targeting",
      "Human-like dexterous hands",
      "Pilot program available",
    ],
    use_cases: ["retail", "general labor", "automotive", "research"],
  },
  // 13. Aethon TUG
  {
    name: "Aethon TUG",
    slug: "aethon-tug",
    manufacturer_name: "Aethon",
    manufacturer_country: "US",
    manufacturer_website: "https://www.aethon.com",
    robot_type: "delivery",
    description_short:
      "Hospital and facility delivery robot with 5,000+ units deployed, proven autonomous navigation, and RaaS at $3,500/month.",
    price_current: 100000,
    price_range_min: 100000,
    price_range_max: 100000,
    height_cm: 100,
    weight_kg: 200,
    manufacturing_origin: "US",
    raas_available: true,
    raas_price_min: 3500,
    raas_price_max: 3500,
    units_deployed: 5000,
    key_features: [
      "5,000+ units deployed worldwide",
      "Hospital-grade autonomous navigation",
      "RaaS at $3,500/month",
      "Multi-floor elevator integration",
    ],
    use_cases: ["hospital delivery", "pharmacy", "lab specimen transport", "facility logistics"],
    partners: ["ST Engineering"],
  },
  // 14. Savioke Relay
  {
    name: "Savioke Relay",
    slug: "savioke-relay",
    manufacturer_name: "Savioke",
    manufacturer_country: "US",
    manufacturer_website: "https://www.savioke.com",
    robot_type: "delivery",
    description_short:
      "Hospitality delivery robot with 1,000 units deployed across hotels, offering RaaS at $2,000/month for guest services.",
    height_cm: 91,
    weight_kg: 45,
    manufacturing_origin: "US",
    raas_available: true,
    raas_price_min: 2000,
    raas_price_max: 2000,
    units_deployed: 1000,
    key_features: [
      "1,000+ hotel deployments",
      "Guest-friendly interaction design",
      "RaaS at $2,000/month",
      "Elevator and door integration",
    ],
    use_cases: ["hotel delivery", "hospitality", "guest services"],
  },
  // 15. Kepler Forerunner K2
  {
    name: "Kepler Forerunner K2",
    slug: "kepler-k2",
    manufacturer_name: "Kepler Robotics",
    manufacturer_country: "China",
    robot_type: "humanoid",
    description_short:
      "Full-size 178cm humanoid with 40 DoF and 8-hour battery, positioned at an accessible $30K price for industrial pilots.",
    price_current: 30000,
    price_range_min: 30000,
    price_range_max: 30000,
    height_cm: 178,
    weight_kg: 70,
    degrees_of_freedom: 40,
    battery_life_hours: 8,
    manufacturing_origin: "China",
    units_deployed: 100,
    key_features: [
      "40 DoF full-body articulation",
      "8-hour battery life",
      "178cm full-size frame",
      "$30K accessible price point",
    ],
    use_cases: ["manufacturing", "warehouse", "logistics", "inspection"],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Starting humanoid robot seed...\n");

  // Resolve humanoid category
  const humanoidCategoryId = await getOrCreateHumanoidCategory();
  console.log(`Humanoid category ID: ${humanoidCategoryId}`);

  // Pre-resolve all manufacturers (deduplicate)
  const mfrCache = new Map<string, string>();
  for (const r of ROBOTS) {
    if (!mfrCache.has(r.manufacturer_name)) {
      const id = await getOrCreateManufacturer(
        r.manufacturer_name,
        r.manufacturer_country,
        r.manufacturer_website
      );
      mfrCache.set(r.manufacturer_name, id);
      console.log(`  Manufacturer "${r.manufacturer_name}" -> ${id}`);
      await sleep(200);
    }
  }

  let seeded = 0;
  let skipped = 0;

  for (const r of ROBOTS) {
    const manufacturerId = mfrCache.get(r.manufacturer_name)!;

    // Determine category: use humanoid for humanoid type, look up or keep humanoid for delivery
    let categoryId = humanoidCategoryId;
    if (r.robot_type === "delivery") {
      const { data: delCat } = await supabase
        .from("robot_categories")
        .select("id")
        .eq("slug", "delivery")
        .single();
      if (delCat?.id) {
        categoryId = delCat.id;
      }
      // If no delivery category exists, fall back to humanoid category
    }

    const record: Record<string, unknown> = {
      name: r.name,
      slug: r.slug,
      manufacturer_id: manufacturerId,
      category_id: categoryId,
      status: "active" as const,
      robot_type: r.robot_type,
      description_short: r.description_short,
      height_cm: r.height_cm,
      weight_kg: r.weight_kg,
      manufacturing_origin: r.manufacturing_origin,
      key_features: r.key_features,
      use_cases: r.use_cases,
      units_deployed: r.units_deployed ?? 0,
    };

    // Optional fields -- only set if defined
    if (r.price_current != null) record.price_current = r.price_current;
    if (r.price_range_min != null) record.price_range_min = r.price_range_min;
    if (r.price_range_max != null) record.price_range_max = r.price_range_max;
    if (r.max_speed_kmh != null) record.max_speed_kmh = r.max_speed_kmh;
    if (r.payload_kg != null) record.payload_kg = r.payload_kg;
    if (r.degrees_of_freedom != null) record.degrees_of_freedom = r.degrees_of_freedom;
    if (r.battery_life_hours != null) record.battery_life_hours = r.battery_life_hours;
    if (r.neural_network_based != null) record.neural_network_based = r.neural_network_based;
    if (r.fleet_learning != null) record.fleet_learning = r.fleet_learning;
    if (r.self_charging != null) record.self_charging = r.self_charging;
    if (r.autonomy_level != null) record.autonomy_level = r.autonomy_level;
    if (r.consecutive_hours_autonomous != null)
      record.consecutive_hours_autonomous = r.consecutive_hours_autonomous;
    if (r.weather_rating != null) record.weather_rating = r.weather_rating;
    if (r.raas_available != null) record.raas_available = r.raas_available;
    if (r.raas_price_min != null) record.raas_price_min = r.raas_price_min;
    if (r.raas_price_max != null) record.raas_price_max = r.raas_price_max;
    if (r.safety_certified != null) record.safety_certified = r.safety_certified;
    if (r.manufacturing_capacity_annual != null)
      record.manufacturing_capacity_annual = r.manufacturing_capacity_annual;
    if (r.bill_of_materials_cost != null) record.bill_of_materials_cost = r.bill_of_materials_cost;
    if (r.target_price_2030 != null) record.target_price_2030 = r.target_price_2030;
    if (r.partners && r.partners.length > 0) record.partners = r.partners;

    const { error, status } = await supabase
      .from("robots")
      .upsert(record, { onConflict: "slug" });

    if (error) {
      console.error(`  FAILED "${r.name}": ${error.message}`);
    } else if (status === 201) {
      seeded++;
      console.log(`  Inserted "${r.name}"`);
    } else {
      // 200 means it matched an existing row and updated it
      seeded++;
      console.log(`  Upserted "${r.name}"`);
    }

    await sleep(200);
  }

  console.log(`\nSeeded ${seeded} robots. Skipped ${skipped} (already exist).`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
