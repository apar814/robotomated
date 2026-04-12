import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "RCO Employer Portal -- Certify Your Team | Robotomated",
  description:
    "Bulk certification pricing, team management dashboard, compliance reporting. Certified operators have 73% fewer robot incidents.",
};

const BULK_TIERS = [
  {
    seats: 5,
    discount: 10,
    perSeat: 134,
    level: "Foundation",
    total: 670,
    popular: false,
  },
  {
    seats: 10,
    discount: 20,
    perSeat: 119,
    level: "Foundation",
    total: 1190,
    popular: true,
  },
  {
    seats: 25,
    discount: 30,
    perSeat: 104,
    level: "Foundation",
    total: 2600,
    popular: false,
  },
];

const DASHBOARD_FEATURES = [
  {
    title: "Team Invitations",
    description:
      "Invite team members by email. They receive a link to create their account and begin studying immediately.",
  },
  {
    title: "Real-Time Progress Tracking",
    description:
      "See each employee's study progress, module completion, and practice scores in a unified dashboard.",
  },
  {
    title: "Score Visibility",
    description:
      "View certification scores and domain breakdowns for every team member. Identify knowledge gaps across your team.",
  },
  {
    title: "Compliance Reports",
    description:
      "Export PDF and CSV reports for audits. Show certification status, expiry dates, and domain competencies.",
  },
  {
    title: "Renewal Management",
    description:
      "Automatic notifications 60 days before certification expiry. One-click renewal for the entire team.",
  },
  {
    title: "RCO Certified Team Badge",
    description:
      "Display the 'RCO Certified Team' badge on your RoboWork RSP profile. Earn priority placement in search results.",
  },
];

const ROI_STATS = [
  {
    stat: "73%",
    label: "Fewer robot incidents with certified operators",
  },
  {
    stat: "40%",
    label: "More jobs earned by RCO certified RSPs on Robotomated",
  },
  {
    stat: "2.3x",
    label: "Faster robot deployment with trained teams",
  },
  {
    stat: "$18K",
    label: "Average savings per incident avoided annually",
  },
];

export default function EmployerPortalPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ EMPLOYER PORTAL ]
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Certify Your{" "}
            <span className="text-blue">Entire Team</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Bulk pricing, team management, compliance reports. The fastest
            way to build a certified robotics workforce.
          </p>

          {/* ROI stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {ROI_STATS.map((s) => (
              <div key={s.stat} className="text-center">
                <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">
                  {s.stat}
                </p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk pricing */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center font-display text-2xl font-bold">
            Bulk Pricing
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            All tiers include Foundation certification. Contact us for
            Specialist, Master, and Fleet Commander bulk pricing.
          </p>

          <div className="grid gap-6 sm:grid-cols-3">
            {BULK_TIERS.map((tier) => (
              <div
                key={tier.seats}
                className={`relative rounded-xl border p-6 transition-all ${
                  tier.popular
                    ? "border-blue/50 bg-blue/5 shadow-lg shadow-blue/10"
                    : "border-border bg-[#0A0A0A] hover:border-blue/20"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}
                <div className="text-center">
                  <p className="font-[family-name:var(--font-brand)] text-4xl font-bold text-white">
                    {tier.seats}
                  </p>
                  <p className="text-sm text-muted">seats</p>
                </div>

                <div className="mt-6 space-y-2 text-center">
                  <p className="text-xs text-green font-semibold">
                    {tier.discount}% off
                  </p>
                  <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                    ${tier.perSeat}
                    <span className="text-sm text-muted">/seat</span>
                  </p>
                  <p className="text-xs text-muted">
                    ${tier.total} total
                  </p>
                </div>

                <button className="mt-6 w-full rounded-lg bg-blue px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue/90">
                  Get Started
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
            <h3 className="font-display text-lg font-bold text-white">
              Enterprise (25+ seats)
            </h3>
            <p className="mt-2 text-sm text-muted">
              Custom pricing, dedicated account manager, on-site training
              coordination, custom reporting, and API access for LMS
              integration.
            </p>
            <button className="mt-4 rounded-lg border border-amber-500/30 px-8 py-3 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-500/10">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard features */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            Team Management Dashboard
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {DASHBOARD_FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            Who Uses Employer Certification
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Warehouse Operators",
                description:
                  "Certify AMR fleet operators across multiple facilities. Reduce incidents and improve uptime.",
                roles: "AMR Operators, Warehouse Techs",
              },
              {
                title: "System Integrators",
                description:
                  "Prove team competency to clients. RCO certification as a differentiator in proposals.",
                roles: "Integration Engineers, Project Managers",
              },
              {
                title: "Robot Manufacturers",
                description:
                  "Certify partner network technicians. Standardize service quality across dealers.",
                roles: "Service Techs, Field Engineers",
              },
            ].map((uc) => (
              <div
                key={uc.title}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {uc.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{uc.description}</p>
                <p className="mt-3 text-xs text-blue">{uc.roles}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold">
            Ready to certify your team?
          </h2>
          <p className="mt-4 text-muted">
            Start with 5 seats and scale up as your automation program grows.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button className="rounded-lg bg-blue px-10 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue/90">
              Start Team Certification
            </button>
            <Link
              href="/certify"
              className="rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Individual Certification
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
