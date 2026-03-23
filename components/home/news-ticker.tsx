"use client";

const NEWS_ITEMS = [
  { date: "Mar 2026", headline: "Unitree plans 10-20K humanoid shipments in 2026", source: "Mix Vale" },
  { date: "Mar 2026", headline: "Figure AI valued at $39B after Series C", source: "TSG Invest" },
  { date: "Mar 2026", headline: "BMW deploys humanoid robots in German factories", source: "BMW Press" },
  { date: "Feb 2026", headline: "Unitree G1 prices from $21,600 to $73,900", source: "BotInfo" },
  { date: "Feb 2026", headline: "Figure 02 completes 11-month BMW deployment", source: "Figure AI" },
  { date: "Jan 2026", headline: "Agility Robotics raises $400M growth round", source: "DCVC" },
  { date: "Jan 2026", headline: "UBTECH launches Walker S for NIO factories", source: "UBTECH" },
  { date: "Dec 2025", headline: "Apptronik closes $350M Series B", source: "Apptronik" },
  { date: "Dec 2025", headline: "Global robotics market hits $65B", source: "McKinsey" },
  { date: "Nov 2025", headline: "Figure 02 loads 90K parts at BMW Spartanburg", source: "Assembly Mag" },
  { date: "Nov 2025", headline: "Boston Dynamics retires hydraulic Atlas", source: "Boston Dynamics" },
  { date: "Oct 2025", headline: "Figure 03 unveiled, designed for mass production", source: "Figure AI" },
  { date: "Oct 2025", headline: "Unitree R1 named TIME Best Invention 2025", source: "TIME" },
  { date: "Sep 2025", headline: "Cobot market growing at 35% CAGR", source: "Deloitte" },
  { date: "Sep 2025", headline: "78% of supply chain execs plan robot investments", source: "KPMG" },
  { date: "Aug 2025", headline: "Universal Robots UR30 launched — 30kg payload", source: "UR" },
];

export function NewsTicker() {
  return (
    <div className="hidden w-[260px] flex-shrink-0 flex-col md:flex">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8A84E]">
        Industry Pulse
      </p>
      <div className="relative flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm" style={{ maxHeight: 340 }}>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[#050A15] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-[#050A15] to-transparent" />

        <div className="news-ticker px-4 py-2">
          {[...NEWS_ITEMS, ...NEWS_ITEMS].map((item, i) => (
            <div key={i} className="border-b border-white/[0.04] py-3 last:border-0">
              <span className="font-mono text-[10px] text-[#C8A84E]">{item.date}</span>
              <p className="mt-0.5 text-[13px] font-medium leading-snug text-white/85">
                {item.headline}
              </p>
              <span className="mt-0.5 block text-[10px] text-white/30">{item.source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
