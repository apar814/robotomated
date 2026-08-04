/**
 * Case studies — governed by docs/claims-policy.md.
 *
 * Two kinds of entries:
 * 1. Real companies (illustrative: false/absent) — every metric is either
 *    cited in `sources` or attributed in-text as a company-stated claim.
 * 2. Illustrative composites (illustrative: true) — deployment patterns
 *    modeled on how the technology is typically used. No real company, no
 *    invented precision. The renderer MUST show the illustrative label.
 *
 * History: on 2026-08-03 all unattributable quotes (6) and invented metrics
 * were removed. Do not add a quote without a named person, named company,
 * and a public source. Do not add a metric without a source.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  companyType: string;
  industry: string;
  industrySlug: string;
  categorySlug: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  illustrative?: boolean;
  sources?: { label: string; url: string }[];
  problem: {
    summary: string;
    details: string[];
  };
  solution: {
    summary: string;
    robots: string;
    details: string[];
  };
  implementation: {
    timeline: string;
    phases: { name: string; duration: string; description: string }[];
  };
  results: {
    metrics: { label: string; value: string; detail: string }[];
    paybackPeriod: string;
    quote?: { text: string; author: string; role: string };
  };
  lessons: string[];
  relatedRobotSlugs: string[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "ocado-warehouse-automation",
    title: "How Ocado Automated Grocery Fulfillment with Grid Robots",
    company: "Ocado",
    companyType: "UK online grocery retailer and technology licensor",
    industry: "Warehouse & Logistics",
    industrySlug: "warehouse-robotics",
    categorySlug: "warehouse",
    metaTitle: "Case Study: Ocado Warehouse Automation — Grid Robot Swarms",
    metaDescription:
      "How Ocado runs fulfillment centres where thousands of grid robots pick grocery orders, and licenses the platform to retailers worldwide.",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",
    sources: [
      { label: "Tech Insider — Inside Ocado's robotic warehouse", url: "https://www.youtube.com/watch?v=4DKrcpa8Z_E" },
      { label: "Grocery Dive — How Ocado is innovating in e-commerce", url: "https://www.grocerydive.com/news/lighter-bots-faster-orders-how-ocado-is-innovating-in-e-commerce/617824/" },
    ],
    problem: {
      summary:
        "Online grocery at scale means assembling large multi-temperature orders in minutes — a pace manual warehouse picking cannot sustain.",
      details: [
        "Grocery orders combine dozens of items across ambient, chilled, and frozen zones",
        "Manual picking time is dominated by walking, not selecting items",
        "24/7 manual operations at national scale carry unsustainable labor economics",
      ],
    },
    solution: {
      summary:
        "Ocado built a grid-based fulfillment platform where swarms of robots retrieve storage bins and deliver them to human pick stations.",
      robots: "Ocado Smart Platform (OSP) — proprietary grid robots",
      details: [
        "Thousands of robots per Customer Fulfilment Centre operate on an aluminum grid above stacked storage bins",
        "Robots retrieve bins and deliver them to pick stations; humans assemble the orders",
        "Air-traffic-control-style software coordinates the swarm, including collision avoidance",
        "Newer bot generations are lighter, enabling faster grid construction in more building types (Grocery Dive)",
      ],
    },
    implementation: {
      timeline: "Multi-year per fulfillment centre; newer lightweight grids build faster",
      phases: [
        { name: "Grid construction", duration: "Months", description: "Build the grid structure and charging infrastructure" },
        { name: "Robot commissioning", duration: "Months", description: "Deploy robot fleet in waves, calibrating navigation" },
        { name: "Software integration", duration: "Months", description: "Connect warehouse management, order routing, and delivery scheduling" },
        { name: "Ramp-up", duration: "Months", description: "Gradually increase throughput to full capacity" },
      ],
    },
    results: {
      metrics: [
        { label: "Robots per warehouse", value: "Thousands", detail: "Operating simultaneously on one grid (Tech Insider)" },
        { label: "Orders per week", value: "~65,000", detail: "Per warehouse, as reported by Tech Insider" },
        { label: "Platform licensing", value: "Multiple retailers", detail: "OSP licensed to grocers including Kroger (public partnerships)" },
      ],
      paybackPeriod: "Not publicly disclosed",
    },
    lessons: [
      "Swarm robotics at scale required custom coordination software — off-the-shelf WMS was not designed for thousands of simultaneous agents",
      "Human pickers remain in the loop for item selection — the robots eliminate travel time, not judgment",
      "The platform became a licensing business: the technology now runs fulfillment for other retailers",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "intuitive-surgical-davinci-hospital",
    title: "How Health Systems Deploy da Vinci Surgical Robots",
    company: "Illustrative composite — multi-hospital health system",
    companyType: "Modeled on typical phased da Vinci deployments",
    industry: "Medical & Surgical",
    industrySlug: "medical-robotics",
    categorySlug: "medical",
    metaTitle: "Case Study: How Hospitals Deploy da Vinci Surgical Robots",
    metaDescription:
      "An illustrative walkthrough of how multi-hospital systems phase in da Vinci surgical robots: pilot specialties, training infrastructure, and expansion.",
    heroImage: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=1200&h=600&fit=crop",
    illustrative: true,
    problem: {
      summary:
        "Hospital networks without robotic surgery programs face competitive pressure: surgeons and patients increasingly choose robot-equipped facilities.",
      details: [
        "Robotic-assisted surgery is standard of care in several specialties, led by urology",
        "Surgeon recruiting increasingly depends on offering robotic platforms",
        "Building a program requires training and credentialing infrastructure, not just hardware",
      ],
    },
    solution: {
      summary:
        "The typical pattern: phased deployment of Intuitive Surgical da Vinci systems, starting with the highest-volume specialty and expanding after the program matures.",
      robots: "Intuitive Surgical da Vinci systems",
      details: [
        "Pilot at highest-volume hospitals, usually starting with urology (strongest evidence base)",
        "Expansion to gynecology, general surgery, and other specialties as surgeon credentialing grows",
        "Simulation-based training and proctoring programs for surgeon onboarding",
      ],
    },
    implementation: {
      timeline: "Typically multi-year for a hospital network",
      phases: [
        { name: "Pilot", duration: "Months", description: "Initial systems at highest-volume sites, single specialty" },
        { name: "Expansion", duration: "~1 year", description: "Additional systems and specialties" },
        { name: "Full deployment", duration: "~1 year", description: "Remaining sites and specialties" },
        { name: "Optimization", duration: "Ongoing", description: "Outcome tracking, protocol refinement, training programs" },
      ],
    },
    results: {
      metrics: [],
      paybackPeriod: "Varies by procedure volume; da Vinci economics improve with utilization",
    },
    lessons: [
      "Programs start with the procedure where the evidence base is strongest",
      "Training and credentialing infrastructure determines adoption speed more than hardware",
      "Outcome tracking from day one is what justifies expansion — clinical outcome claims belong to peer-reviewed literature, not marketing",
    ],
    relatedRobotSlugs: ["intuitive-da-vinci-5", "da-vinci-5"],
  },
  {
    slug: "universal-robots-cobot-manufacturer",
    title: "How Small Manufacturers Use Cobots for Machine Tending",
    company: "Illustrative composite — small CNC machine shop",
    companyType: "Modeled on typical UR cobot machine-tending deployments",
    industry: "Manufacturing",
    industrySlug: "manufacturing-robotics",
    categorySlug: "manufacturing",
    metaTitle: "Case Study: Cobot Machine Tending in Small Manufacturing",
    metaDescription:
      "An illustrative walkthrough of how small CNC shops deploy collaborative robots for machine tending: programming, lights-out shifts, and quality consistency.",
    heroImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=600&fit=crop",
    illustrative: true,
    problem: {
      summary:
        "Small machine shops struggle with quality consistency in manual machine tending — part placement varies by operator and by shift, and traditional industrial robots are too expensive for their volumes.",
      details: [
        "Manual CNC loading introduces variability that compounds into defect rates",
        "Fatigue effects make night shifts less consistent than day shifts",
        "Traditional industrial robot cells are typically out of budget for sub-50-person shops",
      ],
    },
    solution: {
      summary:
        "The typical pattern: a collaborative robot (e.g. Universal Robots UR10e) tends one or two CNC machines, placing parts identically every cycle and enabling unmanned night shifts.",
      robots: "Universal Robots UR10e collaborative robot",
      details: [
        "Cobot handles loading blanks and unloading finished parts",
        "Programming via teach pendant is done by existing shop staff, not external integrators",
        "Unmanned night-shift operation raises effective machine utilization",
        "A vision-check station can be added for in-line quality verification",
      ],
    },
    implementation: {
      timeline: "Typically weeks from purchase to production",
      phases: [
        { name: "Installation", duration: "~1 week", description: "Mount cobot, install gripper, wire safety I/O to CNC machines" },
        { name: "Programming", duration: "~1 week", description: "Shop staff program part recipes via teach pendant" },
        { name: "Testing", duration: "~2 weeks", description: "Run alongside operators, validate cycle times and quality" },
        { name: "Production", duration: "Ongoing", description: "Transition to unmanned night-shift operation" },
      ],
    },
    results: {
      metrics: [],
      paybackPeriod: "Cobot machine-tending paybacks are typically measured in months, driven by utilization gains",
    },
    lessons: [
      "For machine tending, a cobot is closer to a tool purchase than a systems-integration project",
      "The ROI usually comes from quality consistency and added unmanned hours, not headcount",
      "In-house programming capability matters — it determines how fast new parts get added",
    ],
    relatedRobotSlugs: ["universal-robots-ur10e", "ur10e"],
  },
  {
    slug: "iron-ox-greenhouse-automation",
    title: "Iron Ox: Robotic Indoor Farming and Its Hard Economics",
    company: "Iron Ox",
    companyType: "Indoor farming startup (significantly downsized in 2022)",
    industry: "Agricultural",
    industrySlug: "agricultural-robotics",
    categorySlug: "agricultural",
    metaTitle: "Case Study: Iron Ox Robotic Greenhouses — Ambition and Economics",
    metaDescription:
      "Iron Ox combined mobile robots and AI plant monitoring in autonomous greenhouses — and its 2022 retrenchment is a lesson in agtech economics.",
    heroImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=600&fit=crop",
    sources: [
      { label: "CNBC — Iron Ox is disrupting agriculture with robots and AI (2022)", url: "https://www.cnbc.com/2022/04/18/iron-ox-is-disrupting-agriculture-with-robots-and-ai.html" },
      { label: "AgFunderNews — Iron Ox lays off nearly half its staff (2022)", url: "https://agfundernews.com/another-blow-for-indoor-farm-robotics-as-iron-ox-lays-off-nearly-half-its-staff" },
    ],
    problem: {
      summary:
        "Field farming faces labor shortages, water scarcity, and climate volatility. Iron Ox set out to prove autonomous indoor farming could address all three.",
      details: [
        "Agriculture accounts for roughly 70% of global freshwater withdrawals (FAO)",
        "Labor availability makes hand-tended leafy greens increasingly difficult to grow economically",
        "Controlled environments remove weather risk and most pesticide use",
      ],
    },
    solution: {
      summary:
        "Iron Ox built greenhouses where mobile robots transport grow trays and an AI vision system monitors plants individually, in a closed-loop hydroponic system.",
      robots: "Custom AMRs + robotic arms + AI plant-vision system (Iron Ox proprietary)",
      details: [
        "Mobile robots move grow modules between planting, growing, and harvesting stations",
        "Computer vision monitors individual plants for stress and disease",
        "Closed-loop hydroponics recirculates water — the company's core water-saving claim (CNBC)",
      ],
    },
    implementation: {
      timeline: "Years from prototype to commercial greenhouses",
      phases: [
        { name: "R&D prototype", duration: "Months", description: "First robots and AI plant monitoring" },
        { name: "Pilot greenhouse", duration: "Months", description: "Limited crop variety at pilot scale" },
        { name: "Commercial scale", duration: "Months", description: "Full greenhouse operations" },
        { name: "Retrenchment", duration: "2022", description: "Laid off roughly half of staff and refocused (AgFunderNews)" },
      ],
    },
    results: {
      metrics: [
        { label: "Water use", value: "Reduced", detail: "Company-stated claim of large water savings vs field farming via closed-loop hydroponics (CNBC)" },
        { label: "2022 restructuring", value: "~50% staff", detail: "Layoffs amounting to nearly half the company (AgFunderNews)" },
      ],
      paybackPeriod: "Not achieved at scale — the company retrenched before proving unit economics",
    },
    lessons: [
      "Plant-level AI monitoring is real and valuable — but robotics alone did not fix indoor farming's energy and capital economics",
      "The hardest engineering was climate control and hydroponics, not the robots",
      "A cautionary counterweight to agtech hype: technically impressive automation does not guarantee a viable business",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "built-robotics-construction",
    title: "How Built Robotics Makes Standard Excavators Autonomous",
    company: "Built Robotics",
    companyType: "Construction technology — autonomous heavy equipment retrofits",
    industry: "Construction",
    industrySlug: "construction-robotics",
    categorySlug: "construction",
    metaTitle: "Case Study: Built Robotics Exosystem — Autonomous Excavators",
    metaDescription:
      "How Built Robotics' Exosystem retrofit converts standard excavators to autonomous operation for trenching on solar and infrastructure projects.",
    heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
    sources: [
      { label: "Built Robotics — Technology (Exosystem)", url: "https://www.builtrobotics.com/technology" },
      { label: "Built Robotics — Autonomous trenching for solar", url: "https://www.builtrobotics.com/solutions/trenching" },
    ],
    problem: {
      summary:
        "Construction has a chronic shortage of equipment operators, and earthwork on remote solar and pipeline projects is the hardest to staff.",
      details: [
        "Remote project sites compete for a limited pool of qualified heavy-equipment operators",
        "Trenching is repetitive, long-duration work well suited to automation",
        "Operator availability directly gates project schedules",
      ],
    },
    solution: {
      summary:
        "Built Robotics' Exosystem is an aftermarket kit that upgrades standard excavators into autonomous trenching machines (company materials).",
      robots: "Built Robotics Exosystem — autonomous retrofit for standard excavators",
      details: [
        "Retrofit installs on standard excavators rather than requiring purpose-built machines",
        "Combines sensors, software, and safety systems for unattended trenching (builtrobotics.com)",
        "Marketed primarily for utility-scale solar construction",
        "Human supervisors oversee autonomous operation remotely",
      ],
    },
    implementation: {
      timeline: "Days to retrofit; site programming per project",
      phases: [
        { name: "Equipment retrofit", duration: "Days", description: "Install sensor and control kit on existing excavator" },
        { name: "Site programming", duration: "Days", description: "Program dig plans and site boundaries" },
        { name: "Supervised operation", duration: "Initial period", description: "Autonomous runs with on-site validation" },
        { name: "Production", duration: "Ongoing", description: "Remote supervision of autonomous trenching" },
      ],
    },
    results: {
      metrics: [
        { label: "Deployment model", value: "Retrofit", detail: "Works with contractors' existing fleets — the core adoption advantage (company materials)" },
        { label: "Primary market", value: "Utility-scale solar", detail: "Trenching for solar farms is the flagship application (company materials)" },
      ],
      paybackPeriod: "Not publicly disclosed",
    },
    lessons: [
      "Retrofitting existing fleets removes the biggest purchase objection — contractors keep their equipment",
      "Constrained, repetitive tasks (trenching) are where construction autonomy works first",
      "Remote supervision changes the labor model from operating machines to overseeing them",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "starship-delivery-robots-campus",
    title: "How Starship Robots Passed 8 Million Autonomous Deliveries",
    company: "Starship Technologies",
    companyType: "Autonomous sidewalk delivery — campuses and neighborhoods",
    industry: "Delivery",
    industrySlug: "delivery-robotics",
    categorySlug: "delivery",
    metaTitle: "Case Study: Starship Delivery Robots — 8M+ Autonomous Deliveries",
    metaDescription:
      "How Starship Technologies built the largest autonomous delivery fleet, passing 8 million deliveries with thousands of robots across campuses worldwide.",
    heroImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=600&fit=crop",
    sources: [
      { label: "Starship press — Surpasses 8 million deliveries", url: "https://www.starship.xyz/press/starship-technologies-surpasses-8-million-deliveries/" },
      { label: "Starship press — 5 years at George Mason University", url: "https://www.starship.xyz/press/starship-technologies-celebrates-5-years-of-autonomous-robot-deliveries-at-george-mason-university/" },
      { label: "Starship press — $40M raise + 100-campus expansion plan", url: "https://www.starship.xyz/press/starship-technologies-raises-40-million-in-additional-funding-and-announces-100-university-campus-expansion-plan/" },
    ],
    problem: {
      summary:
        "Campus food delivery demand outgrew what human delivery could serve economically: vehicles don't work in pedestrian zones and third-party app commissions consume dining margins.",
      details: [
        "Pedestrian campuses are poorly served by car-based delivery",
        "Third-party delivery commissions strain university dining economics",
        "Student delivery labor is unreliable at exactly the peak-demand moments",
      ],
    },
    solution: {
      summary:
        "Starship deploys fleets of autonomous sidewalk robots per campus, delivering from dining halls and campus stores via app orders.",
      robots: "Starship Delivery Robot — six-wheeled autonomous sidewalk robot",
      details: [
        "Robots navigate sidewalks autonomously at walking speed using cameras and GPS",
        "Fleets operate long daily hours with central monitoring and remote assist",
        "Insulated cargo compartments handle hot and cold orders",
      ],
    },
    implementation: {
      timeline: "Weeks per campus deployment",
      phases: [
        { name: "Campus mapping", duration: "Weeks", description: "Map sidewalks, crossings, and delivery zones" },
        { name: "Fleet deployment", duration: "Weeks", description: "Deploy robots and charging infrastructure" },
        { name: "Merchant integration", duration: "Weeks", description: "Connect dining halls and campus retailers to the ordering app" },
        { name: "Adoption ramp", duration: "First semester", description: "Marketing and word-of-mouth growth" },
      ],
    },
    results: {
      metrics: [
        { label: "Total deliveries", value: "8M+", detail: "Autonomous deliveries completed globally (Starship press, milestone release)" },
        { label: "Fleet size", value: "2,000+ robots", detail: "Global fleet as of the 5M-delivery milestone (Starship press)" },
        { label: "Distance traveled", value: "7M+ miles", detail: "Autonomous miles as of the GMU 5-year release (Starship press)" },
      ],
      paybackPeriod: "Not publicly disclosed",
    },
    lessons: [
      "Campuses were the right first market: controlled environment, high density, short distances",
      "Robots became campus culture — students name them and post about them, which drives adoption",
      "All-weather operation is a prerequisite for real adoption, not a nice-to-have",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "hotel-room-service-robot-guest-satisfaction",
    title: "How Hotels Use Delivery Robots for Room Service",
    company: "Illustrative composite — regional hotel chain",
    companyType: "Modeled on typical hospitality robot deployments",
    industry: "Hospitality",
    industrySlug: "hospitality",
    categorySlug: "delivery",
    metaTitle: "Case Study: Hotel Room Service Delivery Robots",
    metaDescription:
      "An illustrative walkthrough of how hotel chains deploy delivery robots for room service and amenities: PMS integration, elevator access, and guest experience.",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
    illustrative: true,
    problem: {
      summary:
        "Late-night room service is a staffing problem: demand is spiky, overnight labor is expensive and high-turnover, and delivery time drives guest satisfaction scores.",
      details: [
        "Overnight room-service staffing is costly relative to order volume",
        "Late-night delivery times are inconsistent when staffing is thin",
        "Overnight roles have chronically high turnover in hospitality",
      ],
    },
    solution: {
      summary:
        "The typical pattern: a small fleet of autonomous delivery robots per property handles room service, amenity delivery, and housekeeping supply runs.",
      robots: "Hospitality delivery robots (e.g. Relay Robotics)",
      details: [
        "Robots navigate corridors and call elevators autonomously",
        "Integration with the property management system maps guest rooms",
        "Guests are notified on arrival and collect items from a secured compartment",
      ],
    },
    implementation: {
      timeline: "Typically months from pilot to multi-property rollout",
      phases: [
        { name: "Pilot", duration: "Months", description: "Highest-volume properties test single robots" },
        { name: "Optimization", duration: "Months", description: "Tune routes, elevator timing, and guest notification flow" },
        { name: "Expansion", duration: "Months", description: "Roll out to remaining properties, sized by room count" },
      ],
    },
    results: {
      metrics: [],
      paybackPeriod: "Varies by property size and overnight order volume",
    },
    lessons: [
      "Late-night delivery is the strongest use case — it removes both staffing cost and tipping awkwardness",
      "Elevator integration is the hardest technical step and tends to be property-specific",
      "Guest-facing robots double as a marketing amenity, especially for families",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "security-patrol-robot-facility-management",
    title: "How Corporate Campuses Use Security Patrol Robots",
    company: "Illustrative composite — corporate campus operator",
    companyType: "Modeled on typical patrol-robot deployments",
    industry: "Security & Facility Management",
    industrySlug: "security",
    categorySlug: "security",
    metaTitle: "Case Study: Security Patrol Robots on Corporate Campuses",
    metaDescription:
      "An illustrative walkthrough of how campus operators deploy patrol robots: outdoor perimeter units, indoor sweeps, and guard-augmented workflows.",
    heroImage: "https://images.unsplash.com/photo-1582719508461-905c673771eb?w=1200&h=600&fit=crop",
    illustrative: true,
    problem: {
      summary:
        "Large campuses struggle with patrol consistency: 24/7 human coverage is expensive, routes get skipped, and overnight monitoring has blind spots.",
      details: [
        "Round-the-clock guard coverage across multiple buildings is a major operating cost",
        "Patrol completion varies — repetitive overnight routes are where consistency breaks down",
        "Camera-only monitoring leaves gaps between fixed viewpoints",
      ],
    },
    solution: {
      summary:
        "The typical pattern: autonomous outdoor units patrol perimeters and parking areas while indoor robots run after-hours building sweeps, all feeding a security operations center.",
      robots: "Outdoor patrol units (e.g. Knightscope K5) + indoor patrol robots (e.g. Cobalt)",
      details: [
        "Outdoor units cover parking lots and perimeters continuously",
        "Indoor units sweep buildings after hours",
        "Sensor feeds (video, thermal, anomaly detection) route to the SOC with human oversight",
        "Guards shift from walking routes to responding to alerts",
      ],
    },
    implementation: {
      timeline: "Typically months",
      phases: [
        { name: "Assessment", duration: "Weeks", description: "Map patrol routes and coverage gaps; design robot patterns" },
        { name: "Outdoor deployment", duration: "Months", description: "Install outdoor units and charging stations" },
        { name: "Indoor deployment", duration: "Months", description: "Deploy indoor units with elevator integration" },
        { name: "SOC integration", duration: "Weeks", description: "Connect feeds and train guards on augmented workflows" },
      ],
    },
    results: {
      metrics: [],
      paybackPeriod: "Varies with the guard-hours displaced by robot patrol coverage",
    },
    lessons: [
      "Patrol robots work as guard multipliers, not guard replacements — the win is moving humans from routes to responses",
      "Visible robots change tenant perception of security investment",
      "Weather resilience decides whether outdoor patrol is dependable enough to count on",
    ],
    relatedRobotSlugs: [],
  },
];

export function getAllCaseStudySlugs(): string[] {
  return CASE_STUDIES.map(cs => cs.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find(cs => cs.slug === slug);
}
