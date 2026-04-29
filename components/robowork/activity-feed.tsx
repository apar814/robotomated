"use client";

import { useEffect, useState } from "react";

const ACTIVITY_ITEMS = [
  {
    message: "A logistics company in Phoenix just posted a pallet moving job",
    category: "Warehouse Automation",
    time: "2 minutes ago",
  },
  {
    message: "A verified RSP in Dallas bid on a warehouse automation project",
    category: "Warehouse Automation",
    time: "5 minutes ago",
  },
  {
    message: "A hospital in Seattle posted a logistics robot deployment",
    category: "Healthcare Support",
    time: "8 minutes ago",
  },
  {
    message: "A cleaning provider in Chicago was awarded a 6-month floor care contract",
    category: "Cleaning & Sanitation",
    time: "12 minutes ago",
  },
  {
    message: "A manufacturing firm in Detroit posted a cobot welding integration job",
    category: "Construction & Welding",
    time: "15 minutes ago",
  },
  {
    message: "A verified RSP in Atlanta submitted 3 bids on security patrol jobs",
    category: "Security Patrol",
    time: "18 minutes ago",
  },
  {
    message: "An agriculture operation in Fresno posted a seasonal harvest automation request",
    category: "Agriculture & Harvest",
    time: "22 minutes ago",
  },
  {
    message: "A hotel chain in Miami deployed a hospitality robot through RoboWork",
    category: "Hospitality Service",
    time: "28 minutes ago",
  },
  {
    message: "A construction firm in Denver posted a site inspection drone survey",
    category: "Inspection & Survey",
    time: "34 minutes ago",
  },
  {
    message: "A verified RSP in Boston completed a warehouse AMR deployment ahead of schedule",
    category: "Warehouse Automation",
    time: "41 minutes ago",
  },
];

const TOP_CATEGORIES = [
  { name: "Warehouse Automation", count: 47, trend: "+12%" },
  { name: "Floor Cleaning", count: 31, trend: "+8%" },
  { name: "Security Patrol", count: 24, trend: "+5%" },
];

export function ActivityFeed() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60_000);
    return () => clearInterval(interval);
  }, [now]);

  return (
    <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Most Posted Jobs This Week */}
          <div>
            <p className="mb-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              [ MOST POSTED THIS WEEK ]
            </p>
            <h2 className="mb-6 text-lg font-bold text-text-primary">
              Top Job Categories
            </h2>
            <div className="space-y-3">
              {TOP_CATEGORIES.map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-obsidian-surface px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[#2563EB]/10 font-[family-name:var(--font-brand)] text-xs font-bold text-[#2563EB]">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {cat.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-text-primary">
                      {cat.count}
                    </span>
                    <span className="ml-2 text-xs font-medium text-[#00E5A0]">
                      {cat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <p className="mb-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              [ MARKETPLACE ACTIVITY ]
            </p>
            <h2 className="mb-6 text-lg font-bold text-text-primary">
              Live Activity
            </h2>
            <div className="space-y-0">
              {ACTIVITY_ITEMS.slice(0, visibleCount).map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-3 ${
                    i < visibleCount - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563EB]/60" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text-secondary">
                      {item.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-[#2563EB]/10 px-1.5 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#2563EB]">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-text-ghost">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {visibleCount < ACTIVITY_ITEMS.length && (
              <button
                onClick={() => setVisibleCount(ACTIVITY_ITEMS.length)}
                className="mt-4 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-[#2563EB] transition-colors hover:underline"
              >
                Show More Activity
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
