import type { Metadata } from "next";
import Link from "next/link";
import {
  FUNDING_ROUNDS,
  getTotalRaisedYTD,
  getLargestRound,
  getRoundTypes,
  getCategories,
} from "@/lib/data/funding-data";
import { FundingTable } from "./funding-table";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Robotics Funding Tracker — Live VC & PE Investment Data | Robotomated",
  description:
    "Track every robotics funding round in real time. Venture capital, private equity, and corporate investment data for the robotics industry — updated daily.",
  openGraph: {
    title: "Robotics Funding Tracker",
    description: "Live VC & PE investment data for robotics startups. $10B+ tracked across 40+ deals.",
    images: [{ url: "/og-funding.png", width: 1200, height: 630, alt: "Robotomated — Robotics Investment Tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-funding.png"],
  },
};

const ROUND_COLORS: Record<string, string> = {
  Seed: "#00E5A0",
  "Series A": "#00C2FF",
  "Series B": "#7B2FFF",
  "Series C": "#C8A84E",
  "Series D": "#FF6B6B",
  "Series E": "#FF9F43",
  "Series F": "#EE5A9A",
  Growth: "#00E5A0",
  "Growth Equity": "#00E5A0",
  "Pre-IPO": "#FFD700",
  Acquisition: "#FF4757",
};

export default function FundingTrackerPage() {
  const ytd = getTotalRaisedYTD();
  const largest = getLargestRound();
  const totalRaised = FUNDING_ROUNDS.reduce((s, r) => s + r.amountNumeric, 0);
  const roundTypes = getRoundTypes();
  const categories = getCategories();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Robotics Funding Tracker",
    description: "Comprehensive database of venture capital and private equity investments in robotics companies.",
    url: "https://robotomated.com/market/funding",
    provider: {
      "@type": "Organization",
      name: "Robotomated",
      url: "https://robotomated.com",
    },
    temporalCoverage: "2024/2026",
    variableMeasured: "Funding amount in USD",
  };

  return (
    <div>
      <JsonLd data={jsonLd} />

      {/* ── Hero ── */}
      <section className="border-b border-border px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <Link href="/market" className="font-mono text-[10px] text-ghost transition-colors hover:text-electric-blue">
              Market
            </Link>
            <span className="text-ghost">/</span>
            <span className="font-mono text-[10px] text-electric-blue">Funding</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Robotics Funding Tracker
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Live tracking of venture capital, private equity, and corporate investment in robotics.
            Every round, every investor, every category.
          </p>

          {/* Summary stats */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border-subtle sm:grid-cols-4">
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Total Tracked</p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">
                ${(totalRaised / 1000).toFixed(1)}B
              </p>
              <p className="mt-1 text-xs text-tertiary">{FUNDING_ROUNDS.length} rounds</p>
            </div>
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Raised YTD</p>
              <p className="mt-2 font-mono text-2xl font-bold text-blue-400">{ytd.formatted}</p>
              <p className="mt-1 text-xs text-tertiary">{ytd.dealCount} deals in {new Date().getFullYear()}</p>
            </div>
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Largest Round</p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">{largest.amount}</p>
              <p className="mt-1 text-xs text-tertiary">{largest.company}</p>
            </div>
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Deal Count</p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">{FUNDING_ROUNDS.length}</p>
              <p className="mt-1 text-xs text-tertiary">Since Jan 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filterable Table (client component) ── */}
      <FundingTable
        rounds={FUNDING_ROUNDS}
        roundTypes={roundTypes}
        categories={categories}
        roundColors={ROUND_COLORS}
      />
    </div>
  );
}
