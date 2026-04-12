"use client";

import { useState, useMemo } from "react";
import type { Investor } from "@/lib/data/funding-data";

type SortBy = "deals" | "deployed";

interface InvestorGridProps {
  investors: Investor[];
}

function formatDeployed(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  return `$${m}M`;
}

const CATEGORY_COLORS: Record<string, string> = {
  Humanoid: "#7B2FFF",
  "Warehouse & Logistics": "#00C2FF",
  "AI / Foundation Models": "#C8A84E",
  Manufacturing: "#00E5A0",
  Defense: "#FF6B6B",
  Delivery: "#FF9F43",
  "Drone / Aerial": "#EE5A9A",
  Construction: "#8B5CF6",
  "Cobot / Collaborative": "#06B6D4",
  Hospitality: "#F59E0B",
  RaaS: "#10B981",
  "Industrial Inspection": "#EC4899",
  "Industrial Safety": "#6366F1",
  "Robot Operations Platform": "#14B8A6",
};

export function InvestorGrid({ investors }: InvestorGridProps) {
  const [sortBy, setSortBy] = useState<SortBy>("deals");

  const sorted = useMemo(() => {
    return [...investors].sort((a, b) =>
      sortBy === "deals"
        ? b.totalDeals - a.totalDeals
        : b.totalDeployed - a.totalDeployed
    );
  }, [investors, sortBy]);

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Sort controls */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-[13px] uppercase tracking-widest text-ghost">Sort by</span>
          <button
            onClick={() => setSortBy("deals")}
            className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              sortBy === "deals"
                ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                : "border-border text-ghost hover:border-border-active hover:text-secondary"
            }`}
          >
            Deal Count
          </button>
          <button
            onClick={() => setSortBy("deployed")}
            className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
              sortBy === "deployed"
                ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                : "border-border text-ghost hover:border-border-active hover:text-secondary"
            }`}
          >
            Capital Deployed
          </button>
        </div>

        {/* Investor cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((investor, idx) => (
            <div
              key={investor.name}
              className="group overflow-hidden rounded-lg border border-border bg-obsidian-surface transition-colors hover:border-border-active"
            >
              <div className="p-5">
                {/* Rank + Name */}
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-white/[0.04] font-mono text-xs font-bold text-ghost">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {investor.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {investor.categories.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="inline-block rounded px-1.5 py-0.5 text-[13px] font-medium"
                          style={{
                            background: (CATEGORY_COLORS[cat] || "#00C2FF") + "15",
                            color: CATEGORY_COLORS[cat] || "#00C2FF",
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                      {investor.categories.length > 3 && (
                        <span className="text-[13px] text-ghost">
                          +{investor.categories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded bg-border-subtle">
                  <div className="bg-obsidian-surface p-3">
                    <p className="font-mono text-[13px] uppercase tracking-widest text-ghost">Deals</p>
                    <p className="mt-1 font-mono text-lg font-bold text-data">{investor.totalDeals}</p>
                  </div>
                  <div className="bg-obsidian-surface p-3">
                    <p className="font-mono text-[13px] uppercase tracking-widest text-ghost">Deployed</p>
                    <p className="mt-1 font-mono text-lg font-bold text-blue-400">
                      {formatDeployed(investor.totalDeployed)}
                    </p>
                  </div>
                </div>

                {/* Portfolio companies */}
                <div className="mt-3">
                  <p className="font-mono text-[13px] uppercase tracking-widest text-ghost">Portfolio</p>
                  <p className="mt-1 text-xs text-tertiary">
                    {investor.portfolioCompanies.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
