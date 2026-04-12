"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ───── constants ───── */

const CURRENT_ROLES = [
  "No robotics experience",
  "Warehouse/Logistics worker",
  "Manufacturing operator",
  "Maintenance technician",
  "IT/Software engineer",
  "Military/Government",
  "Student/Recent graduate",
  "Management/Executive",
] as const;

const TIMELINES = ["6 months", "1 year", "2 years", "3+ years"] as const;

interface Stage {
  label: string;
  level: string;
  badge: string;
  salaryIncrease: number; // cumulative
  cost: number;
  timeRange: string;
  titles: string[];
}

const STAGES: Stage[] = [
  {
    label: "AFTER FOUNDATION",
    level: "Foundation",
    badge: "L1",
    salaryIncrease: 12_000,
    cost: 149,
    timeRange: "3-6 months",
    titles: ["Robot Operator", "Automation Technician", "Cobot Attendant"],
  },
  {
    label: "AFTER SPECIALIST",
    level: "Specialist",
    badge: "L2",
    salaryIncrease: 27_000,
    cost: 299,
    timeRange: "6-12 months",
    titles: [
      "Integration Specialist",
      "Robotics Systems Tech",
      "Process Automation Lead",
    ],
  },
  {
    label: "AFTER MASTER",
    level: "Master",
    badge: "L3",
    salaryIncrease: 55_000,
    cost: 499,
    timeRange: "12-24 months",
    titles: ["Fleet Architect", "Robotics Program Manager", "Senior Integrator"],
  },
  {
    label: "FLEET COMMANDER",
    level: "Fleet Commander",
    badge: "L4",
    salaryIncrease: 100_000,
    cost: 799,
    timeRange: "24-36 months",
    titles: [
      "VP of Automation",
      "Chief Robotics Officer",
      "Director of Fleet Ops",
    ],
  },
];

const JOBS_HIRING = [
  {
    title: "Robot Operators",
    level: "Foundation+",
    count: 240,
    href: "/robowork/jobs?level=foundation",
  },
  {
    title: "Integration Specialists",
    level: "Specialist+",
    count: 85,
    href: "/robowork/jobs?level=specialist",
  },
  {
    title: "Fleet Architects",
    level: "Master+",
    count: 32,
    href: "/robowork/jobs?level=master",
  },
];

/* ───── helpers ───── */

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function stagesForTimeline(timeline: string): number {
  switch (timeline) {
    case "6 months":
      return 1;
    case "1 year":
      return 2;
    case "2 years":
      return 3;
    default:
      return 4;
  }
}

/* ───── page ───── */

export default function CareerPathPage() {
  const [currentRole, setCurrentRole] = useState(CURRENT_ROLES[0]);
  const [currentSalary, setCurrentSalary] = useState(45_000);
  const [timeline, setTimeline] = useState<string>("2 years");

  const visibleStages = useMemo(
    () => stagesForTimeline(timeline),
    [timeline],
  );

  const totalCost = useMemo(
    () => STAGES.slice(0, visibleStages).reduce((s, st) => s + st.cost, 0),
    [visibleStages],
  );

  const topIncrease = STAGES[visibleStages - 1]?.salaryIncrease ?? 0;
  const projectedSalary = currentSalary + topIncrease;
  const fiveYearIncrease = topIncrease * 5;
  const monthlyIncrease = topIncrease / 12;
  const paybackMonths =
    monthlyIncrease > 0 ? Math.ceil(totalCost / monthlyIncrease) : 0;

  /* shared input classes */
  const selectCls =
    "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#00C2FF] focus:outline-none appearance-none cursor-pointer";
  const inputCls =
    "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white font-mono focus:border-[#00C2FF] focus:outline-none";

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* ─── HEADER ─── */}
      <section className="border-b border-white/[0.06] px-4 pb-10 pt-12">
        <div className="mx-auto max-w-5xl">
          {/* inline breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-white/40">
              <li>
                <Link href="/" className="hover:text-white/70 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">/</li>
              <li>
                <Link href="/careers" className="hover:text-white/70 transition-colors">
                  Careers
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">/</li>
              <li className="text-white/60">Career Path</li>
            </ol>
          </nav>

          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C2FF]">
            Career Path Tool
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Your Robotics Career Path
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/50">
            See exactly where certification takes you&nbsp;&mdash; and what
            it&apos;s worth.
          </p>
        </div>
      </section>

      {/* ─── INPUT SECTION ─── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Your starting point
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {/* Current role */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Current Role
                </label>
                <select
                  value={currentRole}
                  onChange={(e) =>
                    setCurrentRole(e.target.value as typeof currentRole)
                  }
                  className={selectCls}
                >
                  {CURRENT_ROLES.map((r) => (
                    <option key={r} value={r} className="bg-[#0A0A0A]">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current salary */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Current Salary
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={currentSalary}
                  onChange={(e) =>
                    setCurrentSalary(Number(e.target.value) || 0)
                  }
                  className={inputCls}
                />
              </div>

              {/* Timeline */}
              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Target Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className={selectCls}
                >
                  {TIMELINES.map((t) => (
                    <option key={t} value={t} className="bg-[#0A0A0A]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CAREER ARC ─── */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-wider text-white/40">
            Your career arc
          </h2>

          {/* connecting line + cards */}
          <div className="relative space-y-0">
            {/* vertical cyan line */}
            <div
              className="absolute left-6 top-0 w-px bg-gradient-to-b from-white/20 via-[#00C2FF]/40 to-[#00C2FF]/60 sm:left-8"
              style={{ height: "100%" }}
            />

            {/* Stage 0 — NOW */}
            <div className="relative pb-8">
              <div className="absolute left-4 top-6 h-4 w-4 rounded-full border-2 border-white/30 bg-[#0A0F1E] sm:left-6" />
              <div className="ml-14 sm:ml-20">
                <div className="rounded-xl border border-white/20 bg-[#0A0A0A] p-6">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Now
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {currentRole}
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-white/70">
                    {fmt(currentSalary)}
                    <span className="ml-1 text-xs font-normal text-white/50">
                      /year
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Future stages */}
            {STAGES.slice(0, visibleStages).map((stage, i) => {
              const projected = currentSalary + stage.salaryIncrease;
              return (
                <div key={stage.level} className="relative pb-8 last:pb-0">
                  {/* dot on line */}
                  <div className="absolute left-4 top-6 h-4 w-4 rounded-full border-2 border-[#00C2FF]/50 bg-[#0A0F1E] sm:left-6">
                    <div className="absolute inset-1 rounded-full bg-[#00C2FF]/60" />
                  </div>

                  <div className="ml-14 sm:ml-20">
                    <div className="rounded-xl border border-[#00C2FF]/20 bg-[#0A0A0A] p-6">
                      {/* header row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-md border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#00C2FF]">
                          {stage.badge}
                        </span>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                          {stage.label}
                        </p>
                      </div>

                      {/* salary */}
                      <p className="mt-3 font-mono text-2xl font-bold text-[#00C2FF]">
                        {fmt(projected)}
                        <span className="ml-1 text-xs font-normal text-white/50">
                          /year
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-[#00E5A0]">
                        +{fmt(stage.salaryIncrease)} vs current
                      </p>

                      {/* meta row */}
                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/40">
                        <span>
                          <span className="text-white/60">Time:</span>{" "}
                          {stage.timeRange}
                        </span>
                        <span>
                          <span className="text-white/60">Cost:</span>{" "}
                          {fmt(stage.cost)}
                        </span>
                      </div>

                      {/* job titles */}
                      <div className="mt-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                          Unlocked Roles
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {stage.titles.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── ROI SUMMARY ─── */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-[#00C2FF]/20 bg-gradient-to-br from-[#00C2FF]/[0.04] to-[#7B2FFF]/[0.04] p-6 sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
              Return on Investment
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-white/40">Total Investment</p>
                <p className="mt-1 font-mono text-2xl font-bold text-white">
                  {fmt(totalCost)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">5-Year Earnings Increase</p>
                <p className="mt-1 font-mono text-2xl font-bold text-[#00E5A0]">
                  +{fmt(fiveYearIncrease)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Payback Period</p>
                <p className="mt-1 font-mono text-2xl font-bold text-[#00C2FF]">
                  {paybackMonths}{" "}
                  <span className="text-sm font-normal text-white/50">
                    months
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40">Projected Salary</p>
                <p className="mt-1 font-mono text-2xl font-bold text-white">
                  {fmt(projectedSalary)}
                  <span className="ml-1 text-xs font-normal text-white/50">
                    /yr
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/certify"
                className="inline-flex items-center gap-2 rounded-lg bg-[#00C2FF] px-6 py-3 text-sm font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/90"
              >
                Start Your Journey
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── JOBS HIRING NOW ─── */}
      <section className="border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            Jobs Hiring Now
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {JOBS_HIRING.map((job) => (
              <Link
                key={job.title}
                href={job.href}
                className="group rounded-xl border border-white/[0.08] bg-[#0A0A0A] p-6 transition-colors hover:border-[#00C2FF]/30"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#00C2FF]">
                  {job.level}
                </p>
                <p className="mt-2 text-lg font-bold text-white group-hover:text-[#00C2FF] transition-colors">
                  {job.title}
                </p>
                <p className="mt-1 text-sm text-white/40">
                  {job.count}+ open positions
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[#00C2FF]/70 group-hover:text-[#00C2FF]">
                  View jobs
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
