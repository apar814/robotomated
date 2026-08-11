import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "robot-maintenance-guide",
  title: "Robot maintenance — what wears, what fails, and how upkeep works",
  description:
    "What physically wears on industrial and mobile robots, how preventive maintenance works, what service contracts cover, and why LOTO governs every intervention.",
  readTime: 8,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Robots are marketed on what they do when running, and bought with surprisingly little attention to what keeps them running. A robot is a collection of mechanical and electrical subsystems that wear at different rates and in different ways — and a maintenance program is an organized answer to which subsystems you will attend to before they fail, and which you will let surprise you.",
        "This guide covers what actually wears on industrial arms and mobile robots, preventive versus corrective maintenance, what a service contract does and does not buy you, and the regulatory frame — lockout/tagout — that governs every hands-on intervention. The goal is not to turn you into a technician; it is to let you read a vendor's maintenance schedule and service quote and understand what you are agreeing to.",
      ],
    },
    {
      heading: "What actually wears on a robot",
      paragraphs: [
        "Start with the drivetrain. Every joint on an articulated arm runs through a reducer — a precision gearbox that converts fast motor rotation into slow, high-torque joint motion. Reducers are the classic long-term wear item: as their internal gearing wears, backlash grows, showing up first as degraded repeatability and path accuracy and eventually as measurable play in the joint. Reducer replacement is a significant service event, which is why maintenance programs monitor for early signs rather than waiting for failure.",
        "Cables and dress packs wear differently. The bundled power, signal, and utility lines along a robot arm flex through every cycle, and flex fatigue is cumulative: conductors work-harden and crack, insulation abrades, and intermittent faults appear long before a clean break — faults that are maddening to diagnose because they come and go with arm position. Dress pack inspection is a standard line item on any preventive visit.",
        "The end of the arm carries the highest-turnover consumables. Gripper fingers wear at their contact surfaces and lose grip geometry; suction cups harden, crack, and lose seal; vacuum filters clog with dust and product debris, quietly degrading pick reliability. These parts are cheap relative to the robot and are meant to be replaced on a schedule — consumables, not repairs.",
        "Mobile robots add their own wear list. Batteries fade: usable capacity declines with charge cycles, showing up as shorter runtime and more frequent charging until packs need replacement. Charging contacts wear and oxidize with every docking event. Wheels and casters wear against the floor, pick up debris, and lose traction or develop flat spots, affecting odometry as well as ride. And sensor lenses and covers accumulate dust, film, and scratches; a contaminated lidar window or camera lens degrades perception gradually, which is more dangerous than failing outright because the robot keeps working, just worse.",
        "Finally, brakes. Joint brakes on arms and drive brakes on mobile platforms hold position on power loss and stop motion on demand. They are safety-relevant, their function is tested rather than assumed, and brake checks belong on every preventive schedule.",
      ],
    },
    {
      heading: "Preventive versus corrective maintenance",
      paragraphs: [
        "Corrective maintenance is what happens after something breaks: diagnose, repair, return to service. Preventive maintenance is scheduled work performed while the machine is still healthy — inspection, lubrication, adjustment, and replacement of wear parts on a calendar or usage interval. The economic argument for prevention is that planned downtime is cheap compared to unplanned downtime, and that a wear part replaced on schedule costs far less than the secondary damage it causes when it fails in service.",
        "A typical preventive visit on an industrial robot covers a predictable checklist: visual inspection of the arm, dress pack, and connections; checking and replenishing reducer lubrication; verifying backlash and repeatability against specification; testing brakes, emergency stops, and protective stops; replacing end-effector consumables; checking controller cooling, fans, and filters; backing up programs and configuration; and reviewing the fault log for patterns. On mobile fleets, add battery health assessment, charging contact inspection, wheel and caster replacement, and sensor cleaning and calibration checks.",
        "The right interval depends on duty cycle, payload, speed, and environment: a robot running three shifts at high payload in a dusty facility ages faster than the same model on one shift in a clean room. Vendors publish baseline schedules; mature programs adjust them based on observed condition and logged usage rather than following the calendar blindly.",
      ],
    },
    {
      heading: "Service contracts, SLAs, and the spare-parts question",
      paragraphs: [
        "Most manufacturers and many integrators sell maintenance as a contract: a recurring fee covering scheduled preventive visits and, depending on tier, some or all corrective work. The variables that matter are scope — what is included, what is billed separately, whether parts are covered — and response time. Read the service-level agreement closely: response time is when someone engages with the problem, not when it is resolved, and remote diagnosis often counts as response. If the robot is on a production-critical path, the gap between a phone call and a technician on site with the right part determines how long you are down.",
        "That leads directly to spare-parts strategy. For every deployed robot, someone has decided — deliberately or by default — which parts sit on a shelf nearby and which get ordered when needed. The sensible approach is to stratify: keep high-turnover consumables and known failure-prone items on site, rely on the vendor's regional stock for mid-tier components, and accept factory lead times only for major assemblies whose failure is rare. The worst outcome is discovering a long lead time on a critical component while the line is stopped, so ask for lead times on major assemblies before you buy.",
        "There is also a competence question: can your own technicians do this work? The honest answer is that it depends on training, warranty terms, and the type of work. Routine tasks — consumable replacement, cleaning, inspection, backups — are commonly handled in-house after basic training. Deeper work such as reducer replacement or safety-system repair typically requires manufacturer training, and doing it without authorization can void warranty coverage. Many operations land on a hybrid: in-house first response and routine care, contracted specialists for major work.",
      ],
    },
    {
      heading: "Why lockout/tagout governs every intervention",
      paragraphs: [
        "Every hands-on maintenance task on a robot happens under one regulation: OSHA's control of hazardous energy standard, 29 CFR 1910.147, commonly known as lockout/tagout or LOTO. Its logic is simple and absolute. A robot that appears stopped is not safe; it may be paused mid-program, holding stored energy in springs, gravity-loaded axes, pneumatic accumulators, or capacitors, and it can resume motion without warning. Before servicing begins, energy sources must be isolated, locked off with a personal lock belonging to the person doing the work, tagged, and verified de-energized — including dissipation of stored energy.",
        "For robot maintenance this means documented energy-control procedures for each machine, training for employees who perform service (and awareness training for those who work nearby), and discipline about the boring parts: verifying zero energy, controlling keys, and formally releasing the lockout before restart. When you evaluate whether your own staff can service a robot, LOTO training and authorization is not a nice-to-have — it is the legal threshold for touching the machine at all.",
      ],
    },
    {
      heading: "Maintenance data as early warning",
      paragraphs: [
        "Modern robots log far more than faults. Controllers record joint currents, motor temperatures, cycle counts, brake engagements, and error events, and fleet software aggregates the same across mobile robots — battery health curves, localization confidence, intervention counts. This data is the cheapest predictive maintenance program available, because you already own it.",
        "The patterns are readable without exotic tooling. A joint whose motor current trends upward at constant payload is telling you about growing friction — often a lubrication or reducer problem — months before failure. Rising joint temperature under an unchanged duty cycle says the same. A cluster of transient encoder or communication faults on one axis points at a fatiguing cable. A mobile robot whose charge cycles shorten is announcing its battery replacement date in advance. The habit that matters is simple: someone reviews the trends on a schedule, and anomalies trigger inspection rather than getting cleared and forgotten.",
      ],
    },
    {
      heading: "How to think about the cost structure",
      paragraphs: [
        "Maintenance cost has four components, and they behave differently. Labor is technician time, in-house or contracted. Parts split into cheap high-frequency consumables and expensive low-frequency major assemblies, which argues for budgeting them separately. Contract fees are the predictable recurring cost of transferring risk and response-time obligations to a provider. And downtime — the production lost while the robot is out of service — is usually the largest cost of all and the one that never appears on a maintenance invoice. Every preventive-versus-corrective decision, spare-parts choice, and SLA tier is ultimately a trade between the three visible costs and the invisible fourth; total cost of ownership models that ignore downtime systematically undervalue good maintenance.",
        "When comparing robots or vendors, ask for the published maintenance schedule, the wear-parts list with expected intervals, service contract tiers with their response commitments, and lead times on major assemblies. A vendor who answers those questions crisply is telling you what ownership will feel like. One who cannot is telling you something too.",
      ],
    },
  ],
  faq: [
    {
      q: "Can our own technicians service the robot?",
      a: "It depends on training, warranty terms, and safety procedures. Routine work — consumable replacement, cleaning, inspections, backups — is commonly done in-house after basic training. Major work such as reducer replacement or safety-system repair typically requires manufacturer training, and unauthorized repairs can void warranty coverage. In all cases, anyone servicing the robot must be trained and authorized under your lockout/tagout program per 29 CFR 1910.147.",
    },
    {
      q: "How often does a robot need preventive maintenance?",
      a: "It depends on duty cycle, payload, speed, and environment, not just the calendar. Manufacturers publish baseline intervals, but a robot running multiple shifts at high payload in a dirty environment needs attention sooner than the same model on light duty. Mature programs adjust intervals using logged usage and observed condition, and treat the vendor schedule as a starting point.",
    },
    {
      q: "What are the first signs that a robot is developing a problem?",
      a: "Watch the trends the robot already records: rising joint motor current or temperature at constant payload suggests growing friction in a reducer or a lubrication issue; intermittent encoder or communication faults on one axis point at cable fatigue; shortening runtime on a mobile robot signals battery fade; and degraded repeatability or audible play in a joint indicates backlash growth. Trend reviews catch these months before hard failure.",
    },
  ],
  citations: [
    {
      source:
        "29 CFR 1910.147, The control of hazardous energy (lockout/tagout), Occupational Safety and Health Administration",
      year: "1989",
      note: "Governs energy isolation, locking, tagging, and verification for servicing and maintenance of machines, including robots.",
    },
  ],
  glossaryLinks: [
    "loto",
    "uptime",
    "oee",
    "service-level-agreement",
    "tco",
    "amr",
    "cobot",
    "fleet-management",
    "cycle-time",
  ],
  nextStep: {
    label: "Service & maintenance providers",
    href: "/robowork",
    blurb:
      "Find providers for preventive maintenance, repairs, and service contracts on deployed robots.",
  },
};
