"use client";

import { useEffect, useState } from "react";

interface RoboScoreGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export function RoboScoreGauge({ score, size = 64, showLabel = true }: RoboScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);
  const fontSize = size >= 64 ? size * 0.3 : size * 0.35;
  const labelSize = Math.max(8, size * 0.12);

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--theme-border)"
          strokeWidth={3}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      {/* Score number */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ top: showLabel ? -2 : 0 }}
      >
        <span
          className="font-mono font-extrabold"
          style={{ fontSize, color, lineHeight: 1 }}
        >
          {Math.round(animatedScore)}
        </span>
        {showLabel && (
          <span
            className="font-mono font-semibold uppercase tracking-wider"
            style={{ fontSize: labelSize, color: "var(--theme-text-muted)", marginTop: 1 }}
          >
            SCORE
          </span>
        )}
      </div>
    </div>
  );
}
