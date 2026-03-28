"use client";

const TICKER_DATA = [
  { sym: "ATLAS", score: 94, delta: "+3.0", price: "$150K", up: true },
  { sym: "STCH", score: 91, delta: "+0.8", price: "RFQ", up: true },
  { sym: "UR20", score: 89, delta: "+0.4", price: "$58K", up: true },
  { sym: "SPOT", score: 87, delta: "+2.1", price: "$74K", up: true },
  { sym: "DIGIT", score: 78, delta: "-1.2", price: "RFQ", up: false },
  { sym: "PNDA", score: 83, delta: "-0.3", price: "$28K", up: false },
  { sym: "REX", score: 85, delta: "+1.5", price: "$42K", up: true },
  { sym: "UR10", score: 82, delta: "+0.2", price: "$35K", up: true },
  { sym: "ION", score: 76, delta: "-0.5", price: "$12K", up: false },
  { sym: "B2", score: 80, delta: "+1.1", price: "$45K", up: true },
];

function TickerItem({ sym, score, delta, price, up }: (typeof TICKER_DATA)[number]) {
  return (
    <div
      className="flex h-[30px] items-center gap-1.5 px-3.5"
      style={{ borderRight: "1px solid #131313" }}
    >
      <span className="font-mono text-[10px] font-bold tracking-wider text-data">
        {sym}
      </span>
      <span className="font-mono text-[10px] font-medium text-secondary">
        {score}
      </span>
      <span
        className={`font-mono text-[9px] font-semibold ${
          up ? "text-lime" : "text-magenta"
        }`}
      >
        {delta}
      </span>
      <span className="font-mono text-[9px] text-tertiary">{price}</span>
    </div>
  );
}

export function DataTicker() {
  return (
    <div
      className="relative hidden h-[30px] overflow-hidden md:flex"
      style={{ background: "#050505", borderBottom: "1px solid #131313" }}
    >
      {/* Left fade */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20"
        style={{
          background: "linear-gradient(to right, #050505, transparent)",
        }}
      />
      {/* Right fade */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20"
        style={{
          background: "linear-gradient(to left, #050505, transparent)",
        }}
      />

      {/* Scrolling track */}
      <div className="news-ticker flex items-center">
        {TICKER_DATA.map((item, i) => (
          <TickerItem key={`a-${i}`} {...item} />
        ))}
        {TICKER_DATA.map((item, i) => (
          <TickerItem key={`b-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}
