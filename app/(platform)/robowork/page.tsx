import type { Metadata } from "next";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { JOB_CATEGORIES, formatBudget, relativeTime, URGENCY_CONFIG } from "@/lib/robowork/constants";
import { cn } from "@/lib/utils/cn";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "RoboWork — Robot Service Marketplace | Robotomated",
  description:
    "Post a job and get matched with verified Robot Service Providers. Pay for outcomes, not hardware. Warehouse automation, security, cleaning, inspection, and more.",
  openGraph: {
    title: "RoboWork — Robot Service Marketplace | Robotomated",
    description:
      "Don't want to own a robot? Hire one. Post a job, get matched with verified providers, pay for outcomes.",
    url: "https://robotomated.com/robowork",
    type: "website",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  "warehouse-automation": "W",
  "security-patrol": "S",
  "cleaning-sanitation": "C",
  "inspection-survey": "I",
  "agriculture-harvest": "A",
  "healthcare-support": "H",
  "hospitality-service": "R",
  "construction-welding": "X",
};

interface Job {
  slug: string;
  title: string;
  industry: string;
  city: string | null;
  state: string | null;
  budget_min: number | null;
  budget_max: number | null;
  urgency: string;
  bid_count: number;
  created_at: string;
  remote_ok: boolean;
}

async function getStats(supabase: ReturnType<typeof createServerClient>) {
  const [activeJobs, verifiedProviders, robotsAvailable, jobsCompleted] =
    await Promise.all([
      supabase
        .from("robowork_jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("robot_service_providers")
        .select("id", { count: "exact", head: true })
        .eq("verified", true),
      supabase
        .from("rsp_robots")
        .select("id", { count: "exact", head: true })
        .eq("available", true),
      supabase
        .from("robowork_jobs")
        .select("id", { count: "exact", head: true })
        .eq("status", "completed"),
    ]);

  return {
    activeJobs: activeJobs.count || 0,
    verifiedProviders: verifiedProviders.count || 0,
    robotsAvailable: robotsAvailable.count || 0,
    jobsCompleted: jobsCompleted.count || 0,
  };
}

export default async function RoboWorkPage() {
  const supabase = createServerClient();

  const [stats, { data: recentJobs }] = await Promise.all([
    getStats(supabase),
    supabase
      .from("robowork_jobs")
      .select("slug, title, industry, city, state, budget_min, budget_max, urgency, bid_count, created_at, remote_ok")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const jobs = (recentJobs || []) as Job[];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "RoboWork — Robot Service Marketplace",
          description:
            "Post a job and get matched with verified Robot Service Providers.",
          url: "https://robotomated.com/robowork",
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/[0.03] to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="mb-3 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ DEPLOY CHANNEL ]</p>

          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
            Don&apos;t want to own a robot?{" "}
            <span className="text-electric-blue">Hire one.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Post a job. Get matched with verified Robot Service Providers.
            Pay for outcomes, not hardware.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/robowork/post"
              className="rounded bg-electric-blue px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
            >
              Post a Job
            </Link>
            <Link
              href="/robowork/providers/register"
              className="rounded border border-border px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-text-primary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ PROTOCOL ]</p>
          <h2 className="mb-10 text-lg font-bold text-text-primary">How It Works</h2>

          <div className="grid gap-8 md:grid-cols-2">
            {/* For Businesses */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-6">
              <h3 className="mb-5 font-[family-name:var(--font-ui)] text-xs font-bold uppercase tracking-[0.12em] text-electric-blue">
                For Businesses
              </h3>
              <ol className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "Describe your task",
                    desc: "Tell us what you need done, where, and when. It takes 3 minutes.",
                  },
                  {
                    step: "02",
                    title: "Receive bids from verified RSPs",
                    desc: "Qualified Robot Service Providers review your job and submit competitive bids.",
                  },
                  {
                    step: "03",
                    title: "Hire and deploy",
                    desc: "Pick the best bid. The provider shows up with the robot. You pay for results.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-electric-blue/10 font-[family-name:var(--font-brand)] text-xs font-bold text-electric-blue">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* For Providers */}
            <div className="rounded-lg border border-border bg-obsidian-surface p-6">
              <h3 className="mb-5 font-[family-name:var(--font-ui)] text-xs font-bold uppercase tracking-[0.12em] text-lime">
                For Providers
              </h3>
              <ol className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "List your robots and services",
                    desc: "Create a provider profile. Add your fleet, capabilities, and service area.",
                  },
                  {
                    step: "02",
                    title: "Browse and bid on jobs",
                    desc: "See new job postings matching your capabilities. Submit competitive bids.",
                  },
                  {
                    step: "03",
                    title: "Get hired and grow your business",
                    desc: "Complete jobs, earn reviews, and build a reputation on the platform.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-lime/10 font-[family-name:var(--font-brand)] text-xs font-bold text-lime">
                      {item.step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ TASK MATRIX ]</p>
              <h2 className="text-lg font-bold text-text-primary">Job Categories</h2>
            </div>
            <Link
              href="/robowork/jobs"
              className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.1em] text-electric-blue transition-colors hover:underline"
            >
              Browse All Jobs &rarr;
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {JOB_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/robowork/jobs?task_type=${cat.taskType}`}
                className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-4 transition-all hover:-translate-y-0.5 hover:border-border-active"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-electric-blue/10 font-[family-name:var(--font-brand)] text-sm font-bold text-electric-blue">
                  {CATEGORY_ICONS[cat.slug] || "?"}
                </div>
                <h3 className="text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                  {cat.label}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ LIVE METRICS ]</p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Active Jobs", value: stats.activeJobs },
              { label: "Verified Providers", value: stats.verifiedProviders },
              { label: "Robots Available", value: stats.robotsAvailable },
              { label: "Jobs Completed", value: stats.jobsCompleted },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-brand)] text-3xl font-extrabold text-electric-blue">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT JOBS ── */}
      {jobs.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ INCOMING FEED ]</p>
                <h2 className="text-lg font-bold text-text-primary">Recent Postings</h2>
              </div>
              <Link
                href="/robowork/jobs"
                className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.1em] text-electric-blue transition-colors hover:underline"
              >
                View All &rarr;
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {jobs.map((job) => {
                const urgencyConf =
                  URGENCY_CONFIG[job.urgency as keyof typeof URGENCY_CONFIG] ||
                  URGENCY_CONFIG.flexible;
                const location =
                  [job.city, job.state].filter(Boolean).join(", ") ||
                  (job.remote_ok ? "Remote" : "TBD");

                return (
                  <Link
                    key={job.slug}
                    href={`/robowork/jobs/${job.slug}`}
                    className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:-translate-y-0.5 hover:border-border-active"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded bg-electric-blue/10 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.08em] text-electric-blue">
                        {job.industry}
                      </span>
                      <span
                        className={cn(
                          "rounded border px-2 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.08em]",
                          urgencyConf.color
                        )}
                      >
                        {urgencyConf.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                      {job.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-text-secondary">
                      <span>{location}</span>
                      <span className="font-[family-name:var(--font-mono)] font-semibold text-[#00E5A0]">
                        {formatBudget(job.budget_min, job.budget_max)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-[10px] text-text-tertiary">
                        {relativeTime(job.created_at)}
                      </span>
                      <span className="font-[family-name:var(--font-brand)] text-[10px] text-text-secondary">
                        {job.bid_count} bid{job.bid_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST SIGNALS ── */}
      <section className="border-t border-border px-4 py-12 sm:px-6 lg:px-8">
        <p className="mb-6 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">[ TRUST LAYER ]</p>
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-6">
          {[
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              label: "Verified Providers",
              desc: "Identity and credentials checked",
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
              ),
              label: "Insured Operations",
              desc: "All providers carry liability coverage",
            },
            {
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
              label: "Background Checked",
              desc: "Operators vetted and approved",
            },
          ].map((signal) => (
            <div key={signal.label} className="flex items-center gap-3 rounded-lg border border-border bg-obsidian-surface px-5 py-3">
              <div className="text-electric-blue">{signal.icon}</div>
              <div>
                <p className="font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-[0.08em] text-text-primary">{signal.label}</p>
                <p className="text-[10px] text-text-tertiary">{signal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
