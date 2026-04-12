"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════════
   LEVEL DATA
   ═══════════════════════════════════════════════════ */

const LEVELS = [
  {
    label: "Awareness (L0)",
    cost: 0,
    avgIncrease: 0,
    typicalRoles: "Entry-level robot-adjacent roles",
  },
  {
    label: "Foundation (L1)",
    cost: 149,
    avgIncrease: 12_000,
    typicalRoles: "Robot Operator, AMR Technician",
  },
  {
    label: "Specialist (L2)",
    cost: 299,
    avgIncrease: 27_000,
    typicalRoles: "Robot Technician, Integration Specialist",
  },
  {
    label: "Master (L3)",
    cost: 499,
    avgIncrease: 55_000,
    typicalRoles: "Senior Robot Engineer, Fleet Architect",
  },
  {
    label: "Fleet Commander (L4)",
    cost: 799,
    avgIncrease: 100_000,
    typicalRoles: "Head of Automation, VP Operations",
  },
  {
    label: "CRO (L5)",
    cost: 2_499,
    avgIncrease: 0,
    typicalRoles: "Chief Robotics Officer",
  },
] as const;

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export function CertificationRoiCalculator() {
  const [salary, setSalary] = useState(45_000);
  const [levelIdx, setLevelIdx] = useState(2); // default Specialist

  const level = LEVELS[levelIdx];
  const projected = salary + level.avgIncrease;
  const annualIncrease = level.avgIncrease;
  const paybackMonths =
    level.cost === 0 || annualIncrease === 0
      ? 0
      : Math.ceil((level.cost / annualIncrease) * 12);
  const fiveYearDiff = annualIncrease * 5;

  return (
    <div className="rounded-xl border border-border bg-[#0A0A0A] p-6 sm:p-8">
      {/* ── Inputs ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Current salary */}
        <div>
          <label
            htmlFor="roi-salary"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-400"
          >
            Current Salary
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-neutral-500">
              $
            </span>
            <input
              id="roi-salary"
              type="number"
              min={0}
              step={1000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-border bg-[#111] py-2.5 pl-7 pr-3 font-mono text-sm text-white outline-none transition-colors focus:border-[#2563EB]"
            />
          </div>
        </div>

        {/* Target level */}
        <div>
          <label
            htmlFor="roi-level"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-neutral-400"
          >
            Target RCO Level
          </label>
          <select
            id="roi-level"
            value={levelIdx}
            onChange={(e) => setLevelIdx(Number(e.target.value))}
            className="w-full appearance-none rounded-lg border border-border bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#2563EB]"
          >
            {LEVELS.map((l, i) => (
              <option key={l.label} value={i}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="my-6 border-t border-border" />

      {/* ── Outputs ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Projected salary */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Projected Salary
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">
            ${fmt(projected)}
          </p>
        </div>

        {/* Annual increase */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Annual Salary Increase
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-[#2563EB]">
            {annualIncrease === 0 ? "Career access" : `+$${fmt(annualIncrease)}`}
          </p>
        </div>

        {/* Payback period */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Payback Period
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-white">
            {level.cost === 0
              ? "Free"
              : annualIncrease === 0
                ? "Executive tier"
                : paybackMonths <= 1
                  ? "< 1 month"
                  : `${paybackMonths} month${paybackMonths !== 1 ? "s" : ""}`}
          </p>
          {level.cost > 0 && (
            <p className="mt-0.5 text-xs text-neutral-500">
              Certification cost: ${fmt(level.cost)}
            </p>
          )}
        </div>

        {/* Typical roles */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
            Typical Roles
          </p>
          <p className="mt-1 text-sm text-neutral-300">{level.typicalRoles}</p>
        </div>
      </div>

      {/* ── Hero number: 5-year difference ── */}
      <div className="mt-6 rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/5 p-5 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-[#2563EB]">
          5-Year Cumulative Earnings Difference
        </p>
        <p className="mt-2 font-mono text-4xl font-extrabold text-[#2563EB] sm:text-5xl">
          {fiveYearDiff === 0
            ? "Priceless"
            : `+$${fmt(fiveYearDiff)}`}
        </p>
        {fiveYearDiff > 0 && (
          <p className="mt-1 text-xs text-neutral-400">
            vs. staying at ${fmt(salary)}/yr without certification
          </p>
        )}
      </div>
    </div>
  );
}
