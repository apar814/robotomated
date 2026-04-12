import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Enterprise Robotics Platform -- Robotomated",
  description:
    "The enterprise robotics platform trusted by Fortune 500 companies and government agencies. Fleet management, custom scoring, procurement workflows, and dedicated support.",
};

const FEATURES: { title: string; description: string; badge?: string }[] = [
  {
    title: "Private Fleet Dashboard",
    description:
      "Real-time visibility into your entire robot fleet. Track utilization, maintenance schedules, and performance metrics across every facility from a single pane of glass.",
  },
  {
    title: "Custom RoboScore Weighting",
    description:
      "Adjust RoboScore dimension weights to match your operational priorities. Emphasize reliability for mission-critical deployments or value for cost-conscious rollouts.",
  },
  {
    title: "Multi-Manufacturer RFQ System",
    description:
      "Issue requests for quotes to multiple manufacturers simultaneously. Compare bids side-by-side with standardized specs and transparent pricing.",
  },
  {
    title: "Procurement Workflow",
    description:
      "End-to-end procurement with approval chains, budget tracking, PO generation, and vendor management. Integrates with your existing ERP systems.",
  },
  {
    title: "Unlimited API Access",
    description:
      "Full access to the Robotomated API for custom integrations, data exports, and automated workflows. Build internal tools on top of our data layer.",
  },
  {
    title: "Dedicated Account Manager",
    description:
      "A named account manager who understands your fleet, your industry, and your goals. Direct line access with guaranteed response times.",
  },
  {
    title: "SOC 2 Compliant",
    description:
      "Enterprise-grade security with SOC 2 Type II certification in progress. Data encryption at rest and in transit, audit logs, and access controls.",
    badge: "Coming",
  },
  {
    title: "SSO / SAML Support",
    description:
      "Single sign-on integration with your identity provider. Support for SAML 2.0, OIDC, and Active Directory federation.",
    badge: "Coming",
  },
];

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "$999",
    period: "/mo",
    description: "For teams beginning their robotics journey.",
    features: [
      "Up to 5 users",
      "Fleet dashboard (up to 25 robots)",
      "Standard RoboScore access",
      "Email support (48-hr SLA)",
      "Monthly usage reports",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$2,999",
    period: "/mo",
    description: "For organizations scaling robot deployments.",
    features: [
      "Up to 25 users",
      "Fleet dashboard (up to 200 robots)",
      "Custom RoboScore weighting",
      "Multi-manufacturer RFQ system",
      "API access (50K requests/mo)",
      "Procurement workflow",
      "Priority support (24-hr SLA)",
    ],
    cta: "Get Started",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale fleet operators and integrators.",
    features: [
      "Unlimited users",
      "Unlimited fleet size",
      "White-label reporting",
      "Unlimited API access",
      "Dedicated account manager",
      "Custom SLA (up to 4-hr response)",
      "SSO / SAML integration",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
] as const;

const FLEET_SIZE_OPTIONS = [
  "1-10 robots",
  "11-50 robots",
  "51-200 robots",
  "201-1,000 robots",
  "1,000+ robots",
] as const;

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 30 days",
  "1-3 months",
  "3-6 months",
  "Evaluating options",
] as const;

export default function EnterprisePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Enterprise", href: "/enterprise" },
        ]}
      />

      {/* Hero */}
      <section className="mt-8 text-center">
        <span className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
          [ ENTERPRISE ]
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          The robotics platform for serious operators.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          Fortune 500 companies, government agencies, and fleet operators use
          Robotomated to evaluate, procure, and manage robotic systems at scale.
          One platform for fleet visibility, procurement, and performance
          intelligence.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg bg-[var(--theme-blue,#00C2FF)] px-8 py-3 text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-opacity hover:opacity-90"
          >
            Talk to Sales
          </a>
          <Link
            href="/developers"
            className="inline-flex items-center rounded-lg border border-white/10 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
          >
            View API Docs
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-24">
        <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB] text-center">[ CAPABILITIES ]</p>
        <h2 className="mt-3 text-center font-display text-2xl font-semibold text-white sm:text-3xl">
          Built for Enterprise Scale
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          Every feature designed for teams managing complex, multi-site robot
          deployments.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass relative rounded-xl border border-white/10 p-6"
            >
              {feature.badge ? (
                <span className="absolute right-4 top-4 rounded-full bg-[var(--theme-violet,#7B2FFF)]/20 px-2.5 py-0.5 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-violet,#7B2FFF)]">
                  {feature.badge}
                </span>
              ) : null}
              <h3 className="font-display text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mt-24">
        <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB] text-center">[ PRICING ]</p>
        <h2 className="mt-3 text-center font-display text-2xl font-semibold text-white sm:text-3xl">
          Pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          Transparent pricing that scales with your fleet. All plans include
          onboarding support.
        </p>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`glass relative flex flex-col rounded-2xl border p-8 ${
                tier.highlight
                  ? "border-[var(--theme-blue,#00C2FF)]/50"
                  : "border-white/10"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--theme-blue,#00C2FF)] px-4 py-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-wider text-[var(--theme-navy,#0A0F1E)]">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-white">
                {tier.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <div className="mt-6 flex items-baseline">
                <span className="font-[family-name:var(--font-mono)] text-4xl font-bold text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="ml-1 text-muted">{tier.period}</span>
                )}
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
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
              <a
                href={tier.name === "Enterprise" ? "#contact" : "#contact"}
                className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90 ${
                  tier.highlight
                    ? "bg-[var(--theme-blue,#00C2FF)] text-[var(--theme-navy,#0A0F1E)]"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="mt-24">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ CONTACT ]</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-white">
            Contact Enterprise Sales
          </h2>
          <p className="mt-2 text-muted">
            Tell us about your fleet and requirements. Our team will get back to
            you within one business day.
          </p>
          <EnterpriseContactForm />
        </div>
      </section>
    </main>
  );
}

function EnterpriseContactForm() {
  return (
    <form
      action="/api/enterprise/inquiry"
      method="POST"
      className="mt-8 grid gap-6 sm:grid-cols-2"
    >
      <div>
        <label
          htmlFor="ent-name"
          className="block text-sm font-medium text-muted"
        >
          Full Name *
        </label>
        <input
          id="ent-name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label
          htmlFor="ent-email"
          className="block text-sm font-medium text-muted"
        >
          Work Email *
        </label>
        <input
          id="ent-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
          placeholder="jane@company.com"
        />
      </div>
      <div>
        <label
          htmlFor="ent-company"
          className="block text-sm font-medium text-muted"
        >
          Company *
        </label>
        <input
          id="ent-company"
          name="company"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
          placeholder="Acme Robotics Inc."
        />
      </div>
      <div>
        <label
          htmlFor="ent-fleet-size"
          className="block text-sm font-medium text-muted"
        >
          Fleet Size
        </label>
        <select
          id="ent-fleet-size"
          name="fleet_size"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
        >
          <option value="">Select fleet size</option>
          {FLEET_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="ent-spend"
          className="block text-sm font-medium text-muted"
        >
          Annual Robot Spend
        </label>
        <input
          id="ent-spend"
          name="annual_robot_spend"
          type="text"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
          placeholder="$500,000"
        />
      </div>
      <div>
        <label
          htmlFor="ent-timeline"
          className="block text-sm font-medium text-muted"
        >
          Timeline
        </label>
        <select
          id="ent-timeline"
          name="timeline"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-[var(--theme-blue,#00C2FF)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]"
        >
          <option value="">Select timeline</option>
          {TIMELINE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="w-full rounded-lg bg-[var(--theme-blue,#00C2FF)] px-8 py-3 text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-opacity hover:opacity-90 sm:w-auto"
        >
          Submit Inquiry
        </button>
      </div>
    </form>
  );
}
