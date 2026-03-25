"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  fallbackLabel?: string;
  fallbackSublabel?: string;
  priority?: boolean;
}

function RobotSilhouette() {
  return (
    <svg viewBox="0 0 80 80" fill="none" className="h-16 w-16">
      {/* Head */}
      <circle cx="40" cy="20" r="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      {/* Eyes */}
      <circle cx="35" cy="18" r="2" fill="rgba(255,255,255,0.06)" />
      <circle cx="45" cy="18" r="2" fill="rgba(255,255,255,0.06)" />
      {/* Body */}
      <rect x="26" y="34" width="28" height="24" rx="4" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      {/* Arms */}
      <line x1="26" y1="40" x2="14" y2="48" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54" y1="40" x2="66" y2="48" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Neck */}
      <line x1="40" y1="32" x2="40" y2="34" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      {/* Legs */}
      <line x1="34" y1="58" x2="30" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="46" y1="58" x2="50" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SafeImage({
  src,
  alt,
  fill = true,
  sizes,
  className = "",
  fallbackLabel,
  fallbackSublabel,
  priority,
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="relative flex h-full w-full flex-col items-center justify-center px-3 text-center"
        style={{ background: "linear-gradient(135deg, #0F1628, #1A2340)" }}
      >
        <RobotSilhouette />
        {fallbackLabel && (
          <span className="mt-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white/30">
            {fallbackLabel}
          </span>
        )}
        <span className="mt-1 text-sm font-semibold text-white/50">
          {fallbackSublabel || alt}
        </span>
        <span className="absolute bottom-2 right-3 text-[9px] text-white/20">
          Image coming soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setError(true)}
    />
  );
}
