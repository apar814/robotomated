import Link from "next/link";

interface FeaturedRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  description_short: string | null;
  images: unknown;
  manufacturers: { name: string } | null;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-green border-green/30 bg-green/10" :
    score >= 80 ? "text-blue border-blue/30 bg-blue/10" :
    "text-orange border-orange/30 bg-orange/10";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}

export function FeaturedRobots({ robots }: { robots: FeaturedRobot[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
      {robots.map((robot) => {
        const mfr = robot.manufacturers as { name: string } | null;
        return (
          <div
            key={robot.id}
            className="min-w-[280px] flex-shrink-0 rounded-xl border border-border bg-navy-light p-6 transition-all hover:border-blue/30 sm:min-w-0"
          >
            {/* Placeholder visual */}
            <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-navy-lighter">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-muted/40" fill="none" stroke="currentColor" strokeWidth={1}>
                <rect x="4" y="4" width="16" height="12" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <circle cx="15" cy="10" r="1.5" />
                <path d="M8 20h8 M10 16v4 M14 16v4" />
              </svg>
            </div>

            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted">{mfr?.name}</p>
                <h3 className="font-semibold">{robot.name}</h3>
              </div>
              {robot.robo_score != null && (
                <ScoreBadge score={robot.robo_score} />
              )}
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-muted">
              {robot.description_short}
            </p>

            <Link
              href={`/robots/${robot.slug}`}
              className="mt-4 inline-block text-sm font-medium text-blue transition-colors hover:text-blue/80"
            >
              Read Review &rarr;
            </Link>
          </div>
        );
      })}
    </div>
  );
}
