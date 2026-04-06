/**
 * Robotics Autonomy Framework (L0-L5)
 * Inspired by SAE driving automation levels, adapted for all robot types.
 * Used throughout the RCO curriculum and exam questions.
 */

export interface AutonomyLevel {
  level: number;
  name: string;
  shortName: string;
  description: string;
  humanRole: string;
  robotCapability: string;
  failureMode: string;
  examples: string[];
  operatorSkillRequired: string;
  rcoLevelRequired: string;
}

export const AUTONOMY_LEVELS: AutonomyLevel[] = [
  {
    level: 0,
    name: "No Autonomy",
    shortName: "L0 — Teleoperated",
    description:
      "Robot has zero autonomous capability. Every movement is directly controlled by a human operator in real-time. The robot is a remote extension of the operator's body.",
    humanRole: "Full control — operator commands every action",
    robotCapability: "Execute human commands only",
    failureMode: "Operator error, communication latency, fatigue",
    examples: [
      "Bomb disposal robots (manual control)",
      "Surgical robots in master-slave mode",
      "Remote inspection robots in hazardous areas",
      "Deep sea ROVs (non-autonomous)",
    ],
    operatorSkillRequired: "Joystick/teleop proficiency, spatial awareness",
    rcoLevelRequired: "Foundation",
  },
  {
    level: 1,
    name: "Assisted Autonomy",
    shortName: "L1 — Assisted",
    description:
      "Robot handles one specific sub-task autonomously (e.g., obstacle avoidance) while human controls primary movement. Human is always engaged and in the loop.",
    humanRole: "Primary control with robot assistance",
    robotCapability: "Single autonomous function (e.g., collision avoidance, force limiting)",
    failureMode: "Over-reliance on assistance, complacency, assistance failure during manual override",
    examples: [
      "Cobots with force-limiting (human guides, robot limits force)",
      "AMRs with manual override + obstacle avoidance",
      "Drones with altitude hold (pilot controls direction)",
      "Surgical robots with tremor filtering",
    ],
    operatorSkillRequired: "Understanding of assistance limits, when to override",
    rcoLevelRequired: "Foundation",
  },
  {
    level: 2,
    name: "Partial Autonomy",
    shortName: "L2 — Partial",
    description:
      "Robot executes defined, pre-programmed tasks autonomously within controlled conditions. Human monitors and handles exceptions. Robot cannot handle novel situations.",
    humanRole: "Monitor, intervene on exceptions, handle edge cases",
    robotCapability: "Execute programmed tasks in known environments",
    failureMode: "Novel situation the robot wasn't programmed for, environmental change, edge cases",
    examples: [
      "Industrial arms running programmed weld paths",
      "AMRs following mapped routes in warehouses",
      "Pick-and-place robots with defined objects",
      "Cleaning robots on scheduled routes",
    ],
    operatorSkillRequired: "Fault diagnosis, exception handling, reprogramming basics",
    rcoLevelRequired: "Foundation+",
  },
  {
    level: 3,
    name: "Conditional Autonomy",
    shortName: "L3 — Conditional",
    description:
      "Robot handles most standard situations autonomously including many exceptions. Human is the fallback for complex or safety-critical decisions. Robot knows when to ask for help.",
    humanRole: "Handle complex exceptions, approve safety-critical actions, strategic oversight",
    robotCapability: "Autonomous operation in standard + many non-standard situations, self-diagnosis, help-seeking",
    failureMode: "Failure to recognize when it's out of depth, delay in human takeover, incorrect help request",
    examples: [
      "AMR fleets with dynamic obstacle handling",
      "Cobots adapting to part variation",
      "VLA-powered robots handling novel objects",
      "Delivery robots in semi-structured environments",
    ],
    operatorSkillRequired: "AI behavior monitoring, intervention timing, constraint design",
    rcoLevelRequired: "Specialist",
  },
  {
    level: 4,
    name: "High Autonomy",
    shortName: "L4 — High",
    description:
      "Robot handles all situations in its operational domain autonomously, including novel ones. Human oversight is strategic, not operational. Robot can safely stop if it encounters something truly unprecedented.",
    humanRole: "Strategic oversight, policy setting, performance review, edge case training",
    robotCapability: "Full autonomous operation in defined domain, novel situation handling, safe fallback behavior",
    failureMode: "Domain boundary violation, adversarial conditions, model drift over time, goal misalignment",
    examples: [
      "Fully autonomous warehouse fleets (Locus, 6 River at scale)",
      "Humanoid robots performing multi-step tasks autonomously",
      "Agricultural robots adapting to weather and crop conditions",
      "Autonomous inspection drones in complex facilities",
    ],
    operatorSkillRequired: "Fleet architecture, AI governance, performance analytics, agentic system management",
    rcoLevelRequired: "Master",
  },
  {
    level: 5,
    name: "Full Autonomy",
    shortName: "L5 — Full",
    description:
      "Robot operates in any environment, handles any situation, and makes decisions indistinguishable from or exceeding human capability. No human operational oversight required. Human role is purely strategic/ethical.",
    humanRole: "Ethical oversight, goal setting, accountability. No operational role.",
    robotCapability: "General-purpose autonomous operation in any environment and situation",
    failureMode: "Goal misalignment, emergent behavior, security compromise, philosophical/ethical failures",
    examples: [
      "General-purpose humanoid robots (future)",
      "Self-replicating manufacturing systems (future)",
      "Autonomous space exploration robots (partial)",
      "AGI-powered robotic systems (theoretical)",
    ],
    operatorSkillRequired: "AI governance, ethics, policy design, audit. Traditional 'operation' skills become less relevant.",
    rcoLevelRequired: "Fleet Commander",
  },
];

/**
 * Get the autonomy level for a given numeric level
 */
export function getAutonomyLevel(level: number): AutonomyLevel | undefined {
  return AUTONOMY_LEVELS.find((l) => l.level === level);
}

/**
 * Get autonomy levels that require a given RCO certification
 */
export function getAutonomyLevelsByRCO(rcoLevel: string): AutonomyLevel[] {
  return AUTONOMY_LEVELS.filter((l) => l.rcoLevelRequired === rcoLevel);
}
