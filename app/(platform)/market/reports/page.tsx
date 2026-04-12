import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { SAMPLE_REPORTS, type MarketReport } from "@/lib/data/sample-reports";
import { ReportsGrid } from "./reports-grid";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Market Intelligence Reports — Robotomated",
  description:
    "Curated market intelligence reports on the global robotics industry. Market sizing, growth rates, and key findings across warehouse, medical, manufacturing, agriculture, and humanoid robotics.",
  openGraph: {
    title: "Market Intelligence Reports",
    description:
      "Research-grade robotics market data. Market size, CAGR, and key findings across every major robotics vertical.",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  warehouse: "Warehouse",
  medical: "Medical",
  manufacturing: "Manufacturing",
  agriculture: "Agriculture",
  humanoid: "Humanoid",
  logistics: "Logistics",
  defense: "Defense",
  construction: "Construction",
};

function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

async function getReports(): Promise<MarketReport[]> {
  try {
    const supabase = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("market_reports")
      .select(
        "id, title, source, source_url, report_date, category, market_size_usd_billions, cagr_percent, forecast_year, key_findings"
      )
      .order("report_date", { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_REPORTS;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((r: any) => ({
      id: String(r.id),
      title: r.title,
      source: r.source,
      source_url: r.source_url ?? null,
      report_date: r.report_date ?? "",
      category: r.category ?? "other",
      market_size_usd_billions: Number(r.market_size_usd_billions) || 0,
      cagr_percent: Number(r.cagr_percent) || 0,
      forecast_year: r.forecast_year ?? 0,
      key_findings: Array.isArray(r.key_findings) ? r.key_findings : [],
    }));
  } catch {
    return SAMPLE_REPORTS;
  }
}

export default async function MarketReportsPage() {
  const reports = await getReports();

  // Compute stats
  const totalReports = reports.length;
  const largestMarket = reports.reduce(
    (max, r) => (r.market_size_usd_billions > max.market_size_usd_billions ? r : max),
    reports[0]
  );
  const highestCagr = reports.reduce(
    (max, r) => (r.cagr_percent > max.cagr_percent ? r : max),
    reports[0]
  );

  // Unique categories for filter
  const categories = Array.from(new Set(reports.map((r) => r.category))).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Robotics Market Intelligence Reports",
    description:
      "Curated collection of market intelligence reports covering global robotics industry verticals.",
    url: "https://robotomated.com/market/reports",
    provider: {
      "@type": "Organization",
      name: "Robotomated",
      url: "https://robotomated.com",
    },
    variableMeasured: [
      "Market size in USD billions",
      "Compound annual growth rate (CAGR)",
    ],
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      <section className="border-b border-border px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <Link
              href="/market"
              className="font-mono text-[10px] text-ghost transition-colors hover:text-electric-blue"
            >
              Market
            </Link>
            <span className="text-ghost">/</span>
            <span className="font-mono text-[10px] text-electric-blue">
              Reports
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Market Intelligence Reports
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Curated research and market sizing data across every major robotics
            vertical. Market size, growth rates, and the key findings that
            matter.
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border-subtle sm:grid-cols-3">
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                Total Reports
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">
                {totalReports}
              </p>
              <p className="mt-1 text-xs text-tertiary">
                Across {categories.length} categories
              </p>
            </div>
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                Largest Market
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-blue-400">
                ${largestMarket.market_size_usd_billions}B
              </p>
              <p className="mt-1 text-xs text-tertiary">
                {categoryLabel(largestMarket.category)}
              </p>
            </div>
            <div className="col-span-2 bg-obsidian-surface p-4 sm:col-span-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                Highest CAGR
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">
                {highestCagr.cagr_percent}%
              </p>
              <p className="mt-1 text-xs text-tertiary">
                {categoryLabel(highestCagr.category)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reports Grid (client component for filtering) ── */}
      <ReportsGrid
        reports={reports}
        categories={categories}
        categoryLabels={CATEGORY_LABELS}
      />
    </div>
  );
}
