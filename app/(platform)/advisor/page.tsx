import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AdvisorClient } from "@/components/advisor/advisor-client";
import { JsonLd, FaqSchema } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Robotimus \u2014 Your Independent Robotics Advisor",
  description:
    "Meet Robotimus, Robotomated's AI robotics advisor. Describe your needs and get expert robot recommendations across 600+ models with specs, pricing, and RoboScore ratings.",
  openGraph: {
    title: "Robotimus \u2014 Your Independent Robotics Advisor | Robotomated",
    description:
      "Get expert AI-powered robot recommendations based on your use case, budget, and requirements. Compare 600+ robots across 9 industries.",
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

const ROBOTIMUS_FAQS = [
  {
    question: "Who is Robotimus?",
    answer:
      "Robotimus is Robotomated's AI robotics advisor \u2014 the world's most knowledgeable independent robotics consultant. He analyzes 600+ robots across 9 industries and gives direct, unbiased recommendations based on your specific needs, budget, and use case.",
  },
  {
    question: "Is Robotimus free to use?",
    answer:
      "Yes. Robotimus is free to use with a monthly conversation limit. Pro subscribers get unlimited conversations and priority responses.",
  },
  {
    question: "What industries does Robotimus cover?",
    answer:
      "Robotimus covers warehouse & logistics, medical & surgical, manufacturing, agricultural, construction, delivery, security, hospitality, and eldercare robotics.",
  },
  {
    question: "Are the recommendations unbiased?",
    answer:
      "Absolutely. Robotimus never favors one manufacturer over another. Robotomated never accepts payment to influence scores or recommendations. Every recommendation is backed by our public RoboScore methodology and verified data.",
  },
  {
    question: "Can Robotimus help me decide between buying, leasing, or hiring?",
    answer:
      "Yes. Robotimus evaluates your budget, timeline, and operational needs to recommend the right path \u2014 whether that's buying, leasing, or hiring through RoboWork for temporary deployments.",
  },
];

const USE_CASES = [
  { label: "Warehouse Automation", query: "I need to automate my warehouse \u2014 where do I start?" },
  { label: "ROI Analysis", query: "What's the ROI on a $150K robot for my operation?" },
  { label: "Buy vs Lease", query: "Should I buy, lease, or hire a robot?" },
  { label: "Hospital Delivery", query: "Which robot is best for hospital delivery?" },
  { label: "Budget Planning", query: "I have a 50,000 sq ft warehouse and $200K budget" },
  { label: "CFO Business Case", query: "Help me build a case for my CFO" },
];

export default function AdvisorPage() {
  return (
    <div className="flex flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Robotimus \u2014 Robotomated AI Robotics Advisor",
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
      <FaqSchema items={ROBOTIMUS_FAQS} />

      {/* SSR Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-12 pt-12">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Robotimus avatar */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16">
              <line x1="16" y1="2" x2="16" y2="6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="2" r="1.5" fill="#2563EB" />
              <rect x="6" y="6" width="20" height="16" rx="4" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="1.5" />
              <circle cx="12" cy="14" r="2.5" fill="#2563EB" />
              <circle cx="20" cy="14" r="2.5" fill="#2563EB" />
              <circle cx="13" cy="13" r="0.8" fill="white" fillOpacity="0.8" />
              <circle cx="21" cy="13" r="0.8" fill="white" fillOpacity="0.8" />
              <rect x="11" y="18" width="10" height="1.5" rx="0.75" fill="#2563EB" fillOpacity="0.6" />
              <rect x="3" y="11" width="3" height="6" rx="1.5" fill="#2563EB" fillOpacity="0.3" />
              <rect x="26" y="11" width="3" height="6" rx="1.5" fill="#2563EB" fillOpacity="0.3" />
              <rect x="14" y="22" width="4" height="3" rx="1" fill="#2563EB" fillOpacity="0.4" />
              <rect x="9" y="25" width="14" height="4" rx="2" fill="#2563EB" fillOpacity="0.15" stroke="#2563EB" strokeWidth="1" />
            </svg>
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            Robotimus
          </h1>
          <p className="mt-1 text-sm font-medium text-[#2563EB]">Your independent robotics advisor</p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
            Tell me what you need in plain language. I know every robot in our database
            and I&apos;ll tell you straight whether to buy, lease, or hire &mdash; with specs,
            pricing, and independent RoboScore ratings.
          </p>

          {/* Use case quick links */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {USE_CASES.map((uc) => (
              <Link
                key={uc.label}
                href={`/advisor?q=${encodeURIComponent(uc.query)}`}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left transition-all hover:border-[#2563EB]/30 hover:bg-white/[0.06]"
              >
                <p className="text-sm font-bold text-white">{uc.label}</p>
                <p className="mt-1 text-xs text-white/50">{uc.query}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Chat interface */}
      <div className="flex min-h-[60vh] flex-col">
        <Suspense
          fallback={
            <div className="flex flex-1 items-center justify-center bg-[#0A0F1E] text-white/40">
              Loading Robotimus...
            </div>
          }
        >
          <AdvisorClient />
        </Suspense>
      </div>

      {/* How it works */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
            How Robotimus works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB]/10 font-mono text-lg font-bold text-[#2563EB]">
                1
              </div>
              <h3 className="mt-4 font-semibold text-white">Describe your needs</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Tell Robotimus about your use case, environment, budget, and
                requirements. Use natural language &mdash; no jargon needed.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7B2FFF]/10 font-mono text-lg font-bold text-[#7B2FFF]">
                2
              </div>
              <h3 className="mt-4 font-semibold text-white">Get recommendations</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Robotimus searches 600+ robots and returns your top 3 matches with
                RoboScore ratings, pricing, and why each one fits.
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E5A0]/10 font-mono text-lg font-bold text-[#00E5A0]">
                3
              </div>
              <h3 className="mt-4 font-semibold text-white">Buy, lease, or hire</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Robotimus recommends the right path forward &mdash; buy, lease, or hire
                through RoboWork &mdash; based on your budget and timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {ROBOTIMUS_FAQS.map((faq) => (
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

      {/* Cross-links */}
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
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-colors hover:border-[#2563EB]/30 hover:text-white"
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
