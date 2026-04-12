"use client";

import { useState, useCallback } from "react";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

/* ────────────────────────────────────────────
   Icon name → SVG mapping (no emoji, no deps)
   ──────────────────────────────────────────── */

const svgProps = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "#2563EB", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function iconToSvg(iconName: string) {
  switch (iconName) {
    case "Package":
    case "PackageCheck":
      return <svg {...svgProps}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    case "Sparkles":
      return <svg {...svgProps}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /></svg>;
    case "ScanLine":
      return <svg {...svgProps}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "Shield":
      return <svg {...svgProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "Users":
      return <svg {...svgProps}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
    case "Leaf":
      return <svg {...svgProps}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>;
    case "Wrench":
      return <svg {...svgProps}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>;
    case "Truck":
      return <svg {...svgProps}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "HelpCircle":
    default:
      return <svg {...svgProps}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
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
  const [thumbLoaded, setThumbLoaded] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const thumbnailUrl =
    action.youtubeId && !thumbError
      ? getThumbnailUrl(action.youtubeId, "hq")
      : null;

  const handleImgLoad = useCallback(() => setThumbLoaded(true), []);
  const handleImgError = useCallback(() => setThumbError(true), []);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full overflow-hidden rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style={{
        aspectRatio: "16 / 10",
        border: selected
          ? `2px solid ${action.color}`
          : hovered
            ? "2px solid rgba(255,255,255,0.3)"
            : "2px solid transparent",
        boxShadow: selected
          ? `0 0 0 4px ${action.color}20`
          : hovered
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "none",
        transform: selected
          ? "scale(1.02)"
          : hovered
            ? "translateY(-2px)"
            : "none",
        transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Layer 1: Gradient background (always visible) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${action.gradient}`}
        aria-hidden="true"
      />

      {/* Layer 2: YouTube thumbnail (loads async, covers gradient) */}
      {thumbnailUrl && (
        <>
          {/* Hidden img to detect load/error */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt=""
            onLoad={handleImgLoad}
            onError={handleImgError}
            className="absolute h-0 w-0 opacity-0"
            aria-hidden="true"
          />
          {thumbLoaded && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: hovered ? "scale(1.08)" : "scale(1)",
                transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/* Layer 3: Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Layer 4: Content at bottom */}
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <span className="mb-0.5 leading-none" aria-hidden="true">
          {iconToSvg(action.icon)}
        </span>
        <span
          className="text-left font-bold text-white"
          style={{ fontSize: "15px", lineHeight: "1.2" }}
        >
          {action.label}
        </span>
        {action.subtitle && (
          <span
            className="mt-0.5 text-left text-white/70"
            style={{
              fontSize: "12px",
              lineHeight: "1.3",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition:
                "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {action.subtitle}
          </span>
        )}
      </div>

      {/* Selected checkmark (top-right, 28px circle) */}
      {selected && (
        <div
          className="absolute right-2 top-2 flex items-center justify-center rounded-full"
          style={{
            width: 28,
            height: 28,
            backgroundColor: action.color,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8.5L6.5 11.5L12.5 5.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
  );
}
