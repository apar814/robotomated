import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "what-is-a-cobot",
  title: "What is a collaborative robot and when is it genuinely safe?",
  description:
    "Cobots are built for shared workspaces, but collaborative describes the application, not the robot. What ISO 10218-2 requires and why risk assessment decides.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "A collaborative robot, or cobot, is a robot designed with inherent safety features — force sensing, rounded housings, limited speed and power modes, back-drivable or compliant joints — so that it can share a workspace with people rather than operating behind a fence. That design intent is real and it has changed what small manufacturers can automate: tasks that could never justify the floor space and integration cost of a caged industrial cell become feasible when the robot can stand at a bench next to the person it assists.",
        "But the single most important thing to understand about cobots is a nuance the marketing routinely omits: collaborative describes the application, not the robot. A robot arm sold as collaborative is not automatically safe next to people. Bolt a sharp deburring tool or a heavy gripper to a force-limited arm and the assembled system may absolutely require guarding, no matter what the arm's brochure says. Whether an application is genuinely collaborative is decided by a risk assessment of the complete system — robot, end effector, workpiece, layout, and task — not by the logo on the robot.",
      ],
    },
    {
      heading: "Collaboration is a property of the application",
      paragraphs: [
        "The relevant safety framework is ISO 10218-2:2025, the standard for robot applications and integration, which in its current edition incorporates the collaborative-operation requirements that previously lived in the technical specification ISO/TS 15066. The framework's structure makes the point by itself: the requirements attach to the application. The integrator assesses the hazards of the whole system in its actual context and then selects protective measures adequate to those hazards.",
        "This is why the same robot arm can be fenceless in one cell and guarded in the next. An arm tending a bench with a soft gripper and a light plastic part presents one hazard picture. The identical arm swinging a machined steel casting past head height presents another. The workpiece, the tool, the fixtures, the reach envelope relative to where people stand, the pinch points against nearby equipment — all of it enters the risk assessment, and the risk assessment, not the product category, determines what safeguarding the application needs. A buyer who internalizes this reads vendor claims correctly: a collaborative robot is a robot with features that make collaborative applications achievable, provided the rest of the system cooperates.",
      ],
    },
    {
      heading: "The four collaborative methods",
      paragraphs: [
        "The standard defines four methods by which a robot and a person can share space, and understanding them clarifies what any given cobot cell is actually doing. The first is safety-rated monitored stop: the robot halts, in a safety-rated way, whenever a person enters the collaborative workspace, and resumes when they leave. The robot and person are never in motion in the shared space at the same time. This is the simplest method and is common where a person only occasionally enters the space — to load a part, inspect, or clear a fault.",
        "The second is hand guiding: the operator moves the robot directly, by hand, through a guiding device, with the robot's motion under the operator's continuous control. It is used for teaching paths and for applications where the robot acts as a power-assist device under human direction.",
        "The third is speed and separation monitoring: the robot and person move in the shared space simultaneously, and the system continuously monitors the distance between them, slowing the robot as the person approaches and stopping it before contact can occur. This method depends on safety-rated sensing — laser scanners, vision systems — and its practical throughput depends on how the cell layout manages the approach distances.",
        "The fourth is power and force limiting: the robot is designed so that if contact with a person does occur, the energy transferred stays below thresholds that the standard associates with different regions of the body. This is the method people usually picture when they say cobot, because it is the one where incidental contact is part of the design basis rather than a failure.",
      ],
    },
    {
      heading: "What power and force limiting actually promises",
      paragraphs: [
        "Power and force limiting does not promise that the robot never touches anyone. It promises that contact events remain within limits the standard defines by body region — the framework recognizes that the same contact acceptable on a forearm is not acceptable near the face, and quasi-static contact, where a body part could be clamped between the robot and a surface, is treated differently from transient contact, where the body part is free to move away.",
        "In practice, verifying a PFL application means measuring the forces and pressures the assembled system can actually produce at its contact points, with the real tool and the real workpiece, and comparing them against the body-region limits. Speed reductions, padding, geometry changes to eliminate clamping points, and tool selection are the levers integrators pull to get a cell under the limits. The measurement is of the application, which is the theme of this whole subject: the arm's data sheet cannot contain the answer, because the arm alone is not the system.",
      ],
    },
    {
      heading: "Where cobots genuinely fit",
      paragraphs: [
        "Cobots earn their place in applications that pair human judgment with robotic patience. Machine tending is the canonical case: the robot loads and unloads a CNC machine or press through the repetitive hours, while people handle changeovers, inspection, and exceptions, moving freely around the cell. Assembly assistance is another — the robot presents parts, drives screws, dispenses adhesive, or holds a workpiece steady while a person performs the steps that still need human dexterity. Light palletizing, quality inspection with a camera on the arm, gluing and dispensing, and lab automation all fit the same pattern: moderate payloads, moderate speeds, and real value in having people work near the robot without a fence in the way.",
        "Cobots also lower the integration barrier in ways that matter to smaller operations. Hand guiding and simplified programming interfaces let process experts, rather than robotics engineers, teach and adjust tasks, and the compact footprint suits facilities where floor space is committed.",
      ],
    },
    {
      heading: "The honest limits",
      paragraphs: [
        "The same design choices that make a cobot suitable for shared workspaces cost performance. Force-limited operation means restrained speeds and accelerations, so cycle times are longer than a conventional industrial arm would achieve on the same task. Payload capacities sit at the light end of the industrial range, and the payload budget must cover the end effector as well as the workpiece, which disqualifies more applications than buyers expect. A cobot running behind a fence at full speed to chase cycle time is spending its collaborative premium on nothing.",
        "The honest comparison, then, is not cobot versus industrial arm in the abstract but application by application: if the task is high-speed, high-payload, and people never need to be near it, a conventional industrial robot in a guarded cell is usually the better tool. If the task benefits from people and the robot sharing space, and the cycle time works at collaborative speeds, the cobot is not a compromise — it is the correct architecture. Either way, the risk assessment is where the decision becomes real, and budgeting time for it is part of buying the robot.",
      ],
    },
  ],
  faq: [
    {
      q: "Can any cobot work safely next to people without fencing?",
      a: "No. The application decides, per the risk assessment required by ISO 10218-2:2025. A force-limited arm fitted with a sharp tool, a heavy gripper, or a hazardous workpiece may still require safeguarding. Fenceless operation is a conclusion the risk assessment can reach, never a property the robot arrives with.",
    },
    {
      q: "What are the four collaborative methods?",
      a: "Safety-rated monitored stop, hand guiding, speed and separation monitoring, and power and force limiting. They were described in ISO/TS 15066 and are now incorporated into ISO 10218-2:2025. A single cell can use different methods in different phases of its cycle.",
    },
    {
      q: "Does power and force limiting mean the robot never makes contact?",
      a: "No. It means the system is designed and verified so that if contact occurs, forces and pressures stay within limits the standard associates with different body regions, treating transient and quasi-static (clamping) contact differently. Verification measures the assembled application with its real tool and workpiece.",
    },
    {
      q: "Who is responsible for the risk assessment?",
      a: "The integrator of the application — which, in a small operation deploying a cobot itself, may effectively be the buyer. The robot manufacturer supplies a robot with safety functions and data; the party assembling robot, tool, workpiece, and layout into a working cell is responsible for assessing that system and implementing adequate protective measures.",
    },
  ],
  citations: [
    {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
      note: "Safety requirements for robot applications and integration; incorporates collaborative-operation requirements formerly in ISO/TS 15066.",
    },
    {
      source: "ISO/TS 15066:2016, International Organization for Standardization",
      year: "2016",
      note: "Technical specification for collaborative robot operation, including body-region force and pressure limits for power and force limiting.",
    },
  ],
  glossaryLinks: [
    "cobot",
    "iso-10218",
    "iso-ts-15066",
    "safety-rated-monitored-stop",
    "hand-guiding",
    "speed-and-separation-monitoring",
    "power-and-force-limiting",
    "risk-assessment",
    "safeguarded-space",
    "collaborative-workspace",
    "end-effector",
    "payload",
  ],
  nextStep: {
    label: "Browse manufacturing robots",
    href: "/explore/manufacturing",
    blurb: "Compare collaborative and industrial arms by payload, reach, and safety functions in the manufacturing category.",
  },
};
