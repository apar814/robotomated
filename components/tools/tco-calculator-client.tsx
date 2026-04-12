"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils/cn";

interface RobotOption {
  id: string;
  slug: string;
  name: string;
  price_current: number | null;
  manufacturer_name: string;
}

interface SelectedRobot {
  id: string;
  name: string;
  purchasePrice: number;
  annualMaintenance: number;
  installationCost: number;
}

const COLORS = ["#2563EB", "#6366F1", "#60A5FA"];

export function TcoCalculatorClient() {
  // ─── Robot Search ───
  const [searchTerm, setSearchTerm] = useState("");
  const [robotOptions, setRobotOptions] = useState<RobotOption[]>([]);
  const [selectedRobots, setSelectedRobots] = useState<SelectedRobot[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // ─── Labor Inputs ───
  const [hourlyWage, setHourlyWage] = useState(22);
  const [shiftsPerDay, setShiftsPerDay] = useState(2);
  const [workersReplaced, setWorkersReplaced] = useState(3);

  // ─── Financing ───
  const [financeMode, setFinanceMode] = useState<"purchase" | "lease">("purchase");
  const [monthlyLease, setMonthlyLease] = useState(2500);

  // ─── Email ───
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Fetch robots on search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setRobotOptions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/robots?search=${encodeURIComponent(searchTerm)}&page=1`);
        const data = await res.json();
        setRobotOptions(
          (data.robots || []).map((r: { id: string; slug: string; name: string; price_current: number | null; manufacturer_name: string }) => ({
            id: r.id,
            slug: r.slug,
            name: r.name,
            price_current: r.price_current,
            manufacturer_name: r.manufacturer_name,
          })),
        );
        setShowDropdown(true);
      } catch {
        setRobotOptions([]);
      }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  function addRobot(robot: RobotOption) {
    if (selectedRobots.length >= 3) return;
    if (selectedRobots.find((r) => r.id === robot.id)) return;
    const price = robot.price_current ?? 50000;
    setSelectedRobots([
      ...selectedRobots,
      {
        id: robot.id,
        name: robot.name,
        purchasePrice: price,
        annualMaintenance: Math.round(price * 0.1),
        installationCost: Math.round(price * 0.2),
      },
    ]);
    setSearchTerm("");
    setShowDropdown(false);
  }

  function removeRobot(id: string) {
    setSelectedRobots(selectedRobots.filter((r) => r.id !== id));
  }

  function updateRobot(id: string, field: keyof SelectedRobot, value: number) {
    setSelectedRobots(
      selectedRobots.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  // ─── Calculations ───
  const calculations = useMemo(() => {
    const overheadMultiplier = 1.3;
    const turnoverRate = 0.3;
    const turnoverCost = 4000;
    const fullyLoaded = hourlyWage * overheadMultiplier;
    const annualLaborPerWorker = fullyLoaded * 8 * shiftsPerDay * 250;
    const annualLabor = annualLaborPerWorker * workersReplaced;
    const annualTurnover = turnoverCost * workersReplaced * turnoverRate;

    // Human cumulative
    const humanCosts: number[] = [];
    for (let y = 1; y <= 5; y++) {
      const prev = y === 1 ? 0 : humanCosts[y - 2];
      humanCosts.push(prev + annualLabor + annualTurnover);
    }

    // Per-robot calculations
    const robotCalcs = selectedRobots.map((robot) => {
      const costs: number[] = [];
      for (let y = 1; y <= 5; y++) {
        const prev = y === 1 ? 0 : costs[y - 2];
        let yearCost: number;
        if (financeMode === "lease") {
          yearCost = y === 1
            ? robot.installationCost + monthlyLease * 12 + robot.annualMaintenance
            : monthlyLease * 12 + robot.annualMaintenance;
        } else {
          yearCost = y === 1
            ? robot.purchasePrice + robot.installationCost + robot.annualMaintenance
            : robot.annualMaintenance;
        }
        costs.push(prev + yearCost);
      }

      // Break-even
      let breakEvenMonths: number | null = null;
      for (let i = 0; i < 5; i++) {
        if (costs[i] <= humanCosts[i]) {
          if (i === 0) {
            breakEvenMonths = Math.round(12 * (costs[0] / (humanCosts[0] || 1)));
          } else {
            const prevDiff = costs[i - 1] - humanCosts[i - 1];
            const currDiff = costs[i] - humanCosts[i];
            const yearFrac = i + prevDiff / (prevDiff - currDiff);
            breakEvenMonths = Math.round(yearFrac * 12);
          }
          break;
        }
      }

      const fiveYearSavings = humanCosts[4] - costs[4];
      const roi = costs[4] > 0 ? Math.round((fiveYearSavings / costs[4]) * 100) : 0;
      const monthlySavingsAfterPayback =
        fiveYearSavings > 0 ? Math.round(fiveYearSavings / 60) : 0;

      return {
        name: robot.name,
        costs,
        fiveYearTotal: costs[4],
        fiveYearSavings,
        breakEvenMonths,
        roi,
        monthlySavingsAfterPayback,
      };
    });

    // Chart data
    const chartData = [
      {
        year: "Year 0",
        human: 0,
        ...Object.fromEntries(robotCalcs.map((r, i) => [`robot${i}`, 0])),
      },
      ...[1, 2, 3, 4, 5].map((y) => ({
        year: `Year ${y}`,
        human: Math.round(humanCosts[y - 1]),
        ...Object.fromEntries(
          robotCalcs.map((r, i) => [`robot${i}`, Math.round(r.costs[y - 1])]),
        ),
      })),
    ];

    return { humanCosts, robotCalcs, chartData, annualLabor, annualTurnover };
  }, [selectedRobots, hourlyWage, shiftsPerDay, workersReplaced, financeMode, monthlyLease]);

  // ─── Share ───
  const shareAnalysis = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("URL copied to clipboard!"))
      .catch(() => {});
  }, []);

  // ─── Email ───
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setEmailStatus("loading");
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "tco_report" }),
      });
      setEmailStatus("success");
    } catch {
      setEmailStatus("error");
    }
  }

  const { robotCalcs, chartData } = calculations;

  return (
    <div className="space-y-8">
      {/* Robot Selector */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
          Select Robots to Compare (up to 3)
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
            placeholder="Search robots by name..."
            className="w-full rounded-md border border-border bg-obsidian px-4 py-2.5 font-mono text-sm text-text-primary placeholder:text-text-ghost focus:border-electric-blue focus:outline-none"
            disabled={selectedRobots.length >= 3}
          />
          {searchLoading && (
            <div className="absolute right-3 top-3 h-4 w-4 animate-spin rounded-full border-2 border-electric-blue border-t-transparent" />
          )}
          {showDropdown && robotOptions.length > 0 && (
            <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-border bg-obsidian-elevated shadow-xl">
              {robotOptions.map((robot) => (
                <button
                  key={robot.id}
                  onClick={() => addRobot(robot)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-obsidian-hover"
                >
                  <span>
                    {robot.name}{" "}
                    <span className="text-text-tertiary">
                      — {robot.manufacturer_name}
                    </span>
                  </span>
                  {robot.price_current != null && (
                    <span className="font-mono text-xs text-blue-400">
                      ${robot.price_current.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected robots */}
        {selectedRobots.length > 0 && (
          <div className="mt-4 space-y-3">
            {selectedRobots.map((robot, i) => (
              <div
                key={robot.id}
                className="rounded-md border border-border bg-obsidian p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      {robot.name}
                    </span>
                  </span>
                  <button
                    onClick={() => removeRobot(robot.id)}
                    className="text-xs text-text-ghost transition-colors hover:text-magenta"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <NumberInput
                    label="Purchase Price"
                    value={robot.purchasePrice}
                    onChange={(v) => updateRobot(robot.id, "purchasePrice", v)}
                    prefix="$"
                  />
                  <NumberInput
                    label="Annual Maintenance"
                    value={robot.annualMaintenance}
                    onChange={(v) => updateRobot(robot.id, "annualMaintenance", v)}
                    prefix="$"
                  />
                  <NumberInput
                    label="Installation Cost"
                    value={robot.installationCost}
                    onChange={(v) => updateRobot(robot.id, "installationCost", v)}
                    prefix="$"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Labor comparison */}
        <div className="rounded-md border border-border bg-obsidian-surface p-6">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
            Human Labor Costs
          </h3>
          <div className="space-y-4">
            <Slider
              label="Hourly Wage"
              value={hourlyWage}
              min={12}
              max={75}
              step={1}
              onChange={setHourlyWage}
              prefix="$"
              suffix="/hr"
            />
            <div className="rounded-md bg-obsidian px-4 py-2.5">
              <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                Fully-loaded cost (1.3x)
              </p>
              <p className="font-mono text-sm font-bold text-text-data">
                ${(hourlyWage * 1.3).toFixed(2)}/hr
              </p>
            </div>
            <Slider
              label="Shifts per day"
              value={shiftsPerDay}
              min={1}
              max={3}
              step={1}
              onChange={setShiftsPerDay}
            />
            <Slider
              label="Workers replaced"
              value={workersReplaced}
              min={1}
              max={50}
              step={1}
              onChange={setWorkersReplaced}
            />
          </div>
        </div>

        {/* Financing */}
        <div className="rounded-md border border-border bg-obsidian-surface p-6">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
            Financing Model
          </h3>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setFinanceMode("purchase")}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                financeMode === "purchase"
                  ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                  : "border-border text-text-tertiary hover:text-text-secondary",
              )}
            >
              Purchase
            </button>
            <button
              onClick={() => setFinanceMode("lease")}
              className={cn(
                "rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                financeMode === "lease"
                  ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                  : "border-border text-text-tertiary hover:text-text-secondary",
              )}
            >
              Lease / RaaS
            </button>
          </div>
          {financeMode === "lease" && (
            <Slider
              label="Monthly lease payment"
              value={monthlyLease}
              min={500}
              max={20000}
              step={100}
              onChange={setMonthlyLease}
              prefix="$"
              suffix="/mo"
              fmt
            />
          )}
          {financeMode === "purchase" && (
            <p className="text-sm text-text-tertiary">
              Using individual robot purchase prices above. Adjust per robot as needed.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {selectedRobots.length > 0 && (
        <div className="rounded-md border border-border bg-obsidian-surface p-6 sm:p-8">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-wider text-text-ghost">
            5-Year Cost Comparison
          </h3>

          {/* Year-by-year table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-4 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost" />
                  {[1, 2, 3, 4, 5].map((y) => (
                    <th
                      key={y}
                      className="px-3 py-2 text-right font-mono text-[13px] uppercase tracking-wider text-text-ghost"
                    >
                      Year {y}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right font-mono text-[13px] uppercase tracking-wider text-text-secondary">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {robotCalcs.map((rc, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-text-secondary">
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: COLORS[i] }}
                        />
                        {rc.name.length > 20 ? rc.name.slice(0, 18) + "..." : rc.name}
                      </span>
                    </td>
                    {rc.costs.map((c, y) => {
                      const yearCost = y === 0 ? c : c - rc.costs[y - 1];
                      return (
                        <td
                          key={y}
                          className="px-3 py-2 text-right font-mono text-text-data"
                        >
                          ${yearCost.toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right font-mono font-bold text-text-data">
                      ${rc.fiveYearTotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 text-text-secondary">
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                      Human Labor
                    </span>
                  </td>
                  {calculations.humanCosts.map((c, y) => {
                    const yearCost = y === 0 ? c : c - calculations.humanCosts[y - 1];
                    return (
                      <td
                        key={y}
                        className="px-3 py-2 text-right font-mono text-text-data"
                      >
                        ${yearCost.toLocaleString()}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-right font-mono font-bold text-text-data">
                    ${calculations.humanCosts[4].toLocaleString()}
                  </td>
                </tr>
                {robotCalcs.map((rc, i) => (
                  <tr key={`savings-${i}`} className={i === robotCalcs.length - 1 ? "" : "border-b border-border/50"}>
                    <td className="py-2 pr-4 text-xs text-text-tertiary">
                      Savings ({rc.name.length > 15 ? rc.name.slice(0, 13) + "..." : rc.name})
                    </td>
                    {rc.costs.map((c, y) => {
                      const robotYear = y === 0 ? c : c - rc.costs[y - 1];
                      const humanYear =
                        y === 0
                          ? calculations.humanCosts[0]
                          : calculations.humanCosts[y] - calculations.humanCosts[y - 1];
                      const saving = humanYear - robotYear;
                      return (
                        <td
                          key={y}
                          className={cn(
                            "px-3 py-2 text-right font-mono text-sm",
                            saving > 0 ? "text-blue-400" : "text-magenta",
                          )}
                        >
                          {saving > 0 ? "+" : ""}${saving.toLocaleString()}
                        </td>
                      );
                    })}
                    <td
                      className={cn(
                        "px-3 py-2 text-right font-mono font-bold",
                        rc.fiveYearSavings > 0 ? "text-blue-400" : "text-magenta",
                      )}
                    >
                      {rc.fiveYearSavings > 0 ? "+" : ""}$
                      {rc.fiveYearSavings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="h-72 w-full sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, bottom: 5, left: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 11, fill: "#555555" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#555555" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) =>
                    v >= 1000000
                      ? `$${(v / 1000000).toFixed(1)}M`
                      : `$${(v / 1000).toFixed(0)}K`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0C0C0C",
                    border: "1px solid #1A1A1A",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#E8E8E8",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                  labelFormatter={(label) => String(label)}
                />
                {robotCalcs.map((rc, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`robot${i}`}
                    name={rc.name}
                    stroke={COLORS[i]}
                    strokeWidth={2}
                    dot={{ fill: COLORS[i], r: 3 }}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="human"
                  name="Human Labor"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={{ fill: "#60A5FA", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-text-tertiary">
            {robotCalcs.map((rc, i) => (
              <span key={i} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
                {rc.name}
              </span>
            ))}
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Human Labor
            </span>
          </div>

          {/* Summary stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {robotCalcs.map((rc, i) => (
              <div key={i} className="space-y-3">
                <p
                  className="font-mono text-[13px] uppercase tracking-wider"
                  style={{ color: COLORS[i] }}
                >
                  {rc.name}
                </p>
                <div className="rounded-md bg-obsidian px-4 py-3 text-center">
                  <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    Payback Period
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold text-blue-400">
                    {rc.breakEvenMonths != null && rc.breakEvenMonths <= 60
                      ? `${rc.breakEvenMonths}mo`
                      : "> 5yr"}
                  </p>
                </div>
                <div className="rounded-md bg-obsidian px-4 py-3 text-center">
                  <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    5-Year ROI
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-mono text-2xl font-bold",
                      rc.roi > 0 ? "text-blue-400" : "text-magenta",
                    )}
                  >
                    {rc.roi}%
                  </p>
                </div>
                <div className="rounded-md bg-obsidian px-4 py-3 text-center">
                  <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    Monthly Savings
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-text-data">
                    ${rc.monthlySavingsAfterPayback.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={shareAnalysis}
              className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-text-tertiary transition-colors hover:border-electric-blue/30 hover:text-electric-blue"
            >
              Share this analysis
            </button>
          </div>
        </div>
      )}

      {selectedRobots.length === 0 && (
        <div className="rounded-md border border-border bg-obsidian-surface p-8 text-center">
          <p className="font-mono text-sm text-text-tertiary">
            Search and select up to 3 robots above to begin your TCO comparison.
          </p>
        </div>
      )}

      {/* Email gate */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6 text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-text-ghost">
          Export Full Report
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Get a detailed TCO report with financing scenarios and ROI projections.
        </p>
        {emailStatus === "success" ? (
          <p className="mt-4 font-mono text-sm text-blue-400">Report sent to your inbox.</p>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-64 rounded-md border border-border bg-obsidian px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-ghost focus:border-electric-blue focus:outline-none"
            />
            <button
              type="submit"
              disabled={emailStatus === "loading"}
              className="rounded-md bg-electric-blue px-4 py-2 text-sm font-semibold text-obsidian transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {emailStatus === "loading" ? "..." : "Export"}
            </button>
          </form>
        )}
        {emailStatus === "error" && (
          <p className="mt-2 font-mono text-xs text-magenta">Something went wrong.</p>
        )}
      </div>
    </div>
  );
}

/* ── Slider ── */
function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = "",
  suffix = "",
  fmt = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  fmt?: boolean;
}) {
  const display = fmt
    ? value.toLocaleString()
    : Number.isInteger(step)
      ? String(value)
      : value.toFixed(2);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          {label}
        </label>
        <span className="font-mono text-sm font-bold text-text-data">
          {prefix}
          {display}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-electric-blue"
      />
    </div>
  );
}

/* ── Number Input ── */
function NumberInput({
  label,
  value,
  onChange,
  prefix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label className="mb-1 block font-mono text-[13px] uppercase tracking-wider text-text-ghost">
        {label}
      </label>
      <div className="flex items-center rounded-md border border-border bg-obsidian px-3 py-2 focus-within:border-electric-blue">
        {prefix && (
          <span className="mr-1 font-mono text-sm text-text-tertiary">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent font-mono text-sm text-text-data outline-none"
        />
      </div>
    </div>
  );
}
