import type { Metadata } from "next";
import Link from "next/link";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Case Studies — Real-World Robot Deployments",
  description: "See how companies across warehouse, medical, manufacturing, agriculture, construction, and delivery deploy robots with measurable ROI. Real data, real results.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-16 pt-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Case Studies", href: "/case-studies" },
          ]} />
          <p className="mt-6 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">[ CASE STUDIES ]</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            Real-World Robot Deployments
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-white/60">
            How companies across every industry deploy robots with measurable ROI. Real data. Real results. No vendor marketing.
          </p>
        </div>
      </section>

      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDIES.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
              >
                <div className="px-6 pb-6 pt-5">
                  <span className="inline-block rounded-full bg-white/10 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] font-semibold text-white">
                    {cs.industry}
                  </span>
                  <h2 className="mt-3 font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-white">
                    {cs.title}
                  </h2>
                  <p className="mt-2 text-xs text-white/40">{cs.companyType}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {cs.results.metrics.slice(0, 2).map((m) => (
                      <div key={m.label}>
                        <p className="font-[family-name:var(--font-brand)] text-lg font-bold text-white">{m.value}</p>
                        <p className="font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] text-white/50">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <span className="mt-4 inline-block text-xs font-semibold text-white">
                    Read case study &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
