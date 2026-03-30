"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBuyerJourney } from "@/lib/stores/buyer-journey-store";

const INDUSTRIES = [
  { value: "warehouse", label: "Warehouse & Logistics", icon: "WRH" },
  { value: "medical", label: "Medical & Surgical", icon: "MED" },
  { value: "manufacturing", label: "Manufacturing", icon: "MFG" },
  { value: "agriculture", label: "Agricultural", icon: "AGR" },
  { value: "construction", label: "Construction", icon: "CON" },
  { value: "delivery", label: "Delivery", icon: "DLV" },
  { value: "security", label: "Security", icon: "SEC" },
  { value: "other", label: "Other / Not Sure", icon: "OTH" },
];

const CHALLENGES: Record<string, { value: string; label: string }[]> = {
  warehouse: [
    { value: "labor-costs", label: "High labor costs" },
    { value: "speed", label: "Slow fulfillment speed" },
    { value: "accuracy", label: "Pick accuracy & errors" },
    { value: "safety", label: "Worker safety concerns" },
  ],
  medical: [
    { value: "surgical-precision", label: "Surgical precision & outcomes" },
    { value: "logistics", label: "Hospital logistics & transport" },
    { value: "patient-care", label: "Patient care capacity" },
    { value: "rehab", label: "Rehabilitation & recovery" },
  ],
  manufacturing: [
    { value: "quality", label: "Product quality consistency" },
    { value: "throughput", label: "Throughput & capacity" },
    { value: "labor", label: "Labor shortage" },
    { value: "flexibility", label: "Production flexibility" },
  ],
  agriculture: [
    { value: "harvesting", label: "Harvesting labor" },
    { value: "weeding", label: "Weed management" },
    { value: "spraying", label: "Precision spraying" },
    { value: "monitoring", label: "Crop monitoring" },
  ],
  construction: [
    { value: "labor", label: "Skilled labor shortage" },
    { value: "safety", label: "Worker safety" },
    { value: "surveying", label: "Surveying & inspection" },
    { value: "productivity", label: "On-site productivity" },
  ],
  delivery: [
    { value: "last-mile", label: "Last-mile delivery costs" },
    { value: "speed", label: "Delivery speed" },
    { value: "capacity", label: "Delivery capacity" },
    { value: "accuracy", label: "Package handling" },
  ],
  security: [
    { value: "patrols", label: "Security patrol coverage" },
    { value: "surveillance", label: "Surveillance gaps" },
    { value: "response", label: "Incident response time" },
    { value: "cost", label: "Security staffing costs" },
  ],
  other: [
    { value: "labor", label: "Labor shortage" },
    { value: "cost", label: "Operational costs" },
    { value: "quality", label: "Quality & consistency" },
    { value: "exploring", label: "Just exploring options" },
  ],
};

const BUDGETS = [
  { value: "under-50k", label: "Under $50K", sublabel: "Evaluating now" },
  { value: "50k-200k", label: "$50K – $200K", sublabel: "Serious buyer" },
  { value: "200k-plus", label: "$200K+", sublabel: "Enterprise" },
  { value: "researching", label: "Just researching", sublabel: "No budget yet" },
];

const INDUSTRY_TO_CATEGORY: Record<string, string> = {
  warehouse: "warehouse",
  medical: "medical",
  manufacturing: "manufacturing",
  agriculture: "agricultural",
  construction: "construction",
  delivery: "delivery",
  security: "security",
  other: "",
};

const INDUSTRY_TO_INDUSTRY_SLUG: Record<string, string> = {
  warehouse: "warehouse-robotics",
  medical: "medical-robotics",
  manufacturing: "manufacturing-robotics",
  agriculture: "agricultural-robotics",
  construction: "construction-robotics",
  delivery: "delivery-robotics",
  security: "security-robotics",
};

export function GuidedEntry() {
  const { profile, setIndustry, setChallenge, setBudget, complete, reset } = useBuyerJourney();
  const [step, setStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (profile.completedAt) {
      setDismissed(true);
    }
  }, [profile.completedAt]);

  if (!mounted) return null;
  if (dismissed && profile.completedAt) {
    return <GuidedResults profile={profile} onReset={() => { reset(); setDismissed(false); setStep(0); }} />;
  }
  if (dismissed) return null;

  const currentIndustry = profile.industry;
  const challenges = currentIndustry ? CHALLENGES[currentIndustry] || CHALLENGES.other : [];

  return (
    <section className="border-y border-border px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
              <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">Start Here</span>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-primary sm:text-2xl">
              {step === 0 && "What industry are you in?"}
              {step === 1 && "What\u2019s your biggest challenge?"}
              {step === 2 && "What\u2019s your timeline and budget?"}
            </h2>
          </div>
          <button onClick={() => setDismissed(true)} className="text-xs text-ghost hover:text-tertiary">
            Skip
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-electric-blue" : "bg-border"}`} />
          ))}
        </div>

        {/* Step 1: Industry */}
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.value}
                onClick={() => { setIndustry(ind.value); setStep(1); }}
                className={`group rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-electric-blue/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${
                  currentIndustry === ind.value
                    ? "border-electric-blue/40 bg-electric-blue/5"
                    : "border-border bg-obsidian-surface"
                }`}
              >
                <span className="inline-block rounded bg-electric-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric-blue">
                  {ind.icon}
                </span>
                <p className="mt-2 text-sm font-semibold text-primary">{ind.label}</p>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Challenge */}
        {step === 1 && (
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {challenges.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => { setChallenge(ch.value); setStep(2); }}
                  className="rounded-lg border border-border bg-obsidian-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-electric-blue/30"
                >
                  <p className="text-sm font-semibold text-primary">{ch.label}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="mt-4 text-xs text-ghost hover:text-tertiary">
              &larr; Back to industry
            </button>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 2 && (
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  onClick={() => { setBudget(b.value); complete(); }}
                  className="rounded-lg border border-border bg-obsidian-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:border-electric-blue/30"
                >
                  <p className="text-base font-bold text-primary">{b.label}</p>
                  <p className="mt-1 text-xs text-ghost">{b.sublabel}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-xs text-ghost hover:text-tertiary">
              &larr; Back to challenge
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function GuidedResults({
  profile,
  onReset,
}: {
  profile: { industry: string | null; challenge: string | null; budget: string | null };
  onReset: () => void;
}) {
  const industryLabel = INDUSTRIES.find(i => i.value === profile.industry)?.label || profile.industry || "";
  const challengeLabel = profile.industry && profile.challenge
    ? (CHALLENGES[profile.industry] || []).find(c => c.value === profile.challenge)?.label || profile.challenge
    : "";
  const categorySlug = INDUSTRY_TO_CATEGORY[profile.industry || ""] || "";
  const industrySlug = INDUSTRY_TO_INDUSTRY_SLUG[profile.industry || ""];

  return (
    <section className="border-y border-border bg-obsidian-surface px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-electric-blue/10">
            <svg className="h-5 w-5 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              {industryLabel} — {challengeLabel}
            </p>
            <p className="text-xs text-ghost">
              Showing robots matched to your profile.{" "}
              <button onClick={onReset} className="text-electric-blue hover:underline">Change</button>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categorySlug && (
            <Link href={`/explore/${categorySlug}`} className="rounded-md bg-electric-blue/10 px-4 py-2 text-xs font-semibold text-electric-blue hover:bg-electric-blue/20">
              Browse {industryLabel} Robots
            </Link>
          )}
          {industrySlug && (
            <Link href={`/industries/${industrySlug}`} className="rounded-md bg-white/[0.04] px-4 py-2 text-xs font-semibold text-secondary hover:bg-white/[0.06]">
              {industryLabel} Guide
            </Link>
          )}
          <Link href={`/tools/robot-finder?industry=${profile.industry}`} className="rounded-md bg-white/[0.04] px-4 py-2 text-xs font-semibold text-secondary hover:bg-white/[0.06]">
            Robot Finder Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
