import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "robot-deployment-week-by-week",
  title: "What happens during a robot deployment, week by week",
  description:
    "A phase-by-phase walkthrough of a robot deployment: site assessment, design, installation, safety validation, integration, trial runs, training, and handover.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Every robot deployment follows roughly the same arc, but no two follow the same calendar. How long each phase takes depends on the application, the facility, the vendor, and how much of the hard thinking was done before anything shipped, so treat the week framing here as a structure, not a schedule. What is consistent is the sequence of work and the way phases overlap: design continues into installation, safety validation loops back into programming, and training starts before the ramp finishes. A buyer who knows the shape of the arc can tell a deployment that is iterating normally from one that is drifting, and can ask the right question at each stage instead of the generic one.",
        "The other thing worth saying up front is that the robot is usually the most reliable actor in the story. Deployments are rarely derailed by the machine. They are derailed by floors, Wi-Fi, product variation, and assumptions nobody wrote down. The phases below exist largely to surface those things early, while they are still cheap to fix.",
      ],
    },
    {
      heading: "Before anything ships: the site assessment",
      paragraphs: [
        "The first real work happens with a tape measure and a laptop, not a robot. The vendor or integrator walks the facility and examines the things robots depend on and brochures never mention. The floor: its flatness, its surface condition, expansion joints, ramps, and dock plates, all of which matter to mobile robots, and its load capacity and anchoring suitability, which matter to fixed ones. Power: available circuits, panel capacity, and where charging stations or cell disconnects can physically live. The network: for anything mobile or fleet-managed, Wi-Fi coverage is walked and measured aisle by aisle, because a map of dead zones now is far cheaper than a robot that pauses mysteriously in the same corner later.",
        "Just as important is watching the operation itself run. Traffic patterns of people and forklifts, congestion at shift change, where pallets actually get staged as opposed to where the CAD drawing says they do. A good assessment also collects data: part dimensions and weights, order profiles, throughput by hour, exception rates. This becomes the factual basis for the design, and the quality of a deployment is set here more than anywhere else. Vagueness in this phase does not go away; it just gets rediscovered later, at higher cost.",
      ],
    },
    {
      heading: "Design, risk assessment, and facility prep",
      paragraphs: [
        "With real data in hand, the provider produces the solution design: cell layout or fleet routes, robot selection and count, tooling, safeguarding concept, and the interfaces to your WMS, PLCs, or line equipment. Expect drawings and simulations, and expect to review them seriously, because this is the last cheap moment to change your mind. In parallel comes the risk assessment, following the method of ISO 12100, which identifies the hazards of the specific application and drives the safeguarding design. For an integrated industrial cell this work is what the system will later be verified against under ISO 10218-2.",
        "While design is finalized, the facility gets ready. This is unglamorous and frequently underestimated: running power, repairing or coating floor sections, adding network access points where the survey found gaps, clearing and marking the deployment area, relocating racking, and scheduling the work around production. If your operation cannot stop, the plan must say explicitly how installation will coexist with daily throughput. Facility prep is usually the buyer's scope, which makes it the most common source of day-one delay — the integrator arrives on schedule and the concrete does not.",
      ],
    },
    {
      heading: "Installation and first motion",
      paragraphs: [
        "Then equipment arrives and the visible phase begins: uncrating, placing, anchoring, and cabling for fixed cells; assembling charging stations and staging robots for mobile fleets. Mechanical commissioning follows — powering up, verifying every axis and device moves and reads correctly, and confirming the machine matches its drawings. For AMRs this is also when mapping happens: the robots are driven or walked through the facility to build the map, often using SLAM, and the map is annotated with zones, speeds, and no-go areas.",
        "It is worth managing expectations inside your building during this phase. The robot will move early, and to onlookers it will appear nearly done. It is not. First motion is roughly the midpoint of a deployment, and the work that separates a demo from a production system — safety validation, integration, and tuning against real product — is still ahead. Teams that celebrate too early here often pressure the remaining phases into compression, which is exactly where corners get cut.",
      ],
    },
    {
      heading: "Safety configuration and validation",
      paragraphs: [
        "Before the system can run near people at production speed, the protective measures defined in the risk assessment are configured and then proven. Interlocks, light curtains, safety-rated speed and zone limits, emergency stops, and, for mobile robots, protective field configurations are each exercised and the results recorded: does the system actually stop, within the required distance and time, every time, from the conditions that matter? This is validation in the standards sense — evidence, not assurance.",
        "This phase produces surprises more often than buyers expect, and that is its job. A guard that turns out to be reachable around, a stop distance that forces a layout adjustment, a field configuration that halts the robot every time a forklift passes a rack end. Fixes at this stage loop back into programming and sometimes into layout, which is why the phases overlap rather than queue. Resist any suggestion to defer validation items in order to hold a go-live date; an unvalidated safety function is not a schedule risk, it is a hazard with a start date.",
      ],
    },
    {
      heading: "Programming, integration, and trial runs",
      paragraphs: [
        "Through the middle of the deployment, the system learns your actual work. Robot programs are built and refined against production parts, not samples. The integration with your WMS or PLC comes alive: orders flow down, confirmations flow back, and the error handling gets exercised — what happens when a tote is missing, a barcode will not read, a destination is full. Error paths are where integration effort actually goes; the happy path is usually working within days, and buyers should judge progress by how gracefully the system fails, not by how well it demos.",
        "Trial runs follow, deliberately at reduced rates: real product, real orders, real operators nearby, with engineers watching and adjusting. This is where product variation the design did not cover gets discovered — the seasonal carton size nobody mentioned, the shrink-wrapped pallet that confuses a sensor, the label position that varies by supplier. Finding these now is a success of the process, not a failure of the robot. Expect iteration loops between trial results, programming, and occasionally the risk assessment when a change touches safeguarding.",
      ],
    },
    {
      heading: "Training, ramp, and handover",
      paragraphs: [
        "In the later weeks, ownership starts transferring to your people, and this phase deserves more attention than it usually gets. Operators learn normal operation and, more importantly, exception recovery: how to clear a fault, recover a stopped robot, and restart safely, including lockout procedures where they apply. Maintenance staff learn preventive tasks and diagnostics. The strongest predictor of how a system performs after the experts leave is how much hands-on time your own staff logged before they left, so push for your people to run the system under supervision rather than watch it being run.",
        "Ramp to production is then a managed climb — more hours, more order types, more of the building — with performance watched against the design targets at each step, since problems that hide at trial rates surface at full ones. Finally comes handover: the documentation package including the risk assessment and safety validation records, program backups, drawings, manuals, and spares recommendations, plus an explicit support transition. Who do you call, what response is committed, how are software updates handled, and what is the cadence of post-launch reviews? A deployment is finished when your team runs the system through a normal week, exceptions included, without outside help — not when the robot first moves, and not when the invoice clears.",
      ],
    },
  ],
  faq: [
    {
      q: "How long does a robot deployment take?",
      a: "It depends on the application, the facility, and the amount of integration, and any provider quoting a duration before completing a site assessment is guessing. The more useful question is what the phases are, what evidence closes each one, and which parts of the schedule are in your control — facility prep and staff availability are usually the buyer-owned items on the critical path.",
    },
    {
      q: "What causes deployments to slip most often?",
      a: "Scope discovered late is the dominant pattern: floor or power issues found after the design was fixed, Wi-Fi gaps found after robots arrived, and product variation the design never covered. Safety validation surprises are the other recurring source. All of these are cheaper to find in assessment and trial phases, which is the argument for taking those phases seriously rather than compressing them.",
    },
    {
      q: "When should operator training happen?",
      a: "Before the ramp, not after go-live, and with hands-on exception recovery rather than a walkthrough. The system will be handed to your staff during the messiest part of its life — early production, when exceptions are most frequent — so their competence at recovery is part of the deployment, not an afterthought to it.",
    },
  ],
  citations: [
    {
      source: "ISO 12100:2010, International Organization for Standardization",
      year: "2010",
    },
    {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
  ],
  glossaryLinks: [
    "risk-assessment",
    "iso-10218",
    "iso-12100",
    "amr",
    "cobot",
    "wms",
    "fleet-management",
    "slam",
    "pilot-program",
    "uptime",
    "loto",
    "emergency-stop",
    "safeguarded-space",
    "systems-integrator",
  ],
  nextStep: {
    label: "Find robotics services",
    href: "/robowork",
    blurb:
      "Get matched with deployment and integration services that can run this process for your facility.",
  },
};
