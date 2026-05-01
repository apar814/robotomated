"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { INDUSTRIES, TASK_TYPES, FULFILLMENT_OPTIONS, URGENCY_CONFIG } from "@/lib/robowork/constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "budget_high", label: "Budget: High to Low" },
  { value: "budget_low", label: "Budget: Low to High" },
  { value: "urgency", label: "Most Urgent" },
  { value: "bids", label: "Most Bids" },
];

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);

  const current = useCallback(
    (key: string) => searchParams.get(key) || "",
    [searchParams]
  );

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination
    router.push(`/robowork/jobs?${params.toString()}`);
  }

  const selectClass =
    "rounded border border-border bg-obsidian-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-white/50 transition-colors";
  const inputClass =
    "rounded border border-border bg-obsidian-elevated px-3 py-2 text-xs text-text-primary outline-none focus:border-white/50 transition-colors w-full";

  return (
    <div className="rounded-lg border border-border bg-obsidian-surface p-4">
      {/* Primary row: sort + toggle */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className={cn(selectClass, "min-w-[140px]")}
          value={current("sort") || "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          className={cn(selectClass, "min-w-[160px]")}
          value={current("industry")}
          onChange={(e) => updateParam("industry", e.target.value)}
        >
          <option value="">All Industries</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>

        <select
          className={cn(selectClass, "min-w-[160px]")}
          value={current("taskType") || current("task_type")}
          onChange={(e) => updateParam("task_type", e.target.value)}
        >
          <option value="">All Task Types</option>
          {TASK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto rounded border border-border px-3 py-2 font-mono text-[13px] uppercase tracking-wider text-text-secondary transition-colors hover:border-white/20 hover:text-white"
        >
          {expanded ? "Less Filters" : "More Filters"}
        </button>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 sm:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              City
            </label>
            <input
              className={inputClass}
              placeholder="Any city"
              defaultValue={current("city")}
              onBlur={(e) => updateParam("city", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("city", e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              State
            </label>
            <input
              className={inputClass}
              placeholder="Any state"
              defaultValue={current("state")}
              onBlur={(e) => updateParam("state", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateParam("state", e.currentTarget.value);
              }}
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Budget Min
            </label>
            <input
              type="number"
              className={inputClass}
              placeholder="$0"
              defaultValue={current("budget_min")}
              onBlur={(e) => updateParam("budget_min", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Budget Max
            </label>
            <input
              type="number"
              className={inputClass}
              placeholder="No limit"
              defaultValue={current("budget_max")}
              onBlur={(e) => updateParam("budget_max", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Fulfillment
            </label>
            <select
              className={cn(selectClass, "w-full")}
              value={current("fulfillment_type")}
              onChange={(e) => updateParam("fulfillment_type", e.target.value)}
            >
              <option value="">Any</option>
              {FULFILLMENT_OPTIONS.filter((f) => f.value !== "any").map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[13px] uppercase tracking-widest text-text-ghost">
              Urgency
            </label>
            <select
              className={cn(selectClass, "w-full")}
              value={current("urgency")}
              onChange={(e) => updateParam("urgency", e.target.value)}
            >
              <option value="">Any</option>
              {Object.entries(URGENCY_CONFIG).map(([key, conf]) => (
                <option key={key} value={key}>
                  {conf.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
