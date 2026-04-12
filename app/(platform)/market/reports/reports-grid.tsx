"use client";

import { useState } from "react";
import Link from "next/link";
import type { MarketReport } from "@/lib/data/sample-reports";

const CATEGORY_COLORS: Record<string, string> = {
  warehouse: "#00C2FF",
  medical: "#00E5A0",
  manufacturing: "#7B2FFF",
  agriculture: "#C8A84E",
  humanoid: "#FF6B6B",
  logistics: "#FF9F43",
  defense: "#EE5A9A",
  construction: "#FFD700",
};

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ReportsGridProps {
  reports: MarketReport[];
  categories: string[];
  categoryLabels: Record<string, string>;
}

export function ReportsGrid({
  reports,
  categories,
  categoryLabels,
}: ReportsGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  function catLabel(cat: string): string {
    return categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
              activeCategory === "all"
                ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                : "border-border text-ghost hover:border-electric-blue hover:text-electric-blue"
            }`}
          >
            All ({reports.length})
          </button>
          {categories.map((cat) => {
            const count = reports.filter((r) => r.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                  activeCategory === cat
                    ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                    : "border-border text-ghost hover:border-electric-blue hover:text-electric-blue"
                }`}
              >
                {catLabel(cat)} ({count})
              </button>
            );
          })}
        </div>

        {/* Report cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((report) => {
            const color =
              CATEGORY_COLORS[report.category] || "#00C2FF";
            const slug = slugify(report.title);

            return (
              <Link
                key={report.id}
                href={`/market/reports/${slug}`}
                className="group flex flex-col rounded-xl border border-border bg-obsidian-surface p-5 transition-all hover:-translate-y-0.5 hover:border-electric-blue/40"
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: color + "18",
                      color: color,
                    }}
                  >
                    {catLabel(report.category)}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-ghost">
                    {formatDate(report.report_date)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-electric-blue">
                  {report.title}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-ghost">
                  Source: {report.source}
                </p>

                {/* Market metrics */}
                <div className="mt-4 flex gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                      Market Size
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-blue-400">
                      ${report.market_size_usd_billions}B
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                      CAGR
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-data">
                      {report.cagr_percent}%
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                      Forecast
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold text-foreground">
                      {report.forecast_year}
                    </p>
                  </div>
                </div>

                {/* Key findings */}
                {report.key_findings.length > 0 && (
                  <ul className="mt-4 flex-1 space-y-1.5 border-t border-border-subtle pt-3">
                    {report.key_findings.map((finding, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs leading-relaxed text-secondary"
                      >
                        <span
                          className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                          style={{ background: color }}
                        />
                        {finding}
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted">
              No reports found for this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
