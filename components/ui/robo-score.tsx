import { cn } from "@/lib/utils/cn";

/* ── Obsidian tier colors ── */
function getScoreColor(score: number) {
  if (score >= 90)
    return {
      text: "text-lime",
      bg: "bg-lime",
      border: "border-lime/10",
      ring: "stroke-lime",
      dimBg: "bg-lime-dim",
      hex: "#C8FF00",
    };
  if (score >= 80)
    return {
      text: "text-white",
      bg: "bg-white",
      border: "border-white/10",
      ring: "stroke-white",
      dimBg: "bg-white/[0.05]",
      hex: "#FFFFFF",
    };
  if (score >= 70)
    return {
      text: "text-amber",
      bg: "bg-amber",
      border: "border-amber/10",
      ring: "stroke-amber",
      dimBg: "bg-[rgba(251,191,36,0.05)]",
      hex: "#FBBF24",
    };
  return {
    text: "text-magenta",
    bg: "bg-magenta",
    border: "border-magenta/10",
    ring: "stroke-magenta",
    dimBg: "bg-magenta-dim",
    hex: "#FF006E",
  };
}

/* ── 9 Dimensions (updated weights) ── */
const DIMENSIONS = [
  { name: "Performance", weight: 22, key: "performance" },
  { name: "Reliability", weight: 20, key: "reliability" },
  { name: "Ease of Use", weight: 15, key: "ease_of_use" },
  { name: "Intelligence", weight: 15, key: "intelligence" },
  { name: "Vendor Reliability", weight: 10, key: "vendor_reliability" },
  { name: "Value", weight: 9, key: "value" },
  { name: "Ecosystem", weight: 7, key: "ecosystem" },
  { name: "Safety", weight: 5, key: "safety" },
  { name: "Design", weight: 4, key: "design" },
];

/* ── Tooltip (hover-only on desktop) ── */
function RoboScoreTooltip() {
  const maxWeight = DIMENSIONS[0].weight;
  return (
    <div
      className={cn(
        "pointer-events-none absolute left-0 bottom-full z-50 mb-2 w-[280px] rounded-md border border-border bg-obsidian-surface p-4 opacity-0 shadow-xl transition-opacity duration-150",
        "group-hover:pointer-events-auto group-hover:opacity-100"
      )}
    >
      <p className="font-mono text-[10px] font-bold tracking-wider text-text-secondary">
        ROBOSCORE&trade; METHODOLOGY &mdash; 9 DIMENSIONS
      </p>
      <div className="my-2 border-t border-border" />

      <div className="space-y-1.5">
        {DIMENSIONS.map((d) => (
          <div key={d.key} className="flex items-center gap-2 font-mono text-[10px]">
            <span className="w-[100px] shrink-0 text-text-tertiary">{d.name}</span>
            <span className="w-[28px] shrink-0 text-right text-text-secondary">
              {d.weight}%
            </span>
            <div className="relative h-[3px] flex-1 overflow-hidden rounded-sm bg-white/[0.05]">
              <div
                className="absolute inset-y-0 left-0 rounded-sm bg-electric-blue"
                style={{ width: `${(d.weight / maxWeight) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 border-t border-border" />
      <p className="mt-2 font-mono text-[10px] leading-relaxed text-text-tertiary">
        Independently verified.
        <br />
        Not manufacturer-provided.
      </p>
    </div>
  );
}

/** Small inline badge for cards */
export function RoboScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const c = getScoreColor(score);
  return (
    <span className="group relative inline-flex">
      <span
        title="RoboScore — hover to see methodology"
        className={cn(
          "inline-flex cursor-help items-center rounded-[2px] border px-2.5 py-0.5 font-mono text-xs font-bold",
          c.text,
          c.border,
          c.dimBg,
          className
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {score.toFixed(1)}
      </span>
      <RoboScoreTooltip />
    </span>
  );
}

/** Large ring display with animated fill */
export function RoboScoreRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  const c = getScoreColor(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div
      title="RoboScore"
      className="relative inline-flex cursor-help items-center justify-center"
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
          className="text-white/[0.03]"
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
          className={cn(
            c.ring,
            "transition-[stroke-dashoffset] duration-1000 ease-out"
          )}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={cn(
            "font-mono font-bold",
            c.text,
            size >= 100 ? "text-2xl" : "text-lg"
          )}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-[9px] tracking-wider text-text-tertiary">
          / 100
        </span>
      </div>
    </div>
  );
}

/** Horizontal bar with score fill */
export function ScoreBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-right font-mono text-xs text-text-tertiary">
        {label}
      </div>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-sm bg-white/[0.05]">
        <div
          className="absolute inset-y-0 left-0 rounded-sm bg-electric-blue transition-[width] duration-700 ease-out"
          style={{ width: `${score}%`, opacity: 0.85 }}
        />
      </div>
      <span
        className="w-8 font-mono text-xs font-bold text-text-secondary"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {score}
      </span>
      {weight && (
        <span className="w-10 text-right font-mono text-[10px] text-text-tertiary">
          {weight}
        </span>
      )}
    </div>
  );
}
