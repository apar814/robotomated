"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  URGENCY_CONFIG,
  STATUS_CONFIG,
  formatBudget,
  relativeTime,
  TASK_TYPES,
} from "@/lib/robowork/constants";

interface JobCardProps {
  slug: string;
  title: string;
  task_type: string;
  industry: string;
  city?: string | null;
  state?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  duration_days?: number | null;
  urgency: string;
  status: string;
  bid_count: number;
  created_at: string;
  remote_ok?: boolean;
}

const INDUSTRY_COLORS: Record<string, string> = {
  "Warehouse & Logistics": "bg-electric-blue/10 text-electric-blue",
  Manufacturing: "bg-violet/10 text-violet",
  Construction: "bg-amber/10 text-amber",
  Agriculture: "bg-lime/10 text-lime",
  Healthcare: "bg-magenta/10 text-magenta",
  Hospitality: "bg-electric-blue/10 text-electric-blue",
  Security: "bg-magenta/10 text-magenta",
  Retail: "bg-violet/10 text-violet",
  "Food & Beverage": "bg-amber/10 text-amber",
  Mining: "bg-amber/10 text-amber",
  Energy: "bg-lime/10 text-lime",
  Education: "bg-electric-blue/10 text-electric-blue",
};

export function JobCard({
  slug,
  title,
  task_type,
  industry,
  city,
  state,
  budget_min,
  budget_max,
  duration_days,
  urgency,
  status,
  bid_count,
  created_at,
  remote_ok,
}: JobCardProps) {
  const urgencyConf = URGENCY_CONFIG[urgency as keyof typeof URGENCY_CONFIG] || URGENCY_CONFIG.flexible;
  const statusConf = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  const taskLabel = TASK_TYPES.find((t) => t.value === task_type)?.label || task_type;
  const industryColor = INDUSTRY_COLORS[industry] || "bg-electric-blue/10 text-electric-blue";

  const location = [city, state].filter(Boolean).join(", ") || (remote_ok ? "Remote" : "Location TBD");

  return (
    <Link
      href={`/robowork/jobs/${slug}`}
      className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:-translate-y-0.5 hover:border-border-active hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      {/* Top row: badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold", industryColor)}>
          {industry}
        </span>
        <span className={cn("rounded border px-2 py-0.5 text-[10px] font-semibold", urgencyConf.color)}>
          {urgencyConf.label}
        </span>
        <span className={cn("rounded px-2 py-0.5 text-[10px] font-semibold", statusConf.color)}>
          {statusConf.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-text-primary transition-colors group-hover:text-electric-blue">
        {title}
      </h3>

      {/* Task type */}
      <p className="mt-1 font-mono text-[11px] text-text-secondary">{taskLabel}</p>

      {/* Details row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {location}
        </span>
        <span className="font-mono font-semibold text-electric-blue">
          {formatBudget(budget_min, budget_max)}
        </span>
        {duration_days && (
          <span>{duration_days} day{duration_days !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-[11px] text-text-tertiary">{relativeTime(created_at)}</span>
        <span className="font-mono text-[11px] text-text-secondary">
          {bid_count} bid{bid_count !== 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
