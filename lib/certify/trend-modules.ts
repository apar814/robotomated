/**
 * 12 Megatrends Reshaping Robotics (2026-2035)
 * Each trend maps to certification curriculum modules and exam domains.
 */

export interface RoboticsTrend {
  id: string;
  number: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  timeframe: string;
  impactLevel: "high" | "critical" | "transformational";
  relevantLevels: ("foundation" | "specialist" | "master" | "fleet_commander")[];
  whatOperatorsNeedToKnow: string[];
  keyTechnologies: string[];
  keyCompanies: string[];
  careerImpact: string;
  examTopics: string[];
}

export const ROBOTICS_MEGATRENDS: RoboticsTrend[] = [
  {
    id: "agentic-ai",
    number: 1,
    name: "Agentic AI Operations",
    slug: "agentic-ai-operations",
    tagline: "Robots that plan, reason, and execute without per-step human instruction",
    description:
      "Robots are becoming autonomous agents that understand goals, plan multi-step actions, and execute them independently. This fundamentally changes the operator's role from 'tell the robot what to do' to 'tell the robot what you want done — and audit what it decided.'",
    timeframe: "2025-2028 (accelerating now)",
    impactLevel: "transformational",
    relevantLevels: ["specialist", "master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "How to prompt robots effectively (natural language task specification)",
      "How to set constraints and guardrails for autonomous agents",
      "How to audit agent decision logs",
      "When to intervene vs when to trust autonomous decisions",
      "How agentic systems fail (hallucination in physical space = disaster)",
      "Reward hacking and specification gaming prevention",
      "Corrigibility — keeping robots correctable when they disagree",
    ],
    keyTechnologies: ["VLA models", "LLM-based planners", "ReAct frameworks", "Reinforcement learning from human feedback"],
    keyCompanies: ["Figure AI (Helix)", "1X Technologies", "Google DeepMind (RT-2)", "Physical Intelligence"],
    careerImpact: "Creates new role: AI Robot Systems Engineer. 60% salary premium over standard operators.",
    examTopics: [
      "Agent behavior auditing",
      "Constraint specification for physical agents",
      "Multi-agent coordination",
      "Failure mode analysis for agentic systems",
      "Rollback and intervention protocols",
    ],
  },
  {
    id: "vla-models",
    number: 2,
    name: "Vision-Language-Action Models",
    slug: "vla-models-for-operators",
    tagline: "One model that sees, understands language, and generates physical actions",
    description:
      "VLA models combine computer vision, language understanding, and action generation into a single neural network. A robot with a VLA can be given a natural language instruction, perceive its environment, and generate the motor commands to complete the task — all from one model.",
    timeframe: "2024-2027 (active deployment)",
    impactLevel: "transformational",
    relevantLevels: ["specialist", "master"],
    whatOperatorsNeedToKnow: [
      "How VLA models work (conceptually, no math required)",
      "How to evaluate VLA model performance in your facility",
      "Fine-tuning VLAs on facility-specific data",
      "When VLA models fail (distribution shift, novel objects, lighting changes)",
      "How to collect high-quality training data from your operations",
      "Privacy implications of video-based training data",
      "Model versioning and rollback procedures",
    ],
    keyTechnologies: ["Transformers", "Diffusion policies", "Cross-modal attention", "Sim-to-real transfer"],
    keyCompanies: ["Figure AI", "Google DeepMind", "Physical Intelligence", "NVIDIA"],
    careerImpact: "Operators who understand VLAs can deploy robots 5x faster than those who don't.",
    examTopics: [
      "VLA deployment troubleshooting",
      "Training data quality assessment",
      "Model performance evaluation",
      "Distribution shift detection",
      "Fine-tuning workflow for operators",
    ],
  },
  {
    id: "digital-twins",
    number: 3,
    name: "Digital Twin Operations",
    slug: "digital-twin-operations",
    tagline: "Every physical robot has a real-time simulation running in parallel",
    description:
      "Digital twins create an exact virtual replica of your physical robot and environment, synchronized in real-time. Operations increasingly happen in the twin first (validate, test, optimize) then are deployed to the physical robot.",
    timeframe: "2025-2029 (rapid adoption)",
    impactLevel: "critical",
    relevantLevels: ["specialist", "master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "What a digital twin is and isn't (not just a 3D model)",
      "How to use digital twins for pre-deployment validation",
      "Identifying when twin diverges from physical reality",
      "Using twins for operator training (safe practice environment)",
      "Twin-based predictive maintenance workflows",
      "Scenario testing: what-if analysis before live changes",
    ],
    keyTechnologies: ["NVIDIA Omniverse", "Siemens Xcelerator", "PTC Vuforia", "Unity Robotics", "ROS2 simulation bridges"],
    keyCompanies: ["NVIDIA", "Siemens", "PTC", "Unity", "Dassault Systemes"],
    careerImpact: "Digital twin skills add $15-25K to annual salary. Growing requirement for fleet managers.",
    examTopics: [
      "Twin validation protocols",
      "Predictive maintenance interpretation",
      "Divergence detection",
      "Scenario testing methodology",
      "Twin-based training program design",
    ],
  },
  {
    id: "swarm-intelligence",
    number: 4,
    name: "Swarm Intelligence",
    slug: "swarm-intelligence",
    tagline: "10 robots is becoming 1,000. Fleets develop collective intelligence.",
    description:
      "As fleet sizes grow from dozens to hundreds and thousands, robots develop collective behaviors that are more than the sum of their parts. One robot's learning benefits all. But swarms also introduce unique failure modes — cascade failures, deadlock, and emergent behaviors nobody programmed.",
    timeframe: "2026-2030 (scaling now)",
    impactLevel: "critical",
    relevantLevels: ["master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "Swarm coordination principles (not individual robot management)",
      "Collective task allocation algorithms",
      "Emergent behavior — planned vs unplanned",
      "How to monitor swarm health vs individual robot health",
      "Failure modes unique to swarms (cascade, deadlock, thrashing)",
      "When to intervene in swarm behavior vs let it self-correct",
      "Designing swarm-resilient facilities",
    ],
    keyTechnologies: ["Multi-agent reinforcement learning", "Consensus algorithms", "Stigmergy", "Distributed task allocation"],
    keyCompanies: ["Locus Robotics", "6 River Systems", "Amazon Robotics", "Geek+"],
    careerImpact: "Swarm management is the most critical skill for Fleet Commander candidates.",
    examTopics: [
      "Swarm failure mode diagnosis",
      "Cascade failure prevention",
      "Collective behavior analysis",
      "Swarm-safe facility design",
      "Performance metrics for swarms vs individuals",
    ],
  },
  {
    id: "edge-ai",
    number: 5,
    name: "Edge AI & Distributed Compute",
    slug: "edge-ai-deployment",
    tagline: "AI on the robot itself. Sub-10ms inference. No cloud dependency.",
    description:
      "AI inference is moving from cloud servers to the robot's onboard hardware. This enables real-time decisions without network latency, operation in areas with no connectivity, and privacy-preserving computation. But it introduces compute constraints that operators must understand.",
    timeframe: "2025-2028 (active deployment)",
    impactLevel: "high",
    relevantLevels: ["specialist", "master"],
    whatOperatorsNeedToKnow: [
      "Why edge inference matters operationally (latency, reliability, privacy)",
      "How to manage on-device model updates safely",
      "Compute constraints and their implications for model capability",
      "Quantized models vs full precision — when it matters",
      "Edge fleet management (deploying updates to 100+ robots)",
      "Inference performance monitoring and alerting",
      "When cloud vs edge is the right choice",
    ],
    keyTechnologies: ["NVIDIA Jetson", "Qualcomm RB5", "TensorRT", "ONNX Runtime", "Model quantization"],
    keyCompanies: ["NVIDIA", "Qualcomm", "Intel", "Google (Edge TPU)", "Hailo"],
    careerImpact: "Edge AI skills are increasingly required for Specialist and Master certifications.",
    examTopics: [
      "Edge deployment troubleshooting",
      "Model update procedures",
      "Performance benchmarking",
      "Cloud vs edge decision framework",
      "Compute resource management",
    ],
  },
  {
    id: "human-robot-collab",
    number: 6,
    name: "Human-Robot Collaboration Evolution",
    slug: "human-robot-collaboration",
    tagline: "From 'operator runs machine' to 'human and robot as team members'",
    description:
      "The relationship between humans and robots is evolving from a control paradigm to a collaboration paradigm. Robots are becoming team members, not just tools. This requires understanding of proxemics, trust calibration, and the psychology of human-robot interaction.",
    timeframe: "2025-2030 (gradual evolution)",
    impactLevel: "high",
    relevantLevels: ["foundation", "specialist", "master"],
    whatOperatorsNeedToKnow: [
      "Proxemics — how humans feel about robot proximity and personal space",
      "Trust calibration (over-trust is as dangerous as under-trust)",
      "Handoff protocols (smooth task transfer between human and robot)",
      "Communication design — how robots signal intent to humans",
      "Psychological safety in HRC environments",
      "Role clarity in hybrid human-robot teams",
      "Training non-robot-savvy coworkers to work alongside robots",
    ],
    keyTechnologies: ["Social robotics", "Intent signaling", "Shared autonomy", "Adaptive behavior"],
    keyCompanies: ["Universal Robots", "ABB", "FANUC", "Rethink Robotics"],
    careerImpact: "Every operator needs HRC skills. It's no longer optional — it's the baseline.",
    examTopics: [
      "Trust calibration assessment",
      "Handoff protocol design",
      "Coworker training programs",
      "Workspace design for HRC",
      "Psychological safety assessment",
    ],
  },
  {
    id: "cybersecurity",
    number: 7,
    name: "Autonomous Cybersecurity",
    slug: "robot-cybersecurity",
    tagline: "Robots are networked computers with physical actuators. They are targets.",
    description:
      "A hacked robot can injure people. As robots become more connected and autonomous, they become more attractive targets. Operators must understand the attack surface, recognize anomalous behavior, and know how to respond to a compromised robot system.",
    timeframe: "2025-2028 (urgent now)",
    impactLevel: "critical",
    relevantLevels: ["specialist", "master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "Robot attack surface (network, firmware, sensors, cloud, physical access)",
      "Common attack vectors (replay, sensor spoofing, model poisoning, supply chain)",
      "Secure deployment practices and network segmentation",
      "Incident response for robot cyberattacks",
      "Firmware verification and secure boot procedures",
      "Supply chain security considerations (manufacturer country of origin)",
      "Anomaly detection — recognizing compromised behavior",
    ],
    keyTechnologies: ["Zero-trust architecture", "Secure boot", "Network segmentation", "Behavioral anomaly detection"],
    keyCompanies: ["Dragos", "Claroty", "Nozomi Networks", "CyberArk"],
    careerImpact: "Robot cybersecurity is the fastest-growing specialization. 80% salary premium.",
    examTopics: [
      "Attack vector identification",
      "Incident response procedures",
      "Secure deployment checklist",
      "Anomaly detection scenarios",
      "Supply chain risk assessment",
    ],
  },
  {
    id: "regulatory",
    number: 8,
    name: "Regulatory Evolution",
    slug: "regulatory-evolution",
    tagline: "EU AI Act. OSHA updates. FDA expansion. The rules are changing fast.",
    description:
      "The regulatory landscape for autonomous systems is evolving rapidly. The EU AI Act classifies many robot systems as high-risk AI. OSHA is updating robot safety rules. FDA is expanding into autonomous medical devices. Operators must stay current or risk non-compliance.",
    timeframe: "2025-2030 (ongoing)",
    impactLevel: "critical",
    relevantLevels: ["specialist", "master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "EU AI Act implications for robot operators and deployers",
      "US regulatory trajectory (2026-2030 forecast)",
      "How to maintain compliance as regulations evolve",
      "Documentation requirements for autonomous systems",
      "Liability frameworks — who is responsible when an autonomous robot causes harm?",
      "Insurance implications of different autonomy levels",
      "Incident reporting obligations by jurisdiction",
    ],
    keyTechnologies: ["Compliance management systems", "Audit trail automation", "Risk assessment frameworks"],
    keyCompanies: ["EU Commission", "OSHA", "FDA", "NIST", "ISO"],
    careerImpact: "Regulatory knowledge is mandatory for Fleet Commander. Growing requirement at all levels.",
    examTopics: [
      "EU AI Act classification",
      "Compliance gap analysis",
      "Liability scenario analysis",
      "Documentation requirements",
      "Cross-jurisdictional compliance",
    ],
  },
  {
    id: "self-healing",
    number: 9,
    name: "Self-Healing & Self-Replicating Systems",
    slug: "self-healing-systems",
    tagline: "Robots that diagnose and repair themselves. Robots that build robots.",
    description:
      "Autonomous diagnostic and repair capabilities are becoming standard. Robots can detect wear, predict failures, and in some cases self-repair. At the frontier, robots are being used to manufacture other robots — the beginning of self-replication concepts.",
    timeframe: "2027-2032 (emerging)",
    impactLevel: "high",
    relevantLevels: ["master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "Automated diagnostics and self-repair capabilities",
      "When to trust automated repair vs require human verification",
      "Swarm-assisted maintenance protocols",
      "What 'robot builds robot' means operationally",
      "Managing autonomous manufacturing cells",
      "Quality assurance in self-replicating systems",
      "Human oversight requirements — the last line of defense",
    ],
    keyTechnologies: ["Predictive maintenance AI", "Self-diagnostic systems", "Autonomous manufacturing cells"],
    keyCompanies: ["Tesla (Optimus manufacturing)", "FANUC (lights-out factories)", "Bright Machines"],
    careerImpact: "Understanding self-healing systems reduces maintenance costs by 40-60%.",
    examTopics: [
      "Self-diagnostic validation",
      "Automated repair approval workflows",
      "Manufacturing cell oversight",
      "Quality assurance automation",
      "Human oversight design",
    ],
  },
  {
    id: "sensor-fusion",
    number: 10,
    name: "Multimodal Sensor Fusion",
    slug: "sensor-fusion-mastery",
    tagline: "Cameras + LiDAR + radar + thermal + tactile + audio = understanding",
    description:
      "Modern robots combine multiple sensor modalities to perceive the world far beyond what any single sensor can provide. Understanding how these sensors work together — and how they fail together — is essential for diagnosing problems and designing robust systems.",
    timeframe: "2025-2028 (mature and expanding)",
    impactLevel: "high",
    relevantLevels: ["specialist", "master"],
    whatOperatorsNeedToKnow: [
      "Kalman filtering concepts (non-mathematical, intuitive understanding)",
      "Which sensors fail in which conditions (rain, dust, lighting, temperature)",
      "Sensor redundancy design principles",
      "Calibration drift across different sensor types",
      "How AI interprets fused sensor data",
      "Environment design to support sensor performance",
    ],
    keyTechnologies: ["Extended Kalman Filter", "Particle filters", "Point cloud fusion", "Multi-modal transformers"],
    keyCompanies: ["Velodyne", "FLIR", "Intel RealSense", "Robotiq (tactile)", "Sick AG"],
    careerImpact: "Sensor fusion skills differentiate good technicians from great ones.",
    examTopics: [
      "Sensor failure diagnosis by modality",
      "Calibration procedures",
      "Redundancy design",
      "Environmental impact assessment",
      "Fusion algorithm troubleshooting",
    ],
  },
  {
    id: "sustainability",
    number: 11,
    name: "Sustainable Robotics",
    slug: "sustainable-robotics",
    tagline: "Energy, materials, end-of-life. ESG meets robot fleets.",
    description:
      "ESG requirements are reaching robot deployments. Companies need to account for the energy consumption, materials, and end-of-life disposal of their robot fleets. This is not just environmental — it's increasingly a procurement requirement and investor expectation.",
    timeframe: "2026-2030 (growing requirement)",
    impactLevel: "high",
    relevantLevels: ["master", "fleet_commander"],
    whatOperatorsNeedToKnow: [
      "Power consumption optimization for robot fleets",
      "Battery lifecycle management and responsible disposal",
      "Robot lifecycle assessment methodologies",
      "Carbon footprint: robot deployment vs human labor (it's complicated)",
      "ESG reporting requirements for automated facilities",
      "Sustainable procurement frameworks for robot vendors",
    ],
    keyTechnologies: ["Battery management systems", "Energy harvesting", "Lifecycle assessment tools"],
    keyCompanies: ["ABB (sustainability focus)", "Universal Robots (lifecycle)", "Locus (energy-efficient AMRs)"],
    careerImpact: "Sustainability knowledge is a growing requirement for Fleet Commander candidates.",
    examTopics: [
      "Fleet energy optimization",
      "Battery lifecycle management",
      "ESG reporting for robot fleets",
      "Sustainable procurement",
      "Carbon footprint analysis",
    ],
  },
  {
    id: "extreme-environments",
    number: 12,
    name: "Space & Extreme Environment Robotics",
    slug: "extreme-environment-ops",
    tagline: "NASA, SpaceX, mining, deep sea, nuclear. Same principles, extreme conditions.",
    description:
      "An emerging but fast-growing sector. The principles of robot operation translate to extreme environments — but with additional constraints that test the limits of autonomy, reliability, and human oversight when you can't physically reach the robot.",
    timeframe: "2027-2035 (emerging sector)",
    impactLevel: "high",
    relevantLevels: ["fleet_commander"],
    whatOperatorsNeedToKnow: [
      "Latency-tolerant autonomous operation (Mars: 4-24 min signal delay)",
      "Radiation-hardened system considerations",
      "Extreme temperature operation (-180°C to +400°C)",
      "Communication blackout protocols",
      "Zero-gravity manipulation concepts",
      "Redundancy requirements in non-recoverable environments",
    ],
    keyTechnologies: ["Radiation-hardened processors", "Delay-tolerant networking", "Autonomous science", "Space-rated actuators"],
    keyCompanies: ["NASA JPL", "SpaceX", "Intuitive Machines", "Astrobotic", "Oceaneering"],
    careerImpact: "Niche but high-paying. Space robotics engineers command $150K+ salaries.",
    examTopics: [
      "Latency-tolerant operation design",
      "Extreme environment risk assessment",
      "Communication protocol design",
      "Redundancy requirement analysis",
      "Non-recoverable environment planning",
    ],
  },
];

/**
 * Get trends relevant to a specific certification level
 */
export function getTrendsByLevel(
  level: "foundation" | "specialist" | "master" | "fleet_commander"
): RoboticsTrend[] {
  return ROBOTICS_MEGATRENDS.filter((t) => t.relevantLevels.includes(level));
}

/**
 * Get a single trend by slug
 */
export function getTrendBySlug(slug: string): RoboticsTrend | undefined {
  return ROBOTICS_MEGATRENDS.find((t) => t.slug === slug);
}
