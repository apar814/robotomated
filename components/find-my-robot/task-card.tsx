"use client";

import { useState } from "react";
import { getActionImage } from "@/lib/action-images";

/* ────────────────────────────────────────────
   SVG Icons — 40px, stroke #2563EB
   ──────────────────────────────────────────── */

const svgProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#2563EB",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function getIcon(taskKey: string) {
  switch (taskKey) {
    case "material-transport":
      return (
        <svg {...svgProps}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "pick-pack":
      return (
        <svg {...svgProps}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      );
    case "cleaning":
      return (
        <svg {...svgProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "inspection":
      return (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "security":
      return (
        <svg {...svgProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "service":
      return (
        <svg {...svgProps}>
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      );
    case "agriculture":
      return (
        <svg {...svgProps}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      );
    case "manufacturing":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
          <path d="M14.83 9.17a4 4 0 010 5.66M9.17 9.17a4 4 0 000 5.66" />
        </svg>
      );
    case "delivery":
      return (
        <svg {...svgProps}>
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "other":
    default:
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
  }
}

/* ────────────────────────────────────────────
   TaskCard Component
   ──────────────────────────────────────────── */

interface TaskCardProps {
  taskKey: string;
  selected: boolean;
  onSelect: () => void;
}

export default function TaskCard({ taskKey, selected, onSelect }: TaskCardProps) {
  const action = getActionImage(taskKey);
  const [hovered, setHovered] = useState(false);

  const bg = selected
    ? "linear-gradient(145deg, rgba(37,99,235,0.15) 0%, rgba(20,30,60,0.99) 100%)"
    : hovered
      ? "linear-gradient(145deg, rgba(20,26,52,0.99) 0%, rgba(12,16,32,0.99) 100%)"
      : "linear-gradient(145deg, rgba(14,18,38,0.97) 0%, rgba(8,10,20,0.99) 100%)";

  const borderColor = selected
    ? "#2563EB"
    : hovered
      ? "rgba(37,99,235,0.5)"
      : "rgba(255,255,255,0.08)";

  const shadow = selected
    ? "0 0 0 1px rgba(37,99,235,0.4), 0 8px 24px rgba(37,99,235,0.15)"
    : hovered
      ? "0 8px 24px rgba(37,99,235,0.12)"
      : "none";

  const transform = selected
    ? "scale(1.02)"
    : hovered
      ? "translateY(-2px)"
      : "none";

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full overflow-hidden rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/50"
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: "2rem 1.5rem",
        minHeight: 140,
        cursor: "pointer",
        boxShadow: shadow,
        transform,
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
        {/* Icon */}
        <div style={{ marginBottom: 16 }}>
          {getIcon(taskKey)}
        </div>

        {/* Label + arrow */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-ui, 'Space Grotesk'), sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "#F0F4FF",
              lineHeight: 1.2,
            }}
          >
            {action.label}
          </span>
          <span
            style={{
              opacity: hovered || selected ? 1 : 0,
              transition: "opacity 0.15s",
              color: "#2563EB",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            &rarr;
          </span>
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8.5L6.5 11.5L12.5 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}
