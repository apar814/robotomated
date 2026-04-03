import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InsuranceQuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Robot Insurance — Protect Your Investment | Robotomated",
  description:
    "Comprehensive robot insurance coverage including all-risk, liability, business interruption, and cyber protection. Get quotes from top insurers.",
};

const COVERAGE_TYPES = [
  {
    name: "All-Risk Property",
    description:
      "Covers physical damage from any cause including accidents, fire, theft, and natural disasters. Includes replacement cost coverage.",
    avgPremium: "1.5-3% of value/yr",
  },
  {
    name: "General Liability",
    description:
      "Protection against third-party bodily injury or property damage claims caused by your robot during normal operations.",
    avgPremium: "$2,000-$8,000/yr",
  },
  {
    name: "Business Interruption",
    description:
      "Covers lost revenue and extra expenses when robot downtime halts your production or operations.",
    avgPremium: "0.5-1.5% of revenue/yr",
  },
  {
    name: "Operator Liability",
    description:
      "Protects against claims of injury to workers operating or working alongside robotic systems.",
    avgPremium: "$3,000-$12,000/yr",
  },
  {
    name: "Cyber & Data",
    description:
      "Covers costs from cyber attacks, data breaches, ransomware, and unauthorized access to robot control systems.",
    avgPremium: "$1,500-$6,000/yr",
  },
  {
    name: "Product Liability",
    description:
      "For manufacturers and integrators: covers claims from defects in robots you build, modify, or deploy for clients.",
    avgPremium: "Varies by risk",
  },
] as const;

export default function InsurePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Insurance", href: "/insure" },
        ]}
      />

      <section className="mt-8 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Your $500K robot deserves $500K protection.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Compare robot insurance from leading carriers. Coverage for every
          deployment -- from a single cobot to a fleet of industrial arms.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-white">
          Coverage Types
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COVERAGE_TYPES.map((type) => (
            <div
              key={type.name}
              className="glass rounded-xl border border-white/10 p-6"
            >
              <h3 className="font-display text-lg font-semibold text-white">
                {type.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{type.description}</p>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs text-muted">Average Premium</p>
                <p className="font-display text-sm font-semibold text-[#00C2FF]">
                  {type.avgPremium}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="glass rounded-2xl border border-white/10 p-8">
          <h2 className="font-display text-xl font-semibold text-white">
            Average Annual Premiums by Robot Value
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 font-display font-semibold text-muted">
                    Robot Value
                  </th>
                  <th className="pb-3 font-display font-semibold text-muted">
                    All-Risk
                  </th>
                  <th className="pb-3 font-display font-semibold text-muted">
                    Liability
                  </th>
                  <th className="pb-3 font-display font-semibold text-muted">
                    Comprehensive
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="border-b border-white/5">
                  <td className="py-3 text-muted">$25,000 - $50,000</td>
                  <td className="py-3">$375 - $1,500</td>
                  <td className="py-3">$2,000 - $4,000</td>
                  <td className="py-3">$3,000 - $6,000</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-muted">$50,000 - $150,000</td>
                  <td className="py-3">$750 - $4,500</td>
                  <td className="py-3">$3,000 - $8,000</td>
                  <td className="py-3">$5,000 - $14,000</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 text-muted">$150,000 - $500,000</td>
                  <td className="py-3">$2,250 - $15,000</td>
                  <td className="py-3">$5,000 - $12,000</td>
                  <td className="py-3">$10,000 - $30,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-muted">$500,000+</td>
                  <td className="py-3">$7,500+</td>
                  <td className="py-3">$8,000+</td>
                  <td className="py-3">$20,000+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="quote" className="mt-20">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-white">
            Get Insurance Quotes
          </h2>
          <p className="mt-2 text-muted">
            Tell us about your robot and coverage needs. We will connect you
            with insurers who specialize in robotic systems.
          </p>
          <div className="mt-8">
            <InsuranceQuoteForm coverageTypes={COVERAGE_TYPES.map((t) => t.name)} />
          </div>
        </div>
      </section>
    </main>
  );
}
