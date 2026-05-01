/** Robotimus — geometric robot head avatar */
export function RobotimusAvatar({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-12 w-12" : size === "md" ? "h-8 w-8" : "h-6 w-6";
  return (
    <div className={`${dims} shrink-0`}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        {/* Antenna */}
        <line x1="16" y1="2" x2="16" y2="6" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="2" r="1.5" fill="#D4D4D4" />
        {/* Head */}
        <rect x="6" y="6" width="20" height="16" rx="4" fill="#D4D4D4" fillOpacity="0.15" stroke="#D4D4D4" strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx="12" cy="14" r="2.5" fill="#FFFFFF" />
        <circle cx="20" cy="14" r="2.5" fill="#FFFFFF" />
        {/* Eye glint */}
        <circle cx="13" cy="13" r="0.8" fill="white" fillOpacity="0.8" />
        <circle cx="21" cy="13" r="0.8" fill="white" fillOpacity="0.8" />
        {/* Mouth */}
        <rect x="11" y="18" width="10" height="1.5" rx="0.75" fill="#D4D4D4" fillOpacity="0.6" />
        {/* Ears */}
        <rect x="3" y="11" width="3" height="6" rx="1.5" fill="#D4D4D4" fillOpacity="0.3" />
        <rect x="26" y="11" width="3" height="6" rx="1.5" fill="#D4D4D4" fillOpacity="0.3" />
        {/* Neck */}
        <rect x="14" y="22" width="4" height="3" rx="1" fill="#D4D4D4" fillOpacity="0.4" />
        {/* Shoulders */}
        <rect x="9" y="25" width="14" height="4" rx="2" fill="#D4D4D4" fillOpacity="0.15" stroke="#D4D4D4" strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Inline robot icon for nav buttons */
export function RobotimusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="4" width="16" height="12" rx="3" fill="#D4D4D4" fillOpacity="0.2" stroke="#D4D4D4" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.5" fill="#FFFFFF" />
      <circle cx="15" cy="10" r="1.5" fill="#FFFFFF" />
      <rect x="8.5" y="13" width="7" height="1" rx="0.5" fill="#D4D4D4" fillOpacity="0.5" />
      <path d="M10 16v3M14 16v3M8 19h8" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="1" x2="12" y2="4" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
