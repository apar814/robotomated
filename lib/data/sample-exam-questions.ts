/**
 * RCO Foundation (Level 1) sample exam questions.
 * Inserted into rco_questions via the start endpoint when
 * no questions exist for the certification.
 */

export interface SampleQuestion {
  question_text: string;
  question_type: "multiple_choice" | "scenario";
  options: string[];
  correct_answer: number;
  explanation: string;
  difficulty: number;
  category: "safety" | "operations" | "maintenance" | "regulations";
}

export const FOUNDATION_QUESTIONS: SampleQuestion[] = [
  // ── Safety (5) ──────────────────────────────────────────────
  {
    question_text:
      "What is the primary purpose of an emergency stop (e-stop) on a robotic system?",
    question_type: "multiple_choice",
    options: [
      "To pause the program for debugging",
      "To immediately halt all robot motion in an unsafe situation",
      "To save the current position before shutdown",
      "To switch between automatic and manual modes",
    ],
    correct_answer: 1,
    explanation:
      "An emergency stop is a safety device designed to immediately cease all robot motion when an unsafe condition is detected. It is not intended for routine program control.",
    difficulty: 2,
    category: "safety",
  },
  {
    question_text:
      "Which ISO standard specifically addresses safety requirements for collaborative robot systems?",
    question_type: "multiple_choice",
    options: ["ISO 9001", "ISO 14001", "ISO/TS 15066", "ISO 27001"],
    correct_answer: 2,
    explanation:
      "ISO/TS 15066 provides guidance on safety requirements for collaborative industrial robot systems and the work environment. ISO 9001 covers quality management, ISO 14001 covers environmental management, and ISO 27001 covers information security.",
    difficulty: 3,
    category: "safety",
  },
  {
    question_text:
      "In a collaborative workspace, what is 'speed and separation monitoring'?",
    question_type: "multiple_choice",
    options: [
      "Tracking how fast operators walk through the facility",
      "Monitoring network data transfer speeds between robots",
      "Adjusting robot speed based on the distance to nearby humans",
      "Measuring the time between robot maintenance intervals",
    ],
    correct_answer: 2,
    explanation:
      "Speed and separation monitoring is one of the four collaborative operation methods defined by ISO/TS 15066. The robot continuously monitors the distance between itself and the operator, adjusting speed or stopping to maintain a safe separation distance.",
    difficulty: 3,
    category: "safety",
  },
  {
    question_text:
      "What is the correct action if a robot exhibits unexpected movement during operation?",
    question_type: "multiple_choice",
    options: [
      "Continue observing to gather more data",
      "Attempt to physically redirect the robot",
      "Activate the emergency stop and clear the area",
      "Switch to manual mode and override the motion",
    ],
    correct_answer: 2,
    explanation:
      "Unexpected robot movement is a potential safety hazard. The correct response is to immediately activate the emergency stop and clear all personnel from the area. Never attempt to physically interact with a malfunctioning robot.",
    difficulty: 1,
    category: "safety",
  },
  {
    question_text:
      "What are the minimum required elements of a robot safety zone?",
    question_type: "multiple_choice",
    options: [
      "Caution tape and a written warning sign",
      "Physical barriers or safety-rated sensors, clear marking, and emergency stop access",
      "A verbal warning system and floor markings",
      "A locked door and security camera",
    ],
    correct_answer: 1,
    explanation:
      "A proper robot safety zone requires physical barriers or safety-rated detection devices (light curtains, laser scanners), clear visual marking of the zone boundaries, and readily accessible emergency stop controls. Simple caution tape or verbal warnings are insufficient.",
    difficulty: 2,
    category: "safety",
  },

  // ── Operations (5) ─────────────────────────────────────────
  {
    question_text:
      "What does 'payload capacity' refer to in robotics specifications?",
    question_type: "multiple_choice",
    options: [
      "The total weight of the robot arm",
      "The maximum weight the robot can carry at its end-effector",
      "The weight of the robot's base unit",
      "The combined weight of all attached sensors",
    ],
    correct_answer: 1,
    explanation:
      "Payload capacity specifies the maximum weight a robot can carry and manipulate at the end of its arm (end-effector). This includes the weight of the tool or gripper plus the workpiece.",
    difficulty: 2,
    category: "operations",
  },
  {
    question_text:
      "What does 'degrees of freedom' (DOF) describe in a robotic arm?",
    question_type: "multiple_choice",
    options: [
      "The temperature range in which the robot can operate",
      "The number of independent joints or axes of movement",
      "The number of programs that can run simultaneously",
      "The range of materials the robot can handle",
    ],
    correct_answer: 1,
    explanation:
      "Degrees of freedom refers to the number of independent axes of movement in a robotic system. A typical industrial robot arm has 6 DOF, allowing it to position and orient its end-effector freely in 3D space.",
    difficulty: 2,
    category: "operations",
  },
  {
    question_text:
      "What does 'repeatability' measure in a robot's specification sheet?",
    question_type: "multiple_choice",
    options: [
      "How many times the robot can perform before maintenance",
      "The consistency of returning to the same position across multiple attempts",
      "The number of programs the robot can store",
      "How quickly the robot can repeat a motion cycle",
    ],
    correct_answer: 1,
    explanation:
      "Repeatability measures how precisely a robot can return to a previously taught position across multiple attempts. It is typically specified in millimeters (e.g., +/- 0.02 mm) and is a key performance metric for precision applications.",
    difficulty: 2,
    category: "operations",
  },
  {
    question_text:
      "Which type of robot is specifically designed to work alongside humans without safety fencing?",
    question_type: "multiple_choice",
    options: [
      "Industrial articulated robot",
      "SCARA robot",
      "Collaborative robot (cobot)",
      "Delta/parallel robot",
    ],
    correct_answer: 2,
    explanation:
      "Collaborative robots (cobots) are designed with force-limiting technology and advanced sensing that allows them to operate safely in direct proximity to humans without the need for traditional safety fencing.",
    difficulty: 1,
    category: "operations",
  },
  {
    question_text:
      "An AMR (Autonomous Mobile Robot) uses SLAM technology. What does SLAM stand for?",
    question_type: "multiple_choice",
    options: [
      "Standard Logistics Automation Management",
      "Simultaneous Localization and Mapping",
      "Sensor-Linked Autonomous Movement",
      "Systematic Load Assignment Method",
    ],
    correct_answer: 1,
    explanation:
      "SLAM (Simultaneous Localization and Mapping) is a technique used by AMRs to build and update a map of an unknown environment while simultaneously tracking the robot's location within it.",
    difficulty: 3,
    category: "operations",
  },

  // ── Maintenance (5) ────────────────────────────────────────
  {
    question_text:
      "Before performing routine maintenance on a robot, what is the first step?",
    question_type: "multiple_choice",
    options: [
      "Open the control cabinet",
      "Follow lockout/tagout (LOTO) procedures",
      "Put the robot in manual mode",
      "Disconnect the end-effector",
    ],
    correct_answer: 1,
    explanation:
      "Lockout/tagout (LOTO) is always the first step before any maintenance work. It ensures all energy sources are de-energized and locked out, preventing accidental startup that could injure maintenance personnel.",
    difficulty: 1,
    category: "maintenance",
  },
  {
    question_text:
      "What is the most common indicator that a robot's harmonic drive reducer needs attention?",
    question_type: "multiple_choice",
    options: [
      "The robot's status light changes color",
      "Increased backlash and audible noise during movement",
      "The teach pendant displays a software update notification",
      "The robot takes longer to boot up",
    ],
    correct_answer: 1,
    explanation:
      "Worn harmonic drive reducers typically exhibit increased backlash (play in the joint) and produce unusual noise during movement. These are mechanical symptoms that indicate wear, not software or startup-related issues.",
    difficulty: 3,
    category: "maintenance",
  },
  {
    question_text:
      "How often should a robot's safety system be inspected according to best practices?",
    question_type: "multiple_choice",
    options: [
      "Only when a fault occurs",
      "Once per year during annual certification",
      "At regular intervals defined by a risk assessment and manufacturer guidelines",
      "Every time the robot is reprogrammed",
    ],
    correct_answer: 2,
    explanation:
      "Safety system inspections should be performed at regular intervals determined by the site-specific risk assessment and the manufacturer's maintenance schedule, not only when faults occur or at arbitrary intervals.",
    difficulty: 2,
    category: "maintenance",
  },
  {
    question_text:
      "What should be included in a daily robot inspection checklist?",
    question_type: "multiple_choice",
    options: [
      "Only checking the robot's software version",
      "Visual inspection of cables, connectors, and the work area; verifying safety devices; and testing emergency stops",
      "Running the robot through its full production cycle at maximum speed",
      "Updating the robot's firmware to the latest version",
    ],
    correct_answer: 1,
    explanation:
      "A daily inspection checklist should include visual checks of physical components (cables, connectors, work area cleanliness), verification that safety devices are functional, and testing of emergency stop systems.",
    difficulty: 2,
    category: "maintenance",
  },
  {
    question_text:
      "When should a robot operator escalate an issue to a certified technician?",
    question_type: "multiple_choice",
    options: [
      "Whenever the robot completes its daily cycle",
      "When a fault cannot be resolved by standard troubleshooting procedures or involves safety-critical components",
      "Only when the robot stops completely",
      "When the production target for the day has been met",
    ],
    correct_answer: 1,
    explanation:
      "Operators should escalate to certified technicians when standard troubleshooting fails to resolve an issue, or when the problem involves safety-critical systems. Waiting for a complete stop may allow a dangerous condition to persist.",
    difficulty: 2,
    category: "maintenance",
  },

  // ── Regulations (5) ────────────────────────────────────────
  {
    question_text:
      "Which organization publishes the primary international standards for industrial robot safety?",
    question_type: "multiple_choice",
    options: [
      "OSHA (Occupational Safety and Health Administration)",
      "ISO (International Organization for Standardization)",
      "IEEE (Institute of Electrical and Electronics Engineers)",
      "NIST (National Institute of Standards and Technology)",
    ],
    correct_answer: 1,
    explanation:
      "ISO publishes the primary international standards for industrial robot safety, including ISO 10218-1/2 (robot safety) and ISO/TS 15066 (collaborative robots). While OSHA enforces workplace safety in the US, ISO sets the international standards.",
    difficulty: 2,
    category: "regulations",
  },
  {
    question_text:
      "What does the CE marking on a robot indicate?",
    question_type: "multiple_choice",
    options: [
      "The robot was manufactured in the European Union",
      "The robot conforms to EU health, safety, and environmental requirements",
      "The robot has passed a specific performance benchmark",
      "The robot is certified for use in clean room environments",
    ],
    correct_answer: 1,
    explanation:
      "The CE marking indicates that a product meets EU health, safety, and environmental requirements as defined by applicable European directives. It does not indicate country of origin or specific performance levels.",
    difficulty: 2,
    category: "regulations",
  },
  {
    question_text:
      "Under OSHA guidelines, who is responsible for ensuring robot safety in the workplace?",
    question_type: "multiple_choice",
    options: [
      "Only the robot manufacturer",
      "Only the robot operator",
      "The employer, with shared responsibility among integrators, operators, and manufacturers",
      "The government safety inspector assigned to the facility",
    ],
    correct_answer: 2,
    explanation:
      "Under OSHA guidelines, the employer bears primary responsibility for workplace safety, including robot safety. However, this is a shared responsibility involving robot manufacturers (design safety), integrators (installation safety), and operators (operational safety).",
    difficulty: 3,
    category: "regulations",
  },
  {
    question_text:
      "What is a 'risk assessment' in the context of robot deployment?",
    question_type: "multiple_choice",
    options: [
      "A financial analysis of the robot's return on investment",
      "A systematic process of identifying hazards, evaluating risks, and determining appropriate safeguards",
      "A performance test to determine the robot's maximum operating speed",
      "A survey of employee satisfaction with the new automation",
    ],
    correct_answer: 1,
    explanation:
      "A risk assessment is a systematic process required by ISO 12100 that involves identifying potential hazards, evaluating the severity and likelihood of associated risks, and determining appropriate risk reduction measures.",
    difficulty: 2,
    category: "regulations",
  },
  {
    question_text:
      "When a robot system is modified after its initial installation, what regulatory step is required?",
    question_type: "multiple_choice",
    options: [
      "No additional steps are required if the original certification is still valid",
      "A new risk assessment must be conducted to evaluate the impact of the modifications",
      "Only a software update log needs to be filed",
      "The robot must be returned to the manufacturer for re-certification",
    ],
    correct_answer: 1,
    explanation:
      "Any significant modification to a robot system requires a new risk assessment to evaluate whether the changes introduce new hazards or affect existing safeguards. The original certification may no longer cover the modified system.",
    difficulty: 3,
    category: "regulations",
  },
];
