import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { FoundingRspForm } from "@/components/robowork/founding-rsp-form";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Founding Robot Service Provider — Robotomated",
  description:
    "Apply to become one of 100 founding Robot Service Providers on the world's first RaaS marketplace. Free certification, reduced fees, and permanent founding status.",
  openGraph: {
    title: "Founding Robot Service Provider — Robotomated",
    description:
      "We're selecting 100 founding RSPs to launch the world's first RaaS marketplace. Free certification, reduced fees, and permanent founding status.",
    url: "https://robotomated.com/robowork/founding-rsp",
    type: "website",
  },
};

const PERKS = [
  {
    number: "01",
    title: "Free RCO Foundation Certification",
    value: "$149 value",
  },
  {
    number: "02",
    title: "Free Background Check",
    value: "$29.99 value",
  },
  {
    number: "03",
    title: 'Permanent "Founding RSP" Badge',
    value: "Lifetime distinction",
  },
  {
    number: "04",
    title: "Priority Placement in Search Results",
    value: "More visibility, more jobs",
  },
  {
    number: "05",
    title: "Reduced Platform Fee: 8% vs 12%",
    value: "First 12 months",
  },
  {
    number: "06",
    title: "Direct Line to Founding Team",
    value: "Slack channel + monthly calls",
  },
  {
    number: "07",
    title: "Input on Product Roadmap",
    value: "Shape the marketplace you'll operate in",
  },
] as const;

const REQUIREMENTS = [
  "At least 1 operational robot",
  "Liability insurance coverage",
  "Identity verification for all operators",
  "Complete your first job within 60 days of acceptance",
];

export default async function FoundingRspPage() {
  const supabase = createServerClient();

  // Query approved applications to calculate remaining spots
  const { count } = await (supabase as any)
    .from("founding_rsp_applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");

  const spotsRemaining = 100 - (count || 0);

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Founding Robot Service Provider — Robotomated",
          description:
            "Apply to become one of 100 founding Robot Service Providers on the world's first RaaS marketplace.",
          url: "https://robotomated.com/robowork/founding-rsp",
          publisher: { "@type": "Organization", name: "Robotomated" },
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/[0.03] to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 px-4 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B]">
              Founding Program — Limited to 100
            </span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
            Founding Robot{" "}
            <span className="text-electric-blue">Service Provider</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
            We&apos;re selecting 100 founding RSPs to launch the world&apos;s
            first RaaS marketplace.
          </p>
        </div>
      </section>

      {/* ── SPOTS REMAINING ── */}
      <section className="border-b border-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-6 py-5 text-center">
            <p className="font-mono text-3xl font-extrabold text-[#F59E0B]">
              {spotsRemaining}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              of 100 spots remaining
            </p>
          </div>
        </div>
      </section>

      {/* ── PERKS ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              What You Get
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERKS.map((perk) => (
              <div
                key={perk.number}
                className="rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:-translate-y-0.5 hover:border-border-active"
              >
                <span className="mb-3 inline-block font-mono text-2xl font-extrabold text-[#F59E0B]">
                  {perk.number}
                </span>
                <h3 className="text-sm font-bold text-text-primary">
                  {perk.title}
                </h3>
                <p className="mt-1 text-xs text-text-secondary">
                  {perk.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Requirements
            </span>
          </div>

          <div className="rounded-lg border border-border bg-obsidian-surface p-6">
            <ul className="space-y-3">
              {REQUIREMENTS.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric-blue/10 text-[10px] text-electric-blue">
                    &#10003;
                  </span>
                  <span className="text-sm text-text-secondary">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Apply Now
            </span>
          </div>

          <FoundingRspForm />
        </div>
      </section>
    </div>
  );
}
