import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "amr-vs-agv",
  title: "AMR vs. AGV — what actually differs and when each fits",
  description:
    "AGVs follow fixed guidance; AMRs localize against a map and plan paths dynamically. What that difference changes in practice, and when each approach fits.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Automated guided vehicles and autonomous mobile robots both move material through a facility without a driver, and vendor marketing has blurred the line between them so thoroughly that the terms are sometimes used interchangeably. They are not interchangeable. The difference is not age, price tier, or intelligence in the abstract — it is navigation, and everything else that matters in a purchasing decision follows from it.",
        "An AGV follows fixed guidance installed in or around the facility. An AMR carries a map of the facility, works out where it is on that map, and plans its own path to the destination. That single architectural difference determines what you install in the building, what happens when something blocks the path, how the fleet behaves in mixed traffic, and how much work it takes to change the system after it goes live. If you understand the navigation difference, you can predict how each vehicle class will behave in your operation before a vendor demo ever runs.",
      ],
    },
    {
      heading: "How AGVs navigate",
      paragraphs: [
        "An AGV senses guidance infrastructure and steers to stay on it. The guidance takes several physical forms: magnetic tape adhered to the floor, wire embedded in a cut channel beneath the surface, grids of QR codes or fiducial markers the vehicle reads from above or below, or wall-mounted reflectors that a laser scanner triangulates against. Whatever the medium, the principle is the same — the path is defined in the facility, not in the vehicle, and the vehicle's job is to follow it.",
        "The result is deterministic motion. An AGV runs the same route the same way every cycle. If an obstacle appears on the guide path, the vehicle stops and waits for the path to clear; it does not go around, because there is no path to go around on. That behavior sounds like a limitation, and in dynamic environments it is, but determinism is also a genuine engineering property: the vehicle's position on its route is precisely known and precisely repeatable, which matters when the vehicle must dock against a conveyor, a machine, or a transfer station within tight tolerances, cycle after cycle.",
      ],
    },
    {
      heading: "How AMRs navigate",
      paragraphs: [
        "An AMR builds or is given a map of the facility and then localizes against it continuously, typically using simultaneous localization and mapping techniques with LIDAR as the primary sensor, often fused with wheel odometry, inertial measurement, and cameras. The map lives in software. Destinations are points on the map, and the robot plans a path to each destination itself, replanning on the fly when its sensors detect that the planned route is blocked.",
        "Because the path is computed rather than installed, an AMR treats an obstacle as a routing problem instead of a stop condition. A pallet dropped in an aisle, a forklift paused mid-lane, a group of people in conversation — the robot perceives the obstruction, plans around it if clearance allows, and continues. When the layout itself changes, the map is updated in software and the fleet adopts the new layout without anyone cutting the floor or re-laying tape. The trade against AGV determinism is that an AMR's exact trajectory on any given run is not guaranteed in advance; it is whatever the planner produced given the conditions of the moment.",
      ],
    },
    {
      heading: "What the navigation difference actually changes",
      paragraphs: [
        "Infrastructure is the first consequence. An AGV deployment involves physical installation — laying tape, embedding wire, mounting reflectors, or applying floor markers — and that infrastructure must be maintained, because damaged tape or an occluded reflector degrades the guidance itself. An AMR deployment shifts that work into commissioning software: driving or pushing the robot through the facility to build the map, annotating zones and destinations, and validating localization quality in areas with poor geometric features, such as long uniform corridors or wide open floors.",
        "Traffic behavior is the second consequence. AGV traffic is managed the way rail traffic is managed: the paths are fixed, so the control system deconflicts vehicles by controlling who enters which segment when. AMR traffic is negotiated dynamically, with vehicles yielding, rerouting, and queueing according to fleet software policy. Each model has failure modes. A blocked AGV path can stall a whole loop until someone clears it. A fleet of AMRs in a congested zone can produce emergent behavior — mutual yielding, oscillating reroutes — that takes tuning to resolve.",
        "Change tolerance is the third. If your process changes seasonally, if racking moves, if new cells come online, an AMR fleet absorbs those changes as map edits. An AGV system absorbs them as an infrastructure project. Neither is wrong; they are priced-in properties of the architecture, and the right question is how often your facility actually changes.",
      ],
    },
    {
      heading: "When AGV determinism genuinely wins",
      paragraphs: [
        "Fixed, high-volume, point-to-point flows are the AGV home ground. If material moves from the same origin to the same destination all day, every day, along a route that never needs to change, then dynamic path planning solves a problem you do not have — and determinism buys you things you do want. Precise, repeatable docking against process equipment is easier to engineer when the approach path is identical every cycle. Throughput is easier to model when travel time has no variance from rerouting. Tight process coupling, where the vehicle is effectively a moving link in a production line and the line's takt depends on it, favors the architecture whose behavior is fully predictable.",
        "AGVs also carry well at the heavy end. Guided platforms are a long-established way to move very heavy unit loads — coils, dies, large assemblies — where the certainty of a fixed path and a controlled right-of-way is a safety and engineering asset rather than a constraint.",
      ],
    },
    {
      heading: "When AMR flexibility wins",
      paragraphs: [
        "Dynamic environments are the AMR home ground. Facilities where people, forklifts, and robots share aisles; operations where pick faces, staging areas, and workflows shift; sites where the material flow of next quarter will not match the material flow of this one. In those settings, the ability to reroute around obstructions keeps the fleet productive through the ordinary chaos of a working building, and the ability to change the layout in software keeps the system aligned with the operation instead of the operation bending around the system.",
        "AMRs also fit incremental adoption. Because there is no guidance infrastructure to install, a deployment can start with a small number of robots on a limited workflow and expand by adding vehicles and map coverage. That matters for organizations that want to validate the operational fit before committing a full flow to automation.",
      ],
    },
    {
      heading: "Fleet software and interoperability",
      paragraphs: [
        "Whichever architecture you choose, the vehicles are only half the system. Fleet management software assigns jobs, manages traffic, monitors battery and charging, and integrates with the warehouse management system that decides what needs to move in the first place. Evaluate it with the same seriousness as the hardware: how jobs are prioritized, how the system behaves when a vehicle faults mid-task, how zones and traffic rules are configured, and what the integration path into your WMS or execution system looks like.",
        "Interoperability deserves a direct question in any evaluation. A facility that buys vehicles from more than one manufacturer — or expects it might — faces the problem of multiple fleet managers competing for the same aisles. VDA 5050, an interface standard published by the Verband der Automobilindustrie, defines a communication interface between a master control system and AGV and AMR fleets, and vendor support for it is worth confirming in writing rather than assuming. A standard interface does not make heterogeneous fleets effortless, but it is the difference between an integration project and a lock-in.",
      ],
    },
  ],
  faq: [
    {
      q: "Is an AMR just a newer, better AGV?",
      a: "No. They are different navigation architectures with different properties. An AGV's fixed guidance delivers deterministic, precisely repeatable routes, which is genuinely preferable for fixed high-volume flows with tight docking tolerances. An AMR's map-based navigation delivers rerouting and layout flexibility, which is preferable in dynamic, changing environments. Neither is a strict upgrade over the other.",
    },
    {
      q: "What happens when something blocks the path?",
      a: "An AGV stops and waits for the guide path to clear, because it has no way to leave the path. An AMR perceives the obstruction and plans around it if there is clearance, continuing to the destination on an alternate route. In narrow aisles with no alternate route, both vehicle classes end up waiting.",
    },
    {
      q: "Can AGVs and AMRs run in the same facility?",
      a: "They can, but coordination between separate fleet control systems is the hard part, since each system needs awareness of the other's vehicles in shared zones. VDA 5050 exists as a standard interface between a master control system and mixed fleets, and asking vendors about their support for it is a reasonable early diligence step.",
    },
    {
      q: "Does an AMR need any facility infrastructure at all?",
      a: "Less than an AGV, but rarely none. AMRs need charging stations, and many deployments add markers or reflectors in specific areas to sharpen docking precision, plus network coverage for fleet communication. What they avoid is continuous guidance infrastructure along every route.",
    },
  ],
  citations: [
    {
      source: "VDA 5050, Verband der Automobilindustrie",
      year: "2022",
      note: "Interface standard for communication between a master control system and AGV/AMR fleets.",
    },
  ],
  glossaryLinks: [
    "amr",
    "agv",
    "slam",
    "fleet-management",
    "wms",
  ],
  nextStep: {
    label: "Browse warehouse robots",
    href: "/explore/warehouse",
    blurb: "Compare AMRs and AGVs by payload, navigation approach, and fleet software in the warehouse category.",
  },
};
