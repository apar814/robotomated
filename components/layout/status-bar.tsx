"use client";

import { useState, useEffect, useRef } from "react";
import { useSiteStats } from "@/lib/context/site-stats";

export function StatusBar() {
  const { robotCount, manufacturerCount, categoryCount } = useSiteStats();
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 29) return 0;
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="sticky top-12 z-40 flex h-[30px] items-center justify-between border-b border-border-subtle bg-[#050505] px-6 font-mono text-[13px]">
      {/* Left side — desktop */}
      <div className="hidden items-center gap-5 md:flex">
        {/* ACTIVE indicator */}
        <span className="flex items-center gap-1.5">
          <span className="animate-pulse-live h-1 w-1 rounded-full bg-lime shadow-[0_0_4px_rgba(200,255,0,0.6)]" />
          <span className="text-lime">ACTIVE</span>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-text-tertiary">ROBOTS</span>
          <span className="font-semibold text-text-data">{robotCount}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-text-tertiary">MANUFACTURERS</span>
          <span className="font-semibold text-text-data">{manufacturerCount}</span>
        </span>

        <span className="flex items-center gap-1.5">
          <span className="text-text-tertiary">MARKETS</span>
          <span className="font-semibold text-text-data">{categoryCount}</span>
        </span>
      </div>

      {/* Right side — desktop */}
      <div className="hidden items-center gap-1.5 md:flex">
        <span className="text-text-tertiary">REFRESHED</span>
        <span className="text-electric-blue">
          {minutes}:{seconds} AGO
        </span>
      </div>

      {/* Mobile */}
      <div className="flex items-center text-text-tertiary md:hidden">
        <span className="font-semibold text-text-data">{robotCount}</span>
        <span className="mx-1">ROBOTS</span>
        <span className="mx-1 text-text-ghost">//</span>
        <span className="font-semibold text-text-data">$103B</span>
        <span className="ml-1">MARKET</span>
      </div>
    </div>
  );
}
