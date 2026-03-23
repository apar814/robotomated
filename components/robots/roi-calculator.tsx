"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface RoiCalculatorProps {
  price: number | null;
  priceLeaseMonthly: number | null;
  priceType: string | null;
  integrationCost: number | null;
  trainingCost: number | null;
  annualMaintenance: number | null;
  laborReplacedFte: number | null;
  powerConsumptionWatts: number | null;
  robotName: string;
}

export function RoiCalculator({
  price, priceLeaseMonthly, priceType, integrationCost, trainingCost,
  annualMaintenance, laborReplacedFte, powerConsumptionWatts, robotName,
}: RoiCalculatorProps) {
  const [laborRate, setLaborRate] = useState(22);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const fte = laborReplacedFte || 0;
  const annualLaborReplaced = laborRate * hoursPerDay * daysPerWeek * 52 * fte;

  const robotCost = priceType === "lease" || priceType === "raas"
    ? (priceLeaseMonthly || 0) * 12
    : price || 0;
  const integration = integrationCost || 0;
  const training = trainingCost || 0;
  const totalFirstYear = (priceType === "lease" || priceType === "raas")
    ? robotCost + integration + training
    : robotCost + integration + training;

  const electricityCost = powerConsumptionWatts
    ? Math.round((powerConsumptionWatts / 1000) * hoursPerDay * daysPerWeek * 52 * 0.12)
    : 0;
  const annualOperating = (annualMaintenance || 0) + electricityCost;

  const annualNetSavings = annualLaborReplaced - annualOperating;
  const paybackMonths = annualNetSavings > 0
    ? Math.round((totalFirstYear / annualNetSavings) * 12)
    : null;

  const fiveYearSavings = (priceType === "lease" || priceType === "raas")
    ? (annualLaborReplaced * 5) - (robotCost * 5 + integration + training + annualOperating * 5)
    : (annualLaborReplaced * 5) - (totalFirstYear + annualOperating * 4);

  const roiPositive = fiveYearSavings > 0;

  if (fte <= 0) return null;

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-lg font-bold">ROI Calculator</h3>
      <p className="mt-1 text-xs text-muted">Estimate your return on investment for {robotName}</p>

      {/* Inputs */}
      <div className="mt-5 space-y-4">
        <SliderInput label="Labor cost per hour" value={laborRate} min={10} max={80} step={1} unit="$/hr" onChange={setLaborRate} />
        <SliderInput label="Hours per day" value={hoursPerDay} min={4} max={24} step={1} unit="hrs" onChange={setHoursPerDay} />
        <SliderInput label="Days per week" value={daysPerWeek} min={1} max={7} step={1} unit="days" onChange={setDaysPerWeek} />
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-5">
        <ResultRow label="Annual labor cost replaced" value={annualLaborReplaced} color="text-green" />
        <ResultRow label={priceType === "lease" || priceType === "raas" ? "First-year cost (lease + setup)" : "First-year cost (purchase + setup)"} value={totalFirstYear} color="text-foreground" />
        <ResultRow label="Annual operating cost" value={annualOperating} color="text-muted" detail={electricityCost > 0 ? `(maintenance + ~$${electricityCost} electricity)` : undefined} />

        <div className="border-t border-white/[0.06] pt-3">
          {paybackMonths !== null ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Payback period</span>
              <span className={cn("font-mono text-lg font-bold", paybackMonths <= 12 ? "text-green" : paybackMonths <= 24 ? "text-blue" : "text-orange")}>
                {paybackMonths} months
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Payback period</span>
              <span className="text-sm text-orange">N/A (no net savings)</span>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">5-Year Net Savings</span>
            <span className={cn("font-mono text-xl font-bold", roiPositive ? "text-green" : "text-orange")}>
              {roiPositive ? "+" : ""}{formatCurrency(fiveYearSavings)}
            </span>
          </div>
          {roiPositive && paybackMonths !== null && (
            <p className="mt-1 text-xs text-muted">
              Pays for itself in {paybackMonths} months, then saves ~{formatCurrency(annualNetSavings)}/year
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-muted/50">
        Estimates based on {fte} FTE replaced. Actual results vary by deployment. Does not include tax benefits or depreciation.
      </p>
    </div>
  );
}

function SliderInput({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="font-mono text-xs font-semibold">{unit === "$/hr" ? `$${value}` : `${value} ${unit}`}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue"
      />
    </div>
  );
}

function ResultRow({ label, value, color, detail }: { label: string; value: number; color: string; detail?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm text-muted">{label}</span>
        {detail && <span className="ml-1 text-[10px] text-muted/50">{detail}</span>}
      </div>
      <span className={cn("font-mono text-sm font-semibold", color)}>{formatCurrency(value)}</span>
    </div>
  );
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}$${abs.toLocaleString()}`;
  return `${sign}$${abs}`;
}
