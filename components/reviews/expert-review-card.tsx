import { RoboScoreRing } from "@/components/ui/robo-score";
import { ProsConsList } from "@/components/reviews/pros-cons-list";
import { ScoreBreakdownChart } from "@/components/reviews/score-breakdown-chart";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

interface ExpertReviewCardProps {
  title: string;
  body: string;
  roboScore: number | null;
  scoreBreakdown: RoboScoreBreakdown | null;
  pros: string[];
  cons: string[];
  verdict: string | null;
  publishedAt: string | null;
}

export function ExpertReviewCard({
  title, body, roboScore, scoreBreakdown, pros, cons, verdict, publishedAt,
}: ExpertReviewCardProps) {
  return (
    <div className="rounded-xl border border-blue/20 bg-navy-light">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
        <svg className="h-4 w-4 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue">Expert Review</span>
        {publishedAt && (
          <span className="ml-auto text-xs text-muted">
            {new Date(publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          {roboScore != null && <RoboScoreRing score={roboScore} size={90} />}
        </div>

        {/* Review body */}
        <div className="prose prose-invert mt-4 max-w-none text-sm leading-relaxed text-muted prose-headings:text-foreground prose-strong:text-foreground">
          {body.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Score breakdown */}
        {scoreBreakdown && (
          <div className="mt-6 border-t border-border pt-6">
            <h4 className="mb-4 text-sm font-semibold">Score Breakdown</h4>
            <div className="max-w-lg">
              <ScoreBreakdownChart breakdown={scoreBreakdown} />
            </div>
          </div>
        )}

        {/* Pros/Cons */}
        <div className="mt-6">
          <ProsConsList pros={pros} cons={cons} />
        </div>

        {/* Verdict */}
        {verdict && (
          <div className="mt-6 rounded-lg border border-blue/20 bg-blue/5 p-4">
            <h4 className="mb-1 text-sm font-semibold text-blue">Verdict</h4>
            <p className="text-sm text-muted">{verdict}</p>
          </div>
        )}
      </div>
    </div>
  );
}
