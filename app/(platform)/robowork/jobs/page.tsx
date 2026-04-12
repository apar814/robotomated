import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/robowork/job-card";
import { JobFilters } from "@/components/robowork/job-filters";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Browse Robot Jobs — RoboWork | Robotomated",
  description:
    "Browse open robot service jobs. Filter by industry, task type, location, budget, and urgency. Find the right robotic automation job for your fleet.",
};

interface SearchParams {
  industry?: string;
  task_type?: string;
  taskType?: string;
  city?: string;
  state?: string;
  budget_min?: string;
  budget_max?: string;
  fulfillment_type?: string;
  urgency?: string;
  sort?: string;
  page?: string;
}

interface Job {
  slug: string;
  title: string;
  task_type: string;
  industry: string;
  city: string | null;
  state: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_days: number | null;
  urgency: string;
  status: string;
  bid_count: number;
  created_at: string;
  remote_ok: boolean;
}

const PAGE_SIZE = 12;

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = createServerClient();
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  // Build query
  let query = supabase
    .from("robowork_jobs")
    .select(
      "slug, title, task_type, industry, city, state, budget_min, budget_max, duration_days, urgency, status, bid_count, created_at, remote_ok",
      { count: "exact" }
    )
    .eq("status", "open");

  if (params.industry) query = query.eq("industry", params.industry);
  if (params.task_type || params.taskType)
    query = query.eq("task_type", params.task_type || params.taskType!);
  if (params.city) query = query.ilike("city", params.city);
  if (params.state) query = query.eq("state", params.state);
  if (params.fulfillment_type)
    query = query.eq("fulfillment_type", params.fulfillment_type);
  if (params.urgency) query = query.eq("urgency", params.urgency);
  if (params.budget_min)
    query = query.gte("budget_max", parseFloat(params.budget_min));
  if (params.budget_max)
    query = query.lte("budget_min", parseFloat(params.budget_max));

  // Sort
  switch (params.sort) {
    case "budget_high":
      query = query.order("budget_max", { ascending: false, nullsFirst: false });
      break;
    case "budget_low":
      query = query.order("budget_min", { ascending: true, nullsFirst: false });
      break;
    case "bids":
      query = query.order("bid_count", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, count } = await query;
  const jobs = (data || []) as Job[];
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/robowork"
            className="mb-3 inline-block font-mono text-[13px] text-electric-blue transition-colors hover:underline"
          >
            &larr; RoboWork
          </Link>
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-text-primary">
            Browse Robot Jobs
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {count || 0} open job{(count || 0) !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <Suspense fallback={<div className="h-14 rounded-lg border border-border bg-obsidian-surface" />}>
            <JobFilters />
          </Suspense>
        </div>

        {/* Job grid */}
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-border bg-obsidian-surface px-8 py-16 text-center">
            <p className="text-sm text-text-secondary">No jobs match your filters.</p>
            <Link
              href="/robowork/jobs"
              className="mt-3 inline-block font-mono text-xs text-electric-blue hover:underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.slug} {...job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <PaginationLink
                page={page - 1}
                params={params}
                label="Previous"
              />
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <PaginationLink
                  key={p}
                  page={p}
                  params={params}
                  label={String(p)}
                  active={p === page}
                />
              );
            })}
            {page < totalPages && (
              <PaginationLink
                page={page + 1}
                params={params}
                label="Next"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PaginationLink({
  page,
  params,
  label,
  active,
}: {
  page: number;
  params: SearchParams;
  label: string;
  active?: boolean;
}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "page") sp.set(k, v);
  });
  sp.set("page", String(page));

  return (
    <Link
      href={`/robowork/jobs?${sp.toString()}`}
      className={
        active
          ? "rounded bg-electric-blue px-3 py-1.5 text-xs font-bold text-white"
          : "rounded border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-electric-blue hover:text-electric-blue"
      }
    >
      {label}
    </Link>
  );
}
