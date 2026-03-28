const CATEGORIES = [
  "Warehouse Operations",
  "Hospital Procurement",
  "Manufacturing Engineering",
  "Construction",
  "Agricultural Operations",
  "Facility Management",
];

export function SocialProofStrip() {
  return (
    <div
      className="flex items-center gap-3 overflow-hidden px-6 py-2"
      style={{ borderBottom: "1px solid #131313" }}
    >
      <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-ghost">
        USED BY TEAMS IN
      </span>
      <span className="truncate text-[11px]">
        {CATEGORIES.map((cat, i) => (
          <span key={cat}>
            <span className="text-secondary">{cat}</span>
            {i < CATEGORIES.length - 1 && (
              <span className="text-ghost"> · </span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}
