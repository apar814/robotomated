import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProblemSlugs, getProblem } from "@/lib/data/problems";
import { JsonLd, FaqSchema } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllProblemSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) return { title: "Problem Not Found" };
  return {
    title: problem.metaTitle,
    description: problem.metaDescription,
    alternates: { canonical: `/problems/${slug}` },
    openGraph: {
      title: problem.metaTitle,
      description: problem.metaDescription,
      url: `https://robotomated.com/problems/${slug}`,
      type: "article",
    },
  };
}

export default async function ProblemPage({ params }: Props) {
  const { slug } = await params;
  const problem = getProblem(slug);
  if (!problem) notFound();

  return (
    <div>
      {/* Schema.org */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: problem.metaTitle,
        description: problem.metaDescription,
        url: `https://robotomated.com/problems/${slug}`,
        publisher: { "@type": "Organization", name: "Robotomated" },
        datePublished: "2026-03-29",
        dateModified: "2026-03-29",
      }} />
      <FaqSchema items={problem.faqs} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-16 pt-12">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: problem.industry, href: `/industries/${problem.industrySlug}` },
            { name: problem.title, href: `/problems/${slug}` },
          ]} />

          <div className="mt-4 inline-block rounded-full border border-orange/20 bg-orange/5 px-4 py-1.5">
            <span className="text-xs font-semibold text-orange">{problem.industry}</span>
          </div>

          <h1 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            {problem.heroStatement}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
            {problem.heroSubtext}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/tools/robot-finder?industry=${problem.wizardPresets.industry}&useCase=${problem.wizardPresets.useCase}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-bold text-black transition-shadow hover:shadow-[0_0_24px_rgba(37,99,235,0.35)]"
            >
              Find Your Solution
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`/explore/${problem.categorySlug}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-4 text-base font-bold text-white/80 hover:border-white/20"
            >
              Browse {problem.industry} Robots
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRENDS: Why this is getting worse ── */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-orange">The Trend</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {problem.trends.heading}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {problem.trends.points.map((point, i) => (
              <div key={i} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
                <p className="font-mono text-3xl font-bold text-orange">{point.stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW AUTOMATION SOLVES IT ── */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-white">The Solution</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            {problem.automationSolution.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
            {problem.automationSolution.description}
          </p>
          <div className="mt-10 space-y-4">
            {problem.automationSolution.benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 font-mono text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{benefit.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/50">{benefit.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROBOT CATEGORIES ── */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-green">Robot Categories</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            Which robots address this?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {problem.robotCategories.map((cat) => (
              <Link
                key={cat.slug + cat.name}
                href={`/explore/${cat.slug}`}
                className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-white/20"
              >
                <h3 className="font-semibold text-white transition-colors group-hover:text-white">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{cat.description}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-white">
                  Browse robots &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI DATA ── */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-white">ROI Data</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            What does the data say?
          </h2>

          {/* Big metrics */}
          <div className="mt-10 flex flex-wrap gap-4">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-8 py-6">
              <p className="font-mono text-3xl font-bold text-white">{problem.roi.paybackMonths}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">Months to Payback</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-8 py-6">
              <p className="font-mono text-3xl font-bold text-white">{problem.roi.costReduction}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">Cost Reduction</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-8 py-6">
              <p className="font-mono text-3xl font-bold text-white">{problem.roi.productivityGain}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">Productivity Gain</p>
            </div>
          </div>

          {/* Detailed stats */}
          <div className="mt-8 space-y-3">
            {problem.roi.stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] px-5 py-3">
                <span className="text-sm text-white/60">{stat.label}</span>
                <div className="text-right">
                  <span className="font-mono text-sm font-semibold text-white">{stat.value}</span>
                  <p className="text-[13px] text-white/50">{stat.source}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/tools/tco-calculator"
              className="text-sm font-semibold text-white hover:underline"
            >
              Calculate your exact ROI with our TCO tool &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-[13px] font-semibold uppercase tracking-widest text-violet">FAQ</span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
            Common questions
          </h2>
          <div className="mt-8 space-y-4">
            {problem.faqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-white">
                  <h3 className="pr-4 font-medium">{faq.question}</h3>
                  <svg className="h-5 w-5 shrink-0 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="border-t border-white/[0.05] px-6 py-4">
                  <p className="text-sm leading-[1.8] text-white/60">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue/[0.05] to-violet/[0.05] p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold text-white">
              Ready to solve {problem.title.toLowerCase()}?
            </h2>
            <p className="mt-3 text-base text-white/60">
              Our Robot Finder matches your industry and use case to the right automation solution in 5 minutes.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/tools/robot-finder?industry=${problem.wizardPresets.industry}&useCase=${problem.wizardPresets.useCase}`}
                className="rounded-lg bg-white px-8 py-4 text-base font-bold text-black transition-shadow hover:shadow-[0_0_24px_rgba(37,99,235,0.35)]"
              >
                Find Your Solution &rarr;
              </Link>
              <Link
                href="/advisor"
                className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-4 text-base font-bold text-white/80 hover:border-white/20"
              >
                Ask Robotimus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
