import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "construction-robotics-today",
  title: "Construction robotics — what is actually deployable today",
  description:
    "A conservative survey of construction robot classes with real commercial deployments — what each does, the conditions it needs, and its current limits.",
  readTime: 9,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Construction robotics attracts more speculative claims than almost any other robotics category, so this guide takes the opposite approach: it describes only classes of systems with documented commercial deployments on real projects, and it describes them conservatively. The honest summary up front is this: today's construction robots succeed at repetitive, well-bounded tasks in conditions that can be at least partially controlled, almost always with human supervision. General-purpose construction labor — a machine that frames, hangs, finishes, and adapts the way a tradesperson does — is not deployable today. What is deployable is narrower and more useful than the hype suggests: a set of specific tools that take over specific tasks, each with clear requirements and clear limits.",
      ],
    },
    {
      heading: "Why construction is hard for robots",
      paragraphs: [
        "It helps to understand why the list is short. Factories are built around their machines; construction sites are the opposite — an environment that changes daily, by design. The building that exists on Tuesday is not the building that existed on Monday, so a robot cannot rely on a stable map or fixed fixtures the way an industrial arm does. Sites are open to weather, which affects footing, visibility, materials, and electronics. As-built conditions drift from drawings: tolerance stack-ups accumulate across trades, and a robot working from the model will meet walls inches from where the model says they are.",
        "The hardest variable is people. Multiple trades share the same space on overlapping schedules, and their movements are not scripted. A robot on an active site must either work in a zone that can be controlled and cleared, work slowly and cautiously enough to coexist with unpredictable humans, or work off-hours. Every deployable class described below succeeds in part because it found a workable answer to this problem — usually by choosing tasks that are naturally bounded in space, time, or both, and by keeping a person in a supervisory role. A site-specific risk assessment around each robot's working zone is standard practice, not an optional extra.",
      ],
    },
    {
      heading: "Layout marking and printed concrete",
      paragraphs: [
        "The most cleanly bounded task on a site is drawing on the floor, and it has produced one of the most mature deployment classes: robotic layout printing on slab. These are compact mobile robots that drive across a cured concrete floor and print the construction layout directly onto it — wall lines, penetrations, hanger points, annotations — working from the digital model. The task suits a robot almost perfectly: the floor is flat and finished, the work is two-dimensional, the zone can be cleared, and accuracy against the model is exactly what machines are good at. What the class needs is a broom-clean slab, a way to establish position against control points, and a current, coordinated model to print from — which quietly makes model quality the real prerequisite. Its limits are equally clear: it marks the work; people still build it.",
        "Additive construction — 3D-printed concrete — is a separate and genuinely commercial class, used to print structural walls for low-rise buildings. A gantry or arm system extrudes a cementitious mix layer by layer along the wall lines of the design, producing the vertical structure while trades complete everything the printer does not touch: foundations, roofs, openings, MEP, and finishes. The class needs a prepared site with room for the equipment, printable material managed within its workable window, tolerable weather during printing, and a design actually developed for the process rather than converted to it as an afterthought. Its limits are structural and practical: current commercial practice centers on walls for low-rise structures, printing is one trade among many rather than a whole-building solution, and code acceptance is handled project by project in many jurisdictions. It is real, and it is narrower than its renderings.",
      ],
    },
    {
      heading: "Autonomous earthmoving on standard equipment",
      paragraphs: [
        "Earthmoving was an early candidate for autonomy for a simple reason: the work is repetitive, the machines are large and instrumented, and the environment — a graded site or borrow pit — can be controlled more tightly than a vertical construction zone. The commercially deployed class here is the retrofit: autonomy kits installed on standard heavy equipment such as dozers, excavators, compactors, and articulated haulers, allowing the machine to execute defined earthmoving tasks — pushing to grade, repetitive haul cycles, compaction passes — under remote human supervision, often with one operator overseeing multiple machines.",
        "The conditions are the point. These systems run inside geofenced work areas with controlled access, on tasks that repeat for hours or days, with site plans loaded as digital terrain targets and a human supervisor able to intervene. Within that envelope they work productively through long shifts. Outside it — congested zones, novel one-off tasks, close coordination with ground workers — the operator takes back the seat. The class is best understood not as a robot replacing an operator but as a way to run repetitive machine-hours without a person aboard for every one of them.",
      ],
    },
    {
      heading: "Repetitive installation and finishing tasks",
      paragraphs: [
        "A cluster of deployed classes attacks specific repetitive trade tasks, and they share a shape: high repetition, physically punishing for humans, and bounded enough for current autonomy. Semi-autonomous rebar tying robots traverse mats of horizontal rebar — typically on bridge decks and large slabs — locating intersections and tying them, relieving workers of thousands of stooped, wrist-intensive ties. The class needs a reasonably regular mat on a horizontal surface and a person handling layout, edges, and irregular details; complex vertical cages remain human work.",
        "Drilling robots for overhead installation address one of the most ergonomically brutal tasks in interior construction: drilling hundreds or thousands of anchor holes in concrete ceilings for MEP hangers and supports. A mobile platform positions itself from the digital layout, drills overhead patterns to specified depth, and marks or logs each hole, while a worker supervises rather than holding a hammer drill above shoulder height all shift. The class needs a finished slab to drive on, clear ceiling access, and a coordinated model; it drills where the model says, so clash-free coordination is again the hidden prerequisite.",
        "Drywall finishing assistance rounds out the cluster: machines that apply and sand joint compound on installed drywall, working large flat expanses of wall and ceiling. The class produces consistent finish over big areas and reduces sanding exposure and overhead strain, while human finishers retain corners, details, repairs, and judgment about surface quality. In every one of these classes the pattern repeats — the robot takes the repetitive middle of the task, and skilled people keep the edges, the exceptions, and the standards.",
      ],
    },
    {
      heading: "Documentation, capture, and survey",
      paragraphs: [
        "The most widely deployed construction robots do not build anything at all — they observe. Quadruped robots carrying laser scanners and cameras walk sites on scheduled routes, capturing reality-capture data — scans, panoramic images, progress photos — with a repeatability that manual documentation cannot match. The legged platform earns its place on terrain that defeats wheels: stairs, debris, unfinished floors. The class needs traversable routes, a safety protocol for operating around workers, and someone responsible for turning captured data into decisions; its limit is exactly its scope, since it documents the site rather than changing it.",
        "Drone survey and progress capture is the other established observation class: aerial mapping of sites for earthwork quantities, progress tracking, inspection of elevated work, and as-built comparison against the model. It is also the one class on this list governed by a specific regulation — in the United States, commercial drone operation falls under 14 CFR Part 107, which requires a certificated remote pilot and sets operating rules including altitude limits and visual-line-of-sight requirements, with waivers available for some operations. The practical requirements are therefore procedural as much as technical: a qualified operator, airspace awareness near airports, and weather windows. Together, the observation classes are often the right first robot for a contractor, precisely because they deliver value without touching the critical path of construction itself.",
      ],
    },
    {
      heading: "What a buyer should take from this",
      paragraphs: [
        "The pattern across every deployable class is consistent, and it is the most useful thing to carry into any purchasing conversation. Today's construction robots succeed where the task is repetitive, the geometry is known, the zone can be bounded, and a human supervises. They need conditions — clean slabs, coordinated models, geofenced areas, traversable routes — and part of buying one is committing to provide those conditions, which frequently means raising the quality of your digital model and your site logistics before the robot arrives. Their limits are not temporary marketing caveats; they define where the value is.",
        "Evaluate any construction robot the way you would evaluate a subcontractor with a very narrow specialty: what exact scope does it take, what does it need from the rest of the job, what does it hand back, and what happens when conditions are not ideal. Pilot it on a bounded scope with defined success criteria before committing across projects. And treat any pitch that leans on general-purpose capability — a robot that will simply do construction labor — with the skepticism it deserves. The wins available today are real, but they are specific, and the buyers doing well with construction robotics are the ones who bought a specific tool for a specific task and prepared the site for it.",
      ],
    },
  ],
  faq: [
    {
      q: "Are humanoid or general-purpose robots working on construction sites today?",
      a: "Not in any production sense. The deployed classes today are task-specific: layout printing, concrete printing, earthmoving retrofits, rebar tying, overhead drilling, drywall finishing assistance, and observation platforms such as quadrupeds and drones. Each handles a bounded, repetitive scope under human supervision. General-purpose construction labor remains a research and development goal, not a deployable product.",
    },
    {
      q: "What do most construction robots need from the site before they can work?",
      a: "The recurring requirements are a controllable work zone, decent working surfaces along the robot's routes, and — for anything working from the design — a current, clash-coordinated digital model, since most of these systems execute the model literally. Many contractors find that model quality and site logistics, not the robot itself, are the limiting factors in a deployment.",
    },
    {
      q: "What rules apply to using drones on a construction project?",
      a: "In the United States, commercial drone operation is governed by 14 CFR Part 107, which requires a certificated remote pilot and sets operating rules such as altitude limits and visual-line-of-sight flight, with waivers available for certain operations. Projects near airports need airspace authorization. Requirements differ in other countries, so check the applicable civil aviation authority for your jurisdiction.",
    },
  ],
  citations: [
    {
      source: "14 CFR Part 107, Federal Aviation Administration",
      year: "2016",
      note: "US regulation governing commercial small unmanned aircraft operation, including remote pilot certification and operating rules.",
    },
  ],
  glossaryLinks: [
    "quadruped",
    "slam",
    "machine-vision",
    "pilot-program",
    "risk-assessment",
  ],
  nextStep: {
    label: "Browse construction robots",
    href: "/explore/construction",
    blurb:
      "See verified robots across the deployable classes — layout, printing, earthmoving, installation, and site capture — with specs you can compare.",
  },
};
