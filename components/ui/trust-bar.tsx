const TRUST_ITEMS = [
  {
    prefix: "INDEPENDENT",
    suffix: " — No manufacturer pays for scores",
  },
  {
    prefix: "50+ DATA POINTS",
    suffix: " per robot verified",
  },
  {
    prefix: "WEEKLY",
    suffix: " price & availability checks",
  },
  {
    prefix: "EST. 2025",
    suffix: " · San Francisco",
  },
];

export function TrustBar() {
  return (
    <div
      style={{
        background: "#050505",
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
      }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-6 py-2.5 md:flex md:justify-between">
        {TRUST_ITEMS.map((item) => (
          <div key={item.prefix} className="flex items-center gap-2">
            <div className="h-1 w-1 shrink-0 rounded-full bg-electric-blue" />
            <span className="font-mono text-[13px] uppercase tracking-wider text-tertiary">
              <span className="text-secondary">{item.prefix}</span>
              {item.suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
