import Link from "next/link";
import { getRecentFundings } from "@/lib/data/funding-data";

/* Inverse brightness: later rounds = brighter (more capital = more signal) */
const ROUND_BRIGHTNESS: Record<string, string> = {
  Seed: "rgba(255,255,255,0.35)",
  "Series A": "rgba(255,255,255,0.4)",
  "Series B": "rgba(255,255,255,0.55)",
  "Series C": "rgba(255,255,255,0.7)",
  "Series D": "rgba(255,255,255,0.85)",
  "Series E": "rgba(255,255,255,0.9)",
  "Series F": "rgba(255,255,255,0.95)",
  Growth: "rgba(255,255,255,0.85)",
  "Growth Equity": "rgba(255,255,255,0.85)",
  "Pre-IPO": "rgba(255,255,255,1)",
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
            <span className="inline-block h-px w-6 bg-white/40" />
            <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
              Recently Funded
            </span>
          </div>
          <Link
            href="/market/funding"
            className="font-[family-name:var(--font-ui)] text-[11px] font-medium text-white transition-colors hover:underline"
          >
            View All Funding &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-border-subtle sm:grid-cols-3">
          {recent.map((round) => (
            <a
              key={round.id}
              href={round.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-obsidian-surface p-4 transition-colors hover:bg-obsidian-hover"
            >
              {/* Date badge */}
              <span className="font-[family-name:var(--font-ui)] text-[13px] text-ghost">{formatDate(round.date)}</span>

              {/* Company + amount */}
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary transition-colors group-hover:text-white">
                  {round.company}
                </h3>
                <span className="shrink-0 font-mono text-sm font-bold text-white">{round.amount}</span>
              </div>

              {/* Round badge */}
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="inline-block rounded-sm px-1.5 py-0.5 text-[13px] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: ROUND_BRIGHTNESS[round.round] || "rgba(255,255,255,0.5)",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {round.round}
                </span>
                <span className="text-[13px] text-ghost">{round.leadInvestor}</span>
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
