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
          <p className="mb-3 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ DEPLOY CHANNEL ]</p>

          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
            Don&apos;t want to own a robot?{" "}
            <span className="text-electric-blue">Hire one.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            You don&apos;t need to own a robot to use one. Post a job. Get bids from certified operators. Pay for the outcome.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/robowork/post"
              className="rounded bg-electric-blue px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
            >
              Deploy a Robot Today
            </Link>
            <Link
              href="/robowork/providers/register"
              className="rounded border border-border px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-text-primary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              List Your Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ FROM POST TO DEPLOY IN 72 HOURS ]</p>
          <h2 className="mb-3 text-lg font-bold text-text-primary">Three Steps to a Working Robot</h2>
          <p className="mb-10 max-w-xl text-sm text-text-secondary">No hardware purchase. No integration timeline. Describe the job, pick a provider, and deploy.</p>

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
                    desc: "Complete jobs, earn reviews, and build a reputation that compounds with every deployment.",
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

      {/* ── WHAT KIND OF WORK ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ PRESET DEPLOYMENTS ]</p>
          <h2 className="mb-3 text-lg font-bold text-text-primary">What Kind of Work Can Robots Do for You?</h2>
          <p className="mb-10 max-w-xl text-sm text-text-secondary">Pick a job template. We fill in the details. You get bids from certified providers.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { task: "Warehouse Pallet Moving", robot: "AMR", price: "$6–12K/mo", time: "1–4 weeks", type: "picking", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
              { task: "Facility Floor Cleaning", robot: "Cleaning Robot", price: "$2.5–4.5K/mo", time: "Ongoing", type: "cleaning", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l3.5-3.5M7.5 16.5l-1-1M18 4l-8.5 8.5M9.5 12.5l2 2M5.5 18.5l2-2" /><path d="M14 7l3-3 3 3-3 3z" /></svg> },
              { task: "Security & Perimeter Patrol", robot: "Autonomous Mobile", price: "$3–6K/mo", time: "Ongoing", type: "security", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
              { task: "Agricultural Harvest", robot: "AGR Robot", price: "$12–25K", time: "Seasonal", type: "agriculture", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10M12 20v-8" /><path d="M12 12C12 8 8 4 4 4c0 4 4 8 8 8z" /><path d="M12 12c0-4 4-8 8-8-4 0-8 4-8 8z" /></svg> },
              { task: "Manufacturing Assembly", robot: "Cobot", price: "$8–18K/mo", time: "Project-based", type: "assembly", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg> },
              { task: "Hospital Logistics", robot: "Medical AMR", price: "$4–8K/mo", time: "Ongoing", type: "healthcare", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M12 10v4M10 12h4" /></svg> },
              { task: "Construction Monitoring", robot: "Drone / Quadruped", price: "$5–15K", time: "Per project", type: "inspection", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg> },
              { task: "Last-Mile Sorting", robot: "Conveyor AMR", price: "$10–20K/mo", time: "Peak season", type: "picking", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg> },
            ].map((job) => (
              <Link
                key={job.task}
                href={`/robowork/post?task_type=${job.type}`}
                className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:-translate-y-0.5 hover:border-electric-blue/30 hover:shadow-lg hover:shadow-electric-blue/5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-electric-blue/10">
                  {job.icon}
                </div>
                <h3 className="text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">{job.task}</h3>
                <p className="mt-1 text-[10px] text-text-tertiary">{job.robot}</p>
                <div className="mt-auto pt-3">
                  <p className="font-mono text-sm font-bold text-[#00E5A0]">{job.price}</p>
                  <p className="text-[10px] text-text-tertiary">{job.time}</p>
                </div>
                <span className="mt-3 text-[11px] font-semibold text-electric-blue opacity-0 transition-opacity group-hover:opacity-100">Post This Job &rarr;</span>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t see your use case?{" "}
            <Link href="/advisor" className="font-semibold text-electric-blue hover:underline">
              Describe it to Robotimus &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ── JOB CATEGORIES ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ 8 INDUSTRIES &middot; VERIFIED PROVIDERS ]</p>
              <h2 className="text-lg font-bold text-text-primary">What Can a Robot Do for You?</h2>
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
          <p className="mb-6 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ MARKETPLACE PULSE &middot; LIVE ]</p>
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

      {/* ── MARKET RATES ── */}
      <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ MARKET RATES &middot; Q2 2026 ]</p>
          <h2 className="mb-6 text-lg font-bold text-text-primary">What Are Businesses Paying Right Now?</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { category: "Warehouse AMR", rate: "$8,400", unit: "avg 2-week engagement", trend: "+12% vs Q1" },
              { category: "Floor Cleaning", rate: "$3,200/mo", unit: "avg monthly contract", trend: "Stable" },
              { category: "Security Patrol", rate: "$4,500/mo", unit: "avg monthly contract", trend: "+8% vs Q1" },
              { category: "Hospital Logistics", rate: "$5,800/mo", unit: "avg monthly contract", trend: "+15% vs Q1" },
            ].map((r) => (
              <div key={r.category} className="rounded-lg border border-border bg-obsidian-surface p-4">
                <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">{r.category}</p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-xl font-bold text-[#2563EB]">{r.rate}</p>
                <p className="mt-0.5 text-[10px] text-text-ghost">{r.unit}</p>
                <p className="mt-2 text-[10px] font-medium text-[#00E5A0]">{r.trend}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-text-ghost">
            Based on RoboWork marketplace data. Rates vary by geography, duration, and complexity.
          </p>
        </div>
      </section>

      {/* ── RECENT JOBS ── */}
      {jobs.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ LIVE FEED ]</p>
                <h2 className="text-lg font-bold text-text-primary">Jobs Being Posted Right Now</h2>
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
        <p className="mb-6 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ TRUST LAYER ]</p>
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

      {/* ── NEXT STEP ── */}
      <section className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ NEXT STEP ]</p>
          <h2 className="mt-4 text-2xl font-bold text-text-primary">Not sure where to start?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            Tell Robotimus your budget, use case, and timeline. Get a deployment recommendation in 60 seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/advisor"
              className="rounded bg-electric-blue px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
            >
              Get a Recommendation
            </Link>
            <Link
              href="/certify"
              className="rounded border border-border px-7 py-3.5 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.08em] text-text-primary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              Get Certified to Operate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
