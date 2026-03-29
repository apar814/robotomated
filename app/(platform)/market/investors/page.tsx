import type { Metadata } from "next";
import Link from "next/link";
import { INVESTORS, getInvestorStats } from "@/lib/data/funding-data";
import { JsonLd } from "@/components/seo/json-ld";
import { InvestorGrid } from "./investor-grid";

export const metadata: Metadata = {
  title: "Top Robotics Investors — VC & PE Rankings | Robotomated",
  description:
    "Ranked directory of the most active investors in robotics. See deal counts, total deployed capital, and portfolio companies for every major VC and PE firm.",
  openGraph: {
    title: "Top Robotics Investors",
    description: "Who's funding the robotics revolution? Rankings of VCs, PEs, and corporate investors by deal count and capital deployed.",
  },
};

export default function InvestorsPage() {
  const stats = getInvestorStats();

  const totalDeployed = INVESTORS.reduce((s, inv) => s + inv.totalDeployed, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Robotics Investors",
    description: "Ranked list of the most active investors in robotics companies.",
    url: "https://robotomated.com/market/investors",
    numberOfItems: stats.totalInvestors,
    itemListElement: stats.topByDeals.slice(0, 10).map((inv, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: inv.name,
      description: `${inv.totalDeals} deals, $${inv.totalDeployed}M deployed`,
    })),
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
            <span className="font-mono text-[10px] text-electric-blue">Investors</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Top Robotics Investors
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            The VCs, private equity firms, and corporate investors powering the robotics revolution.
            Ranked by deal activity and capital deployed.
          </p>

          {/* Summary stats */}
          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border-subtle sm:grid-cols-3">
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Total Investors</p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">{stats.totalInvestors}</p>
              <p className="mt-1 text-xs text-tertiary">Tracked in database</p>
            </div>
            <div className="bg-obsidian-surface p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Capital Tracked</p>
              <p className="mt-2 font-mono text-2xl font-bold text-lime">
                ${(totalDeployed / 1000).toFixed(1)}B
              </p>
              <p className="mt-1 text-xs text-tertiary">Estimated deployment</p>
            </div>
            <div className="col-span-2 bg-obsidian-surface p-4 sm:col-span-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-ghost">Most Active</p>
              <p className="mt-2 font-mono text-2xl font-bold text-data">
                {stats.topByDeals[0]?.name || "—"}
              </p>
              <p className="mt-1 text-xs text-tertiary">{stats.topByDeals[0]?.totalDeals || 0} deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Investor Grid (client component for sort) ── */}
      <InvestorGrid investors={INVESTORS} />
    </div>
  );
}
