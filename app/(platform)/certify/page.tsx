import type { Metadata } from "next";
import Link from "next/link";
import { CertificationRoiCalculator } from "@/components/certify/roi-calculator";
import { CERT_LEVELS } from "@/lib/certifications";

export const metadata: Metadata = {
  title:
    "RCO Certification Program -- The Standard for Robot Operations | Robotomated",
  description:
    "The industry-standard credential for robotics professionals. 700+ questions, 6 levels (free entry to CRO), 10 specializations, The Gauntlet live assessment. From robot literacy to Chief Robotics Officer.",
};

/* ═══════════════════════════════════════════════════
   INDEX-PAGE-ONLY PRESENTATION DATA
   ═══════════════════════════════════════════════════ */

const CTA_LABELS: Record<string, string> = {
  awareness: "Get Robot Literate — Free",
  foundation: "Become a Certified Operator",
  specialist: "Get Certified as a Specialist",
  master: "Earn Your Master Credential",
  "fleet-commander": "Become a Fleet Commander",
  cro: "Apply for CRO Designation",
};

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
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ CERTIFICATION PROGRAM ]
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            The Standard for{" "}
            <span className="text-white font-semibold">
              Robot Operations
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            The robotics industry will add 1.3 million jobs by 2030. Most of them don&apos;t exist yet. RCO certification puts your name on the shortlist before the roles are even posted.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted">
            Designed with input from Tesla&apos;s Optimus program, Boston
            Dynamics field teams, and Fortune 500 automation directors.{" "}
            <span className="font-semibold text-white">
              Not a quiz. A gauntlet.
            </span>
          </p>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "700+", label: "Questions" },
              { value: "6", label: "Levels" },
              { value: "10", label: "Specializations" },
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
              href="/certify/awareness"
              className="hover-btn-bl inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Get Certified Free — Level 0 Awareness
            </Link>
            <Link
              href="#levels"
              className="hover-btn-bl inline-flex items-center rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-white"
            >
              Compare All 6 Levels
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATION LEVELS ═══ */}
      <section id="levels" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ 6 LEVELS &middot; FROM LITERACY TO LEADERSHIP ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Every Level Unlocks a New Career
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-center text-muted">
            Each certification proves a concrete competency. The person who passes RCO Master
            can walk onto any factory floor and deploy, debug, and
            operate any robot under production pressure.
          </p>

          {/* ROI headline */}
          <div className="mx-auto mb-14 max-w-2xl rounded-lg border border-border bg-white/5 px-6 py-4 text-center">
            <p className="text-sm text-white">
              The average RCO Master earns{" "}
              <span className="font-bold text-white">$40,000 more per year</span>{" "}
              than an uncertified operator. The certification pays for itself in{" "}
              <span className="font-bold text-white">11 days</span>.
            </p>
            <p className="mt-1 text-xs text-muted">
              Most students complete Foundation to Master in 14 weeks.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {CERT_LEVELS.map((lvl) => (
              <div
                key={lvl.level}
                className="hover-card-bl group relative rounded-2xl border border-border bg-[#0A0A0A] p-7 transition-all duration-300 hover:border-white/20"
              >
                {/* Level number + tag */}
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-full border border-border bg-white/5 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.1em] text-white">
                      Level {lvl.level}
                    </span>
                    <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
                      {lvl.tag}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">
                      {lvl.price === 0 ? "FREE" : `$${lvl.price.toLocaleString()}`}
                    </p>
                    {lvl.price > 0 && lvl.rspPrice !== lvl.price && (
                      <p className="font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] text-muted">
                        RSP: ${lvl.rspPrice}
                      </p>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display text-2xl font-bold text-white">
                  {lvl.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {lvl.proves}
                </p>

                {/* What you'll be able to do */}
                <div className="mt-4">
                  <p className="font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
                    What you&apos;ll be able to do
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {lvl.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-[13px] text-white/80">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-current" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam details — labeled stats */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div className="rounded-md border border-border px-2.5 py-2 text-center">
                    <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                      {lvl.questions}
                    </p>
                    <p className="text-[13px] text-muted">Questions</p>
                  </div>
                  <div className="rounded-md border border-border px-2.5 py-2 text-center">
                    <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                      {lvl.duration}
                    </p>
                    <p className="text-[13px] text-muted">Minutes</p>
                  </div>
                  <div className="rounded-md border border-border px-2.5 py-2 text-center">
                    <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                      {lvl.passScore}%
                    </p>
                    <p className="text-[13px] text-muted">Pass Score</p>
                  </div>
                  <div className="rounded-md border border-border px-2.5 py-2 text-center">
                    <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                      {lvl.studyHours}
                    </p>
                    <p className="text-[13px] text-muted">Study Hours</p>
                  </div>
                </div>

                {/* Gauntlet / Practical badges */}
                {lvl.hasGauntlet && (
                  <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white">
                    + THE GAUNTLET: 2-hour live assessment (4 rounds)
                  </div>
                )}
                {lvl.hasPractical && (
                  <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white">
                    + 2 practical simulation scenarios (60 min total)
                  </div>
                )}
                {lvl.hasCapstone && (
                  <div className="mt-4 rounded-lg border border-border bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white">
                    + 4-hour capstone + case study + panel review
                  </div>
                )}

                {/* Domain weights — labeled progress bars */}
                <div className="mt-5">
                  <p className="mb-2 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
                    Exam Domain Weights
                  </p>
                  <div className="space-y-1.5">
                    {lvl.domains.map((d) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <span className="w-36 text-[11px] text-muted">
                          {d.name}
                        </span>
                        <div className="h-1.5 flex-1 rounded-full bg-border">
                          <div
                            className="h-1.5 rounded-full bg-white/40"
                            style={{ width: `${d.pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-[family-name:var(--font-mono)] text-[11px] text-white">
                          {d.pct}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career outcomes + salary */}
                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-baseline justify-between">
                    <p className="font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
                      Career Outcome
                    </p>
                    <p className="text-base font-bold text-white">
                      {lvl.salaryBump}
                    </p>
                  </div>
                  <p className="mt-0.5 text-right text-[13px] text-muted">avg. salary increase</p>
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
                </div>

                {/* CTA — outcome-driven copy */}
                <div className="mt-6 flex gap-3">
                  <Link
                    href={`/certify/${lvl.slug}`}
                    className="flex-1 rounded-lg border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
                  >
                    {CTA_LABELS[lvl.slug] || lvl.name}
                  </Link>
                  {!lvl.isCRO && (
                    <Link
                      href={`/certify/study/${lvl.slug}`}
                      className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-muted transition-colors hover:border-white/30 hover:text-white"
                    >
                      Preview Curriculum
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE GAUNTLET ═══ */}
      <section className="border-y border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ MASTER LEVEL ASSESSMENT ]
          </p>
          <h2 className="mt-4 text-center font-display text-3xl font-bold sm:text-5xl">
            The <span className="text-white">Gauntlet</span>
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
                className="hover-card-bl group rounded-xl border border-border bg-[#0A0A0A] p-6 transition-all hover:border-white/20"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-brand)] text-4xl font-bold text-white/20">
                    {String(r.round).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-muted">
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
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
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
                className="hover-card-bl group relative rounded-xl border border-border bg-[#0A0A0A] p-5 transition-all hover:border-white/20"
              >
                {spec.isNew && (
                  <span className="absolute -top-2 right-4 rounded-full bg-white/10 border border-border px-2.5 py-0.5 text-[13px] font-bold uppercase tracking-wider text-white">
                    New
                  </span>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                  {spec.icon}
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  {spec.name}
                </h3>
                <p className="mt-1 text-xs text-white">{spec.focus}</p>
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
              <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
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
                    <span className="text-xs text-white">{tier.discount}</span>
                    <span className="font-[family-name:var(--font-mono)] text-sm text-white">
                      {tier.price}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/certify/employer"
                className="hover-btn-bl mt-8 inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Certify Your Team
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
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EMERGING SPECIALIZATIONS ═══ */}
      <section className="border-y border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
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
                className="hover-card-bl group relative rounded-xl border border-border bg-[#0A0A0A] p-6 transition-all hover:border-white/20"
              >
                <span className="absolute -top-2 right-4 rounded-full bg-white/10 border border-border px-2.5 py-0.5 text-[13px] font-bold uppercase tracking-wider text-white">
                  2026
                </span>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white/5 font-[family-name:var(--font-brand)] text-lg font-bold text-white">
                  {track.icon}
                </div>
                <h3 className="font-display text-base font-bold text-white">
                  {track.name}
                </h3>
                <p className="mt-1 text-xs font-semibold text-white">
                  {track.tagline}
                </p>
                <p className="mt-3 text-sm text-muted">{track.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-muted">
                    <span className="text-white">Career:</span>{" "}
                    {track.career}
                  </p>
                  <p className="text-xs text-white">{track.premium}</p>
                </div>
                <button className="hover-btn-bl mt-4 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
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
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
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
              className="hover-btn-bl rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
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
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
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
              className="flex-1 rounded-lg border border-border bg-[#0A0A0A] px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-white placeholder:text-muted focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
            <button
              type="submit"
              className="hover-btn-bl rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Verify
            </button>
          </form>
        </div>
      </section>

      {/* ═══ WHY RCO ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE STANDARD ]
          </p>
          <h2 className="mb-12 text-center font-display text-3xl font-bold">
            Why This Certification Exists
          </h2>

          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-white/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-white/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-white/5">
                <span className="font-[family-name:var(--font-brand)] text-xl font-bold text-white">
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

      {/* ═══ YOUR ROI ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ YOUR ROI ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold">
            What Is Certification Worth to You?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-muted">
            Enter your current salary and target level. See exactly what certification is worth over 5 years.
          </p>
          <CertificationRoiCalculator />
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The future of robotics runs on{" "}
            <span className="text-white font-semibold">certified operators</span>.
          </h2>
          <p className="mt-4 text-muted">
            Start your certification journey today. Level 0 is free.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/certify/awareness"
              className="hover-btn-bl inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Get Certified Free — Level 0 Awareness
            </Link>
            <Link
              href="/certify/employer"
              className="inline-flex items-center rounded-lg border border-border px-8 py-4 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Employer? Get bulk pricing
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Issued by Robotomated — The Intelligence Layer for Robotics
          </p>
        </div>
      </section>
    </div>
  );
}
