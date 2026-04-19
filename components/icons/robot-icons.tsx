/**
 * Custom robot-specific SVG icons for Robotomated.
 * Each icon is a pure SVG component — scalable, single-color, consistent.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** Top-down view of an AMR — rectangular body, 4 wheels, forward arrow */
export function AmrIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="6" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
      <circle cx="7" cy="8" r="1.5" fill={color} opacity="0.6" />
      <circle cx="17" cy="8" r="1.5" fill={color} opacity="0.6" />
      <circle cx="7" cy="18" r="1.5" fill={color} opacity="0.6" />
      <circle cx="17" cy="18" r="1.5" fill={color} opacity="0.6" />
      <path d="M12 11V3M12 3L9 6M12 3L15 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Side view of a robot arm — 3 joints, human hand nearby */
export function CobotIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20V16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 16L8 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="10" r="1.5" fill={color} opacity="0.5" />
      <path d="M8 10L14 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="6" r="1.5" fill={color} opacity="0.5" />
      <path d="M14 6L18 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="16" r="1.5" fill={color} opacity="0.5" />
      {/* Gripper */}
      <path d="M18 3L19.5 2M18 3L19.5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Human hand */}
      <path d="M20 14V11M21.5 14V12M18.5 14V12.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M17.5 14H22.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

/** Simplified human silhouette with circuit pattern inside */
export function HumanoidIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="4.5" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M8 9H16C16 9 17 9.5 17 11V15L15 14V21H13V16H11V21H9V14L7 15V11C7 9.5 8 9 8 9Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Circuit traces inside body */}
      <line x1="12" y1="10" x2="12" y2="13" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="10.5" y1="11.5" x2="13.5" y2="11.5" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="12" cy="11.5" r="0.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/** Top-down quadcopter — 4 rotors, geometric */
export function DroneIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Body */}
      <rect x="10" y="10" width="4" height="4" rx="1" stroke={color} strokeWidth="1.5" />
      {/* Arms */}
      <line x1="10" y1="10" x2="6" y2="6" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="10" x2="18" y2="6" stroke={color} strokeWidth="1.2" />
      <line x1="10" y1="14" x2="6" y2="18" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="14" x2="18" y2="18" stroke={color} strokeWidth="1.2" />
      {/* Rotors */}
      <circle cx="6" cy="6" r="2.5" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="18" cy="6" r="2.5" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="6" cy="18" r="2.5" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="18" cy="18" r="2.5" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/** 3 small robots in formation — represents fleet */
export function FleetIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Robot 1 (center front) */}
      <rect x="9" y="4" width="6" height="5" rx="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="10.5" cy="6.5" r="0.8" fill={color} opacity="0.5" />
      <circle cx="13.5" cy="6.5" r="0.8" fill={color} opacity="0.5" />
      {/* Robot 2 (left back) */}
      <rect x="2" y="13" width="6" height="5" rx="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="3.5" cy="15.5" r="0.8" fill={color} opacity="0.5" />
      <circle cx="6.5" cy="15.5" r="0.8" fill={color} opacity="0.5" />
      {/* Robot 3 (right back) */}
      <rect x="16" y="13" width="6" height="5" rx="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="17.5" cy="15.5" r="0.8" fill={color} opacity="0.5" />
      <circle cx="20.5" cy="15.5" r="0.8" fill={color} opacity="0.5" />
      {/* Connection lines */}
      <line x1="12" y1="9" x2="5" y2="13" stroke={color} strokeWidth="0.8" strokeDasharray="2 1" opacity="0.3" />
      <line x1="12" y1="9" x2="19" y2="13" stroke={color} strokeWidth="0.8" strokeDasharray="2 1" opacity="0.3" />
    </svg>
  );
}

/** Hexagonal badge with circuit traces and checkmark */
export function CertificationIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Hexagon */}
      <path d="M12 2L20.5 7V17L12 22L3.5 17V7L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Circuit traces */}
      <line x1="7" y1="9" x2="10" y2="9" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="15" x2="17" y2="15" stroke={color} strokeWidth="0.5" opacity="0.3" />
      {/* Checkmark */}
      <path d="M8.5 12L11 14.5L16 9.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Lightning bolt inside shield — earned, aggressive */
export function GauntletIcon({ size = 24, color = "currentColor", className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Shield */}
      <path d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Lightning bolt */}
      <path d="M13 6L9 13H12L11 18L15 11H12L13 6Z" fill={color} opacity="0.8" />
    </svg>
  );
}

/** Premium shield with RCO text — color varies by level */
export function RcoShield({
  size = 24,
  color = "currentColor",
  level = 0,
  className,
}: IconProps & { level?: number }) {
  const stars = Math.min(level, 5);
  return (
    <svg width={size} height={size} viewBox="0 0 32 36" fill="none" className={className}>
      {/* Shield shape */}
      <path d="M16 2L4 7V17C4 24 9 30 16 33C23 30 28 24 28 17V7L16 2Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* RCO text */}
      <text x="16" y="18" textAnchor="middle" fill={color} fontSize="7" fontFamily="var(--font-brand, Orbitron)" fontWeight="700">
        RCO
      </text>
      {/* Stars */}
      {Array.from({ length: stars }).map((_, i) => (
        <circle key={i} cx={10 + i * 3} cy="24" r="1" fill={color} opacity="0.7" />
      ))}
    </svg>
  );
}

/** Partial circle arc gauge — speedometer style for RoboScore */
export function RoboScoreGaugeIcon({
  size = 24,
  score = 0,
  color = "currentColor",
  className,
}: IconProps & { score?: number }) {
  const radius = 9;
  const cx = 12;
  const cy = 13;
  const startAngle = 135;
  const endAngle = 405;
  const range = endAngle - startAngle;
  const scoreAngle = startAngle + (range * Math.min(score, 100)) / 100;

  function polarToCartesian(angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const bgStart = polarToCartesian(startAngle);
  const bgEnd = polarToCartesian(endAngle);
  const scoreEnd = polarToCartesian(scoreAngle);
  const largeArcBg = range > 180 ? 1 : 0;
  const largeArcScore = scoreAngle - startAngle > 180 ? 1 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* Background arc */}
      <path
        d={`M${bgStart.x},${bgStart.y} A${radius},${radius} 0 ${largeArcBg} 1 ${bgEnd.x},${bgEnd.y}`}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.15"
      />
      {/* Score arc */}
      {score > 0 && (
        <path
          d={`M${bgStart.x},${bgStart.y} A${radius},${radius} 0 ${largeArcScore} 1 ${scoreEnd.x},${scoreEnd.y}`}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {/* Tick marks */}
      {[0, 25, 50, 75, 100].map((tick) => {
        const angle = startAngle + (range * tick) / 100;
        const inner = polarToCartesian(angle);
        const outer = (() => {
          const rad = ((angle - 90) * Math.PI) / 180;
          return { x: cx + (radius + 2) * Math.cos(rad), y: cy + (radius + 2) * Math.sin(rad) };
        })();
        return <line key={tick} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={color} strokeWidth="0.8" opacity="0.3" />;
      })}
    </svg>
  );
}
