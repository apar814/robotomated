import Link from "next/link";
import { RoboScoreBadge } from "@/components/ui/robo-score";

interface RelatedRobot {
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  category_slug: string;
  manufacturer_name: string;
}

export function RelatedRobots({ robots, title = "Related Robots" }: { robots: RelatedRobot[]; title?: string }) {
  if (robots.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {robots.map((r) => (
          <Link
            key={r.slug}
            href={`/explore/${r.category_slug}/${r.slug}`}
            className="group rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs text-muted">{r.manufacturer_name}</p>
                <h3 className="truncate font-semibold transition-colors group-hover:text-white">{r.name}</h3>
              </div>
              {r.robo_score != null && <RoboScoreBadge score={r.robo_score} />}
            </div>
            <p className="mt-2 line-clamp-2 text-xs text-muted">{r.description_short}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">
                {r.price_current != null ? `$${r.price_current.toLocaleString()}` : "Contact"}
              </span>
              <span className="text-xs text-white">View &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
