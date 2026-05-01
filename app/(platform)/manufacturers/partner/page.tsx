import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PartnerContactForm } from "./partner-contact-form";

export const metadata: Metadata = {
  title: "Manufacturer Partnership Program — Robotomated",
  description:
    "Partner with Robotomated to reach qualified robot buyers. Tiers from free to enterprise with analytics, featured listings, and lead generation.",
};

const stats = [
  { value: "50,000+", label: "Monthly visitors" },
  { value: "15,000+", label: "Robot comparisons per month" },
  { value: "5,000+", label: "Robotimus sessions per month" },
  { value: "2,000+", label: "Buyer journey completions per month" },
];

interface Tier {
  name: string;
  price: string;
  features: string[];
  emphasis: "bronze" | "silver" | "gold" | "platinum";
}

const tiers: Tier[] = [
  {
    name: "Bronze",
    price: "Free",
    emphasis: "bronze",
    features: [
      "Claimed manufacturer profile",
      "Basic manufacturer page",
      "Robot listings in directory",
      "Click tracking analytics",
    ],
  },
  {
    name: "Silver",
    price: "$499/mo",
    emphasis: "silver",
    features: [
      "Everything in Bronze",
      "Featured in category pages",
      "Priority in search results",
      "Monthly analytics report",
      "\"Verified Manufacturer\" badge",
    ],
  },
  {
    name: "Gold",
    price: "$1,499/mo",
    emphasis: "gold",
    features: [
      "Everything in Silver",
      "Homepage featured section",
      "Robotimus recommendations",
      "Lead capture forms",
      "Quarterly strategy call",
      "Custom spotlight article",
    ],
  },
  {
    name: "Platinum",
    price: "$4,999/mo",
    emphasis: "platinum",
    features: [
      "Everything in Gold",
      "Exclusive category sponsorship",
      "Co-branded buyer guides",
      "Direct catalog integration",
      "Weekly analytics + dedicated account manager",
      "Robotomated Certified Partner badge",
    ],
  },
];

const tierStyles: Record<Tier["emphasis"], { card: string; badge: string; price: string }> = {
  bronze: {
    card: "glass rounded-xl p-6",
    badge: "rounded-full bg-white/[0.08] px-3 py-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] font-medium text-muted",
    price: "font-[family-name:var(--font-mono)] text-foreground",
  },
  silver: {
    card: "glass rounded-xl p-6 border border-white/[0.12]",
    badge: "rounded-full bg-white/[0.12] px-3 py-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] font-semibold text-foreground",
    price: "font-[family-name:var(--font-mono)] text-foreground",
  },
  gold: {
    card: "glass rounded-xl p-6 border border-[#00C2FF]/30 shadow-[0_0_24px_rgba(0,194,255,0.06)]",
    badge: "rounded-full bg-white/5 px-3 py-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] font-semibold text-white",
    price: "font-[family-name:var(--font-mono)] text-white",
  },
  platinum: {
    card: "relative rounded-xl p-6 border border-violet/40 bg-gradient-to-br from-white/[0.06] to-violet/[0.04] shadow-[0_0_32px_rgba(123,47,255,0.08)]",
    badge: "rounded-full bg-gradient-to-r from-white/10 to-violet px-3 py-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] font-bold text-white",
    price: "font-[family-name:var(--font-mono)] bg-gradient-to-r from-white/10 to-violet bg-clip-text text-transparent",
  },
};

export default function ManufacturerPartnerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/[0.06] px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Manufacturers", href: "/manufacturers" },
              { name: "Partner", href: "/manufacturers/partner" },
            ]}
          />
          <p className="mt-8 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">[ PARTNER PROGRAM ]</p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Reach buyers where they research
          </h1>
          <p className="mt-4 text-lg text-muted">
            Robotomated is where procurement teams, engineers, and operators discover and evaluate
            robots. Put your products in front of qualified buyers at every stage of their journey.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/[0.06] px-4 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-6 text-center">
              <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">{s.value}</p>
              <p className="mt-1 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.06em] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">[ TIERS ]</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold">Partnership tiers</h2>
          <p className="mt-3 text-center text-muted">
            From free listings to full enterprise partnerships. Choose the level that fits your goals.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => {
              const style = tierStyles[tier.emphasis];
              return (
                <div key={tier.name} className={style.card}>
                  <div className="flex items-center justify-between">
                    <span className={style.badge}>{tier.name}</span>
                  </div>
                  <p className={`mt-4 font-display text-2xl font-bold ${style.price}`}>
                    {tier.price}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-green"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">[ WHY PARTNER ]</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold">
            Why manufacturers partner with Robotomated
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-display text-lg font-semibold">Qualified traffic</h3>
              <p className="mt-2 text-sm text-muted">
                Our visitors are actively researching and comparing robots for purchase. No casual
                browsers — real buying intent.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Transparent methodology</h3>
              <p className="mt-2 text-sm text-muted">
                Our RoboScore methodology is public. Buyers trust our reviews because they are
                independent and explainable.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Data-driven insights</h3>
              <p className="mt-2 text-sm text-muted">
                Understand how buyers evaluate your products with detailed analytics on views,
                comparisons, and conversion paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="border-t border-white/[0.06] px-4 py-16" id="contact">
        <div className="mx-auto max-w-2xl">
          <p className="text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white">[ GET STARTED ]</p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold">Schedule a call</h2>
          <p className="mt-3 text-center text-muted">
            Tell us about your partnership goals and our team will follow up within 2 business days.
          </p>
          <div className="mt-8">
            <PartnerContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
