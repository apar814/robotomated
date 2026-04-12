import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { INDUSTRIES, classifyRobotType, getAllIndustrySlugs } from "@/lib/data/industry-types";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { PriceDisplay } from "@/components/ui/price-display";
import { SafeImage } from "@/components/ui/safe-image";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { JsonLd, FaqSchema } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { IndustryRoiCalculator } from "@/components/industries/industry-roi-calculator";
import { IndustryTypeFilter } from "@/components/industries/industry-type-filter";
import { IndustryNewsletterCta } from "@/components/industries/industry-newsletter-cta";
import { RobotFinderInlineLink } from "@/components/ui/robot-finder-cta";

interface Props { params: Promise<{ slug: string }> }

interface IndustryRobot {
  id: string; slug: string; name: string;
  description_short: string | null; description_long: string | null;
  price_current: number | null; robo_score: number | null;
  specs: Record<string, unknown> | null;
  images: { url: string; alt: string }[] | null;
  manufacturers: { name: string; slug: string } | null;
  robot_categories: { slug: string } | null;
}

export async function generateStaticParams() {
  return getAllIndustrySlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES[slug];
  if (!industry) return { title: "Industry Not Found" };
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `https://robotomated.com/industries/${slug}`,
      type: "article",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://robotomated.com/industries/${slug}`,
    },
  };
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = INDUSTRIES[slug];
  if (!industry) notFound();

  const supabase = createServerClient();

  // Get category ID
  const { data: category } = await supabase
    .from("robot_categories")
    .select("id, slug, name")
    .eq("slug", industry.categorySlug)
    .single();

  // Allow page to render even without matching DB category (new verticals may not have categories yet)
  const catSlug = category?.slug || industry.categorySlug;

  let allRobots: IndustryRobot[] = [];
  if (category) {
    const { data: robots } = await supabase
      .from("robots")
      .select("id, slug, name, description_short, description_long, price_current, robo_score, specs, images, manufacturers(name, slug), robot_categories(slug)")
      .eq("category_id", category.id)
      .eq("status", "active")
      .order("robo_score", { ascending: false, nullsFirst: false })
      .returns<IndustryRobot[]>();
    allRobots = robots || [];
  }

  // Classify each robot into a type
  const robotsByType: Record<string, IndustryRobot[]> = {};
  for (const type of industry.types) {
    robotsByType[type.id] = [];
  }

  for (const robot of allRobots) {
    const typeId = classifyRobotType(industry, robot);
    if (robotsByType[typeId]) {
      robotsByType[typeId].push(robot);
    } else {
      const firstType = industry.types[0]?.id;
      if (firstType && robotsByType[firstType]) {
        robotsByType[firstType].push(robot);
      }
    }
  }

  // Build type counts for tab labels
  const typeCounts: Record<string, number> = {};
  for (const [typeId, typeRobots] of Object.entries(robotsByType)) {
    typeCounts[typeId] = typeRobots.length;
  }

  return (
    <div>
      {/* Schema.org */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: industry.heroTitle,
        description: industry.metaDescription,
        url: `https://robotomated.com/industries/${slug}`,
        publisher: { "@type": "Organization", name: "Robotomated" },
        datePublished: "2026-01-15",
        dateModified: "2026-03-29",
      }} />
      {allRobots.length > 0 && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${industry.name} Robots`,
          numberOfItems: allRobots.length,
          itemListElement: allRobots.slice(0, 10).map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.name,
            url: `https://robotomated.com/explore/${catSlug}/${r.slug}`,
          })),
        }} />
      )}
      <FaqSchema items={industry.faqs} />

      {/* -- HERO -- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0F1E] to-[#0F1628] px-4 pb-16 pt-12">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Industries", href: "/industries" },
            { name: industry.name, href: `/industries/${slug}` },
          ]} />
          <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl">
            {industry.heroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-white/60">
            {industry.heroSubtitle.replace("[N]", String(allRobots.length))}
          </p>
          <div className="mt-4">
            <RobotFinderInlineLink industry={industry.categorySlug} />
          </div>

          {/* Market stats */}
          <div className="mt-8 flex flex-wrap gap-4">
            {industry.marketStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-4">
                <p className="font-mono text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[11px] uppercase tracking-widest text-blue">{stat.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- TYPE NAVIGATION (client component for filtering) -- */}
      {allRobots.length > 0 && (
        <IndustryTypeFilter
          types={industry.types}
          typeCounts={typeCounts}
        />
      )}

      {/* -- ROBOT SECTIONS (SSR) -- */}
      {allRobots.length > 0 ? (
        <div id="robot-sections" className="bg-[#0A0F1E]">
          {industry.types.map((type) => {
            const typeRobots = robotsByType[type.id] || [];
            if (typeRobots.length === 0) return null;
            return (
              <section key={type.id} id={`type-${type.id}`} className="scroll-mt-32 border-t border-white/[0.05] px-4 py-16">
                <div className="mx-auto max-w-6xl">
                  <RevealOnScroll>
                    <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">{type.label}</h2>
                    <p className="mt-1 text-sm text-white/50">{type.description}</p>
                  </RevealOnScroll>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {typeRobots.slice(0, 6).map((robot, i) => (
                      <RevealOnScroll key={robot.id} delay={Math.min(i, 2) as 0 | 1 | 2}>
                        <RobotCard robot={robot} categorySlug={catSlug} />
                      </RevealOnScroll>
                    ))}
                  </div>
                  {typeRobots.length > 6 && (
                    <div className="mt-6">
                      <Link href={`/explore/${catSlug}`} className="text-sm text-blue hover:underline">
                        View all {typeRobots.length} {type.label.toLowerCase()} robots &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section className="bg-[#0A0F1E] px-4 py-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-lg text-white/40">Robot listings for {industry.name.toLowerCase()} are coming soon.</p>
            <p className="mt-2 text-sm text-white/50">Subscribe below to be notified when we add robots for this industry.</p>
          </div>
        </section>
      )}

      {/* -- ROI CALCULATOR -- */}
      <section id="roi" className="scroll-mt-24 bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">ROI Calculator</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              {"What's your return?"}
            </h2>
            <p className="mt-2 max-w-lg text-base leading-[1.7] text-white/[0.65]">
              Estimate your ROI from {industry.name.toLowerCase()} based on your operation.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={1} className="mt-8">
            <IndustryRoiCalculator type={industry.calculatorInputs} />
          </RevealOnScroll>
        </div>
      </section>

      {/* -- BUYER GUIDE -- */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">Buyer{"'"}s Guide</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              How to choose the right robot
            </h2>
          </RevealOnScroll>
          <div className="mt-8 space-y-6">
            {industry.buyerGuide.map((section, i) => (
              <RevealOnScroll key={i}>
                <details className="group rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-white">
                    <h3 className="font-semibold">{section.heading}</h3>
                    <svg className="h-5 w-5 shrink-0 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="border-t border-white/[0.05] px-6 py-4">
                    <p className="text-sm leading-[1.8] text-white/60">{section.content}</p>
                  </div>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* -- COMPLIANCE & REGULATIONS -- */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">Compliance</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              Regulations & certifications
            </h2>
            <p className="mt-2 max-w-lg text-base leading-[1.7] text-white/[0.65]">
              Key compliance requirements for {industry.name.toLowerCase()} deployments.
            </p>
          </RevealOnScroll>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {industry.compliance.map((item, i) => (
              <RevealOnScroll key={i} delay={Math.min(i, 2) as 0 | 1 | 2}>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${item.required ? "bg-blue/20 text-blue" : "bg-white/10 text-white/40"}`}>
                      {item.required ? "\u2713" : "\u25CB"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <span className={`mt-0.5 inline-block text-[10px] uppercase tracking-wider ${item.required ? "text-blue" : "text-white/50"}`}>
                        {item.required ? "Required" : "Recommended"}
                      </span>
                      <p className="mt-1.5 text-sm leading-[1.7] text-white/50">{item.description}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* -- CASE STUDIES -- */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">Case Studies</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              Real-world deployments
            </h2>
            <p className="mt-2 max-w-lg text-base leading-[1.7] text-white/[0.65]">
              How leading organizations are deploying {industry.name.toLowerCase()}.
            </p>
          </RevealOnScroll>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {industry.caseStudies.map((cs, i) => (
              <RevealOnScroll key={i} delay={Math.min(i, 2) as 0 | 1 | 2}>
                <div className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-6">
                  <div className="mb-4">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-blue">{cs.industry}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">{cs.company}</h3>
                  </div>
                  <div className="mb-4 space-y-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">Challenge</p>
                      <p className="mt-0.5 text-sm leading-[1.6] text-white/50">{cs.challenge}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">Solution</p>
                      <p className="mt-0.5 text-sm leading-[1.6] text-white/50">{cs.solution}</p>
                    </div>
                  </div>
                  <div className="mt-auto grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-4">
                    {cs.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <p className="font-mono text-sm font-bold text-green">{m.value}</p>
                        <p className="mt-0.5 text-[9px] uppercase tracking-wider text-white/50">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ -- */}
      <section id="faq" className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">FAQ</span>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              Frequently asked questions
            </h2>
          </RevealOnScroll>
          <div className="mt-8 space-y-4">
            {industry.faqs.map((faq, i) => (
              <RevealOnScroll key={i}>
                <details className="group rounded-xl border border-white/[0.07] bg-white/[0.02]">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-white">
                    <h3 className="pr-4 font-medium">{faq.question}</h3>
                    <svg className="h-5 w-5 shrink-0 text-white/40 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="border-t border-white/[0.05] px-6 py-4">
                    <p className="text-sm leading-[1.8] text-white/60">{faq.answer}</p>
                  </div>
                </details>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* -- NEWSLETTER CTA -- */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <IndustryNewsletterCta industryLabel={industry.newsletterLabel} />
          </RevealOnScroll>
        </div>
      </section>

      {/* -- CTA -- */}
      <section className="bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue/[0.05] to-violet/[0.05] p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">{industry.ctaText}</h2>
              <p className="mt-3 text-base text-white/60">
                {allRobots.length > 0
                  ? `Browse all ${allRobots.length} robots in ${industry.name.toLowerCase()} with specs, scores, and pricing.`
                  : `Explore ${industry.name.toLowerCase()} — new robots added regularly.`}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href={`/explore/${catSlug}`} className="rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90">Browse {industry.name}</Link>
                <Link href="/advisor" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-3 text-sm font-semibold text-white/80 hover:border-white/20">Ask Robotimus</Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

// --- Robot Card ---
function RobotCard({ robot, categorySlug }: { robot: IndustryRobot; categorySlug: string }) {
  const imgs = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];
  const realImg = imgs[0]?.url && !imgs[0].url.includes("unsplash") ? imgs[0].url : null;
  const mfr = robot.manufacturers?.name || "";

  return (
    <Link href={`/explore/${categorySlug}/${robot.slug}`} className="group block overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-blue/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <div className="relative h-36 bg-white/[0.03]">
        {realImg ? (
          <SafeImage src={realImg} alt={robot.name} sizes="33vw" className="object-cover" fallbackLabel={mfr} fallbackSublabel={robot.name} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.04] text-center">
            <span className="text-[10px] text-white/45">{mfr}</span>
            <span className="text-xs font-semibold text-white/50">{robot.name}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] text-white/50">{mfr}</p>
        <h3 className="font-semibold text-white transition-colors group-hover:text-blue">{robot.name}</h3>
        {robot.description_short && (
          <p className="mt-1 line-clamp-2 text-xs text-white/40">{robot.description_short}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <PriceDisplay price={robot.price_current} size="sm" />
          {robot.robo_score != null && robot.robo_score > 0 && <RoboScoreBadge score={robot.robo_score} />}
        </div>
      </div>
    </Link>
  );
}
