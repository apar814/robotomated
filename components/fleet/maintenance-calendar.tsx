"use client";

import type { DemoSchedule, DemoAsset } from "@/lib/fleet/demo-data";

interface MaintenanceCalendarProps {
  schedules: DemoSchedule[];
  assets: DemoAsset[];
}

export function MaintenanceCalendar({ schedules, assets }: MaintenanceCalendarProps) {
  const today = new Date();
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Filter to upcoming items this month
  const upcoming = schedules
    .filter((s) => {
      if (!s.next_due || !s.is_active) return false;
      const due = new Date(s.next_due);
      return due >= today && due <= endOfMonth;
    })
    .sort((a, b) => new Date(a.next_due!).getTime() - new Date(b.next_due!).getTime());

  const overdue = schedules
    .filter((s) => {
      if (!s.next_due || !s.is_active) return false;
      return new Date(s.next_due) < today;
    })
    .sort((a, b) => new Date(a.next_due!).getTime() - new Date(b.next_due!).getTime());

  function getAssetName(assetId: string): string {
    const asset = assets.find((a) => a.id === assetId);
    return asset?.custom_name || asset?.robot_name || "Unknown";
  }

  function formatDate(d: string): string {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function daysUntil(d: string): number {
    return Math.ceil(
      (new Date(d).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4">
        Upcoming Maintenance
      </h3>

      {overdue.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-red-400 mb-2">Overdue</p>
          <div className="space-y-2">
            {overdue.map((s) => (
              <div
                key={s.id}
                className="flex items-start gap-3 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {s.schedule_name}
                  </p>
                  <p className="text-xs text-white/40">
                    {getAssetName(s.asset_id)} &middot; Due {formatDate(s.next_due!)}
                  </p>
                </div>
                {s.requires_professional && (
                  <span className="shrink-0 rounded bg-[#7B2FFF]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#7B2FFF]">
                    PRO
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 ? (
        <div className="space-y-2">
          {upcoming.map((s) => {
            const days = daysUntil(s.next_due!);
            const urgent = days <= 3;
            return (
              <div
                key={s.id}
                className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                  urgent
                    ? "border-amber-400/20 bg-amber-400/5"
                    : "border-white/[0.06] bg-white/[0.01]"
                }`}
              >
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    urgent ? "bg-amber-400" : "bg-[#00C2FF]"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">
                    {s.schedule_name}
                  </p>
                  <p className="text-xs text-white/40">
                    {getAssetName(s.asset_id)} &middot; {formatDate(s.next_due!)}
                    {days === 0 ? " (today)" : days === 1 ? " (tomorrow)" : ` (${days} days)`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/30 font-mono">
                    ~{s.estimated_hours}h
                  </p>
                  {s.requires_professional && (
                    <span className="rounded bg-[#7B2FFF]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#7B2FFF]">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : overdue.length === 0 ? (
        <p className="text-sm text-white/30 py-4 text-center">
          No upcoming maintenance this month
        </p>
      ) : null}

      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <p className="text-xs text-white/30">
          {upcoming.length + overdue.length} task{upcoming.length + overdue.length !== 1 ? "s" : ""} total &middot;{" "}
          Est. cost: $
          {[...upcoming, ...overdue]
            .reduce((sum, s) => sum + s.estimated_cost, 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  );
}
