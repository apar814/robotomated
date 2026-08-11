import type { Explainer } from "../explainer-types";

export const explainer: Explainer = {
  slug: "robot-safety-standards-explained",
  title: "Robot safety standards explained: ISO 10218 and ISO/TS 15066",
  description:
    "A buyer's map of robot safety standards: ISO 12100 risk assessment, ISO 10218 parts 1 and 2, ANSI/RIA R15.06, and what compliance looks like in practice.",
  readTime: 8,
  publishedAt: "2026-08-10",
  sections: [
    {
      paragraphs: [
        "Robot safety standards read like an alphabet soup until you see the structure underneath, and the structure is simple. One standard tells you how to think about risk. Two standards tell you what a safe robot and a safe robot system look like. A handful of supporting standards define the building blocks those two lean on: emergency stops, safeguard distances, interlocks, and the reliability of the safety controls themselves. Once you hold that map, vendor claims stop being noise and become checkable statements about specific documents.",
        "This matters to a buyer for a practical reason. Robots are rarely dangerous or safe in themselves; the integrated application is. The standards framework exists to force a disciplined answer to one question: what could this system do to a person, and what has been done about it? Everything below is in service of that question.",
      ],
    },
    {
      heading: "Start with the method: ISO 12100",
      paragraphs: [
        "ISO 12100:2010 is the foundation for machinery safety generally, not just robots. It defines the risk assessment method that every other standard in this article assumes: identify the hazards the machine and its use create, estimate the risk of each in terms of severity and probability, and then reduce risk using a strict three-step hierarchy. First, eliminate or reduce the hazard by design, such as removing a trap point or limiting force at the source. Second, apply safeguarding and protective devices for the risks that design cannot remove, such as fences, light curtains, and interlocked doors. Third, and only for what remains, rely on information for use: warnings, training, and procedures.",
        "The order is the point. A warning label on a hazard that could have been designed out is not compliance; it is the residue of a skipped step. When you read a risk assessment for a robot cell, what you are checking is whether this hierarchy was actually followed, hazard by hazard, and whether each residual risk was consciously accepted rather than quietly ignored.",
      ],
    },
    {
      heading: "The robot and the system: ISO 10218 parts 1 and 2",
      paragraphs: [
        "The core robot standards come in two parts, and the split mirrors the split in responsibility. ISO 10218-1:2025 covers the robot itself: the design and safety requirements the robot manufacturer must meet, including safety-rated stop functions, speed control, and the reliability of the robot's safety-related controls. When a robot maker says the arm complies with ISO 10218-1, they are speaking only about the component they ship.",
        "ISO 10218-2:2025 covers the robot application and the integrated system: the cell layout, the safeguarding, the safety functions of the whole installation, and the verification and validation the integrator must perform. This is the standard the finished cell is assessed against, and it is where the risk assessment from ISO 12100 gets applied to a specific installation in a specific building with specific people around it.",
        "Buyers researching collaborative robots will encounter ISO/TS 15066:2016, the technical specification that defined the collaborative operation methods, including speed and separation monitoring and power and force limiting, along with guidance on force and pressure thresholds for contact with the human body. It remains a useful reference for understanding how collaborative applications work, but its requirements were incorporated into the 2025 revisions of ISO 10218, so a current project should be specified against the 2025 editions rather than against the technical specification alone. One consequence worth internalizing: collaborative operation is a property of an application, established through the risk assessment, not a property of a robot. There is no such thing as a robot that is safe wherever you put it.",
      ],
    },
    {
      heading: "The US picture: ANSI/RIA R15.06 and OSHA",
      paragraphs: [
        "In the United States, the ISO robot standards are adopted nationally as ANSI/RIA R15.06, so the technical content American integrators work to is essentially the same material. What differs is the regulatory posture. OSHA has no robot-specific regulation. Instead, employers are bound by the General Duty Clause, the statutory requirement to provide a workplace free from recognized hazards. In practice, the consensus standards — R15.06 and the ISO documents behind it — function as the recognized standard of care. If an incident occurs and the installation ignored them, that gap is what the citation and the litigation will be built on.",
        "The practical consequence for a US buyer is that voluntary and mandatory are closer than they appear. Nobody will inspect your cell against R15.06 before you switch it on, but everyone who examines it after something goes wrong will. Specifying compliance in your purchase contract, and requiring the documentation that proves it, is how you make the standard enforceable on your own behalf.",
      ],
    },
    {
      heading: "The supporting cast",
      paragraphs: [
        "Four supporting standards appear constantly in robot projects. ISO 13849-1:2023 governs the safety-related parts of control systems and defines the concept of performance levels, graded PL a through PL e, which express how reliably a safety function must work given the risk it controls. A stop function that protects against a severe, frequent, hard-to-avoid hazard must be engineered to a higher performance level than one covering a minor risk, and the risk assessment determines the required level for each safety function in the cell. When an integrator says an interlock circuit achieves PL d, that is a claim with a defined calculation and evidence behind it.",
        "ISO 13850:2015 defines the emergency stop function: how e-stop devices must behave, latch, and reset. ISO 13855:2010 governs the positioning of safeguards relative to human approach speed; it is the reason a light curtain must be mounted a calculated distance from the hazard, so the machine can reach a safe state before a person can reach the danger zone. ISO 14119:2013 covers interlocking devices for guards, including requirements that make defeating an interlock with a spare actuator or a taped-down switch difficult. Buyers do not need to read these, but knowing they exist changes how you hear vendor claims: guard distances, interlock choices, and e-stop behavior are not aesthetic decisions, and if an integrator cannot say which standard drove them, that is a finding.",
      ],
    },
    {
      heading: "What compliance looks like in practice",
      paragraphs: [
        "Compliance is not a sticker on the robot. For an installed system it is a body of evidence, and it has three recognizable parts. The first is the risk assessment document for your specific installation: the hazard-by-hazard record of what was identified, what was done, and what residual risk remains. If this document does not exist, or exists only as a generic template with your company name pasted in, the system is not meaningfully assessed no matter what hardware it carries.",
        "The second is validation of the safety functions. Every safety function the risk assessment relies on — stops, interlocks, light curtains, speed monitoring, safety-rated soft axis limits — must be tested in the installed system and the results recorded. The third is the conformity paper trail. In the EU this is concrete: the robot arrives with a Declaration of Incorporation as partly completed machinery, and the party who integrates the cell issues the Declaration of Conformity and applies the CE marking to the complete system, under the Machinery Directive 2006/42/EC. In the US there is no equivalent marking, which is precisely why the risk assessment and validation records carry the evidentiary weight.",
      ],
    },
    {
      heading: "What to ask your vendor or integrator for",
      paragraphs: [
        "Four requests, all reasonable, all revealing. Ask which editions of ISO 10218 the system is designed and verified against, in writing. Ask for the risk assessment for your installation, and read it for site-specific content: your parts, your layout, your people. Ask for the safety function validation records, including the required performance level of each function and the evidence it was achieved. And in the EU, ask who issues the Declaration of Conformity for the integrated cell, because that answer names the party carrying legal responsibility for the system's safety.",
        "A vendor or integrator who handles these questions fluently is telling you something about everything else they do. One who treats them as unusual is telling you something too. The standards will not choose your robot for you, but they give you a shared, precise language for the one requirement that is not negotiable, and buyers who use that language get better systems.",
      ],
    },
  ],
  faq: [
    {
      q: "Is ISO/TS 15066 still the collaborative robot standard?",
      a: "It remains a published technical specification and a useful reference, but its collaborative requirements were incorporated into the 2025 revisions of ISO 10218-1 and 10218-2. New projects should be specified and verified against the 2025 editions, with ISO/TS 15066:2016 as background reading rather than the primary requirement.",
    },
    {
      q: "Does OSHA require compliance with ISO 10218 or R15.06?",
      a: "Not by name. OSHA has no robot-specific standard, but the General Duty Clause requires employers to address recognized hazards, and the consensus standards define what recognizing and addressing those hazards looks like. In enforcement and litigation after an incident, conformance to R15.06 and the ISO standards is the benchmark the installation is measured against.",
    },
    {
      q: "What is a performance level?",
      a: "A grade defined in ISO 13849-1 expressing how reliably a safety function must perform, from PL a to PL e, based on the severity, frequency, and avoidability of the hazard it controls. The risk assessment assigns a required performance level to each safety function, and the integrator must show the installed circuit achieves it.",
    },
    {
      q: "If I buy a robot that complies with ISO 10218-1, is my cell compliant?",
      a: "No. Part 1 covers only the robot as a component. The integrated cell must be assessed against ISO 10218-2, which requires an application-specific risk assessment and validation of the safety functions in the installed system. A compliant robot in an unassessed cell is an unassessed cell.",
    },
  ],
  citations: [
    {
      source: "ISO 12100:2010, International Organization for Standardization",
      year: "2010",
    },
    {
      source: "ISO 10218-1:2025, International Organization for Standardization",
      year: "2025",
    },
    {
      source: "ISO 10218-2:2025, International Organization for Standardization",
      year: "2025",
    },
    {
      source:
        "ISO/TS 15066:2016, International Organization for Standardization",
      year: "2016",
    },
    {
      // TODO(verify): confirm whether a post-2012 US adoption of the 2025 ISO editions has been published; update edition year if so.
      source:
        "ANSI/RIA R15.06-2012, Robotic Industries Association / American National Standards Institute",
      year: "2012",
    },
    {
      source: "ISO 13849-1:2023, International Organization for Standardization",
      year: "2023",
    },
    {
      source: "ISO 13850:2015, International Organization for Standardization",
      year: "2015",
    },
    {
      // TODO(verify): confirm current edition year of ISO 13855 (a revision of the 2010 edition may have been published).
      source: "ISO 13855:2010, International Organization for Standardization",
      year: "2010",
    },
    {
      // TODO(verify): confirm current edition year of ISO 14119 (a revision of the 2013 edition may have been published).
      source: "ISO 14119:2013, International Organization for Standardization",
      year: "2013",
    },
    {
      source: "Machinery Directive 2006/42/EC, European Union",
      year: "2006",
    },
  ],
  glossaryLinks: [
    "risk-assessment",
    "iso-10218",
    "iso-ts-15066",
    "iso-12100",
    "iso-13849-1",
    "iso-13850",
    "iso-13855",
    "iso-14119",
    "ansi-ria-r15-06",
    "performance-level",
    "emergency-stop",
    "safeguarded-space",
    "collaborative-workspace",
    "cobot",
    "systems-integrator",
  ],
  nextStep: {
    label: "Operator certification",
    href: "/certify",
    blurb:
      "Standards assume trained people. Certify your operators on safe robot operation and the practices these standards require.",
  },
};
