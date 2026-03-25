"use client";

import { useState, useCallback, useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { cn } from "@/lib/utils/cn";

export function TcoCalculatorClient() {
  // ─── Robot Inputs ───
  const [purchasePrice, setPurchasePrice] = useState(75000);
  const [installPercent, setInstallPercent] = useState(20);
  const [maintenancePercent, setMaintenancePercent] = useState(10);
  const [trainingCost, setTrainingCost] = useState(3000);
  const [operators, setOperators] = useState(2);
  const [wattsUsage, setWattsUsage] = useState(500);
  const [hoursPerDay, setHoursPerDay] = useState(16);
  const [electricityRate, setElectricityRate] = useState(0.12);
  const [downtimePercent, setDowntimePercent] = useState(5);
  const [softwareFee, setSoftwareFee] = useState(200);

  // ─── Human Inputs ───
  const [workersReplaced, setWorkersReplaced] = useState(3);
  const [hourlyWage, setHourlyWage] = useState(22);
  const [overheadMultiplier] = useState(1.3);
  const [turnoverCost, setTurnoverCost] = useState(4000);
  const [shifts, setShifts] = useState(2);

  // ─── Calculations ───
  const calculations = useMemo(() => {
    const installCost = purchasePrice * (installPercent / 100);
    const annualMaintenance = purchasePrice * (maintenancePercent / 100);
    const totalTraining = trainingCost * operators;
    const annualEnergy = (wattsUsage / 1000) * hoursPerDay * 365 * electricityRate;
    const annualDowntime = purchasePrice * (downtimePercent / 100) * 0.3; // 30% of downtime-adjusted value
    const annualSoftware = softwareFee * 12;

    // Robot year-by-year cumulative cost
    const robotCosts: number[] = [];
    for (let year = 1; year <= 5; year++) {
      const prev = year === 1 ? 0 : robotCosts[year - 2];
      const yearCost = year === 1
        ? purchasePrice + installCost + totalTraining + annualMaintenance + annualEnergy + annualDowntime + annualSoftware
        : annualMaintenance + annualEnergy + annualDowntime + annualSoftware;
      robotCosts.push(prev + yearCost);
    }

    // Human year-by-year cumulative cost
    const fullyLoaded = hourlyWage * overheadMultiplier;
    const annualLaborPerWorker = fullyLoaded * 8 * shifts * 250;
    const annualLabor = annualLaborPerWorker * workersReplaced;
    const annualTurnover = turnoverCost * workersReplaced * 0.3; // 30% turnover rate

    const humanCosts: number[] = [];
    for (let year = 1; year <= 5; year++) {
      const prev = year === 1 ? 0 : humanCosts[year - 2];
      humanCosts.push(prev + annualLabor + annualTurnover);
    }

    // Chart data
    const chartData = [
      { year: "Year 0", robot: 0, human: 0 },
      ...robotCosts.map((cost, i) => ({
        year: `Year ${i + 1}`,
        robot: Math.round(cost),
        human: Math.round(humanCosts[i]),
      })),
    ];

    // Break-even point (interpolated)
    let breakEvenYear: number | null = null;
    for (let i = 0; i < 5; i++) {
      if (robotCosts[i] <= humanCosts[i] && (i === 0 || robotCosts[i - 1] > humanCosts[i - 1])) {
        if (i === 0) {
          breakEvenYear = 1;
        } else {
          const prevDiff = robotCosts[i - 1] - humanCosts[i - 1];
          const currDiff = robotCosts[i] - humanCosts[i];
          breakEvenYear = i + prevDiff / (prevDiff - currDiff);
        }
        break;
      }
    }

    const fiveYearSavings = humanCosts[4] - robotCosts[4];
    const fiveYearRobotTotal = robotCosts[4];
    const fiveYearHumanTotal = humanCosts[4];

    return { chartData, breakEvenYear, fiveYearSavings, fiveYearRobotTotal, fiveYearHumanTotal, robotCosts, humanCosts };
  }, [purchasePrice, installPercent, maintenancePercent, trainingCost, operators, wattsUsage, hoursPerDay, electricityRate, downtimePercent, softwareFee, workersReplaced, hourlyWage, overheadMultiplier, turnoverCost, shifts]);

  // ─── Share ───
  const shareAnalysis = useCallback(() => {
    const params = new URLSearchParams({
      pp: String(purchasePrice), ip: String(installPercent), mp: String(maintenancePercent),
      tc: String(trainingCost), op: String(operators), w: String(wattsUsage),
      hd: String(hoursPerDay), er: String(electricityRate), dp: String(downtimePercent),
      sf: String(softwareFee), wr: String(workersReplaced), hw: String(hourlyWage),
      to: String(turnoverCost), sh: String(shifts),
    });
    const url = `${window.location.origin}/tools/tco-calculator?${params}`;
    navigator.clipboard.writeText(url).then(() => alert("Analysis URL copied to clipboard!"));
  }, [purchasePrice, installPercent, maintenancePercent, trainingCost, operators, wattsUsage, hoursPerDay, electricityRate, downtimePercent, softwareFee, workersReplaced, hourlyWage, turnoverCost, shifts]);

  const { chartData, breakEvenYear, fiveYearSavings } = calculations;

  return (
    <div className="space-y-8">
      {/* Input sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Robot costs */}
        <div className="rounded-2xl border border-blue/20 bg-white/[0.03] p-6">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-white">
            <svg className="h-5 w-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            Robot Costs
          </h3>
          <div className="space-y-4">
            <Slider label="Purchase price" value={purchasePrice} min={5000} max={2000000} step={5000} onChange={setPurchasePrice} prefix="$" fmt />
            <Slider label="Installation & integration" value={installPercent} min={5} max={50} step={1} onChange={setInstallPercent} suffix="% of purchase" />
            <Slider label="Annual maintenance" value={maintenancePercent} min={3} max={20} step={1} onChange={setMaintenancePercent} suffix="% of purchase" />
            <Slider label="Training cost per operator" value={trainingCost} min={500} max={10000} step={500} onChange={setTrainingCost} prefix="$" fmt />
            <Slider label="Number of operators" value={operators} min={1} max={10} step={1} onChange={setOperators} />
            <Slider label="Power consumption (watts)" value={wattsUsage} min={50} max={5000} step={50} onChange={setWattsUsage} suffix="W" fmt />
            <Slider label="Operating hours per day" value={hoursPerDay} min={4} max={24} step={1} onChange={setHoursPerDay} suffix="hrs" />
            <Slider label="Electricity rate" value={electricityRate} min={0.05} max={0.40} step={0.01} onChange={setElectricityRate} prefix="$" suffix="/kWh" />
            <Slider label="Estimated downtime" value={downtimePercent} min={1} max={20} step={1} onChange={setDowntimePercent} suffix="%" />
            <Slider label="Software/subscription fee" value={softwareFee} min={0} max={2000} step={50} onChange={setSoftwareFee} prefix="$" suffix="/mo" />
          </div>
        </div>

        {/* Human labor costs */}
        <div className="rounded-2xl border border-green/20 bg-white/[0.03] p-6">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-white">
            <svg className="h-5 w-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Human Labor Costs
          </h3>
          <div className="space-y-4">
            <Slider label="Workers replaced" value={workersReplaced} min={1} max={50} step={1} onChange={setWorkersReplaced} />
            <Slider label="Hourly wage" value={hourlyWage} min={12} max={75} step={1} onChange={setHourlyWage} prefix="$" suffix="/hr" />
            <div className="rounded-lg bg-white/[0.03] px-4 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-white/30">Fully-loaded cost (1.3x)</p>
              <p className="font-mono text-sm font-bold text-white">${(hourlyWage * 1.3).toFixed(2)}/hr</p>
            </div>
            <Slider label="Annual turnover cost" value={turnoverCost} min={1000} max={10000} step={500} onChange={setTurnoverCost} prefix="$" suffix="/worker" fmt />
            <Slider label="Shifts per day" value={shifts} min={1} max={3} step={1} onChange={setShifts} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 sm:p-8">
        <h3 className="mb-6 font-display text-xl font-bold text-white">5-Year Cost Comparison</h3>

        {/* Chart */}
        <div className="h-72 w-full sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 5, left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3E" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#8892A4" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#8892A4" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#141B2D", border: "1px solid #1E2A3E", borderRadius: "8px", fontSize: "12px", color: "#F0F2F5" }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                labelFormatter={(label) => String(label)}
              />
              {breakEvenYear != null && breakEvenYear <= 5 && (
                <ReferenceLine x={`Year ${Math.ceil(breakEvenYear)}`} stroke="#00E5A0" strokeDasharray="5 5" label={{ value: "Break-even", position: "top", fill: "#00E5A0", fontSize: 11 }} />
              )}
              <Line type="monotone" dataKey="robot" name="robot" stroke="#00C2FF" strokeWidth={2.5} dot={{ fill: "#00C2FF", r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="human" name="human" stroke="#00E5A0" strokeWidth={2.5} dot={{ fill: "#00E5A0", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-white/50">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue" /> Robot TCO</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green" /> Human Labor</span>
        </div>

        {/* Summary stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white/[0.04] px-5 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">5-Year Savings</p>
            <p className={cn("mt-1 font-mono text-3xl font-bold", fiveYearSavings > 0 ? "text-green" : "text-orange")}>
              {fiveYearSavings > 0 ? `$${fiveYearSavings.toLocaleString()}` : `-$${Math.abs(fiveYearSavings).toLocaleString()}`}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.04] px-5 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">Break-Even Point</p>
            <p className="mt-1 font-mono text-3xl font-bold text-white">
              {breakEvenYear != null && breakEvenYear <= 5 ? `${breakEvenYear.toFixed(1)} yr` : "> 5 yr"}
            </p>
          </div>
          <div className="rounded-xl bg-white/[0.04] px-5 py-4 text-center">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/30">5-Year Robot TCO</p>
            <p className="mt-1 font-mono text-3xl font-bold text-blue">
              ${calculations.fiveYearRobotTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Share button */}
        <div className="mt-6 text-center">
          <button onClick={shareAnalysis} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-white/50 transition-colors hover:border-blue/30 hover:text-blue">
            Share this analysis
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Slider ───
function Slider({ label, value, min, max, step, onChange, prefix = "", suffix = "", fmt = false }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string; fmt?: boolean;
}) {
  const display = fmt ? value.toLocaleString() : (Number.isInteger(step) ? String(value) : value.toFixed(2));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider text-white/40">{label}</label>
        <span className="font-mono text-sm font-bold text-white">{prefix}{display}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-blue" />
    </div>
  );
}
