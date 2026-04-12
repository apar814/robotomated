"use client";

import { useState } from "react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface ValuationResult {
  low: number;
  mid: number;
  high: number;
  factors: {
    age_factor: number;
    condition_factor: number;
    hours_factor: number;
  };
  recommendation: string;
}

const CONDITION_LABELS: Record<number, { label: string; description: string }> = {
  1: { label: "Poor", description: "Major issues, significant wear, may need extensive repair" },
  2: { label: "Fair", description: "Functional but with notable wear, some repairs needed" },
  3: { label: "Good", description: "Normal wear for age, fully operational, minor cosmetic issues" },
  4: { label: "Very Good", description: "Light use, well-maintained, minimal wear" },
  5: { label: "Excellent", description: "Like new, minimal hours, no visible wear" },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

export default function TradeInPage() {
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [yearPurchased, setYearPurchased] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [condition, setCondition] = useState(3);
  const [knownIssues, setKnownIssues] = useState("");
  const [softwareVersion, setSoftwareVersion] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStep("loading");

    try {
      const res = await fetch("/api/trade-in/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manufacturer,
          model,
          year_purchased: Number(yearPurchased),
          purchase_price: Number(purchasePrice),
          operating_hours: Number(operatingHours),
          condition,
          known_issues: knownIssues,
          software_version: softwareVersion,
          location,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Valuation failed");
      }

      const data: ValuationResult = await res.json();
      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("form");
    }
  }

  function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    // In production this would send the full report via email
    setEmailSent(true);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Trade-In", href: "/trade-in" },
        ]}
      />

      <section className="mt-8 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
          [ TRADE-IN VALUATOR ]
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          What is your robot worth today?
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Get an instant AI-powered valuation in 60 seconds.
        </p>
      </section>

      {error && (
        <div className="mt-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {step === "form" && (
        <section className="mt-12">
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl border border-white/10 p-8 sm:p-12"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="manufacturer" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Manufacturer
                </label>
                <input
                  id="manufacturer"
                  type="text"
                  required
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Fanuc, ABB, KUKA"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="model" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Model
                </label>
                <input
                  id="model"
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. CRX-10iA, UR10e"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="yearPurchased" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Year Purchased
                </label>
                <input
                  id="yearPurchased"
                  type="number"
                  required
                  min="2000"
                  max="2026"
                  value={yearPurchased}
                  onChange={(e) => setYearPurchased(e.target.value)}
                  placeholder="2022"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="purchasePrice" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Purchase Price (USD)
                </label>
                <input
                  id="purchasePrice"
                  type="number"
                  required
                  min="0"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="50000"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="operatingHours" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Operating Hours
                </label>
                <input
                  id="operatingHours"
                  type="number"
                  required
                  min="0"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="12000"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="softwareVersion" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Software Version
                </label>
                <input
                  id="softwareVersion"
                  type="text"
                  value={softwareVersion}
                  onChange={(e) => setSoftwareVersion(e.target.value)}
                  placeholder="Optional"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Condition: {CONDITION_LABELS[condition].label}
                </label>
                <p className="text-xs text-muted">
                  {CONDITION_LABELS[condition].description}
                </p>
                <div className="mt-2 flex gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCondition(val)}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg border font-display font-bold transition-colors ${
                        condition === val
                          ? "border-[#00C2FF] bg-[#00C2FF]/20 text-[#00C2FF]"
                          : "border-white/10 text-muted hover:border-white/30"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="knownIssues" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Known Issues
                </label>
                <textarea
                  id="knownIssues"
                  rows={3}
                  value={knownIssues}
                  onChange={(e) => setKnownIssues(e.target.value)}
                  placeholder="Describe any known issues or repairs needed (optional)"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="location" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#00C2FF] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80"
                >
                  Get Valuation
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      {step === "loading" && (
        <section className="mt-12 text-center">
          <div className="glass mx-auto max-w-md rounded-2xl border border-white/10 p-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#00C2FF]" />
            <p className="mt-6 font-display text-lg text-white">
              Calculating valuation...
            </p>
            <p className="mt-2 text-sm text-muted">
              Analyzing market data, depreciation curves, and comparable sales.
            </p>
          </div>
        </section>
      )}

      {step === "result" && result && (
        <section className="mt-12 space-y-8">
          <div className="glass rounded-2xl border border-white/10 p-8 text-center sm:p-12">
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              [ VALUATION RESULT ]
            </p>
            <h2 className="mt-2 font-display text-lg font-semibold text-muted">
              Estimated Market Value
            </h2>
            <div className="mt-4 flex items-end justify-center gap-6">
              <div>
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-muted">Low</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-white/60">
                  {formatCurrency(result.low)}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-[#00E5A0]">Mid</p>
                <p className="font-[family-name:var(--font-mono)] text-4xl font-bold text-[#00E5A0]">
                  {formatCurrency(result.mid)}
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-muted">High</p>
                <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-white/60">
                  {formatCurrency(result.high)}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">
              {manufacturer} {model} -- {yearPurchased} -- {operatingHours} hours
            </p>
          </div>

          <div className="glass rounded-2xl border border-white/10 p-8">
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              [ ANALYSIS ]
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold text-white">
              Valuation Factors
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 p-4">
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-muted">Age Factor</p>
                <p className="mt-1 font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                  {formatPercent(result.factors.age_factor)}
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#00C2FF]"
                    style={{ width: `${result.factors.age_factor * 100}%` }}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-muted">Condition Factor</p>
                <p className="mt-1 font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                  {formatPercent(result.factors.condition_factor)}
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#7B2FFF]"
                    style={{ width: `${result.factors.condition_factor * 100}%` }}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-white/10 p-4">
                <p className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-muted">Hours Factor</p>
                <p className="mt-1 font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                  {formatPercent(result.factors.hours_factor)}
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-[#00E5A0]"
                    style={{ width: `${result.factors.hours_factor * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="glass rounded-xl border border-white/10 p-6">
              <h4 className="font-display font-semibold text-white">
                Keep It
              </h4>
              <p className="mt-2 text-sm text-muted">
                Your robot still has productive life. Consider investing in
                maintenance to extend its operational value before trading in.
              </p>
            </div>
            <div className="glass rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-6">
              <h4 className="font-display font-semibold text-[#00E5A0]">
                Trade In
              </h4>
              <p className="mt-2 text-sm text-muted">
                List your robot on the Robotomated CPO marketplace and put the
                value toward an upgrade. We handle certification and matching.
              </p>
            </div>
            <div className="glass rounded-xl border border-white/10 p-6">
              <h4 className="font-display font-semibold text-white">
                Lease Transfer
              </h4>
              <p className="mt-2 text-sm text-muted">
                Transfer your remaining lease to another operator. Avoid early
                termination fees and help someone get started with automation.
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/10 p-8 text-center">
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              [ FULL REPORT ]
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold text-white">
              Get the Full Report
            </h3>
            <p className="mt-2 text-sm text-muted">
              Receive a detailed valuation report with comparable sales,
              depreciation projections, and recommended next steps.
            </p>
            {emailSent ? (
              <p className="mt-6 font-display text-[#00E5A0]">
                Report sent. Check your inbox.
              </p>
            ) : (
              <form
                onSubmit={handleEmailCapture}
                className="mx-auto mt-6 flex max-w-md gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#7B2FFF] px-6 py-3 font-display font-semibold text-white transition-colors hover:bg-[#7B2FFF]/80"
                >
                  Send Report
                </button>
              </form>
            )}
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setResult(null);
              }}
              className="text-sm text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              Start a new valuation
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
