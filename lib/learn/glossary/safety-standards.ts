import type { GlossaryTerm } from "../glossary-types";

export const SAFETY_STANDARDS_TERMS: GlossaryTerm[] = [
  {
    slug: "iso-10218",
    term: "ISO 10218 (robot safety)",
    definition:
      "ISO 10218 is the core international safety standard for industrial robots, published in two parts: Part 1 covers the robot itself and Part 2 covers the robot system and its integration into a cell. The standard was revised in 2025, and the 2025 revision incorporates the collaborative-application requirements that were formerly published separately in ISO/TS 15066. Integrators use it to define safeguarding, stop functions, operating modes, and the safety requirements a complete robot cell must satisfy before it is placed into service.",
    citation: {
      source: "ISO 10218-1:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["ansi-ria-r15-06", "iso-ts-15066", "risk-assessment", "cobot"],
    explore: [{ label: "Industrial arms", href: "/explore/manufacturing" }],
    group: "safety-standards",
  },
  {
    slug: "iso-ts-15066",
    term: "ISO/TS 15066 (collaborative robots)",
    definition:
      "ISO/TS 15066 is a technical specification that supplemented ISO 10218 with detailed safety requirements for collaborative robot applications, including biomechanical force and pressure limits for contact between a robot and a person. It formalized the design considerations for the collaborative operating methods, particularly power and force limiting. Its requirements were incorporated into the 2025 revision of ISO 10218, but the specification remains widely cited in existing risk assessments and integrator documentation.",
    citation: {
      source: "ISO/TS 15066:2016, International Organization for Standardization",
      year: "2016",
    },
    related: ["iso-10218", "power-and-force-limiting", "cobot", "collaborative-workspace"],
    explore: [{ label: "Industrial arms", href: "/explore/manufacturing" }],
    group: "safety-standards",
  },
  {
    slug: "iso-12100",
    term: "ISO 12100 (risk assessment)",
    definition:
      "ISO 12100 establishes the general principles of safety of machinery: hazard identification, risk estimation, risk evaluation, and risk reduction. It defines the three-step risk-reduction hierarchy — inherently safe design first, then safeguarding and complementary protective measures, then information for use. Robot-specific standards such as ISO 10218 are built on top of ISO 12100, and a documented risk assessment following its method is the starting point for any robot cell design.",
    citation: {
      source: "ISO 12100:2010, International Organization for Standardization",
      year: "2010",
    },
    related: ["risk-assessment", "iso-10218", "iso-13849-1"],
    group: "safety-standards",
  },
  {
    slug: "iso-13849-1",
    term: "ISO 13849-1 (performance levels)",
    definition:
      "ISO 13849-1 covers the design of safety-related parts of control systems and defines five performance levels, PL a through PL e, that express the ability of a safety function to perform under foreseeable conditions. The required performance level for a given safety function is derived from severity of injury, frequency of exposure, and possibility of avoidance. Robot safety functions such as emergency stop and safety-rated monitored stop are specified and validated against a performance level from this standard.",
    citation: {
      source: "ISO 13849-1:2023, International Organization for Standardization",
      year: "2023",
    },
    related: ["performance-level", "iec-62061", "emergency-stop", "risk-assessment"],
    group: "safety-standards",
  },
  {
    slug: "iec-62061",
    term: "IEC 62061 (functional safety / SIL)",
    definition:
      "IEC 62061 is the machinery-sector functional safety standard for safety-related electrical, electronic, and programmable electronic control systems, expressing safety-function integrity as a safety integrity level (SIL). It is the machinery application of the IEC 61508 functional-safety framework and serves as an alternative to ISO 13849-1 for specifying safety control systems. Integrators typically select one of the two standards for a project; both provide methods for assigning and verifying the required integrity of each safety function.",
    citation: {
      source: "IEC 62061:2021, International Electrotechnical Commission",
      year: "2021",
    },
    related: ["iso-13849-1", "performance-level", "risk-assessment"],
    group: "safety-standards",
  },
  {
    slug: "iso-13850",
    term: "ISO 13850 (emergency stop)",
    definition:
      "ISO 13850 specifies the functional requirements and design principles for the emergency stop function on machinery, independent of the type of energy used. It requires that the emergency stop be available and operational at all times, override all other functions and operations, and not be used as a substitute for proper safeguarding. Robot cells apply it to the design and placement of e-stop devices on controllers, teach pendants, and cell perimeters.",
    citation: {
      source: "ISO 13850:2015, International Organization for Standardization",
      year: "2015",
    },
    related: ["emergency-stop", "iso-10218", "teach-pendant"],
    group: "safety-standards",
  },
  {
    slug: "iso-13855",
    term: "ISO 13855 (safeguard positioning)",
    definition:
      "ISO 13855 governs the positioning of safeguards with respect to the approach speeds of parts of the human body, providing the calculation method for the minimum distance a protective device must be placed from a hazard zone. It supplies standardized approach-speed parameters and system response times so that a light curtain, laser scanner, or pressure-sensitive mat detects a person early enough for hazardous motion to stop before contact. It is the basis for separation-distance calculations in speed and separation monitoring applications.",
    citation: {
      source: "ISO 13855:2010, International Organization for Standardization",
      year: "2010",
    },
    related: ["speed-and-separation-monitoring", "safeguarded-space", "iso-10218"],
    group: "safety-standards",
  },
  // TODO(verify): edition year — cited as ISO 14119:2024; confirm 2024 second edition supersedes 2013
  {
    slug: "iso-14119",
    term: "ISO 14119 (interlocking devices)",
    definition:
      "ISO 14119 specifies principles for the design and selection of interlocking devices associated with guards, such as the switches on access doors of a robot cell that stop hazardous motion when the guard is opened. It classifies interlocking device types, addresses guard locking, and defines measures to minimize defeat of interlocks in a reasonably foreseeable manner. Robot cell doors, gates, and removable panels are typically interlocked to this standard.",
    citation: {
      source: "ISO 14119:2024, International Organization for Standardization",
      year: "2024",
    },
    related: ["safeguarded-space", "iso-10218", "loto"],
    group: "safety-standards",
  },
  // TODO(verify): edition year — cited as R15.06-2012; a US national adoption of ISO 10218:2025 may supersede this edition
  {
    slug: "ansi-ria-r15-06",
    term: "ANSI/RIA R15.06",
    definition:
      "ANSI/RIA R15.06 is the American national standard for industrial robot and robot system safety and is the US adoption of ISO 10218 Parts 1 and 2. It carries the same core requirements as the international standard, making conformance largely harmonized between US and international installations. US integrators and plant safety teams reference R15.06 for cell design, safeguarding, and integration requirements.",
    citation: {
      source: "ANSI/RIA R15.06-2012, Robotic Industries Association",
      year: "2012",
    },
    related: ["iso-10218", "risk-assessment", "systems-integrator"],
    explore: [{ label: "Industrial arms", href: "/explore/manufacturing" }],
    group: "safety-standards",
  },
  {
    slug: "speed-and-separation-monitoring",
    term: "Speed and separation monitoring (SSM)",
    definition:
      "Speed and separation monitoring is one of the four collaborative operating methods defined in the ISO 10218 framework, in which the robot system maintains a protective separation distance from any person in the collaborative workspace. Safety-rated sensing, typically laser scanners or vision systems, tracks operator position, and the robot slows or stops as the separation distance decreases. The minimum protective distance is calculated using the approach-speed methodology of ISO 13855.",
    citation: {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["iso-13855", "power-and-force-limiting", "collaborative-workspace", "cobot"],
    explore: [{ label: "Warehouse robots", href: "/explore/warehouse" }],
    group: "safety-standards",
  },
  {
    slug: "power-and-force-limiting",
    term: "Power and force limiting (PFL)",
    definition:
      "Power and force limiting is the collaborative operating method in which the robot is designed so that incidental contact with a person does not exceed defined biomechanical force and pressure limits, either through inherently limited actuators or safety-rated force control. It is the method most people associate with collaborative robots, because it permits operation alongside people without fences when the risk assessment supports it. The applicable contact limits originated in ISO/TS 15066 and are carried into the 2025 revision of ISO 10218.",
    citation: {
      source: "ISO/TS 15066:2016, International Organization for Standardization",
      year: "2016",
    },
    related: ["cobot", "iso-ts-15066", "speed-and-separation-monitoring", "force-torque-sensor"],
    explore: [{ label: "Industrial arms", href: "/explore/manufacturing" }],
    group: "safety-standards",
  },
  {
    slug: "hand-guiding",
    term: "Hand guiding",
    definition:
      "Hand guiding is a collaborative operating method in which an operator moves the robot by applying force directly to a hand-guiding device at or near the end-effector, with the robot in a safety-rated reduced-speed state. It is commonly used for intuitive programming, where the operator physically leads the arm through positions instead of jogging it from a teach pendant. Outside of the guided motion, the robot must hold a safety-rated monitored stop before the operator enters the workspace.",
    citation: {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["safety-rated-monitored-stop", "teach-pendant", "cobot", "end-effector"],
    group: "safety-standards",
  },
  {
    slug: "safety-rated-monitored-stop",
    term: "Safety-rated monitored stop",
    definition:
      "A safety-rated monitored stop is a collaborative operating method in which the robot halts and the stop condition is continuously monitored by the safety system while a person is in the collaborative workspace, without removing drive power. If the monitored stop condition is violated, a protective stop is triggered. It allows an operator to enter the workspace to load parts or inspect work, with automatic motion resuming only after the person leaves.",
    citation: {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["collaborative-workspace", "hand-guiding", "emergency-stop"],
    group: "safety-standards",
  },
  {
    slug: "loto",
    term: "Lockout/tagout (LOTO)",
    definition:
      "Lockout/tagout is the OSHA-regulated practice, codified at 29 CFR 1910.147, of isolating hazardous energy sources and securing them with locks and tags before servicing or maintenance so that equipment cannot be unexpectedly energized. For robot systems this means isolating electrical, pneumatic, hydraulic, and stored mechanical energy before entering the cell for maintenance work. LOTO applies to servicing activities that fall outside the protection of the machine's normal safeguards.",
    citation: {
      source: "29 CFR 1910.147, Occupational Safety and Health Administration",
      year: "1989",
    },
    related: ["emergency-stop", "safeguarded-space", "risk-assessment"],
    explore: [{ label: "Operator certification", href: "/certify" }],
    group: "safety-standards",
  },
  {
    slug: "safeguarded-space",
    term: "Safeguarded space",
    definition:
      "The safeguarded space is the volume defined by the perimeter safeguarding of a robot cell — fences, interlocked doors, light curtains, and scanners — within which the robot's hazardous motion is contained. It must enclose the robot's restricted space, and access to it is controlled so that hazardous motion stops before a person can reach the hazard. Safeguard placement relative to hazards is calculated per ISO 13855.",
    citation: {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["iso-13855", "iso-14119", "collaborative-workspace", "reach"],
    group: "safety-standards",
  },
  {
    slug: "collaborative-workspace",
    term: "Collaborative workspace",
    definition:
      "The collaborative workspace is the defined portion of the safeguarded space where a robot system and a person can perform tasks concurrently during production operation. It is a property of the application and its risk assessment, not of the robot alone: the same robot arm may run collaboratively in one zone and at full speed behind safeguards in another. Within this space, one or more of the four collaborative operating methods must be active.",
    citation: {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["cobot", "safeguarded-space", "speed-and-separation-monitoring", "power-and-force-limiting"],
    explore: [{ label: "Industrial arms", href: "/explore/manufacturing" }],
    group: "safety-standards",
  },
  {
    slug: "risk-assessment",
    term: "Risk assessment",
    definition:
      "Risk assessment is the systematic process, defined for machinery by ISO 12100, of identifying hazards, estimating and evaluating the associated risks, and determining whether risk reduction is required. For robot systems it is performed on the complete application — robot, end-effector, workpiece, and layout — because the hazards depend on the integration, not just the robot. The documented assessment drives every downstream safety decision, including safeguard selection, collaborative operating method, and required performance level of safety functions.",
    citation: {
      source: "ISO 12100:2010, International Organization for Standardization",
      year: "2010",
    },
    related: ["iso-12100", "iso-10218", "performance-level", "systems-integrator"],
    explore: [{ label: "Operator certification", href: "/certify" }],
    group: "safety-standards",
  },
  {
    slug: "emergency-stop",
    term: "Emergency stop (e-stop)",
    definition:
      "An emergency stop is a manually actuated function, designed to ISO 13850, that halts hazardous motion in an emergency and overrides all other operations. E-stop devices on robot systems appear on the controller, the teach pendant, and at operator stations around the cell, and must be resettable only by deliberate manual action, with the reset itself not restarting the machine. The e-stop is a complementary protective measure; it does not replace safeguarding or a proper risk assessment.",
    citation: {
      source: "ISO 13850:2015, International Organization for Standardization",
      year: "2015",
    },
    related: ["iso-13850", "safety-rated-monitored-stop", "teach-pendant", "loto"],
    explore: [{ label: "Operator certification", href: "/certify" }],
    group: "safety-standards",
  },
  {
    slug: "performance-level",
    term: "Performance level (PL)",
    definition:
      "Performance level is the discrete measure defined in ISO 13849-1 for the ability of a safety-related control function to perform under foreseeable conditions, graded from PL a (lowest) to PL e (highest). The required PL for each safety function is determined from the risk assessment, and the achieved PL is calculated from the architecture, reliability data, and diagnostic coverage of the implementing hardware. It is the ISO 13849 counterpart to the safety integrity level (SIL) used by IEC 62061.",
    citation: {
      source: "ISO 13849-1:2023, International Organization for Standardization",
      year: "2023",
    },
    related: ["iso-13849-1", "iec-62061", "risk-assessment", "emergency-stop"],
    group: "safety-standards",
  },
  {
    slug: "enabling-device",
    term: "Enabling device",
    definition:
      "An enabling device is a manually operated control, typically a three-position switch on a teach pendant, that permits robot motion only while held in the center-enabled position; both releasing it and squeezing it fully stop motion. It protects the person teaching or verifying a program inside the safeguarded space, since a startle reaction in either direction removes the motion-enable signal. ISO 10218 requires enabling-device control of motion during manual modes of operation.",
    citation: {
      source: "ISO 10218-1:2025, International Organization for Standardization",
      year: "2025",
    },
    related: ["teach-pendant", "iso-10218", "hand-guiding", "emergency-stop"],
    explore: [{ label: "Operator certification", href: "/certify" }],
    group: "safety-standards",
  },
];
