import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils/cn";
import {
  URGENCY_CONFIG,
  STATUS_CONFIG,
  FULFILLMENT_OPTIONS,
  TASK_TYPES,
  formatBudget,
  relativeTime,
} from "@/lib/robowork/constants";
import { JsonLd } from "@/components/seo/json-ld";
import { BidForm } from "@/components/robowork/bid-form";

interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  task_type: string;
  industry: string;
  city: string | null;
  state: string | null;
  remote_ok: boolean;
  start_date: string | null;
  end_date: string | null;
  duration_days: number | null;
  budget_min: number | null;
  budget_max: number | null;
  fulfillment_type: string;
  robot_type: string;
  urgency: string;
  status: string;
  requirements: string | null;
  site_details: string | null;
  business_name: string;
  bid_count: number;
  created_at: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data: job } = await supabase
    .from("robowork_jobs")
    .select("title, description, industry, city, state")
    .eq("slug", slug)
    .single();

  if (!job) return { title: "Job Not Found | RoboWork" };

  const location = [job.city, job.state].filter(Boolean).join(", ");
  return {
    title: `${job.title} — RoboWork | Robotomated`,
    description: `${job.description.slice(0, 155)}...`,
    openGraph: {
      title: `${job.title} — Robot Job in ${location || job.industry}`,
      description: job.description.slice(0, 200),
      url: `https://robotomated.com/robowork/jobs/${slug}`,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: job } = await supabase
    .from("robowork_jobs")
    .select(
      "id, slug, title, description, task_type, industry, city, state, remote_ok, start_date, end_date, duration_days, budget_min, budget_max, fulfillment_type, robot_type, urgency, status, requirements, site_details, business_name, bid_count, created_at"
    )
    .eq("slug", slug)
    .single();

  if (!job) notFound();

  const j = job as Job;
  const urgencyConf = URGENCY_CONFIG[j.urgency as keyof typeof URGENCY_CONFIG] || URGENCY_CONFIG.flexible;
  const statusConf = STATUS_CONFIG[j.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  const fulfillmentLabel = FULFILLMENT_OPTIONS.find((f) => f.value === j.fulfillment_type)?.label || j.fulfillment_type;
  const taskLabel = TASK_TYPES.find((t) => t.value === j.task_type)?.label || j.task_type;
  const location = [j.city, j.state].filter(Boolean).join(", ") || (j.remote_ok ? "Remote" : "Not specified");

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: j.title,
          description: j.description,
          datePosted: j.created_at,
          hiringOrganization: {
            "@type": "Organization",
            name: j.business_name,
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: j.city || undefined,
              addressRegion: j.state || undefined,
              addressCountry: "US",
            },
          },
          ...(j.budget_min && {
            baseSalary: {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: {
                "@type": "QuantitativeValue",
                minValue: j.budget_min,
                maxValue: j.budget_max || j.budget_min,
                unitText: "PROJECT",
              },
            },
          }),
          ...(j.end_date && { validThrough: j.end_date }),
          industry: j.industry,
        }}
      />

      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <Link
          href="/robowork/jobs"
          className="mb-4 inline-block font-mono text-[13px] text-white transition-colors hover:underline"
        >
          &larr; Back to Jobs
        </Link>

        {/* Header */}
        <div className="mb-8 rounded-lg border border-border bg-obsidian-surface p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-white/5 px-2.5 py-1 text-[13px] font-semibold text-white">
              {j.industry}
            </span>
            <span className={cn("rounded border px-2.5 py-1 text-[13px] font-semibold", urgencyConf.color)}>
              {urgencyConf.label}
            </span>
            <span className={cn("rounded px-2.5 py-1 text-[13px] font-semibold", statusConf.color)}>
              {statusConf.label}
            </span>
          </div>

          <h1 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-text-primary sm:text-3xl">
            {j.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {location}
            </span>
            <span className="font-mono font-bold text-white">
              {formatBudget(j.budget_min, j.budget_max)}
            </span>
            <span>{relativeTime(j.created_at)}</span>
            <span className="font-mono text-xs">
              {j.bid_count} bid{j.bid_count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                Job Description
              </h2>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {j.description}
              </div>
            </div>

            {/* Requirements */}
            {j.requirements && (
              <div className="rounded-lg border border-border bg-obsidian-surface p-6">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber" />
                  Requirements
                </h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {j.requirements}
                </div>
              </div>
            )}

            {/* Site details */}
            {j.site_details && (
              <div className="rounded-lg border border-border bg-obsidian-surface p-6">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text-primary">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  Site Details
                </h2>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {j.site_details}
                </div>
              </div>
            )}

            {/* Bid form */}
            {j.status === "open" && (
              <div id="bid">
                <BidForm jobSlug={j.slug} jobTitle={j.title} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details card */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-5">
              <h3 className="mb-4 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                Job Details
              </h3>
              <div className="space-y-3">
                <DetailRow label="Task Type" value={taskLabel} />
                <DetailRow label="Industry" value={j.industry} />
                <DetailRow label="Fulfillment" value={fulfillmentLabel} />
                {j.robot_type !== "any" && (
                  <DetailRow label="Robot Type" value={j.robot_type} />
                )}
                {j.remote_ok && <DetailRow label="Remote OK" value="Yes" />}
              </div>
            </div>

            {/* Timeline card */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-5">
              <h3 className="mb-4 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                Timeline
              </h3>
              <div className="space-y-3">
                {j.start_date && (
                  <DetailRow label="Start" value={formatDate(j.start_date)!} />
                )}
                {j.end_date && (
                  <DetailRow label="End" value={formatDate(j.end_date)!} />
                )}
                {j.duration_days && (
                  <DetailRow
                    label="Duration"
                    value={`${j.duration_days} day${j.duration_days !== 1 ? "s" : ""}`}
                  />
                )}
                <DetailRow label="Urgency" value={urgencyConf.label} />
              </div>
            </div>

            {/* Business card */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-5">
              <h3 className="mb-4 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                Posted By
              </h3>
              <p className="text-sm font-semibold text-text-primary">
                {j.business_name}
              </p>
              <p className="mt-1 text-[11px] text-text-tertiary">
                Posted {relativeTime(j.created_at)}
              </p>
            </div>

            {/* CTA */}
            {j.status === "open" && (
              <a
                href="#bid"
                className="block w-full rounded bg-white py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Submit a Bid
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-text-tertiary">{label}</span>
      <span className="text-xs font-medium text-text-primary">{value}</span>
    </div>
  );
}
