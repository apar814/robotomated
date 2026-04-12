/**
 * Category-specific content for explore/[category] pages.
 * Transforms category pages from filtered grids into industry resources.
 */

export interface CategoryContent {
  slug: string;
  name: string;
  description: string;
  stats: { label: string; value: string }[];
  whoUsesIt: string;
  buyersGuide: { title: string; body: string }[];
  useCases: { label: string; filter: string; icon: string }[];
  faqs: { q: string; a: string }[];
  certLevel: string;
  certPath: string;
}

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  warehouse: {
    slug: "warehouse",
    name: "Warehouse & Logistics",
    description: "AMRs, AGVs, picking systems, and autonomous forklifts that move materials, fulfill orders, and manage inventory at scale.",
    stats: [
      { label: "Market by 2030", value: "$78B" },
      { label: "Avg ROI timeline", value: "18 mo" },
      { label: "Avg labor savings", value: "300%" },
    ],
    whoUsesIt: "Distribution centers, e-commerce fulfillment, manufacturing plants, cold storage facilities",
    buyersGuide: [
      { title: "Payload Capacity", body: "Match the robot's payload to your heaviest load plus 20% safety margin. A robot rated for 500kg that regularly carries 490kg will have 3x the maintenance costs." },
      { title: "Navigation Technology", body: "LiDAR-based navigation is more expensive but more reliable. Camera-based is cheaper but struggles in low light. For high-throughput warehouses, LiDAR is non-negotiable." },
      { title: "WMS Integration", body: "Your robot must integrate with your Warehouse Management System. Ask for supported integrations before buying. Custom integration adds $50K-$200K to total cost." },
      { title: "Fleet Management", body: "A single robot is a pilot. A fleet is a business. Make sure the vendor has a fleet management platform before you scale past 3 units." },
      { title: "Total Cost of Ownership", body: "Add installation (15-20%), integration (10-25%), training ($5K-$15K per operator), and annual maintenance (8-12%) to every quote you evaluate." },
    ],
    useCases: [
      { label: "Move pallets", filter: "pallet", icon: "Package" },
      { label: "Pick & pack orders", filter: "picking", icon: "Clipboard" },
      { label: "Count inventory", filter: "inventory", icon: "Search" },
      { label: "Sort packages", filter: "sorting", icon: "Layers" },
    ],
    faqs: [
      { q: "How much does a warehouse AMR cost?", a: "Autonomous mobile robots for warehouse use range from $25K for basic models to $150K+ for heavy-payload systems. Leasing starts at $2K-$5K/month. RaaS (Robot-as-a-Service) options let you pay per task or per hour." },
      { q: "How long does it take to deploy a warehouse robot?", a: "A single AMR can be operational in 2-4 weeks including site assessment, WiFi mapping, and WMS integration. Fleet deployments (10+ units) typically take 6-12 weeks." },
      { q: "Do I need to modify my warehouse for robots?", a: "Most modern AMRs require minimal facility changes — WiFi coverage, floor markers at key intersections, and charging station installation. Older AGV systems require guide wires or magnetic strips embedded in the floor." },
    ],
    certLevel: "RCO Foundation (Level 1)",
    certPath: "/certify/1",
  },
  medical: {
    slug: "medical",
    name: "Medical & Healthcare",
    description: "Surgical systems, hospital delivery robots, disinfection robots, and rehabilitation devices that extend clinical capability and reduce infection risk.",
    stats: [
      { label: "Market by 2030", value: "$22B" },
      { label: "Complication reduction", value: "73%" },
      { label: "Avg stay reduction", value: "60%" },
    ],
    whoUsesIt: "Hospitals, surgical centers, rehabilitation facilities, pharmacies, senior care facilities",
    buyersGuide: [
      { title: "FDA Clearance", body: "Every medical robot used in the US requires FDA clearance, typically through the 510(k) pathway. Verify clearance status before evaluating. Non-cleared devices cannot be used in clinical settings." },
      { title: "Clinical Workflow Integration", body: "The robot must fit into existing clinical workflows — OR scheduling, EHR systems, sterile processing. A robot that disrupts workflow will be abandoned within 6 months." },
      { title: "Training Requirements", body: "Surgical robots require 20-40 hours of surgeon training plus ongoing proctoring. Hospital logistics robots need 4-8 hours of staff orientation. Budget for training before deployment." },
      { title: "Service Contract", body: "Medical robots require manufacturer service contracts — typically 15-20% of purchase price annually. Downtime in a clinical setting is measured in patient outcomes, not dollars." },
    ],
    useCases: [
      { label: "Assist surgery", filter: "surgical", icon: "Hospital" },
      { label: "Deliver supplies", filter: "delivery", icon: "Package" },
      { label: "Disinfect rooms", filter: "disinfect", icon: "Sparkle" },
      { label: "Assist rehab", filter: "rehab", icon: "Heart" },
    ],
    faqs: [
      { q: "How much does a surgical robot cost?", a: "Surgical systems range from $500K for single-specialty platforms to $2.5M+ for multi-specialty systems like the da Vinci 5. Annual service contracts add $150K-$300K. Per-procedure instrument costs run $700-$3,500." },
      { q: "Do medical robots replace surgeons?", a: "No. Current surgical robots are surgeon-controlled tools that enhance precision, not autonomous systems. The surgeon operates from a console. The robot translates hand movements into precise instrument movements inside the patient." },
      { q: "What certifications do hospital robot operators need?", a: "Hospital logistics robot operators need RCO Foundation (Level 1) minimum. Surgical robot teams need manufacturer-specific training (20-40 hours) plus RCO Specialist (Level 2) for integration work." },
    ],
    certLevel: "RCO Specialist (Level 2)",
    certPath: "/certify/2",
  },
  humanoid: {
    slug: "humanoid",
    name: "Humanoid Robots",
    description: "Bipedal robots designed to operate in human environments, perform complex manipulation tasks, and eventually replace human labor in unstructured settings.",
    stats: [
      { label: "Market by 2035", value: "$38B" },
      { label: "Companies (China)", value: "137" },
      { label: "Cost drop since 2022", value: "90%" },
    ],
    whoUsesIt: "Manufacturing plants, logistics warehouses, research labs, defense organizations, technology early adopters",
    buyersGuide: [
      { title: "Maturity Level", body: "Humanoid robots are the least mature category. Most are in pilot deployments, not production. Buy for R&D and exploration, not for replacing workers today." },
      { title: "Buy vs Lease vs RaaS", body: "Given the pace of improvement, leasing or RaaS is almost always the right choice for humanoids in 2026. Buying locks you into technology that will be obsolete in 18 months." },
      { title: "Safety Considerations", body: "Humanoids are dynamically stable — you cannot simply cut power to stop them safely. ISO safety standards for humanoids are expected in 2027-2028. Deploy only in controlled environments with trained operators." },
      { title: "Chinese vs Western", body: "Chinese manufacturers (Unitree, Agibot, Fourier) offer 60-80% lower prices. Western manufacturers (Figure, Boston Dynamics, Apptronik) offer more advanced AI and better service networks. Evaluate based on your use case, not geopolitics." },
    ],
    useCases: [
      { label: "Warehouse tasks", filter: "logistics", icon: "Package" },
      { label: "Assembly assist", filter: "assembly", icon: "Wrench" },
      { label: "Research & dev", filter: "research", icon: "Search" },
      { label: "Home assistance", filter: "home", icon: "Home" },
    ],
    faqs: [
      { q: "Can I buy a humanoid robot today?", a: "Yes. Unitree G1 ($16K), 1X NEO Gamma ($20K), Fourier GR-1 ($55K), and Agility Digit (RaaS at $10-30/hr) are commercially available. Most are targeted at research and pilot deployments, not full production." },
      { q: "When will humanoids be cheaper than human workers?", a: "At current cost curves (40% annual reduction), humanoids will reach $10K-$15K by 2028 — the threshold where they become economically viable for routine tasks. Leased humanoids already compete with human labor at $10-30/hour." },
      { q: "Are humanoid robots safe to work around?", a: "Safety standards for humanoids are still being developed (IEEE P7009, ASTM F3538, expected 2027-2028). Until then, deploy only in controlled environments with trained operators and physical separation from untrained workers." },
    ],
    certLevel: "RCO Specialist — Humanoid Track (Level 2)",
    certPath: "/certify/2",
  },
  drone: {
    slug: "drone",
    name: "Drones & Aerial",
    description: "Fixed-wing and multirotor UAVs for inspection, mapping, delivery, agriculture, and surveillance. The fastest-growing category in commercial robotics.",
    stats: [
      { label: "Market by 2030", value: "$54B" },
      { label: "Cost vs manned", value: "-80%" },
      { label: "Inspection speed", value: "10x" },
    ],
    whoUsesIt: "Infrastructure inspection, precision agriculture, package delivery, security, construction, filmmaking",
    buyersGuide: [
      { title: "FAA Part 107", body: "Commercial drone operation in the US requires FAA Part 107 certification for the pilot. Budget $300 and 20 hours of study. Without it, you cannot legally operate commercially." },
      { title: "Payload vs Flight Time", body: "Every gram of payload reduces flight time. A drone rated for 30 minutes empty may only fly 18 minutes with a thermal camera. Always test with your actual payload." },
      { title: "Weatherproofing", body: "Most consumer drones cannot fly in rain or high wind. Commercial operations need IP43+ rating minimum. Budget for weather delays — outdoor drone operations average 60-70% availability." },
      { title: "Data Processing", body: "The drone captures data. Processing it into actionable intelligence (3D models, thermal reports, crop health maps) requires software and expertise. Budget for post-processing, not just the aircraft." },
    ],
    useCases: [
      { label: "Inspect structures", filter: "inspection", icon: "Search" },
      { label: "Map terrain", filter: "mapping", icon: "Layers" },
      { label: "Monitor crops", filter: "agriculture", icon: "Leaf" },
      { label: "Deliver packages", filter: "delivery", icon: "Package" },
    ],
    faqs: [
      { q: "Do I need a license to fly a commercial drone?", a: "Yes. In the US, commercial drone operators need FAA Part 107 Remote Pilot Certificate. The exam costs ~$175, requires 20 hours of study, and is valid for 2 years. Some operations require additional waivers (night flight, over people, BVLOS)." },
      { q: "How much does a commercial drone cost?", a: "Enterprise drones range from $2K (DJI Mini series) to $30K+ (DJI Matrice 350 RTK, Skydio X10). Total cost includes the drone, sensors/cameras ($1K-$15K), software ($500-$5K/year), insurance ($500-$2K/year), and training." },
      { q: "Can drones fly in rain?", a: "Most consumer and prosumer drones cannot fly in rain. Enterprise drones with IP43+ rating (DJI Matrice series, Skydio X10) can operate in light rain. No commercial drone should fly in thunderstorms or heavy precipitation." },
    ],
    certLevel: "RCO Foundation (Level 1) + FAA Part 107",
    certPath: "/certify/1",
  },
  manufacturing: {
    slug: "manufacturing",
    name: "Manufacturing & Assembly",
    description: "Industrial arms, cobots, welding robots, and assembly systems that automate precision manufacturing tasks alongside human workers.",
    stats: [
      { label: "Market by 2030", value: "$95B" },
      { label: "Cobot growth", value: "23%/yr" },
      { label: "Defect reduction", value: "85%" },
    ],
    whoUsesIt: "Automotive, electronics, food processing, metal fabrication, pharmaceuticals, consumer goods",
    buyersGuide: [
      { title: "Cobot vs Industrial", body: "Cobots ($25K-$65K) work alongside humans without safety caging. Industrial arms ($50K-$400K) are faster and stronger but require safety fencing. Choose based on whether humans need to share the workspace." },
      { title: "Cycle Time", body: "Industrial arms complete tasks 3-10x faster than cobots. If your bottleneck is speed, a cobot won't solve it. If your bottleneck is consistency or ergonomics, a cobot is ideal." },
      { title: "End-of-Arm Tooling", body: "The gripper/tool on the robot often costs as much as the robot itself. Budget $5K-$50K for end-of-arm tooling. Custom grippers for unusual parts add 4-8 weeks to deployment." },
      { title: "Programming Method", body: "Modern cobots can be programmed by hand-guiding (no coding needed). Industrial arms typically require offline programming with simulation software. Factor programming skill availability into your decision." },
    ],
    useCases: [
      { label: "Assemble parts", filter: "assembly", icon: "Wrench" },
      { label: "Weld & fabricate", filter: "welding", icon: "Zap" },
      { label: "Pick & place", filter: "pick-place", icon: "Clipboard" },
      { label: "Quality inspect", filter: "inspect", icon: "Search" },
    ],
    faqs: [
      { q: "What's the difference between a cobot and an industrial robot?", a: "Cobots (collaborative robots) are designed to work alongside humans without safety fencing, using force-limiting and speed-monitoring per ISO/TS 15066. Industrial robots operate in fenced cells at higher speeds and payloads. Cobots cost $25K-$65K; industrial arms cost $50K-$400K." },
      { q: "How long does it take to deploy a cobot?", a: "A single cobot for a simple task (pick-and-place, machine tending) can be deployed in 1-3 weeks. Complex applications with custom tooling, PLC integration, and quality verification take 4-12 weeks." },
      { q: "What ROI can I expect from a manufacturing robot?", a: "Typical payback period for a cobot is 6-14 months. Industrial arms in high-volume applications pay back in 3-8 months. ROI depends on labor cost, shift coverage, defect reduction, and throughput increase." },
    ],
    certLevel: "RCO Specialist (Level 2)",
    certPath: "/certify/2",
  },
  consumer: {
    slug: "consumer",
    name: "Consumer & Home",
    description: "Robotic vacuum cleaners, lawn mowers, pool cleaners, and home assistant robots that automate household tasks.",
    stats: [
      { label: "Market by 2030", value: "$28B" },
      { label: "Units sold globally", value: "45M+" },
      { label: "Avg price drop/yr", value: "15%" },
    ],
    whoUsesIt: "Homeowners, property managers, hospitality, cleaning services, residential care",
    buyersGuide: [
      { title: "Navigation Type", body: "LiDAR-equipped models ($500+) create accurate maps and clean efficiently. Camera-based models ($300-$500) are good but less precise. Random-bounce models (<$300) miss spots and waste battery." },
      { title: "Suction Power", body: "For homes with pets, look for 5,000+ Pa suction. Hardwood-only homes can use 2,000-3,000 Pa. Higher suction means louder operation and shorter battery life." },
      { title: "Self-Emptying Base", body: "Self-emptying docks add $200-$400 but eliminate the need to empty the dustbin every 1-2 runs. Essential for set-and-forget operation." },
      { title: "Multi-Floor Mapping", body: "If you have multiple floors, choose a model that stores multiple floor maps. Carrying a robot between floors and having it re-map each time defeats the purpose of automation." },
    ],
    useCases: [
      { label: "Vacuum floors", filter: "vacuum", icon: "Sparkle" },
      { label: "Mow lawn", filter: "lawn", icon: "Leaf" },
      { label: "Clean pool", filter: "pool", icon: "Sparkle" },
      { label: "Home security", filter: "security", icon: "Shield" },
    ],
    faqs: [
      { q: "Are robot vacuums worth it?", a: "Yes — for maintenance cleaning between deep cleans. A $500-$800 robot vacuum running daily keeps floors consistently clean and reduces manual vacuuming by 80%. They don't replace deep cleaning but dramatically reduce the frequency needed." },
      { q: "How long do robot vacuums last?", a: "Quality robot vacuums last 3-5 years with proper maintenance (filter cleaning, brush replacement every 6-12 months). Battery degradation typically starts at year 2-3. Budget $30-$50/year for replacement parts." },
      { q: "Can robot vacuums handle pet hair?", a: "Yes — models with rubber extractors (iRobot Roomba series) or anti-tangle brushes (Roborock S8 series) handle pet hair well. Look for 5,000+ Pa suction and a self-emptying base to avoid frequent maintenance." },
    ],
    certLevel: "No certification required",
    certPath: "/certify/awareness",
  },
  security: {
    slug: "security",
    name: "Security & Surveillance",
    description: "Autonomous patrol robots, perimeter monitoring systems, and threat detection platforms that provide 24/7 security coverage without fatigue.",
    stats: [
      { label: "Market by 2030", value: "$12B" },
      { label: "Cost vs guards", value: "-60%" },
      { label: "Coverage increase", value: "300%" },
    ],
    whoUsesIt: "Data centers, warehouses, corporate campuses, airports, retail, parking facilities",
    buyersGuide: [
      { title: "Indoor vs Outdoor", body: "Indoor patrol robots ($30K-$80K) need WiFi and smooth floors. Outdoor robots ($50K-$150K) need weatherproofing (IP65+), GPS, and can handle uneven terrain. Choose based on your primary patrol environment." },
      { title: "Detection Capabilities", body: "Basic models detect motion and anomalies. Advanced models include thermal imaging, license plate recognition, and facial recognition. More sensors = higher cost and more data to manage." },
      { title: "Integration with SOC", body: "The robot must feed alerts to your existing Security Operations Center. If it requires a separate monitoring system, you're adding complexity, not reducing it." },
      { title: "Human Response Plan", body: "A robot detects threats — it doesn't respond to them. You still need a human response team. The robot reduces the number of guards needed for detection, not the response team." },
    ],
    useCases: [
      { label: "Patrol perimeter", filter: "patrol", icon: "Shield" },
      { label: "Monitor parking", filter: "parking", icon: "Search" },
      { label: "Detect intrusion", filter: "intrusion", icon: "Shield" },
      { label: "Check compliance", filter: "compliance", icon: "Clipboard" },
    ],
    faqs: [
      { q: "Can security robots replace human guards?", a: "They replace detection patrols, not response capability. A security robot provides 24/7 automated patrol, thermal imaging, and alert generation — but a human must still respond to incidents. Most deployments keep 30-50% of their guard force for response." },
      { q: "How much does a security patrol robot cost?", a: "Indoor models: $30K-$80K purchase or $2K-$5K/month leased. Outdoor models: $50K-$150K purchase or $3K-$8K/month. Compare to a single security guard at $36K-$48K/year fully burdened — the robot patrols 24/7 without overtime." },
      { q: "What happens if someone attacks the robot?", a: "Modern security robots record all interactions with multiple cameras and can trigger immediate alerts. Attacking the robot generates evidence. Most deployments report zero vandalism after the first week of operation — the robot's presence is itself a deterrent." },
    ],
    certLevel: "RCO Foundation (Level 1)",
    certPath: "/certify/1",
  },
  agricultural: {
    slug: "agricultural",
    name: "Agricultural & Farming",
    description: "Autonomous tractors, harvesting robots, crop monitoring drones, and soil analysis systems that address the global farming labor crisis.",
    stats: [
      { label: "Market by 2030", value: "$20B" },
      { label: "Labor cost savings", value: "40%" },
      { label: "Yield improvement", value: "15%" },
    ],
    whoUsesIt: "Large-scale farms, vineyards, orchards, greenhouse operations, agricultural cooperatives",
    buyersGuide: [
      { title: "Weather Resistance", body: "Farm robots operate outdoors in dust, rain, and extreme temperatures. Require IP65+ minimum. Anything less will fail within one season." },
      { title: "Seasonal Economics", body: "Farm robots sit idle 6-8 months per year in seasonal operations. Calculate ROI based on harvest season labor savings only, not year-round. Leasing may be more economical than buying." },
      { title: "Crop Specificity", body: "Most harvesting robots are crop-specific — a strawberry picker cannot harvest apples. Verify the robot works with your exact crop variety before committing." },
      { title: "Connectivity", body: "Farms often have poor cellular and WiFi coverage. Ensure the robot can operate autonomously without constant connectivity. GPS/RTK positioning is essential for field navigation." },
    ],
    useCases: [
      { label: "Harvest crops", filter: "harvest", icon: "Leaf" },
      { label: "Monitor fields", filter: "monitor", icon: "Search" },
      { label: "Spray & weed", filter: "spray", icon: "Sparkle" },
      { label: "Sort produce", filter: "sorting", icon: "Layers" },
    ],
    faqs: [
      { q: "Can robots actually harvest crops?", a: "Yes, for select crops. Strawberry, tomato, and apple harvesting robots are commercially available. Success rates vary: 85-95% for large uniform fruits, 60-80% for small or hidden fruits. Human pickers are still needed for quality assurance and edge cases." },
      { q: "How do farm robots handle rough terrain?", a: "Agricultural robots use tracked or large-wheel platforms designed for soil, mud, and slopes. Most can handle 15-20 degree inclines and soft soil. Row-crop robots navigate between rows using GPS/RTK positioning." },
      { q: "What's the ROI on agricultural robots?", a: "For large operations (500+ acres), ROI is typically 1-2 seasons. The primary savings come from labor cost reduction during harvest season. Secondary benefits include 24-hour operation (harvest in optimal weather windows) and reduced crop damage." },
    ],
    certLevel: "RCO Foundation (Level 1)",
    certPath: "/certify/1",
  },
};

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] || null;
}
