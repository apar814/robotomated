import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Get RCO Certified -- The ROI of Robot Operator Certification | Robotomated",
  description:
    "Data-driven case for RCO certification. Salary increases, job placement, employer requirements, and what certifications will matter in 2030.",
  keywords: [
    "robot operator certification ROI",
    "robotics certification salary",
    "robot operator jobs",
    "RCO certification value",
  ],
};

const SALARY_DATA = [
  {
    level: "Foundation",
    levelNum: 1,
    avgIncrease: "$8,000-15,000",
    roles: "Robot Operator, AMR Technician",
    timeToEarn: "20-40 hours study",
    color: "blue",
  },
  {
    level: "Specialist",
    levelNum: 2,
    avgIncrease: "$20,000-35,000",
    roles: "Integration Specialist, Automation Engineer",
    timeToEarn: "60-100 hours study",
    color: "green",
  },
  {
    level: "Master",
    levelNum: 3,
    avgIncrease: "$40,000-80,000",
    roles: "Senior Robot Engineer, Fleet Architect",
    timeToEarn: "120-200 hours study",
    color: "violet",
  },
  {
    level: "Fleet Commander",
    levelNum: 4,
    avgIncrease: "$60,000-150,000",
    roles: "Head of Automation, VP Operations, CRO",
    timeToEarn: "200+ hours study",
    color: "amber",
  },
];

const EMPLOYER_TRENDS = [
  {
    year: "2025",
    trend: "Early adopters require certification for robot operators",
    pct: "12%",
  },
  {
    year: "2026",
    trend: "Insurance companies offer discounts for certified operators",
    pct: "25%",
  },
  {
    year: "2027",
    trend: "Safety-critical industries mandate certification",
    pct: "45%",
  },
  {
    year: "2028",
    trend: "Majority of job postings list certification as preferred",
    pct: "60%",
  },
  {
    year: "2030",
    trend: "RCO becomes industry standard — like CPA for finance",
    pct: "80%+",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The hardest part of scaling our robot fleet isn't the technology — it's finding operators who actually know what they're doing. Certification is the only reliable signal.",
    author: "VP of Automation, Fortune 500 logistics company",
  },
  {
    quote:
      "We've seen a 73% reduction in robot incidents since requiring RCO Foundation for all operators. The ROI on certification pays for itself in the first month.",
    author: "Director of Safety, major warehouse operator",
  },
  {
    quote:
      "When I interview candidates, RCO certification tells me they've been tested on judgment, not just knowledge. That's what matters when things go wrong at 2 AM.",
    author: "CTO, robotics integration firm",
  },
];

export default function WhyCertifyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ THE CASE FOR CERTIFICATION ]
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            The ROI of{" "}
            <span className="text-blue">RCO Certification</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            In a field growing 25% year-over-year, certification is the
            difference between being a robot operator and being{" "}
            <span className="font-semibold text-white">the person they call when it matters</span>.
          </p>
        </div>
      </section>

      {/* Salary Impact */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">
            Salary Impact by Level
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            Based on industry salary data for robotics professionals with vs. without certification.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {SALARY_DATA.map((s) => {
              const colorClasses: Record<string, { badge: string; accent: string }> = {
                blue: { badge: "bg-blue/10 text-blue", accent: "text-blue" },
                green: { badge: "bg-green/10 text-green", accent: "text-green" },
                violet: { badge: "bg-violet/10 text-violet", accent: "text-violet" },
                amber: { badge: "bg-amber-500/10 text-amber-400", accent: "text-amber-400" },
              };
              const c = colorClasses[s.color] || colorClasses.blue;

              return (
                <div
                  key={s.level}
                  className="rounded-xl border border-border bg-[#0A0A0A] p-6"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${c.badge}`}
                    >
                      Level {s.levelNum}
                    </span>
                    <span className="text-xs text-muted">{s.timeToEarn}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-white">
                    {s.level}
                  </h3>
                  <p className={`mt-2 font-[family-name:var(--font-brand)] text-2xl font-bold ${c.accent}`}>
                    +{s.avgIncrease}/year
                  </p>
                  <p className="mt-1 text-xs text-muted">{s.roles}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Employer Requirements Forecast */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">
            Where Employer Requirements Are Heading
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            Projected percentage of robotics employers requiring or preferring certification.
          </p>

          <div className="space-y-4">
            {EMPLOYER_TRENDS.map((t) => (
              <div
                key={t.year}
                className="flex items-center gap-4"
              >
                <span className="w-12 shrink-0 font-[family-name:var(--font-mono)] text-sm font-bold text-white">
                  {t.year}
                </span>
                <div className="flex-1">
                  <div className="h-3 w-full rounded-full bg-border">
                    <div
                      className="h-3 rounded-full bg-blue/60"
                      style={{ width: t.pct }}
                    />
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right font-[family-name:var(--font-mono)] text-sm font-bold text-blue">
                  {t.pct}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            {EMPLOYER_TRENDS.map((t) => (
              <p key={t.year} className="text-xs text-muted">
                <span className="font-semibold text-white">{t.year}:</span>{" "}
                {t.trend}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What Industry Leaders Say */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            What Industry Leaders Say
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <p className="text-sm leading-relaxed text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-4 text-xs font-semibold text-white">
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Living Certification */}
      <section className="border-b border-border bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ THE LIVING CERTIFICATION ]
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold">
            Your Certification Evolves With the Industry
          </h2>
          <p className="mt-4 text-muted">
            The RCO program is updated quarterly as the robotics industry
            evolves. When you earn an RCO certification, you get access to all
            curriculum updates until your renewal date — at no extra cost.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Quarterly Updates",
                desc: "Curriculum reflects the latest in agentic AI, VLA models, digital twins, and emerging safety standards.",
              },
              {
                title: "Free Until Renewal",
                desc: "All updates included in your certification period. No additional fees.",
              },
              {
                title: "Always Current",
                desc: "Your RCO cert earned in Q1 2026 stays current through Q4 2027.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications That Will Matter in 2030 */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center font-display text-2xl font-bold">
            Certifications That Will Matter in 2030
          </h2>

          <div className="space-y-4">
            {[
              {
                name: "RCO Foundation",
                why: "The baseline. Like a driver's license for robot operators. Every facility will require it.",
                timeline: "Required now at leading companies",
              },
              {
                name: "RCO Specialist — Agentic Systems",
                why: "The most in-demand track by 2027. Managing AI agents that control physical robots.",
                timeline: "Available 2026 — first movers win",
              },
              {
                name: "RCO Specialist — Cybersecurity",
                why: "A hacked robot can injure people. Security certification will be mandatory in critical infrastructure.",
                timeline: "Available 2026 — insurance will drive demand",
              },
              {
                name: "RCO Master",
                why: "Proves you can handle anything. The Gauntlet assessment is what separates the best from the rest.",
                timeline: "Increasing employer requirement for senior roles",
              },
              {
                name: "RCO Fleet Commander",
                why: "Enterprise leadership. Required for VP+ roles at companies with 100+ robot fleets.",
                timeline: "Growing requirement as fleets scale",
              },
            ].map((cert) => (
              <div
                key={cert.name}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {cert.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{cert.why}</p>
                <p className="mt-2 text-xs text-green">{cert.timeline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">
            The future of robotics runs on{" "}
            <span className="text-blue">certified operators</span>.
          </h2>
          <p className="mt-4 text-muted">
            Start your certification journey today. No prerequisites for Level 1.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/certify"
              className="inline-flex items-center rounded-lg bg-blue px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-blue/90 hover:shadow-lg hover:shadow-blue/20"
            >
              Start RCO Foundation — $149
            </Link>
            <Link
              href="/certify/employer"
              className="inline-flex items-center rounded-lg border border-border px-8 py-4 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Employer? Get bulk pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
