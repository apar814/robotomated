import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ slug: string }>;
}

interface Lead {
  click_types: string[];
  first_click: string;
  last_click: string;
  total_clicks: number;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  total_clicks: number;
  this_week: number;
  this_month: number;
  demo_requests: number;
  manufacturer_name: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("manufacturers")
    .select("name")
    .eq("slug", slug)
    .single()
    .returns<{ name: string }>();

  if (!data) return { title: "Manufacturer Not Found" };
  return {
    title: `Leads — ${data.name}`,
    robots: { index: false, follow: false },
  };
}

const CLICK_TYPE_COLORS: Record<string, string> = {
  sales: "bg-[var(--theme-accent-blue)]/15 text-[var(--theme-accent-blue)]",
  demo: "bg-[var(--theme-accent-lime)]/15 text-[var(--theme-accent-lime)]",
  website: "bg-[var(--theme-accent-magenta)]/15 text-[var(--theme-accent-magenta)]",
  claim: "bg-[var(--theme-text-muted)]/15 text-[var(--theme-text-muted)]",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function fetchLeads(slug: string): Promise<LeadsResponse | null> {
  const supabase = createServerClient();

  const { data: manufacturer } = await supabase
    .from("manufacturers")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!manufacturer) return null;

  const { data: clicks } = await supabase
    .from("manufacturer_contact_clicks")
    .select("click_type, created_at")
    .eq("manufacturer_id", manufacturer.id)
    .order("created_at", { ascending: false });

  const allClicks = (clicks || []) as { click_type: string; created_at: string }[];

  const leadsByDate = new Map<
    string,
    { click_types: string[]; first_click: string; last_click: string; total_clicks: number }
  >();

  for (const click of allClicks) {
    const dayKey = click.created_at.slice(0, 10);
    const existing = leadsByDate.get(dayKey);

    if (existing) {
      if (!existing.click_types.includes(click.click_type)) {
        existing.click_types.push(click.click_type);
      }
      existing.total_clicks += 1;
      if (click.created_at < existing.first_click) existing.first_click = click.created_at;
      if (click.created_at > existing.last_click) existing.last_click = click.created_at;
    } else {
      leadsByDate.set(dayKey, {
        click_types: [click.click_type],
        first_click: click.created_at,
        last_click: click.created_at,
        total_clicks: 1,
      });
    }
  }

  const leads = Array.from(leadsByDate.values()).sort(
    (a, b) => new Date(b.last_click).getTime() - new Date(a.last_click).getTime()
  );

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    leads,
    total: leads.length,
    total_clicks: allClicks.length,
    this_week: allClicks.filter((c) => new Date(c.created_at) >= oneWeekAgo).length,
    this_month: allClicks.filter((c) => new Date(c.created_at) >= oneMonthAgo).length,
    demo_requests: allClicks.filter((c) => c.click_type === "demo").length,
    manufacturer_name: manufacturer.name,
  };
}

export default async function ManufacturerLeadsPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchLeads(slug);

  if (!data) notFound();

  const { leads, total, total_clicks, this_week, this_month, demo_requests, manufacturer_name } = data;

  const stats = [
    { label: "Total Leads", value: total },
    { label: "This Week", value: this_week },
    { label: "This Month", value: this_month },
    { label: "Demo Requests", value: demo_requests },
  ];

  return (
    <div style={{ background: "var(--theme-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        className="border-b px-4 py-10"
        style={{ borderColor: "var(--theme-border)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href={`/manufacturers/${slug}`}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: "var(--theme-accent-blue)" }}
              >
                &larr; Back to {manufacturer_name}
              </Link>
              <h1
                className="mt-2 font-display text-2xl font-bold sm:text-3xl"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Lead Tracking
              </h1>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Contact engagement data for {manufacturer_name} &middot;{" "}
                {total_clicks} total click{total_clicks !== 1 ? "s" : ""}
              </p>
            </div>
            {leads.length > 0 && (
              <a
                href={`/api/manufacturers/${slug}/leads/export`}
                className="inline-flex shrink-0 items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                style={{
                  background: "var(--theme-accent-blue)",
                  color: "var(--theme-bg)",
                }}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="px-4 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border p-5"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {stat.label}
              </p>
              <p
                className="mt-1 font-mono text-2xl font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leads Table */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          {leads.length === 0 ? (
            <div
              className="rounded-lg border py-20 text-center"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                style={{ color: "var(--theme-text-muted)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3
                className="mt-4 text-lg font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                No leads yet
              </h3>
              <p
                className="mx-auto mt-2 max-w-sm text-sm"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Share your manufacturer page to start getting leads.
                When visitors click contact buttons, their engagement
                will appear here.
              </p>
              <Link
                href={`/manufacturers/${slug}`}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:underline"
                style={{ color: "var(--theme-accent-blue)" }}
              >
                View manufacturer page &rarr;
              </Link>
            </div>
          ) : (
            <div
              className="overflow-hidden rounded-lg border"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="border-b text-left"
                      style={{ borderColor: "var(--theme-border)" }}
                    >
                      <th
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        Date
                      </th>
                      <th
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        Click Types
                      </th>
                      <th
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        First Seen
                      </th>
                      <th
                        className="px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        Last Seen
                      </th>
                      <th
                        className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        Clicks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, i) => (
                      <tr
                        key={i}
                        className="border-b transition-colors last:border-b-0"
                        style={{
                          borderColor: "var(--theme-border)",
                        }}
                      >
                        <td
                          className="whitespace-nowrap px-5 py-4 font-medium"
                          style={{ color: "var(--theme-text-primary)" }}
                        >
                          {formatDate(lead.first_click)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {lead.click_types.map((type) => (
                              <span
                                key={type}
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CLICK_TYPE_COLORS[type] || "bg-[var(--theme-text-muted)]/15 text-[var(--theme-text-muted)]"}`}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td
                          className="whitespace-nowrap px-5 py-4"
                          style={{ color: "var(--theme-text-secondary)" }}
                        >
                          {formatDateTime(lead.first_click)}
                        </td>
                        <td
                          className="whitespace-nowrap px-5 py-4"
                          style={{ color: "var(--theme-text-secondary)" }}
                        >
                          {formatDateTime(lead.last_click)}
                        </td>
                        <td
                          className="whitespace-nowrap px-5 py-4 text-right font-mono font-bold"
                          style={{ color: "var(--theme-accent-blue)" }}
                        >
                          {lead.total_clicks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
