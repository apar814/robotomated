/** Inline SVG icons for key robot specs — stroke-based, 40x40 */

export function PayloadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <path d="M20 6v28M12 14l8-8 8 8" />
      <rect x="8" y="28" width="24" height="6" rx="1" />
    </svg>
  );
}

export function SpeedIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <path d="M8 28a14 14 0 0 1 24 0" />
      <path d="M20 28l-4-10" />
      <circle cx="20" cy="28" r="2" fill="white" stroke="none" />
    </svg>
  );
}

export function BatteryIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <rect x="8" y="12" width="20" height="16" rx="2" />
      <path d="M28 18v4h3v-4z" />
      <rect x="11" y="15" width="8" height="10" rx="1" fill="white" fillOpacity="0.2" stroke="none" />
    </svg>
  );
}

export function ReachIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <path d="M8 20h24M28 14l6 6-6 6" />
      <path d="M12 14l-6 6 6 6" />
    </svg>
  );
}

export function WeightIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <circle cx="8" cy="26" r="5" />
      <circle cx="32" cy="26" r="5" />
      <path d="M13 26h14" />
      <path d="M20 26v-12" />
      <path d="M16 14h8" />
    </svg>
  );
}

export function DofIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <circle cx="20" cy="20" r="10" />
      <path d="M20 10a10 10 0 0 1 0 20" strokeDasharray="3 3" />
      <path d="M14 13l3 3M26 13l-3 3M14 27l3-3M26 27l-3-3" />
    </svg>
  );
}

export function SuctionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
      <path d="M20 8v8M16 12l4 4 4-4" />
      <path d="M12 20c0 6 3.5 12 8 12s8-6 8-12" />
      <path d="M10 20h20" />
    </svg>
  );
}

export const SPEC_ICON_MAP: Record<string, React.FC> = {
  payload_kg: PayloadIcon,
  max_speed: SpeedIcon,
  battery_hrs: BatteryIcon,
  reach_mm: ReachIcon,
  weight_kg: WeightIcon,
  dof: DofIcon,
  suction_pa: SuctionIcon,
};
