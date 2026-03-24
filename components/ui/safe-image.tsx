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

/**
 * Image with built-in error fallback. When the image fails to load
 * (CDN blocks Vercel proxy, 404, timeout), shows a branded placeholder
 * instead of broken alt text.
 */
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
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-3 text-center">
        {fallbackLabel && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-300">
            {fallbackLabel}
          </span>
        )}
        <span className="mt-1 text-sm font-semibold text-neutral-400">
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
