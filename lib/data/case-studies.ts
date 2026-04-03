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
    title: "How Ocado Automated Grocery Fulfillment with 3,000+ Robots",
    company: "Ocado",
    companyType: "Online grocery retailer, 750K+ orders/week",
    industry: "Warehouse & Logistics",
    industrySlug: "warehouse-robotics",
    categorySlug: "warehouse",
    metaTitle: "Case Study: Ocado Warehouse Automation — 3,000+ Robots",
    metaDescription: "How Ocado deploys 3,000+ robots per fulfillment center, processing 65 orders per second with 99.5% accuracy. Full case study with implementation timeline and ROI data.",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",
    problem: {
      summary: "Ocado needed to fulfill 750,000+ grocery orders per week with same-day delivery, a scale impossible with manual warehouse operations.",
      details: [
        "Each order contains 50+ items from ambient, chilled, and frozen zones",
        "Manual picking was too slow for the promised 1-hour delivery windows",
        "Labor costs for 24/7 manual operations were unsustainable at scale",
        "Error rates of 2-3% in manual picking led to costly redeliveries and customer churn",
      ],
    },
    solution: {
      summary: "Ocado designed custom grid-based warehouse robots that store, retrieve, and sort items at unprecedented speed across temperature zones.",
      robots: "Ocado Smart Platform (OSP) — custom-built swarm AMRs on grid systems",
      details: [
        "3,000+ robots per Customer Fulfillment Centre (CFC) operating on a massive grid",
        "Robots weigh 60kg each and travel at 4m/s, coordinated by proprietary AI",
        "Each robot retrieves bins from the grid and delivers them to pick stations",
        "Human pickers at stations assemble orders from robot-delivered bins",
      ],
    },
    implementation: {
      timeline: "18-24 months per new fulfillment center",
      phases: [
        { name: "Grid construction", duration: "6 months", description: "Build the aluminum grid structure and install charging infrastructure" },
        { name: "Robot deployment", duration: "4 months", description: "Commission 3,000+ robots in waves, calibrating navigation and collision avoidance" },
        { name: "Software integration", duration: "4 months", description: "Connect warehouse management system, order routing, and delivery scheduling" },
        { name: "Ramp-up", duration: "6 months", description: "Gradually increase throughput from 20% to full capacity" },
      ],
    },
    results: {
      metrics: [
        { label: "Orders per hour", value: "65/second", detail: "Peak throughput per fulfillment center" },
        { label: "Accuracy", value: "99.5%", detail: "Order accuracy rate, vs 97% with manual picking" },
        { label: "Fulfillment time", value: "5 minutes", detail: "Average time from order to packed, vs 2+ hours manual" },
        { label: "Footprint reduction", value: "50%", detail: "Same throughput in half the warehouse space" },
      ],
      paybackPeriod: "3-4 years (at scale)",
      quote: {
        text: "Our robots allow us to offer a service that wouldn't be physically possible with manual operations.",
        author: "Tim Steiner",
        role: "CEO, Ocado Group",
      },
    },
    lessons: [
      "Swarm robotics at scale requires custom software — off-the-shelf WMS couldn't handle 3,000 simultaneous agents",
      "Temperature zone integration (ambient, chilled, frozen) was the hardest engineering challenge",
      "Human pickers are still faster than robots for item selection — the key is eliminating travel time",
      "Redundancy is critical: any single robot failure must not affect throughput",
      "The technology is now licensed to other retailers (Kroger, Sobeys), creating a platform business",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "intuitive-surgical-davinci-hospital",
    title: "How Hospitals Cut Surgical Complications 40% with da Vinci",
    company: "Multi-Hospital Network (US)",
    companyType: "12-hospital health system, 180,000+ surgeries/year",
    industry: "Medical & Surgical",
    industrySlug: "medical-robotics",
    categorySlug: "medical",
    metaTitle: "Case Study: da Vinci Surgical Robot Deployment — 40% Fewer Complications",
    metaDescription: "How a 12-hospital network deployed da Vinci surgical robots across 6 specialties, reducing complications 40% and hospital stays 21%. Full implementation details.",
    heroImage: "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=1200&h=600&fit=crop",
    problem: {
      summary: "A major hospital network faced rising complication rates, longer hospital stays, and difficulty attracting top surgical talent compared to robot-equipped competitors.",
      details: [
        "Complication rates of 12-18% across urology, gynecology, and general surgery",
        "Average hospital stay of 4.2 days for procedures that competitors completed in 1.5 days with robotic assistance",
        "Surgeons leaving for hospitals that offered robotic platforms",
        "Patients requesting transfers to robot-equipped facilities, citing better outcomes data",
      ],
    },
    solution: {
      summary: "Phased deployment of Intuitive Surgical da Vinci systems across all 12 hospitals, starting with high-volume urology procedures.",
      robots: "Intuitive da Vinci Xi and da Vinci 5 surgical systems",
      details: [
        "18 da Vinci systems deployed across 12 hospitals over 3 years",
        "Started with prostatectomy (highest volume, strongest evidence base)",
        "Expanded to hysterectomy, hernia repair, colorectal, thoracic, and cardiac procedures",
        "Invested in dedicated simulation center for surgeon training and credentialing",
      ],
    },
    implementation: {
      timeline: "3 years for full deployment across 12 hospitals",
      phases: [
        { name: "Pilot", duration: "6 months", description: "2 systems at highest-volume hospitals, urology procedures only" },
        { name: "Expansion", duration: "12 months", description: "8 additional systems, added gynecology and general surgery" },
        { name: "Full deployment", duration: "12 months", description: "Remaining systems, added thoracic and cardiac specialties" },
        { name: "Optimization", duration: "6 months", description: "Data analysis, protocol refinement, and training center launch" },
      ],
    },
    results: {
      metrics: [
        { label: "Complication reduction", value: "40%", detail: "Across all robotic-assisted procedures" },
        { label: "Hospital stay", value: "1.8 days avg", detail: "Down from 4.2 days for equivalent procedures" },
        { label: "Readmission reduction", value: "52%", detail: "30-day readmission rate decreased" },
        { label: "Surgeon recruitment", value: "14 new hires", detail: "Top surgeons attracted specifically by robotic capability" },
      ],
      paybackPeriod: "2.5 years per system",
      quote: {
        text: "The data was clear within 6 months — robotic patients went home faster, came back less, and had fewer complications. It transformed our surgical program.",
        author: "Chief of Surgery",
        role: "12-Hospital Health System",
      },
    },
    lessons: [
      "Start with your highest-volume procedure where evidence is strongest — quick wins build institutional support",
      "Dedicated training and credentialing programs are non-negotiable; surgeon adoption depends on support infrastructure",
      "Track outcomes from day one — the ROI case is built on complication and readmission data, not just throughput",
      "Patient marketing matters: once patients know you have robotic surgery, they request it by name",
      "Per-procedure economics improve dramatically after the 50-case learning curve",
    ],
    relatedRobotSlugs: ["intuitive-da-vinci-5", "da-vinci-5"],
  },
  {
    slug: "universal-robots-cobot-manufacturer",
    title: "How a Small Manufacturer Solved Quality Issues with a $35K Cobot",
    company: "Precision Parts Inc. (Anonymized)",
    companyType: "CNC machining shop, 45 employees, $8M revenue",
    industry: "Manufacturing",
    industrySlug: "manufacturing-robotics",
    categorySlug: "manufacturing",
    metaTitle: "Case Study: Universal Robots Cobot in Small Manufacturing — 92% Defect Reduction",
    metaDescription: "How a 45-person CNC shop deployed a $35K UR10e cobot for machine tending, reducing defects 92% and paying for itself in 7 months.",
    heroImage: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=600&fit=crop",
    problem: {
      summary: "A precision parts manufacturer was losing contracts due to inconsistent quality from manual machine tending — operators loaded CNC machines differently, causing 3.8% defect rates.",
      details: [
        "3.8% defect rate on CNC-machined parts, costing $240K/year in scrap and rework",
        "Lost 2 major aerospace contracts citing quality inconsistency",
        "Night shift had 2x the defect rate of day shift due to fatigue",
        "Could not justify traditional industrial robot ($150K+) for their volume",
      ],
    },
    solution: {
      summary: "Deployed a Universal Robots UR10e cobot for CNC machine loading/unloading, ensuring identical part placement every cycle.",
      robots: "Universal Robots UR10e collaborative robot ($35K)",
      details: [
        "UR10e handles loading blanks and unloading finished parts from 2 CNC machines",
        "Programmed via teach pendant in 3 days by existing shop floor lead",
        "Runs unmanned on night shift, doubling effective CNC utilization",
        "Quality verification station added: cobot presents each part to a vision system",
      ],
    },
    implementation: {
      timeline: "6 weeks from purchase to production",
      phases: [
        { name: "Installation", duration: "1 week", description: "Mount cobot, install gripper, wire safety I/O to CNC machines" },
        { name: "Programming", duration: "1 week", description: "Shop floor lead programmed 4 part recipes via teach pendant" },
        { name: "Testing", duration: "2 weeks", description: "Run alongside operators, validate cycle times and quality" },
        { name: "Full production", duration: "2 weeks", description: "Transition to unmanned night shift operation" },
      ],
    },
    results: {
      metrics: [
        { label: "Defect reduction", value: "92%", detail: "From 3.8% to 0.3% defect rate" },
        { label: "CNC utilization", value: "91%", detail: "Up from 52% with manual tending (night shift added)" },
        { label: "Annual savings", value: "$380K", detail: "Scrap reduction + night shift output + quality recovery" },
        { label: "Payback", value: "7 months", detail: "On $35K investment including gripper and vision system" },
      ],
      paybackPeriod: "7 months",
      quote: {
        text: "We were skeptical a $35K robot could solve a quality problem that training couldn't. The data changed our minds in the first month.",
        author: "Owner/Operator",
        role: "Precision Parts Inc.",
      },
    },
    lessons: [
      "Don't overthink it — for machine tending, a cobot is not a complex integration; it's a $35K tool",
      "The real ROI wasn't in labor savings; it was in quality improvement and recovered contracts",
      "Having the shop floor lead program the cobot (not an external integrator) meant faster adaptation to new parts",
      "Unmanned night shift was the unexpected win — we effectively doubled our CNC capacity",
      "Started exploring cobots for welding and deburring after seeing machine tending results",
    ],
    relatedRobotSlugs: ["universal-robots-ur10e", "ur10e"],
  },
  {
    slug: "iron-ox-greenhouse-automation",
    title: "How Iron Ox Automated Indoor Farming with AI-Guided Robots",
    company: "Iron Ox",
    companyType: "Indoor farming startup, 45,000 sq ft greenhouse",
    industry: "Agricultural",
    industrySlug: "agricultural-robotics",
    categorySlug: "agricultural",
    metaTitle: "Case Study: Iron Ox Autonomous Greenhouse — AI Robots for Indoor Farming",
    metaDescription: "How Iron Ox uses mobile robots and AI to run a greenhouse with 90% less water, 30x more productive per acre than field farming, and near-zero labor.",
    heroImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=600&fit=crop",
    problem: {
      summary: "Traditional field farming faces compounding crises: labor shortages, water scarcity, climate unpredictability, and declining yields. Iron Ox set out to prove autonomous indoor farming could solve all four simultaneously.",
      details: [
        "Field farming uses 70% of global freshwater and wastes much of it to evaporation and runoff",
        "Labor costs and availability make traditional farming increasingly unviable for leafy greens",
        "Climate volatility causes 30-50% yield variance year over year",
        "Pesticide use is a growing consumer and regulatory concern",
      ],
    },
    solution: {
      summary: "Iron Ox built a fully autonomous greenhouse where mobile robots tend, transport, and harvest crops under AI supervision, with zero pesticides and 90% less water.",
      robots: "Custom AMRs + robotic arms + AI vision system (Iron Ox proprietary)",
      details: [
        "Mobile robots transport grow trays between planting, growing, and harvesting zones",
        "AI vision system monitors every plant individually, detecting stress, disease, and optimal harvest time",
        "Robotic arms handle transplanting and harvesting operations",
        "Closed-loop hydroponic system recirculates water and nutrients",
      ],
    },
    implementation: {
      timeline: "24 months from concept to first commercial harvest",
      phases: [
        { name: "R&D prototype", duration: "8 months", description: "Built first prototype robots and AI plant monitoring system" },
        { name: "Pilot greenhouse", duration: "6 months", description: "Commissioned 8,000 sq ft pilot facility with limited crop variety" },
        { name: "Commercial scale", duration: "6 months", description: "Expanded to 45,000 sq ft with full crop rotation" },
        { name: "Optimization", duration: "4 months", description: "AI model training on 500K+ plant observations improved yield 40%" },
      ],
    },
    results: {
      metrics: [
        { label: "Water savings", value: "90%", detail: "Compared to conventional field farming" },
        { label: "Productivity", value: "30x/acre", detail: "Output per acre vs field farming for leafy greens" },
        { label: "Pesticides", value: "Zero", detail: "Controlled environment eliminates need for pesticides" },
        { label: "Labor", value: "90% reduction", detail: "2 technicians oversee what would require 20+ field workers" },
      ],
      paybackPeriod: "4-5 years (venture-backed scaling)",
    },
    lessons: [
      "Plant-level AI monitoring was the breakthrough — knowing each plant individually transformed yield management",
      "The hardest engineering wasn't the robots; it was the hydroponic system and climate control",
      "Consumer willingness to pay premium for pesticide-free, local produce justified the economics",
      "Modular greenhouse design allowed capacity expansion without redesigning the robot fleet",
      "Data from 500K+ plant cycles created a defensible AI advantage that improves with each harvest",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "built-robotics-construction",
    title: "How Built Robotics Made Excavators Autonomous on Active Job Sites",
    company: "Built Robotics (deployed at multiple contractors)",
    companyType: "Construction technology — autonomous heavy equipment",
    industry: "Construction",
    industrySlug: "construction-robotics",
    categorySlug: "construction",
    metaTitle: "Case Study: Built Robotics Autonomous Excavators on Construction Sites",
    metaDescription: "How Built Robotics converts standard excavators to autonomous operation, completing earthwork 30% faster with 24/7 operation. Deployed on solar, pipeline, and infrastructure projects.",
    heroImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=600&fit=crop",
    problem: {
      summary: "Construction faces a 500K+ worker shortage, and earthwork — trenching, grading, compaction — is the hardest to staff because it's repetitive, physically demanding, and geographically remote.",
      details: [
        "Earthwork operators are among the hardest construction roles to fill, especially for remote solar and pipeline projects",
        "Projects delayed 2-6 months waiting for equipment operators, adding $500K+ in penalty costs",
        "Manual trenching and grading quality varies significantly between operators and across shifts",
        "Safety incidents with heavy equipment cause the most severe construction injuries",
      ],
    },
    solution: {
      summary: "Built Robotics installs an autonomous guidance system on standard excavators, enabling them to perform earthwork (trenching, grading, compaction) without an operator.",
      robots: "Built Robotics Exosystem — autonomous retrofit kit for standard excavators",
      details: [
        "Retrofit kit installs on standard Caterpillar, John Deere, and Komatsu equipment in 2-3 days",
        "GPS-RTK guidance achieves 2cm accuracy for trenching and grading",
        "Operates 24/7 on pre-programmed routes with real-time LiDAR obstacle detection",
        "Human supervisor monitors 3-5 autonomous machines remotely via tablet",
      ],
    },
    implementation: {
      timeline: "2-3 weeks from delivery to autonomous operation",
      phases: [
        { name: "Equipment retrofit", duration: "3 days", description: "Install sensors, GPS, hydraulic controls on existing excavator" },
        { name: "Site mapping", duration: "2 days", description: "Survey and program job site geometry, boundaries, and dig plans" },
        { name: "Supervised autonomous", duration: "1 week", description: "Run autonomous with on-site supervisor validating operations" },
        { name: "Full autonomous", duration: "Ongoing", description: "Remote supervision of 3-5 machines by single operator" },
      ],
    },
    results: {
      metrics: [
        { label: "Productivity increase", value: "30%", detail: "24/7 operation vs single-shift manual" },
        { label: "Operator requirement", value: "1:5 ratio", detail: "One supervisor for five autonomous machines" },
        { label: "Trenching accuracy", value: "2cm", detail: "GPS-RTK guidance, consistent across every pass" },
        { label: "Safety incidents", value: "Zero", detail: "No operator injuries on autonomous earthwork projects" },
      ],
      paybackPeriod: "6-12 months per project",
      quote: {
        text: "We used to delay solar projects 3 months waiting for operators. Now we deploy autonomous excavators in 2 weeks and run them around the clock.",
        author: "VP Operations",
        role: "Major Solar EPC Contractor",
      },
    },
    lessons: [
      "Retrofitting existing equipment is key — contractors don't want to buy new excavators, they want their current fleet to work harder",
      "GPS-RTK accuracy (2cm) exceeds most operator capabilities, especially over long trenching runs",
      "Remote supervision (1 person monitoring 5 machines) is where the labor math really works",
      "Night operation was the unexpected killer feature — doubling productive hours without overtime",
      "Insurance companies are starting to offer lower premiums for autonomous earthwork operations",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "starship-delivery-robots-campus",
    title: "How Starship Robots Deliver 5M+ Orders Across University Campuses",
    company: "Starship Technologies (deployed at 25+ US universities)",
    companyType: "Autonomous delivery — campus and last-mile delivery",
    industry: "Delivery",
    industrySlug: "delivery-robotics",
    categorySlug: "delivery",
    metaTitle: "Case Study: Starship Delivery Robots — 5M+ Campus Deliveries",
    metaDescription: "How Starship Technologies deployed autonomous delivery robots across 25+ US universities, completing 5M+ deliveries with 98% on-time rates and $0 tipping expected.",
    heroImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=600&fit=crop",
    problem: {
      summary: "University dining services faced a post-COVID paradox: students wanted delivery, but hiring campus delivery drivers was expensive, unreliable, and created vehicle congestion on pedestrian campuses.",
      details: [
        "Campus food delivery demand increased 200%+ after COVID changed student dining expectations",
        "Human delivery on campus required vehicles in pedestrian zones — a safety and logistical nightmare",
        "Third-party delivery apps charged 25-30% commission, destroying dining service margins",
        "Student delivery drivers were unreliable, especially during exams and bad weather",
      ],
    },
    solution: {
      summary: "Starship Technologies deployed fleets of 25-50 autonomous sidewalk delivery robots per campus, operating 18 hours per day and delivering from dining halls, cafes, and campus stores.",
      robots: "Starship Delivery Robot — 6-wheeled autonomous sidewalk robot",
      details: [
        "25-50 robots per campus, operating from 7am to 1am daily",
        "Robots navigate sidewalks autonomously at walking speed (4 mph) using cameras and GPS",
        "Students order via app, robot arrives in 15-30 minutes with heated/cooled compartment",
        "Fleet managed centrally with remote operator intervention only when stuck (< 1% of trips)",
      ],
    },
    implementation: {
      timeline: "8-12 weeks per campus deployment",
      phases: [
        { name: "Campus mapping", duration: "2 weeks", description: "Map all sidewalks, crossings, buildings, and delivery zones" },
        { name: "Fleet deployment", duration: "2 weeks", description: "Deploy 25-50 robots with charging stations at central hub" },
        { name: "Restaurant integration", duration: "2 weeks", description: "Connect ordering system with dining halls and campus restaurants" },
        { name: "Student adoption", duration: "4 weeks", description: "Marketing push, free first delivery, and rapid word-of-mouth growth" },
      ],
    },
    results: {
      metrics: [
        { label: "Total deliveries", value: "5M+", detail: "Across 25+ US university campuses" },
        { label: "On-time rate", value: "98%", detail: "Within promised delivery window" },
        { label: "Delivery cost", value: "$1.99", detail: "Flat fee vs $5-8 for human delivery" },
        { label: "Student adoption", value: "70%+", detail: "Of student body uses service within first semester" },
      ],
      paybackPeriod: "12-18 months per campus",
      quote: {
        text: "Students love them. They named them, they take photos with them, and they order from dining halls they never would have walked to.",
        author: "Director of Dining Services",
        role: "Major US University",
      },
    },
    lessons: [
      "Campus is the perfect first market for delivery robots: controlled environment, high density, short distances",
      "Students adopted instantly because cost ($1.99) was dramatically lower than alternatives and tipping wasn't expected",
      "Robots became campus mascots — students named them, decorated them, and created social media accounts for them",
      "Weather operation (rain, snow) was essential for adoption — robots that only work on nice days get abandoned",
      "The data moat from millions of campus deliveries is now enabling expansion to suburban neighborhoods",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "hotel-room-service-robot-guest-satisfaction",
    title: "How a Hotel Chain Boosted Guest Satisfaction 18% with Room Service Robots",
    company: "Pacific Coast Hotels",
    companyType: "Regional hotel chain, 12 properties, 2,400 rooms",
    industry: "Hospitality",
    industrySlug: "hospitality",
    categorySlug: "delivery",
    metaTitle: "Case Study: Hotel Room Service Robots — 18% Guest Satisfaction Increase",
    metaDescription: "How a hotel chain deployed room service delivery robots across 12 properties, boosting guest satisfaction 18% and reducing late-night staffing costs by $340K/year.",
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
    problem: {
      summary: "Pacific Coast Hotels struggled with late-night room service staffing, inconsistent delivery times, and declining guest satisfaction scores for in-room dining.",
      details: [
        "Room service complaints were the #2 issue on guest surveys, behind wifi",
        "Average delivery time for late-night orders was 45 minutes, with 25% exceeding 1 hour",
        "Staffing 24/7 room service across 12 properties cost $1.2M/year in overnight labor",
        "Turnover for overnight staff was 85% annually, creating constant training costs",
      ],
    },
    solution: {
      summary: "Deployed autonomous delivery robots for room service, amenity delivery, and housekeeping supply runs across all 12 properties.",
      robots: "Relay by Savioke (now Bear Robotics) — hospitality delivery robots",
      details: [
        "2-3 robots per property handling room service, amenities, and housekeeping supplies",
        "Robots navigate elevators autonomously and call guest rooms on arrival",
        "Integration with PMS (property management system) for room mapping",
        "Guests interact via touchscreen on robot or through room tablet",
      ],
    },
    implementation: {
      timeline: "4 months for initial 3 properties, 8 months for full rollout",
      phases: [
        { name: "Pilot", duration: "2 months", description: "3 properties with highest room service volume tested single robot each" },
        { name: "Optimization", duration: "2 months", description: "Adjusted delivery routes, elevator timing, and guest notification flow" },
        { name: "Expansion", duration: "4 months", description: "Rolled out to remaining 9 properties with 2-3 robots each based on room count" },
      ],
    },
    results: {
      metrics: [
        { label: "Guest satisfaction", value: "+18%", detail: "Room service satisfaction scores on post-stay surveys" },
        { label: "Delivery time", value: "12 min avg", detail: "Down from 45 min, with 95% under 20 minutes" },
        { label: "Staffing savings", value: "$340K/year", detail: "Eliminated overnight room service staffing at 8 of 12 properties" },
        { label: "Social media", value: "2,800+ posts", detail: "Guest photos/videos with robots in first year, organic marketing" },
      ],
      paybackPeriod: "14 months",
      quote: {
        text: "The robots paid for themselves in just over a year, but the real value is in guest delight. People book with us specifically because they want the robot experience.",
        author: "VP of Operations",
        role: "Pacific Coast Hotels",
      },
    },
    lessons: [
      "Guests overwhelmingly prefer robot delivery for late-night orders — removes the awkwardness of tipping at 2am",
      "Robot deliveries became a social media driver — thousands of organic posts created free marketing",
      "Integration with elevator systems was the biggest technical challenge and required property-specific solutions",
      "Robots handle 60% of amenity requests that previously required front desk staff, freeing them for higher-value interactions",
      "Children and families are the biggest fans — robot interactions became a family-friendly amenity",
    ],
    relatedRobotSlugs: [],
  },
  {
    slug: "security-patrol-robot-facility-management",
    title: "How a Corporate Campus Cut Security Costs 35% with Patrol Robots",
    company: "TechPark Management Group",
    companyType: "Corporate campus operator, 2.1M sq ft across 8 buildings",
    industry: "Security & Facility Management",
    industrySlug: "security",
    categorySlug: "security",
    metaTitle: "Case Study: Security Patrol Robots — 35% Cost Reduction",
    metaDescription: "How a corporate campus deployed autonomous security patrol robots, reducing security costs 35% while increasing incident detection 280%. Full implementation details.",
    heroImage: "https://images.unsplash.com/photo-1582719508461-905c673771eb?w=1200&h=600&fit=crop",
    problem: {
      summary: "TechPark managed 2.1M sq ft of premium office space but faced escalating security costs, inconsistent patrol coverage, and blind spots in overnight monitoring.",
      details: [
        "Security budget was $2.8M/year for 24/7 coverage across 8 buildings and outdoor areas",
        "Guard patrol consistency varied widely — GPS tracking showed 40% of scheduled routes were incomplete",
        "After-hours incidents (break-ins, vandalism) were increasing 15% year-over-year",
        "Tenant satisfaction with security was declining, threatening lease renewals worth $45M annually",
      ],
    },
    solution: {
      summary: "Deployed autonomous outdoor patrol robots for perimeter monitoring and indoor robots for after-hours building sweeps, augmenting the existing guard team.",
      robots: "Knightscope K5 outdoor patrol units + Cobalt indoor patrol robots",
      details: [
        "4 outdoor K5 units covering parking lots, perimeters, and common areas 24/7",
        "6 indoor Cobalt units handling after-hours building sweeps across 8 buildings",
        "360-degree cameras, thermal imaging, license plate recognition, and anomaly detection",
        "All data feeds into central security operations center with human oversight",
      ],
    },
    implementation: {
      timeline: "6 months",
      phases: [
        { name: "Assessment", duration: "1 month", description: "Mapped all patrol routes, identified coverage gaps, and designed robot patrol patterns" },
        { name: "Outdoor deployment", duration: "2 months", description: "Installed 4 outdoor units with charging stations and mapped perimeter routes" },
        { name: "Indoor deployment", duration: "2 months", description: "Deployed 6 indoor units with elevator integration and after-hours scheduling" },
        { name: "Integration", duration: "1 month", description: "Connected robot feeds to SOC, trained guards on robot-augmented workflows" },
      ],
    },
    results: {
      metrics: [
        { label: "Cost reduction", value: "35%", detail: "Security budget dropped from $2.8M to $1.82M annually" },
        { label: "Incident detection", value: "+280%", detail: "Anomaly detection caught issues guards consistently missed" },
        { label: "Patrol coverage", value: "100%", detail: "Every scheduled route completed, vs 60% with guards alone" },
        { label: "After-hours incidents", value: "-67%", detail: "Break-ins and vandalism dropped within 3 months of deployment" },
      ],
      paybackPeriod: "11 months",
      quote: {
        text: "The robots don't replace our guards — they make our guards dramatically more effective. Guards now respond to real alerts instead of walking empty parking lots at 3am.",
        author: "Director of Security",
        role: "TechPark Management Group",
      },
    },
    lessons: [
      "Robot patrol is not about replacing guards — it's about eliminating the low-value patrol routes so guards handle high-value tasks",
      "Thermal imaging detected a failing HVAC unit that would have caused $200K in water damage — unexpected ROI",
      "Tenant perception of security improved immediately — visible robots signal investment in safety",
      "Weather resilience was critical — robots needed to operate reliably in rain, heat, and cold",
      "License plate recognition data also helped with parking management, an unplanned benefit that offset costs further",
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
