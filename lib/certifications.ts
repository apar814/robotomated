/* ══════════════════════════════════════════════════════════════
   lib/certifications.ts — Single source of truth for RCO data
   ══════════════════════════════════════════════════════════════ */

/* ─── Core certification record ─── */

export interface CertLevel {
  level: number;
  slug: string;
  name: string;
  tag: string;
  tagShort: string;
  questions: number;
  duration: number; // minutes
  passScore: number;
  price: number; // USD display price
  priceCents: number; // Stripe unit_amount
  rspPrice: number;
  studyHours: string;
  proves: string;
  outcomes: string[];
  careers: string[];
  salaryBump: string;
  domains: { name: string; pct: number }[];
  renewalYears: number;
  prerequisites: string;
  isFree?: boolean;
  isCRO?: boolean;
  hasPractical?: boolean;
  hasGauntlet?: boolean;
  hasCapstone?: boolean;
}

export const CERT_LEVELS: CertLevel[] = [
  {
    level: 0,
    slug: "awareness",
    name: "Awareness",
    tag: "ROBOT LITERACY CERTIFIED",
    tagShort: "RCO-A",
    questions: 40,
    duration: 60,
    passScore: 70,
    price: 0,
    priceCents: 0,
    rspPrice: 0,
    studyHours: "3-5",
    prerequisites: "None",
    renewalYears: 0, // permanent
    proves:
      "Learn what robots actually are, how they work, and the five categories reshaping every industry. You'll finish with enough context to evaluate automation opportunities and speak intelligently with vendors.",
    outcomes: [
      "Identify the 5 robot categories and their applications",
      "Apply safety protocols when working near deployed robots",
      "Evaluate vendor claims with a structured framework",
      "Explain ROI fundamentals of automation to stakeholders",
    ],
    careers: ["Any role near robots", "Career changers", "Facility staff"],
    salaryBump: "$42K\u201358K entry roles",
    domains: [
      { name: "Robot Revolution", pct: 20 },
      { name: "How Robots Work", pct: 25 },
      { name: "Safety Basics", pct: 30 },
      { name: "Robot Economy", pct: 15 },
      { name: "First Interaction", pct: 10 },
    ],
    isFree: true,
  },
  {
    level: 1,
    slug: "foundation",
    name: "Foundation",
    tag: "ROBOT OPERATOR CERTIFIED",
    tagShort: "FOUNDATION",
    questions: 80,
    duration: 90,
    passScore: 75,
    price: 149,
    priceCents: 14900,
    rspPrice: 99,
    studyHours: "20-40",
    prerequisites: "None",
    renewalYears: 2,
    proves:
      "Master the fundamentals of safe robot operation. You'll learn startup/shutdown procedures, basic fault diagnosis, and how to monitor deployed robots without putting people or equipment at risk.",
    outcomes: [
      "Safely start, operate, and shut down deployed robots",
      "Diagnose and escalate Level 1 faults under pressure",
      "Monitor robot performance and flag anomalies in real time",
      "Follow OSHA and industry safety regulations for automation",
    ],
    careers: [
      "Robot Operator",
      "AMR Technician",
      "Warehouse Automation Specialist",
    ],
    salaryBump: "$8,000-15,000/year",
    domains: [
      { name: "Safety Fundamentals", pct: 25 },
      { name: "Robot Basics", pct: 20 },
      { name: "Deployment Fundamentals", pct: 20 },
      { name: "Fault Diagnosis L1", pct: 20 },
      { name: "Regulations & Ethics", pct: 15 },
    ],
  },
  {
    level: 2,
    slug: "specialist",
    name: "Specialist",
    tag: "ROBOT SYSTEMS SPECIALIST",
    tagShort: "SPECIALIST",
    questions: 120,
    duration: 150,
    passScore: 78,
    price: 299,
    priceCents: 29900,
    rspPrice: 199,
    studyHours: "60-100",
    prerequisites: "Level 1 Foundation",
    renewalYears: 2,
    proves:
      "Go deep in your chosen robotics domain. You'll learn to program robots, integrate them with existing systems (WMS, ERP, MES), and resolve faults without calling the manufacturer.",
    outcomes: [
      "Program and deploy robots in your chosen specialization",
      "Integrate robots with warehouse, ERP, and MES systems",
      "Resolve common faults autonomously without vendor support",
      "Pass 2 live simulation scenarios under time pressure",
    ],
    careers: [
      "Robot Technician",
      "Integration Specialist",
      "Automation Engineer",
    ],
    salaryBump: "$20,000-35,000/year",
    domains: [
      { name: "Advanced Programming", pct: 25 },
      { name: "Fleet Management", pct: 20 },
      { name: "Fault Injection Mastery", pct: 25 },
      { name: "Perception & AI", pct: 30 },
    ],
    hasPractical: true,
  },
  {
    level: 3,
    slug: "master",
    name: "Master",
    tag: "ROBOT SYSTEMS MASTER",
    tagShort: "MASTER",
    questions: 150,
    duration: 180,
    passScore: 82,
    price: 499,
    priceCents: 49900,
    rspPrice: 349,
    studyHours: "120-200",
    prerequisites: "Level 2 Specialist",
    renewalYears: 2,
    proves:
      "Prove you can handle anything. Reprogram a robot mid-shift, close the sim-to-real gap, and debug edge cases nobody anticipated. The Gauntlet assessment tests all of this under live conditions.",
    outcomes: [
      "Reprogram robot behavior live during production shifts",
      "Architect multi-robot systems across different manufacturers",
      "Survive The Gauntlet: 4 rounds of live fault injection",
      "Design and validate sim-to-real transfer pipelines",
    ],
    careers: [
      "Senior Robot Engineer",
      "Fleet Architect",
      "Technical Director",
    ],
    salaryBump: "$40,000-80,000/year",
    domains: [
      { name: "Sim-to-Real Transfer", pct: 20 },
      { name: "Dexterous Manipulation", pct: 25 },
      { name: "World Modeling", pct: 20 },
      { name: "Edge Inference", pct: 15 },
      { name: "System Architecture", pct: 20 },
    ],
    hasGauntlet: true,
  },
  {
    level: 4,
    slug: "fleet-commander",
    name: "Fleet Commander",
    tag: "CERTIFIED ROBOT FLEET COMMANDER",
    tagShort: "COMMANDER",
    questions: 150,
    duration: 180,
    passScore: 85,
    price: 799,
    priceCents: 79900,
    rspPrice: 599,
    studyHours: "200+",
    prerequisites: "Level 3 Master + 2 years field experience",
    renewalYears: 2,
    proves:
      "Lead large-scale automation operations. You'll learn to design fleet architectures, run incident command, train and certify operators beneath you, and present ROI cases to executive leadership.",
    outcomes: [
      "Design fleet architectures spanning multiple facilities",
      "Run incident command during production-critical failures",
      "Build and deliver operator training programs",
      "Present automation ROI cases to C-suite stakeholders",
    ],
    careers: [
      "Head of Automation",
      "VP Operations",
      "Chief Robotics Officer",
    ],
    salaryBump: "$60,000-150,000/year",
    domains: [
      { name: "Program Design & Training", pct: 30 },
      { name: "Incident Command", pct: 35 },
      { name: "Business Operations", pct: 35 },
    ],
    hasCapstone: true,
  },
  {
    level: 5,
    slug: "cro",
    name: "Chief Robotics Officer",
    tag: "CRO (ROBOTOMATED CERTIFIED)",
    tagShort: "CRO",
    questions: 0,
    duration: 90,
    passScore: 80,
    price: 2499,
    priceCents: 249900,
    rspPrice: 2499,
    studyHours: "N/A",
    prerequisites: "Level 4 Fleet Commander + 5 years",
    renewalYears: 0, // permanent
    proves:
      "The highest designation in robotics operations. Not an exam \u2014 an induction. Demonstrate that you have shaped the future of robotics at scale through a portfolio defense, expert panel review, and ongoing contribution commitment.",
    outcomes: [
      "Join an exclusive network of senior robotics leaders",
      "Receive CRO designation recognized across the industry",
      "Contribute to RCO curriculum and industry standards",
      "Access board-level advisory and speaking opportunities",
    ],
    careers: [
      "Chief Robotics Officer",
      "Robotics Board Member",
      "Industry Advisor",
    ],
    salaryBump: "Executive tier",
    domains: [
      { name: "Portfolio Defense", pct: 33 },
      { name: "Panel Review (90 min)", pct: 34 },
      { name: "Contribution Commitment", pct: 33 },
    ],
    isCRO: true,
  },
];

/* ─── Lookup helpers ─── */

/** Map slug → CertLevel for O(1) lookups */
export const CERT_BY_SLUG: Record<string, CertLevel> = Object.fromEntries(
  CERT_LEVELS.map((c) => [c.slug, c]),
);

/** Map numeric level → CertLevel */
export const CERT_BY_LEVEL: Record<number, CertLevel> = Object.fromEntries(
  CERT_LEVELS.map((c) => [c.level, c]),
);

/** All slugs that have detail pages via the [level] dynamic route (1-4) */
export const DETAIL_SLUGS = CERT_LEVELS
  .filter((c) => !c.isFree && !c.isCRO)
  .map((c) => c.slug);

/** Stripe price lookup by slug */
export const CERT_STRIPE_PRICES: Record<string, { name: string; price: number }> =
  Object.fromEntries(
    CERT_LEVELS
      .filter((c) => c.priceCents > 0)
      .map((c) => [
        c.slug,
        { name: `RCO ${c.name} (Level ${c.level})`, price: c.priceCents },
      ]),
  );

/** ROI calculator data */
export const CERT_ROI_DATA = CERT_LEVELS.map((c) => ({
  label: `${c.name} (L${c.level})`,
  cost: c.price,
}));
