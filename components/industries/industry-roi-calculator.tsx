"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
  type: "warehouse" | "medical" | "manufacturing" | "agricultural";
}

export function IndustryRoiCalculator({ type }: Props) {
  if (type === "warehouse") return <WarehouseCalculator />;
  if (type === "medical") return <MedicalCalculator />;
  if (type === "manufacturing") return <ManufacturingCalculator />;
  return <AgriculturalCalculator />;
}

function WarehouseCalculator() {
  const [sqft, setSqft] = useState(50000);
  const [workers, setWorkers] = useState(20);
  const [shifts, setShifts] = useState(1);
  const [orders, setOrders] = useState(500);

  const automatePercent = 0.20;
  const avgWage = 22;
  const workersAutomated = Math.round(workers * automatePercent);
  const annualSavings = workersAutomated * avgWage * 8 * shifts * 250;
  const recommendedType = sqft < 30000 ? "Single AMR for picking" : sqft < 100000 ? "Fleet of 5-10 AMRs" : "Full AMR fleet + sorting system";
  const estimatedInvestment = sqft < 30000 ? 80000 : sqft < 100000 ? 350000 : 1000000;
  const paybackMonths = annualSavings > 0 ? Math.ceil(estimatedInvestment / (annualSavings / 12)) : 0;

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Warehouse sq ft" value={sqft} min={5000} max={500000} step={5000} onChange={setSqft} fmt />
          <Slider label="Warehouse workers" value={workers} min={1} max={200} step={1} onChange={setWorkers} />
          <Slider label="Shifts per day" value={shifts} min={1} max={3} step={1} onChange={setShifts} />
          <Slider label="Orders per day" value={orders} min={50} max={10000} step={50} onChange={setOrders} fmt />
        </div>
        <div className="space-y-3">
          <Output label="Est. annual savings" value={`$${annualSavings.toLocaleString()}`} large />
          <Output label="Recommended system" value={recommendedType} />
          <Output label="Estimated investment" value={`$${estimatedInvestment.toLocaleString()}`} />
          <Output label="Payback period" value={paybackMonths > 0 ? `${paybackMonths} months` : "—"} color={paybackMonths <= 24 ? "text-green" : "text-amber-400"} />
        </div>
      </div>
    </CalcCard>
  );
}

function MedicalCalculator() {
  const [procedures, setProcedures] = useState(300);
  const [orTime, setOrTime] = useState(120);
  const [costPerMin, setCostPerMin] = useState(50);

  const timeSavingsPercent = 0.15;
  const minutesSaved = Math.round(procedures * orTime * timeSavingsPercent);
  const hoursSaved = Math.round(minutesSaved / 60);
  const revenueImpact = minutesSaved * costPerMin;
  const systemCost = 2000000;
  const paybackYears = revenueImpact > 0 ? (systemCost / revenueImpact).toFixed(1) : "N/A";

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Procedures per year" value={procedures} min={50} max={2000} step={10} onChange={setProcedures} fmt />
          <Slider label="Avg OR time (minutes)" value={orTime} min={30} max={480} step={10} onChange={setOrTime} />
          <Slider label="Cost per OR minute ($)" value={costPerMin} min={20} max={150} step={5} onChange={setCostPerMin} prefix="$" />
        </div>
        <div className="space-y-3">
          <Output label="OR time saved" value={`${hoursSaved} hours/year`} large />
          <Output label="Revenue impact" value={`$${revenueImpact.toLocaleString()}`} color="text-green" />
          <Output label="System investment" value="~$2M" />
          <Output label="Est. payback" value={`${paybackYears} years`} color={Number(paybackYears) <= 4 ? "text-green" : "text-amber-400"} />
        </div>
      </div>
    </CalcCard>
  );
}

function ManufacturingCalculator() {
  const [workers, setWorkers] = useState(5);
  const [wage, setWage] = useState(28);
  const [shifts, setShifts] = useState(2);
  const [robotCost, setRobotCost] = useState(75000);

  const annualLabor = workers * wage * 8 * shifts * 250;
  const productivityGain = 0.4;
  const effectiveSavings = Math.round(annualLabor * productivityGain);
  const paybackMonths = effectiveSavings > 0 ? Math.ceil(robotCost * 2 / (effectiveSavings / 12)) : 0; // 2x for total cell cost

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Workers in process" value={workers} min={1} max={50} step={1} onChange={setWorkers} />
          <Slider label="Avg hourly wage" value={wage} min={15} max={75} step={1} onChange={setWage} prefix="$" suffix="/hr" />
          <Slider label="Shifts per day" value={shifts} min={1} max={3} step={1} onChange={setShifts} />
          <Slider label="Robot cell budget" value={robotCost} min={25000} max={500000} step={5000} onChange={setRobotCost} prefix="$" fmt />
        </div>
        <div className="space-y-3">
          <Output label="Annual productivity gain" value={`$${effectiveSavings.toLocaleString()}`} large />
          <Output label="Total cell cost (est.)" value={`$${(robotCost * 2).toLocaleString()}`} />
          <Output label="Payback period" value={paybackMonths > 0 ? `${paybackMonths} months` : "—"} color={paybackMonths <= 24 ? "text-green" : "text-amber-400"} />
        </div>
      </div>
    </CalcCard>
  );
}

function AgriculturalCalculator() {
  const [acres, setAcres] = useState(500);
  const [laborers, setLaborers] = useState(10);
  const [wageDay, setWageDay] = useState(150);
  const [seasonDays, setSeasonDays] = useState(120);

  const currentLaborCost = laborers * wageDay * seasonDays;
  const robotSavingsPercent = 0.55;
  const annualSavings = Math.round(currentLaborCost * robotSavingsPercent);
  const chemicalSavings = acres * 15; // $15/acre avg chemical savings
  const totalSavings = annualSavings + chemicalSavings;
  const estimatedInvestment = acres < 200 ? 50000 : acres < 1000 ? 200000 : 500000;
  const paybackSeasons = totalSavings > 0 ? (estimatedInvestment / totalSavings).toFixed(1) : "N/A";

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Acreage" value={acres} min={50} max={10000} step={50} onChange={setAcres} fmt />
          <Slider label="Seasonal laborers" value={laborers} min={1} max={100} step={1} onChange={setLaborers} />
          <Slider label="Daily wage per laborer" value={wageDay} min={50} max={400} step={10} onChange={setWageDay} prefix="$" />
          <Slider label="Growing season (days)" value={seasonDays} min={30} max={365} step={5} onChange={setSeasonDays} />
        </div>
        <div className="space-y-3">
          <Output label="Annual labor savings" value={`$${annualSavings.toLocaleString()}`} large />
          <Output label="Chemical savings" value={`$${chemicalSavings.toLocaleString()}`} />
          <Output label="Total annual savings" value={`$${totalSavings.toLocaleString()}`} color="text-green" />
          <Output label="Payback" value={`${paybackSeasons} seasons`} color={Number(paybackSeasons) <= 2 ? "text-green" : "text-amber-400"} />
        </div>
      </div>
    </CalcCard>
  );
}

// ─── Shared components ───
function CalcCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-blue/20 bg-white/[0.03] p-6 shadow-[0_0_60px_rgba(0,194,255,0.05)] backdrop-blur-sm sm:p-8">
      {children}
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, prefix = "", suffix = "", fmt = false }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string; fmt?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider text-white/40">{label}</label>
        <span className="font-mono text-sm font-bold text-white">{prefix}{fmt ? value.toLocaleString() : value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue" />
    </div>
  );
}

function Output({ label, value, large, color }: { label: string; value: string; large?: boolean; color?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-4 py-4">
      <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">{label}</p>
      <p className={cn("mt-1 font-mono font-bold", large ? "text-[clamp(24px,3vw,40px)]" : "text-lg", color || "text-green")}>{value}</p>
    </div>
  );
}
