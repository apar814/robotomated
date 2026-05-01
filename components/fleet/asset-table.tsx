"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { DemoAsset, DemoSchedule, DemoMaintenanceLog } from "@/lib/fleet/demo-data";

const statusStyles: Record<string, string> = {
  active: "bg-[#00E5A0]/15 text-[#00E5A0] border-[#00E5A0]/30",
  maintenance: "bg-white/10 text-white border-white/20",
  offline: "bg-red-400/15 text-red-400 border-red-400/30",
  decommissioned: "bg-white/10 text-white/40 border-white/10",
};

type SortKey = "name" | "location" | "status" | "lastService" | "nextDue";

interface AssetTableProps {
  assets: DemoAsset[];
  logs: DemoMaintenanceLog[];
  schedules: DemoSchedule[];
  isDemo?: boolean;
}

export function AssetTable({ assets, logs, schedules, isDemo }: AssetTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  function getLastService(assetId: string): string | null {
    const assetLogs = logs
      .filter((l) => l.asset_id === assetId)
      .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());
    return assetLogs[0]?.log_date ?? null;
  }

  function getNextDue(assetId: string): string | null {
    const assetSchedules = schedules
      .filter((s) => s.asset_id === assetId && s.is_active && s.next_due)
      .sort((a, b) => new Date(a.next_due!).getTime() - new Date(b.next_due!).getTime());
    return assetSchedules[0]?.next_due ?? null;
  }

  function formatDate(d: string | null): string {
    if (!d) return "--";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function isOverdue(d: string | null): boolean {
    if (!d) return false;
    return new Date(d) < new Date();
  }

  const sortedAssets = useMemo(() => {
    const mapped = assets.map((a) => ({
      ...a,
      lastService: getLastService(a.id),
      nextDue: getNextDue(a.id),
    }));

    mapped.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = (a.custom_name || a.robot_name).localeCompare(b.custom_name || b.robot_name);
          break;
        case "location":
          cmp = a.site_location.localeCompare(b.site_location);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "lastService":
          cmp = (a.lastService ?? "").localeCompare(b.lastService ?? "");
          break;
        case "nextDue":
          cmp = (a.nextDue ?? "9999").localeCompare(b.nextDue ?? "9999");
          break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return mapped;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, logs, schedules, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    const active = sortKey === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/50 hover:text-white/80 transition-colors"
      >
        {label}
        {active && (
          <span className="text-[#00C2FF]">{sortAsc ? "\u2191" : "\u2193"}</span>
        )}
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.08]">
            <th className="px-4 py-3 text-left">
              <SortHeader label="Robot" field="name" />
            </th>
            <th className="px-4 py-3 text-left hidden sm:table-cell">
              <SortHeader label="Location" field="location" />
            </th>
            <th className="px-4 py-3 text-left">
              <SortHeader label="Status" field="status" />
            </th>
            <th className="px-4 py-3 text-left hidden md:table-cell">
              <SortHeader label="Last Service" field="lastService" />
            </th>
            <th className="px-4 py-3 text-left hidden md:table-cell">
              <SortHeader label="Next Due" field="nextDue" />
            </th>
            <th className="px-4 py-3 text-right">
              <span className="text-xs font-medium uppercase tracking-wider text-white/50">
                Actions
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAssets.map((asset) => (
            <tr
              key={asset.id}
              className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-semibold text-white/90">
                    {asset.custom_name || asset.robot_name}
                  </p>
                  <p className="text-xs text-white/40">{asset.robot_name}</p>
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                <p className="text-white/60">{asset.site_location}</p>
                <p className="text-xs text-white/50">{asset.department}</p>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[asset.status]}`}
                >
                  {asset.status}
                </span>
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-white/60">
                {formatDate(asset.lastService)}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <span
                  className={
                    isOverdue(asset.nextDue)
                      ? "text-red-400 font-medium"
                      : "text-white/60"
                  }
                >
                  {formatDate(asset.nextDue)}
                  {isOverdue(asset.nextDue) && " (overdue)"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={isDemo ? "#" : `/fleet/${asset.id}`}
                  className="text-[#00C2FF] hover:underline text-xs font-medium"
                  onClick={isDemo ? (e) => e.preventDefault() : undefined}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {assets.length === 0 && (
        <div className="px-4 py-12 text-center text-white/40">
          No robots in your fleet yet. Add your first robot to get started.
        </div>
      )}
    </div>
  );
}
