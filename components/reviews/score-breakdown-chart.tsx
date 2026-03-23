import { ScoreBar } from "@/components/ui/robo-score";
import { DIMENSIONS } from "@/lib/scoring/roboscore";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

export function ScoreBreakdownChart({
  breakdown,
  showWeights = true,
}: {
  breakdown: RoboScoreBreakdown;
  showWeights?: boolean;
}) {
  return (
    <div className="space-y-3">
      {DIMENSIONS.map((dim) => (
        <ScoreBar
          key={dim.key}
          label={dim.label}
          score={breakdown[dim.key]}
          weight={showWeights ? `${Math.round(dim.weight * 100)}%` : undefined}
        />
      ))}
    </div>
  );
}
