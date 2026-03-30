"use client";

import { createContext, useContext } from "react";
import type { SiteStats } from "@/lib/data/site-stats";

const SiteStatsContext = createContext<SiteStats>({
  robotCount: 0,
  manufacturerCount: 0,
  categoryCount: 0,
});

export function SiteStatsProvider({
  stats,
  children,
}: {
  stats: SiteStats;
  children: React.ReactNode;
}) {
  return (
    <SiteStatsContext.Provider value={stats}>
      {children}
    </SiteStatsContext.Provider>
  );
}

export function useSiteStats(): SiteStats {
  return useContext(SiteStatsContext);
}
