export interface JobProfile {
  id: string;
  job_name: string;
  job_description: string;
  industry_verticals: string[];
  typical_workforce_cost_annual: { min: number; max: number };
  workflow_steps: string[];
  pain_points: string[];
  robot_capabilities_needed: string[];
  best_robot_categories: string[];
  typical_setup_weeks: { min: number; max: number };
  hours_saved_per_week: { min: number; max: number };
  roi_months_typical: { min: number; max: number };
  certification_required: string;
  infrastructure_requirements: string[];
  case_study: {
    company_type: string;
    size: string;
    before: string;
    after: string;
    result: string;
  };
}

export const JOB_PROFILES: JobProfile[] = [
  {
    id: "warehouse-pallet-movement",
    job_name: "Warehouse Pallet Movement",
    job_description: "Move pallets between staging areas, dock doors, and storage locations across a warehouse or distribution center.",
    industry_verticals: ["Warehouse & Logistics", "Retail", "Manufacturing"],
    typical_workforce_cost_annual: { min: 126000, max: 174000 },
    workflow_steps: ["Receive pallet at dock", "Scan barcode", "Transport to storage location", "Place in rack/floor position", "Confirm placement in WMS"],
    pain_points: ["Shift handoff gaps causing throughput dips", "Peak hour congestion in narrow aisles", "Human fatigue after hour 6 reducing speed 25%", "Worker injury liability ($38K avg cost per incident)", "Labor market tightness — 20% annual turnover"],
    robot_capabilities_needed: ["Autonomous navigation", "Pallet detection and pickup", "Obstacle avoidance", "WMS integration", "Multi-zone pathing"],
    best_robot_categories: ["warehouse"],
    typical_setup_weeks: { min: 3, max: 6 },
    hours_saved_per_week: { min: 80, max: 160 },
    roi_months_typical: { min: 6, max: 14 },
    certification_required: "RCO Foundation (Level 1)",
    infrastructure_requirements: ["WiFi coverage mapping across facility", "Floor reflector/QR markers at key intersections", "WMS API integration", "Charging station installation", "Safety zone marking"],
    case_study: { company_type: "3PL Distribution Center", size: "120,000 sq ft, 3 shifts", before: "9 forklift operators, 24/7, $520K annual labor", after: "4 AMRs + 3 operators for exceptions", result: "62% labor cost reduction, 99.2% uptime, ROI in 9 months" },
  },
  {
    id: "facility-floor-cleaning",
    job_name: "Facility Floor Cleaning",
    job_description: "Automated scrubbing, sweeping, and sanitization of commercial floors on a nightly or continuous schedule.",
    industry_verticals: ["Hospitality", "Healthcare", "Retail", "Manufacturing"],
    typical_workforce_cost_annual: { min: 76000, max: 156000 },
    workflow_steps: ["Mix cleaning solution", "Navigate floor zones", "Scrub/sweep surfaces", "Vacuum excess water", "Report completion and coverage"],
    pain_points: ["Inconsistent cleaning quality between operators", "Night shift staffing difficulty", "Chemical handling safety incidents", "Slip-and-fall liability from uneven coverage", "No data on actual coverage or cleanliness"],
    robot_capabilities_needed: ["Autonomous navigation", "Floor type detection", "Obstacle avoidance", "Solution dispensing", "Coverage mapping and reporting"],
    best_robot_categories: ["consumer"],
    typical_setup_weeks: { min: 1, max: 2 },
    hours_saved_per_week: { min: 30, max: 60 },
    roi_months_typical: { min: 4, max: 10 },
    certification_required: "RCO Awareness (Level 0)",
    infrastructure_requirements: ["Floor plan mapping run", "Charging station placement", "WiFi for reporting"],
    case_study: { company_type: "Regional Hospital Network", size: "3 facilities, 200K total sq ft", before: "6 night janitorial staff, $312K/year", after: "3 cleaning robots + 1 supervisor", result: "78% cost reduction, 99.8% coverage consistency, infection rate down 34%" },
  },
  {
    id: "surgical-assistance",
    job_name: "Surgical Assistance",
    job_description: "Robotic systems that extend surgeon capabilities with sub-millimeter precision, 3D visualization, and tremor elimination.",
    industry_verticals: ["Healthcare"],
    typical_workforce_cost_annual: { min: 0, max: 0 },
    workflow_steps: ["Pre-op planning with 3D imaging", "Robot positioning and calibration", "Surgeon controls via console", "Robot executes precise movements", "Real-time imaging and feedback"],
    pain_points: ["Surgeon fatigue during 8+ hour procedures", "Human tremor at millimeter scale", "Limited visualization in minimally invasive surgery", "Training bottleneck for complex procedures", "Patient recovery time with open surgery"],
    robot_capabilities_needed: ["Sub-millimeter precision", "Haptic feedback", "3D stereoscopic vision", "Multi-arm coordination", "Real-time imaging integration"],
    best_robot_categories: ["medical"],
    typical_setup_weeks: { min: 12, max: 24 },
    hours_saved_per_week: { min: 0, max: 0 },
    roi_months_typical: { min: 18, max: 36 },
    certification_required: "RCO Specialist (Level 2) + Manufacturer training",
    infrastructure_requirements: ["Dedicated OR suite", "High-speed network", "Specialized instrument trays", "Surgeon simulator training", "Biomedical engineering support"],
    case_study: { company_type: "Tier 1 Academic Medical Center", size: "1,200-bed hospital", before: "Open surgery: 5-day avg stay, 4% complication rate", after: "Robotic-assisted: 1.5-day avg stay, 1.2% complication rate", result: "70% reduction in recovery time, $8,200 savings per procedure from shorter stays" },
  },
  {
    id: "agricultural-harvest",
    job_name: "Agricultural Harvest",
    job_description: "Automated harvesting of crops including picking, sorting, and transport from field to staging area.",
    industry_verticals: ["Agriculture"],
    typical_workforce_cost_annual: { min: 96000, max: 180000 },
    workflow_steps: ["Navigate crop rows", "Identify ripe produce", "Pick without damage", "Sort by quality grade", "Transport to collection point"],
    pain_points: ["Seasonal labor shortages — 40% of US farms report difficulty hiring", "Weather window pressure — 48-hour harvest windows", "Produce damage from inexperienced pickers", "Rising minimum wage impact on margins", "H-2A visa processing delays"],
    robot_capabilities_needed: ["Outdoor navigation", "Computer vision for ripeness detection", "Gentle manipulation", "All-terrain mobility", "Weather resistance"],
    best_robot_categories: ["agricultural"],
    typical_setup_weeks: { min: 2, max: 4 },
    hours_saved_per_week: { min: 60, max: 120 },
    roi_months_typical: { min: 8, max: 18 },
    certification_required: "RCO Foundation (Level 1)",
    infrastructure_requirements: ["GPS/RTK positioning setup", "Field mapping", "Charging infrastructure", "Cellular connectivity", "Storage for off-season"],
    case_study: { company_type: "Central Valley Berry Farm", size: "2,000 acres", before: "120 seasonal workers, $1.8M harvest labor", after: "8 harvest robots + 15 supervisors", result: "55% labor cost reduction, 12% yield increase from optimal timing, 24-hour harvest capability" },
  },
  {
    id: "security-perimeter-patrol",
    job_name: "Security Perimeter Patrol",
    job_description: "Autonomous patrol of facility perimeters, parking lots, and interior zones with real-time threat detection and alerting.",
    industry_verticals: ["Security", "Manufacturing", "Retail", "Education"],
    typical_workforce_cost_annual: { min: 108000, max: 192000 },
    workflow_steps: ["Navigate patrol route", "Monitor for intrusions", "Record video continuously", "Detect anomalies", "Alert security operations center"],
    pain_points: ["Guard fatigue — alertness drops 60% after hour 4", "Coverage gaps during shift changes", "High turnover — 100-300% annual in security", "Inability to monitor multiple zones simultaneously", "Limited night vision capability"],
    robot_capabilities_needed: ["Autonomous outdoor navigation", "360-degree cameras", "Thermal imaging", "License plate recognition", "Real-time alerting"],
    best_robot_categories: ["security"],
    typical_setup_weeks: { min: 2, max: 4 },
    hours_saved_per_week: { min: 100, max: 168 },
    roi_months_typical: { min: 5, max: 12 },
    certification_required: "RCO Foundation (Level 1)",
    infrastructure_requirements: ["WiFi/cellular coverage across patrol zone", "Charging station", "Integration with security operations center", "Weather protection for charging", "Perimeter mapping"],
    case_study: { company_type: "Corporate Campus", size: "40-acre property, 3 buildings", before: "6 security guards, 24/7, $288K/year", after: "2 patrol robots + 2 guards for response", result: "58% cost reduction, 300% increase in patrol frequency, 100% coverage consistency" },
  },
  {
    id: "manufacturing-assembly",
    job_name: "Manufacturing Assembly Support",
    job_description: "Collaborative robot assistance for repetitive assembly tasks including screw driving, part placement, and sub-assembly.",
    industry_verticals: ["Manufacturing", "Automotive", "Electronics"],
    typical_workforce_cost_annual: { min: 96000, max: 195000 },
    workflow_steps: ["Pick component from bin", "Align to fixture", "Insert/fasten", "Verify placement", "Transfer to next station"],
    pain_points: ["Repetitive strain injuries — $33K avg workers comp claim", "Quality variability between operators", "Production slowdown during breaks/shifts", "Training time for new operators — 2-6 weeks", "Difficulty scaling for demand spikes"],
    robot_capabilities_needed: ["Force-controlled manipulation", "Vision-guided picking", "Human-safe collaborative operation", "Programmable task sequences", "Quality verification sensors"],
    best_robot_categories: ["manufacturing"],
    typical_setup_weeks: { min: 4, max: 8 },
    hours_saved_per_week: { min: 40, max: 80 },
    roi_months_typical: { min: 8, max: 16 },
    certification_required: "RCO Specialist (Level 2)",
    infrastructure_requirements: ["Cobot mounting fixtures", "Safety zone assessment", "PLC integration", "Compressed air (if pneumatic grippers)", "Operator training program"],
    case_study: { company_type: "Electronics Manufacturer", size: "50-person assembly line", before: "12 assemblers, 35 units/hour, 2.1% defect rate", after: "4 cobots + 8 assemblers, 52 units/hour, 0.3% defect rate", result: "49% throughput increase, 86% defect reduction, ROI in 11 months" },
  },
  {
    id: "hospital-internal-delivery",
    job_name: "Hospital Internal Delivery",
    job_description: "Autonomous transport of medications, lab samples, meals, and supplies between departments within a hospital.",
    industry_verticals: ["Healthcare"],
    typical_workforce_cost_annual: { min: 88000, max: 156000 },
    workflow_steps: ["Receive delivery request", "Navigate to pickup point", "Load items securely", "Navigate to destination (elevator-capable)", "Confirm delivery"],
    pain_points: ["Nurses spending 20% of shift on non-clinical transport tasks", "Medication delivery delays impacting patient outcomes", "Lab sample degradation from slow transport", "Staff burnout from repetitive logistics", "Infection risk from human-to-human handoffs"],
    robot_capabilities_needed: ["Indoor navigation", "Elevator integration", "Secure compartments", "HIPAA-compliant logging", "Obstacle avoidance in busy corridors"],
    best_robot_categories: ["medical"],
    typical_setup_weeks: { min: 4, max: 8 },
    hours_saved_per_week: { min: 60, max: 100 },
    roi_months_typical: { min: 6, max: 14 },
    certification_required: "RCO Foundation (Level 1)",
    infrastructure_requirements: ["WiFi coverage all floors", "Elevator API integration", "Badge/RFID access integration", "Charging stations per floor", "EHR system integration"],
    case_study: { company_type: "Regional Medical Center", size: "400-bed, 6-floor hospital", before: "8 transport staff, 24/7, $416K/year", after: "4 delivery robots + 3 transport staff for oversize items", result: "52% transport cost reduction, 40% faster medication delivery, 18% increase in nursing time on patient care" },
  },
  {
    id: "construction-inspection",
    job_name: "Construction Site Inspection",
    job_description: "Drone and quadruped-based inspection of construction sites for progress monitoring, safety compliance, and defect detection.",
    industry_verticals: ["Construction"],
    typical_workforce_cost_annual: { min: 72000, max: 120000 },
    workflow_steps: ["Plan inspection route", "Deploy drone/ground robot", "Capture high-res imagery", "Generate 3D site model", "Compare against BIM plans", "Generate deviation report"],
    pain_points: ["Manual inspection takes 2-3 days per site visit", "Safety risk for inspectors at height/in confined spaces", "Inconsistent documentation quality", "Delayed defect detection increasing rework costs", "Inability to inspect during adverse conditions"],
    robot_capabilities_needed: ["Autonomous flight/navigation", "High-resolution cameras", "LiDAR scanning", "GPS precision", "BIM integration", "Report generation"],
    best_robot_categories: ["drone"],
    typical_setup_weeks: { min: 1, max: 2 },
    hours_saved_per_week: { min: 20, max: 40 },
    roi_months_typical: { min: 3, max: 8 },
    certification_required: "RCO Foundation (Level 1) + FAA Part 107 (drones)",
    infrastructure_requirements: ["Takeoff/landing zone designation", "Airspace clearance", "Cloud processing account", "BIM model access", "Cellular for real-time upload"],
    case_study: { company_type: "Commercial General Contractor", size: "$50M project, 18-month build", before: "Weekly manual inspections, 3 inspectors, $156K/year", after: "Daily drone inspections, 1 pilot", result: "85% faster inspection cycle, $2.1M saved in rework from early defect detection, 100% documentation coverage" },
  },
  {
    id: "last-mile-sorting",
    job_name: "Last-Mile Package Sorting",
    job_description: "High-speed sorting and routing of packages to delivery vehicles or zones based on destination, size, and priority.",
    industry_verticals: ["Warehouse & Logistics", "Retail"],
    typical_workforce_cost_annual: { min: 168000, max: 290000 },
    workflow_steps: ["Induct package onto system", "Scan and identify destination", "Route to correct chute/zone", "Verify sort accuracy", "Load delivery vehicle"],
    pain_points: ["Peak season volumes exceeding sort capacity", "Mis-sort rate of 1-3% causing redelivery costs", "Physical strain from 8-hour sort shifts", "Difficulty scaling labor for holiday surges", "Night shift premium costs"],
    robot_capabilities_needed: ["High-speed manipulation", "Barcode/OCR scanning", "Dynamic routing logic", "Package size/weight detection", "Conveyor integration"],
    best_robot_categories: ["warehouse"],
    typical_setup_weeks: { min: 6, max: 12 },
    hours_saved_per_week: { min: 120, max: 200 },
    roi_months_typical: { min: 10, max: 18 },
    certification_required: "RCO Specialist (Level 2)",
    infrastructure_requirements: ["Conveyor system integration", "WMS/TMS API connectivity", "Power for sort stations", "Network for real-time scan data", "Maintenance access zones"],
    case_study: { company_type: "Regional Parcel Carrier", size: "15,000 packages/day hub", before: "22 sorters per shift, $1.4M annual labor", after: "Automated sort system + 6 operators", result: "73% labor reduction, 99.7% sort accuracy (up from 97.2%), 40% throughput increase" },
  },
  {
    id: "inventory-counting",
    job_name: "Inventory Counting & Auditing",
    job_description: "Automated inventory scanning and counting using mobile robots or drones traversing warehouse aisles.",
    industry_verticals: ["Warehouse & Logistics", "Retail", "Manufacturing"],
    typical_workforce_cost_annual: { min: 48000, max: 96000 },
    workflow_steps: ["Navigate warehouse aisles", "Scan rack locations via RFID/barcode", "Compare against WMS data", "Flag discrepancies", "Generate count report"],
    pain_points: ["Manual cycle counts take 2-3 days, shut down operations", "Inventory accuracy averages 63% for US warehouses", "Shrinkage costs retailers $100B annually", "Counting errors cascade into fulfillment failures"],
    robot_capabilities_needed: ["Autonomous aisle navigation", "RFID/barcode scanning at height", "WMS integration", "Discrepancy reporting", "Overnight autonomous operation"],
    best_robot_categories: ["warehouse"],
    typical_setup_weeks: { min: 2, max: 4 },
    hours_saved_per_week: { min: 40, max: 80 },
    roi_months_typical: { min: 4, max: 10 },
    certification_required: "RCO Awareness (Level 0)",
    infrastructure_requirements: ["RFID/barcode labels on all locations", "WiFi coverage", "WMS API access", "Clear aisle widths for robot passage"],
    case_study: { company_type: "E-commerce Fulfillment Center", size: "250K sq ft, 50K SKUs", before: "Quarterly manual counts, 3 days downtime each", after: "Nightly automated scanning, zero downtime", result: "Inventory accuracy: 63% → 99.1%, $1.2M annual shrinkage reduction" },
  },
];

export function findJobProfile(query: string): JobProfile | null {
  const q = query.toLowerCase();
  return JOB_PROFILES.find((p) =>
    p.job_name.toLowerCase().includes(q) ||
    p.id.includes(q) ||
    p.industry_verticals.some((v) => q.includes(v.toLowerCase())) ||
    p.pain_points.some((pp) => q.includes(pp.toLowerCase().slice(0, 20)))
  ) || null;
}

export function matchJobProfiles(query: string): JobProfile[] {
  const q = query.toLowerCase();
  const keywords = q.split(/\s+/).filter((w) => w.length > 3);

  return JOB_PROFILES
    .map((p) => {
      let score = 0;
      const searchText = `${p.job_name} ${p.job_description} ${p.industry_verticals.join(" ")} ${p.pain_points.join(" ")} ${p.robot_capabilities_needed.join(" ")}`.toLowerCase();
      for (const kw of keywords) {
        if (searchText.includes(kw)) score++;
      }
      return { profile: p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.profile)
    .slice(0, 3);
}
