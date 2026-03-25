"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
  robotName: string;
  robotPrice: number | null;
  robotSlug: string;
}

export function RoiCalculatorStandalone({ robotName, robotPrice, robotSlug }: Props) {
  const [workers, setWorkers] = useState(2);
  const [wage, setWage] = useState(25);
  const [shifts, setShifts] = useState(1);
  const [price, setPrice] = useState(robotPrice || 50000);

  const annualLaborSaved = workers * wage * 8 * shifts * 250;
  const monthlyLaborSaved = Math.round(annualLaborSaved / 12);
  const paybackMonths = annualLaborSaved > 0 ? Math.ceil(price / (annualLaborSaved / 12)) : 0;
  const threeYearROI = price > 0 ? Math.round(((annualLaborSaved * 3 - price) / price) * 100) : 0;
  const fiveYearSavings = Math.round(annualLaborSaved * 5 - price);

  const shareRoi = useCallback(() => {
    const params = new URLSearchParams({ w: String(workers), h: String(wage), s: String(shifts), p: String(price) });
    const url = `${window.location.origin}/explore/${robotSlug}?${params}#roi`;
    navigator.clipboard.writeText(url).then(() => alert("ROI link copied to clipboard!"));
  }, [workers, wage, shifts, price, robotSlug]);

  return (
    <div className="rounded-xl border border-border bg-white p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-foreground">ROI Calculator</h3>
      <p className="mb-6 text-xs text-neutral-400">Estimate your return on investing in {robotName}</p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          <SliderInput label="Workers replaced" value={workers} min={1} max={20} step={1} onChange={setWorkers} suffix="" />
          <SliderInput label="Average hourly wage" value={wage} min={15} max={75} step={1} onChange={setWage} prefix="$" suffix="/hr" />
          <SliderInput label="Shifts per day" value={shifts} min={1} max={3} step={1} onChange={setShifts} suffix="" />
          <SliderInput label="Robot price" value={price} min={1000} max={2000000} step={1000} onChange={setPrice} prefix="$" suffix="" fmt />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <OutputCard label="Monthly labor savings" value={`$${monthlyLaborSaved.toLocaleString()}`} color="text-green" />
          <OutputCard label="Payback period" value={fmtPayback(paybackMonths)} color={paybackMonths <= 18 ? "text-green" : paybackMonths <= 36 ? "text-amber-500" : "text-orange"} />
          <OutputCard label="3-year net ROI" value={`${threeYearROI}%`} color={threeYearROI > 0 ? "text-blue" : "text-orange"} />
          <OutputCard label="5-year total savings" value={fiveYearSavings > 0 ? `$${fiveYearSavings.toLocaleString()}` : fiveYearSavings === 0 ? "$0" : `-$${Math.abs(fiveYearSavings).toLocaleString()}`} color={fiveYearSavings > 0 ? "text-foreground" : "text-orange"} />

          <button onClick={shareRoi} className="mt-2 w-full rounded-lg border border-border py-2 text-xs font-medium text-neutral-500 transition-colors hover:border-blue hover:text-blue">
            Share your ROI calculation
          </button>
        </div>
      </div>
    </div>
  );
}

function fmtPayback(months: number): string {
  if (months <= 0) return "—";
  if (months > 360) return "Not viable at this scale";
  if (months > 60) {
    const years = Math.round(months / 12);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
  return `${months} months`;
}

function SliderInput({ label, value, min, max, step, onChange, prefix = "", suffix = "", fmt = false }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string; fmt?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-neutral-500">{label}</label>
        <span className="font-mono text-sm font-semibold text-foreground">{prefix}{fmt ? value.toLocaleString() : value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-green" />
    </div>
  );
}

function OutputCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg bg-neutral-50 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{label}</p>
      <p className={cn("mt-0.5 font-mono text-xl font-bold", color)}>{value}</p>
    </div>
  );
}
