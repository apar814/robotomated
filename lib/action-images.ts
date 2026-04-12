/** Action Images Data Library — single source of truth for task/action/industry imagery */

import type { CSSProperties } from "react";

// ── Types ──

export interface ActionImage {
  youtubeId?: string;
  gradient: string;
  icon: string;
  label: string;
  subtitle?: string;
  color: string;
}

// ── YouTube thumbnail helper ──

export function getThumbnailUrl(
  youtubeId: string,
  quality: "maxres" | "hq" = "hq"
): string {
  return `https://img.youtube.com/vi/${youtubeId}/${quality === "maxres" ? "maxresdefault" : "hqdefault"}.jpg`;
}

// ── ACTION_IMAGES map ──

export const ACTION_IMAGES: Record<string, ActionImage> = {
  // Task keys (match wizard PROBLEMS array IDs)
  "material-transport": {
    youtubeId: "lYlNjFdOCZ4",
    gradient: "from-blue-900 via-blue-800 to-cyan-900",
    icon: "Package",
    label: "Move Materials",
    subtitle: "AMRs, conveyors, forklifts",
    color: "#2563EB",
  },
  "pick-pack": {
    youtubeId: "quMz3FhOMZk",
    gradient: "from-indigo-900 via-purple-800 to-indigo-900",
    icon: "PackageCheck",
    label: "Pick & Pack",
    subtitle: "Order fulfillment robots",
    color: "#8B5CF6",
  },
  cleaning: {
    youtubeId: "Ra2Rb2JWwks",
    gradient: "from-cyan-900 via-teal-800 to-cyan-900",
    icon: "Sparkles",
    label: "Clean Surfaces",
    subtitle: "Floor scrubbers, UV sanitizers",
    color: "#06B6D4",
  },
  inspection: {
    youtubeId: "wlkCQxHsBnY",
    gradient: "from-amber-900 via-orange-800 to-amber-900",
    icon: "ScanLine",
    label: "Inspect & Survey",
    subtitle: "Drones, inspection robots",
    color: "#F59E0B",
  },
  security: {
    youtubeId: "KMcEVdMJ5QA",
    gradient: "from-red-900 via-rose-800 to-red-900",
    icon: "Shield",
    label: "Secure a Facility",
    subtitle: "Patrol robots, surveillance",
    color: "#EF4444",
  },
  service: {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-pink-900 via-rose-800 to-pink-900",
    icon: "Users",
    label: "Serve Customers",
    subtitle: "Service, delivery, reception",
    color: "#EC4899",
  },
  agriculture: {
    youtubeId: "gBVVqIQVMhk",
    gradient: "from-green-900 via-emerald-800 to-green-900",
    icon: "Leaf",
    label: "Harvest Crops",
    subtitle: "Agricultural automation",
    color: "#10B981",
  },
  manufacturing: {
    youtubeId: "6c8Szsc3Oy4",
    gradient: "from-orange-900 via-amber-800 to-orange-900",
    icon: "Wrench",
    label: "Weld & Assemble",
    subtitle: "Manufacturing robots",
    color: "#F97316",
  },
  delivery: {
    youtubeId: "dRi4Jl7dLkQ",
    gradient: "from-violet-900 via-purple-800 to-violet-900",
    icon: "Truck",
    label: "Deliver Items",
    subtitle: "Internal delivery robots",
    color: "#7C3AED",
  },
  other: {
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    icon: "HelpCircle",
    label: "Something Else",
    subtitle: "Tell us what you need",
    color: "#64748B",
  },

  // Industry keys
  warehouse: {
    youtubeId: "lYlNjFdOCZ4",
    gradient: "from-blue-950 via-blue-900 to-cyan-950",
    icon: "Warehouse",
    label: "Warehouse",
    color: "#2563EB",
  },
  medical: {
    youtubeId: "dRi4Jl7dLkQ",
    gradient: "from-teal-950 via-teal-900 to-cyan-950",
    icon: "Heart",
    label: "Medical",
    color: "#14B8A6",
  },
  humanoid: {
    youtubeId: "29ECwExc-_M",
    gradient: "from-purple-950 via-indigo-900 to-purple-950",
    icon: "Bot",
    label: "Humanoid",
    color: "#8B5CF6",
  },
  hospitality: {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-amber-950 via-amber-900 to-orange-950",
    icon: "Hotel",
    label: "Hospitality",
    color: "#F59E0B",
  },
  construction: {
    youtubeId: "wlkCQxHsBnY",
    gradient: "from-yellow-950 via-amber-900 to-yellow-950",
    icon: "HardHat",
    label: "Construction",
    color: "#EAB308",
  },
  eldercare: {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-rose-950 via-pink-900 to-rose-950",
    icon: "Heart",
    label: "Eldercare",
    color: "#FB7185",
  },
  agricultural: {
    youtubeId: "gBVVqIQVMhk",
    gradient: "from-green-950 via-green-900 to-emerald-950",
    icon: "Leaf",
    label: "Agriculture",
    color: "#22C55E",
  },
  consumer: {
    youtubeId: "Ra2Rb2JWwks",
    gradient: "from-sky-950 via-sky-900 to-blue-950",
    icon: "Home",
    label: "Consumer",
    color: "#60A5FA",
  },
};

// ── Lookup helpers ──

const FALLBACK_KEY = "other";

export function getActionImage(key: string): ActionImage {
  return ACTION_IMAGES[key] ?? ACTION_IMAGES[FALLBACK_KEY];
}

export function getBackgroundStyle(key: string): CSSProperties {
  const image = getActionImage(key);

  if (image.youtubeId) {
    const url = getThumbnailUrl(image.youtubeId, "hq");
    return {
      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }

  // For entries without a YouTube thumbnail, use a solid color-tinted background
  return {
    background: `linear-gradient(135deg, ${image.color}22 0%, ${image.color}44 100%)`,
  };
}
