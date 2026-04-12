"use client";

import { useMemo } from "react";

export interface CapabilityData {
  speed: number;
  payload: number;
  intelligence: number;
  precision: number;
  endurance: number;
  versatility: number;
}

interface CapabilityRadarProps {
  data: CapabilityData;
  activeCategory: string | null;
}

const DIMENSIONS: { key: keyof CapabilityData; label: string }[] = [
  { key: "speed", label: "Speed" },
  { key: "payload", label: "Payload" },
  { key: "intelligence", label: "Intelligence" },
  { key: "precision", label: "Precision" },
  { key: "endurance", label: "Endurance" },
  { key: "versatility", label: "Versatility" },
];

const CX = 200;
const CY = 200;
const RADIUS = 150;

function polarToCartesian(
  angleDeg: number,
  radius: number
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(angleRad),
    y: CY + radius * Math.sin(angleRad),
  };
}

function hexagonPoints(radius: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const { x, y } = polarToCartesian(i * 60, radius);
    return `${x},${y}`;
  }).join(" ");
}

export function CapabilityRadar({ data, activeCategory }: CapabilityRadarProps) {
  const dataPoints = useMemo(() => {
    return DIMENSIONS.map((dim, i) => {
      const value = data[dim.key];
      const scaledRadius = (value / 100) * RADIUS;
      const angle = i * 60;
      return {
        ...polarToCartesian(angle, scaledRadius),
        value,
        label: dim.label,
        labelPos: polarToCartesian(angle, RADIUS + 28),
        valuePos: polarToCartesian(angle, scaledRadius + 16),
      };
    });
  }, [data]);

  const dataPolygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const axisLines = Array.from({ length: 6 }, (_, i) => {
    const end = polarToCartesian(i * 60, RADIUS);
    return { x1: CX, y1: CY, x2: end.x, y2: end.y };
  });

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <svg
        viewBox="0 0 400 400"
        className="h-auto w-full"
        role="img"
        aria-label={`Radar chart showing robot capabilities${activeCategory ? ` for ${activeCategory}` : ""}`}
      >
        {/* Grid hexagons */}
        {[0.33, 0.66, 1].map((scale) => (
          <polygon
            key={scale}
            points={hexagonPoints(RADIUS * scale)}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={dataPolygonPoints}
          fill="rgba(37,99,235,0.15)"
          stroke="#2563EB"
          strokeWidth={2}
          strokeLinejoin="round"
          style={{
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Data point dots */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill="#2563EB"
            stroke="#080808"
            strokeWidth={2}
            style={{
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ))}

        {/* Dimension labels */}
        {dataPoints.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.labelPos.x}
            y={p.labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.45)"
            fontSize={12}
            fontFamily="'Space Grotesk', sans-serif"
          >
            {p.label}
          </text>
        ))}

        {/* Value labels */}
        {dataPoints.map((p, i) => (
          <text
            key={`value-${i}`}
            x={p.valuePos.x}
            y={p.valuePos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#2563EB"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={600}
            style={{
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {p.value}
          </text>
        ))}
      </svg>
    </div>
  );
}
