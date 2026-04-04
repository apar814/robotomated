"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RobotType = "amr" | "cleaning" | "security" | "delivery" | "arm" | "humanoid";
type Tab = "compare" | "roi" | "raas";

interface RobotTypeOption {
  key: RobotType;
  label: string;
  icon: string;
  price: number;
  raasLow: number;
  raasHigh: number;
}

const ROBOT_TYPES: RobotTypeOption[] = [
  { key: "amr",      label: "Warehouse AMR", icon: "AMR",  price: 40000, raasLow: 8,  raasHigh: 20 },
  { key: "cleaning", label: "Cleaning",      icon: "CLN",  price: 25000, raasLow: 5,  raasHigh: 15 },
  { key: "security", label: "Security",      icon: "SEC",  price: 30000, raasLow: 5,  raasHigh: 15 },
  { key: "delivery", label: "Delivery",      icon: "DLV",  price: 20000, raasLow: 6,  raasHigh: 18 },
  { key: "arm",      label: "Assembly Arm",  icon: "ARM",  price: 60000, raasLow: 12, raasHigh: 25 },
  { key: "humanoid", label: "Humanoid",      icon: "HMN",  price: 50000, raasLow: 10, raasHigh: 30 },
];

const RAAS_TABLE = [
  { robot: "Digit (Agility)",    type: "Humanoid",  hourly: "$10-30",  monthly: "$1,600-4,800", source: "Company website" },
  { robot: "TUG (Aethon)",       type: "Hospital",  hourly: "--",      monthly: "$3,500",       source: "Industry report" },
  { robot: "Relay (Savioke)",    type: "Hotel",     hourly: "--",      monthly: "$2,000",       source: "Company website" },
  { robot: "Generic AMR",        type: "Warehouse", hourly: "$8-20",   monthly: "$1,500-3,000", source: "Market data" },
  { robot: "Generic Cleaning",   type: "Cleaning",  hourly: "$5-15",   monthly: "$1,000-2,000", source: "Market data" },
];

/* ------------------------------------------------------------------ */
/*  Metadata (exported separately since "use client")                  */
/* ------------------------------------------------------------------ */

// generateMetadata must be in a server component — we set title via <title> tag
// and provide an adjacent layout.tsx or rely on parent layout metadata.

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtCurrency(n: number): string {
  return "$" + fmt(Math.round(n));
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function RobotEconomicsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("compare");
  const [robotType, setRobotType] = useState<RobotType>("amr");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [laborRate, setLaborRate] = useState(25);

  // ROI tab extras
  const [productivity, setProductivity] = useState(90);
  const [maintenancePct, setMaintenancePct] = useState(10);
  const [trainingCost, setTrainingCost] = useState(3000);

  const selected = ROBOT_TYPES.find((r) => r.key === robotType)!;

  /* ---- Compare calculations ---- */
  const compare = useMemo(() => {
    const annualHumanCost = laborRate * hoursPerDay * daysPerWeek * 52;
    const monthlyHumanCost = annualHumanCost / 12;

    // BUY
    const buyPrice = selected.price;
    const buyMonthly = buyPrice / 60;
    const buyAnnual = buyMonthly * 12;
    const buySavings = annualHumanCost - buyAnnual;
    const buyPaybackMonths = monthlyHumanCost > 0
      ? Math.ceil(buyPrice / monthlyHumanCost)
      : Infinity;

    // LEASE (36-month, 15% premium)
    const leaseMonthly = (buyPrice * 1.15) / 36;
    const leaseAnnual = leaseMonthly * 12;
    const leaseTotalCost = leaseMonthly * 36;
    const leaseVsBuySaves = buyPrice - leaseTotalCost;

    // HIRE (RaaS)
    const hireHourlyMid = (selected.raasLow + selected.raasHigh) / 2;
    const hireMonthly = hireHourlyMid * hoursPerDay * daysPerWeek * 4.33;
    const hireAnnual = hireMonthly * 12;

    // Determine best option
    const options = [
      { key: "buy" as const, annual: buyAnnual },
      { key: "lease" as const, annual: leaseAnnual },
      { key: "hire" as const, annual: hireAnnual },
    ];
    const best = options.reduce((a, b) => (a.annual < b.annual ? a : b)).key;
    const bestAnnual = Math.min(buyAnnual, leaseAnnual, hireAnnual);

    return {
      annualHumanCost,
      buyPrice, buyMonthly, buyAnnual, buySavings, buyPaybackMonths,
      leaseMonthly, leaseAnnual, leaseTotalCost, leaseVsBuySaves,
      hireHourlyMid, hireMonthly, hireAnnual,
      best, bestAnnual,
      raasLow: selected.raasLow,
      raasHigh: selected.raasHigh,
    };
  }, [robotType, hoursPerDay, daysPerWeek, laborRate, selected]);

  /* ---- ROI calculations ---- */
  const roi = useMemo(() => {
    const annualHumanCost = laborRate * hoursPerDay * daysPerWeek * 52;
    const effectiveOutput = productivity / 100;
    const annualMaintenance = selected.price * (maintenancePct / 100);
    const annualRobotCost = (selected.price / 5) + annualMaintenance;
    const effectiveRobotOutput = annualHumanCost * effectiveOutput;
    const annualNetBenefit = effectiveRobotOutput - annualRobotCost;
    const totalInvestment = selected.price + trainingCost;

    // NPV (discount rate 10%, 5 years)
    const discountRate = 0.10;
    let npv = -totalInvestment;
    const cashFlows: number[] = [];
    for (let y = 1; y <= 5; y++) {
      const cf = annualNetBenefit;
      cashFlows.push(cf);
      npv += cf / Math.pow(1 + discountRate, y);
    }

    // Simple IRR approximation via bisection
    let irrLow = -0.5;
    let irrHigh = 5.0;
    let irr = 0;
    for (let i = 0; i < 50; i++) {
      irr = (irrLow + irrHigh) / 2;
      let val = -totalInvestment;
      for (let y = 1; y <= 5; y++) {
        val += cashFlows[y - 1] / Math.pow(1 + irr, y);
      }
      if (val > 0) irrLow = irr;
      else irrHigh = irr;
    }

    // Payback
    let cumulative = -totalInvestment;
    let paybackYear = 0;
    for (let y = 1; y <= 5; y++) {
      cumulative += cashFlows[y - 1];
      if (cumulative >= 0 && paybackYear === 0) paybackYear = y;
    }

    return {
      totalInvestment,
      annualRobotCost,
      effectiveRobotOutput,
      annualNetBenefit,
      annualMaintenance,
      npv,
      irr: irr * 100,
      paybackYear,
      cashFlows,
    };
  }, [robotType, hoursPerDay, daysPerWeek, laborRate, productivity, maintenancePct, trainingCost, selected]);

  /* ---------------------------------------------------------------- */
  /*  Styles (CSS custom properties)                                   */
  /* ---------------------------------------------------------------- */

  const s = {
    page: {
      color: "var(--theme-text-primary)",
      background: "var(--theme-bg)",
      minHeight: "100vh",
    } as React.CSSProperties,
    hero: {
      borderBottom: "1px solid var(--theme-border)",
      padding: "3rem 1rem 2rem",
    } as React.CSSProperties,
    h1: {
      fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
      fontWeight: 700,
      lineHeight: 1.15,
      color: "var(--theme-text-primary)",
    } as React.CSSProperties,
    subtitle: {
      marginTop: "0.75rem",
      color: "var(--theme-text-secondary)",
      fontSize: "1.05rem",
      maxWidth: "640px",
    } as React.CSSProperties,
    section: {
      padding: "2rem 1rem",
      maxWidth: "1100px",
      margin: "0 auto",
    } as React.CSSProperties,
    card: {
      background: "var(--theme-card)",
      border: "1px solid var(--theme-border)",
      borderRadius: "8px",
      padding: "1.25rem",
    } as React.CSSProperties,
    label: {
      display: "block",
      fontSize: "0.8rem",
      fontWeight: 600,
      color: "var(--theme-text-muted)",
      marginBottom: "0.35rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
    } as React.CSSProperties,
    value: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "var(--theme-text-primary)",
    } as React.CSSProperties,
    muted: {
      color: "var(--theme-text-muted)",
      fontSize: "0.85rem",
    } as React.CSSProperties,
    accent: {
      color: "var(--theme-accent-blue)",
    } as React.CSSProperties,
    lime: {
      color: "var(--theme-accent-lime)",
    } as React.CSSProperties,
  };

  /* ---------------------------------------------------------------- */
  /*  Tab buttons                                                      */
  /* ---------------------------------------------------------------- */

  const tabs: { key: Tab; label: string }[] = [
    { key: "compare", label: "Compare Options" },
    { key: "roi", label: "ROI Deep Dive" },
    { key: "raas", label: "RaaS Pricing" },
  ];

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div style={s.page}>
      {/* Page title for SEO (client component fallback) */}
      <title>Robot Economics Calculator -- Buy vs Lease vs Hire | Robotomated</title>
      <meta name="description" content="Calculate the ROI of buying, leasing, or hiring robots for your business. Compare costs, payback periods, and find the most cost-effective automation path." />

      {/* Hero */}
      <section style={s.hero}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 style={s.h1}>The Robot Economics Calculator</h1>
          <p style={s.subtitle}>
            See exactly what a robot costs your business -- and how quickly it pays for itself.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ ...s.section, paddingBottom: 0 }}>
        <div style={{ display: "flex", gap: "0.25rem", borderBottom: "1px solid var(--theme-border)", marginBottom: "1.5rem" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.6rem 1.25rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                background: activeTab === t.key ? "var(--theme-card)" : "transparent",
                color: activeTab === t.key ? "var(--theme-accent-blue)" : "var(--theme-text-muted)",
                border: activeTab === t.key ? "1px solid var(--theme-border)" : "1px solid transparent",
                borderBottom: activeTab === t.key ? "1px solid var(--theme-card)" : "1px solid transparent",
                borderRadius: "6px 6px 0 0",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Compare Options */}
      {activeTab === "compare" && (
        <div style={s.section}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            {/* Inputs */}
            <div>
              {/* Robot type selector */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={s.label}>Robot Type</span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.5rem" }}>
                  {ROBOT_TYPES.map((rt) => (
                    <button
                      key={rt.key}
                      onClick={() => setRobotType(rt.key)}
                      style={{
                        padding: "0.75rem 0.5rem",
                        borderRadius: "6px",
                        border: robotType === rt.key
                          ? "2px solid var(--theme-accent-blue)"
                          : "1px solid var(--theme-border)",
                        background: robotType === rt.key ? "var(--theme-card)" : "transparent",
                        color: robotType === rt.key ? "var(--theme-accent-blue)" : "var(--theme-text-secondary)",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem", fontFamily: "monospace" }}>
                        {rt.icon}
                      </div>
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                {/* Hours per day */}
                <div>
                  <label style={s.label}>
                    Hours per day: <strong style={s.accent}>{hoursPerDay}h</strong>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={24}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--theme-accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...s.muted }}>
                    <span>2h</span><span>24h</span>
                  </div>
                </div>

                {/* Days per week */}
                <div>
                  <span style={s.label}>Days per week</span>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {[5, 6, 7].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDaysPerWeek(d)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: daysPerWeek === d
                            ? "2px solid var(--theme-accent-blue)"
                            : "1px solid var(--theme-border)",
                          background: daysPerWeek === d ? "var(--theme-card)" : "transparent",
                          color: daysPerWeek === d ? "var(--theme-accent-blue)" : "var(--theme-text-secondary)",
                          fontWeight: 600,
                          cursor: "pointer",
                          fontSize: "0.9rem",
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hourly labor rate */}
                <div>
                  <label style={s.label}>
                    Hourly labor rate: <strong style={s.accent}>${laborRate}</strong>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    value={laborRate}
                    onChange={(e) => setLaborRate(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--theme-accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...s.muted }}>
                    <span>$10</span><span>$150</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results: 3 option cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>

              {/* BUY card */}
              <div style={{ ...s.card, position: "relative" }}>
                {compare.best === "buy" && <RecommendedBadge />}
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                  Buy
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <Row label="Robot price" value={fmtCurrency(compare.buyPrice)} />
                  <Row label="Monthly (amortized 5yr)" value={fmtCurrency(compare.buyMonthly)} />
                  <Row label="Annual cost" value={fmtCurrency(compare.buyAnnual)} />
                  <Row
                    label="vs Human savings"
                    value={fmtCurrency(compare.buySavings)}
                    valueStyle={{ color: compare.buySavings > 0 ? "var(--theme-accent-lime)" : "var(--theme-text-primary)" }}
                  />
                  <Row label="Payback" value={`${compare.buyPaybackMonths} months`} />
                </div>
                <Link
                  href="/explore"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "1.25rem",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    background: "var(--theme-accent-blue)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Explore robots to buy
                </Link>
              </div>

              {/* LEASE card */}
              <div style={{ ...s.card, position: "relative" }}>
                {compare.best === "lease" && <RecommendedBadge />}
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                  Lease
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <Row label="Monthly (36-mo term)" value={fmtCurrency(compare.leaseMonthly)} />
                  <Row label="Annual cost" value={fmtCurrency(compare.leaseAnnual)} />
                  <Row
                    label="vs Buy"
                    value={compare.leaseVsBuySaves < 0 ? `${fmtCurrency(Math.abs(compare.leaseVsBuySaves))} premium` : "Preserves capital"}
                    valueStyle={{ color: "var(--theme-text-muted)" }}
                    sub="Preserves capital"
                  />
                </div>
                <Link
                  href="/lease/quote"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "1.25rem",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    background: "var(--theme-accent-blue)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Get lease quotes
                </Link>
              </div>

              {/* HIRE (RoboWork) card */}
              <div style={{ ...s.card, position: "relative" }}>
                {compare.best === "hire" && <RecommendedBadge />}
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                  Hire (RoboWork)
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  <Row label="Per hour" value={`$${compare.raasLow}-${compare.raasHigh}`} />
                  <Row label="Est. monthly" value={fmtCurrency(compare.hireMonthly)} />
                  <Row label="Annual cost" value={fmtCurrency(compare.hireAnnual)} />
                  <Row label="Best for" value="Projects under 6 months" valueStyle={{ fontSize: "0.85rem" }} />
                </div>
                <Link
                  href="/robowork/post"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "1.25rem",
                    padding: "0.6rem",
                    borderRadius: "6px",
                    background: "var(--theme-accent-blue)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  Post a job
                </Link>
              </div>
            </div>

            {/* Human vs Robot comparison bar */}
            <div style={s.card}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                Annual Cost Comparison
              </h3>
              <ComparisonBar
                label="Human worker"
                value={compare.annualHumanCost}
                maxValue={Math.max(compare.annualHumanCost, compare.bestAnnual)}
                color="var(--theme-text-muted)"
              />
              <div style={{ height: "0.75rem" }} />
              <ComparisonBar
                label={`Robot (${compare.best})`}
                value={compare.bestAnnual}
                maxValue={Math.max(compare.annualHumanCost, compare.bestAnnual)}
                color="var(--theme-accent-lime)"
              />
              {compare.annualHumanCost > compare.bestAnnual && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--theme-accent-lime)", fontWeight: 600 }}>
                  Save {fmtCurrency(compare.annualHumanCost - compare.bestAnnual)}/year with robot automation
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROI Deep Dive */}
      {activeTab === "roi" && (
        <div style={s.section}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            {/* Additional inputs */}
            <div style={s.card}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                Additional Parameters
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                <div>
                  <label style={s.label}>
                    Robot productivity: <strong style={s.accent}>{productivity}%</strong>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={150}
                    value={productivity}
                    onChange={(e) => setProductivity(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--theme-accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...s.muted }}>
                    <span>50%</span><span>150%</span>
                  </div>
                </div>
                <div>
                  <label style={s.label}>
                    Annual maintenance: <strong style={s.accent}>{maintenancePct}%</strong> of price
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={25}
                    value={maintenancePct}
                    onChange={(e) => setMaintenancePct(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--theme-accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...s.muted }}>
                    <span>2%</span><span>25%</span>
                  </div>
                </div>
                <div>
                  <label style={s.label}>
                    Training cost: <strong style={s.accent}>{fmtCurrency(trainingCost)}</strong>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={15000}
                    step={500}
                    value={trainingCost}
                    onChange={(e) => setTrainingCost(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--theme-accent-blue)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", ...s.muted }}>
                    <span>$0</span><span>$15,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <div style={s.card}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                5-Year Investment Analysis
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <tbody>
                    <TableRow label="Robot purchase price" value={fmtCurrency(selected.price)} />
                    <TableRow label="Training cost" value={fmtCurrency(trainingCost)} />
                    <TableRow label="Total investment" value={fmtCurrency(roi.totalInvestment)} bold />
                    <TableRow label="" value="" spacer />
                    <TableRow label="Annual depreciation (5yr straight-line)" value={fmtCurrency(selected.price / 5)} />
                    <TableRow label="Annual maintenance" value={fmtCurrency(roi.annualMaintenance)} />
                    <TableRow label="Total annual robot cost" value={fmtCurrency(roi.annualRobotCost)} bold />
                    <TableRow label="" value="" spacer />
                    <TableRow label={`Robot output value (${productivity}% of human equivalent)`} value={fmtCurrency(roi.effectiveRobotOutput)} />
                    <TableRow label="Annual net benefit" value={fmtCurrency(roi.annualNetBenefit)} bold highlight={roi.annualNetBenefit > 0} />
                    <TableRow label="" value="" spacer />
                    <TableRow label="NPV (10% discount, 5yr)" value={fmtCurrency(roi.npv)} bold highlight={roi.npv > 0} />
                    <TableRow label="Estimated IRR" value={`${roi.irr.toFixed(1)}%`} bold highlight={roi.irr > 10} />
                    <TableRow label="Payback period" value={roi.paybackYear > 0 ? `Year ${roi.paybackYear}` : "Not within 5 years"} bold />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cash flow by year */}
            <div style={s.card}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
                Year-by-Year Cash Flow
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Year</th>
                      <th style={thStyle}>Cash Flow</th>
                      <th style={thStyle}>Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}>0</td>
                      <td style={{ ...tdStyle, color: "var(--theme-text-primary)" }}>{fmtCurrency(-roi.totalInvestment)}</td>
                      <td style={{ ...tdStyle, color: "var(--theme-text-primary)" }}>{fmtCurrency(-roi.totalInvestment)}</td>
                    </tr>
                    {roi.cashFlows.map((cf, i) => {
                      let cumulative = -roi.totalInvestment;
                      for (let j = 0; j <= i; j++) cumulative += roi.cashFlows[j];
                      return (
                        <tr key={i}>
                          <td style={tdStyle}>{i + 1}</td>
                          <td style={{ ...tdStyle, color: cf >= 0 ? "var(--theme-accent-lime)" : "var(--theme-text-primary)" }}>
                            {fmtCurrency(cf)}
                          </td>
                          <td style={{ ...tdStyle, color: cumulative >= 0 ? "var(--theme-accent-lime)" : "var(--theme-text-primary)" }}>
                            {fmtCurrency(cumulative)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RaaS Pricing */}
      {activeTab === "raas" && (
        <div style={s.section}>
          <div style={s.card}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--theme-text-primary)", marginBottom: "1rem" }}>
              Known Robot-as-a-Service Pricing
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Robot</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>$/hour</th>
                    <th style={thStyle}>$/month</th>
                    <th style={thStyle}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {RAAS_TABLE.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: "var(--theme-text-primary)" }}>{row.robot}</td>
                      <td style={tdStyle}>{row.type}</td>
                      <td style={tdStyle}>{row.hourly}</td>
                      <td style={tdStyle}>{row.monthly}</td>
                      <td style={{ ...tdStyle, fontStyle: "italic" }}>{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--theme-text-secondary)" }}>
              Price not listed?{" "}
              <Link
                href="/robowork/post"
                style={{ color: "var(--theme-accent-blue)", textDecoration: "underline", fontWeight: 600 }}
              >
                Post a job on RoboWork
              </Link>{" "}
              and let RSPs bid.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function RecommendedBadge() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-0.6rem",
        right: "1rem",
        background: "var(--theme-accent-lime)",
        color: "#0A0F1E",
        fontSize: "0.65rem",
        fontWeight: 700,
        padding: "0.2rem 0.6rem",
        borderRadius: "4px",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      RECOMMENDED
    </div>
  );
}

function Row({
  label,
  value,
  valueStyle,
  sub,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
  sub?: string;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: "0.8rem", color: "var(--theme-text-muted)" }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--theme-text-primary)", ...valueStyle }}>
          {value}
        </span>
        {sub && <div style={{ fontSize: "0.7rem", color: "var(--theme-text-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const pct = maxValue > 0 ? Math.max((value / maxValue) * 100, 2) : 2;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
        <span style={{ color: "var(--theme-text-secondary)" }}>{label}</span>
        <span style={{ fontWeight: 700, color: "var(--theme-text-primary)" }}>{fmtCurrency(value)}/year</span>
      </div>
      <div style={{ height: "1.25rem", borderRadius: "4px", background: "var(--theme-border)", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "4px",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}

function TableRow({
  label,
  value,
  bold,
  highlight,
  spacer,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
  spacer?: boolean;
}) {
  if (spacer) {
    return (
      <tr>
        <td colSpan={2} style={{ padding: "0.5rem 0" }} />
      </tr>
    );
  }
  return (
    <tr>
      <td
        style={{
          padding: "0.45rem 0.5rem",
          borderBottom: "1px solid var(--theme-border)",
          color: "var(--theme-text-secondary)",
          fontWeight: bold ? 600 : 400,
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "0.45rem 0.5rem",
          borderBottom: "1px solid var(--theme-border)",
          textAlign: "right",
          fontWeight: bold ? 700 : 400,
          color: highlight ? "var(--theme-accent-lime)" : "var(--theme-text-primary)",
        }}
      >
        {value}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared table styles                                                */
/* ------------------------------------------------------------------ */

const thStyle: React.CSSProperties = {
  padding: "0.6rem 0.5rem",
  textAlign: "left",
  borderBottom: "2px solid var(--theme-border)",
  color: "var(--theme-text-muted)",
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "0.5rem",
  borderBottom: "1px solid var(--theme-border)",
  color: "var(--theme-text-secondary)",
};
