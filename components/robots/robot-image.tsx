"use client";

import Image from "next/image";
import { useState } from "react";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

// ── SVG icon renderer for category fallbacks ──
function CategoryIcon({ name }: { name: string }) {
  const p = { width: 48, height: 48, viewBox: "0 0 24 24", fill: "none", stroke: "#D4D4D4", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, style: { opacity: 0.4 } };
  switch (name) {
    case "Package": case "PackageCheck": return <svg {...p}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
    case "Sparkles": return <svg {...p}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /></svg>;
    case "ScanLine": return <svg {...p}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>;
    case "Shield": return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "Users": return <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>;
    case "Leaf": return <svg {...p}><path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /></svg>;
    case "Wrench": return <svg {...p}><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>;
    case "Truck": return <svg {...p}><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>;
    case "Warehouse": return <svg {...p}><path d="M3 21V8l9-5 9 5v13" /><rect x="7" y="13" width="4" height="8" /><rect x="13" y="13" width="4" height="8" /></svg>;
    case "Heart": return <svg {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>;
    case "Hotel": return <svg {...p}><path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" /><path d="M3 11h18" /></svg>;
    case "HardHat": return <svg {...p}><path d="M2 18v-1a10 10 0 0120 0v1" /><path d="M2 18h20" /><path d="M12 2v6" /></svg>;
    case "Home": return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>;
    default: return <svg {...p}><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M9 13h0M15 13h0" strokeWidth={2.5} /><path d="M9 17h6M12 2v4" /></svg>;
  }
}

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

  // ── Tier 3: Gradient + SVG icon (always works) ──
  const gradientBg = actionImage.gradient.includes("linear-gradient")
    ? actionImage.gradient
    : `linear-gradient(135deg, ${actionImage.color}33 0%, ${actionImage.color}66 100%)`;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradientBg }}
    >
      {/* Large centered SVG icon */}
      <span
        className="select-none"
        aria-hidden="true"
      >
        <CategoryIcon name={actionImage.icon} />
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
