"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Props {
  type: "warehouse" | "medical" | "manufacturing" | "agricultural" | "construction" | "delivery" | "security" | "hospitality" | "eldercare";
}

export function IndustryRoiCalculator({ type }: Props) {
  if (type === "warehouse") return <WarehouseCalculator />;
  if (type === "medical") return <MedicalCalculator />;
  if (type === "manufacturing") return <ManufacturingCalculator />;
  if (type === "agricultural") return <AgriculturalCalculator />;
  if (type === "construction") return <ConstructionCalculator />;
  if (type === "delivery") return <DeliveryCalculator />;
  if (type === "security") return <SecurityCalculator />;
  if (type === "hospitality") return <HospitalityCalculator />;
  return <EldercareCalculator />;
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
          <Output label="Payback period" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 24 ? "text-white" : "text-white"} />
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
          <Output label="Revenue impact" value={`$${revenueImpact.toLocaleString()}`} color="text-white" />
          <Output label="System investment" value="~$2M" />
          <Output label="Est. payback" value={`${paybackYears} years`} color={Number(paybackYears) <= 4 ? "text-white" : "text-white"} />
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
          <Output label="Payback period" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 24 ? "text-white" : "text-white"} />
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
          <Output label="Total annual savings" value={`$${totalSavings.toLocaleString()}`} color="text-white" />
          <Output label="Payback" value={`${paybackSeasons} seasons`} color={Number(paybackSeasons) <= 2 ? "text-white" : "text-white"} />
        </div>
      </div>
    </CalcCard>
  );
}

function ConstructionCalculator() {
  const [projectValue, setProjectValue] = useState(5000000);
  const [crewSize, setCrewSize] = useState(30);
  const [avgWage, setAvgWage] = useState(35);
  const [projectMonths, setProjectMonths] = useState(12);

  const totalLaborCost = crewSize * avgWage * 8 * 22 * projectMonths;
  const productivityGain = 0.25;
  const laborSavings = Math.round(totalLaborCost * productivityGain);
  const reworkReduction = Math.round(projectValue * 0.02); // 2% rework savings
  const totalSavings = laborSavings + reworkReduction;
  const robotInvestment = crewSize < 20 ? 150000 : crewSize < 50 ? 400000 : 800000;
  const paybackMonths = totalSavings > 0 ? Math.ceil(robotInvestment / (totalSavings / projectMonths)) : 0;

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Project value" value={projectValue} min={500000} max={50000000} step={500000} onChange={setProjectValue} prefix="$" fmt />
          <Slider label="Crew size" value={crewSize} min={5} max={200} step={1} onChange={setCrewSize} />
          <Slider label="Avg hourly wage" value={avgWage} min={20} max={80} step={1} onChange={setAvgWage} prefix="$" suffix="/hr" />
          <Slider label="Project duration (months)" value={projectMonths} min={1} max={36} step={1} onChange={setProjectMonths} />
        </div>
        <div className="space-y-3">
          <Output label="Labor productivity savings" value={`$${laborSavings.toLocaleString()}`} large />
          <Output label="Rework cost savings" value={`$${reworkReduction.toLocaleString()}`} />
          <Output label="Total project savings" value={`$${totalSavings.toLocaleString()}`} color="text-white" />
          <Output label="Equipment investment" value={`$${robotInvestment.toLocaleString()}`} />
          <Output label="Payback" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 18 ? "text-white" : "text-white"} />
        </div>
      </div>
    </CalcCard>
  );
}

function DeliveryCalculator() {
  const [dailyDeliveries, setDailyDeliveries] = useState(100);
  const [humanCostPerDelivery, setHumanCostPerDelivery] = useState(10);
  const [robotCount, setRobotCount] = useState(5);
  const [operatingDays, setOperatingDays] = useState(300);

  const annualHumanCost = dailyDeliveries * humanCostPerDelivery * operatingDays;
  const robotCostPerDelivery = 2.5;
  const annualRobotOpCost = dailyDeliveries * robotCostPerDelivery * operatingDays;
  const annualSavings = annualHumanCost - annualRobotOpCost;
  const fleetInvestment = robotCount * 25000;
  const paybackMonths = annualSavings > 0 ? Math.ceil(fleetInvestment / (annualSavings / 12)) : 0;

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Daily deliveries" value={dailyDeliveries} min={20} max={1000} step={10} onChange={setDailyDeliveries} fmt />
          <Slider label="Current cost per delivery" value={humanCostPerDelivery} min={3} max={20} step={1} onChange={setHumanCostPerDelivery} prefix="$" />
          <Slider label="Robot fleet size" value={robotCount} min={1} max={50} step={1} onChange={setRobotCount} />
          <Slider label="Operating days per year" value={operatingDays} min={200} max={365} step={5} onChange={setOperatingDays} />
        </div>
        <div className="space-y-3">
          <Output label="Annual delivery savings" value={`$${annualSavings.toLocaleString()}`} large />
          <Output label="Fleet investment" value={`$${fleetInvestment.toLocaleString()}`} />
          <Output label="Robot cost per delivery" value={`$${robotCostPerDelivery.toFixed(2)}`} />
          <Output label="Payback" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 18 ? "text-white" : "text-white"} />
        </div>
      </div>
    </CalcCard>
  );
}

function SecurityCalculator() {
  const [guardShifts, setGuardShifts] = useState(3);
  const [guardHourlyRate, setGuardHourlyRate] = useState(25);
  const [facilitySize, setFacilitySize] = useState(100000);

  const annualGuardCost = guardShifts * guardHourlyRate * 8 * 365;
  const robotRaasPerHour = 8;
  const annualRobotCost = robotRaasPerHour * 24 * 365; // 24/7 coverage
  const annualSavings = annualGuardCost - annualRobotCost;
  const coverageMultiplier = facilitySize < 50000 ? "2x" : facilitySize < 200000 ? "3x" : "5x";

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Guard shifts per day" value={guardShifts} min={1} max={6} step={1} onChange={setGuardShifts} />
          <Slider label="Guard hourly rate" value={guardHourlyRate} min={15} max={50} step={1} onChange={setGuardHourlyRate} prefix="$" suffix="/hr" />
          <Slider label="Facility size (sq ft)" value={facilitySize} min={10000} max={1000000} step={10000} onChange={setFacilitySize} fmt />
        </div>
        <div className="space-y-3">
          <Output label="Annual guard cost" value={`$${annualGuardCost.toLocaleString()}`} />
          <Output label="Annual robot cost (RaaS)" value={`$${annualRobotCost.toLocaleString()}`} />
          <Output label="Annual savings" value={`$${Math.max(0, annualSavings).toLocaleString()}`} large color="text-white" />
          <Output label="Coverage improvement" value={coverageMultiplier} />
        </div>
      </div>
    </CalcCard>
  );
}

function HospitalityCalculator() {
  const [rooms, setRooms] = useState(200);
  const [deliveriesPerDay, setDeliveriesPerDay] = useState(40);
  const [staffHourlyRate, setStaffHourlyRate] = useState(18);

  const minutesPerDelivery = 12; // avg human time per room delivery
  const annualDeliveries = deliveriesPerDay * 365;
  const annualStaffHours = (annualDeliveries * minutesPerDelivery) / 60;
  const annualStaffCost = annualStaffHours * staffHourlyRate;
  const robotsNeeded = Math.ceil(deliveriesPerDay / 40);
  const robotInvestment = robotsNeeded * 25000;
  const annualRobotMaintenance = robotsNeeded * 3000;
  const annualSavings = annualStaffCost - annualRobotMaintenance;
  const paybackMonths = annualSavings > 0 ? Math.ceil(robotInvestment / (annualSavings / 12)) : 0;

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Hotel rooms" value={rooms} min={50} max={1000} step={10} onChange={setRooms} fmt />
          <Slider label="Room deliveries per day" value={deliveriesPerDay} min={10} max={200} step={5} onChange={setDeliveriesPerDay} />
          <Slider label="Staff hourly rate" value={staffHourlyRate} min={12} max={40} step={1} onChange={setStaffHourlyRate} prefix="$" suffix="/hr" />
        </div>
        <div className="space-y-3">
          <Output label="Annual delivery labor cost" value={`$${Math.round(annualStaffCost).toLocaleString()}`} />
          <Output label="Robots needed" value={`${robotsNeeded}`} />
          <Output label="Annual savings" value={`$${Math.round(annualSavings).toLocaleString()}`} large color="text-white" />
          <Output label="Payback" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 12 ? "text-white" : "text-white"} />
        </div>
      </div>
    </CalcCard>
  );
}

function EldercareCalculator() {
  const [residents, setResidents] = useState(100);
  const [staffPerResident, setStaffPerResident] = useState(0.5);
  const [staffHourlyRate, setStaffHourlyRate] = useState(20);

  const totalStaff = Math.round(residents * staffPerResident);
  const monitoringHoursPerDay = 2; // hours per staff member on monitoring tasks
  const annualMonitoringCost = totalStaff * monitoringHoursPerDay * staffHourlyRate * 365;
  const robotEfficiency = 0.6; // 60% of monitoring tasks automated
  const annualSavings = Math.round(annualMonitoringCost * robotEfficiency);
  const fallCostAvoidance = Math.round(residents * 0.3 * 35000 * 0.5); // 30% fall rate, $35K avg cost, 50% reduction
  const totalBenefit = annualSavings + fallCostAvoidance;
  const systemCost = residents < 50 ? 75000 : residents < 200 ? 200000 : 500000;
  const paybackMonths = totalBenefit > 0 ? Math.ceil(systemCost / (totalBenefit / 12)) : 0;

  return (
    <CalcCard>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-5">
          <Slider label="Number of residents" value={residents} min={10} max={500} step={5} onChange={setResidents} fmt />
          <Slider label="Staff-to-resident ratio" value={staffPerResident} min={0.2} max={1.0} step={0.1} onChange={setStaffPerResident} />
          <Slider label="Staff hourly rate" value={staffHourlyRate} min={12} max={40} step={1} onChange={setStaffHourlyRate} prefix="$" suffix="/hr" />
        </div>
        <div className="space-y-3">
          <Output label="Monitoring labor savings" value={`$${annualSavings.toLocaleString()}`} />
          <Output label="Fall cost avoidance" value={`$${fallCostAvoidance.toLocaleString()}`} />
          <Output label="Total annual benefit" value={`$${totalBenefit.toLocaleString()}`} large color="text-white" />
          <Output label="System investment" value={`$${systemCost.toLocaleString()}`} />
          <Output label="Payback" value={paybackMonths > 0 ? `${paybackMonths} months` : "\u2014"} color={paybackMonths <= 18 ? "text-white" : "text-white"} />
        </div>
      </div>
    </CalcCard>
  );
}

// --- Shared components ---
function CalcCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/[0.03] p-6 backdrop-blur-sm sm:p-8">
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
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-white" />
    </div>
  );
}

function Output({ label, value, large, color }: { label: string; value: string; large?: boolean; color?: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-4 py-4">
      <p className="text-[13px] font-medium uppercase tracking-widest text-white/50">{label}</p>
      <p className={cn("mt-1 font-mono font-bold", large ? "text-[clamp(24px,3vw,40px)]" : "text-lg", color || "text-white")}>{value}</p>
    </div>
  );
}
