import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Free vs Pro | Robotomated",
  description:
    "Robotomated is free to browse. Pro unlocks unlimited AI conversations, advanced comparisons, TCO exports, and price alerts. $49/month with a 7-day free trial.",
};

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from your account page. You keep Pro until the end of your billing period.",
  },
  {
    question: "Do I need Pro to browse robots?",
    answer:
      "No. The entire database, every RoboScore, every review is free. Pro unlocks export, advanced comparison, and unlimited AI.",
  },
  {
    question: "What about certification?",
    answer:
      "Level 0 Awareness is free. Paid levels (Foundation through CRO) are separate purchases, not part of the Pro subscription.",
  },
  {
    question: "Is there an enterprise tier?",
    answer:
      "Coming soon. Contact us at enterprise@robotomated.com for custom pricing on team accounts and API access.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
      {/* ── HEADER ── */}
      <section className="px-4 pb-12 pt-20 text-center sm:px-6">
        <span className="font-[family-name:var(--font-brand)] text-[10px] uppercase tracking-[0.2em] text-[#2563EB]">
          [ PRICING ]
        </span>
        <h1
          className="mt-4 font-[family-name:var(--font-brand)] font-bold leading-tight"
          style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
        >
          Two tiers. No surprises.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          Robotomated is free to use. Pro unlocks the tools that make decisions
          easier.
        </p>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* FREE CARD */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-8">
            <h2 className="text-xl font-bold">Free</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-brand)] text-5xl font-bold">
                $0
              </span>
              <span className="text-muted">/forever</span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted">
              Browse every robot in our database. Read RoboScore breakdowns.
              Compare up to 2 robots side by side. Ask Robotimus 10 questions
              per month. Save robots to your watchlist. Start RCO Awareness
              certification for free. Post jobs on RoboWork. Everything you need
              to research.
            </p>

            <Link
              href="/explore"
              className="mt-8 inline-block rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-white/[0.04]"
            >
              Start Exploring
            </Link>
          </div>

          {/* PRO CARD */}
          <div className="rounded-2xl border border-[#2563EB]/20 bg-[#0D0D0D] p-8 shadow-lg shadow-[#2563EB]/5">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Pro</h2>
              <span className="rounded-full bg-[#2563EB]/10 px-3 py-0.5 text-xs font-semibold text-[#2563EB]">
                7-day free trial
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-brand)] text-5xl font-bold">
                $49
              </span>
              <span className="text-muted">/month</span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted">
              Everything in Free, plus: unlimited Robotimus conversations with
              full context memory. Compare up to 5 robots with exportable PDF
              reports. Full TCO calculator with 5-year projections you can share
              with your CFO. Price drop alerts on every robot in your watchlist.
              Early access to new robot listings before they&apos;re public.
              Ad-free experience across the entire site. Priority support.
            </p>

            <Link
              href="/pro"
              className="mt-8 inline-block rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB]/90"
            >
              Start Free Trial
            </Link>
            <p className="mt-3 text-xs text-muted">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* ── SHARED ACCESS STATEMENT ── */}
      <section className="px-4 pb-16 text-center sm:px-6">
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted">
          Both tiers get full access to the robotics intelligence feed,
          certification program, and RoboWork marketplace. Pro simply unlocks
          the power tools.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-white/[0.06] bg-[#0D0D0D]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
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
                <div className="border-t border-white/[0.06] px-5 py-4 text-sm text-muted">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
