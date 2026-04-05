"use client";

import Image from "next/image";
import { useState } from "react";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

// ── Emoji map for icon names ──
const ICON_EMOJI: Record<string, string> = {
  Package: "\u{1F4E6}",
  Sparkles: "\u2728",
  ScanLine: "\u{1F50D}",
  Shield: "\u{1F6E1}\uFE0F",
  Users: "\u{1F465}",
  Leaf: "\u{1F33F}",
  Wrench: "\u{1F527}",
  Truck: "\u{1F69A}",
  Warehouse: "\u{1F3ED}",
  Heart: "\u2764\uFE0F",
  Bot: "\u{1F916}",
  Hotel: "\u{1F3E8}",
  HardHat: "\u{1F477}",
  Home: "\u{1F3E0}",
  HelpCircle: "\u2753",
  PackageCheck: "\u{1F4E6}",
};

interface RobotImageProps {
  src: string | null;
  alt: string;
  categorySlug?: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}

export function RobotImage({
  src,
  alt,
  categorySlug = "other",
  className = "",
  sizes,
  fill = true,
}: RobotImageProps) {
  const [imgError, setImgError] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const actionImage = getActionImage(categorySlug);
  const hasRealSrc = !!src && !src.includes("unsplash") && !imgError;

  // ── Tier 1: Actual robot image ──
  if (hasRealSrc) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className="object-cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // ── Tier 2: YouTube thumbnail for category ──
  if (actionImage.youtubeId) {
    const thumbUrl = getThumbnailUrl(actionImage.youtubeId, "hq");

    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ background: actionImage.gradient.includes("linear-gradient")
          ? actionImage.gradient
          : `linear-gradient(135deg, ${actionImage.color}33 0%, ${actionImage.color}66 100%)`
        }}
      >
        {/* Hidden img to detect load */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl}
          alt=""
          className="sr-only"
          onLoad={() => setThumbLoaded(true)}
          onError={() => setThumbLoaded(false)}
        />

        {/* YouTube thumbnail as background div */}
        {thumbLoaded && (
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `url(${thumbUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Dark overlay gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Alt text label at bottom */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <span className="text-xs font-medium text-white/60">{alt}</span>
        </div>
      </div>
    );
  }

  // ── Tier 3: Gradient + emoji icon (always works) ──
  const emoji = ICON_EMOJI[actionImage.icon] || "\u{1F916}";
  const gradientBg = actionImage.gradient.includes("linear-gradient")
    ? actionImage.gradient
    : `linear-gradient(135deg, ${actionImage.color}33 0%, ${actionImage.color}66 100%)`;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradientBg }}
    >
      {/* Large centered emoji */}
      <span
        className="select-none text-6xl"
        style={{ opacity: 0.4 }}
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Small label text */}
      <span
        className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium"
        style={{ opacity: 0.3, color: "#fff" }}
      >
        {actionImage.label}
      </span>
    </div>
  );
}
