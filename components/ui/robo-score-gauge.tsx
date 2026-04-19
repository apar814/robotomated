"use client";

import { useEffect, useRef, useState } from "react";

interface RoboScoreGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function getScoreSegmentColor(score: number): string {
  if (score >= 80) return "rgba(16,185,129,0.3)";
  if (score >= 60) return "rgba(245,158,11,0.3)";
  return "rgba(239,68,68,0.3)";
}

export function RoboScoreGauge({ score, size = 120, showLabel = true }: RoboScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Trigger on viewport intersection
  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Animate score count-up
  useEffect(() => {
    if (!hasStarted) return;
    const start = performance.now();
    const duration = 1000;
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [hasStarted, score]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - 12) / 2;
  const startAngle = 135;
  const endAngle = 405;
  const range = endAngle - startAngle;
  const scoreAngle = startAngle + (range * Math.min(animatedScore, 100)) / 100;
  const color = getScoreColor(score);
  const segmentColor = getScoreSegmentColor(score);

  function polarToCartesian(angle: number, r: number = radius) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  const bgStart = polarToCartesian(startAngle);
  const bgEnd = polarToCartesian(endAngle);
  const scoreEnd = polarToCartesian(scoreAngle);
  const largeArcBg = range > 180 ? 1 : 0;
  const largeArcScore = scoreAngle - startAngle > 180 ? 1 : 0;

  // Tick marks at 10-point intervals
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const angle = startAngle + (range * i * 10) / 100;
    const inner = polarToCartesian(angle, radius - 3);
    const outer = polarToCartesian(angle, radius + 3);
    return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
  });

  const fontSize = size >= 100 ? size * 0.28 : size * 0.32;
  const labelSize = Math.max(7, size * 0.07);

  return (
    <div ref={ref} className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <path
          d={`M${bgStart.x},${bgStart.y} A${radius},${radius} 0 ${largeArcBg} 1 ${bgEnd.x},${bgEnd.y}`}
          fill="none"
          stroke={segmentColor}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Score arc */}
        {animatedScore > 0 && (
          <path
            d={`M${bgStart.x},${bgStart.y} A${radius},${radius} 0 ${largeArcScore} 1 ${scoreEnd.x},${scoreEnd.y}`}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        )}
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
          />
        ))}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-[family-name:var(--font-brand)] font-extrabold"
          style={{ fontSize, color, lineHeight: 1, textShadow: `0 0 20px ${color}40` }}
        >
          {animatedScore}
        </span>
        {showLabel && (
          <span
            className="font-[family-name:var(--font-brand)] font-semibold uppercase"
            style={{ fontSize: labelSize, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginTop: 2 }}
          >
            ROBOSCORE
          </span>
        )}
      </div>
    </div>
  );
}
