/**
 * RCO Awareness (Level 0) — Quiz Question Bank
 * 40 questions across 5 domains, used by the exam engine.
 */

export interface QuizQuestion {
  id: string;
  domain: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LEVEL_0_QUESTIONS: QuizQuestion[] = [
  // ── Domain 1: The Robot Revolution (8 questions) ──
  {
    id: "l0-d1-01",
    domain: "The Robot Revolution",
    question: "What is the projected global robotics market size by 2040?",
    options: ["$2.4 trillion", "$24 trillion", "$240 billion", "$2.4 billion"],
    correctIndex: 1,
    explanation: "The global robotics market is projected to reach $24 trillion by 2040, making it one of the largest industries in human history.",
  },
  {
    id: "l0-d1-02",
    domain: "The Robot Revolution",
    question: "What is the approximate fully-burdened hourly cost of a leased robot in 2026?",
    options: ["$4.50/hour", "$0.45/hour", "$45/hour", "$0.045/hour"],
    correctIndex: 1,
    explanation: "When amortized over operating hours, a leased robot costs approximately $0.45/hour compared to $46/hour for fully-burdened human labor.",
  },
  {
    id: "l0-d1-03",
    domain: "The Robot Revolution",
    question: "Which three technologies converged to enable the current robotics revolution?",
    options: [
      "Blockchain, VR, and 5G",
      "AI, cheaper hardware, and cloud computing",
      "AI, advanced sensors, and cost reduction in components",
      "Quantum computing, batteries, and WiFi 7",
    ],
    correctIndex: 2,
    explanation: "The convergence of artificial intelligence, advanced sensor technology, and dramatic cost reduction in components (motors, batteries, compute) enabled today's robotics boom.",
  },
  {
    id: "l0-d1-04",
    domain: "The Robot Revolution",
    question: "How many humanoid robot companies existed in China alone by early 2026?",
    options: ["27", "57", "137", "237"],
    correctIndex: 2,
    explanation: "By early 2026, China had 137 humanoid robot companies, reflecting the global acceleration of humanoid robotics development.",
  },
  {
    id: "l0-d1-05",
    domain: "The Robot Revolution",
    question: "What was Figure AI's valuation in early 2026?",
    options: ["$3.95 billion", "$39.5 billion", "$395 million", "$3.95 million"],
    correctIndex: 1,
    explanation: "Figure AI reached a $39.5 billion valuation, reflecting massive investor confidence in humanoid robotics.",
  },
  {
    id: "l0-d1-06",
    domain: "The Robot Revolution",
    question: "What is an AMR?",
    options: [
      "Automated Manufacturing Robot",
      "Autonomous Mobile Robot",
      "Advanced Mechanical Rotator",
      "Artificial Motor Replica",
    ],
    correctIndex: 1,
    explanation: "AMR stands for Autonomous Mobile Robot — a robot that can navigate and move through environments independently without fixed tracks or guides.",
  },
  {
    id: "l0-d1-07",
    domain: "The Robot Revolution",
    question: "Which company deployed humanoid robots at scale in its warehouses by 2026?",
    options: ["Tesla", "Amazon", "Walmart", "FedEx"],
    correctIndex: 1,
    explanation: "Amazon deployed Agility Robotics' Digit humanoid robots at scale in its fulfillment centers.",
  },
  {
    id: "l0-d1-08",
    domain: "The Robot Revolution",
    question: "What does RaaS stand for?",
    options: [
      "Robots as a Service",
      "Robotics as a System",
      "Remote Autonomous Systems",
      "Robotic Assembly Solutions",
    ],
    correctIndex: 0,
    explanation: "RaaS (Robots as a Service) is a business model where businesses hire robots and operators for specific jobs rather than purchasing equipment outright.",
  },

  // ── Domain 2: How Robots Work (8 questions) ──
  {
    id: "l0-d2-01",
    domain: "How Robots Work",
    question: "What sensor technology allows a robot to create a 3D map of its environment?",
    options: ["GPS", "LiDAR", "Barometer", "Thermometer"],
    correctIndex: 1,
    explanation: "LiDAR (Light Detection and Ranging) emits laser pulses and measures reflections to create precise 3D maps of the surrounding environment.",
  },
  {
    id: "l0-d2-02",
    domain: "How Robots Work",
    question: "What is a cobot?",
    options: [
      "A robot that connects to the internet",
      "A robot designed to work alongside humans safely",
      "A robot controlled by a computer program",
      "A robot used exclusively in construction",
    ],
    correctIndex: 1,
    explanation: "A cobot (collaborative robot) is specifically designed to work alongside humans in a shared workspace with built-in safety features like force-limiting joints.",
  },
  {
    id: "l0-d2-03",
    domain: "How Robots Work",
    question: "What does DOF mean in robotics?",
    options: [
      "Degrees of Freedom",
      "Direction of Force",
      "Digital Operation Framework",
      "Dual Offset Function",
    ],
    correctIndex: 0,
    explanation: "DOF (Degrees of Freedom) refers to the number of independent axes of motion a robot can achieve. A 6-DOF robot arm can move in 6 independent ways.",
  },
  {
    id: "l0-d2-04",
    domain: "How Robots Work",
    question: "What is the primary purpose of a force/torque sensor on a robot arm?",
    options: [
      "To measure temperature",
      "To detect how much force is being applied",
      "To connect to WiFi",
      "To charge the battery",
    ],
    correctIndex: 1,
    explanation: "Force/torque sensors measure the forces and moments applied by or to the robot, enabling safe human-robot collaboration and precise manipulation.",
  },
  {
    id: "l0-d2-05",
    domain: "How Robots Work",
    question: "What is the typical battery life range of a warehouse AMR on a single charge?",
    options: ["1-2 hours", "4-8 hours", "24-48 hours", "7-14 days"],
    correctIndex: 1,
    explanation: "Most warehouse AMRs operate for 4-8 hours on a single charge, covering a standard work shift before needing to auto-dock for recharging.",
  },
  {
    id: "l0-d2-06",
    domain: "How Robots Work",
    question: "What does an IP67 rating mean for a robot?",
    options: [
      "It can connect to 67 devices simultaneously",
      "It weighs 67 kilograms",
      "It is fully dustproof and can be submerged in water",
      "It has 67% efficiency",
    ],
    correctIndex: 2,
    explanation: "IP67 means the robot is fully dust-tight (6) and can withstand temporary submersion in water up to 1 meter (7). This makes it suitable for wet or outdoor operations.",
  },
  {
    id: "l0-d2-07",
    domain: "How Robots Work",
    question: "What is repeatability in robot specifications?",
    options: [
      "How many times a robot can run before maintenance",
      "How precisely a robot returns to the same position",
      "How often the robot needs recalibration",
      "The number of tasks a robot can repeat per hour",
    ],
    correctIndex: 1,
    explanation: "Repeatability measures how precisely a robot can return to the same position, typically expressed in millimeters (e.g., +/-0.03mm). Lower values indicate higher precision.",
  },
  {
    id: "l0-d2-08",
    domain: "How Robots Work",
    question: "What is the purpose of SLAM in mobile robots?",
    options: [
      "Security Lockout And Monitoring",
      "Simultaneous Localization And Mapping",
      "System Load Analysis Mode",
      "Standard Logistics Automation Method",
    ],
    correctIndex: 1,
    explanation: "SLAM allows a robot to simultaneously build a map of its environment while tracking its own location within that map — essential for autonomous navigation.",
  },

  // ── Domain 3: Safety Basics (8 questions) ──
  {
    id: "l0-d3-01",
    domain: "Safety Basics",
    question: "Which ISO standard covers safety requirements for collaborative robots?",
    options: ["ISO 9001", "ISO/TS 15066", "ISO 14001", "ISO 27001"],
    correctIndex: 1,
    explanation: "ISO/TS 15066 specifies safety requirements for collaborative robot systems, including force and pressure limits for human-robot contact.",
  },
  {
    id: "l0-d3-02",
    domain: "Safety Basics",
    question: "What is the primary safety feature that distinguishes a cobot from an industrial robot?",
    options: [
      "Higher speed",
      "Force-limiting capability",
      "Larger payload",
      "Longer reach",
    ],
    correctIndex: 1,
    explanation: "Cobots have force-limiting joints that automatically stop or slow the robot when unexpected contact with a human is detected, unlike traditional industrial robots that operate behind safety cages.",
  },
  {
    id: "l0-d3-03",
    domain: "Safety Basics",
    question: "What should be the FIRST step before deploying any robot in a facility?",
    options: [
      "Train all employees",
      "Conduct a risk assessment",
      "Purchase insurance",
      "Install safety fencing",
    ],
    correctIndex: 1,
    explanation: "A thorough risk assessment must be conducted first to identify potential hazards, determine necessary safety measures, and ensure compliance with applicable standards.",
  },
  {
    id: "l0-d3-04",
    domain: "Safety Basics",
    question: "What does an E-stop (emergency stop) do?",
    options: [
      "Pauses the robot temporarily",
      "Immediately removes all power and stops all motion",
      "Sends an email to the safety team",
      "Switches the robot to low-speed mode",
    ],
    correctIndex: 1,
    explanation: "An emergency stop immediately cuts power to the robot's motors, bringing all motion to a halt. Every robot installation must have accessible E-stop buttons.",
  },
  {
    id: "l0-d3-05",
    domain: "Safety Basics",
    question: "What are the four collaborative operation modes defined by ISO 10218-2?",
    options: [
      "Manual, auto, remote, supervised",
      "Safety-rated stop, hand guiding, speed/separation, force limiting",
      "Low, medium, high, critical",
      "Start, run, pause, stop",
    ],
    correctIndex: 1,
    explanation: "The four modes are: safety-rated monitored stop, hand guiding, speed and separation monitoring, and power and force limiting.",
  },
  {
    id: "l0-d3-06",
    domain: "Safety Basics",
    question: "Why must robots operating near food products often have IP65 or higher ratings?",
    options: [
      "For internet connectivity",
      "To survive washdown cleaning procedures",
      "For higher speed operation",
      "To connect to inventory systems",
    ],
    correctIndex: 1,
    explanation: "Food-grade environments require regular high-pressure washdown cleaning. IP65+ ensures the robot is dust-tight and can withstand water jets without damage.",
  },
  {
    id: "l0-d3-07",
    domain: "Safety Basics",
    question: "What is a safety zone in the context of collaborative robotics?",
    options: [
      "A storage area for robot parts",
      "A defined area around the robot with specific safety rules",
      "The robot manufacturer's warranty coverage area",
      "The geographic region where the robot can be shipped",
    ],
    correctIndex: 1,
    explanation: "Safety zones are defined areas around a robot where different safety protocols apply based on the proximity of humans — from unrestricted access zones to restricted operation zones.",
  },
  {
    id: "l0-d3-08",
    domain: "Safety Basics",
    question: "What minimum training is typically required before operating a cobot?",
    options: [
      "A 4-year engineering degree",
      "No training is required for cobots",
      "Manufacturer-specific safety and operation training",
      "Only a forklift license",
    ],
    correctIndex: 2,
    explanation: "While cobots are designed for ease of use, operators still require manufacturer-specific training covering safety procedures, programming basics, and emergency protocols.",
  },

  // ── Domain 4: The Robot Economy (8 questions) ──
  {
    id: "l0-d4-01",
    domain: "The Robot Economy",
    question: "What is TCO in the context of robot procurement?",
    options: [
      "Total Cost of Ownership",
      "Technical Configuration Options",
      "Temporary Certificate of Operation",
      "Third-party Compliance Organization",
    ],
    correctIndex: 0,
    explanation: "TCO (Total Cost of Ownership) includes the purchase price plus installation, training, maintenance, consumables, and downtime costs over the robot's lifetime — typically 5 years.",
  },
  {
    id: "l0-d4-02",
    domain: "The Robot Economy",
    question: "What is a typical payback period for a warehouse AMR deployment?",
    options: ["1-2 weeks", "6-18 months", "5-7 years", "10+ years"],
    correctIndex: 1,
    explanation: "Most warehouse AMR deployments achieve payback in 6-18 months through labor savings, increased throughput, and reduced errors.",
  },
  {
    id: "l0-d4-03",
    domain: "The Robot Economy",
    question: "By what percentage do RCO-certified operators typically earn more than non-certified operators?",
    options: ["5%", "15%", "34%", "75%"],
    correctIndex: 2,
    explanation: "RCO-certified operators on the Robotomated platform earn approximately 34% more than non-certified operators, reflecting the premium on verified skills.",
  },
  {
    id: "l0-d4-04",
    domain: "The Robot Economy",
    question: "What is the primary business advantage of leasing a robot vs buying?",
    options: [
      "Leased robots are always newer",
      "Lower upfront capital with predictable monthly costs",
      "Leased robots work faster",
      "Buying is always better than leasing",
    ],
    correctIndex: 1,
    explanation: "Leasing preserves capital, provides predictable monthly expenses, often includes maintenance, and allows technology upgrades — ideal for businesses testing automation.",
  },
  {
    id: "l0-d4-05",
    domain: "The Robot Economy",
    question: "What percentage of workplace incidents are reduced with certified robot operators?",
    options: ["23%", "43%", "73%", "93%"],
    correctIndex: 2,
    explanation: "Facilities using certified robot operators experience a 73% reduction in incidents, which is why insurance carriers increasingly require operator certification.",
  },
  {
    id: "l0-d4-06",
    domain: "The Robot Economy",
    question: "What is the RoboWork marketplace?",
    options: [
      "A factory where robots are built",
      "A platform where businesses hire robot service providers",
      "A software program for programming robots",
      "A manufacturing standards organization",
    ],
    correctIndex: 1,
    explanation: "RoboWork is Robotomated's marketplace where businesses post jobs and verified Robot Service Providers bid to complete them with their own robots and operators.",
  },
  {
    id: "l0-d4-07",
    domain: "The Robot Economy",
    question: "What new job role has emerged specifically for managing robot fleets?",
    options: [
      "Robot Janitor",
      "Fleet Commander / Robot Fleet Manager",
      "Robot Salesperson",
      "AI Programmer",
    ],
    correctIndex: 1,
    explanation: "The Fleet Commander / Robot Fleet Manager role oversees multiple robots across facilities, handling scheduling, maintenance, performance optimization, and incident response.",
  },
  {
    id: "l0-d4-08",
    domain: "The Robot Economy",
    question: "What is the typical annual maintenance cost for a cobot, expressed as a percentage of purchase price?",
    options: ["1-3%", "5-10%", "20-30%", "40-50%"],
    correctIndex: 1,
    explanation: "Cobots typically cost 5-10% of their purchase price annually for maintenance, significantly lower than industrial robots which can cost 10-15% or more.",
  },

  // ── Domain 5: Your First Robot Interaction (8 questions) ──
  {
    id: "l0-d5-01",
    domain: "Your First Robot Interaction",
    question: "What is the recommended first step when evaluating a robot for your business?",
    options: [
      "Buy the cheapest option",
      "Define the specific task or problem you need solved",
      "Ask the manufacturer for a discount",
      "Hire an engineer",
    ],
    correctIndex: 1,
    explanation: "Always start by clearly defining the task, environment, and success criteria before evaluating specific robots. This ensures you match the right robot to your actual needs.",
  },
  {
    id: "l0-d5-02",
    domain: "Your First Robot Interaction",
    question: "What is a RoboScore?",
    options: [
      "A credit score for robots",
      "An independent 0-100 rating across 8 performance dimensions",
      "The speed at which a robot operates",
      "A gaming achievement system for robot operators",
    ],
    correctIndex: 1,
    explanation: "RoboScore is Robotomated's independent scoring system that rates robots on 8 dimensions: Performance, Reliability, Ease of Use, Intelligence, Value, Ecosystem, Safety, and Design.",
  },
  {
    id: "l0-d5-03",
    domain: "Your First Robot Interaction",
    question: "When comparing two robots, which factor is MOST important for a first-time buyer?",
    options: [
      "Which looks cooler",
      "Total cost of ownership over 5 years",
      "Which manufacturer is more famous",
      "Which was released most recently",
    ],
    correctIndex: 1,
    explanation: "TCO over the expected operational period gives the most complete financial picture, accounting for purchase price, installation, training, maintenance, and operational costs.",
  },
  {
    id: "l0-d5-04",
    domain: "Your First Robot Interaction",
    question: "What should you verify about a Robot Service Provider (RSP) before hiring them?",
    options: [
      "Their social media following",
      "Their RCO certification status and insurance coverage",
      "Their office location",
      "How many employees they have",
    ],
    correctIndex: 1,
    explanation: "Always verify that an RSP holds current RCO certification and carries appropriate insurance. This protects your business and ensures safe, competent operation.",
  },
  {
    id: "l0-d5-05",
    domain: "Your First Robot Interaction",
    question: "What does payload capacity mean for a robot arm?",
    options: [
      "How much the robot itself weighs",
      "The maximum weight the robot can carry or manipulate",
      "How much data the robot can process",
      "The shipping weight of the robot",
    ],
    correctIndex: 1,
    explanation: "Payload capacity is the maximum weight a robot can reliably carry, lift, or manipulate at its end-effector while maintaining specified performance levels.",
  },
  {
    id: "l0-d5-06",
    domain: "Your First Robot Interaction",
    question: "What is the best way to learn about a specific robot before purchasing?",
    options: [
      "Only read the manufacturer's marketing materials",
      "Check independent reviews, compare alternatives, and request a demo",
      "Ask a friend who doesn't use robots",
      "Buy it and try it out",
    ],
    correctIndex: 1,
    explanation: "Independent reviews (like Robotomated's RoboScores), side-by-side comparisons, and hands-on demos provide the most comprehensive and unbiased evaluation.",
  },
  {
    id: "l0-d5-07",
    domain: "Your First Robot Interaction",
    question: "What is the minimum recommended facility assessment before deploying a mobile robot?",
    options: [
      "Check that the doors are wide enough",
      "Floor condition, clearances, WiFi coverage, charging station placement, and traffic patterns",
      "Just make sure there's an electrical outlet",
      "No assessment is needed for modern robots",
    ],
    correctIndex: 1,
    explanation: "A proper site assessment covers floor flatness, doorway clearances, WiFi signal strength, charging infrastructure, pedestrian traffic patterns, and environmental conditions.",
  },
  {
    id: "l0-d5-08",
    domain: "Your First Robot Interaction",
    question: "What does Robotomated's independence guarantee mean?",
    options: [
      "Robotomated doesn't use electricity",
      "No manufacturer pays for scores, placement, or reviews",
      "Robotomated operates without an internet connection",
      "All robots on the platform are self-sufficient",
    ],
    correctIndex: 1,
    explanation: "Robotomated's independence guarantee means no manufacturer has ever paid for a RoboScore, placement in search results, or favorable review content. All ratings are earned through transparent methodology.",
  },
];

/** Get questions for a specific domain */
export function getQuestionsByDomain(domain: string): QuizQuestion[] {
  return LEVEL_0_QUESTIONS.filter((q) => q.domain === domain);
}

/** Get a random subset for the final assessment */
export function getFinalAssessmentQuestions(count: number = 15): QuizQuestion[] {
  const shuffled = [...LEVEL_0_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** All unique domains */
export const DOMAINS = [
  "The Robot Revolution",
  "How Robots Work",
  "Safety Basics",
  "The Robot Economy",
  "Your First Robot Interaction",
];
