import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "RCO Certification Program -- The Standard for Robot Operations | Robotomated",
  description:
    "The industry-standard credential for robotics professionals. 700+ questions, 4 levels, 7 specializations, The Gauntlet live assessment. Designed with input from Tesla Optimus, Boston Dynamics, and Fortune 500 automation directors.",
};

/* ═══════════════════════════════════════════════════
   LEVEL DATA
   ═══════════════════════════════════════════════════ */

const LEVELS = [
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
    rspPrice: 99,
    studyHours: "20-40",
    proves:
      "You can safely operate and monitor deployed robots. You know when to call for help. You won't hurt yourself, coworkers, or equipment.",
    careers: ["Robot Operator", "AMR Technician", "Warehouse Automation Specialist"],
    salaryBump: "$8,000-15,000/year",
    glow: "shadow-blue/20 hover:shadow-blue/40",
    border: "border-blue/20 hover:border-blue/50",
    badge: "bg-blue/10 text-blue",
    accent: "text-blue",
    cta: "bg-blue hover:bg-blue/90",
    ring: "ring-blue/30",
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
    rspPrice: 199,
    studyHours: "60-100",
    proves:
      "You can program, deploy, integrate, and maintain robots in your specialization. You handle common faults autonomously.",
    careers: [
      "Robot Technician",
      "Integration Specialist",
      "Automation Engineer",
    ],
    salaryBump: "$20,000-35,000/year",
    glow: "shadow-green/20 hover:shadow-green/40",
    border: "border-green/20 hover:border-green/50",
    badge: "bg-green/10 text-green",
    accent: "text-green",
    cta: "bg-green hover:bg-green/90 text-navy",
    ring: "ring-green/30",
    hasPractical: true,
    domains: [
      { name: "Advanced Programming", pct: 25 },
      { name: "Fleet Management", pct: 20 },
      { name: "Fault Injection Mastery", pct: 25 },
      { name: "Perception & AI", pct: 30 },
    ],
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
    rspPrice: 349,
    studyHours: "120-200",
    proves:
      "You survive chaos. You can reprogram a robot mid-shift. You close the sim-to-real gap. You handle edge cases nobody trained you for.",
    careers: [
      "Senior Robot Engineer",
      "Fleet Architect",
      "Technical Director",
    ],
    salaryBump: "$40,000-80,000/year",
    glow: "shadow-violet/20 hover:shadow-violet/40",
    border: "border-violet/20 hover:border-violet/50",
    badge: "bg-violet/10 text-violet",
    accent: "text-violet",
    cta: "bg-violet hover:bg-violet/90",
    ring: "ring-violet/30",
    hasGauntlet: true,
    domains: [
      { name: "Sim-to-Real Transfer", pct: 20 },
      { name: "Dexterous Manipulation", pct: 25 },
      { name: "World Modeling", pct: 20 },
      { name: "Edge Inference", pct: 15 },
      { name: "System Architecture", pct: 20 },
    ],
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
    rspPrice: 599,
    studyHours: "200+",
    proves:
      "You design and run large-scale robot operations. You train other operators. You make strategic decisions about fleet architecture and automation strategy.",
    careers: [
      "Head of Automation",
      "VP Operations",
      "Chief Robotics Officer",
    ],
    salaryBump: "$60,000-150,000/year",
    glow: "shadow-amber-500/20 hover:shadow-amber-500/40",
    border: "border-amber-500/20 hover:border-amber-500/50",
    badge: "bg-amber-500/10 text-amber-400",
    accent: "text-amber-400",
    cta: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
    ring: "ring-amber-500/30",
    hasCapstone: true,
    domains: [
      { name: "Program Design & Training", pct: 30 },
      { name: "Incident Command", pct: 35 },
      { name: "Business Operations", pct: 35 },
    ],
  },
];

const GAUNTLET_ROUNDS = [
  {
    round: 1,
    title: "Fault Injection",
    time: "30 min",
    description:
      "5 unknown faults injected into a live system. Sensor drift, corrupted nav maps, intermittent actuator failure, network packet loss, incorrect force thresholds. Find and fix 4 of 5.",
  },
  {
    round: 2,
    title: "Zero Downtime",
    time: "30 min",
    description:
      "Production simulation running. Perform maintenance, updates, and reconfiguration without stopping the operation. Zero production stoppages allowed.",
  },
  {
    round: 3,
    title: "Novel Environment",
    time: "30 min",
    description:
      "Robot deployed in an environment it has never seen. Remap, adjust perception, validate safety zones, document changes. Robot must complete assigned task.",
  },
  {
    round: 4,
    title: "Code Review & Fix",
    time: "30 min",
    description:
      "Broken ROS2 control code. Identify all bugs, security issues, safety failures. Fix the critical ones live. All safety-critical bugs must be resolved.",
  },
];

const SPECIALIZATIONS = [
  {
    name: "AMR Specialist",
    icon: "M",
    focus: "Autonomous Mobile Robots",
    robots: "Locus, 6 River, Fetch, Kiva",
    career: "AMR Fleet Technician",
  },
  {
    name: "Cobot Specialist",
    icon: "C",
    focus: "Collaborative Robots",
    robots: "UR, FANUC CRX, ABB GoFa",
    career: "Cobot Programmer",
  },
  {
    name: "Industrial Arm Specialist",
    icon: "I",
    focus: "High-speed Industrial Robots",
    robots: "FANUC, KUKA, ABB, Yaskawa",
    career: "Robot Programmer",
  },
  {
    name: "Drone Operations",
    icon: "D",
    focus: "Commercial Drones & UAVs",
    robots: "DJI Matrice, Agras, Skydio",
    career: "Drone Pilot / UAV Inspector",
  },
  {
    name: "Humanoid Specialist",
    icon: "H",
    focus: "Humanoid Robots — 2026",
    robots: "Figure, 1X NEO, Digit, Optimus",
    career: "Embodied AI Technician",
    isNew: true,
  },
  {
    name: "Medical Robot Specialist",
    icon: "R",
    focus: "Robots in Healthcare",
    robots: "Aethon TUG, Moxi, Diligent Penny",
    career: "Clinical Robot Technician",
  },
  {
    name: "Eldercare Specialist",
    icon: "E",
    focus: "Robots in Care Environments",
    robots: "PARO, Labrador, TUG, Relay",
    career: "Care Technology Specialist",
  },
];

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */

export default function CertifyPage() {
  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 sm:py-28">
        {/* Background grid effect */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ CERTIFICATION PROGRAM ]
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            The Standard for{" "}
            <span className="bg-gradient-to-r from-blue via-violet to-green bg-clip-text text-transparent">
              Robot Operations
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Designed with input from Tesla&apos;s Optimus program, Boston
            Dynamics field teams, and Fortune 500 automation directors.
            <br />
            <span className="font-semibold text-white">
              Not a quiz. A gauntlet.
            </span>
          </p>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "700+", label: "Questions" },
              { value: "4", label: "Levels" },
              { value: "7", label: "Specializations" },
              { value: "17", label: "Domains" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/certify/1"
              className="inline-flex items-center rounded-lg bg-blue px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue/90 hover:shadow-lg hover:shadow-blue/20"
            >
              Start at Foundation
            </Link>
            <Link
              href="#levels"
              className="inline-flex items-center rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-blue/30 hover:text-white"
            >
              Explore All Levels
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATION LEVELS ═══ */}
      <section id="levels" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ FOUR LEVELS OF MASTERY ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            From Operator to Commander
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            Each level builds on the last. The person who passes RCO Master
            should be able to walk onto any factory floor and deploy, debug, and
            operate any robot under pressure.
          </p>

          <div className="grid gap-8 lg:grid-cols-2">
            {LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className={`group relative rounded-2xl border bg-[#0A0A0A] p-7 transition-all duration-300 ${lvl.border} ${lvl.glow} hover:shadow-xl`}
              >
                {/* Level number + tag */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-[family-name:var(--font-ui)] text-[10px] font-bold uppercase tracking-[0.1em] ${lvl.badge}`}
                    >
                      Level {lvl.level}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.1em] text-muted">
                      {lvl.tag}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">
                      ${lvl.price}
                    </p>
                    <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.06em] text-muted">
                      RSP: ${lvl.rspPrice}
                    </p>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display text-2xl font-bold text-white">
                  {lvl.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {lvl.proves}
                </p>

                {/* Exam details */}
                <div className="mt-5 flex flex-wrap gap-3 text-xs">
                  <span className="rounded-md border border-border px-2.5 py-1 text-muted">
                    <span className="font-[family-name:var(--font-brand)] font-bold text-white">
                      {lvl.questions}
                    </span>{" "}
                    questions
                  </span>
                  <span className="rounded-md border border-border px-2.5 py-1 text-muted">
                    <span className="font-[family-name:var(--font-brand)] font-bold text-white">
                      {lvl.duration}
                    </span>{" "}
                    min
                  </span>
                  <span className="rounded-md border border-border px-2.5 py-1 text-muted">
                    <span className="font-[family-name:var(--font-brand)] font-bold text-white">
                      {lvl.passScore}%
                    </span>{" "}
                    to pass
                  </span>
                  <span className="rounded-md border border-border px-2.5 py-1 text-muted">
                    <span className="font-[family-name:var(--font-brand)] font-bold text-white">
                      {lvl.studyHours}
                    </span>{" "}
                    hours study
                  </span>
                </div>

                {/* Gauntlet / Practical badges */}
                {lvl.hasGauntlet && (
                  <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400">
                    + THE GAUNTLET: 2-hour live assessment (4 rounds)
                  </div>
                )}
                {lvl.hasPractical && (
                  <div className="mt-4 rounded-lg border border-green/20 bg-green/5 px-3 py-2 text-xs font-semibold text-green">
                    + 2 practical simulation scenarios (60 min total)
                  </div>
                )}
                {lvl.hasCapstone && (
                  <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs font-semibold text-amber-400">
                    + 4-hour capstone + case study + panel review
                  </div>
                )}

                {/* Domain weights */}
                <div className="mt-5 space-y-1.5">
                  {lvl.domains.map((d) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-border">
                        <div
                          className={`h-1.5 rounded-full ${
                            lvl.level === 1
                              ? "bg-blue/60"
                              : lvl.level === 2
                                ? "bg-green/60"
                                : lvl.level === 3
                                  ? "bg-violet/60"
                                  : "bg-amber-500/60"
                          }`}
                          style={{ width: `${d.pct}%` }}
                        />
                      </div>
                      <span className="w-32 text-right text-[11px] text-muted">
                        {d.name}
                      </span>
                      <span className="w-8 text-right font-[family-name:var(--font-mono)] text-[11px] text-white">
                        {d.pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Career outcomes */}
                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                    Career outcome
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {lvl.careers.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${lvl.accent}`}>
                    Avg salary increase: {lvl.salaryBump}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/certify/${lvl.level}`}
                    className={`flex-1 rounded-lg px-5 py-3 text-center text-sm font-semibold text-white transition-all ${lvl.cta}`}
                  >
                    Start Level {lvl.level}
                  </Link>
                  <Link
                    href={`/certify/study/${lvl.slug}`}
                    className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-blue/30 hover:text-white"
                  >
                    Study
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE GAUNTLET ═══ */}
      <section className="border-y border-red-500/10 bg-gradient-to-b from-red-500/[0.02] to-transparent px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-red-400">
            [ MASTER LEVEL ASSESSMENT ]
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-bold sm:text-5xl">
            The <span className="text-red-400">Gauntlet</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted">
            4 rounds. 2 hours. No second chances.
            <br />
            This is what separates operators from masters.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {GAUNTLET_ROUNDS.map((r) => (
              <div
                key={r.round}
                className="group rounded-xl border border-red-500/10 bg-[#0A0A0A] p-6 transition-all hover:border-red-500/30"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-brand)] text-4xl font-bold text-red-500/30">
                    {String(r.round).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-red-500/20 px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-red-400">
                    {r.time}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {r.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted">
            &ldquo;This is what Elon means by proof you can handle real-world
            mess.&rdquo;
          </p>
        </div>
      </section>

      {/* ═══ SPECIALIZATIONS ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ 7 SPECIALIZATION TRACKS ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Choose Your Domain
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted">
            At Level 2, choose one specialization. Each track tailors the exam
            and practical assessment to your specific robotics domain.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALIZATIONS.map((spec) => (
              <div
                key={spec.name}
                className="group relative rounded-xl border border-border bg-[#0A0A0A] p-5 transition-all hover:border-green/30"
              >
                {spec.isNew && (
                  <span className="absolute -top-2 right-4 rounded-full bg-violet px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    New
                  </span>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                  {spec.icon}
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  {spec.name}
                </h3>
                <p className="mt-1 text-xs text-green">{spec.focus}</p>
                <p className="mt-3 text-xs text-muted">
                  <span className="font-semibold text-white/70">Key robots:</span>{" "}
                  {spec.robots}
                </p>
                <p className="mt-1 text-xs text-muted">
                  <span className="font-semibold text-white/70">Career:</span>{" "}
                  {spec.career}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted">
            Humanoid Specialist: &ldquo;First certification program in the world
            focused on humanoid operations.&rdquo;
          </p>
        </div>
      </section>

      {/* ═══ EMPLOYER SECTION ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
                [ FOR EMPLOYERS ]
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold">
                Certify Your Team
              </h2>
              <p className="mt-4 text-muted">
                Certified operators have 73% fewer robot incidents. RCO
                certified RSPs earn 40% more jobs on Robotomated. Required for
                premium RoboWork listings.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    seats: "5 seats",
                    discount: "10% off",
                    price: "$134/seat",
                  },
                  {
                    seats: "10 seats",
                    discount: "20% off",
                    price: "$119/seat",
                  },
                  {
                    seats: "25 seats",
                    discount: "30% off",
                    price: "$104/seat",
                  },
                  {
                    seats: "Enterprise",
                    discount: "Custom",
                    price: "Contact us",
                  },
                ].map((tier) => (
                  <div
                    key={tier.seats}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <span className="text-sm font-medium text-white">
                      {tier.seats}
                    </span>
                    <span className="text-xs text-green">{tier.discount}</span>
                    <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                      {tier.price}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/certify/employer"
                className="mt-8 inline-flex items-center rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
              >
                Employer Portal
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold text-white">
                Team Dashboard Features
              </h3>
              {[
                "Invite team members by email",
                "Track progress per employee in real-time",
                "See completion dates and scores",
                "Export compliance reports (PDF, CSV)",
                "Renew expiring certs (60-day notifications)",
                "RCO Certified Team badge on RoboWork profile",
                "Priority placement for certified RSPs",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EMERGING SPECIALIZATIONS ═══ */}
      <section className="border-y border-violet/10 bg-gradient-to-b from-violet/[0.02] to-transparent px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-violet">
            [ COMING 2026 ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold">
            Emerging Specializations
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted">
            Three new tracks designed for the autonomous future. Join the
            waitlist for early access.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Agentic Systems Specialist",
                tagline: "The most in-demand certification by 2027",
                description:
                  "Deploy and manage AI agents that control physical robots. Prompt engineering for physical systems, agent behavior auditing, constraint design, multi-agent coordination.",
                career: "AI Robot Systems Engineer",
                premium: "60% salary premium",
                icon: "A",
              },
              {
                name: "Robot Cybersecurity Specialist",
                tagline: "The certification nobody else offers",
                description:
                  "Secure robot deployments against physical and cyber threats. Penetration testing, secure architecture, sensor spoofing detection, incident response for physical AI.",
                career: "Robot Security Engineer",
                premium: "80% salary premium",
                icon: "S",
              },
              {
                name: "Digital Twin Specialist",
                tagline: "The future of robot operations",
                description:
                  "Operate robots through digital twin infrastructure. NVIDIA Omniverse, sim-to-real validation, predictive maintenance, scenario testing methodology.",
                career: "Digital Twin Engineer",
                premium: "40% salary premium",
                icon: "T",
              },
            ].map((track) => (
              <div
                key={track.name}
                className="group relative rounded-xl border border-violet/20 bg-[#0A0A0A] p-6 transition-all hover:border-violet/40"
              >
                <span className="absolute -top-2 right-4 rounded-full bg-violet px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  2026
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-violet/20 bg-violet/5 font-[family-name:var(--font-brand)] text-lg font-bold text-violet">
                  {track.icon}
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  {track.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-violet">
                  {track.tagline}
                </p>
                <p className="mt-3 text-sm text-muted">{track.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-muted">
                    <span className="text-white">Career:</span>{" "}
                    {track.career}
                  </p>
                  <p className="text-xs text-green">{track.premium}</p>
                </div>
                <button className="mt-4 w-full rounded-lg border border-violet/30 px-4 py-2.5 text-sm font-medium text-violet transition-colors hover:bg-violet/10">
                  Join Waitlist
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LIVING CERTIFICATION ═══ */}
      <section className="bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ THE LIVING CERTIFICATION ]
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold">
            Your Certification Evolves With the Industry
          </h2>
          <p className="mt-4 text-muted">
            Updated quarterly with the latest in agentic AI, VLA models,
            digital twins, and emerging safety standards. All updates
            included until your renewal date — at no extra cost.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/certify/future-of-robotics"
              className="rounded-lg border border-blue/30 px-5 py-2.5 text-sm font-medium text-blue transition-colors hover:bg-blue/10"
            >
              12 Megatrends Shaping Robotics
            </Link>
            <Link
              href="/certify/why-certify"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Why Certify? The ROI Case
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ VERIFICATION ═══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ VERIFY A CREDENTIAL ]
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold">
            Verify a Credential
          </h2>
          <p className="mt-2 text-sm text-muted">
            Enter a credential ID to verify its authenticity and status.
          </p>
          <form
            action="/verify"
            className="mt-6 flex gap-2"
          >
            <input
              type="text"
              name="id"
              placeholder="RCO-XXXXXXXX"
              className="flex-1 rounded-lg border border-border bg-[#0A0A0A] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white placeholder:text-muted focus:border-blue/50 focus:outline-none focus:ring-1 focus:ring-blue/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90"
            >
              Verify
            </button>
          </form>
        </div>
      </section>

      {/* ═══ WHY RCO ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#0EA5E9]">
            [ THE STANDARD ]
          </p>
          <h2 className="mb-12 text-center font-display text-3xl font-bold">
            Why This Certification Exists
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue/20 bg-blue/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-blue">
                  R
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                Real-World Rigor
              </h3>
              <p className="mt-2 text-sm text-muted">
                Every question tests something that could cause a real deployment
                failure if gotten wrong. No academic fluff.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-violet/20 bg-violet/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-violet">
                  T
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                Transparent Methodology
              </h3>
              <p className="mt-2 text-sm text-muted">
                Public scoring methodology. Explainable results. Domain-level
                feedback on every attempt. No black boxes.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-green/20 bg-green/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-green">
                  V
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                Publicly Verifiable
              </h3>
              <p className="mt-2 text-sm text-muted">
                Every credential has a unique verification URL and QR code.
                Employers can confirm status instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The future of robotics runs on{" "}
            <span className="text-blue">certified operators</span>.
          </h2>
          <p className="mt-4 text-muted">
            Start your certification journey today. No prerequisites for Level
            1.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/certify/1"
              className="inline-flex items-center rounded-lg bg-blue px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-blue/90 hover:shadow-lg hover:shadow-blue/20"
            >
              Begin RCO Foundation — $149
            </Link>
            <Link
              href="/certify/employer"
              className="inline-flex items-center rounded-lg border border-border px-8 py-4 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Employer? Get bulk pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Issued by Robotomated — The Operating System for Robotics
          </p>
        </div>
      </section>
    </div>
  );
}
