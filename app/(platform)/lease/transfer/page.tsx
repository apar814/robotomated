import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Lease Transfer Marketplace | Robotomated",
  description:
    "Exit your robot lease early or take over an existing lease at a discount. Browse available lease transfers for industrial and commercial robots.",
};

const transferSteps = [
  {
    step: 1,
    title: "List Your Lease",
    description:
      "Submit your current lease details including robot model, remaining term, monthly payment, and reason for transfer.",
  },
  {
    step: 2,
    title: "We Verify & Price",
    description:
      "Our team verifies the lease terms with your leasing provider and helps set a fair transfer price.",
  },
  {
    step: 3,
    title: "Buyers Browse & Apply",
    description:
      "Qualified buyers review your listing and submit transfer applications with their credit profile.",
  },
  {
    step: 4,
    title: "Leasing Company Approves",
    description:
      "The original leasing company reviews the new lessee and approves the transfer based on creditworthiness.",
  },
  {
    step: 5,
    title: "Transfer Complete",
    description:
      "The lease transfers to the new party. The robot stays deployed or gets relocated. You are off the hook.",
  },
];

export default function LeaseTransferPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Lease", href: "/lease" },
          { name: "Lease Transfers", href: "/lease/transfer" },
        ]}
      />

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Exit Your Robot Lease Early
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Need to get out of a robot lease? List it on our transfer marketplace.
          Buyers get below-market rates on proven equipment. Sellers exit without
          early termination penalties.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#list-lease"
            className="rounded-lg bg-[#00C2FF] px-8 py-3 font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90"
          >
            List My Lease
          </a>
          <Link
            href="/lease"
            className="rounded-lg border border-white/10 px-8 py-3 font-semibold transition hover:border-white/20"
          >
            New Lease Instead
          </Link>
        </div>
      </section>

      {/* Available Transfers */}
      <section className="py-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Available Lease Transfers
        </h2>
        <p className="mt-2 text-muted">
          Take over an existing lease and save on monthly payments.
        </p>
        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-lg font-medium text-muted">
            No transfers listed yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Be the first to list a lease transfer, or check back soon as our
            marketplace grows.
          </p>
        </div>
      </section>

      {/* How Transfer Works */}
      <section className="py-12">
        <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">
          How Lease Transfers Work
        </h2>
        <div className="mt-8 space-y-4">
          {transferSteps.map((s) => (
            <div key={s.step} className="glass flex gap-4 rounded-xl p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7B2FFF]/20 text-sm font-bold text-[#7B2FFF]">
                {s.step}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* List Lease CTA */}
      <section id="list-lease" className="py-12">
        <div className="glass rounded-xl p-8">
          <h2 className="font-display text-2xl font-bold">
            List Your Lease for Transfer
          </h2>
          <p className="mt-2 text-muted">
            Fill out the details below and our team will reach out within 2
            business days to verify your lease and create your listing.
          </p>
          <form
            className="mt-6 space-y-4"
            action="/api/lease/transfers"
            method="POST"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Business Email
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Robot Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Locus Origin"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Monthly Payment
                </label>
                <input
                  type="text"
                  placeholder="e.g. $3,200"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Months Remaining
                </label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Leasing Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. LEAF Commercial Capital"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Reason for Transfer
              </label>
              <textarea
                rows={3}
                placeholder="Why are you looking to transfer this lease?"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#00C2FF] px-6 py-2 font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90"
            >
              Submit Transfer Request
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
