import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreRing, RoboScoreBadge } from "@/components/ui/robo-score";
import { PriceDisplay } from "@/components/ui/price-display";
import { PriceChart } from "@/components/robots/price-chart";
import { PriceComparison } from "@/components/commerce/price-comparison";
import { AffiliateDisclosureInline } from "@/components/commerce/affiliate-disclosure";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ProductSchema, ReviewSchema } from "@/components/seo/json-ld";
import { ExpertReviewCard } from "@/components/reviews/expert-review-card";
import { CommunityReviewCard } from "@/components/reviews/community-review-card";
import { CommunityReviewForm } from "@/components/reviews/community-review-form";
import { AskAiButton } from "@/components/advisor/ask-ai-button";
import { SaveRobotButton } from "@/components/auth/save-robot-button";
import { CompanyLogo } from "@/components/ui/company-logo";
import { RoiCalculatorStandalone } from "@/components/robots/roi-calculator-standalone";
import { DIMENSIONS } from "@/lib/scoring/roboscore";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { SafeImage } from "@/components/ui/safe-image";
import { AddToCompareButton } from "@/components/compare/add-to-compare-button";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { PriceAlertForm } from "@/components/commerce/price-alert-form";
import { SPEC_ICON_MAP } from "@/components/robots/spec-icon";

const YEAR = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RobotDetail {
  id: string; slug: string; name: string; manufacturer_id: string; category_id: string;
  model_number: string | null; year_released: number | null;
  price_msrp: number | null; price_current: number | null;
  description_short: string | null; description_long: string | null;
  specs: Record<string, unknown>; images: { url: string; alt: string }[];
  robo_score: number | null; score_breakdown: RoboScoreBreakdown | null;
  affiliate_url: string | null; amazon_asin: string | null; status: string;
  created_at: string; updated_at: string;
  manufacturers: { name: string; slug: string; country: string | null; website: string | null };
  robot_categories: { name: string; slug: string };
}

interface ReviewRow {
  id: string; review_type: string; title: string; body: string;
  robo_score: number | null; score_breakdown: RoboScoreBreakdown | null;
  pros: string[]; cons: string[]; verdict: string | null;
  verified_purchase: boolean; published_at: string | null;
  users: { name: string | null } | null;
}

interface PricePoint { recorded_at: string; price: number; retailer: string }

interface SimilarRobot {
  id: string; slug: string; name: string; robo_score: number | null;
  price_current: number | null; description_short: string | null;
  images: { url: string; alt: string }[] | null;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string } | null;
}

interface Props { params: Promise<{ category: string; slug: string }> }

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("robots").select("name, description_short, robo_score, price_current, manufacturers(name)")
    .eq("slug", slug).single().returns<{ name: string; description_short: string | null; robo_score: number | null; price_current: number | null; manufacturers: { name: string } }>();
  if (!data) return { title: "Robot Not Found" };
  const priceStr = data.price_current ? `$${data.price_current.toLocaleString()}` : "Contact for pricing";
  const scoreStr = data.robo_score ? `RoboScore ${data.robo_score.toFixed(1)}/100` : "";
  return {
    title: `${data.name} Review & ROI Calculator (${YEAR}) | Robotomated`,
    description: `${data.name} by ${data.manufacturers?.name} — ${scoreStr}. ${priceStr}. ${data.description_short || "Expert review, specs, ROI calculator, and pricing."}`,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function RobotDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const supabase = createServerClient();

  const { data: robot } = await supabase.from("robots")
    .select("*, manufacturers(name, slug, country, website), robot_categories(name, slug)")
    .eq("slug", slug).single().returns<RobotDetail>();
  if (!robot) notFound();

  const [{ data: reviews }, { data: priceHistory }, { data: similarData }] = await Promise.all([
    supabase.from("reviews").select("id, review_type, title, body, robo_score, score_breakdown, pros, cons, verdict, verified_purchase, published_at, users(name)")
      .eq("robot_id", robot.id).not("published_at", "is", null).order("published_at", { ascending: false }).returns<ReviewRow[]>(),
    supabase.from("price_history").select("recorded_at, price, retailer")
      .eq("robot_id", robot.id).order("recorded_at", { ascending: true }).returns<PricePoint[]>(),
    supabase.from("robots").select("id, slug, name, robo_score, price_current, description_short, images, manufacturers(name), robot_categories(slug)")
      .eq("category_id", robot.category_id).neq("id", robot.id).eq("status", "active")
      .order("robo_score", { ascending: false, nullsFirst: false }).limit(3).returns<SimilarRobot[]>(),
  ]);

  const breakdown = robot.score_breakdown as RoboScoreBreakdown | null;
  const specs = robot.specs as Record<string, unknown>;
  const robotImages = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];
  const mfr = robot.manufacturers;
  const cat = robot.robot_categories;
  const expertReviews = (reviews || []).filter((r) => r.review_type === "expert");
  const communityReviews = (reviews || []).filter((r) => r.review_type === "community");
  const similar = similarData || [];

  const hasRealImage = robotImages.length > 0 && robotImages[0].url && !robotImages[0].url.includes("unsplash");

  // Build key specs for icon highlight section
  const keySpecs = buildKeySpecs(specs);

  // Build alternating feature sections from use-case data
  const featureSections = buildFeatureSections(specs, cat?.name || "", robot.name);

  // Spec grouping for full specs table
  const specGroups = groupSpecs(specs);

  function fmtPrice(p: number): string {
    if (p >= 1000000) return `$${(p / 1000000).toFixed(1)}M`;
    return `$${p.toLocaleString()}`;
  }

  return (
    <div>
      <AskAiButton robotName={robot.name} />
      <ProductSchema name={robot.name} slug={robot.slug} description={robot.description_short || ""} manufacturer={mfr?.name || ""} price={robot.price_current} score={robot.robo_score} categorySlug={categorySlug} model={robot.model_number} status={robot.status} />
      {expertReviews[0] && <ReviewSchema robotName={robot.name} reviewTitle={expertReviews[0].title} reviewBody={expertReviews[0].body.slice(0, 200)} author="Robotomated Editorial" score={expertReviews[0].robo_score} publishedAt={expertReviews[0].published_at} />}

      {/* ── STICKY NAV ── */}
      <nav className="sticky top-[57px] z-20 hidden border-b border-white/[0.07] bg-[#0A0F1E]/95 backdrop-blur-sm md:block">
        <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-6">
          {[
            { id: "overview", label: "Overview" },
            ...(keySpecs.length >= 3 ? [{ id: "specs-highlight", label: "Key Specs" }] : []),
            { id: "roi", label: "ROI Calculator" },
            ...(breakdown ? [{ id: "score", label: "RoboScore" }] : []),
            { id: "specs", label: "Full Specs" },
            ...(expertReviews.length > 0 ? [{ id: "reviews", label: "Reviews" }] : []),
            { id: "buy", label: "Pricing" },
            ...(similar.length > 0 ? [{ id: "similar", label: "Alternatives" }] : []),
          ].map((s) => (
            <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-[11px] uppercase tracking-wider text-white/40 transition-colors hover:border-blue hover:text-white/80">{s.label}</a>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
          ══════════════════════════════════════════════ */}
      <section id="overview" className="relative flex min-h-[85vh] flex-col justify-end overflow-hidden md:min-h-[85vh]" style={{ minHeight: "clamp(500px, 85vh, 1000px)" }}>
        {/* Background */}
        {hasRealImage ? (
          <>
            <div className="absolute inset-0">
              <SafeImage
                src={robotImages[0].url}
                alt={robotImages[0].alt || robot.name}
                sizes="100vw"
                className="object-cover object-center"
                priority
                fallbackLabel={mfr?.name}
                fallbackSublabel={robot.name}
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(10,15,30,0.3) 0%, rgba(10,15,30,0.5) 50%, rgba(10,15,30,0.95) 100%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] to-[#141C33]">
            {/* Large faded manufacturer name as background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <span className="select-none whitespace-nowrap text-[clamp(80px,15vw,200px)] font-extrabold uppercase tracking-wider text-white/[0.03]">
                {mfr?.name}
              </span>
            </div>
          </div>
        )}

        {/* Breadcrumbs over hero */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-6">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Browse", href: "/explore" }, { name: cat?.name || "", href: `/explore/${categorySlug}` }, { name: robot.name, href: `/explore/${categorySlug}/${robot.slug}` }]} />
        </div>

        {/* Hero content — centered at bottom */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
          {/* Manufacturer */}
          <span className="text-[11px] font-medium uppercase tracking-widest text-white/50">
            {mfr?.name}
          </span>

          {/* Robot name */}
          <h1 className="mt-2 font-display font-extrabold leading-[1.05] tracking-[-0.03em] text-white" style={{ fontSize: "clamp(36px, 5vw, 64px)" }}>
            {robot.name}
          </h1>

          {/* Short description */}
          {robot.description_short && (
            <p className="mt-3 max-w-[500px] text-base leading-relaxed text-white/60">
              {robot.description_short}
            </p>
          )}

          {/* Stat pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {robot.price_current != null && (
              <HeroPill label="Price" value={fmtPrice(robot.price_current)} />
            )}
            {robot.robo_score != null && robot.robo_score > 0 && (
              <HeroPill label="RoboScore" value={robot.robo_score.toFixed(1)} />
            )}
            {specs.payload_kg != null && <HeroPill label="Payload" value={`${String(specs.payload_kg)}kg`} />}
            {specs.battery_hrs != null && <HeroPill label="Battery" value={`${String(specs.battery_hrs)}h`} />}
            {specs.max_speed != null && <HeroPill label="Speed" value={String(specs.max_speed)} />}
            {specs.reach_mm != null && <HeroPill label="Reach" value={`${String(specs.reach_mm)}mm`} />}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {(robot.affiliate_url || mfr?.website) ? (
              <a href={`/api/out/${robot.slug}?ref=product-page&pos=hero-cta`} target="_blank" rel="sponsored noopener noreferrer" className="rounded-lg bg-blue px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Get Quote
              </a>
            ) : null}
            <Link href="/advisor" className="rounded-lg border border-white/20 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/[0.08]">
              Ask AI Advisor
            </Link>
            <SaveRobotButton robotId={robot.id} />
            <AddToCompareButton slug={robot.slug} />
          </div>
        </div>

        {/* Scroll indicator */}
        <ScrollIndicator />
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — ICON SPEC HIGHLIGHTS
          ══════════════════════════════════════════════ */}
      {keySpecs.length >= 3 && (
        <section id="specs-highlight" className="bg-[#0F1628] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-px bg-white/[0.05] md:grid-cols-3">
              {keySpecs.slice(0, 6).map((spec, i) => {
                const IconComponent = SPEC_ICON_MAP[spec.key];
                return (
                  <RevealOnScroll key={spec.key} delay={(i % 3) as 0 | 1 | 2} className="bg-[#0F1628] p-6 text-center md:p-8">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                      {IconComponent ? <IconComponent /> : null}
                    </div>
                    <p className="font-mono text-2xl font-bold text-white">{spec.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-widest text-white/[0.45]">{spec.label}</p>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 3 — ALTERNATING FEATURE SECTIONS
          ══════════════════════════════════════════════ */}
      {featureSections.length >= 3 && featureSections.map((feat, i) => {
        const isEven = i % 2 === 0;
        const bg = isEven ? "bg-[#0A0F1E]" : "bg-[#0F1628]";
        return (
          <RevealOnScroll key={i}>
            <section className={`${bg} px-4 py-20`} style={{ minHeight: 500 }}>
              <div className={`mx-auto flex max-w-6xl flex-col gap-8 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} lg:items-center lg:gap-16`}>
                {/* Text side */}
                <div className="flex-1">
                  <span className="section-label">{feat.label}</span>
                  <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                    {feat.headline}
                  </h2>
                  <p className="mt-4 text-base leading-[1.7] text-white/[0.65]">
                    {feat.description}
                  </p>
                  {feat.stat && (
                    <div className="mt-6 rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3 inline-block">
                      <span className="font-mono text-lg font-bold text-green">{feat.stat.value}</span>
                      <span className="ml-2 text-xs text-white/40">{feat.stat.label}</span>
                    </div>
                  )}
                </div>
                {/* Visual side */}
                <div className="relative h-64 w-full flex-1 overflow-hidden rounded-2xl bg-white/[0.03] lg:h-80">
                  {hasRealImage ? (
                    <SafeImage
                      src={robotImages[Math.min(i, robotImages.length - 1)]?.url || robotImages[0].url}
                      alt={feat.headline}
                      sizes="(max-width:1024px) 100vw, 50vw"
                      className="object-cover"
                      fallbackLabel={mfr?.name}
                      fallbackSublabel={robot.name}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/20">{cat?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </RevealOnScroll>
        );
      })}

      {/* ══════════════════════════════════════════════
          SECTION 4 — ROI CALCULATOR (DJI style)
          ══════════════════════════════════════════════ */}
      <section id="roi" className="relative scroll-mt-24 overflow-hidden px-4 py-20">
        <div className="animate-bg-shift absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">ROI Calculator</span>
            <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              {"What's your return?"}
            </h2>
            <p className="mt-2 max-w-lg text-base leading-[1.7] text-white/[0.65]">
              Estimate your return on investing in {robot.name} based on your specific operation.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={1} className="mt-8">
            <RoiCalculatorStandalone robotName={robot.name} robotPrice={robot.price_current} robotSlug={`${categorySlug}/${robot.slug}`} />
          </RevealOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 5 — ROBOSCORE BREAKDOWN (DJI style)
          ══════════════════════════════════════════════ */}
      {breakdown && (
        <section id="score" className="scroll-mt-24 bg-[#0A0F1E] px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll>
              <span className="section-label">RoboScore</span>
              <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                Performance breakdown
              </h2>
            </RevealOnScroll>

            <div className="mt-10 grid gap-12 lg:grid-cols-[280px_1fr]">
              {/* Large score ring */}
              <RevealOnScroll className="flex flex-col items-center justify-start">
                <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                  <RoboScoreRing score={robot.robo_score!} size={180} />
                </div>
                <p className="mt-4 text-center text-xs leading-relaxed text-white/35">
                  Weighted composite of 8 independently evaluated dimensions.
                </p>
                <Link href="/methodology" className="mt-3 block text-center text-xs text-blue hover:underline">Read methodology →</Link>
              </RevealOnScroll>

              {/* Dimension bars with scroll-triggered fill */}
              <RevealOnScroll delay={1}>
                <div className="space-y-4">
                  {DIMENSIONS.map((dim) => {
                    const score = breakdown[dim.key];
                    const color = score >= 80 ? "bg-green" : score >= 60 ? "bg-amber-400" : "bg-red-400";
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <div className="w-24 shrink-0 text-right text-xs text-white/40">{dim.label}</div>
                        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                          <div
                            className={`score-bar-fill absolute inset-y-0 left-0 rounded-full ${color}`}
                            style={{ "--score-width": `${score}%` } as CSSProperties}
                          />
                        </div>
                        <span className="w-8 font-mono text-xs font-semibold text-white">{score}</span>
                        <span className="w-10 text-right text-[10px] text-white/30">{Math.round(dim.weight * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 6 — FULL SPECS
          ══════════════════════════════════════════════ */}
      {Object.keys(specs).length > 0 && (
        <section id="specs" className="scroll-mt-24 bg-[#0F1628] px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll>
              <span className="section-label">Specifications</span>
              <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                Technical specifications
              </h2>
            </RevealOnScroll>
            <div className="mt-8 space-y-6">
              {specGroups.map(([group, entries]) => (
                <RevealOnScroll key={group}>
                  <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">{group}</h3>
                  <div className="overflow-hidden rounded-lg border border-white/[0.07]">
                    <table className="w-full text-sm">
                      <tbody>
                        {entries.map(([key, value], i) => (
                          <tr key={key} className={i % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.04]"}>
                            <td className="px-4 py-2.5 text-white/40 sm:w-48">{fmtKey(key)}</td>
                            <td className="px-4 py-2.5 font-mono text-white">{fmtVal(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 7 — EXPERT REVIEWS
          ══════════════════════════════════════════════ */}
      {expertReviews.length > 0 && (
        <section id="reviews" className="scroll-mt-24 bg-[#0A0F1E] px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll>
              <span className="section-label">Reviews</span>
              <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                What experts say
              </h2>
              <p className="mt-2 text-base leading-[1.7] text-white/[0.65]">Independent reviews of the {robot.name}</p>
            </RevealOnScroll>
            <div className="mt-8 space-y-4">
              {expertReviews.map((review) => (
                <RevealOnScroll key={review.id}>
                  <ExpertReviewCard title={review.title} body={review.body} roboScore={review.robo_score} scoreBreakdown={review.score_breakdown as RoboScoreBreakdown | null} pros={review.pros as string[]} cons={review.cons as string[]} verdict={review.verdict} publishedAt={review.published_at} />
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          SECTION 8 — COMMUNITY REVIEWS
          ══════════════════════════════════════════════ */}
      <section className="scroll-mt-24 bg-[#0F1628] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">Community</span>
            <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              Community reviews
            </h2>
          </RevealOnScroll>
          {communityReviews.length > 0 && (
            <div className="mt-8 space-y-4">
              {communityReviews.map((review) => (
                <RevealOnScroll key={review.id}>
                  <CommunityReviewCard title={review.title} body={review.body} roboScore={review.robo_score} pros={review.pros as string[]} cons={review.cons as string[]} verifiedPurchase={review.verified_purchase} authorName={(review.users as { name: string | null } | null)?.name || null} publishedAt={review.published_at} />
                </RevealOnScroll>
              ))}
            </div>
          )}
          <div className="mt-8">
            <CommunityReviewForm robotId={robot.id} robotName={robot.name} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 9 — PRICING & WHERE TO BUY
          ══════════════════════════════════════════════ */}
      <section id="buy" className="scroll-mt-24 bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <span className="section-label">Pricing</span>
            <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
              Where to buy
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={1} className="mt-8">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <PriceDisplay price={robot.price_current} status={robot.status} size="lg" />
                {robot.price_msrp != null && robot.price_current != null && robot.price_msrp > robot.price_current && (
                  <span className="font-mono text-sm text-white/30 line-through">${robot.price_msrp.toLocaleString()}</span>
                )}
              </div>
              {robot.price_current != null && robot.price_current > 50000 && (
                <p className="mt-2 text-xs text-white/35">Financing typically available through manufacturer or equipment leasing partners.</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                {(robot.affiliate_url || mfr?.website) ? (
                  <a href={`/api/out/${robot.slug}?ref=product-page&pos=pricing-section`} target="_blank" rel="sponsored noopener noreferrer" className="rounded-lg bg-blue px-7 py-3 text-sm font-semibold text-white hover:opacity-90">
                    {robot.affiliate_url ? `Request Quote from ${mfr?.name}` : `Visit ${mfr?.name}`}
                  </a>
                ) : null}
              </div>
            </div>
          </RevealOnScroll>
          <div className="mt-8">
            <PriceComparison robotSlug={robot.slug} prices={(priceHistory || []).map((p) => ({ retailer: p.retailer, price: p.price, currency: "USD" }))} affiliateUrl={robot.affiliate_url} manufacturerWebsite={mfr?.website || null} />
          </div>
          <AffiliateDisclosureInline />
          <RevealOnScroll delay={1} className="mt-6">
            <PriceAlertForm robotId={robot.id} robotName={robot.name} currentPrice={robot.price_current} />
          </RevealOnScroll>
          {(priceHistory || []).length > 0 && (
            <RevealOnScroll className="mt-8">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/30">Price History</h3>
              <PriceChart data={priceHistory || []} />
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 10 — SIMILAR ROBOTS
          ══════════════════════════════════════════════ */}
      {similar.length > 0 && (
        <section id="similar" className="scroll-mt-24 bg-[#0F1628] px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <RevealOnScroll>
              <span className="section-label">Alternatives</span>
              <h2 className="mt-2 font-display font-bold tracking-[-0.02em] text-white" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
                Also consider
              </h2>
              <p className="mt-2 text-base leading-[1.7] text-white/[0.65]">Other {cat?.name || ""} robots to evaluate</p>
            </RevealOnScroll>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {similar.map((s, i) => {
                const sCatSlug = (s.robot_categories as { slug: string } | null)?.slug || categorySlug;
                const sMfr = (s.manufacturers as { name: string } | null)?.name || "";
                const sImgs = (Array.isArray(s.images) ? s.images : []) as { url: string }[];
                const realImg = sImgs[0]?.url && !sImgs[0].url.includes("unsplash") ? sImgs[0].url : null;
                const label = i === 0 ? "Best alternative" : i === 1 ? "Also consider" : "Budget option";
                return (
                  <RevealOnScroll key={s.id} delay={(i as 0 | 1 | 2)}>
                    <Link href={`/explore/${sCatSlug}/${s.slug}`} className="group block overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-blue/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                      <div className="relative h-40 bg-white/[0.03]">
                        {realImg ? (
                          <SafeImage src={realImg} alt={s.name} sizes="33vw" className="object-cover" fallbackLabel={sMfr} fallbackSublabel={s.name} />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.04] text-center">
                            <span className="text-[10px] text-white/20">{sMfr}</span>
                            <span className="text-xs font-semibold text-white/30">{s.name}</span>
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-medium text-white/60 backdrop-blur-sm">{label}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] text-white/30">{sMfr}</p>
                        <h3 className="font-semibold text-white transition-colors group-hover:text-blue">{s.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <PriceDisplay price={s.price_current} size="sm" />
                          {s.robo_score != null && s.robo_score > 0 && <RoboScoreBadge score={s.robo_score} />}
                        </div>
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          AI ADVISOR CTA
          ══════════════════════════════════════════════ */}
      <section className="bg-[#0A0F1E] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue/[0.05] to-violet/[0.05] p-8 text-center sm:p-12">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em] text-white">Not sure if {robot.name} is right for you?</h2>
              <p className="mt-3 text-base leading-[1.7] text-white/[0.65]">Our AI Advisor compares this robot with alternatives for your specific use case, budget, and team.</p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/advisor" className="rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90">Ask Robot Advisor</Link>
                <Link href="/explore" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-8 py-3 text-sm font-semibold text-white/80 hover:border-white/20">Browse All Robots</Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------
function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-1.5 backdrop-blur-sm">
      <span className="text-[10px] text-white/40">{label} </span>
      <span className="font-mono text-sm font-bold text-white">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key specs builder for icon highlight section
// ---------------------------------------------------------------------------
interface KeySpec {
  key: string;
  label: string;
  value: string;
}

function buildKeySpecs(specs: Record<string, unknown>): KeySpec[] {
  const candidates: { key: string; label: string; value: string; priority: number }[] = [];

  if (specs.payload_kg != null) candidates.push({ key: "payload_kg", label: "Payload", value: `${specs.payload_kg}kg`, priority: 1 });
  if (specs.max_speed != null) candidates.push({ key: "max_speed", label: "Max Speed", value: String(specs.max_speed), priority: 2 });
  if (specs.battery_hrs != null) candidates.push({ key: "battery_hrs", label: "Runtime", value: `${specs.battery_hrs}h`, priority: 3 });
  if (specs.reach_mm != null) candidates.push({ key: "reach_mm", label: "Reach", value: `${specs.reach_mm}mm`, priority: 4 });
  if (specs.weight_kg != null) candidates.push({ key: "weight_kg", label: "Weight", value: `${specs.weight_kg}kg`, priority: 5 });
  if (specs.dof != null) candidates.push({ key: "dof", label: "DOF", value: `${specs.dof}-axis`, priority: 6 });
  if (specs.suction_pa != null) candidates.push({ key: "suction_pa", label: "Suction", value: `${Number(specs.suction_pa).toLocaleString()}Pa`, priority: 7 });

  return candidates.sort((a, b) => a.priority - b.priority).slice(0, 6);
}

// ---------------------------------------------------------------------------
// Feature sections builder for alternating layout
// ---------------------------------------------------------------------------
interface FeatureSection {
  label: string;
  headline: string;
  description: string;
  stat?: { value: string; label: string };
}

function buildFeatureSections(specs: Record<string, unknown>, categoryName: string, robotName: string): FeatureSection[] {
  const sections: FeatureSection[] = [];
  const catLower = categoryName.toLowerCase();

  if (specs.payload_kg != null) {
    sections.push({
      label: "Capacity",
      headline: catLower.includes("warehouse") || catLower.includes("industrial")
        ? "Built for warehouse-scale deployment"
        : `Engineered for ${categoryName.toLowerCase()} performance`,
      description: `The ${robotName} handles demanding workloads with a ${specs.payload_kg}kg payload capacity${specs.reach_mm ? ` and ${specs.reach_mm}mm reach` : ""}, making it suitable for continuous operation in professional environments.`,
      stat: { value: `${specs.payload_kg}kg`, label: "maximum payload" },
    });
  }

  if (specs.battery_hrs != null || specs.charge_time_hrs != null) {
    sections.push({
      label: "Endurance",
      headline: "Runs when you need it to",
      description: `With ${specs.battery_hrs ? `up to ${specs.battery_hrs} hours of runtime` : "extended battery life"}${specs.charge_time_hrs ? ` and a ${specs.charge_time_hrs}-hour charge time` : ""}, the ${robotName} keeps your operation moving without constant interruptions.`,
      stat: specs.battery_hrs ? { value: `${specs.battery_hrs}h`, label: "continuous runtime" } : undefined,
    });
  }

  if (specs.navigation || specs.ai_capabilities || specs.autonomy_level) {
    sections.push({
      label: "Intelligence",
      headline: "Smart enough to work alongside you",
      description: `Advanced ${specs.navigation ? `${String(specs.navigation)} navigation` : "navigation"} ${specs.ai_capabilities ? `with ${String(specs.ai_capabilities)}` : ""} enables the ${robotName} to operate with minimal supervision and adapt to changing environments.`,
      stat: specs.autonomy_level ? { value: String(specs.autonomy_level), label: "autonomy level" } : undefined,
    });
  }

  if (specs.safety_functions || specs.collaborative || specs.ip_rating) {
    sections.push({
      label: "Safety",
      headline: "Designed with safety at the core",
      description: `${specs.collaborative ? "Collaborative design allows safe operation alongside human workers. " : ""}${specs.safety_functions ? String(specs.safety_functions) + ". " : ""}${specs.ip_rating ? `IP${specs.ip_rating} rated for environmental protection.` : ""}`.trim(),
      stat: specs.ip_rating ? { value: `IP${specs.ip_rating}`, label: "protection rating" } : undefined,
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Spec grouping
// ---------------------------------------------------------------------------
const SPEC_GROUPS: Record<string, string[]> = {
  "Physical": ["weight_kg", "height_mm", "width_mm", "depth_mm", "reach_mm", "footprint", "ip_rating", "mounting"],
  "Performance": ["payload_kg", "max_speed", "repeatability", "dof", "cycle_time", "suction_pa", "battery_hrs", "charge_time_hrs"],
  "Intelligence": ["navigation", "sensors", "vision", "ai_capabilities", "autonomy_level", "obstacle_avoidance"],
  "Connectivity": ["communication", "protocols", "wifi", "bluetooth", "api", "ros_compatible"],
  "Safety": ["collaborative", "safety_functions", "certifications", "emergency_stop", "force_limiting"],
};

function groupSpecs(specs: Record<string, unknown>): [string, [string, unknown][]][] {
  const used = new Set<string>();
  const groups: [string, [string, unknown][]][] = [];

  for (const [group, keys] of Object.entries(SPEC_GROUPS)) {
    const entries: [string, unknown][] = [];
    for (const key of keys) {
      if (specs[key] != null && specs[key] !== "" && specs[key] !== false) {
        entries.push([key, specs[key]]);
        used.add(key);
      }
    }
    if (entries.length > 0) groups.push([group, entries]);
  }

  const other: [string, unknown][] = [];
  for (const [key, value] of Object.entries(specs)) {
    if (!used.has(key) && value != null && value !== "" && value !== false) {
      other.push([key, value]);
    }
  }
  if (other.length > 0) groups.push(["Other", other]);

  return groups;
}

function fmtKey(key: string): string {
  return key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmtVal(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
