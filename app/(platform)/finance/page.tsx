import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robotomated Finance -- Equipment Financing, Insurance, Leasing",
  description:
    "Finance your robotics investment with equipment loans, comprehensive insurance, and flexible lease programs. From purchase financing to full fleet coverage.",
};

const FINANCING_FEATURES = [
  "Loans from $10K to $5M+",
  "Terms from 12 to 84 months",
  "Fixed and variable rate options",
  "Same-day pre-qualification",
  "No prepayment penalties",
  "Section 179 tax deduction eligible",
] as const;

const INSURANCE_FEATURES = [
  "All-risk property coverage",
  "General and operator liability",
  "Business interruption protection",
  "Cyber and data breach coverage",
  "Multi-robot fleet discounts",
  "Claims support with robotics expertise",
] as const;

const LEASE_TERMS = [
  {
    term: "12 Months",
    description: "Short-term for pilot programs and seasonal deployments.",
    highlight: false,
  },
  {
    term: "24 Months",
    description: "Balanced flexibility with lower monthly payments.",
    highlight: false,
  },
  {
    term: "36 Months",
    description: "Our most popular term. Lowest monthly cost with purchase option at end of lease.",
    highlight: true,
  },
  {
    term: "48-60 Months",
    description: "Extended terms for large capital deployments with buyout options.",
    highlight: false,
  },
] as const;

export default function FinancePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Finance", href: "/finance" },
        ]}
      />

      {/* Hero */}
      <section className="mt-8 text-center">
        <span className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
          [ ROBOT FINANCING ]
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Robotomated Finance
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          From purchase financing to comprehensive insurance and flexible lease
          programs -- everything you need to fund, protect, and deploy your
          robotic fleet.
        </p>
      </section>

      {/* Equipment Financing */}
      <section className="mt-24">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ EQUIPMENT LOANS ]</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                Equipment Financing
              </h2>
              <p className="mt-4 text-muted">
                Get the robots your operation needs without the upfront capital
                burden. Our financing partners offer competitive rates with fast
                approvals, so you can deploy sooner and start seeing ROI faster.
              </p>
              <ul className="mt-6 space-y-3">
                {FINANCING_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-green,#00E5A0)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/lease"
                  className="inline-flex items-center rounded-lg bg-[var(--theme-blue,#00C2FF)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-opacity hover:opacity-90"
                >
                  Apply for Financing
                </Link>
                <Link
                  href="/tools/tco-calculator"
                  className="inline-flex items-center rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
                >
                  TCO Calculator
                </Link>
              </div>
            </div>
            <div className="glass rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-lg font-semibold text-white">
                Estimated Terms
              </h3>
              <p className="mt-1 text-xs text-muted">
                Sample rates for qualified applicants. Actual terms may vary.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">Robot value</span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-white">
                    $25K - $500K+
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">APR range</span>
                  <span className="font-[family-name:var(--font-brand)] text-sm font-semibold text-white">
                    5.9% - 14.9%
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">Terms</span>
                  <span className="text-sm font-semibold text-white">
                    12 - 84 months
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Down payment</span>
                  <span className="text-sm font-semibold text-white">
                    As low as 10%
                  </span>
                </div>
              </div>
              <p className="mt-6 text-center text-xs text-muted">
                Partner logos coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Robot Insurance */}
      <section className="mt-16">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ COVERAGE ]</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                Robot Insurance
              </h2>
              <p className="mt-4 text-muted">
                Protect your robotic assets with coverage designed specifically
                for automated systems. Our insurance partners understand robot
                risk profiles and offer tailored policies.
              </p>
              <ul className="mt-6 space-y-3">
                {INSURANCE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-green,#00E5A0)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-xl border border-white/10 p-6">
              <h3 className="font-display text-lg font-semibold text-white">
                Average Annual Premiums
              </h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">
                    Single cobot ($25-50K)
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--theme-blue,#00C2FF)]">
                    $3,000 - $6,000/yr
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">
                    Industrial arm ($50-150K)
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--theme-blue,#00C2FF)]">
                    $5,000 - $14,000/yr
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-sm text-muted">
                    AMR fleet ($150-500K)
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-sm font-semibold text-[var(--theme-blue,#00C2FF)]">
                    $10,000 - $30,000/yr
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">
                    Enterprise fleet ($500K+)
                  </span>
                  <span className="text-sm font-semibold text-[var(--theme-blue,#00C2FF)]">
                    Custom quote
                  </span>
                </div>
              </div>
              <Link
                href="/insure"
                className="mt-6 block rounded-lg bg-[var(--theme-blue,#00C2FF)] px-6 py-2.5 text-center text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-opacity hover:opacity-90"
              >
                Get Insurance Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lease Programs */}
      <section className="mt-16">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ LEASE OPTIONS ]</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
            Lease Programs
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Flexible lease terms that match your operational cycle. All leases
            include maintenance options and end-of-term flexibility -- purchase,
            return, or upgrade.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEASE_TERMS.map((item) => (
              <div
                key={item.term}
                className={`rounded-xl border p-6 ${
                  item.highlight
                    ? "border-[var(--theme-blue,#00C2FF)]/50 bg-[var(--theme-blue,#00C2FF)]/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <h3 className="font-display text-lg font-semibold text-white">
                  {item.term}
                </h3>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
                {item.highlight && (
                  <span className="mt-3 inline-block rounded-full bg-[var(--theme-blue,#00C2FF)]/20 px-3 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-wider text-[var(--theme-blue,#00C2FF)]">
                    Most Popular
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/lease"
              className="inline-flex items-center rounded-lg bg-[var(--theme-blue,#00C2FF)] px-6 py-2.5 text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-opacity hover:opacity-90"
            >
              Explore Lease Options
            </Link>
            <Link
              href="/lease/quote"
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Monthly Payment Calculator
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
