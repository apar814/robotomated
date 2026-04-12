"use client";

import Link from "next/link";
import { useSiteStats } from "@/lib/context/site-stats";

export function AdvisorCtaStrip() {
  const { robotCount } = useSiteStats();
  return (
    <div
      className="w-full px-6 py-10"
      style={{
        borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A",
      }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-lg font-semibold text-primary">
          Not sure which robot fits your operation?
        </h2>
        <p className="mt-2 text-[13px] text-tertiary">
          Robotimus narrows {robotCount}+ robots down to your top 3 in under a minute.
        </p>
        <Link
          href="/advisor"
          className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-electric-blue px-6 py-2.5 font-mono text-[13px] font-bold tracking-widest text-black transition-shadow hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          ASK ROBOTIMUS →
        </Link>
      </div>
    </div>
  );
}
