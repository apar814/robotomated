import { cn } from "@/lib/utils/cn";

function getScoreColor(score: number) {
  if (score >= 90) return { text: "text-green", bg: "bg-green", border: "border-green/30", ring: "stroke-green", glow: "shadow-[0_0_20px_rgba(0,229,160,0.3)]" };
  if (score >= 70) return { text: "text-amber-400", bg: "bg-amber-400", border: "border-amber-400/30", ring: "stroke-amber-400", glow: "shadow-[0_0_20px_rgba(251,191,36,0.3)]" };
  if (score >= 50) return { text: "text-orange", bg: "bg-orange", border: "border-orange/30", ring: "stroke-orange", glow: "" };
  return { text: "text-red-400", bg: "bg-red-400", border: "border-red-400/30", ring: "stroke-red-400", glow: "" };
}

/** Small inline badge for cards */
export function RoboScoreBadge({ score, className }: { score: number; className?: string }) {
  const c = getScoreColor(score);
  return (
    <span
      title="RoboScore — click to see breakdown"
      className={cn(
        "inline-flex cursor-help items-center rounded-full border px-2.5 py-0.5 font-mono text-xs font-semibold",
        c.text, c.border, `${c.bg}/10`,
        className
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

/** Large ring display with animated fill and glow */
export function RoboScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const c = getScoreColor(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      title="RoboScore — click to see breakdown"
      className={cn("relative inline-flex cursor-help items-center justify-center rounded-full", c.glow)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={5}
          className="text-black/[0.06]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={cn(c.ring, "transition-[stroke-dashoffset] duration-1000 ease-out")}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-display font-bold", c.text, size >= 100 ? "text-2xl" : "text-lg")}>
          {score.toFixed(1)}
        </span>
        <span className="text-[9px] tracking-wider text-muted">/ 100</span>
      </div>
    </div>
  );
}

/** Horizontal bar with glass track */
export function ScoreBar({ label, score, weight }: { label: string; score: number; weight?: string }) {
  const c = getScoreColor(score);
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 shrink-0 text-right text-xs text-muted">{label}</div>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out", c.bg)}
          style={{ width: `${score}%`, opacity: 0.85 }}
        />
      </div>
      <span className={cn("w-8 font-mono text-xs font-semibold", c.text)}>{score}</span>
      {weight && <span className="w-10 text-right text-[10px] text-muted/60">{weight}</span>}
    </div>
  );
}
