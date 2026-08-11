import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "what-does-a-systems-integrator-do",
  title: "What a systems integrator does and when you need one",
  description:
    "What robot systems integrators actually do, who carries legal responsibility for the finished cell, and how to decide whether your project needs one.",
  readTime: 7,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "When you buy an industrial robot, you are not buying a working system. You are buying a component. The robot arm arrives with a controller, a teach pendant, and a manual, and on its own it does nothing useful and nothing safe. Turning that component into a production cell that picks your parts, respects your takt time, talks to your other equipment, and protects the people working around it is a separate engineering discipline. The companies that practice it are called systems integrators, and for a large share of industrial robot projects they are the party that actually determines whether the investment works.",
        "This guide explains what an integrator's work actually consists of, why the law in many jurisdictions treats the integrator as the manufacturer of the finished machine, when a buyer genuinely needs one, when a buyer can reasonably proceed without one, and how to evaluate integrators when you cannot judge their engineering directly.",
      ],
    },
    {
      heading: "What the work actually includes",
      paragraphs: [
        "The visible part of integration is mechanical: the integrator designs and builds the cell around the robot, including end-of-arm tooling, part fixtures, conveyors or infeed systems, and the physical guarding. But most of the value is in the application engineering that precedes the build. A competent integrator studies your parts, your process, and your variation before committing to a design. They run reach and cycle-time studies, often in simulation, to confirm that the proposed robot can actually make rate with your real part mix. For mobile robot projects the equivalent work is fleet design: traffic analysis, charging strategy, and mapping how robots will share aisles with people and forklifts.",
        "Alongside the mechanical design sits the safeguarding design and the risk assessment that drives it. The integrator identifies the hazards the integrated system creates, decides which are addressed by guarding, which by safety-rated devices such as light curtains and interlocked doors, and which by procedures, and then designs the safety control circuits that make those measures work. This is not paperwork appended at the end; it shapes the layout, the guarding, and the control architecture from the start.",
        "The controls scope is usually the largest single block of engineering hours. The integrator programs the robot for your application, writes or modifies PLC logic to sequence the cell, and builds the interfaces to the systems that feed the cell work: a WMS in a warehouse, an MES or ERP in a factory, upstream and downstream machines on the line. Finally comes commissioning: installing the equipment, verifying every function against the specification, validating the safety functions, running the cell at rate with production parts, training your operators and maintenance staff, and handing over documentation. A project is not integrated when the robot moves; it is integrated when your people can run and maintain the cell without the integrator in the building.",
      ],
    },
    {
      heading: "Who is legally responsible for the finished cell",
      paragraphs: [
        "This is the part of the integrator's role that buyers most often misunderstand, and it matters even outside Europe because the European framework is the clearest statement of the underlying logic. Under the EU Machinery Directive 2006/42/EC, an industrial robot on its own is typically placed on the market as partly completed machinery. The robot maker supplies a Declaration of Incorporation, which says, in effect, that this component must not be put into service until the machine it is built into has been assessed and declared conforming. The robot maker cannot declare the finished cell safe, because the robot maker has no idea what you will build around it.",
        "Whoever assembles the robot, the tooling, the guarding, and the controls into a functioning cell becomes, in the Directive's terms, the manufacturer of that complete machine. That party must carry out the conformity assessment, compile the technical file including the risk assessment, affix the CE marking, and issue the Declaration of Conformity for the integrated system. When you hire an integrator, this is normally their responsibility, and it should be stated explicitly in the contract. If you integrate the cell yourself, or modify it substantially later, that responsibility can land on you.",
        "The technical route to demonstrating conformity for robot systems is ISO 10218-2:2025, the international standard for robot applications and integration. It specifies the requirements for the integrated system: the safeguarding, the safety-related control functions, the collaborative application requirements, and the verification and validation the integrator must perform. When an integrator says a cell is built to ISO 10218-2, that is a checkable claim about a specific document, and the risk assessment and validation records are the evidence. A similar division of responsibility exists in other jurisdictions even where the paperwork differs, and the practical takeaway is the same everywhere: the party who integrates the system owns the safety of the system.",
      ],
    },
    {
      heading: "When you need an integrator",
      paragraphs: [
        "Some projects should not be attempted without one. The clearest case is the multi-vendor cell: a robot from one company, a vision system from another, end-of-arm tooling from a third, safety devices from a fourth, all sequenced by a PLC and fed by your plant systems. Nobody in that supply chain owns the combination except the integrator, and when the combination misbehaves, a buyer without an integrator has four vendors each pointing at the other three.",
        "The second case is any safety-critical application: high-payload robots, high-speed motion near people, processes involving heat, cutting, or pressure, or any collaborative application where people and robots deliberately share space. Here the risk assessment and the validation of safety functions require competence that most end users do not have in-house, and the legal exposure described above makes improvisation genuinely dangerous.",
        "The third case is organizational rather than technical: you have no in-house controls engineering. If nobody on your staff can read PLC logic, modify a robot program, or troubleshoot an interlock circuit, then even a technically simple cell needs an integrator, both to build it and to structure a support arrangement you can live with afterward.",
      ],
    },
    {
      heading: "When you might not",
      paragraphs: [
        "The honest counterpoint is that the market has moved to reduce the need for integration at the simple end. Turnkey cobot kits for tasks like machine tending, palletizing, and screwdriving arrive as a matched package of robot, tooling, and application software, designed so that a capable maintenance technician can deploy them. The application still requires a risk assessment, and a cobot is not automatically safe, but for a single-robot, single-task cell inside its design envelope, a well-supported kit plus a focused risk assessment consultation can be a defensible path.",
        "Similarly, most AMR vendors deploy their own fleets. If you are buying mobile robots from a vendor whose standard offering includes site survey, mapping, WMS integration, and commissioning, and you have in-house IT capable of owning the network and the software interfaces afterward, adding a third-party integrator may add cost without adding accountability. The test is not whether the project involves robots; it is whether any single accountable party already owns the integrated result. When the vendor genuinely owns it, you may not need anyone else. When no one owns it, that is the gap an integrator fills.",
      ],
    },
    {
      heading: "How to evaluate an integrator",
      paragraphs: [
        "Buyers can rarely audit an integrator's engineering directly, but three proxies are reliable. First, references in your application, not merely your industry: an integrator with several live installations doing approximately your task, on parts of approximately your variability, has already made the mistakes you are paying to avoid. Ask to speak to those customers, and ask specifically what went wrong during commissioning and how it was handled, because something always goes wrong and the response is the signal.",
        "Second, documentation quality. Ask to see a sanitized risk assessment, a functional design specification, and an operator manual from a past project. Integrators who produce clear, structured documents under no pressure will produce them for you; those who cannot show you any have told you what handover will look like. Third, safety competence as a named capability: who on their staff performs risk assessments, what training or certification they hold, how safety functions are validated and recorded, and whether the integrator will issue the Declaration of Conformity for the finished cell in jurisdictions where that applies. An integrator who is vague on that last question is asking you to carry a responsibility they are paid to own.",
      ],
    },
  ],
  faq: [
    {
      q: "Does the robot manufacturer certify the safety of the finished cell?",
      a: "No. In the EU framework the robot maker typically supplies a Declaration of Incorporation for the robot as partly completed machinery. Whoever integrates the robot into a complete cell is responsible for the risk assessment and, in the EU, for the CE marking and Declaration of Conformity of the whole system. That is normally the integrator's job when you hire one.",
    },
    {
      q: "Do collaborative robots remove the need for an integrator?",
      a: "Not automatically. A cobot can make a simple, single-task cell deployable without a traditional integrator, especially as part of a turnkey kit. But the application still requires a risk assessment, because the tooling, the part, and the process can create hazards the robot's design does not address. The more the application departs from the kit's intended envelope, the more integrator involvement it needs.",
    },
    {
      q: "What should an integrator hand over at the end of a project?",
      a: "At minimum: the risk assessment, records of safety function validation, electrical and mechanical drawings, robot and PLC programs with backups, operator and maintenance documentation, spare parts recommendations, and, where applicable, the Declaration of Conformity. If the handover package is thin, the project is not finished, whatever the robot is doing.",
    },
  ],
  citations: [
    {
      source: "Machinery Directive 2006/42/EC, European Union",
      year: "2006",
    },
    {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
  ],
  glossaryLinks: [
    "systems-integrator",
    "risk-assessment",
    "iso-10218",
    "cobot",
    "amr",
    "wms",
    "safeguarded-space",
    "collaborative-workspace",
    "fleet-management",
  ],
  nextStep: {
    label: "Find robotics services",
    href: "/robowork",
    blurb:
      "Scope your project and connect with integration and deployment services matched to your application.",
  },
};
