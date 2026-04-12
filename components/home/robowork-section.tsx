import Link from "next/link";

interface JobCard {
  title: string;
  location: string;
  duration: string;
  budget: string;
  bids: string;
  posted: string;
  tags: { label: string; color: string }[];
  urgent?: boolean;
}

const SAMPLE_JOBS: JobCard[] = [
  {
    title: "Warehouse Pallet Moving",
    location: "Chicago, IL",
    duration: "2 weeks",
    budget: "$8,000-12,000",
    bids: "4 bids",
    posted: "2 hours ago",
    tags: [
      { label: "AMR", color: "bg-electric-blue/15 text-electric-blue" },
      { label: "WITH OPERATOR", color: "bg-violet/15 text-violet" },
    ],
    urgent: true,
  },
  {
    title: "Hospital Floor Cleaning",
    location: "Los Angeles, CA",
    duration: "Ongoing",
    budget: "$3,500/month",
    bids: "2 bids",
    posted: "1 day ago",
    tags: [
      { label: "CLEANING", color: "bg-blue-600/15 text-blue-400" },
      { label: "AUTONOMOUS", color: "bg-electric-blue/15 text-electric-blue" },
    ],
  },
  {
    title: "Agricultural Harvest Assist",
    location: "Fresno, CA",
    duration: "3 weeks",
    budget: "$15,000-20,000",
    bids: "1 bid",
    posted: "3 days ago",
    tags: [
      { label: "AGR", color: "bg-blue-600/15 text-blue-400" },
      { label: "WITH OPERATOR", color: "bg-violet/15 text-violet" },
    ],
  },
];

export function RoboWorkSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-6 flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-[#2563EB]" />
          <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            Deploy Channel
          </span>
        </div>

        <h2
          className="font-display text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Don{"'"}t want to own a robot? Hire one.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-tertiary">
          Post a job. Get bids from verified Robot Service Providers. Pay for
          outcomes, not equipment.
        </p>

        {/* Job cards grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_JOBS.map((job) => (
            <div
              key={job.title}
              className="rounded-lg border border-border bg-obsidian-surface p-6 transition-colors hover:border-border-active hover:bg-obsidian-hover"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-primary">
                  {job.title}
                </h3>
                {job.urgent && (
                  <span className="shrink-0 rounded bg-red-500/15 px-2 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.06em] text-red-400">
                    Urgent
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`rounded-full px-2.5 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.06em] ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-[13px] text-tertiary">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-ghost"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{job.location}</span>
                  <span className="text-ghost">|</span>
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-[14px] font-bold text-blue-400">
                    {job.budget}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
                <span className="font-[family-name:var(--font-ui)] text-[12px] font-medium text-electric-blue">
                  {job.bids}
                </span>
                <span className="text-[12px] text-ghost">{job.posted}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/robowork/post"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-bold tracking-[0.02em] text-black transition-all hover:-translate-y-0.5"
            style={{ background: "#2563EB" }}
          >
            Post a Job
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            href="/robowork/providers/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-[15px] font-semibold text-[var(--theme-text-primary)] transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
            style={{ borderColor: "var(--theme-border)" }}
          >
            Become a Provider
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
