/**
 * Populate buyer intelligence data for all robots.
 * Run: npx tsx scripts/populate-buyer-data.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


async function updateRobot(slug: string, data: Record<string, unknown>) {
  const { error } = await supabase.from("robots").update(data).eq("slug", slug);
  if (error) console.error(`  [ERR] ${slug}: ${error.message}`);
  else console.log(`  [OK] ${slug}`);
}

async function insertApplication(robotSlug: string, app: Record<string, unknown>) {
  const { data: robot } = await supabase.from("robots").select("id").eq("slug", robotSlug).single();
  if (!robot) { console.error(`  [ERR] App: robot ${robotSlug} not found`); return; }
  const { error } = await supabase.from("robot_applications").insert({ ...app, robot_id: robot.id });
  if (error) console.error(`  [ERR] App ${robotSlug}/${app.application_name}: ${error.message}`);
  else console.log(`  [OK] App: ${robotSlug} → ${app.application_name}`);
}

async function insertFinancing(robotSlug: string, opt: Record<string, unknown>) {
  const { data: robot } = await supabase.from("robots").select("id").eq("slug", robotSlug).single();
  if (!robot) { console.error(`  [ERR] Fin: robot ${robotSlug} not found`); return; }
  const { error } = await supabase.from("financing_options").insert({ ...opt, robot_id: robot.id });
  if (error && !error.message.includes("duplicate")) console.error(`  [ERR] Fin ${robotSlug}/${opt.provider}: ${error.message}`);
  else console.log(`  [OK] Fin: ${robotSlug} → ${opt.provider}`);
}

async function main() {
  console.log("[BOT] Populating Buyer Intelligence Data\n");

  // ── COBOTS ──
  console.log("[PKG] Cobots...");
  await updateRobot("ur5e-v2", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Lease from $850/mo through UR Financial Services. Also available through LEAF Commercial Capital.",
    power_source: "plug", power_consumption_watts: 200, operating_voltage: "100-240V AC, 50/60Hz",
    annual_maintenance_cost: 1500, warranty_years: 1, expected_lifespan_years: 10,
    training_required: "basic", training_cost: 3000, integration_cost_estimate: 15000,
    spare_parts_availability: "excellent", typical_roi_months: 12, labor_replaced_fte: 1.5,
    throughput_description: "Handles 6-12 picks per minute. Cycle times from 4-30 seconds.",
    operating_environment: "indoor", temperature_range: "0°C to 50°C", noise_level_db: 72,
    certifications: ["CE", "UL", "ISO 10218-1", "ISO/TS 15066", "TÜV NORD"],
    safety_features: ["Force/torque sensing in all joints", "150N collision stop", "Reduced speed in collaborative mode", "Emergency stop", "Safety-rated monitored stop"],
  });

  await updateRobot("ur10e-v2", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Lease from $1,100/mo. Volume discounts for 3+ units.",
    power_source: "plug", power_consumption_watts: 300, operating_voltage: "100-240V AC, 50/60Hz",
    annual_maintenance_cost: 1800, warranty_years: 1, expected_lifespan_years: 10,
    training_required: "basic", training_cost: 3000, integration_cost_estimate: 18000,
    spare_parts_availability: "excellent", typical_roi_months: 11, labor_replaced_fte: 1.5,
    throughput_description: "12.5kg payload. 1300mm reach covers palletizing and machine tending.",
    operating_environment: "indoor", temperature_range: "0°C to 50°C", noise_level_db: 74,
    certifications: ["CE", "UL", "ISO 10218-1"],
    safety_features: ["Force/torque sensing", "Speed monitoring", "Emergency stop"],
  });

  await updateRobot("ur20-v2", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Lease from $1,300/mo. Volume discounts for 3+ units.",
    power_source: "plug", power_consumption_watts: 350, operating_voltage: "100-240V AC, 50/60Hz",
    annual_maintenance_cost: 2000, warranty_years: 1, expected_lifespan_years: 10,
    training_required: "basic", training_cost: 3000, integration_cost_estimate: 20000,
    spare_parts_availability: "excellent", typical_roi_months: 10, labor_replaced_fte: 2.0,
    throughput_description: "65% faster than UR10e. Palletizes 12-15 cases/min. 1750mm reach covers full pallet.",
    operating_environment: "indoor", temperature_range: "0°C to 50°C", noise_level_db: 75,
    certifications: ["CE", "UL", "ISO 10218-1"],
    safety_features: ["Force/torque sensing", "Configurable safety planes", "Speed monitoring", "Emergency stop"],
  });

  await updateRobot("ur30", {
    price_type: "purchase", financing_available: true, financing_notes: "Lease from $1,400/mo.",
    power_source: "plug", power_consumption_watts: 400, annual_maintenance_cost: 2200,
    warranty_years: 1, expected_lifespan_years: 10, training_required: "basic", training_cost: 3000,
    integration_cost_estimate: 22000, spare_parts_availability: "excellent", typical_roi_months: 10,
    labor_replaced_fte: 2.0, operating_environment: "indoor",
    certifications: ["CE", "UL", "ISO 10218-1"],
    safety_features: ["Force/torque sensing", "Emergency stop"],
  });

  await updateRobot("standard-bots-ro1", {
    price_type: "purchase", financing_available: true,
    financing_notes: "30-day free on-site trial. Financing available.",
    power_source: "plug", power_consumption_watts: 250,
    annual_maintenance_cost: 1200, warranty_years: 2, expected_lifespan_years: 10,
    training_required: "none", training_cost: 0, integration_cost_estimate: 5000,
    spare_parts_availability: "good", typical_roi_months: 8, labor_replaced_fte: 1.5,
    throughput_description: "AI-assisted programming cuts deployment from weeks to hours. Natural language task programming.",
    operating_environment: "indoor",
    certifications: ["CE", "UL"],
    safety_features: ["3D machine vision safety", "Vision-based collision avoidance", "Emergency stop"],
  });

  await updateRobot("fanuc-crx-10ia", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Available through FANUC authorized distributors. Lease options through third-party financiers.",
    power_source: "plug", power_consumption_watts: 250,
    annual_maintenance_cost: 1800, warranty_years: 1, expected_lifespan_years: 15,
    training_required: "intermediate", training_cost: 5000, integration_cost_estimate: 25000,
    spare_parts_availability: "excellent", typical_roi_months: 14, labor_replaced_fte: 1.5,
    throughput_description: "FANUC-grade reliability: 99.99% uptime. 1M+ hour MTBF. Runs 24/7.",
    operating_environment: "indoor", temperature_range: "0°C to 45°C", noise_level_db: 68,
    certifications: ["CE", "UL", "ISO 10218-1", "IP67"],
    safety_features: ["Contact detection via motor current", "Speed and separation monitoring", "Emergency stop"],
  });

  await updateRobot("abb-gofa", {
    price_type: "purchase", financing_available: true, financing_notes: "ABB Financial Services leasing available.",
    power_source: "plug", annual_maintenance_cost: 2000, warranty_years: 1, expected_lifespan_years: 12,
    training_required: "basic", training_cost: 4000, integration_cost_estimate: 20000,
    spare_parts_availability: "excellent", typical_roi_months: 12, labor_replaced_fte: 1.0,
    operating_environment: "indoor", certifications: ["CE", "UL", "ISO 10218-1", "IP54"],
    safety_features: ["Speed monitoring", "Force sensing", "Emergency stop"],
  });

  await updateRobot("kuka-lbr-iiwa", {
    price_type: "purchase", financing_available: true, financing_notes: "KUKA direct or through integrators.",
    power_source: "plug", annual_maintenance_cost: 3000, warranty_years: 1, expected_lifespan_years: 12,
    training_required: "intermediate", training_cost: 8000, integration_cost_estimate: 30000,
    spare_parts_availability: "excellent", typical_roi_months: 16, labor_replaced_fte: 1.5,
    operating_environment: "indoor",
    certifications: ["CE", "ISO 10218-1"],
    safety_features: ["7 joint torque sensors", "Force sensing", "Emergency stop"],
  });

  await updateRobot("franka-fr3", {
    price_type: "purchase", financing_available: false, financing_notes: "Academic discounts available.",
    power_source: "plug", annual_maintenance_cost: 800, warranty_years: 1, expected_lifespan_years: 8,
    training_required: "basic", training_cost: 1000, integration_cost_estimate: 5000,
    spare_parts_availability: "good", typical_roi_months: 6, operating_environment: "indoor",
    certifications: ["CE"], safety_features: ["7-axis torque sensing", "Emergency stop"],
  });

  // ── HUMANOIDS ──
  console.log("[BOT] Humanoids...");
  await updateRobot("unitree-g1-basic", {
    price_type: "purchase", financing_available: false,
    financing_notes: "Purchase only. Spare batteries ~$800 each. 6-8 week replacement parts from China.",
    power_source: "battery", battery_capacity_wh: 900, battery_runtime_hrs: 2.0, charge_time_hrs: 1.5,
    hot_swap_battery: true, annual_maintenance_cost: 3000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "advanced", training_cost: 0, integration_cost_estimate: 5000,
    spare_parts_availability: "limited", operating_environment: "indoor", temperature_range: "0°C to 40°C",
    certifications: ["CE"],
    safety_features: ["Emergency stop button", "Low-battery auto-shutdown", "Obstacle avoidance sensors"],
  });

  await updateRobot("unitree-g1-edu", {
    price_type: "purchase", financing_available: false, financing_notes: "Academic pricing available.",
    power_source: "battery", battery_capacity_wh: 900, battery_runtime_hrs: 2.0, charge_time_hrs: 1.5,
    hot_swap_battery: true, annual_maintenance_cost: 4000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "advanced", spare_parts_availability: "limited", operating_environment: "indoor",
  });

  await updateRobot("unitree-h1", {
    price_type: "purchase", financing_available: false,
    power_source: "battery", battery_runtime_hrs: 2.0, charge_time_hrs: 2.0,
    annual_maintenance_cost: 8000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "specialist", spare_parts_availability: "limited", operating_environment: "indoor",
  });

  await updateRobot("figure-02", {
    price_type: "contact", financing_available: false,
    financing_notes: "Enterprise deployment only. Lease/RaaS model expected for Figure 03.",
    power_source: "battery", battery_capacity_wh: 2250, battery_runtime_hrs: 5.0, charge_time_hrs: 1.5,
    annual_maintenance_cost: 25000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "specialist", training_cost: 50000, integration_cost_estimate: 100000,
    spare_parts_availability: "poor", typical_roi_months: 24, labor_replaced_fte: 1.0,
    throughput_description: "At BMW: loaded 90K+ sheet metal parts in 11 months. 84-second cycle time. 5mm placement tolerance.",
    operating_environment: "indoor",
    safety_features: ["Helix AI safety monitoring", "Speed limiting", "Emergency stop", "Human detection"],
  });

  await updateRobot("agility-digit", {
    price_type: "lease", price_lease_monthly: 20000, financing_available: true,
    financing_notes: "$15,000-25,000/month lease. Includes maintenance and software updates.",
    power_source: "battery", battery_runtime_hrs: 4.0, hot_swap_battery: true,
    annual_maintenance_cost: 0, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "intermediate", training_cost: 10000, integration_cost_estimate: 50000,
    spare_parts_availability: "limited", typical_roi_months: 18, labor_replaced_fte: 1.0,
    throughput_description: "Carries 35-lb totes. Works in existing warehouse layout. No infrastructure changes.",
    operating_environment: "indoor",
    safety_features: ["Human-aware navigation", "Speed reduction near people", "Emergency stop"],
  });

  await updateRobot("apptronik-apollo", {
    price_type: "contact", financing_available: false,
    financing_notes: "Pilot program only. Contact for enterprise deployment terms.",
    power_source: "battery", battery_runtime_hrs: 4.0, hot_swap_battery: true,
    annual_maintenance_cost: 20000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "specialist", training_cost: 30000, integration_cost_estimate: 75000,
    spare_parts_availability: "limited", typical_roi_months: 24, labor_replaced_fte: 1.0,
    throughput_description: "55-lb payload. Swappable battery packs for continuous operation.",
    operating_environment: "indoor",
    safety_features: ["NASA-heritage safety systems", "Force limiting", "Emergency stop"],
  });

  // ── CONSUMER ──
  console.log("[HOME] Consumer...");
  await updateRobot("roborock-s8-maxv-ultra-v2", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Amazon monthly payments. Affirm/Klarna financing at checkout.",
    power_source: "battery", battery_capacity_wh: 195, battery_runtime_hrs: 3.0, charge_time_hrs: 4.0,
    power_consumption_watts: 75, annual_maintenance_cost: 100, warranty_years: 2, expected_lifespan_years: 5,
    training_required: "none", training_cost: 0, integration_cost_estimate: 0,
    spare_parts_availability: "excellent", typical_roi_months: 6, labor_replaced_fte: 0.1,
    throughput_description: "Cleans 3,000 sq ft in ~90 min. 10,000Pa suction. Auto-empties, auto-fills, auto-washes mop.",
    operating_environment: "indoor", temperature_range: "0°C to 40°C", noise_level_db: 67,
    certifications: ["CE", "FCC", "UL"],
    safety_features: ["ReactiveAI 3D obstacle avoidance", "Cliff sensors", "Child lock", "No-go zones"],
  });

  await updateRobot("roomba-j9-plus", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Amazon monthly payments. iRobot Select subscription $29.99/mo includes robot + accessories.",
    power_source: "battery", battery_runtime_hrs: 2.0, charge_time_hrs: 3.0, power_consumption_watts: 45,
    annual_maintenance_cost: 80, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "none", training_cost: 0, integration_cost_estimate: 0,
    spare_parts_availability: "excellent", typical_roi_months: 8,
    throughput_description: "Covers 2,000+ sq ft per session. PrecisionVision avoids pet waste and cords.",
    operating_environment: "indoor", noise_level_db: 65,
    certifications: ["CE", "FCC", "UL"],
    safety_features: ["PrecisionVision obstacle avoidance", "Cliff detection", "Auto-recharge and resume"],
  });

  await updateRobot("ecovacs-t30-omni", {
    price_type: "purchase", financing_available: true, financing_notes: "Amazon payments. Various retailer financing.",
    power_source: "battery", battery_runtime_hrs: 2.5, annual_maintenance_cost: 90,
    warranty_years: 2, expected_lifespan_years: 5, training_required: "none",
    spare_parts_availability: "excellent", operating_environment: "indoor", noise_level_db: 65,
  });

  await updateRobot("dreame-x40-ultra", {
    price_type: "purchase", financing_available: true, financing_notes: "Available with Affirm/Klarna.",
    power_source: "battery", battery_runtime_hrs: 3.0, annual_maintenance_cost: 100,
    warranty_years: 2, expected_lifespan_years: 5, training_required: "none",
    spare_parts_availability: "excellent", operating_environment: "indoor", noise_level_db: 66,
  });

  // ── WAREHOUSE ──
  console.log("[PKG] Warehouse...");
  await updateRobot("boston-dynamics-stretch-v2", {
    price_type: "contact", financing_available: true,
    financing_notes: "Lease and purchase options. Enterprise volume discounts.",
    power_source: "battery", battery_runtime_hrs: 8.0, charge_time_hrs: 2.0,
    annual_maintenance_cost: 15000, warranty_years: 1, expected_lifespan_years: 7,
    training_required: "intermediate", training_cost: 10000, integration_cost_estimate: 30000,
    spare_parts_availability: "good", typical_roi_months: 18, labor_replaced_fte: 3.0,
    throughput_description: "Unloads 800 cases/hour. 50,000 lbs/day. Works in standard trailers.",
    operating_environment: "indoor",
    certifications: ["CE", "UL", "IP54"],
    safety_features: ["3D perception safety zones", "Speed monitoring", "Emergency stop", "Human detection"],
  });

  await updateRobot("locus-vector-v2", {
    price_type: "lease", price_lease_monthly: 1000, financing_available: true,
    financing_notes: "$1,000/month per robot. Volume discounts for 10+. Includes software, support, maintenance.",
    power_source: "battery", battery_runtime_hrs: 10.0, charge_time_hrs: 1.0,
    annual_maintenance_cost: 0, warranty_years: 1, expected_lifespan_years: 7,
    training_required: "basic", training_cost: 2000, integration_cost_estimate: 10000,
    spare_parts_availability: "good", typical_roi_months: 6, labor_replaced_fte: 0.5,
    throughput_description: "Increases picking productivity 2-3x. 300+ picks/hour per robot.",
    operating_environment: "indoor",
    certifications: ["CE", "UL"],
    safety_features: ["360° LiDAR obstacle avoidance", "Speed reduction near humans", "Emergency stop"],
  });

  await updateRobot("rapid-machine-operator", {
    price_type: "raas", price_lease_monthly: 2100, financing_available: true,
    financing_notes: "$2,100/month flat. Robot + software + support + hardware. No hidden fees. Cancel anytime.",
    power_source: "plug", annual_maintenance_cost: 0, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "none", training_cost: 0, integration_cost_estimate: 0,
    spare_parts_availability: "good", typical_roi_months: 3, labor_replaced_fte: 1.0,
    throughput_description: "Pre-trained for pick-and-place, labeling, assembly. Operational in days.",
    operating_environment: "indoor",
    safety_features: ["Collaborative safety rated", "Force limiting", "Emergency stop"],
  });

  // ── MEDICAL ──
  console.log("[MED] Medical...");
  await updateRobot("davinci-5", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Capital purchase, operating lease, and usage-based pricing. Per-procedure instrument costs ~$1,500-3,000.",
    power_source: "plug", power_consumption_watts: 3000, operating_voltage: "200-240V AC",
    annual_maintenance_cost: 180000, warranty_years: 1, expected_lifespan_years: 10,
    training_required: "specialist", training_cost: 100000, integration_cost_estimate: 500000,
    spare_parts_availability: "excellent", typical_roi_months: 36,
    throughput_description: "20-30% reduction in hospital stay. 50% less blood loss vs open surgery. 2M+ procedures/year.",
    operating_environment: "cleanroom",
    certifications: ["FDA 510(k)", "CE Mark", "ISO 13485", "IEC 60601"],
    safety_features: ["Redundant motion control", "Force feedback (v5)", "Surgeon-controlled", "Collision detection"],
  });

  await updateRobot("stryker-mako", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Capital purchase or per-procedure pricing. Stryker financing for hospital systems.",
    power_source: "plug", annual_maintenance_cost: 150000, warranty_years: 1, expected_lifespan_years: 10,
    training_required: "specialist", training_cost: 75000, integration_cost_estimate: 200000,
    spare_parts_availability: "excellent", typical_roi_months: 30,
    throughput_description: "CT-based 3D planning. Haptic boundaries prevent cutting outside plan. 30% less bone removal.",
    operating_environment: "cleanroom",
    certifications: ["FDA", "CE Mark", "ISO 13485"],
    safety_features: ["Haptic boundaries", "Real-time bone tracking", "Surgeon override", "AccuStop technology"],
  });

  // ── SPOT ──
  console.log("[PET] Spot...");
  await updateRobot("boston-dynamics-spot", {
    price_type: "purchase", financing_available: true,
    financing_notes: "Direct purchase. Enterprise leasing available. Volume discounts for fleet.",
    power_source: "battery", battery_capacity_wh: 605, battery_runtime_hrs: 1.5, charge_time_hrs: 2.0,
    hot_swap_battery: true, power_consumption_watts: 400,
    annual_maintenance_cost: 8000, warranty_years: 1, expected_lifespan_years: 5,
    training_required: "intermediate", training_cost: 5000, integration_cost_estimate: 20000,
    spare_parts_availability: "good", typical_roi_months: 12, labor_replaced_fte: 0.5,
    throughput_description: "Inspects entire facility autonomously. Reduces inspection time 50-75%.",
    operating_environment: "both", temperature_range: "-20°C to 45°C", noise_level_db: 70,
    certifications: ["CE", "IP54", "ATEX Zone 1 (optional)"],
    safety_features: ["360° obstacle avoidance", "Stair detection", "Auto-return low battery", "Remote emergency stop", "Geofencing"],
  });

  // ── AGRICULTURAL ──
  console.log("[AGRI] Agricultural...");
  await updateRobot("dji-agras-t50", {
    price_type: "purchase", financing_available: true,
    financing_notes: "DJI Agriculture dealers. Farm credit financing. Payback in 1-2 growing seasons.",
    power_source: "battery", battery_runtime_hrs: 0.15, charge_time_hrs: 0.5, hot_swap_battery: true,
    annual_maintenance_cost: 2000, warranty_years: 1, expected_lifespan_years: 3,
    training_required: "basic", training_cost: 1000, integration_cost_estimate: 2000,
    spare_parts_availability: "excellent", typical_roi_months: 8, labor_replaced_fte: 3.0,
    throughput_description: "Sprays 50 acres/hour. 40kg spray tank. 10x faster than manual. Reduces chemicals 30%.",
    operating_environment: "outdoor", temperature_range: "-10°C to 45°C",
    certifications: ["CE", "FCC", "IP67"],
    safety_features: ["Terrain following radar", "Obstacle avoidance", "RTK positioning", "Failsafe auto-land"],
  });

  // ── DRONES ──
  console.log("[DRONE] Drones...");
  await updateRobot("dji-mavic-3-pro", {
    price_type: "purchase", financing_available: true, financing_notes: "Available with payment plans at major retailers.",
    power_source: "battery", battery_runtime_hrs: 0.72, annual_maintenance_cost: 200,
    warranty_years: 1, expected_lifespan_years: 4, training_required: "basic",
    spare_parts_availability: "excellent", operating_environment: "outdoor",
    certifications: ["CE", "FCC"],
  });

  await updateRobot("skydio-x10", {
    price_type: "purchase", financing_available: true, financing_notes: "Enterprise pricing. Volume discounts.",
    power_source: "battery", battery_runtime_hrs: 0.58, annual_maintenance_cost: 1500,
    warranty_years: 1, expected_lifespan_years: 4, training_required: "basic", training_cost: 2000,
    spare_parts_availability: "good", operating_environment: "both",
    certifications: ["CE", "FCC", "IP55"],
    safety_features: ["Full AI autonomy", "360° obstacle avoidance", "GPS return-to-home"],
  });

  // ── APPLICATIONS ──
  console.log("\n[LIST] Applications...");

  // Clear existing applications to avoid duplicates
  await supabase.from("robot_applications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("  Cleared existing applications");

  // UR5e
  await insertApplication("ur5e-v2", { application_name: "CNC Machine Tending", industry: "Manufacturing", task_description: "Loading/unloading CNC machines. Picks raw parts, loads into chuck, starts cycle, unloads finished part.", time_savings_percent: 60, cost_savings_percent: 45, labor_savings_description: "Replaces 1 operator tending 2-3 machines per shift", cycle_time_seconds: 30, deployment_time_days: 14, difficulty: "easy", real_world_example: "Paradigm Electronics reduced cycle time by 50% and runs 3 CNC machines with 1 operator." });
  await insertApplication("ur5e-v2", { application_name: "Pick and Place", industry: "Manufacturing", task_description: "Picking parts from conveyor or bin and placing into packaging, trays, or fixtures.", time_savings_percent: 40, cost_savings_percent: 35, labor_savings_description: "Replaces 1-2 workers doing repetitive tasks", cycle_time_seconds: 4, deployment_time_days: 7, difficulty: "easy", real_world_example: "Tegra Medical automated syringe assembly with 0.025mm accuracy." });
  await insertApplication("ur5e-v2", { application_name: "Quality Inspection", industry: "Manufacturing", task_description: "Holding parts for vision systems or performing visual checks with onboard camera.", time_savings_percent: 50, cost_savings_percent: 30, labor_savings_description: "Reduces QC headcount by 1 per line", cycle_time_seconds: 8, deployment_time_days: 14, difficulty: "medium", real_world_example: "Continental Automotive achieves 99.8% defect detection." });

  // Spot
  await insertApplication("boston-dynamics-spot", { application_name: "Construction Site Inspection", industry: "Construction", task_description: "Autonomous walk-throughs capturing 360° imagery, thermal data, and laser scans.", time_savings_percent: 75, cost_savings_percent: 50, labor_savings_description: "One Spot replaces daily 2-hour manual inspection walks", deployment_time_days: 7, difficulty: "medium", real_world_example: "Skanska uses Spot for BIM-vs-reality comparisons weekly." });
  await insertApplication("boston-dynamics-spot", { application_name: "Oil & Gas Facility Inspection", industry: "Energy", task_description: "Routine inspection of pipelines, valves, gauges in hazardous areas. Detects leaks via thermal/acoustic.", time_savings_percent: 60, cost_savings_percent: 40, labor_savings_description: "Reduces human exposure to H2S. 1 Spot covers work of 2 inspectors.", deployment_time_days: 14, difficulty: "medium", real_world_example: "National Grid reduces substation inspection from 6 hours to 45 minutes." });

  // Stretch
  await insertApplication("boston-dynamics-stretch-v2", { application_name: "Truck Unloading", industry: "Logistics", task_description: "Autonomously unloading boxes from delivery trucks onto conveyors or pallets.", time_savings_percent: 70, cost_savings_percent: 55, labor_savings_description: "Replaces 2-3 workers per truck unloading bay. 800 cases/hour.", cycle_time_seconds: 4, deployment_time_days: 30, difficulty: "medium", real_world_example: "DHL: each Stretch replaces 3 manual unloaders per shift." });

  // da Vinci 5
  await insertApplication("davinci-5", { application_name: "Minimally Invasive Surgery", industry: "Healthcare", task_description: "Multi-port robotic surgery with 10x magnified 3D view and force feedback.", accuracy_percent: 99.7, deployment_time_days: 365, difficulty: "specialist", real_world_example: "10,000+ systems installed. 2M+ procedures annually. Gold standard." });

  // Locus Vector
  await insertApplication("locus-vector-v2", { application_name: "E-Commerce Order Picking", industry: "Logistics", task_description: "Robot travels to pick locations. Worker picks item, robot moves to next.", time_savings_percent: 200, cost_savings_percent: 40, labor_savings_description: "10 robots replace 5 full-time pickers", deployment_time_days: 14, difficulty: "easy", real_world_example: "DHL saw 200% productivity increase with Locus fleet." });

  // DJI Agras
  await insertApplication("dji-agras-t50", { application_name: "Crop Spraying", industry: "Agriculture", task_description: "Precision aerial spraying of herbicides, pesticides, and fertilizers.", time_savings_percent: 90, cost_savings_percent: 50, labor_savings_description: "One drone + operator replaces 3-person ground crew. 50 acres/hour.", deployment_time_days: 3, difficulty: "basic", real_world_example: "Japanese rice farmers report 90% time savings and 30% chemical reduction." });

  // Rapid Robotics
  await insertApplication("rapid-machine-operator", { application_name: "Box Taping & Labeling", industry: "Manufacturing", task_description: "Pre-trained robot cell that tapes, labels, and stages boxes. Plug-and-play.", time_savings_percent: 50, cost_savings_percent: 60, labor_savings_description: "At $2,100/mo, cheaper than minimum wage. Runs 2nd/3rd shifts without overtime.", cycle_time_seconds: 8, deployment_time_days: 3, difficulty: "easy", real_world_example: "WestecH saved $48,000/year with zero setup cost." });

  // Roborock
  await insertApplication("roborock-s8-maxv-ultra-v2", { application_name: "Home Floor Cleaning", industry: "Consumer", task_description: "Autonomous vacuum and mop for all floor types. Returns to dock automatically.", time_savings_percent: 95, labor_savings_description: "Saves 3-5 hours per week of manual cleaning. Runs daily while you work.", deployment_time_days: 0, difficulty: "easy", real_world_example: "Covers 3,000 sq ft in 90 min. Self-empties for 7 weeks." });

  // Figure 02
  await insertApplication("figure-02", { application_name: "Automotive Part Loading", industry: "Manufacturing", task_description: "Picking sheet metal parts from racks and placing into welding fixtures.", time_savings_percent: 40, cost_savings_percent: 30, labor_savings_description: "Replaces 1 associate per fixture loading station", cycle_time_seconds: 84, deployment_time_days: 180, difficulty: "expert", real_world_example: "BMW Spartanburg: 90K+ parts loaded, 30K+ BMW X3 vehicles produced." });

  // ── FINANCING OPTIONS ──
  console.log("\n[FIN] Financing options...");

  // Clear existing to avoid duplicates
  await supabase.from("financing_options").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  console.log("  Cleared existing financing");

  await insertFinancing("ur5e-v2", { provider: "UR Financial Services", type: "lease", monthly_payment: 850, term_months: 48, down_payment_percent: 10, includes_maintenance: false, includes_support: true, notes: "Standard 48-month operating lease." });
  await insertFinancing("ur5e-v2", { provider: "LEAF Commercial Capital", type: "loan", monthly_payment: 750, term_months: 60, down_payment_percent: 10, includes_maintenance: false, includes_support: false, notes: "Equipment financing. Own at end of term. Rates from 5.9% APR." });
  await insertFinancing("ur20-v2", { provider: "UR Financial Services", type: "lease", monthly_payment: 1300, term_months: 48, down_payment_percent: 10, includes_maintenance: false, includes_support: true, notes: "Operating lease with upgrade option at 36 months." });
  await insertFinancing("standard-bots-ro1", { provider: "Standard Bots Direct", type: "lease", monthly_payment: 950, term_months: 36, down_payment_percent: 0, includes_maintenance: true, includes_support: true, notes: "All-inclusive lease. 30-day free trial first." });
  await insertFinancing("rapid-machine-operator", { provider: "Rapid Robotics RaaS", type: "raas", monthly_payment: 2100, term_months: 0, down_payment_percent: 0, includes_maintenance: true, includes_support: true, notes: "Month-to-month. Cancel anytime. Everything included." });
  await insertFinancing("locus-vector-v2", { provider: "Locus Robotics Direct", type: "raas", monthly_payment: 1000, term_months: 12, down_payment_percent: 0, includes_maintenance: true, includes_support: true, notes: "12-month minimum. Volume discounts for 10+ units." });
  await insertFinancing("roomba-j9-plus", { provider: "Amazon Monthly Payments", type: "loan", monthly_payment: 67, term_months: 12, down_payment_percent: 0, includes_maintenance: false, includes_support: false, notes: "0% interest over 12 months on eligible accounts." });
  await insertFinancing("roomba-j9-plus", { provider: "iRobot Select", type: "raas", monthly_payment: 30, term_months: 0, down_payment_percent: 0, includes_maintenance: true, includes_support: true, notes: "Subscribe: $29.99/mo includes robot and accessories. Cancel anytime." });

  console.log("\n[OK] Buyer intelligence population complete!");
}

main().catch(console.error);
