import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProviderCard } from "@/components/robowork/provider-card";

export const metadata: Metadata = {
  title: "Robot Service Providers — RoboWork Marketplace",
  description:
    "Browse verified robot service providers. Find operators, rental fleets, and automation specialists near you. Transparent ratings and reviews.",
  openGraph: {
    title: "Robot Service Providers — RoboWork",
    description: "Find verified robot service providers near you.",
  },
};

interface RSPRow {
  id: string;
  slug: string;
  company_name: string;
  city: string | null;
  state: string | null;
  rating: number;
  total_jobs: number;
  completed_jobs: number;
  response_time_hours: number | null;
  verified: boolean;
  insurance_verified: boolean;
  background_checked: boolean;
  specializations: string[];
  fulfillment_types: string[];
  created_at: string;
}

const SPECIALIZATION_OPTIONS = [
  "warehouse",
  "medical",
  "hospitality",
  "agriculture",
  "construction",
  "manufacturing",
  "retail",
  "security",
  "eldercare",
];

const FULFILLMENT_OPTIONS = [
  { value: "with_operator", label: "With Operator" },
  { value: "drop_off", label: "Drop Off" },
  { value: "remote_operated", label: "Remote Operated" },
];

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "jobs", label: "Most Jobs" },
  { value: "newest", label: "Newest" },
  { value: "response", label: "Fastest Response" },
];

const PAGE_SIZE = 12;

interface Props {
  searchParams: Promise<{
    city?: string;
    state?: string;
    specialization?: string;
    fulfillment?: string;
    rating?: string;
    verified?: string;
    available?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProvidersPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = createServerClient();

  let query = supabase.from("robot_service_providers").select("*", { count: "exact" });

  // Filters
  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }
  if (params.state) {
    query = query.ilike("state", `%${params.state}%`);
  }
  if (params.specialization) {
    query = query.contains("specializations", [params.specialization]);
  }
  if (params.fulfillment) {
    query = query.contains("fulfillment_types", [params.fulfillment]);
  }
  if (params.rating) {
    query = query.gte("rating", parseFloat(params.rating));
  }
  if (params.verified === "true") {
    query = query.eq("verified", true);
  }

  // Sort
  const sort = params.sort || "rating";
  switch (sort) {
    case "jobs":
      query = query.order("completed_jobs", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "response":
      query = query.order("response_time_hours", { ascending: true, nullsFirst: false });
      break;
    default:
      query = query.order("rating", { ascending: false });
  }

  // Pagination
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: providers, count } = await query.returns<RSPRow[]>();

  // Get review counts for each provider
  const providerIds = (providers || []).map((p) => p.id);
  const reviewCounts: Record<string, number> = {};
  if (providerIds.length > 0) {
    const { data: reviews } = await supabase
      .from("robowork_reviews")
      .select("rsp_id")
      .in("rsp_id", providerIds);
    reviews?.forEach((r) => {
      reviewCounts[r.rsp_id] = (reviewCounts[r.rsp_id] || 0) + 1;
    });
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
  const allProviders = providers || [];

  function buildUrl(overrides: Record<string, string>) {
    const merged = { ...params, ...overrides };
    const qs = Object.entries(merged)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
    return `/robowork/providers${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "RoboWork", href: "/robowork" },
              { name: "Providers", href: "/robowork/providers" },
            ]}
          />
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">
                ROBOWORK MARKETPLACE
              </p>
              <h1 className="mt-2 font-sans text-3xl font-bold text-text-primary sm:text-4xl">
                Robot Service Providers
              </h1>
              <p className="mt-3 max-w-xl font-sans text-sm text-text-secondary">
                Browse verified operators, rental fleets, and automation specialists.
                {count != null && count > 0 && (
                  <span className="text-text-ghost"> {count} provider{count !== 1 ? "s" : ""} listed.</span>
                )}
              </p>
            </div>
            <Link
              href="/robowork/providers/register"
              className="shrink-0 rounded-lg bg-[#2563EB] px-5 py-2.5 font-mono text-[13px] font-semibold tracking-wider text-black transition-shadow hover:shadow-[0_0_16px_rgba(37,99,235,0.3)]"
            >
              BECOME A PROVIDER
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <form method="GET" action="/robowork/providers" className="flex flex-wrap items-end gap-3">
            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">City</label>
              <input
                name="city"
                defaultValue={params.city || ""}
                placeholder="Any city"
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary placeholder:text-text-ghost focus:border-[#2563EB]/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">State</label>
              <input
                name="state"
                defaultValue={params.state || ""}
                placeholder="Any state"
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary placeholder:text-text-ghost focus:border-[#2563EB]/50 focus:outline-none"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">
                Specialization
              </label>
              <select
                name="specialization"
                defaultValue={params.specialization || ""}
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary focus:border-[#2563EB]/50 focus:outline-none"
              >
                <option value="">All</option>
                {SPECIALIZATION_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Fulfillment */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">
                Fulfillment
              </label>
              <select
                name="fulfillment"
                defaultValue={params.fulfillment || ""}
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary focus:border-[#2563EB]/50 focus:outline-none"
              >
                <option value="">Any</option>
                {FULFILLMENT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">
                Min Rating
              </label>
              <select
                name="rating"
                defaultValue={params.rating || ""}
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary focus:border-[#2563EB]/50 focus:outline-none"
              >
                <option value="">Any</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Verified toggle */}
            <label className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                name="verified"
                value="true"
                defaultChecked={params.verified === "true"}
                className="h-4 w-4 rounded border-border bg-obsidian-surface accent-[#2563EB]"
              />
              <span className="font-sans text-xs text-text-secondary">Verified only</span>
            </label>

            {/* Sort */}
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[13px] tracking-widest uppercase text-text-ghost">Sort</label>
              <select
                name="sort"
                defaultValue={params.sort || "rating"}
                className="rounded-lg border border-border bg-obsidian-surface px-3 py-2 font-sans text-xs text-text-primary focus:border-[#2563EB]/50 focus:outline-none"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/5 px-5 py-2 font-sans text-xs font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB]/10"
            >
              Apply Filters
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {allProviders.length === 0 ? (
            <div className="rounded-xl border border-border bg-obsidian-surface p-12 text-center">
              <p className="font-sans text-sm text-text-secondary">
                No providers found matching your filters.
              </p>
              <Link
                href="/robowork/providers"
                className="mt-4 inline-block font-sans text-xs font-medium text-[#2563EB] hover:underline"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {allProviders.map((p) => (
                  <ProviderCard
                    key={p.id}
                    slug={p.slug}
                    company_name={p.company_name}
                    city={p.city}
                    state={p.state}
                    rating={p.rating}
                    review_count={reviewCounts[p.id] || 0}
                    specializations={p.specializations}
                    fulfillment_types={p.fulfillment_types}
                    response_time_hours={p.response_time_hours}
                    verified={p.verified}
                    insurance_verified={p.insurance_verified}
                    background_checked={p.background_checked}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={buildUrl({ page: String(page - 1) })}
                      className="rounded-lg border border-border px-4 py-2 font-sans text-xs text-text-secondary transition-colors hover:border-[#2563EB]/30 hover:text-text-primary"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <span key={p} className="flex items-center gap-2">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="text-text-ghost text-xs">...</span>
                        )}
                        <Link
                          href={buildUrl({ page: String(p) })}
                          className={
                            p === page
                              ? "rounded-lg bg-[#2563EB]/10 px-3 py-2 font-mono text-xs font-medium text-[#2563EB]"
                              : "rounded-lg border border-border px-3 py-2 font-mono text-xs text-text-secondary transition-colors hover:border-[#2563EB]/30"
                          }
                        >
                          {p}
                        </Link>
                      </span>
                    ))}
                  {page < totalPages && (
                    <Link
                      href={buildUrl({ page: String(page + 1) })}
                      className="rounded-lg border border-border px-4 py-2 font-sans text-xs text-text-secondary transition-colors hover:border-[#2563EB]/30 hover:text-text-primary"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
