"use client";

const PULSE_ITEMS = [
  "Figure AI $39.5B valuation",
  "Unitree G1 now $16K",
  "Japan commits $6.3B to robotics",
  "137 humanoid companies in China",
  "Eclipse $1.3B Physical AI fund closed",
  "Agility Digit scaling in Amazon warehouses",
  "Boston Dynamics Atlas Electric: commercial deployment",
  "RaaS market growing 40% annually",
  "Physical Intelligence raises $400M for Pi0",
  "Amazon operates 750,000+ robots",
  "Nvidia Isaac GR00T N1 open foundation model",
  "South Korea designates robotics national strategic tech",
  "1X Technologies ships NEO Beta to homes",
  "US DOD awards $1.8B robotics contract",
  "Spot passes 10,000 units deployed",
  "FANUC installs millionth robot",
];

export function MarketPulseTicker() {
  return (
    <div
      className="relative overflow-hidden border-b"
      style={{
        background: "#060A12",
        borderColor: "rgba(255,255,255,0.06)",
        height: "32px",
      }}
    >
      <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#060A12] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#060A12] to-transparent" />

      <div className="flex h-full items-center">
        <div
          className="flex shrink-0 items-center gap-6"
          style={{
            animation: "ticker-scroll 60s linear infinite",
          }}
        >
          {[...PULSE_ITEMS, ...PULSE_ITEMS].map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-6">
              <span
                className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {item}
              </span>
              <span
                className="h-1 w-1 shrink-0 rounded-full"
                style={{ background: "rgba(255,255,255,0.3)" }}
              />
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
