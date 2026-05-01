import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { LeaseCalculator } from "./lease-calculator";

export const metadata: Metadata = {
  title: "Robot Leasing | Robotomated",
  description:
    "Lease industrial and commercial robots from $3,200/month. Preserve capital, include maintenance, and upgrade anytime. Get quotes in 30 days.",
  openGraph: {
    title: "Robot Leasing — Robotomated",
    description:
      "Get a robot for $3,200/month instead of $150,000 upfront. Flexible terms, maintenance included.",
  },
};

const benefits = [
  {
    title: "Preserve Capital",
    description:
      "Keep cash in the business. Lease payments are predictable monthly OpEx, not a massive CapEx hit.",
  },
  {
    title: "Tax Advantaged",
    description:
      "Lease payments are typically 100% deductible as a business expense. Consult your tax advisor for details.",
  },
  {
    title: "Upgrade Path",
    description:
      "Technology moves fast. Upgrade to newer models at the end of your term instead of being stuck with aging hardware.",
  },
  {
    title: "Maintenance Included",
    description:
      "Most lease packages include preventive maintenance, software updates, and emergency repair coverage.",
  },
  {
    title: "Cancel or Transfer",
    description:
      "Need to scale down? Transfer your lease to another business or negotiate early termination options.",
  },
  {
    title: "Start in 30 Days",
    description:
      "From quote to deployment in as little as 30 days. No lengthy procurement cycles or board approvals.",
  },
];

const steps = [
  {
    step: 1,
    title: "Tell Us What You Need",
    description:
      "Select a robot category, share your budget and use case. We match you with leasing partners.",
  },
  {
    step: 2,
    title: "Receive Quotes",
    description:
      "Get competitive quotes from multiple leasing providers within 48 hours. Compare terms side by side.",
  },
  {
    step: 3,
    title: "Choose Your Terms",
    description:
      "Pick the lease length, payment structure, and maintenance package that fits your operation.",
  },
  {
    step: 4,
    title: "Deploy Your Robot",
    description:
      "Your leasing partner handles delivery, installation, and training. You start operating in weeks, not months.",
  },
];

const comparisonRows = [
  {
    label: "Upfront Cost",
    lease: "$0 - $10,000",
    buy: "$50,000 - $500,000+",
    hire: "$0 (staffing fees)",
  },
  {
    label: "Monthly Cost",
    lease: "$1,500 - $12,000",
    buy: "$0 (after purchase)",
    hire: "$4,000 - $8,000/person",
  },
  {
    label: "Maintenance",
    lease: "Included",
    buy: "Your responsibility",
    hire: "N/A",
  },
  {
    label: "Technology Upgrades",
    lease: "At end of term",
    buy: "Buy again",
    hire: "Retrain staff",
  },
  {
    label: "Scalability",
    lease: "Add units anytime",
    buy: "Capital constrained",
    hire: "Labor market dependent",
  },
  {
    label: "Tax Treatment",
    lease: "OpEx deduction",
    buy: "Depreciation",
    hire: "Payroll expense",
  },
  {
    label: "Availability",
    lease: "24/7 operation",
    buy: "24/7 operation",
    hire: "Shift-dependent",
  },
  {
    label: "Exit Flexibility",
    lease: "Transfer or return",
    buy: "Resell (depreciated)",
    hire: "Termination costs",
  },
];

export default function LeasePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Lease", href: "/lease" },
        ]}
      />

      {/* Hero */}
      <section className="py-16 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ LEASE CHANNEL ]
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Get a robot for{" "}
          <span className="font-[family-name:var(--font-mono)] text-[#00C2FF]">$3,200/month</span>
          <br />
          instead of <span className="font-[family-name:var(--font-mono)]">$150,000</span> upfront
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Robot leasing gives you enterprise automation without the capital
          commitment. Flexible terms from 12 to 60 months, maintenance included,
          upgrade when you want.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/lease/quote"
            className="rounded-lg bg-[#00C2FF] px-8 py-3 font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90"
          >
            Get Lease Quotes
          </Link>
          <Link
            href="/lease/transfer"
            className="rounded-lg border border-white/10 px-8 py-3 font-semibold transition hover:border-white/20"
          >
            Transfer a Lease
          </Link>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12">
        <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ BENEFITS ]
        </p>
        <h2 className="mt-2 font-display text-center text-2xl font-bold sm:text-3xl">
          Why Lease a Robot
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm text-muted">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lease Calculator */}
      <section className="py-12">
        <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ CALCULATOR ]
        </p>
        <h2 className="mt-2 font-display text-center text-2xl font-bold sm:text-3xl">
          Estimate Your Monthly Payment
        </h2>
        <p className="mt-2 text-center text-muted">
          Adjust the robot price and lease term to see estimated monthly costs.
        </p>
        <div className="mx-auto mt-8 max-w-lg">
          <LeaseCalculator />
        </div>
      </section>

      {/* Lease vs Buy vs Hire */}
      <section className="py-12">
        <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ COMPARISON ]
        </p>
        <h2 className="mt-2 font-display text-center text-2xl font-bold sm:text-3xl">
          Lease vs Buy vs Hire
        </h2>
        <p className="mt-2 text-center text-muted">
          Compare the true cost of automation approaches.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Factor
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#00C2FF]">
                  Lease
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[0.08em]">
                  Buy
                </th>
                <th className="px-4 py-3 text-left font-[family-name:var(--font-ui)] text-[11px] font-semibold uppercase tracking-[0.08em]">
                  Hire Human
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-[#00E5A0]">
                    {row.lease}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-muted">{row.buy}</td>
                  <td className="px-4 py-3 font-[family-name:var(--font-mono)] text-sm text-muted">{row.hire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ PROCESS ]
        </p>
        <h2 className="mt-2 font-display text-center text-2xl font-bold sm:text-3xl">
          How It Works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="glass rounded-xl p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#7B2FFF]/20 font-[family-name:var(--font-brand)] text-sm font-bold text-[#7B2FFF]">
                {s.step}
              </div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">
          [ GET STARTED ]
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
          Ready to Automate Without the Upfront Cost?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Tell us about your operation and get competitive lease quotes from
          multiple providers. No commitment required.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/lease/quote"
            className="rounded-lg bg-[#00C2FF] px-8 py-3 font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90"
          >
            Get Lease Quotes
          </Link>
          <Link
            href="/lease/timeshare"
            className="rounded-lg border border-white/10 px-8 py-3 font-semibold transition hover:border-white/20"
          >
            Explore Time-Shares
          </Link>
        </div>
      </section>
    </div>
  );
}
