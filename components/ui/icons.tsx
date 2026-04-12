import type { SVGProps, ReactElement } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const defaults = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#2563EB",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function icon(fn: (p: IconProps) => ReactElement) {
  return fn;
}

export const IconBroom = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M3 21l3.5-3.5M7.5 16.5l-1-1M18 4l-8.5 8.5M9.5 12.5l2 2M5.5 18.5l2-2" />
    <path d="M14 7l3-3 3 3-3 3z" />
  </svg>
));

export const IconPackage = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
));

export const IconShield = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
));

export const IconSearch = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
));

export const IconWrench = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
));

export const IconClipboard = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
));

export const IconZap = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
));

export const IconPalette = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="13.5" cy="6.5" r="1.5" fill="#2563EB" stroke="none" />
    <circle cx="17.5" cy="10.5" r="1.5" fill="#2563EB" stroke="none" />
    <circle cx="8.5" cy="7.5" r="1.5" fill="#2563EB" stroke="none" />
    <circle cx="6.5" cy="12.5" r="1.5" fill="#2563EB" stroke="none" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.24-.3-.39-.65-.39-1.04 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.49-9-10-9z" />
  </svg>
));

export const IconSprout = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M7 20h10M12 20v-8" />
    <path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" />
    <path d="M12 12c0-4 4-8 8-8-4 0-8 4-8 8z" />
  </svg>
));

export const IconHospital = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M12 10v4M10 12h4" />
  </svg>
));

export const IconHotel = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14" />
    <path d="M3 11h18M9 5v6M15 5v6M9 17v-2M15 17v-2" />
  </svg>
));

export const IconConstruction = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M2 20h20M4 20V10l8-6 8 6v10" />
    <path d="M9 20v-6h6v6" />
  </svg>
));

export const IconGear = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
));

export const IconFactory = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M2 20h20V8l-6 4V8l-6 4V4H2z" />
  </svg>
));

export const IconMedical = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M8 2h8v6h6v8h-6v6H8v-6H2v-8h6z" />
  </svg>
));

export const IconRobot = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <rect x="5" y="8" width="14" height="12" rx="2" />
    <path d="M9 13h0M15 13h0" strokeWidth={2.5} />
    <path d="M9 17h6" />
    <path d="M12 2v4M7 8V6M17 8V6" />
  </svg>
));

export const IconDollar = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
));

export const IconTarget = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
));

export const IconTrophy = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3M18 9h3a1 1 0 001-1V5a1 1 0 00-1-1h-3" />
    <path d="M6 4h12v5a6 6 0 01-12 0V4z" />
    <path d="M12 15v3M8 21h8M10 18h4" />
  </svg>
));

export const IconLock = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
));

export const IconCheck = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
));

export const IconX = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
));

export const IconRefresh = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
));

export const IconStar = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
));

export const IconBriefcase = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </svg>
));

export const IconCertificate = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
));

export const IconPause = icon(({ size = 18, ...props }) => (
  <svg {...defaults(size)} {...props}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
));

/** Map a task-type value to the correct icon component */
export const TASK_TYPE_ICONS: Record<string, typeof IconBroom> = {
  cleaning: IconBroom,
  delivery: IconPackage,
  security: IconShield,
  inspection: IconSearch,
  assembly: IconWrench,
  picking: IconClipboard,
  packing: IconPackage,
  welding: IconZap,
  painting: IconPalette,
  agriculture: IconSprout,
  healthcare: IconHospital,
  hospitality: IconHotel,
  construction: IconConstruction,
  other: IconGear,
};
