"use client";

import { useState } from "react";

interface ManufacturerLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number;
}

export function ManufacturerLogo({ name, logoUrl, size = 48 }: ManufacturerLogoProps) {
  const [failed, setFailed] = useState(false);
  const innerSize = Math.round(size * 0.75);
  const initials = name.slice(0, 2).toUpperCase();

  if (!logoUrl || failed) {
    return (
      <div
        style={{
          width: size, height: size, background: "#FFFFFF", borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: size * 0.3, color: "#D4D4D4" }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        width: size, height: size, background: "#FFFFFF", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={innerSize}
        height={innerSize}
        style={{ objectFit: "contain" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
