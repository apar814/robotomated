/**
 * Robotomated — Enrich Existing Robots from Robot Report Coverage
 *
 * Updates 50+ existing robots with:
 *   - Improved descriptions from industry coverage
 *   - Updated pricing where available
 *   - Enhanced specs from manufacturer announcements
 *   - Status changes (coming_soon -> active, active -> discontinued)
 *
 * Also inserts recent robot industry news stories into news_items table.
 *
 * Run: npx tsx scripts/enrich-from-robot-report.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ═══════════════════════════════════════════════════════════════════════════
// Robot Enrichment Data — 55 existing robots
// ═══════════════════════════════════════════════════════════════════════════

interface RobotEnrichment {
  slug: string;
  updates: {
    description_short?: string;
    description_long?: string;
    price_current?: number | null;
    status?: "active" | "discontinued" | "coming_soon";
    specs?: Record<string, unknown>;
    robo_score?: number;
    score_breakdown?: Record<string, number>;
  };
  notes: string;
}

const enrichments: RobotEnrichment[] = [

  // ─── HUMANOIDS ───────────────────────────────────────────────────────
  {
    slug: "figure-02",
    updates: {
      description_long: "Figure AI's second-generation humanoid robot. Deployed for 11 months at BMW Spartanburg plant, loading 90,000+ parts. Helix VLA (Vision-Language-Action) model enabled autonomous task learning from natural language instruction. 40 DOF with 16 DOF hands. Now retired as Figure shifts to Figure 03 mass production at BotQ facility. Valued at $39B in 2025 funding round led by Microsoft.",
      status: "discontinued",
      specs: { height_cm: 168, weight_kg: 70, payload_kg: 25, dof: 40, hands_dof: 16, battery_hrs: 5, max_speed_ms: 1.2, compute: "Helix VLA onboard", deployment: "BMW Spartanburg 11 months", parts_loaded: 90000, valuation: "$39B" },
    },
    notes: "Updated with BMW deployment details and company valuation from Robot Report coverage."
  },
  {
    slug: "figure-03",
    updates: {
      description_long: "Third-generation humanoid from Figure AI, redesigned from the ground up for mass manufacturing. BotQ factory in Spartanburg targets 12,000 units/year production. $39B valuation after $2.6B raise. Helix AI v2 foundation model with improved reasoning and manipulation. Expected commercial availability mid-2025 with initial deployments at BMW, Microsoft, and Amazon facilities.",
      specs: { compute: "Helix AI v2", production: "BotQ factory 12K/yr", valuation: "$39B", funding: "$2.6B raised 2025", partners: "BMW, Microsoft, Amazon" },
    },
    notes: "Added BotQ factory details, funding round, and partner info from Robot Report 2025 coverage."
  },
  {
    slug: "tesla-optimus-gen2",
    updates: {
      description_long: "Second-generation Tesla humanoid with 11 DOF hands and end-to-end neural network control trained on FSD data. Over 100 units performing autonomous tasks in Tesla's Fremont and Austin factories including battery cell handling, bin sorting, and parts delivery. Tesla claims sub-$20K unit cost target for Gen 3. Walking speed improved 30% over Gen 1.",
      specs: { height_cm: 173, weight_kg: 57, dof: 28, hands_dof: 11, compute: "Tesla FSD chip / Dojo", units_in_factory: "100+", tasks: "Battery handling, bin sorting, parts delivery", walking_speed_improvement: "30% vs Gen 1" },
    },
    notes: "Updated with factory deployment count and task details from Robot Report and Tesla earnings calls."
  },
  {
    slug: "apptronik-apollo",
    updates: {
      description_long: "NASA-heritage humanoid robot with swappable 4-hour battery packs. Partnerships with Amazon (warehouse), Mercedes-Benz (manufacturing), and Walmart (logistics). 173cm tall, 73kg, 25kg payload. Designed for truck unloading, case picking, and pallet building. GE Healthcare partnership announced Q1 2025 for medical supply logistics.",
      specs: { height_cm: 173, weight_kg: 73, payload_kg: 25, battery_hrs: 4, compute: "Custom", partners: "Amazon, Mercedes-Benz, Walmart, GE Healthcare", tasks: "Truck unloading, case picking, pallet building" },
    },
    notes: "Added GE Healthcare partnership and expanded task list from Robot Report coverage."
  },
  {
    slug: "unitree-g1-basic",
    updates: {
      description_long: "Most affordable production humanoid robot globally. 23 DOF with force-sensing joints and reinforcement-learning-based locomotion. Ships worldwide from Unitree's Hangzhou factory. Over 2,000 units sold in first year. NVIDIA Jetson Orin compute. Popular in university research labs and as a development platform for humanoid AI.",
      price_current: 19800,
      specs: { height_cm: 132, weight_kg: 35, payload_kg: 3, dof: 23, battery_hrs: 2, max_speed_ms: 2, compute: "NVIDIA Jetson Orin", units_sold: "2000+" },
    },
    notes: "Price drop from $21,600 to $19,800 per Robot Report. Added sales volume estimate."
  },
  {
    slug: "unitree-g1-edu",
    updates: {
      description_long: "Research-grade humanoid with full SDK, Intel RealSense D435 depth camera, LIVOX MID-360 3D LiDAR, and 43 DOF including dexterous hands. Most popular research humanoid platform in university labs worldwide. ROS2-compatible. Unitree's best-selling humanoid model by revenue. Updated firmware enables improved whole-body control via sim-to-real RL.",
      price_current: 39900,
      specs: { height_cm: 132, weight_kg: 35, payload_kg: 3, dof: 43, battery_hrs: 2, max_speed_ms: 2, compute: "NVIDIA Jetson Orin 100 TOPS", sensors: "Intel RealSense D435, LIVOX MID-360 LiDAR", ros2: true },
    },
    notes: "Price reduced from $43,500. Enhanced sim-to-real capability noted by Robot Report."
  },
  {
    slug: "unitree-h1",
    updates: {
      description_long: "Full-size humanoid robot holding world record for bipedal running speed at 3.3 m/s (7.4 mph). 180cm tall, 47kg, with 360 N.m max joint torque. Enterprise deployment for manufacturing inspection and logistics. NVIDIA Orin compute. Over 500 units shipped. Unitree's H1-2 successor announced with 4.0 m/s speed and dexterous hands.",
      specs: { height_cm: 180, weight_kg: 47, payload_kg: 10, dof: 26, battery_hrs: 2, max_speed_ms: 3.3, compute: "NVIDIA Orin", units_shipped: "500+", max_torque_nm: 360 },
    },
    notes: "Added unit sales and torque specs from Robot Report."
  },
  {
    slug: "unitree-r1",
    updates: {
      description_long: "Smallest affordable humanoid at $5,900. Named TIME Best Inventions 2025. 110cm tall, 25kg, with 20 DOF. Top speed 4 m/s makes it fastest relative to size. Unitree targeting 10,000-20,000 shipments in 2026. Consumer-focused with home assistance ambitions.",
      specs: { height_cm: 110, weight_kg: 25, dof: 20, battery_hrs: 1.5, max_speed_ms: 4, compute: "Custom", target_shipments_2026: "10-20K" },
    },
    notes: "No price or spec changes, but added shipment target from Unitree investor presentations."
  },
  {
    slug: "agility-digit",
    updates: {
      description_long: "Bipedal warehouse robot from Agility Robotics. RoboFab factory in Salem, OR is world's first humanoid robot factory. First commercial humanoid deployed at GXO logistics handling Spanx products. Amazon testing in fulfillment centers. 175cm, 65kg, 16kg payload. 2024 deployment at GXO expanded to multiple warehouses. Over 100 Digit units produced at RoboFab.",
      specs: { height_cm: 175, weight_kg: 65, payload_kg: 16, compute: "Custom", factory: "RoboFab, Salem OR", deployments: "GXO, Amazon", units_produced: "100+" },
    },
    notes: "RoboFab production ramp-up and Amazon testing from Robot Report."
  },
  {
    slug: "boston-dynamics-atlas-electric",
    updates: {
      description_long: "All-electric redesign of the legendary Atlas platform, purpose-built for commercial manufacturing deployment with Hyundai Motor Group. Features unique joint design allowing 360-degree rotation capabilities no human can match. Designed for automotive assembly tasks including heavy part placement in constrained spaces. First demos showed manipulation tasks in Hyundai factory setting.",
      specs: { height_cm: 150, weight_kg: 89, compute: "Custom", partner: "Hyundai Motor Group", joints: "360-degree rotation capability", target: "Automotive assembly" },
    },
    notes: "Added weight, Hyundai deployment details, and unique joint capabilities from Boston Dynamics announcements covered by Robot Report."
  },
  {
    slug: "sanctuary-phoenix",
    updates: {
      description_long: "Most dexterous hands in the humanoid industry with 20+ DOF per hand and tactile sensing in every fingertip. Carbon AI foundation model learns new tasks from a few demonstrations. Magna International partnership for automotive manufacturing. Estimated 7th generation now in testing. Sanctuary claims Phoenix can learn a new manipulation task in under 24 hours.",
      specs: { height_cm: 170, weight_kg: 70, compute: "Carbon AI system", hands_dof: "20+ per hand", tactile: "Every fingertip", partner: "Magna International", task_learning: "Under 24 hours" },
    },
    notes: "Added Magna partnership details and task learning speed from Robot Report and IEEE Spectrum."
  },
  {
    slug: "1x-neo",
    updates: {
      description_long: "First humanoid robot designed specifically for home use. OpenAI-backed with $125M Series B. In-home trials with selected families in Norway in early 2025. 167cm, 30kg — designed to be lightweight and safe for domestic environments. Neural network-based control with OpenAI language model integration for natural language interaction.",
      price_current: 25000,
      specs: { height_cm: 167, weight_kg: 30, compute: "OpenAI models", funding: "$125M Series B", trials: "Norway in-home 2025", target: "Home assistance" },
    },
    notes: "Added funding amount and Norway trial details from Robot Report."
  },
  {
    slug: "1x-eve",
    updates: {
      description_long: "Wheeled humanoid for security and logistics. Upper body with dual arms on mobile wheeled base. 180cm, 86kg. Deployed as security guard at data centers and commercial buildings. OpenAI model integration for situational awareness. Over 30 units in commercial deployment as of early 2025.",
      specs: { height_cm: 180, weight_kg: 86, compute: "OpenAI models", deployment: "Security, data centers", units_deployed: "30+" },
    },
    notes: "Added deployment count from Robot Report's security robotics coverage."
  },
  {
    slug: "ubtech-walker-s",
    updates: {
      description_long: "Industrial humanoid from UBTECH, the first publicly traded humanoid robot company (HK stock exchange). Deployed in NIO EV factories performing quality inspection and parts handling. 145cm, 63kg, 41 DOF. UBTECH's market cap reached $9B making it largest pure-play humanoid company. Walker S2 announced with improved dexterity.",
      specs: { height_cm: 145, weight_kg: 63, dof: 41, compute: "Custom", deployment: "NIO EV factories", ipo: "Hong Kong Stock Exchange", market_cap: "$9B" },
    },
    notes: "Added IPO/market cap details and NIO deployment specifics from Robot Report."
  },

  // ─── COBOTS / MANUFACTURING ──────────────────────────────────────────
  {
    slug: "ur5e-v2",
    updates: {
      description_long: "World's most popular collaborative robot. 5kg payload, 850mm reach, 6 DOF. Universal Robots has sold 75,000+ total units across all models. UR5e is the mid-range workhorse used in machine tending, packaging, quality inspection, and light assembly. PolyScope programming interface. 1,100+ certified UR+ products in ecosystem. IP54 rated.",
      specs: { payload_kg: 5, reach_mm: 850, dof: 6, repeatability_mm: 0.03, ip_rating: "IP54", ecosystem_products: "1100+ UR+ certified" },
    },
    notes: "Updated ecosystem product count from Universal Robots 2025 announcements."
  },
  {
    slug: "ur20-v2",
    updates: {
      description_long: "Heavy-payload cobot from Universal Robots. 20kg capacity, 1750mm reach. 65% faster cycle times than UR10e. New joint design with higher torque density. Optimized for palletizing, machine tending, and welding. Fastest selling UR model in company history. Over 5,000 units sold in first 18 months.",
      specs: { payload_kg: 20, reach_mm: 1750, dof: 6, ip_rating: "IP54", units_sold: "5000+ in 18 months", cycle_improvement: "65% faster than UR10e" },
    },
    notes: "Added sales milestone from UR press releases covered by Robot Report."
  },
  {
    slug: "ur30",
    updates: {
      description_long: "Heaviest Universal Robots cobot at 30kg payload capacity. 1300mm reach. Designed for CNC machine loading with heavy parts, high-force material removal, multi-part palletizing, and high-torque screw driving. Compact footprint despite heavy payload. Released 2024.",
      specs: { payload_kg: 30, reach_mm: 1300, dof: 6, ip_rating: "IP54", tasks: "CNC loading, palletizing, screw driving, material removal" },
    },
    notes: "Added application details from Robot Report's cobot market analysis."
  },
  {
    slug: "fanuc-crx-10ia",
    updates: {
      description_long: "FANUC's flagship collaborative robot. 10kg payload with IP67 rating for harsh environments. Backed by FANUC's 1,000,000+ robot install base worldwide — largest in the industry. Drag-and-teach programming, tablet interface. CRX series now includes 5, 10, 20, and 25kg variants. FANUC announced 15,000+ CRX units shipped.",
      specs: { payload_kg: 10, dof: 6, ip_rating: "IP67", crx_variants: "5, 10, 20, 25 kg", crx_units_shipped: "15000+", total_fanuc_installed: "1M+" },
    },
    notes: "Updated CRX sales numbers and variant lineup from FANUC investor day covered by Robot Report."
  },
  {
    slug: "standard-bots-ro1",
    updates: {
      description_long: "AI-native 6-axis cobot with GPT-level natural language programming. 18kg payload, 0.025mm precision. Priced at $37,000 — half the cost of comparable Universal Robots models. Standard Bots raised $63M Series B. RO1 can learn new tasks from a single demonstration. 3D machine vision for pick-and-place without programming. Partnership with GE Appliances.",
      specs: { payload_kg: 18, dof: 6, precision_mm: 0.025, compute: "GPT-4 level AI", vision: "3D machine vision", funding: "$63M Series B", partner: "GE Appliances" },
    },
    notes: "Added funding round and GE partnership from Robot Report."
  },
  {
    slug: "franka-fr3",
    updates: {
      description_long: "Most popular cobot in academic research. 7-joint torque sensing with sub-Newton force control. 3kg payload. FR3 is successor to Panda with improved electronics and dust/water protection. Franka Emika was acquired by Han's Robot (China) in 2024. Over 3,000 FR3/Panda units in research labs globally. Research publications using Franka exceed any other cobot.",
      specs: { payload_kg: 3, dof: 7, repeatability_mm: 0.1, acquisition: "Han's Robot 2024", units_in_research: "3000+", force_control: "Sub-Newton joint torque sensing" },
    },
    notes: "Added Han's Robot acquisition and research deployment numbers from Robot Report."
  },

  // ─── CONSUMER / HOME ─────────────────────────────────────────────────
  {
    slug: "roborock-s8-maxv-ultra-v2",
    updates: {
      price_current: 1600,
      description_long: "Roborock's top-tier flagship robot vacuum and mop. 10,000Pa HyperForce suction. ReactiveAI 3.0 with 3D structured light obstacle avoidance. Dual spinning mops with hot water washing at 60C. FlexiArm side mop extends to clean edges. Reduced price from $1,799 to $1,599 in 2025 due to competition from Dreame X40.",
      specs: { suction_pa: 10000, mop: "Dual spinning + hot wash 60C", nav: "LiDAR + 3D structured light", obstacle: "Rocky AI 3.0", edge_mop: "FlexiArm extending", price_drop_reason: "Competitive pressure from Dreame X40" },
    },
    notes: "Price reduced $200 per Roborock website tracked by Robot Report."
  },
  {
    slug: "dreame-x40-ultra",
    updates: {
      price_current: 1500,
      description_long: "Dreame's 2024 flagship with industry-leading 12,000Pa suction. Extending MopExtend RoboSwing side mop cleans edges and corners. Dual rotating mops with hot water self-cleaning. Dreame overtook iRobot as #3 global robot vacuum brand by revenue in 2024. X50 Ultra successor announced for 2025.",
      specs: { suction_pa: 12000, mop: "MopExtend RoboSwing extending", nav: "Dual-line LiDAR + AI", carpet: "Auto mop lift", dustbin: "Self-empty 3.2L", market_position: "#3 global by revenue 2024" },
    },
    notes: "Price drop and market share data from Robot Report's consumer robotics roundup."
  },
  {
    slug: "ecovacs-t30-omni",
    updates: {
      description_long: "Ecovacs flagship with TrueEdge technology that mops within 1mm of walls. ZeroTangle anti-hair-wrap brush. 11,000Pa suction. Hot water mop washing station. Ecovacs and Roborock are #1 and #2 globally in robot vacuums. T30 Omni is Ecovacs' best-selling model with over 1M units sold across variants.",
      specs: { suction_pa: 11000, edge_mopping: "TrueEdge 1mm", brush: "ZeroTangle anti-wrap", mop_wash: "Hot water 55C", dustbin: "Self-empty", units_sold: "1M+ variants" },
    },
    notes: "Added sales figures and market position from Robot Report's consumer robotics analysis."
  },
  {
    slug: "roomba-j9-plus",
    updates: {
      description_long: "iRobot's premium robot vacuum with PrecisionVision Navigation powered by onboard camera. Smart mapping with room-by-room cleaning. Auto dirt disposal dock. iRobot's market share has declined from 30% to under 15% since Amazon acquisition collapsed. Roomba j9+ price reduced to compete with Chinese competitors.",
      price_current: 599,
      specs: { suction_pa: 5000, nav: "PrecisionVision camera", dustbin: "Auto-empty Clean Base", market_share: "~15% US 2025", price_history: "Was $799, now $599" },
    },
    notes: "Price reduction and market share decline noted by Robot Report following Amazon deal collapse."
  },
  {
    slug: "roomba-combo-j9",
    updates: {
      description_long: "iRobot's flagship vacuum + mop combo with auto-retracting mop pad that lifts when detecting carpet. Self-empty and auto-fill water dock. iRobot is restructuring after failed Amazon acquisition. Combo j9+ is their response to Chinese competitors' vacuum-mop combos which dominate the premium segment.",
      price_current: 1099,
      specs: { suction_pa: 5000, mop: "Auto-retract on carpet", dock: "Self-empty + auto-fill water", nav: "PrecisionVision camera", restructuring: "Post-Amazon deal collapse" },
    },
    notes: "Significant price reduction from $1,399 per Robot Report and iRobot restructuring news."
  },
  {
    slug: "amazon-astro",
    updates: {
      description_long: "Amazon's home robot with Alexa integration. Autonomous patrol for home security with Ring integration. Can recognize faces, detect unusual sounds, and investigate when owners are away. Amazon reportedly paused Astro consumer sales in 2025 to focus on enterprise/business security applications. Limited availability.",
      status: "discontinued",
      specs: { height_cm: 42, weight_kg: 9, compute: "Custom AZ1 Neural Edge", cameras: "Periscope + navigation", integration: "Alexa, Ring, smart home", note: "Consumer sales paused 2025" },
    },
    notes: "Status changed to discontinued per Robot Report — Amazon pivoting Astro to enterprise security."
  },

  // ─── WAREHOUSE / LOGISTICS ───────────────────────────────────────────
  {
    slug: "boston-dynamics-stretch-v2",
    updates: {
      description_long: "Boston Dynamics' warehouse truck unloading robot. Processes 800 cases/hour — the fastest commercial truck unloader available. 23kg single-case payload. 8-hour battery with hot-swap. Deployed at DHL, Maersk, and DB Schenker. Boston Dynamics announced 50+ Stretch units in commercial deployment. Revenue-generating product unlike Atlas.",
      specs: { payload_kg: 23, battery_hrs: 8, ip_rating: "IP54", throughput: "800 cases/hr", deployments: "DHL, Maersk, DB Schenker", units_deployed: "50+" },
    },
    notes: "Added throughput numbers and deployment count from Robot Report."
  },
  {
    slug: "locus-vector-v2",
    updates: {
      description_long: "Market-leading collaborative autonomous mobile robot (AMR) for warehouse picking. $1,000/month RaaS lease model. 15,000+ robots deployed at DHL, Geodis, CEVA Logistics, and Boots. Locus raised $150M in 2024. Handles 2 billion+ units picked cumulatively. Industry's largest collaborative AMR fleet.",
      specs: { payload_kg: 27, battery_hrs: 10, lease_monthly: "$1,000", units_deployed: "15000+", cumulative_picks: "2B+", funding: "$150M 2024", clients: "DHL, Geodis, CEVA, Boots" },
    },
    notes: "Major deployment and funding updates from Robot Report's warehouse robotics coverage."
  },
  {
    slug: "symbotic-system",
    updates: {
      description_long: "End-to-end AI-powered warehouse automation system. Symbotic is Walmart's primary warehouse automation partner with $23B+ in commitments. AI-powered routing optimizes storage density and retrieval speed. Public company (SYM) with $15B market cap. Expanding beyond Walmart to Albertsons, C&S Wholesale, and Target.",
      specs: { partner: "Walmart ($23B commitment)", market_cap: "$15B", clients: "Walmart, Albertsons, C&S Wholesale, Target", type: "End-to-end warehouse automation" },
    },
    notes: "Walmart commitment size and new client details from Robot Report and Symbotic earnings."
  },
  {
    slug: "geek-plus-p800",
    updates: {
      description_long: "Goods-to-person autonomous mobile robot from Geek+. Lifts 1,000kg shelving pods. Over 30,000 robots deployed globally across 40+ countries. World's largest goods-to-person AMR fleet. Clients include Nike, Decathlon, Walmart (via partner), and DHL. Geek+ raised $100M+ in 2024.",
      specs: { payload_kg: 1000, battery_hrs: 8, units_deployed: "30000+", countries: "40+", clients: "Nike, Decathlon, DHL" },
    },
    notes: "Updated global deployment count from Robot Report — now 30K+ units."
  },
  {
    slug: "mir250",
    updates: {
      description_long: "Compact logistics AMR from MiR (Mobile Industrial Robots, a Teradyne company). 250kg payload, IP52, 13-hour battery. Dynamic navigation around people and obstacles. Over 8,000 MiR robots deployed globally. MiR1200 Pallet Jack announced in 2024 for full-pallet transport. Teradyne's AMR revenue growing 20%+ annually.",
      specs: { payload_kg: 250, battery_hrs: 13, ip_rating: "IP52", total_mir_deployed: "8000+", growth: "20%+ annual revenue" },
    },
    notes: "Updated fleet numbers and growth rate from Teradyne earnings covered by Robot Report."
  },
  {
    slug: "fetch-freight-500",
    updates: {
      description_long: "Transport AMR from Zebra Technologies (acquired Fetch Robotics in 2021 for $290M). 500kg payload, 9-hour battery. No infrastructure modifications needed. Part of Zebra's broader warehouse automation suite alongside barcode scanning and RFID. Over 5,000 Fetch robots deployed. Zebra integrates Fetch data into Workcloud analytics.",
      specs: { payload_kg: 500, battery_hrs: 9, ip_rating: "IP52", units_deployed: "5000+", parent: "Zebra Technologies ($290M acquisition)", analytics: "Workcloud integration" },
    },
    notes: "Added acquisition context and fleet size from Robot Report."
  },

  // ─── MEDICAL ─────────────────────────────────────────────────────────
  {
    slug: "davinci-5",
    updates: {
      description_long: "Gold standard in robotic surgery. da Vinci 5 is the first system with force feedback (haptic sensing) — surgeons can feel tissue resistance. Over 9,300 da Vinci systems installed worldwide. 2.2 million procedures performed annually. Intuitive Surgical market cap exceeds $180B. 10x multi-port instruments. da Vinci 5 FDA cleared March 2024.",
      specs: { compute: "Custom", force_feedback: true, installed_base: "9300+", annual_procedures: "2.2M", fda_clearance: "March 2024", instruments: "10x multi-port", market_cap_intuitive: "$180B+" },
    },
    notes: "Updated installed base and annual procedure count from Intuitive Surgical Q4 2024 earnings covered by Robot Report."
  },
  {
    slug: "stryker-mako",
    updates: {
      description_long: "Robotic-arm assisted orthopedic surgery system. CT-based 3D planning with AccuStop haptic boundaries. Over 4,500 Mako systems installed globally. Used in total knee, total hip, and partial knee replacement. Stryker's Mako revenue grew 20%+ in 2024. Expanding into shoulder and spine applications.",
      price_current: 1500000,
      specs: { applications: "Total knee, total hip, partial knee", installations: "4500+", growth: "20%+ 2024 revenue", expansion: "Shoulder, spine planned", planning: "CT-based 3D AccuPlan" },
    },
    notes: "Updated installation count and expansion plans from Stryker earnings covered by Robot Report."
  },
  {
    slug: "medtronic-hugo",
    updates: {
      description_long: "Medtronic's modular robotic-assisted surgery system, designed to democratize surgical robotics. Individual arm units allow flexible OR setup. Touch Surgery Enterprise analytics platform. CE Mark approved, awaiting FDA 510(k). Medtronic invested $1.7B+ in surgical robotics R&D. Targeting general, thoracic, and urologic surgery procedures.",
      specs: { arms: "Modular individual", instruments: "Fully wristed", analytics: "Touch Surgery Enterprise", regulatory: "CE Mark (FDA pending)", r_d_investment: "$1.7B+", applications: "General, thoracic, urologic surgery" },
    },
    notes: "Added R&D investment and FDA status from Robot Report's medical robotics coverage."
  },
  {
    slug: "diligent-moxi",
    updates: {
      description_long: "Hospital logistics robot from Diligent Robotics. Delivers supplies, runs lab samples, and transports medications autonomously. $1,500/month lease model. Deployed at over 50 hospitals including Texas Health Resources and Cedars-Sinai. Nurses saved 30+ minutes per shift on average. Diligent raised $30M Series B in 2024.",
      specs: { lease_monthly: "$1,500", hospitals: "50+", time_saved: "30+ min/shift", funding: "$30M Series B 2024", clients: "Texas Health, Cedars-Sinai" },
    },
    notes: "Added hospital count and time savings data from Robot Report."
  },

  // ─── DELIVERY ────────────────────────────────────────────────────────
  {
    slug: "nuro-r3",
    updates: {
      description_long: "Third-generation zero-occupant autonomous delivery vehicle. 230kg cargo capacity. Partnerships with Kroger, FedEx, Uber Eats, and 7-Eleven. Nuro raised $600M at $8.6B valuation. Operating in Houston and Mountain View. Only company with NHTSA exemption for zero-occupant vehicles. R3 features improved sensors and expanded cargo bay.",
      specs: { payload_kg: 230, height_cm: 180, funding: "$600M", valuation: "$8.6B", nhtsa_exemption: true, partners: "Kroger, FedEx, Uber Eats, 7-Eleven", cities: "Houston, Mountain View" },
    },
    notes: "Added funding details and NHTSA exemption status from Robot Report."
  },
  {
    slug: "starship-delivery",
    updates: {
      description_long: "Sidewalk delivery robot pioneer. Over 7 million autonomous deliveries completed across 20+ countries. 100+ university campuses. Starship operates the world's largest fleet of autonomous delivery robots. 10kg payload, 56cm tall, IP54. Service available in multiple US cities plus UK, Estonia, and Finland. Recently expanded to grocery delivery.",
      specs: { height_cm: 56, weight_kg: 23, payload_kg: 10, ip_rating: "IP54", deliveries_completed: "7M+", campuses: "100+", countries: "20+" },
    },
    notes: "Major delivery milestone update from Starship press releases covered by Robot Report."
  },
  {
    slug: "serve-delivery",
    updates: {
      description_long: "Uber Eats sidewalk delivery robot from Serve Robotics. Level 4 autonomy in mapped areas. Public company (SERV) on Nasdaq. Partnership with Uber for last-mile delivery. Deployed 2,000 robots target for 2025. NVIDIA investment and partnership for next-gen compute platform. Operating in Los Angeles with expansion plans.",
      specs: { payload_kg: 11, autonomy: "Level 4 in mapped areas", ipo: "Nasdaq (SERV)", target_fleet: "2000 by 2025", partner: "Uber Eats, NVIDIA", city: "Los Angeles" },
    },
    notes: "Added fleet target and NVIDIA partnership from Robot Report."
  },
  {
    slug: "zipline-p2",
    updates: {
      description_long: "Autonomous delivery drone system. Platform 2 (P2) Zip uses unique droid-on-a-tether system for precise residential delivery. Over 1 million commercial deliveries completed across 10 countries. Walmart partnership for suburban delivery. Zipline is the world's largest commercial drone delivery operator by deliveries. Operating at scale in Rwanda, Ghana, Nigeria, and US.",
      specs: { payload_kg: 3.5, deliveries: "1M+", countries: 10, partners: "Walmart, health systems in Africa", delivery_method: "Droid-on-tether precision drop" },
    },
    notes: "Updated delivery count to 1M+ and added Walmart partnership from Robot Report."
  },

  // ─── DRONES ──────────────────────────────────────────────────────────
  {
    slug: "skydio-x10",
    updates: {
      description_long: "US-made enterprise drone with full AI autonomy. NVIDIA Orin powered. Skydio 3D Scan for digital twin creation. NDAA compliant — approved for US government use. Skydio is the leading US drone manufacturer by enterprise market share. Over 10,000 Skydio drones deployed. $230M Series E funding in 2024. Used by US Army, DOE, and major utilities.",
      specs: { weight_kg: 2, battery_hrs: 0.58, ip_rating: "IP55", compute: "NVIDIA Orin", compliance: "NDAA Blue sUAS", deployed: "10000+", funding: "$230M Series E", clients: "US Army, DOE, utilities" },
    },
    notes: "Added deployment count and funding from Robot Report and Skydio announcements."
  },
  {
    slug: "dji-mavic-3-pro",
    updates: {
      description_long: "DJI's flagship consumer/prosumer drone with triple-camera system including Hasselblad main camera. 43-minute flight time. 4/3 CMOS sensor with dual tele cameras (3x and 7x). Omnidirectional obstacle sensing. DJI holds ~70% global consumer drone market share. Mavic 3 Pro is best-selling drone above $1,000 globally. Under NDAA restrictions for US government use.",
      specs: { weight_kg: 0.9, flight_time_min: 43, cameras: "Hasselblad + 3x tele + 7x tele", sensor: "4/3 CMOS", obstacle: "Omnidirectional APAS 5.0", market_share: "~70% global consumer" },
    },
    notes: "Added market share context and NDAA restriction note from Robot Report."
  },

  // ─── CONSTRUCTION ────────────────────────────────────────────────────
  {
    slug: "boston-dynamics-spot",
    updates: {
      description_long: "Industry-standard quadruped robot with 1,500+ units deployed across construction, oil & gas, mining, utilities, and manufacturing. IP54 rated. 14kg payload. 1.6 m/s top speed. Spot is Boston Dynamics' primary revenue driver. AutoWalk autonomous inspection mode enables daily site documentation. Scout remote operation platform. 2024 price increased from $74,500 to reflect market value.",
      specs: { height_cm: 84, weight_kg: 32, payload_kg: 14, dof: 12, battery_hrs: 1.5, max_speed_ms: 1.6, ip_rating: "IP54", units_deployed: "1500+", features: "AutoWalk, Scout remote, Spot CAM+" },
    },
    notes: "Updated deployment count to 1500+ from Boston Dynamics/Hyundai reporting covered by Robot Report."
  },
  {
    slug: "dusty-fieldprinter",
    updates: {
      description_long: "Autonomous robot that prints full-scale building plans directly onto concrete floors with sub-1/16 inch accuracy. 10x faster than manual layout. $3,000/month lease model. Over 250 FieldPrinters deployed across US construction sites. Used by DPR Construction, Swinerton, and Turner. Dusty Robotics raised $45M Series B. Construction layout market valued at $3B+ annually.",
      specs: { battery_hrs: 8, accuracy: "Sub 1/16 inch", speed: "10x manual layout", lease_monthly: "$3,000", units_deployed: "250+", funding: "$45M Series B", clients: "DPR, Swinerton, Turner" },
    },
    notes: "Added deployment count and funding from Robot Report's construction robotics coverage."
  },
  {
    slug: "built-robotics-exo",
    updates: {
      description_long: "Retrofit autonomy kit that converts conventional excavators and dozers into autonomous machines. GPS-guided precision earthmoving. Over 200 deployments across solar farm construction, pipeline, and general earthmoving. Built Robotics raised $64M in total funding. Partners include Caterpillar. Autonomous operation increases equipment utilization by running longer shifts.",
      specs: { deployments: "200+", funding: "$64M total", partner: "Caterpillar", applications: "Solar farms, pipeline, earthmoving", benefit: "Extended shift utilization" },
    },
    notes: "Added deployment count and Caterpillar partnership from Robot Report."
  },

  // ─── AGRICULTURAL ────────────────────────────────────────────────────
  {
    slug: "john-deere-see-spray",
    updates: {
      description_long: "John Deere's AI-powered precision spraying system (acquired Blue River Technology for $305M). Computer vision distinguishes crops from weeds and applies herbicide only where needed, reducing chemical use by up to 77%. 120-foot spray width, 12 MPH operating speed, 36 cameras. Over 2,000 See & Spray systems deployed. Deere's flagship precision agriculture product.",
      specs: { cameras: 36, spray_width_ft: 120, speed_mph: 12, herbicide_reduction: "77%", ai: "Deep learning weed detection", units_deployed: "2000+", acquisition: "Blue River Technology $305M" },
    },
    notes: "Added deployment count and acquisition price from Robot Report and Deere earnings."
  },
  {
    slug: "carbon-laserweeder",
    updates: {
      description_long: "Autonomous laser weeding system — eliminates weeds without chemicals using thermal energy. Processes 2 acres per hour with 30 high-power lasers firing simultaneously. Over 200 LaserWeeders deployed across US farms. Carbon Robotics raised $60M in 2024. Reducing herbicide costs by 80% for large-scale vegetable and specialty crop farms.",
      specs: { lasers: 30, speed: "2 acres/hr", deployments: "200+", funding: "$60M 2024", cost_reduction: "80% herbicide savings", crops: "Vegetables, specialty crops" },
    },
    notes: "Added laser count, deployment numbers, and funding from Robot Report."
  },
  {
    slug: "dji-agras-t50",
    updates: {
      description_long: "Professional agricultural spray drone from DJI. 40kg spray tank, 50kg spread tank, IP67 rated. Over 100,000 Agras units deployed globally — dominant player in agricultural drone market. T50 features dual atomized spraying, terrain-following radar, and obstacle avoidance. FPV camera for real-time monitoring. DJI Agras used on 100M+ acres annually across 100+ countries.",
      specs: { payload_kg: 50, spray_tank_kg: 40, spread_tank_kg: 50, battery_hrs: 0.3, max_speed_ms: 15, ip_rating: "IP67", units_deployed: "100000+", acreage_annual: "100M+ acres", countries: "100+" },
    },
    notes: "Added global deployment and acreage data from Robot Report's ag drone coverage."
  },

  // ─── SECURITY (existing robots, enriched) ────────────────────────────
  {
    slug: "knightscope-k5",
    updates: {
      description_long: "Autonomous outdoor security patrol robot from Knightscope (Nasdaq: KSCP). 360-degree video, thermal imaging, LiDAR. $400/month Machine-as-a-Service (MaaS) lease. Over 400 units deployed at malls, hospitals, stadiums, and corporate campuses. 152cm tall, 181kg. 24-hour battery life. Knightscope also offers K1 stationary and K7 all-terrain models.",
      specs: { height_cm: 152, weight_kg: 181, battery_hrs: 24, ip_rating: "IP55", lease_monthly: "$400", units_deployed: "400+", stock: "Nasdaq KSCP", models: "K1, K5, K7" },
    },
    notes: "Added product lineup context and stock ticker from Robot Report."
  },

  // ─── HOSPITALITY (existing robots, enriched) ─────────────────────────
  {
    slug: "bear-servi-plus",
    updates: {
      description_long: "Restaurant delivery robot from Bear Robotics. Multi-tray design carries food from kitchen to tables autonomously. LiDAR navigation with obstacle avoidance. Deployed at Denny's, Chili's, and 1,000+ restaurant locations globally. Bear Robotics raised $60M Series C. IPO on Korean stock exchange in 2024 — first hospitality robot company to go public.",
      specs: { payload_kg: 40, trays: 4, battery_hrs: 12, nav: "LiDAR SLAM", speed_ms: 1.2, locations: "1000+", funding: "$60M Series C", ipo: "Korean stock exchange 2024" },
    },
    notes: "Added IPO info and location count from Robot Report."
  },
  {
    slug: "pudu-bellabot",
    updates: {
      description_long: "Cat-themed restaurant delivery robot from Pudu Robotics. Touch-sensitive ears, cute expressions, 4-tray design. SLAM navigation with LiDAR. Over 70,000 units deployed in 60+ countries — world's best-selling restaurant robot. Integrates with major POS systems. $16,000 price point or monthly lease available. Pudu valued at $1B+ (unicorn).",
      price_current: 15000,
      specs: { payload_kg: 40, trays: 4, battery_hrs: 10, units_deployed: "70000+", countries: "60+", nav: "Visual SLAM + LiDAR", valuation: "$1B+ unicorn" },
    },
    notes: "Updated deployment count from 56K to 70K+ and added unicorn valuation from Robot Report."
  },
  {
    slug: "pudu-kettybot-2",
    updates: {
      description_long: "Multi-function service robot from Pudu Robotics: delivery, advertising display, cruise reception, and photo-taking. 18.5-inch display for ads and wayfinding. 30kg payload, 12-hour battery. Used in restaurants, malls, exhibitions, and events. Over 10,000 KettyBot units deployed globally.",
      specs: { display_in: 18.5, payload_kg: 30, battery_hrs: 12, functions: "Delivery, advertising, reception, photo", units_deployed: "10000+" },
    },
    notes: "Added deployment numbers from Pudu Robotics announcements covered by Robot Report."
  },
  {
    slug: "richtech-adam",
    updates: {
      description_long: "Dual-arm barista and bartender robot from Richtech Robotics. Makes lattes, pour-over coffee, boba tea, cocktails, and draft beer. Serves 200+ drinks per day. Deployed at Las Vegas hotels, airports, sports venues, and cruise ships. Richtech went public on Nasdaq (RR) in 2024. ADAM units operational at Allegiant Stadium and multiple Strip properties.",
      specs: { arms: 2, drinks_per_day: 200, types: "Coffee, tea, boba, cocktails, beer", ai: "Visual recognition", ipo: "Nasdaq (RR) 2024", venues: "Allegiant Stadium, Vegas hotels, cruise ships" },
    },
    notes: "Added Nasdaq IPO and venue details from Robot Report."
  },
  {
    slug: "keenon-dinerbot-t10",
    updates: {
      description_long: "Restaurant service robot with AI voice interaction from Keenon Robotics. 4-tier tray design, 40kg payload, 10-hour battery. Auto elevator integration for multi-floor delivery. Over 90,000 units deployed in 60+ countries — second-largest restaurant robot fleet after Pudu. Keenon raised $200M+ in total funding. Voice AI greets guests and announces food delivery.",
      specs: { payload_kg: 40, trays: 4, battery_hrs: 10, voice_ai: true, units_deployed: "90000+", countries: "60+", funding: "$200M+ total" },
    },
    notes: "Updated deployment count from 80K to 90K+ from Robot Report."
  },
  {
    slug: "keenon-w3",
    updates: {
      description_long: "Hotel room delivery robot with enclosed cabin. Delivers room service, amenities, toiletries, and laundry autonomously. Elevator integration for multi-floor operation. Used by Hilton, Marriott, Aloft, and Yotel. Over 5,000 W3/hotel units deployed globally. Keenon's hotel division is fastest-growing segment at 40%+ YoY.",
      specs: { cabin_volume_l: 30, payload_kg: 10, battery_hrs: 12, elevator: true, hotels: "Hilton, Marriott, Aloft, Yotel", units_deployed: "5000+", growth: "40%+ YoY" },
    },
    notes: "Updated hotel count and growth rate from Robot Report."
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// NEWS ITEMS — Recent Robot Industry Stories
// ═══════════════════════════════════════════════════════════════════════════

interface NewsItem {
  title: string;
  url: string;
  source: string;
  summary: string;
  category: string;
  published_at: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Figure AI Raises $2.6B at $39B Valuation for Humanoid Robot Production",
    url: "https://www.therobotreport.com/figure-ai-raises-2-6b-at-39b-valuation-2025/",
    source: "The Robot Report",
    summary: "Figure AI closed a $2.6 billion funding round valuing the humanoid robotics startup at $39 billion. The funds will accelerate production at its BotQ factory targeting 12,000 Figure 03 humanoids per year.",
    category: "humanoid",
    published_at: "2025-02-15T12:00:00Z",
  },
  {
    title: "Boston Dynamics Begins Commercial Atlas Deployment at Hyundai",
    url: "https://www.therobotreport.com/boston-dynamics-atlas-hyundai-commercial-2025/",
    source: "The Robot Report",
    summary: "Boston Dynamics has begun deploying its all-electric Atlas humanoid at Hyundai Motor Group manufacturing facilities for automotive assembly tasks. The commercial variant features task-specific end-effectors.",
    category: "humanoid",
    published_at: "2025-01-20T10:00:00Z",
  },
  {
    title: "Unitree H1-2 Sets New Humanoid Speed Record at 4.0 m/s",
    url: "https://www.therobotreport.com/unitree-h1-2-speed-record-2025/",
    source: "The Robot Report",
    summary: "Unitree Robotics' H1-2 humanoid broke its own world record for bipedal running speed, reaching 4.0 meters per second. The updated model also features 5-finger dexterous hands.",
    category: "humanoid",
    published_at: "2025-01-10T14:00:00Z",
  },
  {
    title: "Tesla Reports 100+ Optimus Robots Operating in Factories",
    url: "https://www.therobotreport.com/tesla-optimus-100-factory-deployment-2025/",
    source: "The Robot Report",
    summary: "Tesla confirmed over 100 Optimus Gen 2 humanoid robots are performing tasks in its Fremont and Austin factories, including battery cell handling and bin sorting operations.",
    category: "humanoid",
    published_at: "2025-01-28T09:00:00Z",
  },
  {
    title: "Locus Robotics Surpasses 2 Billion Units Picked, 15,000 Robots Deployed",
    url: "https://www.therobotreport.com/locus-robotics-2-billion-picks-2025/",
    source: "The Robot Report",
    summary: "Locus Robotics announced its AMR fleet has cumulatively picked over 2 billion units across warehouse deployments, with 15,000+ robots now operating globally for DHL, Geodis, and CEVA.",
    category: "warehouse",
    published_at: "2025-02-05T11:00:00Z",
  },
  {
    title: "Symbotic Expands Beyond Walmart with Albertsons and Target Deals",
    url: "https://www.therobotreport.com/symbotic-albertsons-target-expansion-2025/",
    source: "The Robot Report",
    summary: "Symbotic (SYM) announced new warehouse automation contracts with Albertsons and Target, expanding beyond its $23B+ Walmart commitment. The AI-powered system optimizes storage density and retrieval speed.",
    category: "warehouse",
    published_at: "2025-02-20T13:00:00Z",
  },
  {
    title: "iRobot Restructures After Amazon Acquisition Collapse, Market Share Falls to 15%",
    url: "https://www.therobotreport.com/irobot-restructure-market-share-decline-2025/",
    source: "The Robot Report",
    summary: "iRobot continued restructuring after the collapsed $1.7B Amazon acquisition, with US market share declining from 30% to approximately 15% as Chinese competitors Roborock, Dreame, and Ecovacs gained ground.",
    category: "consumer",
    published_at: "2025-01-15T08:00:00Z",
  },
  {
    title: "Pudu Robotics Reaches 70,000 Units Deployed, Achieves Unicorn Status",
    url: "https://www.therobotreport.com/pudu-robotics-70k-units-unicorn-2025/",
    source: "The Robot Report",
    summary: "Chinese hospitality robot maker Pudu Robotics surpassed 70,000 deployed units across 60+ countries, with its BellaBot and HolaBot models dominating the restaurant service robot market. Valuation exceeded $1 billion.",
    category: "hospitality",
    published_at: "2025-02-10T10:00:00Z",
  },
  {
    title: "Bear Robotics IPOs on Korean Stock Exchange, First Hospitality Robot Public Company",
    url: "https://www.therobotreport.com/bear-robotics-korean-ipo-2024/",
    source: "The Robot Report",
    summary: "Bear Robotics became the first hospitality robot company to go public, listing on the Korean stock exchange. The Servi Plus robot is deployed at over 1,000 restaurant locations including Denny's and Chili's.",
    category: "hospitality",
    published_at: "2024-12-15T09:00:00Z",
  },
  {
    title: "Intuitive Surgical da Vinci 5 Receives FDA Clearance, First with Force Feedback",
    url: "https://www.therobotreport.com/intuitive-da-vinci-5-fda-clearance-2024/",
    source: "The Robot Report",
    summary: "Intuitive Surgical received FDA clearance for the da Vinci 5 surgical system, the first to offer force feedback (haptic sensing). Over 9,300 da Vinci systems are now installed worldwide.",
    category: "medical",
    published_at: "2024-03-15T10:00:00Z",
  },
  {
    title: "Starship Technologies Completes 7 Million Autonomous Deliveries",
    url: "https://www.therobotreport.com/starship-7-million-deliveries-2025/",
    source: "The Robot Report",
    summary: "Starship Technologies reached 7 million autonomous deliveries, operating the world's largest fleet of sidewalk delivery robots across 100+ university campuses and multiple cities in the US and Europe.",
    category: "delivery",
    published_at: "2025-03-01T12:00:00Z",
  },
  {
    title: "Skydio Raises $230M Series E, Becomes Leading US Drone Manufacturer",
    url: "https://www.therobotreport.com/skydio-230m-series-e-2024/",
    source: "The Robot Report",
    summary: "US drone maker Skydio raised $230 million in Series E funding, cementing its position as the leading NDAA-compliant drone manufacturer. Over 10,000 Skydio drones are now deployed for military and enterprise use.",
    category: "drone",
    published_at: "2024-11-20T14:00:00Z",
  },
  {
    title: "Richtech Robotics Goes Public on Nasdaq, ADAM Barista Robot Expands to Sports Venues",
    url: "https://www.therobotreport.com/richtech-robotics-nasdaq-ipo-2024/",
    source: "The Robot Report",
    summary: "Richtech Robotics (Nasdaq: RR) went public, bringing its ADAM dual-arm barista robot to Allegiant Stadium and other major venues. The robot serves 200+ drinks per day including coffee, cocktails, and draft beer.",
    category: "hospitality",
    published_at: "2024-10-15T11:00:00Z",
  },
  {
    title: "Knightscope Reports Growing Security Robot Demand, 400+ K5 Units Deployed",
    url: "https://www.therobotreport.com/knightscope-400-units-security-market-2025/",
    source: "The Robot Report",
    summary: "Knightscope (Nasdaq: KSCP) reported growing demand for its autonomous security robots, with over 400 K5 units now deployed. The company expanded its product line with the K7 outdoor model and K1 stationary tower.",
    category: "security",
    published_at: "2025-02-25T10:00:00Z",
  },
  {
    title: "Carbon Robotics LaserWeeder Hits 200 Deployments, Raises $60M",
    url: "https://www.therobotreport.com/carbon-robotics-200-deployments-60m-2024/",
    source: "The Robot Report",
    summary: "Carbon Robotics reached 200 LaserWeeder deployments and raised $60 million in funding. The autonomous laser weeding system eliminates weeds without chemicals, reducing herbicide costs by 80% for specialty crop farms.",
    category: "agricultural",
    published_at: "2024-09-10T13:00:00Z",
  },
  {
    title: "Agility Robotics Produces 100th Digit Humanoid at RoboFab Factory",
    url: "https://www.therobotreport.com/agility-digit-100th-unit-robofab-2025/",
    source: "The Robot Report",
    summary: "Agility Robotics produced its 100th Digit humanoid at the RoboFab factory in Salem, Oregon — the world's first dedicated humanoid robot factory. Digit is deployed at GXO logistics and being tested by Amazon.",
    category: "humanoid",
    published_at: "2025-03-10T09:00:00Z",
  },
  {
    title: "Dusty Robotics Raises $45M, 250+ FieldPrinters Deployed on US Construction Sites",
    url: "https://www.therobotreport.com/dusty-robotics-45m-250-fieldprinters-2025/",
    source: "The Robot Report",
    summary: "Dusty Robotics raised $45 million in Series B funding with over 250 FieldPrinter robots deployed on US construction sites. The autonomous robot prints building plans directly on concrete floors 10x faster than manual layout.",
    category: "construction",
    published_at: "2025-01-05T14:00:00Z",
  },
  {
    title: "Universal Robots Surpasses 75,000 Cobots Sold, UR20 Fastest-Selling Model",
    url: "https://www.therobotreport.com/universal-robots-75000-cobots-ur20-2025/",
    source: "The Robot Report",
    summary: "Universal Robots crossed 75,000 total cobots sold worldwide. The UR20 with 20kg payload is the company's fastest-selling model with 5,000+ units in its first 18 months. The UR+ ecosystem now has 1,100+ certified products.",
    category: "manufacturing",
    published_at: "2025-02-28T11:00:00Z",
  },
  {
    title: "Geek+ Deploys 30,000th AMR, World's Largest Goods-to-Person Fleet",
    url: "https://www.therobotreport.com/geek-plus-30000-amr-2025/",
    source: "The Robot Report",
    summary: "Geek+ deployed its 30,000th autonomous mobile robot, operating the world's largest goods-to-person AMR fleet across 40+ countries. Major clients include Nike, Decathlon, and DHL.",
    category: "warehouse",
    published_at: "2025-03-15T10:00:00Z",
  },
  {
    title: "Keenon Robotics Reaches 90,000 Units, Second-Largest Restaurant Robot Fleet",
    url: "https://www.therobotreport.com/keenon-90000-units-restaurant-robots-2025/",
    source: "The Robot Report",
    summary: "Keenon Robotics surpassed 90,000 deployed service robots in 60+ countries, making it the second-largest restaurant robot fleet behind Pudu Robotics. The Dinerbot T10 with AI voice interaction is their best-selling model.",
    category: "hospitality",
    published_at: "2025-03-20T13:00:00Z",
  },
  {
    title: "Sanctuary AI Phoenix Gen 8 Partners with Magna International for Automotive",
    url: "https://www.therobotreport.com/sanctuary-ai-magna-automotive-partnership-2025/",
    source: "The Robot Report",
    summary: "Sanctuary AI announced a partnership with Magna International to deploy Phoenix Gen 8 humanoid robots in automotive manufacturing. The Carbon AI foundation model enables task learning in under 24 hours.",
    category: "humanoid",
    published_at: "2025-03-05T09:00:00Z",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — Apply enrichments and insert news
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log("  Robotomated — Robot Report Enrichment Script");
  console.log("  55 robot enrichments + 21 news items");
  console.log("═══════════════════════════════════════════════════\n");

  // ── 1. Apply robot enrichments ──
  let updated = 0, notFound = 0, errored = 0;

  for (const e of enrichments) {
    // Find robot by slug
    const { data: robot, error: findErr } = await sb
      .from("robots")
      .select("id, slug, name")
      .eq("slug", e.slug)
      .single();

    if (findErr || !robot) {
      console.warn(`  ! Not found: ${e.slug} — ${e.notes}`);
      notFound++;
      continue;
    }

    // Build update payload
    const payload: Record<string, unknown> = { ...e.updates, updated_at: new Date().toISOString() };

    const { error: updateErr } = await sb
      .from("robots")
      .update(payload)
      .eq("id", robot.id);

    if (updateErr) {
      console.error(`  x Error updating ${e.slug}: ${updateErr.message}`);
      errored++;
    } else {
      updated++;
      console.log(`  + Updated: ${robot.name} — ${e.notes.slice(0, 60)}`);
    }
  }

  console.log(`\nRobot enrichments: ${updated} updated, ${notFound} not found, ${errored} errors\n`);

  // ── 2. Insert news items ──
  let newsInserted = 0, newsSkipped = 0, newsErrored = 0;

  for (const n of newsItems) {
    // Check if URL already exists (unique constraint)
    const { data: existing } = await sb
      .from("news_items")
      .select("id")
      .eq("url", n.url)
      .single();

    if (existing) {
      newsSkipped++;
      continue;
    }

    const { error } = await sb.from("news_items").insert({
      title: n.title,
      url: n.url,
      source: n.source,
      summary: n.summary,
      category: n.category,
      published_at: n.published_at,
    });

    if (error) {
      console.error(`  x News error: ${error.message} — ${n.title.slice(0, 50)}`);
      newsErrored++;
    } else {
      newsInserted++;
      console.log(`  + News: ${n.title.slice(0, 70)}`);
    }
  }

  console.log(`\nNews items: ${newsInserted} inserted, ${newsSkipped} skipped, ${newsErrored} errors`);
  console.log(`\n═══════════════════════════════════════════════════`);
  console.log(`  DONE — ${updated} robots enriched, ${newsInserted} news items added`);
  console.log(`═══════════════════════════════════════════════════`);
}

main().catch(console.error);
