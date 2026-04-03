import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AdvisorClient } from "@/components/advisor/advisor-client";
import { JsonLd, FaqSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "AI Robot Advisor — Find Your Perfect Robot",
  description:
    "Describe your needs and get AI-powered robot recommendations from our AI advisor. Compare robots by use case, budget, and specs across 600+ models. Powered by Claude.",
  openGraph: {
    title: "AI Robot Advisor — Find Your Perfect Robot | Robotomated",
    description:
      "Get instant, AI-powered robot recommendations based on your use case, budget, and requirements. Compare 600+ robots across 9 industries.",
    url: "https://robotomated.com/advisor",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://robotomated.com/advisor",
  },
};

const ADVISOR_FAQS = [
  {
    question: "How does the AI Robot Advisor work?",
    answer:
      "Describe your use case, budget, and requirements in plain language. Our AI analyzes 600+ robots across 9 industries and recommends the best matches with specs, pricing, and RoboScore ratings.",
  },
  {
    question: "Is the AI Robot Advisor free?",
    answer:
      "Yes. The AI advisor is free to use with a monthly conversation limit. Pro subscribers get unlimited conversations and priority responses.",
  },
  {
    question: "What industries does the advisor cover?",
    answer:
      "The advisor covers warehouse & logistics, medical & surgical, manufacturing, agricultural, construction, delivery, security, hospitality, and eldercare robotics.",
  },
  {
    question: "Are the recommendations unbiased?",
    answer:
      "Absolutely. Robotomated never accepts payment to influence scores or recommendations. Our RoboScore methodology is public and every recommendation is backed by verified data.",
  },
  {
    question: "Can I compare robots the advisor recommends?",
    answer:
      "Yes. Every robot recommendation links to its full profile with specs, pricing, and side-by-side comparison tools.",
  },
];

const USE_CASES = [
  { label: "Warehouse Automation", query: "Best warehouse robot under $50K", icon: "📦" },
  { label: "Surgical Robotics", query: "Surgical robot alternatives to da Vinci", icon: "🏥" },
  { label: "Manufacturing Cobots", query: "Cobots for small manufacturing teams", icon: "🏭" },
  { label: "Agricultural Drones", query: "Best agricultural drone under $20K", icon: "🌾" },
  { label: "Security Patrol", query: "Autonomous security patrol robots", icon: "🔒" },
  { label: "Delivery Robots", query: "Last-mile delivery robots for campus", icon: "🚚" },
];

export default function AdvisorPage() {
  return (
    <div className="flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Robotomated AI Robot Advisor",
          description:
            "AI-powered robot recommendation engine covering 600+ robots across 9 industries.",
          url: "https://robotomated.com/advisor",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />
      <FaqSchema items={ADVISOR_FAQS} />

      {/* SSR Hero — visible to crawlers and users before JS loads */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-12 pt-12">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            AI Robot Advisor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
            Describe what you need in plain language. Our AI analyzes 600+ robots
            across 9 industries and recommends the best match — with specs,
            pricing, and independent RoboScore ratings.
          </p>

          {/* Use case quick links — SSR content for Google */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={`/advisor?q=${encodeURIComponent(uc.query)}`}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-[#00C2FF]/30 hover:bg-white/[0.06]"
              >
                <span className="text-lg">{uc.icon}</span>
                <p className="mt-1 text-sm font-medium text-white">{uc.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{uc.query}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Chat interface — client component */}
      <div className="flex min-h-[60vh] flex-col">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center bg-[#0A0F1E] text-white/40">
              Loading advisor...
            </div>
          }
        >
          <AdvisorClient />
        </Suspense>
      </div>

      {/* SSR content sections — indexable by Google */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00C2FF]/10 font-mono text-lg font-bold text-[#00C2FF]">
                1
              </div>
              <h3 className="mt-4 font-semibold text-white">Describe your needs</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Tell the advisor about your use case, environment, budget, and any
                specific requirements. Use natural language — no jargon needed.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7B2FFF]/10 font-mono text-lg font-bold text-[#7B2FFF]">
                2
              </div>
              <h3 className="mt-4 font-semibold text-white">Get recommendations</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                The AI searches our database of 600+ robots and returns matches with
                RoboScore ratings, pricing, and key specifications.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E5A0]/10 font-mono text-lg font-bold text-[#00E5A0]">
                3
              </div>
              <h3 className="mt-4 font-semibold text-white">Compare and decide</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                View full robot profiles, compare options side-by-side, and use our
                TCO calculator to evaluate total cost of ownership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section — SSR for SEO */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {ADVISOR_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-white/[0.07] bg-white/[0.02]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-white">
                  <h3 className="pr-4 font-medium">{faq.question}</h3>
                  <svg
                    className="h-5 w-5 shrink-0 text-white/40 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-white/[0.05] px-6 py-4">
                  <p className="text-sm leading-[1.8] text-white/60">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-links for crawlability */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-xl font-bold text-white">
            Explore by industry
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Deep guides with robot comparisons, ROI calculators, and deployment case studies.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              { label: "Warehouse", href: "/industries/warehouse-robotics" },
              { label: "Medical", href: "/industries/medical-robotics" },
              { label: "Manufacturing", href: "/industries/manufacturing-robotics" },
              { label: "Agricultural", href: "/industries/agricultural-robotics" },
              { label: "Construction", href: "/industries/construction-robotics" },
              { label: "Delivery", href: "/industries/delivery-robotics" },
              { label: "Security", href: "/industries/security-robotics" },
              { label: "Hospitality", href: "/industries/hospitality-robotics" },
              { label: "Eldercare", href: "/industries/eldercare-robotics" },
            ].map((ind) => (
              <Link
                key={ind.href}
                href={ind.href}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#00C2FF]/30 hover:text-white"
              >
                {ind.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
