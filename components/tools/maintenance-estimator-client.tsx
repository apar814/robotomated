"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";

const CATEGORIES = [
  { value: "warehouse", label: "Warehouse & Logistics", maintenancePct: 0.08 },
  { value: "manufacturing", label: "Manufacturing", maintenancePct: 0.1 },
  { value: "medical", label: "Healthcare", maintenancePct: 0.12 },
  { value: "construction", label: "Construction", maintenancePct: 0.1 },
  { value: "agricultural", label: "Agriculture", maintenancePct: 0.09 },
  { value: "delivery", label: "Delivery", maintenancePct: 0.07 },
  { value: "drone", label: "Drones", maintenancePct: 0.06 },
  { value: "consumer", label: "Consumer", maintenancePct: 0.05 },
];

type MaintenanceModel = "in_house" | "service_contract" | "none";

export function MaintenanceEstimatorClient() {
  const [fleetSize, setFleetSize] = useState(5);
  const [category, setCategory] = useState("warehouse");
  const [avgRobotValue, setAvgRobotValue] = useState(75000);
  const [maintenanceModel, setMaintenanceModel] = useState<MaintenanceModel>("service_contract");

  const catData = CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];
  const maintenancePctLow = catData.maintenancePct - 0.02;
  const maintenancePctHigh = catData.maintenancePct + 0.02;

  const results = useMemo(() => {
    const totalFleetValue = fleetSize * avgRobotValue;

    // Annual maintenance cost range
    const annualLow = Math.round(totalFleetValue * maintenancePctLow);
    const annualHigh = Math.round(totalFleetValue * maintenancePctHigh);

    // In-house costs
    const techsNeeded = Math.max(1, Math.ceil(fleetSize / 12));
    const techSalary = 75000; // avg
    const techSalaryLow = 65000;
    const techSalaryHigh = 85000;
    const partsBudget = Math.round(totalFleetValue * 0.03);
    const trainingCost = techsNeeded * 5000;
    const toolsEquipment = techsNeeded * 8000; // one-time, amortized over 5 years
    const toolsAnnual = Math.round(toolsEquipment / 5);

    const inHouseAnnualLow = techsNeeded * techSalaryLow + partsBudget + trainingCost + toolsAnnual;
    const inHouseAnnualHigh = techsNeeded * techSalaryHigh + partsBudget + trainingCost + toolsAnnual;

    // Service contract costs
    const contractPctLow = 0.08;
    const contractPctHigh = 0.15;
    const contractAnnualLow = Math.round(totalFleetValue * contractPctLow);
    const contractAnnualHigh = Math.round(totalFleetValue * contractPctHigh);

    // 5-year totals
    const inHouse5YearLow = inHouseAnnualLow * 5 + toolsEquipment; // add upfront tools
    const inHouse5YearHigh = inHouseAnnualHigh * 5 + toolsEquipment;
    const contract5YearLow = contractAnnualLow * 5;
    const contract5YearHigh = contractAnnualHigh * 5;

    // Break-even: when does in-house become cheaper?
    // In-house has fixed costs (salary, tools) that don't scale linearly
    // Contract scales linearly with fleet value
    // At what fleet size does in-house win?
    const inHousePerRobot = (techSalary + partsBudget / fleetSize + trainingCost / fleetSize + toolsAnnual / fleetSize);
    const contractPerRobot = avgRobotValue * ((contractPctLow + contractPctHigh) / 2);
    const breakEvenFleetSize = contractPerRobot > 0
      ? Math.ceil(techSalary / (contractPerRobot - partsBudget / fleetSize))
      : null;

    return {
      annualLow,
      annualHigh,
      techsNeeded,
      techSalaryLow,
      techSalaryHigh,
      partsBudget,
      trainingCost,
      toolsAnnual,
      toolsEquipment,
      inHouseAnnualLow,
      inHouseAnnualHigh,
      contractAnnualLow,
      contractAnnualHigh,
      inHouse5YearLow,
      inHouse5YearHigh,
      contract5YearLow,
      contract5YearHigh,
      breakEvenFleetSize: breakEvenFleetSize != null && breakEvenFleetSize > 0 && breakEvenFleetSize < 200 ? breakEvenFleetSize : null,
    };
  }, [fleetSize, category, avgRobotValue, maintenancePctLow, maintenancePctHigh]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
          Fleet Configuration
        </h3>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-wider text-text-ghost">
              Fleet Size
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={fleetSize}
              onChange={(e) => setFleetSize(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
              className="w-full rounded-md border border-border bg-obsidian px-4 py-2.5 font-mono text-sm text-text-data focus:border-white/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-wider text-text-ghost">
              Average Robot Value
            </label>
            <div className="flex items-center rounded-md border border-border bg-obsidian px-3 py-2.5 focus-within:border-white/50">
              <span className="mr-1 font-mono text-sm text-text-tertiary">$</span>
              <input
                type="number"
                value={avgRobotValue}
                onChange={(e) => setAvgRobotValue(Number(e.target.value) || 0)}
                className="w-full bg-transparent font-mono text-sm text-text-data outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-wider text-text-ghost">
              Robot Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-border bg-obsidian px-4 py-2.5 font-mono text-sm text-text-data focus:border-white/50 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-wider text-text-ghost">
              Current Maintenance Model
            </label>
            <select
              value={maintenanceModel}
              onChange={(e) => setMaintenanceModel(e.target.value as MaintenanceModel)}
              className="w-full rounded-md border border-border bg-obsidian px-4 py-2.5 font-mono text-sm text-text-data focus:border-white/50 focus:outline-none"
            >
              <option value="in_house">In-House Team</option>
              <option value="service_contract">Service Contract</option>
              <option value="none">None (Planning)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Annual Maintenance Estimate */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
          Annual Maintenance Cost Estimate
        </h3>
        <div className="flex items-end justify-center gap-2">
          <span className="font-mono text-3xl font-bold text-white">
            ${results.annualLow.toLocaleString()}
          </span>
          <span className="pb-1 font-mono text-sm text-text-tertiary">to</span>
          <span className="font-mono text-3xl font-bold text-white">
            ${results.annualHigh.toLocaleString()}
          </span>
          <span className="pb-1 font-mono text-sm text-text-ghost">/year</span>
        </div>
        <p className="mt-2 text-center font-mono text-[13px] text-text-ghost">
          Based on {Math.round(maintenancePctLow * 100)}–{Math.round(maintenancePctHigh * 100)}% of total fleet value (${(fleetSize * avgRobotValue).toLocaleString()})
        </p>
      </div>

      {/* In-house vs Service Contract Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* In-house */}
        <div className={cn(
          "rounded-md border bg-obsidian-surface p-6",
          maintenanceModel === "in_house" ? "border-white/20" : "border-border",
        )}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white">
              In-House Team
            </h3>
            {maintenanceModel === "in_house" && (
              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[13px] text-white">
                CURRENT
              </span>
            )}
          </div>
          <div className="space-y-3">
            <CostRow
              label={`Technician salaries (${results.techsNeeded}x)`}
              low={results.techsNeeded * results.techSalaryLow}
              high={results.techsNeeded * results.techSalaryHigh}
            />
            <CostRow label="Parts budget" value={results.partsBudget} />
            <CostRow label="Training" value={results.trainingCost} />
            <CostRow label="Tools & equipment (annualized)" value={results.toolsAnnual} />
            <div className="border-t border-border pt-3">
              <CostRow
                label="Annual Total"
                low={results.inHouseAnnualLow}
                high={results.inHouseAnnualHigh}
                bold
              />
            </div>
            <div className="mt-2 rounded-md bg-obsidian px-4 py-3 text-center">
              <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                5-Year Total
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-text-data">
                ${results.inHouse5YearLow.toLocaleString()} – ${results.inHouse5YearHigh.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Service Contract */}
        <div className={cn(
          "rounded-md border bg-obsidian-surface p-6",
          maintenanceModel === "service_contract" ? "border-white/20" : "border-border",
        )}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-xs uppercase tracking-wider text-white">
              Service Contract
            </h3>
            {maintenanceModel === "service_contract" && (
              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[13px] text-white">
                CURRENT
              </span>
            )}
          </div>
          <div className="space-y-3">
            <CostRow
              label="Annual contract (8–15% of fleet value)"
              low={results.contractAnnualLow}
              high={results.contractAnnualHigh}
            />
            <div className="mt-2 space-y-1 text-xs text-text-tertiary">
              <p>Response time SLA: 4–24 hours typical</p>
              <p>Parts: usually included in contract</p>
              <p>No hiring or training overhead</p>
            </div>
            <div className="border-t border-border pt-3">
              <CostRow
                label="Annual Total"
                low={results.contractAnnualLow}
                high={results.contractAnnualHigh}
                bold
              />
            </div>
            <div className="mt-2 rounded-md bg-obsidian px-4 py-3 text-center">
              <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                5-Year Total
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-text-data">
                ${results.contract5YearLow.toLocaleString()} – ${results.contract5YearHigh.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Staffing Recommendation */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
          Staffing Recommendation
        </h3>
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            For a fleet of{" "}
            <span className="font-mono font-bold text-text-data">{fleetSize}</span>{" "}
            robots, you need
          </p>
          <p className="mt-2 font-mono text-4xl font-bold text-white">
            {results.techsNeeded}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            maintenance technician{results.techsNeeded > 1 ? "s" : ""}
          </p>
          <p className="mt-3 font-mono text-[13px] text-text-ghost">
            Rule of thumb: 1 technician per 10–15 robots
          </p>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="rounded-md border border-border bg-obsidian-surface p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-text-ghost">
          In-House vs. Service Contract Break-Even
        </h3>
        <div className="text-center">
          {results.breakEvenFleetSize != null ? (
            <>
              <p className="text-sm text-text-secondary">
                In-house maintenance becomes more cost-effective at
              </p>
              <p className="mt-2 font-mono text-3xl font-bold text-white">
                {results.breakEvenFleetSize}+ robots
              </p>
              <p className="mt-2 text-sm text-text-tertiary">
                {fleetSize >= results.breakEvenFleetSize
                  ? "Your fleet is large enough that in-house maintenance may be more cost-effective."
                  : `You need ${results.breakEvenFleetSize - fleetSize} more robot${results.breakEvenFleetSize - fleetSize > 1 ? "s" : ""} before in-house makes financial sense.`}
              </p>
            </>
          ) : (
            <p className="text-sm text-text-tertiary">
              Service contracts are generally more cost-effective for your fleet configuration.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CostRow({
  label,
  value,
  low,
  high,
  bold = false,
}: {
  label: string;
  value?: number;
  low?: number;
  high?: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm", bold ? "font-semibold text-text-primary" : "text-text-secondary")}>
        {label}
      </span>
      <span className={cn("font-mono text-sm", bold ? "font-bold text-text-data" : "text-text-data")}>
        {value != null
          ? `$${value.toLocaleString()}`
          : low != null && high != null
            ? `$${low.toLocaleString()} – $${high.toLocaleString()}`
            : "—"}
      </span>
    </div>
  );
}
