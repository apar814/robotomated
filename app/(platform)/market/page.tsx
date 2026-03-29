import type { Metadata } from "next";
import Link from "next/link";
import { getRecentFundings } from "@/lib/data/funding-data";

export const metadata: Metadata = {
  title: "Marketplace | Robotomated",
  description: "Buy and sell robots from verified dealers and manufacturers. Track robotics funding, investors, and market intelligence.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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
};

export default function MarketplacePage() {
  const recentFundings = getRecentFundings(5);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Marketplace</h1>
          <p className="mt-2 text-muted">
            Buy and sell robots from verified dealers. Track funding rounds, investors, and market intelligence.
          </p>

          {/* Quick nav */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/market/funding"
              className="rounded border border-border bg-obsidian-surface px-4 py-2.5 font-mono text-xs text-secondary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              Funding Tracker
            </Link>
            <Link
              href="/market/investors"
              className="rounded border border-border bg-obsidian-surface px-4 py-2.5 font-mono text-xs text-secondary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              Top Investors
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recently Funded ── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">
                Recently Funded
              </span>
            </div>
            <Link
              href="/market/funding"
              className="font-mono text-[10px] text-electric-blue transition-colors hover:underline"
            >
              View All Funding &rarr;
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            {recentFundings.map((round, i) => (
              <a
                key={round.id}
                href={round.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between px-4 py-3 transition-colors hover:bg-obsidian-hover ${
                  i < recentFundings.length - 1 ? "border-b border-border-subtle" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-electric-blue">
                      {round.company}
                    </span>
                    <span
                      className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: (ROUND_COLORS[round.round] || "#00C2FF") + "18",
                        color: ROUND_COLORS[round.round] || "#00C2FF",
                      }}
                    >
                      {round.round}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-ghost">{round.leadInvestor}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="font-mono text-sm font-bold text-lime">{round.amount}</span>
                  <span className="hidden font-mono text-[10px] text-ghost sm:block">
                    {formatDate(round.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
