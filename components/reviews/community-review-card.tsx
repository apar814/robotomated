import { RoboScoreBadge } from "@/components/ui/robo-score";
import { scoreToStars } from "@/lib/scoring/roboscore";

interface CommunityReviewCardProps {
  title: string;
  body: string;
  roboScore: number | null;
  pros: string[];
  cons: string[];
  verifiedPurchase: boolean;
  authorName: string | null;
  publishedAt: string | null;
}

function StarRating({ score }: { score: number }) {
  const stars = scoreToStars(score);
  const full = Math.floor(stars);
  const hasHalf = stars - full >= 0.3;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < full ? "text-yellow-400" : i === full && hasHalf ? "text-yellow-400/50" : "text-navy-lighter"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function CommunityReviewCard({
  title, body, roboScore, pros, cons, verifiedPurchase, authorName, publishedAt,
}: CommunityReviewCardProps) {
  return (
    <div className="rounded-xl border border-border bg-navy-light p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold">{title}</h4>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-xs text-muted">
              by {authorName || "Anonymous"}
            </span>
            {verifiedPurchase && (
              <span className="flex items-center gap-1 rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-medium text-green">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Verified Purchase
              </span>
            )}
            {publishedAt && (
              <span className="text-[10px] text-muted">
                {new Date(publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {roboScore != null && <StarRating score={roboScore} />}
          {roboScore != null && <RoboScoreBadge score={roboScore} className="text-[9px]" />}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted">{body}</p>

      {(pros?.length > 0 || cons?.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-4">
          {pros?.length > 0 && (
            <div>
              {pros.map((p, i) => (
                <p key={i} className="flex items-center gap-1 text-xs text-muted">
                  <span className="text-green">+</span> {p}
                </p>
              ))}
            </div>
          )}
          {cons?.length > 0 && (
            <div>
              {cons.map((c, i) => (
                <p key={i} className="flex items-center gap-1 text-xs text-muted">
                  <span className="text-orange">−</span> {c}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
