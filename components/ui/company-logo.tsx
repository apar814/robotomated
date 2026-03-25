"use client";

import { useState } from "react";

interface CompanyLogoProps {
  logoUrl?: string | null;
  name: string;
  height?: number;
  maxWidth?: number;
  className?: string;
}

const COLORS = ["#FFB400", "#059669", "#0066FF", "#E63946", "#8B5CF6", "#00C2FF", "#F97316", "#10B981"];

export function CompanyLogo({ logoUrl, name, height = 28, maxWidth = 120, className = "" }: CompanyLogoProps) {
  const [error, setError] = useState(false);

  const src = logoUrl && !error ? logoUrl : null;

  if (!src) {
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const colorIndex = name.charCodeAt(0) % COLORS.length;
    return (
      <div
        className={`flex items-center justify-center rounded-full font-bold text-white ${className}`}
        style={{ width: height, height, backgroundColor: COLORS[colorIndex], fontSize: height * 0.35 }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      onError={() => setError(true)}
      className={`object-contain ${className}`}
      style={{ height, width: "auto", maxWidth }}
      loading="lazy"
    />
  );
}
