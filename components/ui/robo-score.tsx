import { cn } from "@/lib/utils/cn";

function getScoreColor(score: number) {
  if (score >= 90) return { text: "text-blue", bg: "bg-blue", border: "border-blue/30", ring: "stroke-blue" };
  if (score >= 70) return { text: "text-green", bg: "bg-green", border: "border-green/30", ring: "stroke-green" };
  if (score >= 50) return { text: "text-orange", bg: "bg-orange", border: "border-orange/30", ring: "stroke-orange" };
  return { text: "text-red-400", bg: "bg-red-400", border: "border-red-400/30", ring: "stroke-red-400" };
}

/** Small inline badge for cards */
export function RoboScoreBadge({ score, className }: { score: number; className?: string }) {
  const c = getScoreColor(score);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold",
        c.text, c.border, `${c.bg}/10`,
        className
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

/** Large ring display for detail pages */
export function RoboScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const c = getScoreColor(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          className="text-navy-lighter"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={c.ring}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-mono text-2xl font-bold", c.text)}>{score.toFixed(1)}</span>
        <span className="text-[10px] text-muted">/ 100</span>
      </div>
    </div>
  );
}

/** Horizontal bar for score breakdown */
export function ScoreBar({ label, score, weight }: { label: string; score: number; weight?: string }) {
  const c = getScoreColor(score);
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 text-right text-xs text-muted">{label}</div>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-navy-lighter">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", c.bg)}
          style={{ width: `${score}%`, opacity: 0.8 }}
        />
      </div>
      <span className={cn("w-8 font-mono text-xs font-semibold", c.text)}>{score}</span>
      {weight && <span className="w-10 text-right text-[10px] text-muted">{weight}</span>}
    </div>
  );
}
