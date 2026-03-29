import Link from "next/link";
import { getRecentFundings } from "@/lib/data/funding-data";

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function RecentlyFunded() {
  const recent = getRecentFundings(3);

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime" />
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

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border-subtle sm:grid-cols-3">
          {recent.map((round) => (
            <a
              key={round.id}
              href={round.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-obsidian-surface p-4 transition-colors hover:bg-obsidian-hover"
            >
              {/* Date badge */}
              <span className="font-mono text-[10px] text-ghost">{formatDate(round.date)}</span>

              {/* Company + amount */}
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary transition-colors group-hover:text-electric-blue">
                  {round.company}
                </h3>
                <span className="shrink-0 font-mono text-sm font-bold text-lime">{round.amount}</span>
              </div>

              {/* Round badge */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
                  style={{
                    background: (ROUND_COLORS[round.round] || "#00C2FF") + "15",
                    color: ROUND_COLORS[round.round] || "#00C2FF",
                    border: `0.5px solid ${(ROUND_COLORS[round.round] || "#00C2FF")}30`,
                  }}
                >
                  {round.round}
                </span>
                <span className="text-[10px] text-ghost">{round.leadInvestor}</span>
              </div>

              {/* Description */}
              <p className="mt-2 line-clamp-2 flex-1 text-[11px] leading-relaxed text-ghost">
                {round.companyDescription}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
