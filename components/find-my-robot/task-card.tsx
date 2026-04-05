"use client";

import { useState, useCallback } from "react";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

/* ────────────────────────────────────────────
   Icon name → emoji mapping (no Lucide dep)
   ──────────────────────────────────────────── */

const ICON_EMOJI: Record<string, string> = {
  Package: "\u{1F4E6}",
  Sparkles: "\u2728",
  ScanLine: "\u{1F50D}",
  Shield: "\u{1F6E1}\uFE0F",
  Users: "\u{1F465}",
  Leaf: "\u{1F33F}",
  Wrench: "\u{1F527}",
  Truck: "\u{1F69A}",
  HelpCircle: "\u2753",
  PackageCheck: "\u{1F4E6}",
};

function iconToEmoji(iconName: string): string {
  return ICON_EMOJI[iconName] ?? "\u2753";
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
        <span className="mb-0.5 text-lg leading-none" aria-hidden="true">
          {iconToEmoji(action.icon)}
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
