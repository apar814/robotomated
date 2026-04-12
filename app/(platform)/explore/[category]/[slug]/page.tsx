import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreRing, RoboScoreBadge, ScoreBar } from "@/components/ui/robo-score";
import { PriceChart } from "@/components/robots/price-chart";
import { PriceComparison } from "@/components/commerce/price-comparison";
import { AffiliateDisclosureInline } from "@/components/commerce/affiliate-disclosure";
import { ProductSchema, ReviewSchema } from "@/components/seo/json-ld";
import { ExpertReviewCard } from "@/components/reviews/expert-review-card";
import { CommunityReviewCard } from "@/components/reviews/community-review-card";
import { CommunityReviewForm } from "@/components/reviews/community-review-form";
import { AskAiButton } from "@/components/advisor/ask-ai-button";
import { SaveRobotButton } from "@/components/auth/save-robot-button";
import { RoiCalculatorStandalone } from "@/components/robots/roi-calculator-standalone";
import { DIMENSIONS } from "@/lib/scoring/roboscore";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { SafeImage } from "@/components/ui/safe-image";
import { AddToCompareButton } from "@/components/compare/add-to-compare-button";
import { PriceAlertForm } from "@/components/commerce/price-alert-form";
import { RobotFinderSidebarCta } from "@/components/ui/robot-finder-cta";
import { SectorCode, SECTOR_CODES } from "@/components/ui/sector-code";
import { ShareButtons } from "@/components/robots/share-buttons";
import { DownloadReport } from "@/components/robots/download-report";
import { QuickVerdictBar } from "@/components/robots/quick-verdict-bar";
import { TcoSummaryCard } from "@/components/robots/tco-summary-card";
import { VendorHealthCard } from "@/components/robots/vendor-health-card";
import { ComplianceCard } from "@/components/robots/compliance-card";
import { DeploymentGuide } from "@/components/robots/deployment-guide";
import { MaintenanceGuide } from "@/components/robots/maintenance-guide";
import { TrainingSection } from "@/components/robots/training-section";
import { BuyersChecklist } from "@/components/robots/buyers-checklist";
import { VideoEmbed } from "@/components/robots/video-embed";
import { cached } from "@/lib/cache/redis";
import { SidebarNewsletterCta } from "@/components/engagement/sidebar-newsletter-cta";
import { TrackView } from "@/components/robots/track-view";
import { VideoPlayer } from "@/components/ui/video-hero";

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
  manufacturers: { name: string; slug: string; country: string | null; website: string | null; founded_year: number | null };
  robot_categories: { name: string; slug: string };
  // Buyer intelligence fields
  maintenance_annual_cost_low: number | null;
  maintenance_annual_cost_high: number | null;
  maintenance_annual_pct: number | null;
  warranty_months: number | null;
  warranty_coverage: string | null;
  support_model: string | null;
  support_response_hours: number | null;
  spare_parts_availability: string | null;
  deployment_weeks_min: number | null;
  deployment_weeks_max: number | null;
  floor_space_sqft: number | null;
  power_requirements: string | null;
  network_requirements: string | null;
  wms_integrations: string[] | null;
  erp_integrations: string[] | null;
  api_available: boolean | null;
  operator_training_hours: number | null;
  safety_certifications: string[] | null;
  industry_certifications: string[] | null;
  vendor_funding_total: string | null;
  vendor_employees_range: string | null;
  vendor_health_score: number | null;
  youtube_url: string | null;
  video_url: string | null;
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

// ISR: revalidate robot pages every hour
export const revalidate = 3600;

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
    openGraph: {
      title: `${data.name} — ${scoreStr || "RoboScore Pending"} | Robotomated`,
      description: `${data.name} by ${data.manufacturers?.name}. ${priceStr}. ${data.description_short || "Expert review, specs, ROI calculator, and pricing."}`,
      images: [`/api/og/robot/${slug}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og/robot/${slug}`],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function RobotDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const supabase = createServerClient();

  const robot = await cached<RobotDetail | null>(`robot:${slug}`, 1800, async () => {
    const { data } = await supabase.from("robots")
      .select("*, manufacturers(name, slug, country, website, founded_year), robot_categories(name, slug)")
      .eq("slug", slug).single().returns<RobotDetail>();
    return data;
  });
  if (!robot) notFound();

  const [reviews, priceHistory, similarData] = await Promise.all([
    cached<ReviewRow[]>(`robot:${slug}:reviews`, 1800, async () => {
      const { data } = await supabase.from("reviews").select("id, review_type, title, body, robo_score, score_breakdown, pros, cons, verdict, verified_purchase, published_at, users(name)")
        .eq("robot_id", robot.id).not("published_at", "is", null).order("published_at", { ascending: false }).returns<ReviewRow[]>();
      return data || [];
    }),
    cached<PricePoint[]>(`robot:${slug}:prices`, 3600, async () => {
      const { data } = await supabase.from("price_history").select("recorded_at, price, retailer")
        .eq("robot_id", robot.id).order("recorded_at", { ascending: true }).returns<PricePoint[]>();
      return data || [];
    }),
    cached<SimilarRobot[]>(`robot:${slug}:similar`, 3600, async () => {
      const { data } = await supabase.from("robots").select("id, slug, name, robo_score, price_current, description_short, images, manufacturers(name), robot_categories(slug)")
        .eq("category_id", robot.category_id).neq("id", robot.id).eq("status", "active")
        .order("robo_score", { ascending: false, nullsFirst: false }).limit(3).returns<SimilarRobot[]>();
      return data || [];
    }),
  ]);

  const breakdown = robot.score_breakdown as RoboScoreBreakdown | null;
  const specs = robot.specs as Record<string, unknown>;
  const robotImages = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];
  const mfr = robot.manufacturers;
  const cat = robot.robot_categories;
  const expertReviews = reviews.filter((r) => r.review_type === "expert");
  const communityReviews = reviews.filter((r) => r.review_type === "community");
  const similar = similarData;

  const hasRealImage = robotImages.length > 0 && robotImages[0].url && !robotImages[0].url.includes("unsplash");

  // Spec grouping for full specs table
  const specGroups = groupSpecs(specs);

  // Build 3 key specs inline
  const inlineSpecs: string[] = [];
  if (specs.payload_kg != null) inlineSpecs.push(`${specs.payload_kg}kg payload`);
  if (specs.max_speed != null) inlineSpecs.push(`${specs.max_speed} speed`);
  if (specs.battery_hrs != null) inlineSpecs.push(`${specs.battery_hrs}h runtime`);
  if (specs.reach_mm != null && inlineSpecs.length < 3) inlineSpecs.push(`${specs.reach_mm}mm reach`);
  if (specs.dof != null && inlineSpecs.length < 3) inlineSpecs.push(`${specs.dof}-axis`);

  // Sector code
  const sectorCode = SECTOR_CODES[cat?.slug || ""] || cat?.slug?.toUpperCase()?.slice(0, 3) || "GEN";

  // Quick verdict defaults
  const bestForMap: Record<string, string> = {
    warehouse: "High-volume warehouse operations",
    manufacturing: "Production line automation",
    consumer: "Home and personal use",
    medical: "Healthcare and clinical settings",
    construction: "Construction site operations",
    agricultural: "Farm and field operations",
    delivery: "Last-mile delivery operations",
    drone: "Aerial inspection and surveying",
    security: "Facility security and patrol",
    hospitality: "Guest services and hospitality",
  };
  const bestFor = bestForMap[cat?.slug || ""] || `${cat?.name || "General"} applications`;
  const avoidIf = "Budget is primary constraint and manual alternatives exist";

  function fmtPrice(p: number): string {
    if (p >= 1000000) return `$${(p / 1000000).toFixed(1)}M`;
    return `$${p.toLocaleString()}`;
  }

  return (
    <div className="bg-obsidian">
      <TrackView slug={robot.slug} category={cat?.slug || categorySlug} name={robot.name} />
      <AskAiButton robotName={robot.name} />
      <ProductSchema name={robot.name} slug={robot.slug} description={robot.description_short || ""} manufacturer={mfr?.name || ""} price={robot.price_current} score={robot.robo_score} categorySlug={categorySlug} model={robot.model_number} status={robot.status} />
      {expertReviews[0] && <ReviewSchema robotName={robot.name} reviewTitle={expertReviews[0].title} reviewBody={expertReviews[0].body.slice(0, 200)} author="Robotomated Editorial" score={expertReviews[0].robo_score} publishedAt={expertReviews[0].published_at} />}

      {/* ── 1. BREADCRUMB ── */}
      <div className="mx-auto max-w-6xl px-4 pt-6 lg:px-6">
        <nav className="flex items-center gap-1 font-mono text-[13px]">
          <Link href="/explore" className="text-text-tertiary transition-colors hover:text-text-secondary">
            Explore
          </Link>
          <span className="text-text-ghost">/</span>
          <Link href={`/explore/${categorySlug}`} className="text-text-tertiary transition-colors hover:text-text-secondary">
            {cat?.name || categorySlug}
          </Link>
          <span className="text-text-ghost">/</span>
          <span className="text-text-tertiary">{robot.name}</span>
        </nav>
      </div>

      {/* ── 2. HERO SECTION ── */}
      <section className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left side (60%) */}
          <div className="flex-1 lg:w-[60%]">
            {/* Manufacturer */}
            <p className="font-mono text-[13px] uppercase tracking-widest text-text-tertiary">
              {mfr?.name}
            </p>

            {/* Robot name */}
            <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-text-primary lg:text-4xl">
              {robot.name}
            </h1>

            {/* Sector code + year */}
            <div className="mt-2 flex items-center gap-2">
              <SectorCode code={sectorCode} />
              <span className="font-mono text-[13px] text-text-tertiary">
                · {robot.year_released || YEAR}
              </span>
            </div>

            {/* RoboScore */}
            {robot.robo_score != null && robot.robo_score > 0 && (
              <div className="mt-4">
                <RoboScoreBadge score={robot.robo_score} className="px-3 py-1 text-sm" />
              </div>
            )}

            {/* Price */}
            <div className="mt-4">
              {robot.price_current != null ? (
                <p className="font-mono text-2xl font-bold text-blue-400">
                  {fmtPrice(robot.price_current)}
                </p>
              ) : (
                <p className="font-mono text-2xl font-bold text-text-tertiary">
                  Request Quote
                </p>
              )}
            </div>

            {/* 3 key specs inline */}
            {inlineSpecs.length > 0 && (
              <p className="mt-3 font-mono text-xs text-text-secondary">
                {inlineSpecs.slice(0, 3).join(" · ")}
              </p>
            )}

            {/* Who is this for + What problem does it solve */}
            <div className="mt-5 space-y-2">
              <div className="rounded-lg border border-border bg-obsidian-surface px-4 py-3">
                <p className="font-mono text-[13px] font-semibold uppercase tracking-widest text-electric-blue">What problem does this solve?</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                  {bestFor}.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-obsidian-surface px-4 py-3">
                <p className="font-mono text-[13px] font-semibold uppercase tracking-widest text-electric-blue">Who is this for?</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {robot.price_current != null && robot.price_current < 15000
                    ? "Small-to-mid operations evaluating automation for the first time. Low barrier to entry, fast deployment."
                    : robot.price_current != null && robot.price_current < 50000
                      ? "Mid-market operations teams with proven use cases looking to scale beyond manual processes."
                      : robot.price_current != null && robot.price_current >= 50000
                        ? "Enterprise operations teams with dedicated automation budgets and integration requirements."
                        : "Operations teams evaluating automation — contact the manufacturer for deployment consultation and pricing."}
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#checklist"
                className="rounded-md bg-electric-blue px-5 py-2.5 font-mono text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                Get Buyer&apos;s Checklist
              </a>
              <AddToCompareButton slug={robot.slug} />
              <SaveRobotButton robotId={robot.id} />
            </div>

            {/* Data confidence + Report error */}
            <div className="mt-4 flex items-center gap-3 text-[13px]">
              <span className="flex items-center gap-1 font-mono text-text-ghost">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Updated {new Date(robot.updated_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
              <span className="text-text-ghost">·</span>
              <span className="font-mono text-text-ghost">
                {[robot.price_current, robot.robo_score, robotImages.length > 0, Object.keys(specs).length > 3].filter(Boolean).length}/4 data completeness
              </span>
              <span className="text-text-ghost">·</span>
              <a href={`mailto:data@robotomated.com?subject=Data%20correction:%20${encodeURIComponent(robot.name)}&body=Robot:%20${encodeURIComponent(robot.name)}%0AField:%20%0ACorrection:%20`} className="text-electric-blue hover:underline">
                Report an error
              </a>
            </div>

            {/* Share & Download */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ShareButtons
                robotName={robot.name}
                robotScore={robot.robo_score}
                robotUrl={`/explore/${categorySlug}/${robot.slug}`}
              />
              <DownloadReport
                robot={{
                  name: robot.name,
                  manufacturer: mfr?.name || "Unknown",
                  roboScore: robot.robo_score,
                  scoreBreakdown: breakdown as Record<string, number> | null,
                  priceCurrent: robot.price_current,
                  specs: specs,
                  maintenanceCostLow: robot.maintenance_annual_cost_low,
                  maintenanceCostHigh: robot.maintenance_annual_cost_high,
                  warrantyMonths: robot.warranty_months,
                }}
              />
            </div>
          </div>

          {/* Right side (40%) — Image */}
          <div className="lg:w-[40%]">
            <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border bg-obsidian-surface">
              {hasRealImage ? (
                <SafeImage
                  src={robotImages[0].url}
                  alt={robotImages[0].alt || robot.name}
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                  fallbackLabel={mfr?.name}
                  fallbackSublabel={robot.name}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <span className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    {mfr?.name}
                  </span>
                  <span className="mt-1 text-sm font-semibold text-text-tertiary">
                    {robot.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIRECT VIDEO ── */}
      {robot.video_url && (
        <section className="mx-auto max-w-6xl px-4 pb-2 lg:px-6">
          <div className="section-label mb-3">
            <span className="font-mono text-[13px] tracking-widest">[VIDEO] WATCH IN ACTION</span>
          </div>
          <VideoPlayer
            videoUrl={robot.video_url}
            posterUrl={hasRealImage ? robotImages[0].url : null}
            alt={`${robot.name} in action`}
          />
        </section>
      )}

      {/* ── YOUTUBE EMBED ── */}
      {robot.youtube_url && !robot.video_url && (
        <section className="mx-auto max-w-6xl px-4 pb-2 lg:px-6">
          <div className="section-label mb-3">
            <span className="font-mono text-[13px] tracking-widest">[VIDEO] WATCH IN ACTION</span>
          </div>
          <VideoEmbed youtubeUrl={robot.youtube_url} robotName={robot.name} />
        </section>
      )}

      {/* ── 3. QUICK VERDICT BAR ── */}
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <QuickVerdictBar
          bestFor={bestFor}
          avoidIf={avoidIf}
          paybackMonths={null}
          complexity={null}
        />
      </div>

      {/* ── 4. TWO-COLUMN LAYOUT ── */}
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* LEFT COLUMN (60%) */}
          <div className="space-y-8 lg:w-[60%]">
            {/* Description */}
            {(robot.description_long || robot.description_short) && (
              <section className="border-t border-border pt-6">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">[OVERVIEW] DESCRIPTION</span>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {robot.description_long || robot.description_short}
                </p>
              </section>
            )}

            {/* Full Review */}
            {expertReviews.length > 0 && (
              <section className="border-t border-border pt-6">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">[REVIEW] EXPERT ANALYSIS</span>
                </div>
                <div className="space-y-4">
                  {expertReviews.map((review) => (
                    <ExpertReviewCard
                      key={review.id}
                      title={review.title}
                      body={review.body}
                      roboScore={review.robo_score}
                      scoreBreakdown={review.score_breakdown as RoboScoreBreakdown | null}
                      pros={review.pros as string[]}
                      cons={review.cons as string[]}
                      verdict={review.verdict}
                      publishedAt={review.published_at}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Score Breakdown */}
            {breakdown && (
              <section className="border-t border-border pt-6">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">[SCORE] BREAKDOWN</span>
                </div>
                <div className="space-y-3">
                  {DIMENSIONS.map((dim) => {
                    const score = breakdown[dim.key];
                    return (
                      <ScoreBar
                        key={dim.key}
                        label={dim.label}
                        score={score}
                        weight={`${Math.round(dim.weight * 100)}%`}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <section id="specs" className="border-t border-border pt-6">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">[SPECS] TECHNICAL</span>
                </div>
                <div className="space-y-6">
                  {specGroups.map(([group, entries]) => (
                    <div key={group}>
                      <h3 className="mb-2 font-mono text-[13px] uppercase tracking-widest text-text-ghost">
                        {group}
                      </h3>
                      <div className="overflow-hidden rounded-md border border-border">
                        <table className="w-full text-sm">
                          <tbody>
                            {entries.map(([key, value], i) => (
                              <tr
                                key={key}
                                className={i % 2 === 0 ? "bg-obsidian-surface" : "bg-obsidian"}
                              >
                                <td className="px-4 py-2.5 text-text-tertiary sm:w-48">
                                  {fmtKey(key)}
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="font-mono text-text-primary">{fmtVal(value)}</span>
                                  {specTranslation(key, value) && (
                                    <span className="ml-2 text-xs text-white/45"> — {specTranslation(key, value)}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TCO Section */}
            <section className="border-t border-border pt-6">
              <h3 className="mb-1 text-lg font-bold text-text-primary">The Real Cost of Ownership</h3>
              <p className="mb-4 text-xs text-white/45">Purchase price is only 40-60% of the true cost. Here&apos;s the full picture.</p>
            </section>
            <section>
              <div className="section-label mb-3">
                <span className="font-mono text-[13px] tracking-widest">[TCO] COST ANALYSIS</span>
              </div>
              <div className="space-y-4">
                {/* Purchase Costs */}
                <div className="rounded-md border border-border bg-obsidian-surface p-4">
                  <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    Purchase Costs
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-mono text-[13px] text-text-ghost">MSRP</p>
                      <p className="font-mono text-sm text-text-data">
                        {robot.price_msrp != null ? fmtPrice(robot.price_msrp) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[13px] text-text-ghost">CURRENT</p>
                      <p className="font-mono text-sm font-bold text-blue-400">
                        {robot.price_current != null ? fmtPrice(robot.price_current) : "RFQ"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operating Costs */}
                <div className="rounded-md border border-border bg-obsidian-surface p-4">
                  <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                    Operating Costs (Annual)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-mono text-[13px] text-text-ghost">MAINTENANCE LOW</p>
                      <p className="font-mono text-sm text-text-data">
                        {robot.maintenance_annual_cost_low != null
                          ? fmtPrice(robot.maintenance_annual_cost_low)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[13px] text-text-ghost">MAINTENANCE HIGH</p>
                      <p className="font-mono text-sm text-text-data">
                        {robot.maintenance_annual_cost_high != null
                          ? fmtPrice(robot.maintenance_annual_cost_high)
                          : "—"}
                      </p>
                    </div>
                  </div>
                  {robot.maintenance_annual_pct != null && (
                    <p className="mt-2 font-mono text-[13px] text-text-tertiary">
                      ~{robot.maintenance_annual_pct}% of purchase price annually
                    </p>
                  )}
                </div>

                {/* 5-Year Summary */}
                {robot.price_current != null && (
                  <div className="rounded-md border border-border border-l-2 border-l-blue-500 bg-obsidian-surface p-4">
                    <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                      5-Year Summary
                    </p>
                    <p className="font-mono text-lg font-bold text-text-primary">
                      {(() => {
                        const maint =
                          robot.maintenance_annual_cost_low != null && robot.maintenance_annual_cost_high != null
                            ? Math.round((robot.maintenance_annual_cost_low + robot.maintenance_annual_cost_high) / 2)
                            : robot.maintenance_annual_pct != null && robot.price_current != null
                              ? Math.round(robot.price_current * (robot.maintenance_annual_pct / 100))
                              : 0;
                        return fmtPrice(robot.price_current! + 5 * maint);
                      })()}
                    </p>
                    <p className="mt-1 text-[13px] text-text-ghost">
                      Purchase price + estimated 5 years maintenance
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ROI Calculator */}
            <section id="roi" className="border-t border-border pt-6">
              <div className="section-label mb-3">
                <span className="font-mono text-[13px] tracking-widest">[ROI] CALCULATOR</span>
              </div>
              <RoiCalculatorStandalone
                robotName={robot.name}
                robotPrice={robot.price_current}
                robotSlug={`${categorySlug}/${robot.slug}`}
              />
            </section>

            {/* Maintenance Guide */}
            <section className="border-t border-border pt-6">
              <MaintenanceGuide
                warrantyMonths={robot.warranty_months}
                warrantyCoverage={robot.warranty_coverage}
                supportModel={robot.support_model}
                supportResponseHours={robot.support_response_hours}
                sparePartsAvailability={robot.spare_parts_availability}
              />
            </section>

            {/* Deployment Guide */}
            <section className="border-t border-border pt-6">
              <DeploymentGuide
                deploymentWeeksMin={robot.deployment_weeks_min}
                deploymentWeeksMax={robot.deployment_weeks_max}
                floorSpace={robot.floor_space_sqft}
                power={robot.power_requirements}
                network={robot.network_requirements}
                wmsIntegrations={robot.wms_integrations}
                erpIntegrations={robot.erp_integrations}
                apiAvailable={robot.api_available}
              />
            </section>

            {/* Training Section */}
            <section className="border-t border-border pt-6">
              <TrainingSection
                operatorTrainingHours={robot.operator_training_hours}
              />
            </section>

            {/* Buyer's Checklist */}
            <section id="checklist" className="scroll-mt-24 border-t border-border pt-6">
              <BuyersChecklist
                robotName={robot.name}
                robotSlug={robot.slug}
              />
            </section>

            {/* Community Reviews */}
            <section className="border-t border-border pt-6">
              <div className="section-label mb-3">
                <span className="font-mono text-[13px] tracking-widest">[COMMUNITY] REVIEWS</span>
              </div>
              {communityReviews.length > 0 && (
                <div className="mb-4 space-y-4">
                  {communityReviews.map((review) => (
                    <CommunityReviewCard
                      key={review.id}
                      title={review.title}
                      body={review.body}
                      roboScore={review.robo_score}
                      pros={review.pros as string[]}
                      cons={review.cons as string[]}
                      verifiedPurchase={review.verified_purchase}
                      authorName={(review.users as { name: string | null } | null)?.name || null}
                      publishedAt={review.published_at}
                    />
                  ))}
                </div>
              )}
              <CommunityReviewForm robotId={robot.id} robotName={robot.name} />
            </section>
          </div>

          {/* RIGHT COLUMN (40%) — Sticky sidebar */}
          <div className="lg:w-[40%]">
            <div className="space-y-6 lg:sticky lg:top-20">
              {/* RoboScore Card */}
              {breakdown && robot.robo_score != null && (
                <div className="rounded-md border border-border bg-obsidian-surface p-4">
                  <div className="section-label mb-3">
                    <span className="font-mono text-[13px] tracking-widest">[ROBOSCORE] RATING</span>
                  </div>
                  <div className="mb-4 flex justify-center">
                    <RoboScoreRing score={robot.robo_score} size={120} />
                  </div>
                  <div className="space-y-2">
                    {DIMENSIONS.map((dim) => {
                      const score = breakdown[dim.key];
                      return (
                        <ScoreBar
                          key={dim.key}
                          label={dim.label}
                          score={score}
                          weight={`${Math.round(dim.weight * 100)}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <Link href="/methodology" className="font-mono text-[13px] text-electric-blue hover:underline">
                      Read methodology →
                    </Link>
                  </div>
                </div>
              )}

              {/* TCO Summary Card */}
              <TcoSummaryCard
                price={robot.price_current}
                maintenanceLow={robot.maintenance_annual_cost_low}
                maintenanceHigh={robot.maintenance_annual_cost_high}
                maintenancePct={robot.maintenance_annual_pct}
              />

              {/* Vendor Health Card */}
              <VendorHealthCard
                manufacturer={{
                  name: mfr?.name || "Unknown",
                  founded_year: mfr?.founded_year ?? null,
                  country: mfr?.country ?? null,
                }}
                fundingTotal={robot.vendor_funding_total}
                employeesRange={robot.vendor_employees_range}
                healthScore={robot.vendor_health_score}
              />

              {/* Compliance Card */}
              <ComplianceCard
                safetyCerts={robot.safety_certifications}
                industryCerts={robot.industry_certifications}
              />

              {/* Robotimus CTA */}
              <div className="rounded-md border border-border bg-obsidian-surface p-4">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">ROBOTIMUS</span>
                </div>
                <p className="mb-3 text-sm text-text-secondary">
                  Not sure if {robot.name} is right for you? Ask Robotimus.
                </p>
                <Link
                  href="/advisor"
                  className="block w-full rounded-md border border-electric-blue bg-electric-blue/10 px-4 py-2.5 text-center font-mono text-sm font-bold text-electric-blue transition-colors hover:bg-electric-blue/20"
                >
                  Find Similar Robots →
                </Link>
              </div>

              {/* Price Alert */}
              <div className="rounded-md border border-border bg-obsidian-surface p-4">
                <div className="section-label mb-3">
                  <span className="font-mono text-[13px] tracking-widest">[PRICE] ALERT</span>
                </div>
                <PriceAlertForm
                  robotId={robot.id}
                  robotName={robot.name}
                  currentPrice={robot.price_current}
                />
              </div>

              {/* Affiliate / Buy From */}
              {(robot.affiliate_url || mfr?.website) && (
                <div className="rounded-md border border-border bg-obsidian-surface p-4">
                  <div className="section-label mb-3">
                    <span className="font-mono text-[13px] tracking-widest">[BUY] WHERE TO PURCHASE</span>
                  </div>
                  <a
                    href={`/api/out/${robot.slug}?ref=product-page&pos=sidebar`}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="block w-full rounded-md bg-electric-blue px-4 py-2.5 text-center font-mono text-sm font-bold text-black transition-opacity hover:opacity-90"
                  >
                    {robot.affiliate_url ? `Buy from ${mfr?.name}` : `Visit ${mfr?.name}`}
                  </a>
                  <AffiliateDisclosureInline />
                  <PriceComparison
                    robotSlug={robot.slug}
                    prices={(priceHistory || []).map((p) => ({ retailer: p.retailer, price: p.price, currency: "USD" }))}
                    affiliateUrl={robot.affiliate_url}
                    manufacturerWebsite={mfr?.website || null}
                  />
                  {(priceHistory || []).length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                        Price History
                      </p>
                      <PriceChart data={priceHistory || []} />
                    </div>
                  )}
                </div>
              )}
              {/* Newsletter CTA */}
              <SidebarNewsletterCta robotName={robot.name} />

              {/* Robot Finder CTA */}
              <RobotFinderSidebarCta categorySlug={cat?.slug} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. SIMILAR ROBOTS ── */}
      {similar.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
            <div className="section-label mb-4">
              <span className="font-mono text-[13px] tracking-widest">[ALTERNATIVES] ALSO CONSIDER</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {similar.map((s) => {
                const sCatSlug = (s.robot_categories as { slug: string } | null)?.slug || categorySlug;
                const sMfr = (s.manufacturers as { name: string } | null)?.name || "";
                const sImgs = (Array.isArray(s.images) ? s.images : []) as { url: string; alt: string }[];
                const realImg = sImgs[0]?.url && !sImgs[0].url.includes("unsplash") ? sImgs[0].url : null;
                return (
                  <Link
                    key={s.id}
                    href={`/explore/${sCatSlug}/${s.slug}`}
                    className="group block overflow-hidden rounded-md border border-border bg-obsidian-surface transition-all hover:border-electric-blue/30"
                  >
                    <div className="relative h-40 bg-obsidian">
                      {realImg ? (
                        <SafeImage
                          src={realImg}
                          alt={s.name}
                          sizes="33vw"
                          className="object-cover"
                          fallbackLabel={sMfr}
                          fallbackSublabel={s.name}
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                          <span className="font-mono text-[13px] text-text-ghost">{sMfr}</span>
                          <span className="mt-1 text-xs font-semibold text-text-tertiary">{s.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-mono text-[13px] text-text-ghost">{sMfr}</p>
                      <h3 className="font-semibold text-text-primary transition-colors group-hover:text-electric-blue">
                        {s.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-text-secondary">
                          {s.price_current != null ? fmtPrice(s.price_current) : "Contact for pricing"}
                        </span>
                        {s.robo_score != null && s.robo_score > 0 && (
                          <RoboScoreBadge score={s.robo_score} />
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
          <div className="section-label mb-4">
            <span className="font-mono text-[13px] tracking-widest">[FAQ] COMMON QUESTIONS</span>
          </div>
          <div className="space-y-4">
            {[
              {
                q: `How much does the ${robot.name} cost?`,
                a: robot.price_current != null
                  ? `The ${robot.name} is currently priced at ${fmtPrice(robot.price_current)}${robot.price_msrp != null && robot.price_msrp !== robot.price_current ? ` (MSRP ${fmtPrice(robot.price_msrp)})` : ""}. Total cost of ownership including maintenance, integration, and training is typically 1.5-2.5x the purchase price over 5 years.`
                  : `Contact ${mfr?.name || "the manufacturer"} directly for current pricing. Pricing for ${cat?.name || "this category"} robots varies significantly based on configuration and deployment requirements.`,
              },
              {
                q: `What certification do I need to operate the ${robot.name}?`,
                a: `Operators should hold at minimum an RCO Foundation (Level 1) certification. For programming and integration work, RCO Specialist (Level 2) is recommended. ${robot.operator_training_hours ? `${mfr?.name} estimates ${robot.operator_training_hours} hours of operator training.` : ""}`,
              },
              {
                q: `How long does it take to deploy the ${robot.name}?`,
                a: robot.deployment_weeks_min != null
                  ? `Typical deployment takes ${robot.deployment_weeks_min}${robot.deployment_weeks_max ? `-${robot.deployment_weeks_max}` : ""} weeks including site assessment, installation, integration, and operator training.`
                  : `Deployment timelines for ${cat?.name || "this category"} robots typically range from 2-12 weeks depending on facility complexity and integration requirements.`,
              },
              {
                q: `Should I buy, lease, or hire the ${robot.name}?`,
                a: `Buy if you plan to use it for 3+ years at high utilization. Lease (typically $${robot.price_current ? Math.round(robot.price_current / 36).toLocaleString() : "varies"}/month) if you want flexibility and upgrades. Hire through RoboWork if you need it for a project or pilot — no capital expenditure required.`,
              },
              {
                q: `How does the ${robot.name} compare to alternatives?`,
                a: `${robot.robo_score != null ? `With a RoboScore of ${robot.robo_score}/100, the ${robot.name} scores ${robot.robo_score >= 80 ? "in the top tier" : robot.robo_score >= 60 ? "competitively" : "below average"} for ${cat?.name || "its category"}.` : ""} Use our comparison tool to evaluate it against up to 2 other robots across all 8 scoring dimensions.`,
              },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-lg border border-border bg-obsidian-surface">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-text-primary transition-colors hover:text-electric-blue">
                  {faq.q}
                </summary>
                <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-text-secondary">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT STEP ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/compare"
              className="group rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:border-electric-blue/30"
            >
              <p className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">Next</p>
              <p className="mt-1 text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                Compare with alternatives
              </p>
              <p className="mt-1 text-xs text-text-tertiary">Side-by-side across every dimension.</p>
            </Link>
            <Link
              href="/tools/tco-calculator"
              className="group rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:border-electric-blue/30"
            >
              <p className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">Next</p>
              <p className="mt-1 text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                Calculate 5-year total cost
              </p>
              <p className="mt-1 text-xs text-text-tertiary">Purchase + maintenance + integration.</p>
            </Link>
            <Link
              href="/advisor"
              className="group rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:border-electric-blue/30"
            >
              <p className="font-mono text-[13px] uppercase tracking-widest text-text-ghost">Next</p>
              <p className="mt-1 text-sm font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                Get a deployment recommendation
              </p>
              <p className="mt-1 text-xs text-text-tertiary">Tell Robotimus your use case and budget.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
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

/** Plain English translations for key robot specs */
function specTranslation(key: string, value: unknown): string | null {
  const v = Number(value);
  const s = String(value).toLowerCase();
  switch (key) {
    case "payload_kg":
      return v <= 5 ? "Handles light assembly and pick-and-place" : v <= 20 ? "Medium-duty industrial tasks" : "Heavy-duty material handling";
    case "reach_mm":
      return v <= 500 ? "Compact workspace" : v <= 1000 ? "Standard desktop/benchtop reach" : "Extended reach for large workspaces";
    case "repeatability":
      return s.includes("0.01") || s.includes("0.02") || s.includes("0.03") ? "Surgical precision — tighter than a human hair" : "Industrial-grade accuracy";
    case "max_speed":
      return "Maximum operational velocity";
    case "battery_hrs":
      return v >= 8 ? "Full shift operation without recharging" : v >= 4 ? "Half-shift operation, mid-shift charge needed" : "Short-duration tasks, frequent charging";
    case "ip_rating":
      return s.includes("67") || s.includes("68") ? "Fully waterproof and dustproof" : s.includes("54") || s.includes("55") ? "Dust and splash resistant — suitable for most factory floors" : s.includes("2") ? "Indoor use only — not rated for harsh environments" : null;
    case "dof":
      return v >= 7 ? "Human-like dexterity — complex manipulation" : v === 6 ? "Full 6-axis industrial capability" : v === 4 ? "4-axis — optimized for high-speed pick-and-place" : null;
    case "weight_kg":
      return v <= 10 ? "Portable — one person can move it" : v <= 50 ? "Requires two people or a cart" : "Permanently mounted — crane installation required";
    case "collaborative":
      return s === "true" || s === "yes" ? "Safe to work alongside humans without safety caging" : "Requires safety fencing or separation monitoring";
    case "charge_time_hrs":
      return v <= 1 ? "Fast charge — minimal downtime" : v <= 3 ? "Standard charge time" : "Extended charge — plan for overnight";
    default:
      return null;
  }
}
