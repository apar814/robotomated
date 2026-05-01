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
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">[ MARKET INTELLIGENCE ]</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Marketplace</h1>
          <p className="mt-2 text-muted">
            Buy and sell robots from verified dealers. Track funding rounds, investors, and market intelligence.
          </p>

          {/* Quick nav */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/market/funding"
              className="rounded border border-border bg-obsidian-surface px-4 py-2.5 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.08em] text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              Funding Tracker
            </Link>
            <Link
              href="/market/investors"
              className="rounded border border-border bg-obsidian-surface px-4 py-2.5 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.08em] text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              Top Investors
            </Link>
            <Link
              href="/market/reports"
              className="rounded border border-border bg-obsidian-surface px-4 py-2.5 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.08em] text-secondary transition-colors hover:border-white/20 hover:text-white"
            >
              Market Reports
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recently Funded ── */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="font-[family-name:var(--font-brand)] text-[13px] uppercase tracking-widest text-ghost">
                Recently Funded
              </span>
            </div>
            <Link
              href="/market/funding"
              className="font-mono text-[13px] text-white transition-colors hover:underline"
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
                    <span className="text-sm font-medium text-foreground transition-colors group-hover:text-white">
                      {round.company}
                    </span>
                    <span
                      className="inline-block rounded px-1.5 py-0.5 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] font-medium"
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
                  <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-white">{round.amount}</span>
                  <span className="hidden font-mono text-[13px] text-ghost sm:block">
                    {formatDate(round.date)}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Humanoid Report ── */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--theme-accent-magenta)" }} />
            <span className="font-[family-name:var(--font-brand)] text-[11px] uppercase tracking-widest" style={{ color: "var(--theme-text-muted)" }}>
              The Humanoid Report
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
            The Humanoid Moment
          </h2>
          <p className="mt-3 max-w-2xl text-base" style={{ color: "var(--theme-text-secondary)" }}>
            The first commercially viable humanoid robots are entering the workforce. Here is what the data says.
          </p>

          {/* Key stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: "137", label: "Chinese humanoid manufacturers", color: "var(--theme-accent-magenta)" },
              { value: "0", label: "US commercially available humanoids (early 2026)", color: "var(--theme-accent-blue)" },
              { value: "90%", label: "Figure manufacturing cost reduction (gen 1 to gen 3)", color: "var(--theme-accent-lime)" },
              { value: "67+", label: "Consecutive autonomous hours (Figure 02)", color: "var(--theme-accent-blue)" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-5">
                <p className="font-[family-name:var(--font-brand)] text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--theme-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Insight cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "The Data Advantage",
                body: "When one robot learns, all robots learn. Fleet neural learning is the new moat. Businesses deploying fleet-learning robots gain compounding operational advantages over time.",
              },
              {
                title: "The Manufacturing Race",
                body: "China has 137 humanoid companies. The US has zero commercially available humanoid manufacturers as of early 2026. This gap is a strategic opportunity for American businesses to engage early with the companies building here.",
              },
              {
                title: "The 10-Year Deployment Reality",
                body: "Waymo took 12 years from prototype to product. Humanoids will follow a similar trajectory. Businesses that start their automation journey today will have an insurmountable advantage by 2035.",
              },
              {
                title: "The Cost Curve",
                body: "Figure has achieved a 90% cost reduction from generation 1 to generation 3. As manufacturing scales toward 50,000+ units per year, humanoid robots will become as common as forklifts within a decade.",
              },
            ].map((card) => (
              <div key={card.title} className="glass rounded-xl p-6">
                <h3 className="text-base font-bold" style={{ color: "var(--theme-text-primary)" }}>{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>{card.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/explore/humanoid"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5"
              style={{ background: "var(--theme-accent-blue)" }}
            >
              Explore Humanoid Robots
            </Link>
            <Link
              href="/tools/humanoid-comparison"
              className="rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-primary)" }}
            >
              US vs China Comparison
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
