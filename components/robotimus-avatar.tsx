/** Robotimus — geometric robot avatar SVG. Works at 24px (nav) to 96px (hero). */
export function RobotimusAvatar({ size = 32, glow = false, className = "" }: { size?: number; glow?: boolean; className?: string }) {
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.35) 0%, transparent 70%)",
            animation: "pulse-glow 3s ease-in-out infinite",
            transform: "scale(1.5)",
          }}
        />
      )}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        className="relative"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="32" fill="#0EA5E9" />

        {/* Antenna */}
        <rect x="30" y="6" width="4" height="8" rx="2" fill="#FFFFFF" />
        <circle cx="32" cy="6" r="3" fill="#FFFFFF" />

        {/* Head */}
        <rect x="16" y="16" width="32" height="26" rx="5" fill="#0A0F1E" stroke="#FFFFFF" strokeWidth="2" />

        {/* Eyes */}
        <rect x="22" y="24" width="7" height="7" rx="1.5" fill="#FFFFFF" />
        <rect x="35" y="24" width="7" height="7" rx="1.5" fill="#FFFFFF" />

        {/* Mouth */}
        <rect x="24" y="36" width="16" height="2" rx="1" fill="rgba(255,255,255,0.6)" />

        {/* Ear accents */}
        <rect x="12" y="24" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.4)" />
        <rect x="49" y="24" width="3" height="10" rx="1.5" fill="rgba(255,255,255,0.4)" />

        {/* Body hint */}
        <rect x="22" y="44" width="20" height="10" rx="3" fill="#0A0F1E" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="28" y="47" width="8" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  );
}
