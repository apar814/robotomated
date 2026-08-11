import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "how-to-read-a-robot-spec-sheet",
  title: "How to read a robot spec sheet",
  description:
    "Payload, reach, repeatability, IP ratings, duty cycle, and battery claims — what each spec actually measures, where the traps are, and what to ask vendors.",
  readTime: 8,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "A robot spec sheet is a set of measurements made under conditions the manufacturer chose. That is not an accusation — it is how data sheets work in every industry — but it means the numbers are answers to questions you did not ask. The payload figure was measured with a particular load geometry. The runtime figure was measured on a particular duty cycle. The repeatability figure was measured at a particular speed and temperature, on a particular path.",
        "Reading a spec sheet well is therefore less about decoding jargon and more about knowing, for each headline number, what was actually measured and what was left out. The single most useful habit a buyer can develop is to ask, for every spec that matters to the application: under what test conditions was this measured, and how do those conditions differ from mine? This guide walks through the load-bearing specs — the ones that disqualify robots or get deployments in trouble — and the trap hiding in each.",
      ],
    },
    {
      heading: "Payload includes everything on the wrist",
      paragraphs: [
        "Payload is the mass the robot can carry — but the payload budget must cover the end effector as well as the workpiece. A gripper, its cabling, any camera or sensor mounted at the wrist, and the part itself all draw from the same figure. Buyers routinely size a robot against the workpiece alone, then discover that the tooling consumes so much of the rated payload that the intended parts no longer fit within it.",
        "The second trap is geometry. Rated payload assumes the load's center of gravity sits close to the mounting flange; move the mass further out — a long gripper, an offset part, a workpiece held at one end — and the allowable payload derates, because the moment on the wrist joints grows with the offset even when the mass does not. Manufacturers publish this as a payload diagram or wrist torque and inertia limits, and the diagram, not the headline number, is the real specification. If the data sheet does not include one, ask for it, along with the load conditions under which the headline payload was established.",
      ],
    },
    {
      heading: "Reach is not usable workspace",
      paragraphs: [
        "Reach is usually quoted as a single radius — the furthest point the wrist can attain. But a robot cannot do useful work everywhere inside that sphere. There is a dead zone close to the base where the arm cannot fold in on itself, regions near full extension where the arm loses dexterity and can present only limited tool orientations, and singularity regions where joints align and the controller must slow or reroute motion through them. The usable workspace — where the robot can present the tool at the orientations the task needs, at working speed — is a subset of the quoted envelope, and its shape depends on the task.",
        "The practical consequence is that reach comparisons between robots are only meaningful with the workspace diagrams in front of you, and cell layouts should be validated in the manufacturer's simulation tools against your actual part positions and approach angles before any metal is ordered. A robot whose quoted reach technically covers your furthest pick point may still be unable to orient the gripper there.",
      ],
    },
    {
      heading: "Repeatability is not accuracy",
      paragraphs: [
        "Repeatability measures how tightly a robot returns to the same taught position over many cycles. Accuracy measures how close the robot gets to a commanded coordinate it has never been taught. Spec sheets almost always quote repeatability, because it is the far smaller and more flattering number, and many buyers read it as accuracy. For applications where positions are taught by jogging the robot and replayed — most traditional automation — repeatability is genuinely the number that matters. For applications where positions arrive as coordinates from a vision system, an offline programming package, or a CAD model, accuracy is what matters, and it can be markedly worse than repeatability on the same machine.",
        "ISO 9283 defines the test methods for pose repeatability, pose accuracy, path characteristics, and related performance criteria, which is what makes figures comparable between manufacturers at all — when they are measured to it. A spec sheet that quotes repeatability without referencing a test method, or that stays silent on accuracy while your application depends on it, has told you what questions to ask. Degrees of freedom belong in the same conversation: a 6-axis arm can present a tool at arbitrary orientations within its workspace, while a 4-axis machine constrains orientation, and no repeatability figure compensates for an orientation the arm cannot reach.",
      ],
    },
    {
      heading: "Duty cycle, and continuous versus peak",
      paragraphs: [
        "Several specs on a sheet are quietly time-limited. A robot may deliver its maximum speed, maximum payload, or maximum joint torque only for limited bursts, with thermal limits forcing a lower sustained rating — the same continuous-versus-peak distinction familiar from motor data sheets. A machine specified against its peak figures and then run at them all shift will derate itself, fault on overtemperature, or wear early.",
        "Ask explicitly which figures are continuous ratings and which are peak, and what duty cycle the manufacturer assumed — the ratio of working time to rest within a cycle — when establishing them. This matters doubly for mobile robots, where duty cycle assumptions hide inside runtime claims, and for any application planning multi-shift operation, where the sustained rating is the only one that exists.",
      ],
    },
    {
      heading: "IP ratings, decoded",
      paragraphs: [
        "Ingress protection ratings look like a single opaque number but are two independent digits defined by IEC 60529. The first digit rates protection against solid objects and dust, running from no protection at 0 up to dust-tight at 6. The second digit rates protection against water, from no protection at 0 up through dripping, spraying, jetting, and immersion, with the highest ratings covering high-pressure, high-temperature jets. IP54 and IP65 therefore describe meaningfully different machines, and the difference is legible once the digits are read separately.",
        "The trap is matching the rating to the real environment rather than to a vague sense of ruggedness. Dust-tight matters in machining and woodworking cells. Jetting protection matters where the robot is hosed down. Food and beverage washdown, with close-range high-pressure, high-temperature cleaning, is the demanding case — equipment for those environments is commonly specified to IP69K, the designation covering exactly that regime. Note also that the rating applies to the robot as tested; an added dress pack, a third-party wrist camera, or an opened connector can compromise it, and the end effector usually carries its own, often lower, rating.",
      ],
    },
    {
      heading: "Speed, temperature, batteries, and the rest of the sheet",
      paragraphs: [
        "Maximum speed — whether joint speeds for an arm or travel speed for a mobile robot — is measured unloaded or lightly loaded on an unobstructed path, and real cycle times are governed by acceleration, settling, tool actions, and path shape rather than by top speed. Two arms with identical maximum speeds can produce very different cycle times on the same task. The honest way to compare is a cycle-time study on your actual part and path, in simulation or in a demo cell, not a comparison of headline speeds.",
        "Operating temperature ranges deserve a direct check against the real environment, including the corners of it — the freezer aisle, the summer mezzanine, the enclosure that traps heat around the controller. Performance at the edges of the rated range is a fair question to put to the vendor, since ratings state where the robot operates, not that all specs hold across the whole range.",
        "Battery and runtime claims for mobile robots are the most conditions-dependent numbers on any sheet. Runtime depends on payload carried, floor condition, travel speed, idle behavior, and how the duty cycle mixes driving with waiting; charge-time claims depend on charger type and on whether the quoted charge is full or partial. Ask what mission profile produced the quoted runtime and how it compares to yours, and evaluate the fleet's opportunity-charging strategy rather than the single-robot number. Finally, do not skip the unglamorous rows: noise level and the conditions it was measured under, mounting options — floor, ceiling, wall, or angle, which change the workspace and sometimes the ratings — and the true footprint including controller cabinet, cable dress, and service clearance, which is what your floor plan actually has to absorb.",
      ],
    },
  ],
  faq: [
    {
      q: "Why does rated payload drop when the load is offset from the flange?",
      a: "Because the wrist joints are limited by torque and inertia, not just mass. Moving the center of gravity away from the flange increases the moment the wrist must support, so the allowable mass falls with distance. The manufacturer's payload diagram, which plots allowable mass against center-of-gravity offset, is the real specification.",
    },
    {
      q: "Which matters more, repeatability or accuracy?",
      a: "It depends on how positions get into the robot. If positions are taught on the machine and replayed, repeatability governs. If positions arrive as computed coordinates — from vision, offline programming, or CAD — accuracy governs, and it is typically worse than the quoted repeatability. ISO 9283 defines the test methods for both.",
    },
    {
      q: "Is a higher IP rating always better?",
      a: "Only if the environment demands it. The two digits rate dust and water protection separately under IEC 60529, and the right approach is matching each digit to the actual environment — including washdown regimes, which are commonly specified as IP69K. Higher sealing can add cost and constrain design, and attached tooling may carry a lower rating that becomes the effective limit.",
    },
    {
      q: "How should I evaluate a mobile robot's runtime claim?",
      a: "Ask for the test conditions: payload carried, speed, floor type, and the ratio of driving to idle time in the quoted mission profile. Then compare that profile to your own and evaluate the fleet's charging strategy — how robots opportunity-charge during the shift — rather than relying on a single-robot runtime figure.",
    },
  ],
  citations: [
    {
      source: "ISO 9283, International Organization for Standardization",
      year: "1998",
      note: "Defines performance criteria and test methods for manipulating industrial robots, including pose repeatability and pose accuracy.",
    },
    {
      source: "IEC 60529, International Electrotechnical Commission",
      year: "2013",
      note: "Defines the IP code: first digit rates protection against solids and dust, second digit against water.",
    },
  ],
  glossaryLinks: [
    "payload",
    "reach",
    "repeatability",
    "accuracy",
    "degrees-of-freedom",
    "end-effector",
    "amr",
    "machine-vision",
  ],
  nextStep: {
    label: "Explore robots by category",
    href: "/explore",
    blurb: "Put the spec-reading habits to work — compare payload diagrams, IP ratings, and workspace envelopes across verified robots.",
  },
};
