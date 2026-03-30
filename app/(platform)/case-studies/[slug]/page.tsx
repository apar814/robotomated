import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCaseStudySlugs, getCaseStudy } from "@/lib/data/case-studies";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllCaseStudySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return { title: "Case Study Not Found" };
  return {
    title: cs.metaTitle,
    description: cs.metaDescription,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: { title: cs.metaTitle, description: cs.metaDescription, url: `https://robotomated.com/case-studies/${slug}`, type: "article" },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: cs.title,
        description: cs.metaDescription,
        url: `https://robotomated.com/case-studies/${slug}`,
        publisher: { "@type": "Organization", name: "Robotomated" },
        datePublished: "2026-03-29",
      }} />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-16 pt-12">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Case Studies", href: "/case-studies" },
            { name: cs.company, href: `/case-studies/${slug}` },
          ]} />
          <span className="mt-4 inline-block rounded-full bg-blue/10 px-4 py-1.5 text-xs font-semibold text-blue">
            {cs.industry}
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">
            {cs.title}
          </h1>
          <p className="mt-3 text-sm text-white/40">{cs.companyType}</p>

          {/* Key metrics */}
          <div className="mt-8 flex flex-wrap gap-4">
            {cs.results.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-4">
                <p className="font-mono text-2xl font-bold text-lime">{m.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-orange">The Problem</span>
          <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">What they were up against</h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">{cs.problem.summary}</p>
          <ul className="mt-6 space-y-3">
            {cs.problem.details.map((d, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/50">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue">The Solution</span>
          <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">What they deployed</h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">{cs.solution.summary}</p>
          <div className="mt-4 rounded-lg border border-white/[0.07] bg-white/[0.02] px-5 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Robot/System</span>
            <p className="mt-1 text-sm font-semibold text-white">{cs.solution.robots}</p>
          </div>
          <ul className="mt-6 space-y-3">
            {cs.solution.details.map((d, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/50">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── IMPLEMENTATION ── */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet">Implementation</span>
          <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
            How they did it ({cs.implementation.timeline})
          </h2>
          <div className="mt-8 space-y-4">
            {cs.implementation.phases.map((phase, i) => (
              <div key={i} className="flex gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet/10 font-mono text-sm font-bold text-violet">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-white">{phase.name}</h3>
                    <span className="font-mono text-xs text-white/30">{phase.duration}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/50">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-lime">Results</span>
          <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">What they achieved</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {cs.results.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                <p className="font-mono text-3xl font-bold text-lime">{m.value}</p>
                <p className="mt-1 text-sm font-semibold text-white">{m.label}</p>
                <p className="mt-1 text-xs text-white/40">{m.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-white/[0.07] bg-white/[0.02] px-5 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">Payback Period</span>
            <p className="mt-1 font-mono text-lg font-bold text-lime">{cs.results.paybackPeriod}</p>
          </div>

          {cs.results.quote && (
            <blockquote className="mt-8 rounded-xl border-l-2 border-blue bg-white/[0.02] px-6 py-5">
              <p className="text-base italic leading-relaxed text-white/60">&ldquo;{cs.results.quote.text}&rdquo;</p>
              <footer className="mt-3">
                <p className="text-sm font-semibold text-white">{cs.results.quote.author}</p>
                <p className="text-xs text-white/40">{cs.results.quote.role}</p>
              </footer>
            </blockquote>
          )}
        </div>
      </section>

      {/* ── LESSONS ── */}
      <section className="bg-[#0A0F1E] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-green">Lessons Learned</span>
          <h2 className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">Key takeaways</h2>
          <div className="mt-8 space-y-4">
            {cs.lessons.map((lesson, i) => (
              <div key={i} className="flex gap-4 rounded-lg border border-white/[0.05] bg-white/[0.02] px-5 py-4">
                <span className="mt-0.5 font-mono text-sm font-bold text-green">{i + 1}</span>
                <p className="text-sm leading-relaxed text-white/60">{lesson}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0F1628] px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue/[0.05] to-violet/[0.05] p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold text-white">
              Ready to get results like these?
            </h2>
            <p className="mt-3 text-base text-white/60">
              Find the right robot for your {cs.industry.toLowerCase()} operation.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href={`/explore/${cs.categorySlug}`} className="rounded-lg bg-electric-blue px-8 py-4 text-base font-bold text-black transition-shadow hover:shadow-[0_0_24px_rgba(14,165,233,0.35)]">
                Browse {cs.industry} Robots
              </Link>
              <Link href="/tools/robot-finder" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-4 text-base font-bold text-white/80 hover:border-white/20">
                Take the Robot Finder Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
