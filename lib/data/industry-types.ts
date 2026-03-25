/**
 * Robot type classification per industry.
 * Maps robots to sub-types within each industry using keyword matching.
 */

export interface RobotType {
  id: string;
  label: string;
  description: string;
}

export interface IndustryConfig {
  slug: string;
  categorySlug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  marketStats: { label: string; value: string; subtext: string }[];
  types: RobotType[];
  typeKeywords: Record<string, string[]>; // type id → keywords to match
  faqs: { question: string; answer: string }[];
  buyerGuide: { heading: string; content: string }[];
  calculatorInputs: "warehouse" | "medical" | "manufacturing" | "agricultural";
  ctaText: string;
}

export const INDUSTRIES: Record<string, IndustryConfig> = {
  "warehouse-robotics": {
    slug: "warehouse-robotics",
    categorySlug: "warehouse",
    name: "Warehouse Robotics",
    metaTitle: "Best Warehouse Robots 2026 — Compare Systems by Use Case | Robotomated",
    metaDescription: "Compare 15+ warehouse robots across 5 use cases: picking, pallet transport, inventory, sorting, loading. Real specs, verified ROI data, and interactive calculator.",
    heroTitle: "Warehouse Robotics Guide (2026)",
    heroSubtitle: "Compare warehouse robots across 5 use cases — real specs, verified ROI",
    marketStats: [
      { label: "Market Size", value: "$28B", subtext: "projected by 2030" },
      { label: "Avg. ROI Payback", value: "18 mo", subtext: "at standard utilization" },
      { label: "Labor Cost Reduction", value: "40-65%", subtext: "in automated facilities" },
    ],
    types: [
      { id: "picking", label: "Goods-to-Person Picking", description: "AMRs, robotic arms, and picking systems for automating order fulfillment." },
      { id: "pallet", label: "Pallet Moving & Transport", description: "AGVs, autonomous forklifts, and tuggers for moving heavy loads between locations." },
      { id: "inventory", label: "Inventory & Scanning", description: "Autonomous drones and ground robots for real-time inventory counting and tracking." },
      { id: "sorting", label: "Sorting & Fulfillment", description: "Conveyor robots and sorting systems for last-mile package routing." },
      { id: "loading", label: "Loading & Unloading", description: "Depalletizers, truck unloaders, and dock automation systems." },
    ],
    typeKeywords: {
      picking: ["picking", "fulfillment", "goods-to-person", "piece-pick", "each-pick", "pick rate", "picker"],
      pallet: ["pallet", "agv", "tugger", "forklift", "transport", "heavy load", "dock-to"],
      inventory: ["inventory", "scanning", "rfid", "stocktak", "cycle count", "audit"],
      sorting: ["sorting", "conveyor", "last-mile", "parcel", "package", "route"],
      loading: ["loading", "unloading", "depalletiz", "truck", "trailer", "stretch"],
    },
    faqs: [
      { question: "How much does a warehouse robot cost?", answer: "Warehouse robot prices range from $25,000 for basic AMRs to $500,000+ for heavy-duty autonomous forklifts. Most goods-to-person AMR systems cost $30,000-$80,000 per unit. Total deployment costs including integration, training, and infrastructure typically add 30-50% on top of hardware costs." },
      { question: "What is the ROI of warehouse automation?", answer: "Most warehouse robot deployments achieve positive ROI within 12-24 months. Key factors include labor cost savings (40-65% reduction), throughput improvements (2-3x for picking), and error reduction (80-90% fewer mispicks). A 10-robot AMR deployment replacing 6-8 workers typically breaks even in 14-18 months." },
      { question: "AMR vs AGV — what's the difference?", answer: "AMRs (Autonomous Mobile Robots) navigate dynamically using sensors and AI without infrastructure changes. AGVs (Automated Guided Vehicles) follow fixed paths using magnetic tape or wires. AMRs cost more per unit but require no floor modifications. AGVs are cheaper but less flexible. Choose AMRs for changing layouts, AGVs for high-volume fixed routes." },
      { question: "How long does it take to implement warehouse robots?", answer: "Simple AMR deployments can go live in 4-8 weeks. Full AS/RS or shuttle systems take 6-12 months. Most AMR vendors offer pilot programs starting with a small zone in 2-3 weeks. WMS integration adds 2-4 weeks. Full facility rollout with process optimization takes 2-3 months." },
      { question: "Do warehouse robots replace workers?", answer: "Warehouse robots augment workers more than replace them. Most deployments shift workers from walking and carrying (60-70% of picker time) to higher-value tasks. Industry data shows facilities deploying robots often increase total headcount due to volume growth while reducing cost-per-unit by 40-60%." },
      { question: "What is goods-to-person picking?", answer: "Goods-to-person (G2P) is a fulfillment method where AMRs bring shelves or totes directly to stationary pickers, eliminating walking time. Pickers stay at workstations while robots queue up inventory. G2P systems achieve 2-3x pick rate improvements and reduce picker walking from 10+ miles per shift to near zero." },
      { question: "What warehouse size needs robots?", answer: "Robots become cost-effective at about 20,000 sq ft with 5+ workers handling repetitive tasks. The sweet spot is 50,000-500,000 sq ft with 20-200 workers, where 5-30 AMRs deliver the strongest ROI. Smaller facilities can benefit from single-robot deployments for specific bottlenecks." },
      { question: "How to justify robot ROI to your CFO", answer: "Build the case around: (1) labor cost savings with loaded hourly rates, (2) throughput increase enabling more revenue from existing space, (3) error reduction and its downstream cost impact, (4) worker injury reduction and insurance savings, (5) 3-shift operation without overtime premiums. Use conservative assumptions and show 12-month, 24-month, and 36-month scenarios." },
    ],
    buyerGuide: [
      { heading: "AMR vs AGV vs Fixed Automation", content: "AMRs navigate dynamically with no infrastructure changes — ideal for changing layouts. AGVs follow fixed paths using magnetic tape — cheaper but less flexible. Fixed automation (conveyors, AS/RS) delivers highest throughput but requires significant capital and long installation." },
      { heading: "Implementation Checklist", content: "1) Floor quality — smooth, flat surfaces required. 2) Enterprise WiFi coverage with <50ms latency. 3) Aisle width (4+ feet for AMRs). 4) WMS/ERP integration points mapped. 5) Change management plan with 30-60 day ramp-up." },
      { heading: "Vendor Questions", content: "Ask about total deployed cost, mixed traffic handling, system outage procedures, annual software/maintenance fees, reference customers, uptime SLAs, scaling approach, and analytics capabilities." },
    ],
    calculatorInputs: "warehouse",
    ctaText: "Find your warehouse robot",
  },

  "medical-robotics": {
    slug: "medical-robotics",
    categorySlug: "medical",
    name: "Medical Robotics",
    metaTitle: "Best Medical & Surgical Robots 2026 — Compare Systems | Robotomated",
    metaDescription: "Compare leading medical robots of 2026: surgical systems, rehabilitation, hospital logistics. Real specs, clinical evidence, and ROI analysis for healthcare facilities.",
    heroTitle: "Medical Robotics Guide (2026)",
    heroSubtitle: "Compare surgical, rehabilitation, and logistics robots for healthcare",
    marketStats: [
      { label: "Market Size", value: "$20B", subtext: "projected by 2028" },
      { label: "Surgical Precision", value: "0.1mm", subtext: "sub-millimeter accuracy" },
      { label: "Recovery Improvement", value: "30-50%", subtext: "faster patient recovery" },
    ],
    types: [
      { id: "surgical", label: "Surgical Robots", description: "da Vinci, Mako, and robotic-assisted surgery platforms for minimally invasive procedures." },
      { id: "rehabilitation", label: "Rehabilitation & Therapy", description: "Exoskeletons, physical therapy robots, and recovery assistance systems." },
      { id: "logistics", label: "Hospital Logistics", description: "Medication delivery, supply transport, and pharmacy automation robots." },
      { id: "diagnostics", label: "Diagnostics & Imaging", description: "AI-powered diagnostic assistance and imaging guidance robots." },
      { id: "sanitation", label: "Disinfection & Sanitation", description: "UV disinfection robots and hospital cleaning automation." },
    ],
    typeKeywords: {
      surgical: ["surgical", "surgery", "robotic-assisted", "minimally invasive", "endoscop", "da vinci", "mako", "hugo"],
      rehabilitation: ["rehabilitation", "exoskeleton", "therapy", "rehab", "recovery", "walker", "gait"],
      logistics: ["delivery", "logistics", "pharmacy", "medication", "transport", "supply", "cart"],
      diagnostics: ["diagnostic", "imaging", "biopsy", "endoscop", "catheter", "ion"],
      sanitation: ["disinfect", "uv", "cleaning", "sanitiz", "steriliz"],
    },
    faqs: [
      { question: "How much does a surgical robot cost?", answer: "Surgical robot systems range from $500,000 for single-specialty platforms to $2.5M+ for multi-specialty systems like the da Vinci 5. Annual service contracts add $150,000-$300,000. Per-procedure instrument costs run $700-$3,500. Most hospitals finance over 5-7 years." },
      { question: "What is the robotic surgery success rate?", answer: "Robotic surgery achieves comparable or better outcomes than traditional surgery across most specialties. Studies show 30-50% less blood loss, 1-2 day shorter hospital stays, 20-40% lower complication rates, and 2-4 week faster recovery compared to open surgery." },
      { question: "da Vinci vs Mako — what's the difference?", answer: "da Vinci (Intuitive) is a multi-specialty surgical platform for soft tissue procedures (prostatectomy, hysterectomy, cardiac). Mako (Stryker) specializes in orthopedic joint replacement with haptic boundary guidance. They serve different surgical specialties and are not direct competitors." },
      { question: "Are medical robots FDA approved?", answer: "All medical robots used in the US require FDA clearance, typically through the 510(k) pathway. da Vinci, MAKO, Hugo RAS, and Ion are all FDA-cleared. Rehabilitation robots also require FDA classification. International markets require CE marking (EU), PMDA (Japan), or equivalent." },
      { question: "What is the ROI of surgical robots for hospitals?", answer: "At 200+ robotic cases per year, most hospitals achieve payback in 3-5 years. Revenue drivers include attracting surgeons/patients, reducing complications, shorter OR times at scale, and premium reimbursement for certain procedures." },
      { question: "Can robots perform surgery autonomously?", answer: "No current surgical robot operates autonomously. All FDA-cleared systems are surgeon-controlled — the robot translates hand movements into precise instrument motions. Some systems provide guidance (like MAKO's haptic boundaries) but the surgeon always maintains control." },
      { question: "What hospital size justifies a surgical robot?", answer: "Generally, hospitals performing 150+ eligible surgical cases annually can justify a robotic system. Community hospitals (200-400 beds) are the fastest-growing segment. Smaller facilities may benefit from shared-use or mobile robotic programs." },
      { question: "How long does surgeon training take?", answer: "Initial certification requires 40-80 hours including simulation, dry lab, wet lab, and proctored cases. Most surgeons complete certification in 2-4 months. Proficiency (matching open surgery speed) typically takes 20-40 cases." },
    ],
    buyerGuide: [
      { heading: "Surgical vs Rehabilitation vs Logistics", content: "Surgical robots ($1M-$4M) deliver measurable clinical benefits. Rehabilitation robots ($100K-$500K) improve therapy consistency. Hospital logistics robots ($100K-$250K) automate transport tasks consuming 20-30% of nursing time." },
      { heading: "Implementation Checklist", content: "1) Clinical champion identified. 2) Case volume analysis completed. 3) Space requirements assessed. 4) IT infrastructure (WiFi, EMR integration) verified. 5) Training program budgeted (40-80 hrs per surgeon). 6) Regulatory compliance confirmed." },
      { heading: "Vendor Questions", content: "Ask about clinical evidence for your case mix, total 5-year cost, EMR integration, training/proctoring, uptime SLAs, peer references, technology roadmap, and HIPAA compliance." },
    ],
    calculatorInputs: "medical",
    ctaText: "Find your medical robot",
  },

  "manufacturing-robotics": {
    slug: "manufacturing-robotics",
    categorySlug: "manufacturing",
    name: "Manufacturing Robotics",
    metaTitle: "Best Manufacturing Robots 2026 — Compare 20+ Cobots & Arms | Robotomated",
    metaDescription: "Compare 20+ manufacturing robots: collaborative cobots, industrial arms, welding systems. Real specs, payload data, and ROI calculators for production facilities.",
    heroTitle: "Manufacturing Robotics Guide (2026)",
    heroSubtitle: "Compare 20+ cobots and industrial arms by application type",
    marketStats: [
      { label: "Market Size", value: "$45B", subtext: "industrial robotics by 2030" },
      { label: "Productivity Gain", value: "30-50%", subtext: "average output increase" },
      { label: "Cobot Growth", value: "32% CAGR", subtext: "fastest-growing segment" },
    ],
    types: [
      { id: "welding", label: "Welding & Fabrication", description: "Robotic welding cells for consistent bead quality across high-volume production." },
      { id: "assembly", label: "Assembly & Pick-and-Place", description: "Cobots and SCARA robots for assembly, machine tending, and parts handling." },
      { id: "inspection", label: "Quality Inspection", description: "Vision-equipped robots for inline defect detection and dimensional verification." },
      { id: "material", label: "Material Handling", description: "Conveyor systems, palletizers, and automated material transport." },
      { id: "cobots", label: "Collaborative Cobots", description: "Force-limited robots designed to work alongside human operators without caging." },
    ],
    typeKeywords: {
      welding: ["welding", "weld", "fabricat", "mig", "tig", "arc"],
      assembly: ["assembly", "pick and place", "pick-and-place", "machine tend", "scara", "sorting"],
      inspection: ["inspection", "quality", "vision", "defect", "measure", "dimensional"],
      material: ["material handling", "conveyor", "palletiz", "packaging", "depalletiz"],
      cobots: ["collaborative", "cobot", "force-limit", "hand-guid", "safety-rated", "ur5", "ur10", "ur20", "crx", "gofa", "tm12"],
    },
    faqs: [
      { question: "How much does a manufacturing robot cost?", answer: "Manufacturing robots range from $25,000 for basic cobots to $400,000+ for large industrial arms. Complete robotic work cells (robot + tooling + safety + integration) cost 2-3x the robot alone: $75K-$250K for cobot cells, $200K-$1M+ for industrial cells." },
      { question: "What is a collaborative robot (cobot)?", answer: "A cobot is designed to work alongside humans without safety caging, using force-limiting technology and collision detection. Major brands: Universal Robots (UR5e, UR10e, UR20), FANUC CRX, ABB GoFa, Techman TM. Ideal for high-mix production with frequent changeovers." },
      { question: "How long does robot setup take?", answer: "Simple cobot deployments take 1-4 weeks. Complex industrial cells with custom tooling take 8-16 weeks. Critical path: end-of-arm tooling design (4-8 weeks) and system integration (2-4 weeks). Plan for 1-2 week production ramp-up." },
      { question: "Do I need a programmer on staff?", answer: "Modern cobots are designed for non-programmer operation via hand-guiding and graphical interfaces. Industrial robots still benefit from dedicated programmers for complex applications. Many integrators offer remote programming support as a service." },
      { question: "What payload and reach do I need?", answer: "Payload must exceed your heaviest part plus gripper weight — add 30% margin. Common ranges: small assembly (3-5kg, 500-700mm reach), machine tending (10-16kg, 900-1300mm), palletizing (20-30kg, 1700-1800mm)." },
      { question: "Are manufacturing robots safe?", answer: "Yes, when properly risk-assessed per ISO 10218 and ISO/TS 15066. Cobots include built-in force/power limiting. Industrial robots require safety fencing or area scanners. A risk assessment is mandatory before deployment." },
      { question: "What ROI can I expect?", answer: "Typical deployments achieve 30-50% productivity gains and payback in 12-24 months (single shift). Multi-shift operations see 6-12 month payback. Additional ROI from 50-90% defect reduction, less scrap, and fewer worker comp claims." },
      { question: "Can robots handle high-mix production?", answer: "Yes. Quick-change tooling swaps end-effectors in <60 seconds. Vision systems identify parts without dedicated fixtures. Cobots can be repositioned between workstations. Key: design flexible cells with standardized interfaces." },
    ],
    buyerGuide: [
      { heading: "Cobots vs Industrial Arms", content: "Cobots ($25K-$80K) work alongside humans without caging — ideal for high-mix, low-volume. Industrial arms ($50K-$400K) deliver maximum speed and payload with safety fencing — best for high-volume dedicated applications." },
      { heading: "Implementation Checklist", content: "1) Define exact task parameters (pick/place points, cycle time, payload). 2) Validate end-of-arm tooling with prototypes. 3) Simulate real-world cycle times. 4) Map integration scope. 5) Budget operator training (24-40 hrs). 6) Complete risk assessment." },
      { heading: "Vendor Questions", content: "Ask about total cell cost, demonstration with your parts, actual cycle time, programming interface, MTBF, annual maintenance, part variability handling, and safety standards compliance." },
    ],
    calculatorInputs: "manufacturing",
    ctaText: "Find your manufacturing robot",
  },

  "agricultural-robotics": {
    slug: "agricultural-robotics",
    categorySlug: "agricultural",
    name: "Agricultural Robotics",
    metaTitle: "Best Agricultural Robots 2026 — Farming Automation | Robotomated",
    metaDescription: "Compare agricultural robots: crop spraying drones, weeding robots, harvesting systems. Real field data, specs, and ROI calculators for farms and agribusinesses.",
    heroTitle: "Agricultural Robotics Guide (2026)",
    heroSubtitle: "Compare crop drones, weeding robots, and autonomous farming systems",
    marketStats: [
      { label: "Market Size", value: "$12B", subtext: "projected by 2028" },
      { label: "Chemical Reduction", value: "80-90%", subtext: "with precision application" },
      { label: "Labor Savings", value: "50-70%", subtext: "in targeted operations" },
    ],
    types: [
      { id: "spraying", label: "Crop Spraying & Treatment", description: "Agricultural drones and ground sprayers for precision pesticide and fertilizer application." },
      { id: "harvesting", label: "Harvesting", description: "Autonomous picking robots for fruit, vegetables, and specialty crops." },
      { id: "weeding", label: "Weeding & Pest Control", description: "Laser weeding, micro-spraying, and mechanical weeding robots for chemical-free fields." },
      { id: "monitoring", label: "Soil & Crop Monitoring", description: "Scouting drones and ground robots for crop health, soil, and irrigation monitoring." },
    ],
    typeKeywords: {
      spraying: ["spray", "spraying", "pesticide", "herbicide", "fertiliz", "agras", "crop treatment", "application"],
      harvesting: ["harvest", "picking", "fruit", "berry", "apple", "grape"],
      weeding: ["weed", "laser", "mechanical weed", "spot-spray", "pest control"],
      monitoring: ["monitor", "scout", "soil", "ndvi", "multispectral", "imaging", "map", "survey"],
    },
    faqs: [
      { question: "How much do agricultural robots cost?", answer: "Spraying drones ($10K-$50K), autonomous weeding robots ($100K-$500K), autonomous tractors ($200K-$1M+). Drone-as-a-service starts at $8-15/acre. Most farms achieve ROI within 1-3 growing seasons." },
      { question: "How many acres can a farm drone cover?", answer: "Modern drones like DJI Agras T50 spray 15-25 acres/hour with 40L payload. A single drone covers 100-200 acres/day. Multi-drone fleets with automated charging cover 500+ acres daily." },
      { question: "Do agricultural robots work in all weather?", answer: "Most operate in light rain and moderate wind but not heavy storms. Drones have wind limits of 15-25 mph. Ground robots handle light rain but struggle in saturated soil. Temperature range typically 0-45°C." },
      { question: "Can robots reduce pesticide usage?", answer: "Yes. Precision spraying drones reduce chemicals 30-50%. Spot-spraying systems like See & Spray reduce herbicide 60-77%. Laser weeding eliminates herbicides entirely for weed control." },
      { question: "What crops benefit most from robots?", answer: "High-value specialty crops (grapes, berries, tree fruit) see highest ROI. Row crops benefit from precision weeding and spraying. Orchards benefit from autonomous mowing/spraying. Large grain operations benefit from autonomous tractors." },
      { question: "Do I need a drone pilot license?", answer: "In the US, commercial drone operation requires FAA Part 107 certification. Agricultural spraying may require state pesticide applicator licensing. Training takes 2-4 weeks. Some service providers handle licensing and fly for you." },
      { question: "How do farm robots handle obstacles?", answer: "Modern farm robots use RTK GPS (centimeter accuracy), LiDAR, cameras, and ultrasonic sensors. They create field maps during setup and update in real-time. Geofencing prevents leaving designated areas." },
      { question: "What are the labor savings?", answer: "50-70% reduction for targeted operations. A weeding robot replaces 10-20 hand-weeding laborers. A spraying drone replaces a tractor operator plus crew. Autonomous harvesters achieve 50-70% of human speed but work continuously." },
    ],
    buyerGuide: [
      { heading: "Drones vs Ground Robots vs Autonomous Equipment", content: "Drones ($10K-$50K) excel at spraying and mapping — 15-40 acres/hour. Ground robots ($100K-$500K) handle weeding and planting with sub-cm precision. Autonomous equipment ($200K-$1M+) handles tillage, planting, and harvest at full scale." },
      { heading: "Implementation Checklist", content: "1) Acreage analysis (500+ acres for standalone ROI). 2) Terrain evaluation (slope, soil, canopy). 3) Connectivity (RTK GPS, cellular/Starlink). 4) Regulatory compliance (FAA Part 107, state licenses). 5) Seasonal economics (3-6 month utilization)." },
      { heading: "Vendor Questions", content: "Ask about acres/hour throughput for your crop, wet/hilly performance, chemical savings, connectivity requirements, seasonal maintenance, field trial data, crew training, and crop variability handling." },
    ],
    calculatorInputs: "agricultural",
    ctaText: "Find your agricultural robot",
  },
};

/**
 * Classify a robot into a type within its industry based on keywords in name, description, and specs.
 */
export function classifyRobotType(
  industry: IndustryConfig,
  robot: { name: string; description_short: string | null; description_long: string | null; specs: Record<string, unknown> | null }
): string {
  const text = [
    robot.name,
    robot.description_short || "",
    robot.description_long || "",
    JSON.stringify(robot.specs || {}),
  ].join(" ").toLowerCase();

  for (const type of industry.types) {
    const keywords = industry.typeKeywords[type.id] || [];
    if (keywords.some(kw => text.includes(kw))) {
      return type.id;
    }
  }

  // Default to first type
  return industry.types[0]?.id || "general";
}

export function getIndustry(slug: string): IndustryConfig | null {
  return INDUSTRIES[slug] || null;
}

export function getAllIndustrySlugs(): string[] {
  return Object.keys(INDUSTRIES);
}
