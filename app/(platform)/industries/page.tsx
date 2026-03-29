import type { Metadata } from "next";
import Link from "next/link";
import { getAllIndustries } from "@/lib/data/industry-types";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";

export const metadata: Metadata = {
  title: "Industries — Robotics Solutions by Sector | Robotomated",
  description: "Explore robotics solutions across 9 industries: warehouse, medical, manufacturing, agriculture, construction, delivery, security, hospitality, and eldercare. Compare robots, ROI data, and deployment guides.",
  openGraph: {
    title: "Industries — Robotics Solutions by Sector | Robotomated",
    description: "Explore robotics solutions across 9 industries. Compare robots, ROI data, and deployment guides for every sector.",
    url: "https://robotomated.com/industries",
    type: "website",
  },
};

export default function IndustriesHubPage() {
  const industries = getAllIndustries();

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Robotics by Industry",
        description: "Explore robotics solutions across 9 industries.",
        url: "https://robotomated.com/industries",
        publisher: { "@type": "Organization", name: "Robotomated" },
        hasPart: industries.map((ind) => ({
          "@type": "WebPage",
          name: ind.name,
          url: `https://robotomated.com/industries/${ind.slug}`,
        })),
      }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-20 pt-12">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Industries", href: "/industries" },
          ]} />
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Robotics by Industry
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
            Every industry has unique automation challenges. Explore our in-depth guides
            with curated robot comparisons, ROI calculators, compliance requirements, and
            real deployment case studies for your sector.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-4">
              <p className="font-mono text-2xl font-bold text-white">9</p>
              <p className="text-[11px] uppercase tracking-widest text-blue">Industries Covered</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-4">
              <p className="font-mono text-2xl font-bold text-white">$140B+</p>
              <p className="text-[11px] uppercase tracking-widest text-blue">Combined Market Size</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-4">
              <p className="font-mono text-2xl font-bold text-white">27</p>
              <p className="text-[11px] uppercase tracking-widest text-blue">Case Studies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry, i) => (
              <RevealOnScroll key={industry.slug} delay={Math.min(i % 3, 2) as 0 | 1 | 2}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-blue/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl">{industry.icon}</span>
                    <h2 className="font-display text-lg font-bold text-white transition-colors group-hover:text-blue">
                      {industry.name}
                    </h2>
                  </div>
                  <p className="mb-4 flex-1 text-sm leading-[1.7] text-white/50">
                    {industry.shortDescription}
                  </p>

                  {/* Market stats preview */}
                  <div className="mb-4 flex gap-3">
                    {industry.marketStats.slice(0, 2).map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-white/[0.03] px-3 py-2">
                        <p className="font-mono text-sm font-bold text-white">{stat.value}</p>
                        <p className="text-[9px] uppercase tracking-wider text-white/30">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Use case tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {industry.types.slice(0, 3).map((type) => (
                      <span key={type.id} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/40">
                        {type.label}
                      </span>
                    ))}
                    {industry.types.length > 3 && (
                      <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] text-white/30">
                        +{industry.types.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-blue opacity-0 transition-opacity group-hover:opacity-100">
                    Explore guide
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue/[0.05] to-violet/[0.05] p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">
                Not sure which industry guide to start with?
              </h2>
              <p className="mt-3 text-base text-white/60">
                Our AI advisor can help you find the right robot based on your specific use case, budget, and requirements.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/advisor" className="rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90">
                  Talk to AI Advisor
                </Link>
                <Link href="/explore" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-3 text-sm font-semibold text-white/80 hover:border-white/20">
                  Browse All Robots
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
