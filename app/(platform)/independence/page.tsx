import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Stay Independent | Robotomated",
  description:
    "No manufacturer pays for scores or placement. Our revenue comes from Pro subscriptions and RoboWork fees. Our scoring methodology is public. Our editorial independence is non-negotiable.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "No pay-for-play. Ever.",
    body: "No manufacturer has ever paid for a RoboScore, search placement, or favorable review. Every score is earned through our transparent, repeatable methodology. If a manufacturer offered us $1 million to change a score, we would refuse and publish the offer.",
  },
  {
    number: "02",
    title: "No affiliate commissions on purchases.",
    body: "We do not earn commissions when you buy a robot through our links. Our revenue comes from Pro subscriptions and RoboWork marketplace fees. This means our recommendations are never influenced by which robot pays us more — because none of them pay us.",
  },
  {
    number: "03",
    title: "Public methodology.",
    body: "Our entire scoring methodology is published at /methodology. You can see exactly how we weight Performance (25%), Reliability (20%), Ease of Use (15%), Intelligence (15%), Value (10%), Ecosystem (8%), Safety (5%), and Design (2%). No black boxes.",
  },
  {
    number: "04",
    title: "Any manufacturer can challenge a score.",
    body: "If a manufacturer believes their robot's RoboScore is inaccurate, they can submit a formal challenge with supporting data. We will re-evaluate the score using our published methodology and publish the result — whether it goes up, down, or stays the same.",
  },
  {
    number: "05",
    title: "Revenue model transparency.",
    body: "We make money from: Pro subscriptions ($49/month), Enterprise accounts ($299-$2,499/month), and RoboWork marketplace fees (8-15% of job value). That's it. We will never sacrifice editorial independence for revenue. Our independence is our moat.",
  },
];

export default function IndependencePage() {
  return (
    <div style={{ background: "var(--theme-bg)" }}>
      {/* Hero */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-4 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em]"
            style={{ color: "#D4D4D4" }}
          >
            Our Promise
          </p>
          <h1
            className="font-display font-bold"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              color: "var(--theme-text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            How We Stay Independent
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            The robotics industry is full of manufacturer-funded &ldquo;reviews&rdquo;
            and pay-for-placement marketplaces. Robotomated exists because buyers
            deserve better. Here is exactly how we maintain editorial independence.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t px-6 py-20" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto max-w-4xl space-y-12">
          {PRINCIPLES.map((p) => (
            <div
              key={p.number}
              className="rounded-xl p-8"
              style={{
                background: "var(--theme-card)",
                border: "1px solid var(--theme-card-border, var(--theme-border))",
                boxShadow: "var(--theme-card-shadow)",
              }}
            >
              <div className="flex items-start gap-6">
                <span
                  className="shrink-0 font-[family-name:var(--font-brand)] text-2xl font-bold"
                  style={{ color: "#D4D4D4" }}
                >
                  {p.number}
                </span>
                <div>
                  <h2
                    className="font-display text-xl font-bold"
                    style={{ color: "var(--theme-text-primary)" }}
                  >
                    {p.title}
                  </h2>
                  <p
                    className="mt-3 text-[0.95rem] leading-relaxed"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="border-t px-6 py-16"
        style={{ borderColor: "var(--theme-border)", background: "var(--theme-section-alt)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Want to understand how we score robots?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/methodology"
              className="btn-glow inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
            >
              Read Our Methodology
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border px-7 py-3.5 text-sm font-semibold transition-colors hover:border-white/20"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-primary)",
              }}
            >
              About Robotomated
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
