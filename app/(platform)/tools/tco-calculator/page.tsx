import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TcoCalculatorClient } from "@/components/tools/tco-calculator-client";

export const metadata: Metadata = {
  title: "Total Cost of Ownership Calculator — Robot vs Labor (2026) | Robotomated",
  description:
    "Compare the real cost of robots vs. manual labor over 5 years. Calculate purchase, installation, maintenance, training, energy, and downtime costs with our free interactive TCO calculator.",
};

export default function TcoCalculatorPage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Robot Total Cost of Ownership Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://robotomated.com/tools/tco-calculator",
          description:
            "Calculate the full 5-year total cost of robot ownership vs human labor including installation, maintenance, training, energy, and downtime costs.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />

      {/* Hero */}
      <section className="border-b border-border px-4 pb-8 pt-12">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools/tco-calculator" },
              { name: "TCO Calculator", href: "/tools/tco-calculator" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold text-text-primary sm:text-4xl">
            Total Cost of Ownership Calculator
          </h1>
          <p className="mt-3 font-mono text-sm text-text-tertiary">
            Compare the real cost of robots vs. manual labor over 5 years
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <TcoCalculatorClient />
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Methodology
          </h2>
          <h3 className="mt-2 text-xl font-bold text-text-primary">
            How we calculate TCO
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Robot Costs",
                items: [
                  "Purchase price",
                  "Installation (15-25%)",
                  "Annual maintenance (8-12%)",
                  "Training ($2-5K/operator)",
                  "Energy consumption",
                  "Downtime cost",
                  "Software/subscription fees",
                ],
              },
              {
                title: "Human Labor Costs",
                items: [
                  "Base hourly wage",
                  "Benefits & overhead (1.3x)",
                  "Annual turnover cost ($3-5K)",
                  "Overtime premiums",
                  "Workers comp insurance",
                  "Training/onboarding",
                  "Management overhead",
                ],
              },
              {
                title: "Comparison Output",
                items: [
                  "Year-by-year cost curves",
                  "Break-even point",
                  "5-year total savings",
                  "Per-unit cost reduction",
                  "Payback period",
                  "Shareable analysis URL",
                ],
              },
            ].map((col) => (
              <div
                key={col.title}
                className="rounded-md border border-border bg-obsidian-surface p-6"
              >
                <h4 className="font-semibold text-text-primary">{col.title}</h4>
                <ul className="mt-3 space-y-1.5">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-text-tertiary"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-electric-blue" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
