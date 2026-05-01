"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { useSiteStats } from "@/lib/context/site-stats";

/* ── Industry → Use Case mapping ── */
const INDUSTRY_OPTIONS: { value: string; label: string; code: string }[] = [
  { value: "warehouse", label: "Warehouse & Logistics", code: "WRH" },
  { value: "manufacturing", label: "Manufacturing", code: "MFG" },
  { value: "medical", label: "Healthcare / Medical", code: "MED" },
  { value: "construction", label: "Construction", code: "CON" },
  { value: "agricultural", label: "Agriculture", code: "AGR" },
  { value: "delivery", label: "Delivery / Last-Mile", code: "DEL" },
  { value: "drone", label: "Drones & Aerial", code: "UAV" },
  { value: "consumer", label: "Home / Consumer", code: "HME" },
];

const USE_CASES: Record<string, { value: string; label: string }[]> = {
  warehouse: [
    { value: "picking", label: "Picking & Sorting" },
    { value: "transport", label: "Material Transport" },
    { value: "palletizing", label: "Palletizing" },
    { value: "inventory", label: "Inventory Management" },
  ],
  manufacturing: [
    { value: "assembly", label: "Assembly" },
    { value: "welding", label: "Welding" },
    { value: "inspection", label: "Quality Inspection" },
    { value: "material_handling", label: "Material Handling" },
  ],
  medical: [
    { value: "surgery", label: "Surgery / Rehabilitation" },
    { value: "pharmacy", label: "Pharmacy Automation" },
    { value: "disinfection", label: "Disinfection" },
    { value: "logistics", label: "Hospital Logistics" },
  ],
  construction: [
    { value: "demolition", label: "Demolition" },
    { value: "surveying", label: "Surveying & Mapping" },
    { value: "bricklaying", label: "Bricklaying / 3D Printing" },
    { value: "inspection", label: "Structural Inspection" },
  ],
  agricultural: [
    { value: "harvesting", label: "Harvesting" },
    { value: "weeding", label: "Weeding & Spraying" },
    { value: "monitoring", label: "Crop Monitoring" },
    { value: "planting", label: "Planting & Seeding" },
  ],
  delivery: [
    { value: "last_mile", label: "Last-Mile Delivery" },
    { value: "in_facility", label: "In-Facility Transport" },
    { value: "food_delivery", label: "Food Delivery" },
    { value: "parcel", label: "Parcel Sorting" },
  ],
  drone: [
    { value: "aerial_inspection", label: "Aerial Inspection" },
    { value: "mapping", label: "Mapping & Surveying" },
    { value: "delivery_drone", label: "Drone Delivery" },
    { value: "photography", label: "Photography / Video" },
  ],
  consumer: [
    { value: "cleaning", label: "Cleaning" },
    { value: "lawn_care", label: "Lawn Care" },
    { value: "companion", label: "Companion / Education" },
    { value: "security", label: "Home Security" },
  ],
};

const BUDGET_OPTIONS = [
  { value: "under10k", label: "Under $10K", min: 0, max: 10000 },
  { value: "10k-50k", label: "$10K – $50K", min: 10000, max: 50000 },
  { value: "50k-200k", label: "$50K – $200K", min: 50000, max: 200000 },
  { value: "200k-plus", label: "$200K+", min: 200000, max: Infinity },
];

const UNIT_OPTIONS = [
  { value: "1", label: "1 unit" },
  { value: "2-5", label: "2–5 units" },
  { value: "6-20", label: "6–20 units" },
  { value: "20+", label: "20+ units" },
];

const TECH_OPTIONS = [
  { value: "low", label: "Low — need full support" },
  { value: "medium", label: "Medium — have IT team" },
  { value: "high", label: "High — have robotics engineers" },
];

const INTEGRATION_OPTIONS = [
  { value: "wms", label: "WMS Integration" },
  { value: "erp", label: "ERP Integration" },
  { value: "standalone", label: "Standalone" },
  { value: "custom_api", label: "Custom API" },
];

const TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediate (< 1 month)" },
  { value: "near_term", label: "Near-term (1–3 months)" },
  { value: "planning", label: "Planning (3–6 months)" },
  { value: "researching", label: "Researching (6+ months)" },
];

interface Answers {
  industry: string;
  useCase: string;
  budget: string;
  units: string;
  techCapability: string;
  integration: string;
  timeline: string;
}

interface RobotResult {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  category_slug: string;
  category_name: string;
  manufacturer_name: string;
  maintenance_est: number | null;
  matchPct: number;
}

// Industry → category slug mapping for filtering
const INDUSTRY_TO_CATEGORY: Record<string, string> = {
  warehouse: "warehouse-logistics",
  manufacturing: "manufacturing",
  medical: "healthcare",
  construction: "construction",
  agricultural: "agriculture",
  delivery: "delivery",
  drone: "drones",
  consumer: "consumer",
};

export function RobotFinderQuiz() {
  const { robotCount } = useSiteStats();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [results, setResults] = useState<RobotResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const totalSteps = 7;

  const selectAnswer = useCallback(
    (key: keyof Answers, value: string) => {
      const updated = { ...answers, [key]: value };
      setAnswers(updated);

      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // All questions answered, fetch results
        fetchResults(updated as Answers);
      }
    },
    [answers, currentStep],
  );

  async function fetchResults(ans: Answers) {
    setLoading(true);
    try {
      const category = INDUSTRY_TO_CATEGORY[ans.industry] || "";
      const budgetOpt = BUDGET_OPTIONS.find((b) => b.value === ans.budget);
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (budgetOpt && budgetOpt.max !== Infinity) params.set("priceMax", String(budgetOpt.max));
      if (budgetOpt && budgetOpt.min > 0) params.set("priceMin", String(budgetOpt.min));
      params.set("sort", "score_desc");
      params.set("page", "1");

      const res = await fetch(`/api/robots?${params}`);
      const data = await res.json();

      interface ApiRobot {
        slug: string;
        name: string;
        robo_score: number | null;
        price_current: number | null;
        description_short: string | null;
        category_slug: string;
        category_name: string;
        manufacturer_name: string;
        specs: Record<string, unknown> | null;
      }

      const robots: RobotResult[] = ((data.robots || []) as ApiRobot[])
        .slice(0, 5)
        .map((r: ApiRobot) => {
          // Calculate match percentage
          let matchPoints = 0;
          let totalPoints = 0;

          // Industry match (category)
          totalPoints += 30;
          if (category && r.category_slug === category) matchPoints += 30;
          else if (r.category_slug) matchPoints += 10; // partial

          // Budget match
          totalPoints += 25;
          if (r.price_current != null && budgetOpt) {
            if (r.price_current >= budgetOpt.min && r.price_current <= (budgetOpt.max === Infinity ? 999999999 : budgetOpt.max)) {
              matchPoints += 25;
            } else {
              matchPoints += 5;
            }
          } else {
            matchPoints += 10;
          }

          // Score quality bonus
          totalPoints += 20;
          if (r.robo_score != null) {
            matchPoints += Math.round((r.robo_score / 100) * 20);
          }

          // Integration bonus
          totalPoints += 15;
          matchPoints += 10; // default partial match since we can't check DB integrations easily

          // Timeline bonus
          totalPoints += 10;
          matchPoints += 7;

          const matchPct = Math.round((matchPoints / totalPoints) * 100);

          // Maintenance estimate: ~8% of price per year
          const maintenanceEst = r.price_current != null ? Math.round(r.price_current * 0.08) : null;

          return {
            slug: r.slug,
            name: r.name,
            robo_score: r.robo_score,
            price_current: r.price_current,
            description_short: r.description_short,
            category_slug: r.category_slug,
            category_name: r.category_name,
            manufacturer_name: r.manufacturer_name,
            maintenance_est: maintenanceEst,
            matchPct,
          };
        })
        .sort((a: RobotResult, b: RobotResult) => b.matchPct - a.matchPct);

      setResults(robots);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function restart() {
    setCurrentStep(0);
    setAnswers({});
    setResults(null);
    setEmail("");
    setEmailStatus("idle");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setEmailStatus("loading");
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "robot_finder_report" }),
      });
      setEmailStatus("success");
    } catch {
      setEmailStatus("error");
    }
  }

  const progress = ((currentStep + (results ? 1 : 0)) / totalSteps) * 100;

  // ─── Loading ───
  if (loading) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="mt-4 font-mono text-sm text-text-tertiary">
          Analyzing {robotCount}+ robots...
        </p>
      </div>
    );
  }

  // ─── Results ───
  if (results !== null) {
    const top3 = results.slice(0, 3);
    return (
      <div>
        <h2 className="text-center text-xl font-bold text-text-primary">
          Your Top Robot Matches
        </h2>
        <p className="mt-2 text-center font-mono text-xs text-text-tertiary">
          {answers.industry} / {answers.useCase} / {answers.budget}
        </p>

        {results.length === 0 && (
          <p className="mt-8 text-center text-text-secondary">
            No robots found matching your criteria. Try broadening your search.
          </p>
        )}

        {/* Top 5 results */}
        <div className="mt-8 space-y-4">
          {results.map((robot, i) => (
            <Link
              key={robot.slug}
              href={`/explore/${robot.category_slug || "all"}/${robot.slug}`}
              className="group block rounded-md border border-border bg-obsidian-surface p-5 transition-all hover:border-white/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[13px] font-semibold text-white">
                      #{i + 1}
                    </span>
                    <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[13px] font-bold text-white">
                      {robot.matchPct}% MATCH
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-text-primary transition-colors group-hover:text-white">
                    {robot.name}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {robot.manufacturer_name}
                    {robot.category_name ? ` — ${robot.category_name}` : ""}
                  </p>
                  {robot.description_short && (
                    <p className="mt-1 text-sm text-text-tertiary line-clamp-2">
                      {robot.description_short}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {robot.robo_score != null && (
                    <RoboScoreBadge score={robot.robo_score} />
                  )}
                  {robot.price_current != null ? (
                    <span className="font-mono text-sm font-bold text-white">
                      ${robot.price_current.toLocaleString()}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-text-tertiary">
                      Contact
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-[13px] text-text-ghost">
                  Est. maintenance: {robot.maintenance_est != null ? `$${robot.maintenance_est.toLocaleString()}/yr` : "—"}
                </span>
                <span className="text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  View Full Analysis →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* TCO comparison table */}
        {top3.length > 0 && (
          <div className="mt-10 rounded-md border border-border bg-obsidian-surface p-5">
            <h3 className="mb-4 font-mono text-sm font-bold uppercase tracking-wider text-text-secondary">
              TCO Comparison — Top {top3.length}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                      Cost
                    </th>
                    {top3.map((r) => (
                      <th
                        key={r.slug}
                        className="py-2 px-3 text-right font-mono text-[13px] uppercase tracking-wider text-text-secondary"
                      >
                        {r.name.length > 20 ? r.name.slice(0, 18) + "..." : r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 text-text-secondary">
                      Purchase Price
                    </td>
                    {top3.map((r) => (
                      <td
                        key={r.slug}
                        className="py-2 px-3 text-right font-mono text-text-data"
                      >
                        {r.price_current != null ? `$${r.price_current.toLocaleString()}` : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 pr-4 text-text-secondary">
                      Est. Annual Maintenance
                    </td>
                    {top3.map((r) => (
                      <td
                        key={r.slug}
                        className="py-2 px-3 text-right font-mono text-text-data"
                      >
                        {r.maintenance_est != null ? `$${r.maintenance_est.toLocaleString()}` : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-semibold text-text-primary">
                      5-Year Total
                    </td>
                    {top3.map((r) => {
                      const total =
                        r.price_current != null && r.maintenance_est != null
                          ? r.price_current + r.maintenance_est * 5
                          : null;
                      return (
                        <td
                          key={r.slug}
                          className="py-2 px-3 text-right font-mono font-bold text-white"
                        >
                          {total != null ? `$${total.toLocaleString()}` : "—"}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Email gate */}
        <div className="mt-8 rounded-md border border-border bg-obsidian-surface p-5 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Unlock Full Report
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            Get the full report with detailed ROI analysis, vendor comparisons,
            and deployment timelines.
          </p>
          {emailStatus === "success" ? (
            <p className="mt-4 font-mono text-sm text-white">
              Report sent to your inbox.
            </p>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="mt-4 flex items-center gap-2 justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-64 rounded-md border border-border bg-obsidian px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-ghost focus:border-white/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={emailStatus === "loading"}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-obsidian transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {emailStatus === "loading" ? "..." : "Get Report"}
              </button>
            </form>
          )}
          {emailStatus === "error" && (
            <p className="mt-2 font-mono text-xs text-magenta">
              Something went wrong. Try again.
            </p>
          )}
        </div>

        {/* Start over */}
        <div className="mt-8 text-center">
          <button
            onClick={restart}
            className="rounded-md border border-border px-6 py-2 text-sm text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // ─── Step rendering ───
  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <StepLayout
            question="What industry are you in?"
            stepNum={1}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {INDUSTRY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  badge={opt.code}
                  onClick={() => selectAnswer("industry", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 1: {
        const useCases = USE_CASES[answers.industry || "warehouse"] || USE_CASES.warehouse;
        return (
          <StepLayout question="What's your primary use case?" stepNum={2}>
            <div className="grid gap-3 sm:grid-cols-2">
              {useCases.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("useCase", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      }
      case 2:
        return (
          <StepLayout question="What's your budget range?" stepNum={3}>
            <div className="grid gap-3 sm:grid-cols-2">
              {BUDGET_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("budget", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 3:
        return (
          <StepLayout question="How many units do you need?" stepNum={4}>
            <div className="grid gap-3 sm:grid-cols-2">
              {UNIT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("units", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 4:
        return (
          <StepLayout question="What's your technical capability?" stepNum={5}>
            <div className="grid gap-3">
              {TECH_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("techCapability", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 5:
        return (
          <StepLayout question="What integration do you need?" stepNum={6}>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTEGRATION_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("integration", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      case 6:
        return (
          <StepLayout question="What's your timeline?" stepNum={7}>
            <div className="grid gap-3 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  onClick={() => selectAnswer("timeline", opt.value)}
                />
              ))}
            </div>
          </StepLayout>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 h-1 rounded-full bg-obsidian-3">
        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {renderStep()}

      {currentStep > 0 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="mt-6 text-xs text-text-tertiary transition-colors hover:text-text-primary"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function StepLayout({
  question,
  stepNum,
  children,
}: {
  question: string;
  stepNum: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
        Question {stepNum} of 7
      </p>
      <h2 className="mb-6 text-xl font-bold text-text-primary">{question}</h2>
      {children}
    </div>
  );
}

function OptionCard({
  label,
  badge,
  onClick,
}: {
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-md border border-border bg-obsidian-surface px-5 py-4 text-left text-sm font-medium text-text-primary transition-all hover:border-white/20 hover:bg-obsidian-hover"
    >
      <div className="flex items-center gap-3">
        {badge && (
          <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[13px] font-bold text-white">
            {badge}
          </span>
        )}
        <span>{label}</span>
      </div>
    </button>
  );
}
