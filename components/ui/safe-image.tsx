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

function RobotIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12 text-white/[0.06]">
      <rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="18" r="2.5" fill="currentColor" />
      <circle cx="28" cy="18" r="2.5" fill="currentColor" />
      <rect x="18" y="28" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="40" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="40" r="3" stroke="currentColor" strokeWidth="1.5" />
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
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F1628] to-[#141C33] px-3 text-center">
        <RobotIcon />
        {fallbackLabel && (
          <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25">
            {fallbackLabel}
          </span>
        )}
        <span className="mt-1 text-sm font-semibold text-white/45">
          {fallbackSublabel || alt}
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
