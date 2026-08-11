import type { GlossaryTerm } from "../glossary-types";

export const ROBOT_TYPES_TECHNICAL_TERMS: GlossaryTerm[] = [
  // ---------------------------------------------------------------- robot-types
  {
    slug: "amr",
    term: "AMR (autonomous mobile robot)",
    definition:
      "A mobile robot that navigates a facility using onboard sensors and a software map rather than fixed physical guidance. AMRs plan their own routes, localize with lidar or camera-based SLAM, and reroute dynamically around people and obstacles. This distinguishes them from AGVs, which follow predefined guide paths and stop when the path is blocked.",
    related: ["agv", "slam", "fleet-management", "waypoint"],
    explore: [{ label: "Warehouse robots", href: "/explore/warehouse" }],
    group: "robot-types",
  },
  {
    slug: "agv",
    term: "AGV (automated guided vehicle)",
    definition:
      "A driverless vehicle that follows a fixed guidance system such as magnetic tape, embedded wire, floor-mounted QR markers, or reflector-based laser triangulation. AGVs travel repeatable routes and typically halt when an obstacle enters their path rather than replanning around it. They are common in material transport applications where routes are stable and throughput is predictable.",
    related: ["amr", "fleet-management", "waypoint"],
    explore: [
      { label: "Warehouse robots", href: "/explore/warehouse" },
      { label: "Manufacturing robots", href: "/explore/manufacturing" },
    ],
    group: "robot-types",
  },
  {
    slug: "cobot",
    term: "Cobot (collaborative robot)",
    definition:
      "An industrial robot designed for collaborative operation, in which the robot system and a human can share a workspace during production. Collaboration is achieved through safeguarding methods defined in ISO 10218 and ISO/TS 15066, including power and force limiting, speed and separation monitoring, safety-rated monitored stop, and hand guiding. The term describes the application and its safeguarding, not just the robot arm: the same arm can be collaborative in one cell and non-collaborative in another, depending on the risk assessment.",
    citation: {
      source: "ISO/TS 15066, International Organization for Standardization",
      year: "2016",
    },
    related: [
      "iso-ts-15066",
      "power-and-force-limiting",
      "speed-and-separation-monitoring",
      "collaborative-workspace",
    ],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "robot-types",
  },
  {
    slug: "scara",
    term: "SCARA robot",
    definition:
      "A Selective Compliance Assembly Robot Arm, an arm architecture with two rotary joints on parallel vertical axes plus a vertical linear axis, typically giving 4 degrees of freedom. The geometry is rigid in the vertical direction and compliant in the horizontal plane, which suits insertion and assembly tasks. SCARAs are widely used for planar pick-and-place, screwdriving, and small-part assembly where short cycle times matter more than full 3D orientation control.",
    related: ["delta-robot", "degrees-of-freedom", "repeatability"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "robot-types",
  },
  {
    slug: "delta-robot",
    term: "Delta robot",
    definition:
      "A parallel-kinematic robot in which three lightweight arms connect a fixed base to a common end platform. Because the motors stay on the base, the moving mass is low, which supports short-cycle picking and placing. Delta robots are usually mounted overhead above a conveyor and are common in food handling, packaging, and small-part sorting.",
    related: ["scara", "end-effector", "cycle-time"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "robot-types",
  },
  {
    slug: "gantry-robot",
    term: "Gantry robot",
    definition:
      "A Cartesian robot whose linear axes are carried on an overhead frame spanning the work area. The architecture scales to large work envelopes and heavy payloads because the structure, not the arm, carries the load. Gantry robots are typical in palletizing, machine tending, large-part handling, and additive or subtractive processes that need coverage of a large flat area.",
    related: ["payload", "reach", "end-effector"],
    explore: [
      { label: "Manufacturing robots", href: "/explore/manufacturing" },
      { label: "Warehouse robots", href: "/explore/warehouse" },
    ],
    group: "robot-types",
  },
  {
    slug: "humanoid-robot",
    term: "Humanoid robot",
    definition:
      "A robot with a human-like form factor, typically a bipedal lower body, an articulated torso, two arms, and hands or grippers. The design intent is to operate in environments and use tools built for people, at the cost of requiring whole-body balance control and many actuated joints. Current development effort concentrates on locomotion stability, dexterous manipulation, and learning-based control pipelines that are often trained in simulation before hardware deployment.",
    related: ["quadruped", "degrees-of-freedom", "sim-to-real"],
    explore: [{ label: "Humanoid robots", href: "/explore/humanoid" }],
    group: "robot-types",
  },
  {
    slug: "quadruped",
    term: "Quadruped robot",
    definition:
      "A four-legged mobile robot that uses legged locomotion to traverse stairs, rubble, and uneven terrain that wheeled platforms cannot cross. Quadrupeds typically carry sensor payloads such as cameras, lidar, or gas detectors and are deployed for inspection, site documentation, and patrol tasks. Balance and gait are handled by onboard control software, so operators command routes and waypoints rather than individual leg motions.",
    related: ["humanoid-robot", "slam", "payload", "waypoint"],
    explore: [
      { label: "Construction robots", href: "/explore/construction" },
      { label: "Security robots", href: "/explore/security" },
    ],
    group: "robot-types",
  },

  // ------------------------------------------------------------------ technical
  {
    slug: "slam",
    term: "SLAM",
    definition:
      "Simultaneous localization and mapping, a class of algorithms by which a robot builds a map of an unknown environment while estimating its own position within that map at the same time. Implementations fuse data from lidar, cameras, wheel odometry, and inertial sensors, and use loop closure to correct accumulated drift when the robot revisits a known area. SLAM is the core navigation capability that lets AMRs operate without fixed guidance infrastructure.",
    related: ["amr", "waypoint", "machine-vision"],
    explore: [{ label: "Warehouse robots", href: "/explore/warehouse" }],
    group: "technical",
  },
  {
    slug: "sim-to-real",
    term: "Sim-to-real",
    definition:
      "The practice of developing or training robot control policies in physics simulation and then transferring them to physical hardware. Because simulators imperfectly model friction, contact dynamics, sensor noise, and latency, transferred policies face a reality gap; techniques such as domain randomization and system identification are used to narrow it. The approach is central to learning-based control for legged robots and manipulation, where collecting equivalent training data on hardware would be slow or damaging.",
    related: ["digital-twin", "humanoid-robot", "machine-vision"],
    explore: [{ label: "Humanoid robots", href: "/explore/humanoid" }],
    group: "technical",
  },
  {
    slug: "end-effector",
    term: "End effector",
    definition:
      "The device mounted at the mechanical interface of a robot arm that performs the task: a gripper, vacuum cup array, welding torch, screwdriver, dispensing head, or sensor package. The end effector's mass counts against the robot's rated payload, and its geometry shifts the tool center point used in programming. Selecting and integrating the end effector is often a larger engineering effort than selecting the arm itself.",
    citation: {
      source: "ISO 8373, International Organization for Standardization",
      year: "2021",
    },
    related: ["payload", "force-torque-sensor", "reach"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "payload",
    term: "Payload",
    definition:
      "The maximum mass a robot can carry at its mechanical interface while meeting its rated performance, including the mass of the end effector and any part being handled. Usable payload falls as the load's center of gravity moves away from the mounting flange, so manufacturers publish payload alongside moment and inertia limits. Specifying payload requires accounting for the heaviest combined tool-plus-part case, not the average one.",
    related: ["end-effector", "reach", "gantry-robot"],
    explore: [
      { label: "Manufacturing robots", href: "/explore/manufacturing" },
      { label: "Warehouse robots", href: "/explore/warehouse" },
    ],
    group: "technical",
  },
  {
    slug: "reach",
    term: "Reach",
    definition:
      "The maximum distance a robot arm can extend from its base axis to its wrist center or tool flange, which bounds the working envelope. Published reach describes the horizontal extreme; the usable workspace is a three-dimensional volume with dead zones close to the base and near full extension. Cell layout must place parts, fixtures, and tools inside the envelope at orientations the wrist can actually achieve.",
    related: ["payload", "degrees-of-freedom", "gantry-robot"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "repeatability",
    term: "Repeatability",
    definition:
      "The closeness of agreement between the positions a robot actually attains when commanded to the same pose repeatedly under the same conditions. It is the specification that matters for taught-position work such as assembly and machine tending, because the robot returns to the same physical point even if that point differs slightly from the programmed coordinates. Test conditions and the calculation method for pose repeatability are defined in ISO 9283.",
    citation: {
      source: "ISO 9283, International Organization for Standardization",
      year: "1998",
    },
    related: ["accuracy", "scara", "teach-pendant"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "accuracy",
    term: "Accuracy (robot)",
    definition:
      "The closeness of agreement between a commanded pose and the mean of the poses the robot actually attains when approaching from the same direction. Accuracy is typically worse than repeatability because it absorbs kinematic model errors, joint compliance, and thermal effects, and it matters most for offline-programmed paths where positions come from CAD rather than teaching. Measurement conditions for pose accuracy are defined in ISO 9283.",
    citation: {
      source: "ISO 9283, International Organization for Standardization",
      year: "1998",
    },
    related: ["repeatability", "waypoint", "machine-vision"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "degrees-of-freedom",
    term: "Degrees of freedom (DOF)",
    definition:
      "The number of independent motion variables a mechanism has, which for serial robot arms usually equals the number of actuated joints. Positioning and orienting a tool arbitrarily in space requires 6 degrees of freedom; a 7-axis arm is kinematically redundant, letting it reach the same tool pose with different elbow positions to avoid obstacles. Legged and humanoid platforms carry far higher joint counts because each limb contributes several actuated axes.",
    citation: {
      source: "ISO 8373, International Organization for Standardization",
      year: "2021",
    },
    related: ["reach", "scara", "humanoid-robot"],
    explore: [
      { label: "Manufacturing robots", href: "/explore/manufacturing" },
      { label: "Humanoid robots", href: "/explore/humanoid" },
    ],
    group: "technical",
  },
  {
    slug: "teach-pendant",
    term: "Teach pendant",
    definition:
      "A handheld control unit used to jog a robot, record waypoints, edit programs, and monitor status from inside or near the cell. Pendants for industrial robots include an emergency stop and a three-position enabling device that must be held in the center position for motion to be permitted in manual mode. Some collaborative arms supplement or replace pendant jogging with hand guiding, where the operator physically moves the arm to teach positions.",
    related: ["waypoint", "enabling-device", "emergency-stop", "hand-guiding"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "waypoint",
    term: "Waypoint",
    definition:
      "A stored pose or map position that a robot moves through as part of a programmed path. For arms, waypoints capture joint angles or Cartesian poses taught with a pendant or generated offline; for mobile robots and drones, they are coordinates on a navigation map or route. Controllers typically blend motion through intermediate waypoints rather than stopping at each one, trading exact transit through the point for smoother, faster paths.",
    related: ["teach-pendant", "slam", "accuracy"],
    explore: [
      { label: "Warehouse robots", href: "/explore/warehouse" },
      { label: "Drones", href: "/explore/drone" },
    ],
    group: "technical",
  },
  {
    slug: "digital-twin",
    term: "Digital twin",
    definition:
      "A virtual model of a physical robot, cell, or facility that is kept synchronized with data from the real system. In robotics it supports offline programming, virtual commissioning of cells before hardware arrives, cycle validation, and what-if analysis of layout or sequencing changes without stopping production. A digital twin differs from a plain simulation in that it is tied to a specific physical asset and updated from its operational data.",
    related: ["sim-to-real", "cycle-time", "oee"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "force-torque-sensor",
    term: "Force/torque sensor",
    definition:
      "A transducer, usually mounted between the robot wrist and the end effector, that measures the forces and torques acting on the tool, commonly along three force and three torque axes. The signal enables compliant behaviors such as guarded insertion, surface finishing with controlled contact force, part-presence verification, and hand guiding. Some arms integrate joint torque sensing instead of or in addition to a wrist sensor to achieve similar contact-aware control.",
    related: ["end-effector", "cobot", "hand-guiding"],
    explore: [{ label: "Manufacturing robots", href: "/explore/manufacturing" }],
    group: "technical",
  },
  {
    slug: "machine-vision",
    term: "Machine vision",
    definition:
      "The use of cameras and image processing to give robots information about parts and surroundings, covering guidance, inspection, identification, and measurement. Two-dimensional vision locates and verifies parts in a plane, while 3D vision from stereo, structured light, or time-of-flight sensors supports bin picking and depalletizing of unordered items. Vision shifts a cell's requirement from precise part fixturing to reliable imaging, which changes where the engineering effort goes.",
    related: ["end-effector", "slam", "accuracy"],
    explore: [
      { label: "Manufacturing robots", href: "/explore/manufacturing" },
      { label: "Agricultural robots", href: "/explore/agricultural" },
    ],
    group: "technical",
  },
  {
    slug: "fleet-management",
    term: "Fleet management (robotics)",
    definition:
      "Software that coordinates multiple mobile robots operating in the same facility: allocating tasks, managing traffic at intersections and narrow aisles, scheduling charging, and interfacing with warehouse or manufacturing execution systems. Fleet managers may be vendor-specific or vendor-neutral; mixed fleets raise interoperability questions that interface standards for AMR traffic coordination aim to address. Fleet-level throughput depends as much on this coordination layer as on the individual robots.",
    related: ["amr", "agv", "wms"],
    explore: [
      { label: "Warehouse robots", href: "/explore/warehouse" },
      { label: "Delivery robots", href: "/explore/delivery" },
    ],
    group: "technical",
  },
];
