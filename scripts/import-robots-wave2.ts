/**
 * Robotomated — Wave 2 Robot Import: 25 New Robots
 * Covers underrepresented categories:
 *   Agricultural: 8 robots
 *   Drones & Aerial: 6 robots
 *   Delivery & Last-Mile: 6 robots
 *   Robotics Software: 5 robots
 *
 * Run: npx tsx scripts/import-robots-wave2.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Placeholder images by category (Unsplash) ──
const categoryImages: Record<string, { url: string; alt: string }[]> = {
  agricultural: [
    { url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop", alt: "Precision agriculture technology" },
    { url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop", alt: "Farm automation" },
    { url: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=600&h=400&fit=crop", alt: "Agricultural drone" },
  ],
  drone: [
    { url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop", alt: "Drone in flight" },
    { url: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop", alt: "Commercial drone" },
    { url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=400&fit=crop", alt: "Drone aerial" },
  ],
  delivery: [
    { url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop", alt: "Delivery technology" },
    { url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop", alt: "Autonomous delivery" },
  ],
  software: [
    { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop", alt: "Robotics technology" },
    { url: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop", alt: "Software platform" },
  ],
};

const imgCounters: Record<string, number> = {};
function getImage(cat: string): { url: string; alt: string }[] {
  const set = categoryImages[cat] || categoryImages.software;
  const i = imgCounters[cat] || 0;
  imgCounters[cat] = i + 1;
  return [set[i % set.length]];
}

// ── New manufacturers to create ──
const newManufacturers = [
  { slug: "naio-technologies", name: "Naïo Technologies", country: "FR", founded_year: 2011, website: "https://naio-technologies.com" },
  { slug: "farmwise", name: "FarmWise (Syngenta)", country: "US", founded_year: 2016, website: "https://farmwise.io" },
  { slug: "verdant-robotics", name: "Verdant Robotics", country: "US", founded_year: 2018, website: "https://verdantrobotics.com" },
  { slug: "harvest-croo", name: "Harvest CROO Robotics", country: "US", founded_year: 2013, website: "https://harvestcroo.com" },
  { slug: "small-robot-company", name: "Small Robot Company", country: "GB", founded_year: 2017, website: "https://smallrobotcompany.com" },
  { slug: "iron-ox", name: "Iron Ox", country: "US", founded_year: 2015, website: "https://ironox.com" },
  { slug: "monarch-tractor", name: "Monarch Tractor", country: "US", founded_year: 2018, website: "https://monarchtractor.com" },
  { slug: "kiwibot", name: "Kiwibot (Robot.com)", country: "US", founded_year: 2017, website: "https://robot.com" },
  { slug: "coco-robotics", name: "Coco Robotics", country: "US", founded_year: 2020, website: "https://cocodelivery.com" },
  { slug: "ottonomy", name: "Ottonomy", country: "US", founded_year: 2020, website: "https://ottonomy.io" },
  { slug: "cartken", name: "Cartken", country: "US", founded_year: 2019, website: "https://cartken.com" },
  { slug: "clevon", name: "Clevon", country: "EE", founded_year: 2019, website: "https://clevon.com" },
  { slug: "autel-robotics", name: "Autel Robotics", country: "US", founded_year: 2014, website: "https://autelrobotics.com" },
  { slug: "freefly-systems", name: "Freefly Systems", country: "US", founded_year: 2011, website: "https://freeflysystems.com" },
  { slug: "wingtra", name: "Wingtra", country: "CH", founded_year: 2016, website: "https://wingtra.com" },
  { slug: "ageagle", name: "AgEagle Aerial Systems", country: "US", founded_year: 2010, website: "https://ageagle.com" },
  { slug: "viam", name: "Viam", country: "US", founded_year: 2020, website: "https://viam.com" },
  { slug: "formant", name: "Formant", country: "US", founded_year: 2017, website: "https://formant.io" },
  { slug: "inorbit", name: "InOrbit", country: "US", founded_year: 2018, website: "https://inorbit.ai" },
  { slug: "ready-robotics", name: "Ready Robotics", country: "US", founded_year: 2016, website: "https://readyrobotics.com" },
  { slug: "freedom-robotics", name: "Freedom Robotics", country: "US", founded_year: 2018, website: "https://freedomrobotics.com" },
];

// ── Robot data ──
interface RobotData {
  slug: string; name: string; mfr: string; cat: string;
  price: number | null; year: number; status: string;
  desc: string; specs: Record<string, unknown>;
  score: number; breakdown: Record<string, number>;
}

// RoboScore weights: performance 25%, reliability 20%, ease_of_use 15%,
// intelligence 15%, value 10%, ecosystem 8%, safety 5%, design 2%
function calcScore(b: Record<string, number>): number {
  return Math.round(
    (b.performance * 0.25 + b.reliability * 0.20 + b.ease_of_use * 0.15 +
     b.intelligence * 0.15 + b.value * 0.10 + b.ecosystem * 0.08 +
     b.safety * 0.05 + b.design * 0.02) * 10
  ) / 10;
}

const robots: RobotData[] = [
  // ═══════════════════════════════════════════════════════════════
  // AGRICULTURAL (8 robots)
  // ═══════════════════════════════════════════════════════════════
  (() => {
    const b = { performance: 72, reliability: 78, ease_of_use: 80, intelligence: 70, value: 82, ecosystem: 65, safety: 80, design: 68 };
    return { slug: "naio-oz", name: "Naïo Oz", mfr: "naio-technologies", cat: "agricultural", price: 35000, year: 2019, status: "active",
      desc: "Compact electric weeding robot for market gardens. LiFePO4 battery, RTK-GPS navigation, 7-hour autonomy. Handles 3 crop rows simultaneously.",
      specs: { weight_kg: 150, battery_hrs: 7, row_width_cm: "45-80", working_speed_kmh: 1.5, propulsion: "Electric 4WD", navigation: "RTK-GPS + camera" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 78, reliability: 80, ease_of_use: 75, intelligence: 72, value: 70, ecosystem: 68, safety: 82, design: 72 };
    return { slug: "naio-ted", name: "Naïo Ted", mfr: "naio-technologies", cat: "agricultural", price: 175000, year: 2022, status: "active",
      desc: "100% electric vineyard robot. 1,700 kg straddling design for precision inter-row weeding. Covers up to 5 ha/day autonomously.",
      specs: { weight_kg: 1700, battery_hrs: 8, working_width_m: 1.5, propulsion: "Electric", navigation: "RTK-GPS + LiDAR", coverage_ha_day: 5 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 80, reliability: 76, ease_of_use: 78, intelligence: 85, value: 72, ecosystem: 70, safety: 78, design: 75 };
    return { slug: "farmwise-titan-ft35", name: "FarmWise Titan FT-35", mfr: "farmwise", cat: "agricultural", price: 350000, year: 2024, status: "active",
      desc: "AI-powered autonomous weeding machine. 3-ton platform with high-res cameras and ML algorithms for sub-inch weed/crop discrimination. Covers 15-20 acres/day.",
      specs: { weight_kg: 3000, working_width_m: 3.5, coverage_acres_day: 20, compute: "NVIDIA GPU array", vision: "Multi-spectral cameras", accuracy_mm: 25 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 82, reliability: 74, ease_of_use: 76, intelligence: 88, value: 68, ecosystem: 65, safety: 80, design: 78 };
    return { slug: "verdant-spraybox", name: "Verdant Robotics Spraybox", mfr: "verdant-robotics", cat: "agricultural", price: null, year: 2024, status: "active",
      desc: "Multi-action robotic platform: weeds, fertilizes, and collects crop data in one pass. Millimeter-accurate micro-dosing reduces chemical use by 99%.",
      specs: { working_speed_mph: 5, accuracy_mm: 1, chemical_reduction: "99%", compute: "Custom AI", actions: "Weed, fertilize, thin, data collection" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 75, reliability: 72, ease_of_use: 70, intelligence: 78, value: 65, ecosystem: 55, safety: 76, design: 70 };
    return { slug: "harvest-croo-berry", name: "Harvest CROO Berry Harvester", mfr: "harvest-croo", cat: "agricultural", price: null, year: 2023, status: "active",
      desc: "Autonomous strawberry harvesting robot. Computer vision identifies ripe berries, robotic arms pick and pack. Per-acre service model ($300-500/acre).",
      specs: { berries_per_second: 8, vision: "Multi-camera computer vision", service_price_per_acre: "$300-500", picks_per_hour: 28000 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 70, reliability: 75, ease_of_use: 82, intelligence: 74, value: 78, ecosystem: 60, safety: 80, design: 72 };
    return { slug: "small-robot-tom", name: "Small Robot Company Tom", mfr: "small-robot-company", cat: "agricultural", price: null, year: 2023, status: "active",
      desc: "Lightweight autonomous scout robot for arable farming. Per-plant monitoring with AI-powered crop analysis. Farming-as-a-Service model.",
      specs: { weight_kg: 20, battery_hrs: 12, coverage_ha_day: 20, sensors: "Multispectral camera, GPS", compute: "Edge AI" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 78, reliability: 80, ease_of_use: 72, intelligence: 82, value: 70, ecosystem: 62, safety: 78, design: 80 };
    return { slug: "iron-ox-grover", name: "Iron Ox Grover", mfr: "iron-ox", cat: "agricultural", price: null, year: 2023, status: "active",
      desc: "Autonomous greenhouse robot. AI-controlled growing from seed to harvest. Manages 30x denser planting than traditional farms. Uses 90% less water.",
      specs: { water_reduction: "90%", density_multiplier: "30x", compute: "Custom AI (Cerebral)", sensors: "Computer vision + environmental" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 82, reliability: 78, ease_of_use: 85, intelligence: 80, value: 75, ecosystem: 72, safety: 82, design: 80 };
    return { slug: "monarch-mk-v", name: "Monarch Tractor MK-V", mfr: "monarch-tractor", cat: "agricultural", price: 78000, year: 2024, status: "active",
      desc: "Fully electric, autonomous smart tractor. 70 HP equivalent. Driver-optional with camera-based obstacle avoidance. Collects per-acre farm data.",
      specs: { horsepower_eq: 70, battery_hrs: 10, weight_kg: 3100, sensors: "6 cameras, LiDAR, IMU", compute: "NVIDIA Jetson", three_point_hitch: "Category 2" },
      score: calcScore(b), breakdown: b };
  })(),

  // ═══════════════════════════════════════════════════════════════
  // DRONES & AERIAL (6 robots)
  // ═══════════════════════════════════════════════════════════════
  (() => {
    const b = { performance: 88, reliability: 85, ease_of_use: 82, intelligence: 80, value: 78, ecosystem: 75, safety: 82, design: 88 };
    return { slug: "autel-evo-max-4t", name: "Autel EVO Max 4T", mfr: "autel-robotics", cat: "drone", price: 9999, year: 2024, status: "active",
      desc: "Enterprise inspection drone with quad-sensor gimbal: wide, zoom, thermal, and laser rangefinder. 42-min flight time. IP43. NDAA-compliant.",
      specs: { weight_kg: 1.8, flight_time_min: 42, max_speed_ms: 23, range_km: 20, sensors: "Wide + 160x Zoom + Thermal + LRF", ip_rating: "IP43", transmission: "SkyLink 3.0" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 85, reliability: 82, ease_of_use: 78, intelligence: 76, value: 72, ecosystem: 70, safety: 80, design: 85 };
    return { slug: "freefly-astro-max", name: "Freefly Astro Max", mfr: "freefly-systems", cat: "drone", price: 16500, year: 2025, status: "active",
      desc: "Heavy-lift commercial drone for mapping and inspection. Open payload system supporting up to 6.8 kg. 51-min flight time. Carbon fiber frame. US-made.",
      specs: { weight_kg: 3, payload_kg: 6.8, flight_time_min: 51, range_km: 20, frame: "Carbon fiber", compute: "Open system" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 86, reliability: 88, ease_of_use: 85, intelligence: 82, value: 70, ecosystem: 78, safety: 85, design: 82 };
    return { slug: "wingtra-one-gen2", name: "WingtraOne Gen II", mfr: "wingtra", cat: "drone", price: 29000, year: 2024, status: "active",
      desc: "VTOL mapping drone for surveying, mining, and construction. Fixed-wing efficiency with vertical takeoff. 59-min endurance. Sub-centimeter accuracy with PPK.",
      specs: { weight_kg: 4.5, flight_time_min: 59, coverage_km2: 4, payload_kg: 0.8, accuracy_cm: 1, takeoff: "VTOL", propulsion: "Hybrid fixed-wing" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 84, reliability: 86, ease_of_use: 80, intelligence: 78, value: 75, ecosystem: 72, safety: 82, design: 78 };
    return { slug: "ageagle-ebee-x", name: "AgEagle eBee X", mfr: "ageagle", cat: "drone", price: 22000, year: 2023, status: "active",
      desc: "Long-endurance fixed-wing mapping drone. 90-min flight time covering 1,200 acres/flight. Swappable RGB, multispectral, and thermal payloads. NDAA-compliant.",
      specs: { weight_kg: 1.6, flight_time_min: 90, coverage_acres: 1200, wingspan_cm: 116, payloads: "RGB, Multispectral, Thermal" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 90, reliability: 82, ease_of_use: 88, intelligence: 88, value: 80, ecosystem: 85, safety: 85, design: 90 };
    return { slug: "skydio-x10", name: "Skydio X10", mfr: "skydio", cat: "drone", price: 14000, year: 2024, status: "active",
      desc: "AI-powered enterprise drone with 65-min flight time. 6-camera obstacle avoidance. 3D Scan and autonomous inspection workflows. US-made, NDAA-compliant.",
      specs: { weight_kg: 2.2, flight_time_min: 65, max_speed_ms: 18, sensors: "6x navigation cameras + payload", compute: "NVIDIA Orin", ip_rating: "IP55", autonomy: "Skydio Autonomy Engine" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 88, reliability: 84, ease_of_use: 78, intelligence: 82, value: 82, ecosystem: 80, safety: 80, design: 85 };
    return { slug: "dji-agras-t50", name: "DJI Agras T50", mfr: "dji", cat: "drone", price: 18000, year: 2024, status: "active",
      desc: "Agricultural spraying drone. 40 kg spray tank, 50 kg spreading capacity. Dual atomized sprayers. Active phased-array radar for terrain following.",
      specs: { weight_kg: 52, payload_spray_kg: 40, payload_spread_kg: 50, flight_time_min: 18, spray_rate_ha_hr: 21, radar: "Active phased-array", ip_rating: "IP67" },
      score: calcScore(b), breakdown: b };
  })(),

  // ═══════════════════════════════════════════════════════════════
  // DELIVERY & LAST-MILE (6 robots)
  // ═══════════════════════════════════════════════════════════════
  (() => {
    const b = { performance: 72, reliability: 75, ease_of_use: 88, intelligence: 74, value: 85, ecosystem: 72, safety: 78, design: 80 };
    return { slug: "kiwibot-v4", name: "Kiwibot v4 (Robot.com)", mfr: "kiwibot", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "Campus delivery robot with 500+ units deployed. 1.7M+ deliveries completed. 30 lb payload. Wireless charging. Partnerships with Sodexo, Grubhub, Aramark.",
      specs: { weight_kg: 20, payload_kg: 13.6, max_speed_mph: 3, battery_hrs: 10, range_miles: 12, dimensions_cm: "56x43x56" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 75, reliability: 78, ease_of_use: 85, intelligence: 78, value: 80, ecosystem: 75, safety: 80, design: 82 };
    return { slug: "coco-delivery-v3", name: "Coco Delivery Robot v3", mfr: "coco-robotics", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "Hybrid autonomy sidewalk delivery robot. 1,000+ units produced, 500K+ deliveries, 1M+ miles. 3,000 restaurant partners. Human teleoperator assist.",
      specs: { payload_kg: 11, max_speed_mph: 5, deliveries_completed: "500,000+", merchant_partners: 3000, autonomy_model: "Hybrid + teleop" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 74, reliability: 76, ease_of_use: 82, intelligence: 76, value: 78, ecosystem: 68, safety: 80, design: 78 };
    return { slug: "ottonomy-ottobot-2", name: "Ottonomy Ottobot 2.0", mfr: "ottonomy", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "Indoor/outdoor delivery robot for airports, malls, and retail. Deployed across Europe, India, and North America. Compartmentalized delivery bays.",
      specs: { payload_kg: 15, max_speed_mph: 4, battery_hrs: 8, environments: "Indoor + outdoor", compartments: 3 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 72, reliability: 78, ease_of_use: 84, intelligence: 76, value: 82, ecosystem: 70, safety: 82, design: 76 };
    return { slug: "cartken-model-c", name: "Cartken Model C", mfr: "cartken", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "Compact sidewalk delivery robot from ex-Google engineers. Profitable with under $25M raised. Operating in Japan, Europe, US via Mitsubishi and Grubhub.",
      specs: { payload_kg: 10, max_speed_mph: 4, battery_hrs: 12, compute: "Custom AI", partnerships: "Mitsubishi, Grubhub" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 80, reliability: 76, ease_of_use: 78, intelligence: 80, value: 72, ecosystem: 65, safety: 82, design: 80 };
    return { slug: "clevon-1", name: "Clevon 1", mfr: "clevon", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "All-electric autonomous road courier. Multi-compartment design for multi-stop deliveries. Operates in mixed traffic up to 25 mph. Modular cargo pod.",
      specs: { max_speed_mph: 25, payload_kg: 200, range_miles: 60, battery: "Electric", compartments: "Modular multi-stop", length_m: 3.5 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 78, reliability: 80, ease_of_use: 82, intelligence: 78, value: 75, ecosystem: 78, safety: 85, design: 78 };
    return { slug: "starship-s3", name: "Starship S3", mfr: "starship", cat: "delivery", price: null, year: 2024, status: "active",
      desc: "Third-gen sidewalk delivery robot. 7M+ deliveries worldwide. Operates across 100+ US college campuses. 20 lb payload. 4 mph cruise speed.",
      specs: { payload_kg: 9, max_speed_mph: 4, deliveries_total: "7,000,000+", campuses: "100+", battery_hrs: 18, wheels: 6 },
      score: calcScore(b), breakdown: b };
  })(),

  // ═══════════════════════════════════════════════════════════════
  // ROBOTICS SOFTWARE & INFRASTRUCTURE (5 robots)
  // ═══════════════════════════════════════════════════════════════
  (() => {
    const b = { performance: 85, reliability: 82, ease_of_use: 88, intelligence: 85, value: 80, ecosystem: 90, safety: 78, design: 82 };
    return { slug: "viam-platform", name: "Viam Robotics Platform", mfr: "viam", cat: "software", price: null, year: 2023, status: "active",
      desc: "Full-stack robotics software platform. Multi-language SDKs (Python, Go, TypeScript). Hardware-abstracted APIs, fleet management, data pipelines. $30M+ raised.",
      specs: { languages: "Python, Go, TypeScript, C++", features: "Fleet management, ML pipelines, data sync", protocols: "gRPC, WebRTC", cloud: "Viam Cloud", hardware_support: "Any robot, any sensor" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 82, reliability: 80, ease_of_use: 85, intelligence: 80, value: 78, ecosystem: 82, safety: 75, design: 78 };
    return { slug: "formant-platform", name: "Formant Robot Operations", mfr: "formant", cat: "software", price: null, year: 2020, status: "active",
      desc: "Cloud-based robot operations platform. Real-time telemetry, remote teleoperation, fleet analytics. Integrates with ROS/ROS2. Used by 50+ robot companies.",
      specs: { features: "Telemetry, teleoperation, fleet analytics, alerts", integrations: "ROS, ROS2, custom", latency_ms: "<100", customers: "50+ robot companies" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 80, reliability: 82, ease_of_use: 82, intelligence: 82, value: 80, ecosystem: 78, safety: 75, design: 75 };
    return { slug: "inorbit-platform", name: "InOrbit Robot Management", mfr: "inorbit", cat: "software", price: null, year: 2020, status: "active",
      desc: "Multi-vendor robot fleet management platform. Real-time observability, mission management, and analytics. Connects heterogeneous fleets from different manufacturers.",
      specs: { features: "Fleet management, observability, analytics, APIs", multi_vendor: true, integrations: "ROS, ROS2, REST API", deployment: "Cloud + edge" },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 84, reliability: 80, ease_of_use: 90, intelligence: 82, value: 76, ecosystem: 80, safety: 78, design: 78 };
    return { slug: "ready-robotics-forge-os", name: "Ready Robotics Forge/OS", mfr: "ready-robotics", cat: "software", price: null, year: 2021, status: "active",
      desc: "Universal robot programming platform. Program any industrial robot with a single interface. No-code task builder. Supports FANUC, ABB, UR, KUKA, and more.",
      specs: { supported_brands: "FANUC, ABB, UR, KUKA, Yaskawa, Doosan", interface: "No-code drag-and-drop", features: "Task builder, simulation, deployment", switching_time_min: 30 },
      score: calcScore(b), breakdown: b };
  })(),
  (() => {
    const b = { performance: 78, reliability: 80, ease_of_use: 82, intelligence: 78, value: 82, ecosystem: 76, safety: 75, design: 74 };
    return { slug: "freedom-robotics-platform", name: "Freedom Robotics Platform", mfr: "freedom-robotics", cat: "software", price: null, year: 2020, status: "active",
      desc: "Robot-agnostic monitoring and control platform. Instant ROS integration. Real-time diagnostics, alerts, remote control. Free tier available.",
      specs: { features: "Monitoring, control, diagnostics, alerts", integrations: "ROS, ROS2, custom agents", pricing: "Free tier + enterprise", deployment: "Cloud" },
      score: calcScore(b), breakdown: b };
  })(),
];

// ═══════════════════════════════════════════════════════════════
// MAIN IMPORT
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Wave 2 Import: 25 New Robots");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Ensure categories exist (load existing)
  const { data: cats } = await supabase.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);
  console.log(`[DIR] Categories loaded: ${catMap.size}\n`);

  // 2. Upsert manufacturers
  console.log("[MFR] Upserting manufacturers...");
  const mfrMap = new Map<string, string>();
  let mfrsCreated = 0;

  // Load existing manufacturers first
  const { data: existingMfrs } = await supabase.from("manufacturers").select("id, slug");
  for (const m of existingMfrs || []) mfrMap.set(m.slug, m.id);

  for (const mfr of newManufacturers) {
    if (mfrMap.has(mfr.slug)) continue;

    const { data: created, error } = await supabase.from("manufacturers").insert({
      slug: mfr.slug, name: mfr.name, country: mfr.country,
      founded_year: mfr.founded_year, website: mfr.website, verified: true,
    }).select("id").single();

    if (error) {
      console.error(`  [ERR] ${mfr.slug}: ${error.message}`);
      continue;
    }
    mfrMap.set(mfr.slug, created!.id);
    mfrsCreated++;
    console.log(`  [OK] Created: ${mfr.name}`);
  }
  console.log(`  Manufacturers: ${mfrsCreated} created\n`);

  // 3. Insert robots
  console.log("[BOT] Importing robots...");
  let inserted = 0, skipped = 0, errored = 0;

  for (const r of robots) {
    const { data: existing } = await supabase.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { skipped++; continue; }

    const mfrId = mfrMap.get(r.mfr);
    const catId = catMap.get(r.cat);
    if (!mfrId) { console.error(`  [ERR] ${r.slug}: manufacturer "${r.mfr}" not found`); errored++; continue; }
    if (!catId) { console.error(`  [ERR] ${r.slug}: category "${r.cat}" not found`); errored++; continue; }

    const images = getImage(r.cat);

    const { error } = await supabase.from("robots").insert({
      slug: r.slug,
      name: r.name,
      manufacturer_id: mfrId,
      category_id: catId,
      price_msrp: r.price,
      price_current: r.price,
      year_released: r.year,
      status: r.status as "active" | "discontinued" | "coming_soon",
      description_short: r.desc,
      specs: r.specs,
      images,
      robo_score: r.score > 0 ? r.score : null,
      score_breakdown: r.score > 0 ? r.breakdown : null,
    });

    if (error) {
      console.error(`  [ERR] ${r.slug}: ${error.message}`);
      errored++;
    } else {
      inserted++;
      console.log(`  [OK] ${r.name} (${r.cat}) — RoboScore: ${r.score}`);
    }
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`[STATS] Wave 2 Import Summary`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Manufacturers: ${mfrsCreated} new`);
  console.log(`  Robots:        ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`${"═".repeat(50)}`);
}

main().catch(console.error);
