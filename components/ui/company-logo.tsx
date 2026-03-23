"use client";

import Image from "next/image";
import { useState } from "react";

interface CompanyLogoProps {
  logoUrl?: string | null;
  domain?: string;
  name: string;
  size?: number;
  className?: string;
}

const COLORS = ["#FFB400", "#059669", "#0066FF", "#E63946", "#8B5CF6", "#00C2FF", "#F97316", "#10B981"];

export function CompanyLogo({ logoUrl, domain, name, size = 40, className = "" }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  const src = logoUrl && !error ? logoUrl : null;

  if (!src) {
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const colorIndex = name.charCodeAt(0) % COLORS.length;
    return (
      <div
        className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
        style={{ width: size, height: size, backgroundColor: COLORS[colorIndex], fontSize: size * 0.35 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      className={`rounded-lg object-contain ${className}`}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
