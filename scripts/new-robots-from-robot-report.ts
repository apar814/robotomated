/**
 * Robotomated — New Robots from Robot Report Coverage
 *
 * Staging file: 30 new robots identified from The Robot Report, IEEE Spectrum,
 * and industry sources that are NOT yet in the Robotomated database.
 *
 * Each entry includes: name, manufacturer, category, estimated specs, and
 * rationale for addition. These robots fill gaps in underrepresented categories:
 *   - Humanoid (Figure 01, Optimus Gen 3, Unitree G1 Pro, etc.)
 *   - Security (Knightscope K7, SMP Robotics S5.2, etc.)
 *   - Hospitality (Bear Robotics Carti, Pudu HolaBot, etc.)
 *
 * Category IDs (from migration 015 + existing):
 *   humanoid:    c1000001-0000-0000-0000-000000000003
 *   security:    c1000001-0000-0000-0000-000000000001
 *   hospitality: c1000001-0000-0000-0000-000000000002
 *   warehouse:   a0000001-0000-0000-0000-000000000001
 *   manufacturing: a0000001-0000-0000-0000-000000000002
 *   consumer:    a0000001-0000-0000-0000-000000000003
 *   delivery:    a0000001-0000-0000-0000-000000000005
 *   medical:     d355ec0f-...
 *   construction: f37b2526-...
 *
 * Run: npx tsx scripts/new-robots-from-robot-report.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// RoboScore weights: performance 25%, reliability 20%, ease_of_use 15%,
// intelligence 15%, value 10%, ecosystem 8%, safety 5%, design 2%
function cs(b: Record<string, number>): number {
  return Math.round(
    (b.performance * 0.25 + b.reliability * 0.20 + b.ease_of_use * 0.15 +
     b.intelligence * 0.15 + b.value * 0.10 + b.ecosystem * 0.08 +
     b.safety * 0.05 + b.design * 0.02) * 10
  ) / 10;
}

interface NewRobotStaging {
  slug: string;
  name: string;
  manufacturer: string;
  manufacturer_slug: string;
  category: string;
  estimated_price: number | null;
  year_released: number;
  status: "active" | "coming_soon" | "discontinued";
  description: string;
  estimated_specs: Record<string, unknown>;
  robo_score: number;
  score_breakdown: Record<string, number>;
  why_add: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// New manufacturers needed for these robots
// ═══════════════════════════════════════════════════════════════════════════
const newManufacturers = [
  { slug: "smp-robotics", name: "SMP Robotics", country: "US", founded_year: 2016, website: "https://smprobotics.com" },
  { slug: "relay-robotics", name: "Relay Robotics (Savioke)", country: "US", founded_year: 2013, website: "https://www.relayrobotics.com" },
  { slug: "keenbot", name: "Keenbot (OrionStar)", country: "CN", founded_year: 2016, website: "https://keenbot.com" },
  { slug: "techi-butler", name: "Techi Butler", country: "CN", founded_year: 2018, website: "https://techirobots.com" },
  { slug: "agilex-robotics", name: "AgileX Robotics", country: "CN", founded_year: 2019, website: "https://agilexrobotics.com" },
  { slug: "robotis", name: "ROBOTIS", country: "KR", founded_year: 1999, website: "https://www.robotis.com" },
  { slug: "galbot", name: "Galbot", country: "CN", founded_year: 2023, website: "https://galbot.com" },
  { slug: "astra-robotics", name: "Astra Robotics", country: "US", founded_year: 2022, website: "https://astrarobotics.ai" },
];

// ═══════════════════════════════════════════════════════════════════════════
// 30 NEW ROBOTS — Staged for import
// ═══════════════════════════════════════════════════════════════════════════
const newRobots: NewRobotStaging[] = [

  // ─── HUMANOID (10) ───────────────────────────────────────────────────
  {
    slug: "figure-01",
    name: "Figure 01",
    manufacturer: "Figure AI",
    manufacturer_slug: "figure-ai",
    category: "humanoid",
    estimated_price: null,
    year_released: 2024,
    status: "discontinued",
    description: "Figure AI's first-generation humanoid robot. OpenAI partnership for conversational reasoning. Demonstrated autonomous coffee-making and object manipulation at BMW Spartanburg plant. Retired in favor of Figure 02/03.",
    estimated_specs: { height_cm: 168, weight_kg: 60, payload_kg: 20, dof: 16, battery_hrs: 5, max_speed_ms: 1.2, compute: "Custom + OpenAI cloud" },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 65, ease_of_use: 68, intelligence: 78, value: 60, ecosystem: 55, safety: 70, design: 80 },
    why_add: "Historically significant as the first Figure AI humanoid. OpenAI partnership was landmark moment for embodied AI. Provides product lineage context for Figure 02/03."
  },
  {
    slug: "tesla-optimus-gen3",
    name: "Tesla Optimus Gen 3",
    manufacturer: "Tesla",
    manufacturer_slug: "tesla",
    category: "humanoid",
    estimated_price: 25000,
    year_released: 2025,
    status: "coming_soon",
    description: "Third-generation Tesla humanoid with redesigned actuators and 22 DOF hands. Targets sub-$25K price for mass production. End-to-end neural network trained on Tesla FSD data. Walking autonomously in Tesla factories.",
    estimated_specs: { height_cm: 173, weight_kg: 56, dof: 30, hands_dof: 22, compute: "Tesla HW5 / Dojo", battery_hrs: 6, target_price: "$20-25K" },
    robo_score: 0, score_breakdown: { performance: 76, reliability: 68, ease_of_use: 72, intelligence: 80, value: 85, ecosystem: 65, safety: 70, design: 80 },
    why_add: "Major upgrade from Gen 2. Target price point would be revolutionary. Elon Musk claims 1000+ units in Tesla factories by end of 2025. Robot Report tracks closely."
  },
  {
    slug: "unitree-g1-pro",
    name: "Unitree G1 Pro",
    manufacturer: "Unitree Robotics",
    manufacturer_slug: "unitree-robotics",
    category: "humanoid",
    estimated_price: 35000,
    year_released: 2025,
    status: "active",
    description: "Enhanced version of the G1 with upgraded dexterous hands (Dex3-1), improved torque density actuators, and extended 3-hour battery life. Full SDK with ROS2 support. The most affordable full-featured research humanoid.",
    estimated_specs: { height_cm: 132, weight_kg: 37, payload_kg: 5, dof: 43, battery_hrs: 3, max_speed_ms: 2, compute: "NVIDIA Jetson Orin 100 TOPS", hands: "Dex3-1 dexterous" },
    robo_score: 0, score_breakdown: { performance: 82, reliability: 74, ease_of_use: 84, intelligence: 82, value: 90, ecosystem: 78, safety: 68, design: 78 },
    why_add: "Fills gap between G1 Basic/EDU and H1. Dex3-1 hands are a breakthrough for affordable dexterous manipulation. Robot Report featured extensively."
  },
  {
    slug: "unitree-h1-2",
    name: "Unitree H1-2",
    manufacturer: "Unitree Robotics",
    manufacturer_slug: "unitree-robotics",
    category: "humanoid",
    estimated_price: 120000,
    year_released: 2025,
    status: "active",
    description: "Second-generation H1 with 5-finger dexterous hands. 4.0 m/s running speed (upgraded from 3.3 m/s). Improved whole-body control via sim-to-real reinforcement learning. Enterprise deployments in logistics and manufacturing.",
    estimated_specs: { height_cm: 180, weight_kg: 50, payload_kg: 15, dof: 33, battery_hrs: 3, max_speed_ms: 4.0, compute: "NVIDIA Orin", hands: "5-finger dexterous" },
    robo_score: 0, score_breakdown: { performance: 92, reliability: 80, ease_of_use: 80, intelligence: 88, value: 80, ecosystem: 78, safety: 75, design: 88 },
    why_add: "World speed record holder among humanoids. Dexterous hand upgrade is significant. Key competitor to Figure and Tesla in enterprise humanoid space."
  },
  {
    slug: "galbot-g1",
    name: "Galbot G1",
    manufacturer: "Galbot",
    manufacturer_slug: "galbot",
    category: "humanoid",
    estimated_price: 16000,
    year_released: 2025,
    status: "coming_soon",
    description: "Ultra-affordable wheeled humanoid from Chinese startup. Upper body humanoid on mobile wheeled base. 19 DOF arms with 5-finger hands. Targets home and light commercial use at under $20K.",
    estimated_specs: { height_cm: 165, weight_kg: 45, payload_kg: 5, dof: 38, battery_hrs: 4, compute: "NVIDIA Orin NX", locomotion: "Wheeled base + humanoid upper body" },
    robo_score: 0, score_breakdown: { performance: 70, reliability: 65, ease_of_use: 76, intelligence: 74, value: 88, ecosystem: 50, safety: 68, design: 74 },
    why_add: "Part of the Chinese humanoid wave. Sub-$20K pricing could open new market segment. Robot Report covered as potential disruptor."
  },
  {
    slug: "robotis-op3-plus",
    name: "ROBOTIS OP3+",
    manufacturer: "ROBOTIS",
    manufacturer_slug: "robotis",
    category: "humanoid",
    estimated_price: 12000,
    year_released: 2024,
    status: "active",
    description: "Research-grade miniature humanoid platform. 20 DOF with Dynamixel servos. Open-source ROS-based. Used in RoboCup competitions and university AI research worldwide. The gold standard for humanoid locomotion research.",
    estimated_specs: { height_cm: 51, weight_kg: 3.5, dof: 20, servos: "Dynamixel XM430", compute: "Intel NUC", framework: "ROS1/ROS2" },
    robo_score: 0, score_breakdown: { performance: 68, reliability: 78, ease_of_use: 82, intelligence: 72, value: 78, ecosystem: 85, safety: 80, design: 72 },
    why_add: "Standard platform for academic humanoid research. RoboCup staple. Open-source ecosystem is important for the humanoid development pipeline."
  },
  {
    slug: "agilex-cobot-s-pro",
    name: "AgileX CobotS Pro",
    manufacturer: "AgileX Robotics",
    manufacturer_slug: "agilex-robotics",
    category: "humanoid",
    estimated_price: 28000,
    year_released: 2025,
    status: "active",
    description: "Wheeled mobile manipulation platform with dual 7-DOF arms. ROS2-native. Designed for research in embodied AI and mobile manipulation. Growing presence in university labs as alternative to custom platforms.",
    estimated_specs: { height_cm: 160, weight_kg: 65, payload_per_arm_kg: 5, dof: 14, base: "Omnidirectional wheeled", compute: "NVIDIA Jetson AGX Orin", framework: "ROS2" },
    robo_score: 0, score_breakdown: { performance: 74, reliability: 74, ease_of_use: 80, intelligence: 76, value: 82, ecosystem: 72, safety: 76, design: 74 },
    why_add: "Growing category of wheeled humanoid-style manipulation platforms. Important for embodied AI research. Featured in Robot Report's mobile manipulation coverage."
  },
  {
    slug: "sanctuary-phoenix-gen-8",
    name: "Sanctuary AI Phoenix Gen 8",
    manufacturer: "Sanctuary AI",
    manufacturer_slug: "sanctuary-ai",
    category: "humanoid",
    estimated_price: null,
    year_released: 2025,
    status: "coming_soon",
    description: "Latest generation of Sanctuary's general-purpose humanoid. Carbon AI foundation model enables autonomous task learning. 20+ DOF hands with tactile sensing. Magna International partnership for automotive manufacturing deployment.",
    estimated_specs: { height_cm: 170, weight_kg: 70, hands_dof: 20, tactile_sensing: true, compute: "Carbon AI v8", partner: "Magna International" },
    robo_score: 0, score_breakdown: { performance: 84, reliability: 76, ease_of_use: 80, intelligence: 88, value: 68, ecosystem: 65, safety: 78, design: 80 },
    why_add: "Most dexterous hands in the humanoid industry. Carbon AI is among the most advanced robot foundation models. Magna partnership signals automotive industry interest."
  },
  {
    slug: "astra-humanoid-a1",
    name: "Astra A1",
    manufacturer: "Astra Robotics",
    manufacturer_slug: "astra-robotics",
    category: "humanoid",
    estimated_price: null,
    year_released: 2025,
    status: "coming_soon",
    description: "US-based humanoid startup focusing on general-purpose domestic robots. Vision-language-action model for natural language task instruction. Early demos show kitchen and household tasks.",
    estimated_specs: { height_cm: 170, weight_kg: 65, dof: 32, compute: "Custom VLA model", target: "Household tasks" },
    robo_score: 0, score_breakdown: { performance: 68, reliability: 60, ease_of_use: 74, intelligence: 78, value: 65, ecosystem: 45, safety: 68, design: 76 },
    why_add: "Represents the new wave of US humanoid startups. VLA-first approach is representative of 2025 trends. Robot Report covered their seed round."
  },
  {
    slug: "boston-dynamics-atlas-commercial",
    name: "Boston Dynamics Atlas (Commercial)",
    manufacturer: "Boston Dynamics",
    manufacturer_slug: "boston-dynamics",
    category: "humanoid",
    estimated_price: null,
    year_released: 2025,
    status: "coming_soon",
    description: "Commercial deployment version of electric Atlas for Hyundai manufacturing lines. Focused on automotive assembly tasks. Enhanced gripper end-effectors and longer battery life vs demo unit. First non-research humanoid from Boston Dynamics.",
    estimated_specs: { height_cm: 150, weight_kg: 89, dof: 28, battery_hrs: 4, compute: "Custom", grippers: "Task-specific end-effectors", partner: "Hyundai" },
    robo_score: 0, score_breakdown: { performance: 92, reliability: 82, ease_of_use: 72, intelligence: 88, value: 60, ecosystem: 80, safety: 85, design: 92 },
    why_add: "Distinct from existing Atlas Electric entry which is listed as 'coming_soon'. This represents the actual Hyundai factory deployment variant covered by Robot Report in early 2025."
  },

  // ─── SECURITY (10) ───────────────────────────────────────────────────
  {
    slug: "knightscope-k7",
    name: "Knightscope K7",
    manufacturer: "Knightscope",
    manufacturer_slug: "knightscope",
    category: "security",
    estimated_price: null,
    year_released: 2023,
    status: "active",
    description: "Multi-terrain autonomous security robot. 4-wheel drive for outdoor patrol including grass, gravel, and hills. 400lb chassis with 360-degree cameras, thermal imaging, and LiDAR. GPS-guided autonomous patrol routes.",
    estimated_specs: { height_cm: 122, weight_kg: 182, battery_hrs: 20, drive: "4WD all-terrain", cameras: "360 RGB + thermal", sensors: "LiDAR, GPS, microphones", ip_rating: "IP65" },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 72, ease_of_use: 74, intelligence: 70, value: 68, ecosystem: 58, safety: 75, design: 65 },
    why_add: "Complements existing K5 which is indoor. K7 is the outdoor-focused model. Knightscope is the only publicly traded security robot company. Robot Report covers quarterly earnings."
  },
  {
    slug: "knightscope-k1",
    name: "Knightscope K1",
    manufacturer: "Knightscope",
    manufacturer_slug: "knightscope",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Stationary security tower for parking lots and entry points. License plate recognition, person detection, and two-way communication. Solar-powered option. Lowest-cost Knightscope product.",
    estimated_specs: { height_cm: 100, weight_kg: 90, cameras: "4K panoramic + LPR", power: "AC or solar", communication: "Two-way audio + video", analytics: "Person + vehicle detection" },
    robo_score: 0, score_breakdown: { performance: 65, reliability: 78, ease_of_use: 80, intelligence: 68, value: 76, ecosystem: 58, safety: 72, design: 60 },
    why_add: "Fills out Knightscope product line. Stationary model serves different use case from K5/K7 mobile patrol. Important for comprehensive security robot coverage."
  },
  {
    slug: "smp-s5-2",
    name: "SMP Robotics S5.2",
    manufacturer: "SMP Robotics",
    manufacturer_slug: "smp-robotics",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Outdoor autonomous security patrol robot. Solar-powered with 24/7 operation capability. GPS-guided route planning with thermal cameras and license plate recognition. Deployed at solar farms, construction sites, and industrial facilities.",
    estimated_specs: { weight_kg: 80, drive: "4-wheel differential", cameras: "Thermal + RGB + LPR", power: "Solar + battery", battery_hrs: 24, speed_kmh: 7, patrol: "GPS waypoint autonomous" },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 76, ease_of_use: 74, intelligence: 72, value: 74, ecosystem: 55, safety: 75, design: 65 },
    why_add: "Key competitor to Knightscope in outdoor security. Solar-powered 24/7 operation is differentiator. Growing market for perimeter security robots."
  },
  {
    slug: "smp-s6",
    name: "SMP Robotics S6",
    manufacturer: "SMP Robotics",
    manufacturer_slug: "smp-robotics",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Heavy-duty outdoor security robot with integrated gas and radiation detection sensors. Designed for critical infrastructure: power plants, refineries, chemical facilities. All-weather operation with heated enclosures.",
    estimated_specs: { weight_kg: 120, sensors: "Thermal + gas + radiation + RGB", drive: "6-wheel all-terrain", weather: "All-weather heated enclosure", speed_kmh: 5, battery_hrs: 20 },
    robo_score: 0, score_breakdown: { performance: 76, reliability: 78, ease_of_use: 72, intelligence: 74, value: 70, ecosystem: 55, safety: 80, design: 62 },
    why_add: "Critical infrastructure security is a fast-growing segment. Gas and radiation detection sensors differentiate from standard security robots. Robot Report covers industrial security market."
  },
  {
    slug: "cobalt-model-3",
    name: "Cobalt Model 3",
    manufacturer: "Cobalt Robotics",
    manufacturer_slug: "cobalt-robotics",
    category: "security",
    estimated_price: null,
    year_released: 2025,
    status: "active",
    description: "Third-generation indoor security robot with enhanced AI anomaly detection. Integrates with building access control systems. Human-in-the-loop monitoring with Cobalt Specialists responding to incidents. Updated sensor suite with improved thermal imaging.",
    estimated_specs: { height_cm: 120, sensors: "70+ (thermal, RGB, LiDAR, badge reader, air quality)", monitoring: "24/7 Cobalt Specialist remote", integrations: "Access control, VMS, BMS", ai: "Anomaly detection ML" },
    robo_score: 0, score_breakdown: { performance: 80, reliability: 82, ease_of_use: 82, intelligence: 84, value: 72, ecosystem: 70, safety: 85, design: 82 },
    why_add: "Upgrade to existing Cobalt entry. Model 3 has significant AI improvements. Cobalt's human-in-the-loop model is unique in security robotics. Featured in Robot Report's security roundup."
  },
  {
    slug: "ava-security-robot",
    name: "Ava Security Robot",
    manufacturer: "Cobalt Robotics",
    manufacturer_slug: "cobalt-robotics",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Enterprise-grade telepresence and security robot (from Ava Robotics, now part of Cobalt). Combines video conferencing with autonomous patrol. Used in corporate campuses for both security rounds and remote meetings.",
    estimated_specs: { height_cm: 160, display: "Large touchscreen", cameras: "4K panoramic + zoom", nav: "LiDAR SLAM autonomous", audio: "Conference-quality speakers + mic array", use: "Security patrol + telepresence" },
    robo_score: 0, score_breakdown: { performance: 74, reliability: 78, ease_of_use: 82, intelligence: 76, value: 68, ecosystem: 65, safety: 78, design: 78 },
    why_add: "Unique dual-purpose security + telepresence robot. Ava Robotics acquisition by Cobalt was covered by Robot Report. Addresses two enterprise needs in one platform."
  },
  {
    slug: "boston-dynamics-spot-patrol",
    name: "Boston Dynamics Spot (Security Patrol)",
    manufacturer: "Boston Dynamics",
    manufacturer_slug: "boston-dynamics",
    category: "security",
    estimated_price: 90000,
    year_released: 2025,
    status: "active",
    description: "Spot configured specifically for security applications with Scout platform integration. Autonomous indoor/outdoor patrol routes, thermal anomaly detection, door and gate checking, integration with security operations centers. Growing deployments at data centers and critical infrastructure.",
    estimated_specs: { cameras: "Thermal + 360 RGB + night vision", audio: "Anomaly detection + two-way", battery_hrs: 1.5, gait: "Quadruped all-terrain stair-capable", dock: "Autonomous self-charging", integration: "SOC dashboard + alerting" },
    robo_score: 0, score_breakdown: { performance: 86, reliability: 86, ease_of_use: 78, intelligence: 86, value: 66, ecosystem: 85, safety: 88, design: 90 },
    why_add: "Distinct from existing construction Spot entries. The security vertical is Spot's fastest growing segment per Robot Report. Dedicated security config with SOC integration."
  },
  {
    slug: "turing-ai-security-robot",
    name: "Turing AI ROSA",
    manufacturer: "Knightscope",
    manufacturer_slug: "knightscope",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Knightscope's Robots-On-Site-Assistance (ROSA) is a stationary emergency communication device with blue-light phone functionality, cameras, and intercom. Deployed at hospitals, universities, and transit stations for public safety.",
    estimated_specs: { type: "Stationary blue-light tower", cameras: "360-degree + zoom", communication: "Emergency phone + intercom", height_cm: 200, power: "AC mains", analytics: "Video analytics + LPR" },
    robo_score: 0, score_breakdown: { performance: 62, reliability: 80, ease_of_use: 85, intelligence: 60, value: 72, ecosystem: 58, safety: 78, design: 58 },
    why_add: "Represents Knightscope's pivot toward fixed security infrastructure. Blue-light campus safety market is adjacent to mobile security robots. Fills out security category breadth."
  },
  {
    slug: "indoor-robotics-tando-2",
    name: "Indoor Robotics Tando 2",
    manufacturer: "Cobalt Robotics",
    manufacturer_slug: "cobalt-robotics",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Ceiling-mounted autonomous drone-in-a-box for indoor security. Launches from ceiling dock, patrols facility autonomously, returns to charge. Minimal floor footprint. Thermal + RGB cameras. Used in warehouses and data centers.",
    estimated_specs: { type: "Ceiling-mounted indoor drone", flight_time_min: 15, cameras: "Thermal + 4K RGB", dock: "Ceiling-mounted auto-charge", coverage_sqm: 10000, height: "Ceiling-mounted" },
    robo_score: 0, score_breakdown: { performance: 74, reliability: 72, ease_of_use: 78, intelligence: 78, value: 70, ecosystem: 60, safety: 72, design: 76 },
    why_add: "Novel form factor for indoor security: drone-in-a-box concept applied indoors. Zero floor footprint. Robot Report featured as innovative approach to warehouse security."
  },
  {
    slug: "nightscope-ks",
    name: "Knightscope KS (Healthcare)",
    manufacturer: "Knightscope",
    manufacturer_slug: "knightscope",
    category: "security",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Knightscope's indoor security robot tailored for healthcare environments. Quieter operation, enhanced badge-reader integration, nurse station communication. Designed for hospital corridor patrol and after-hours building security.",
    estimated_specs: { height_cm: 92, weight_kg: 136, battery_hrs: 20, noise_db: 45, cameras: "360 RGB + thermal", integration: "Badge reader + nurse station", environment: "Healthcare-optimized" },
    robo_score: 0, score_breakdown: { performance: 66, reliability: 72, ease_of_use: 76, intelligence: 68, value: 70, ecosystem: 58, safety: 74, design: 64 },
    why_add: "Healthcare security is a specific vertical Knightscope targets. Hospitals have unique requirements (noise, badge integration). Expands security robot category representation."
  },

  // ─── HOSPITALITY (10) ───────────────────────────────────────────────
  {
    slug: "bear-carti",
    name: "Bear Robotics Carti",
    manufacturer: "Bear Robotics",
    manufacturer_slug: "bear-robotics",
    category: "hospitality",
    estimated_price: null,
    year_released: 2025,
    status: "active",
    description: "Purpose-built healthcare delivery robot from Bear Robotics. UV-C disinfection of compartments between deliveries. Designed for hospital meal delivery, medication transport, and supply runs. HIPAA-compliant logging.",
    estimated_specs: { payload_kg: 50, compartments: 4, uv_disinfection: true, battery_hrs: 14, nav: "LiDAR SLAM", elevator: true, compliance: "HIPAA logging" },
    robo_score: 0, score_breakdown: { performance: 76, reliability: 80, ease_of_use: 84, intelligence: 74, value: 76, ecosystem: 72, safety: 82, design: 76 },
    why_add: "Bear Robotics' hospital-specific model. Healthcare delivery robots are a fast-growing segment. Robot Report featured Carti's HIPAA-compliant design. Complements existing Servi Plus."
  },
  {
    slug: "pudu-holabot",
    name: "Pudu HolaBot",
    manufacturer: "Pudu Robotics",
    manufacturer_slug: "pudu-robotics",
    category: "hospitality",
    estimated_price: 18000,
    year_released: 2023,
    status: "active",
    description: "Premium restaurant delivery robot with enclosed cabin for food protection. Multi-floor delivery with elevator integration. Call-button summoning from tables. 12+ hour battery. Deployed in fine dining and hotel room service.",
    estimated_specs: { payload_kg: 60, cabin: "Enclosed with door", battery_hrs: 12, nav: "Visual SLAM + LiDAR", elevator: true, floors: "Multi-floor", call_button: true },
    robo_score: 0, score_breakdown: { performance: 78, reliability: 80, ease_of_use: 84, intelligence: 74, value: 78, ecosystem: 78, safety: 80, design: 80 },
    why_add: "Pudu's premium enclosed-cabin model vs open-tray BellaBot. Important for hotels and fine dining where food protection matters. Completes Pudu product line in DB."
  },
  {
    slug: "pudu-flashbot",
    name: "Pudu FlashBot",
    manufacturer: "Pudu Robotics",
    manufacturer_slug: "pudu-robotics",
    category: "hospitality",
    estimated_price: 20000,
    year_released: 2024,
    status: "active",
    description: "High-speed hotel delivery robot with large enclosed cabin. 90-second average delivery time. Autonomous elevator operation. Integrates with hotel PMS systems. Deployed at Marriott, Hilton, and Accor properties globally.",
    estimated_specs: { payload_kg: 30, cabin_volume_l: 60, battery_hrs: 15, nav: "Visual SLAM + LiDAR + ultrasonic", elevator: true, avg_delivery_sec: 90, pms_integration: true },
    robo_score: 0, score_breakdown: { performance: 78, reliability: 78, ease_of_use: 86, intelligence: 76, value: 76, ecosystem: 76, safety: 80, design: 80 },
    why_add: "Hotel delivery is a distinct use case from restaurant service. Pudu's fastest-growing segment. Robot Report covered Marriott/Hilton deployments."
  },
  {
    slug: "relay-robotics-relay-plus",
    name: "Relay Robotics Relay+",
    manufacturer: "Relay Robotics (Savioke)",
    manufacturer_slug: "relay-robotics",
    category: "hospitality",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Hotel room delivery robot, pioneer of the category. Originally Savioke Relay, now Relay Robotics. Autonomous elevator operation. Calls guests on room phone upon arrival. 10,000+ hotels evaluated, deployed at Crowne Plaza, Renaissance, and Aloft.",
    estimated_specs: { payload_kg: 5, cabin: "Secure enclosed bin", battery_hrs: 10, nav: "LiDAR SLAM", elevator: true, notification: "Room phone call", hotels: "Crowne Plaza, Renaissance, Aloft" },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 80, ease_of_use: 86, intelligence: 72, value: 76, ecosystem: 70, safety: 80, design: 76 },
    why_add: "Pioneer of hotel delivery robots. Important for historical context. Robot Report has covered since 2014. Still actively deployed at major hotel chains."
  },
  {
    slug: "keenbot-t5",
    name: "Keenbot T5",
    manufacturer: "Keenbot (OrionStar)",
    manufacturer_slug: "keenbot",
    category: "hospitality",
    estimated_price: 10000,
    year_released: 2024,
    status: "active",
    description: "Multi-function hotel and restaurant service robot from OrionStar (Cheetah Mobile subsidiary). Large display for advertising and wayfinding. Delivery + reception + patrol modes. Voice interaction with AI concierge capabilities.",
    estimated_specs: { display_in: 21.5, payload_kg: 20, battery_hrs: 14, nav: "Visual SLAM", modes: "Delivery, reception, patrol, advertising", voice_ai: true },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 76, ease_of_use: 82, intelligence: 74, value: 84, ecosystem: 68, safety: 78, design: 76 },
    why_add: "Growing competitor in Asia-Pacific hospitality robot market. Aggressive pricing from OrionStar. Robot Report tracks Chinese hospitality robot market share."
  },
  {
    slug: "richtech-matradee-2",
    name: "Richtech Matradee 2",
    manufacturer: "Richtech Robotics",
    manufacturer_slug: "richtech",
    category: "hospitality",
    estimated_price: 12000,
    year_released: 2024,
    status: "active",
    description: "Second-generation restaurant service robot from Richtech. 4-tray design with improved navigation and POS integration. Voice greeting and guest interaction. Deployed across casino resorts, chain restaurants, and buffets.",
    estimated_specs: { payload_kg: 40, trays: 4, battery_hrs: 12, nav: "LiDAR SLAM", voice: "Voice greeting + interaction", pos_integration: true },
    robo_score: 0, score_breakdown: { performance: 72, reliability: 76, ease_of_use: 82, intelligence: 70, value: 80, ecosystem: 68, safety: 78, design: 76 },
    why_add: "Complements existing Richtech ADAM barista robot. Matradee is their restaurant delivery line. Growing US market share especially in casino resorts."
  },
  {
    slug: "richtech-dust-e-2",
    name: "Richtech Dust-E 2",
    manufacturer: "Richtech Robotics",
    manufacturer_slug: "richtech",
    category: "hospitality",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Autonomous commercial cleaning robot for hotels and restaurants. Vacuum + mop combo with obstacle avoidance. Maps facility and optimizes cleaning routes. Night-shift operation for hotels and restaurants.",
    estimated_specs: { cleaning_width_cm: 50, battery_hrs: 4, nav: "LiDAR SLAM", modes: "Vacuum + mop", coverage_sqm: 2000, operation: "Autonomous night-shift" },
    robo_score: 0, score_breakdown: { performance: 74, reliability: 76, ease_of_use: 82, intelligence: 72, value: 74, ecosystem: 62, safety: 78, design: 72 },
    why_add: "Commercial cleaning is a key hospitality robot subcategory. Richtech's cleaning line complements their service robots. Fills hospitality cleaning gap in DB."
  },
  {
    slug: "bear-servi-mini",
    name: "Bear Robotics Servi Mini",
    manufacturer: "Bear Robotics",
    manufacturer_slug: "bear-robotics",
    category: "hospitality",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Compact restaurant delivery robot for tight spaces. Smaller footprint than Servi Plus for narrow aisles and small restaurants. 3-tray design with 30kg payload. Ideal for cafes, small restaurants, and food courts.",
    estimated_specs: { payload_kg: 30, trays: 3, battery_hrs: 10, nav: "LiDAR SLAM", width_cm: 45, speed_ms: 1.0 },
    robo_score: 0, score_breakdown: { performance: 70, reliability: 78, ease_of_use: 86, intelligence: 70, value: 80, ecosystem: 72, safety: 80, design: 76 },
    why_add: "Compact form factor serves underserved small restaurant market. Bear Robotics is expanding product line. Robot Report covered product expansion strategy."
  },
  {
    slug: "techi-butler-t6",
    name: "Techi Butler T6",
    manufacturer: "Techi Butler",
    manufacturer_slug: "techi-butler",
    category: "hospitality",
    estimated_price: 15000,
    year_released: 2024,
    status: "active",
    description: "Multi-purpose hotel service robot with large enclosed cabin. Room service delivery, minibar restocking, and amenity delivery. Integrates with major hotel PMS platforms. Autonomous elevator and door operation.",
    estimated_specs: { payload_kg: 35, cabin: "Large enclosed with shelves", battery_hrs: 14, nav: "LiDAR SLAM", elevator: true, door: "Automatic door integration", pms: "Oracle, Opera, Mews" },
    robo_score: 0, score_breakdown: { performance: 74, reliability: 76, ease_of_use: 82, intelligence: 72, value: 78, ecosystem: 68, safety: 78, design: 74 },
    why_add: "Represents growing Chinese hotel robot manufacturers entering global market. PMS integration is key differentiator. Adds diversity to hospitality category."
  },
  {
    slug: "lg-cloi-brewbot",
    name: "LG CLOi BarBot",
    manufacturer: "LG Electronics",
    manufacturer_slug: "lg-electronics",
    category: "hospitality",
    estimated_price: null,
    year_released: 2024,
    status: "active",
    description: "Automated barista and beverage service robot from LG's CLOi lineup. Makes coffee, cocktails, and draft beer. Demonstrated at CES 2024. Part of LG's hospitality robot ecosystem with ServeBot and GuideBot.",
    estimated_specs: { beverages: "Coffee, cocktails, draft beer", capacity: "100+ drinks per fill", display: "Touchscreen ordering", integration: "LG CLOi ecosystem", speed: "30 seconds per drink" },
    robo_score: 0, score_breakdown: { performance: 70, reliability: 74, ease_of_use: 80, intelligence: 68, value: 65, ecosystem: 72, safety: 78, design: 82 },
    why_add: "Major consumer electronics brand entering hospitality robotics. CES 2024 showcase generated Robot Report coverage. Completes LG CLOi robot family in DB."
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — Import staging data
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Robot Report New Robots Staging");
  console.log("  30 new robots across humanoid / security / hospitality");
  console.log("═══════════════════════════════════════════════════\n");

  // 1. Load existing categories
  const { data: cats } = await sb.from("robot_categories").select("id, slug");
  const catMap = new Map<string, string>();
  for (const c of cats || []) catMap.set(c.slug, c.id);
  console.log(`Categories loaded: ${catMap.size}`);

  // Verify new categories exist
  const requiredCats = ["humanoid", "security", "hospitality"];
  for (const rc of requiredCats) {
    if (!catMap.has(rc)) {
      console.error(`  MISSING CATEGORY: "${rc}" — run migration 015_new_categories.sql first`);
      process.exit(1);
    }
  }

  // 2. Load + create manufacturers
  const { data: existingMfrs } = await sb.from("manufacturers").select("id, slug");
  const mfrMap = new Map<string, string>();
  for (const m of existingMfrs || []) mfrMap.set(m.slug, m.id);
  console.log(`Existing manufacturers: ${mfrMap.size}\n`);

  let mfrsCreated = 0;
  for (const nm of newManufacturers) {
    if (mfrMap.has(nm.slug)) continue;
    const { data, error } = await sb.from("manufacturers").insert(nm).select("id").single();
    if (error) { console.error(`  Manufacturer error ${nm.slug}: ${error.message}`); continue; }
    mfrMap.set(nm.slug, data.id);
    mfrsCreated++;
    console.log(`  + Manufacturer: ${nm.name}`);
  }
  console.log(`Manufacturers created: ${mfrsCreated}\n`);

  // 3. Insert robots
  let inserted = 0, skipped = 0, errored = 0;
  for (const r of newRobots) {
    const { data: existing } = await sb.from("robots").select("id").eq("slug", r.slug).single();
    if (existing) { skipped++; continue; }

    const mfrId = mfrMap.get(r.manufacturer_slug);
    const catId = catMap.get(r.category);
    if (!mfrId) { console.error(`  Missing manufacturer: ${r.manufacturer_slug}`); errored++; continue; }
    if (!catId) { console.error(`  Missing category: ${r.category}`); errored++; continue; }

    const breakdown = r.score_breakdown;
    const score = cs(breakdown);

    const { error } = await sb.from("robots").insert({
      slug: r.slug,
      name: r.name,
      manufacturer_id: mfrId,
      category_id: catId,
      price_current: r.estimated_price,
      year_released: r.year_released,
      status: r.status,
      description_short: r.description.slice(0, 200),
      description_long: r.description,
      specs: r.estimated_specs,
      robo_score: score,
      score_breakdown: breakdown,
      images: [],
    });

    if (error) {
      console.error(`  Error ${r.slug}: ${error.message}`);
      errored++;
    } else {
      inserted++;
      console.log(`  + ${r.name} (${r.category}, score: ${score})`);
    }
  }

  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`  Results: ${inserted} inserted, ${skipped} skipped, ${errored} errors`);
  console.log(`═══════════════════════════════════════════════════`);

  // 4. Summary by category
  console.log("\nBy category:");
  const byCat = new Map<string, number>();
  for (const r of newRobots) {
    byCat.set(r.category, (byCat.get(r.category) || 0) + 1);
  }
  for (const [cat, count] of byCat) {
    console.log(`  ${cat}: ${count} robots`);
  }
}

main().catch(console.error);
