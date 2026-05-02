import Link from "next/link";

const CASE_STEPS = [
  "Post job on RoboWork: \"AMR pallet moving, 2 weeks, 8hrs/day, Chicago warehouse.\"",
  "4 verified RSPs submit bids within 18 hours.",
  "Business selects provider, reviews RCO certification and insurance.",
  "RSP arrives Day 1 with robot — already configured for your facility.",
  "Performance tracked on Robotomated dashboard. Payment released at job completion.",
];

export function RaaSExplainer() {
  return (
    <section className="px-6 py-20" style={{ background: "var(--theme-section-alt)" }}>
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 flex items-center gap-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[var(--theme-accent-blue)]">
          <span className="inline-block h-px w-6 bg-[var(--theme-accent-blue)]" />
          Deploy Channel
        </p>
        <div className="mb-10 max-w-[640px]">
          <h2
            className="font-display text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Don&apos;t want to own a robot? Hire one.
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
            Robotics-as-a-Service (RaaS) is a new way to access automation —
            and most businesses don&apos;t know it exists yet. Post a job and
            pay only for the outcome you need.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* What is RaaS */}
          <div
            className="rounded-xl border p-7"
            style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}
          >
            <h3 className="font-display text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>
              What is RaaS?
            </h3>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
              Robotics-as-a-Service is the rideshare model for automation. You
              don&apos;t own the vehicle — you just call one when you need it.
              A verified Robot Service Provider shows up with the robot,
              operates it, and is responsible for performance.
            </p>

            {/* VS Compare */}
            <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg" style={{ background: "var(--theme-border)" }}>
              <div className="p-4" style={{ background: "var(--theme-card)" }}>
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
                  Traditional Ownership
                </p>
                <ul className="mt-3 space-y-1.5 text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                  {["$150K–$500K upfront", "Hire & train operators", "Maintain your own fleet", "Locked into one system"].map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="mt-0.5" style={{ color: "var(--theme-text-muted)" }}>✕</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4" style={{ background: "var(--theme-card)" }}>
                <p className="font-[family-name:var(--font-brand)] text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--theme-text-primary)" }}>
                  RaaS via RoboWork
                </p>
                <ul className="mt-3 space-y-1.5 text-xs" style={{ color: "var(--theme-text-secondary)" }}>
                  {["Pay per job or month", "Operator included", "Switch robots as needed", "No long-term contract"].map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="mt-0.5" style={{ color: "var(--theme-text-primary)" }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
              RoboWork is Robotomated&apos;s marketplace where businesses post
              jobs and certified Robot Service Providers bid. Multiple quotes
              within 24 hours.
            </p>
          </div>

          {/* Case Study */}
          <div
            className="rounded-xl p-7"
            style={{ background: "var(--theme-card)", color: "rgba(255,255,255,0.8)", border: "1px solid var(--theme-border)" }}
          >
            <p className="font-[family-name:var(--font-brand)] text-[13px] font-bold uppercase tracking-wider text-white/60">
              Real-World Example
            </p>
            <h3 className="mt-2 font-display text-lg font-bold text-white">
              Warehouse Pallet Moving — Chicago, IL
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              A distribution center needs help during a 2-week peak season.
              They can&apos;t afford to buy a robot or wait months for hiring.
            </p>

            <ol className="mt-5 space-y-0">
              {CASE_STEPS.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-b border-white/[0.06] py-2.5 text-sm text-white/70 last:border-0"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 font-[family-name:var(--font-brand)] text-[13px] font-bold text-white/60">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-4 text-sm">
              <span className="font-semibold text-white/60">Result: </span>
              $8,000–$12,000 total. No hiring, no maintenance, no storage.
              The same operator books another job immediately after.
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/robowork/post"
            className="inline-flex items-center gap-2 rounded-lg border-2 px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--theme-text-primary)", color: "var(--theme-text-primary)" }}
          >
            Post a Job
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/robowork/providers/register"
            className="inline-flex items-center gap-2 rounded-lg border-2 px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--theme-text-primary)", color: "var(--theme-text-primary)" }}
          >
            Become a Provider
          </Link>
        </div>
      </div>
    </section>
  );
}
