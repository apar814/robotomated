import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { TcoCalculatorClient } from "@/components/tools/tco-calculator-client";

export const metadata: Metadata = {
  title: "Robot Total Cost of Ownership Calculator (2026) | Robotomated",
  description: "Calculate the full 5-year cost of robot ownership vs human labor: purchase, installation, maintenance, training, energy, downtime. Free interactive TCO calculator with shareable results.",
};

export default function TcoCalculatorPage() {
  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Robot Total Cost of Ownership Calculator",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://robotomated.com/tools/tco-calculator",
        description: "Calculate the full 5-year total cost of robot ownership vs human labor including installation, maintenance, training, energy, and downtime costs.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "Robotomated" },
      }} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-8 pt-12">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Tools", href: "/tools/tco-calculator" },
            { name: "TCO Calculator", href: "/tools/tco-calculator" },
          ]} />
          <RevealOnScroll>
            <span className="section-label mt-6 block">Free Tool</span>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
              Total Cost of Ownership Calculator
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/60">
              See the full 5-year cost picture: robot purchase, installation, maintenance, training, energy, and downtime vs. human labor with benefits, overhead, and turnover.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-[#0A0F1E] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <TcoCalculatorClient />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <span className="section-label">Methodology</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white">How we calculate TCO</h2>
          </RevealOnScroll>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Robot Costs", items: ["Purchase price", "Installation (15-25%)", "Annual maintenance (8-12%)", "Training ($2-5K/operator)", "Energy consumption", "Downtime cost", "Software/subscription fees"] },
              { title: "Human Labor Costs", items: ["Base hourly wage", "Benefits & overhead (1.3x)", "Annual turnover cost ($3-5K)", "Overtime premiums", "Workers comp insurance", "Training/onboarding", "Management overhead"] },
              { title: "Comparison Output", items: ["Year-by-year cost curves", "Break-even point", "5-year total savings", "Per-unit cost reduction", "Payback period", "Shareable analysis URL"] },
            ].map((col, i) => (
              <RevealOnScroll key={i} delay={i as 0 | 1 | 2}>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6">
                  <h3 className="font-semibold text-white">{col.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/50">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
