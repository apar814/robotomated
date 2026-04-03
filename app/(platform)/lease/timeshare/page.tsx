import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robot Time-Sharing | Robotomated",
  description:
    "Share a robot between two businesses and cut costs in half. Browse available robot time-shares or list your robot for shared use.",
};

const howItWorks = [
  {
    title: "One Robot, Two Schedules",
    description:
      "A warehouse robot runs palletizing from 6 AM to 2 PM for Business A, then switches to inventory scanning from 3 PM to 11 PM for Business B. Same robot, two operations, half the cost each.",
  },
  {
    title: "Coordinated by Robotomated",
    description:
      "We handle scheduling, logistics, maintenance coordination, and dispute resolution. Both parties get a clear SLA with guaranteed uptime windows.",
  },
  {
    title: "Flexible Arrangements",
    description:
      "Split by shift (AM/PM), by day (MWF/TTh), or by season. Whatever works for both businesses. Terms are locked in a shared-use agreement.",
  },
  {
    title: "Shared Maintenance Costs",
    description:
      "Maintenance, insurance, and software updates are split proportionally based on usage hours. No surprises.",
  },
];

const idealFor = [
  {
    title: "Seasonal Businesses",
    description:
      "A landscaping company needs an outdoor robot spring through fall. A snow removal company needs it winter. Perfect match.",
  },
  {
    title: "Different Shift Operations",
    description:
      "Day shift manufacturing + night shift cleaning. Two businesses, one robot, zero overlap.",
  },
  {
    title: "Small Operations",
    description:
      "If you only need a robot for 4-6 hours a day, why pay for 24 hours of capacity? Split with a neighbor.",
  },
  {
    title: "Pilot Programs",
    description:
      "Test automation at half the cost before committing to a full-time lease or purchase.",
  },
];

export default function TimesharePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Lease", href: "/lease" },
          { name: "Time-Sharing", href: "/lease/timeshare" },
        ]}
      />

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          One Robot. Two Businesses.
          <br />
          <span className="text-[#00E5A0]">Half the Cost.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Robot time-sharing lets two compatible businesses split a single robot
          lease. You get the automation you need at a fraction of the price.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#list-robot"
            className="rounded-lg bg-[#00E5A0] px-8 py-3 font-semibold text-[#0A0F1E] transition hover:bg-[#00E5A0]/90"
          >
            List My Robot
          </a>
          <Link
            href="/lease/quote"
            className="rounded-lg border border-white/10 px-8 py-3 font-semibold transition hover:border-white/20"
          >
            Get a Full Lease Instead
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">
          How Robot Time-Sharing Works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {howItWorks.map((item) => (
            <div key={item.title} className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Available Time-Shares */}
      <section className="py-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Available Time-Shares
        </h2>
        <p className="mt-2 text-muted">
          Browse robots looking for a time-share partner.
        </p>

        {/* Filter placeholder */}
        <div className="mt-6 flex flex-wrap gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted">
            All Categories
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted">
            All Locations
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted">
            Any Schedule
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center">
          <p className="text-lg font-medium text-muted">
            No time-shares listed yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Be the first to list your robot for time-sharing, or check back soon
            as our marketplace grows.
          </p>
        </div>
      </section>

      {/* Ideal For */}
      <section className="py-12">
        <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">
          Ideal For
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {idealFor.map((item) => (
            <div key={item.title} className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* List Robot CTA */}
      <section id="list-robot" className="py-12">
        <div className="glass rounded-xl p-8">
          <h2 className="font-display text-2xl font-bold">
            List Your Robot for Time-Sharing
          </h2>
          <p className="mt-2 text-muted">
            Have a robot with spare capacity? List it here and we will match you
            with a compatible business to share costs.
          </p>
          <form
            className="mt-6 space-y-4"
            action="/api/lease/timeshares"
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
                  placeholder="e.g. Fetch Robotics CartConnect"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Available Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6 PM - 6 AM daily"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Monthly Cost to Share
                </label>
                <input
                  type="text"
                  placeholder="e.g. $1,600/month"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the robot, its capabilities, and what kind of time-share partner you are looking for."
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#00E5A0] px-6 py-2 font-semibold text-[#0A0F1E] transition hover:bg-[#00E5A0]/90"
            >
              Submit Time-Share Listing
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
