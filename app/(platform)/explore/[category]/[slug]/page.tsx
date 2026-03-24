import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { ScoreBreakdownChart } from "@/components/reviews/score-breakdown-chart";
import { AskAiButton } from "@/components/advisor/ask-ai-button";
import { SaveRobotButton } from "@/components/auth/save-robot-button";
import { CompanyLogo } from "@/components/ui/company-logo";
import { RoiCalculator } from "@/components/robots/roi-calculator";
import { TcoBreakdown } from "@/components/robots/tco-breakdown";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

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

interface ApplicationRow {
  id: string; application_name: string; industry: string;
  task_description: string | null; time_savings_percent: number | null;
  cost_savings_percent: number | null; labor_savings_description: string | null;
  cycle_time_seconds: number | null; deployment_time_days: number | null;
  difficulty: string | null; real_world_example: string | null;
}

interface FinancingRow {
  id: string; provider: string; type: string; monthly_payment: number | null;
  term_months: number | null; down_payment_percent: number | null;
  includes_maintenance: boolean; includes_support: boolean; notes: string | null;
}

interface Props { params: Promise<{ category: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("robots").select("name, description_short, manufacturers(name)")
    .eq("slug", slug).single().returns<{ name: string; description_short: string | null; manufacturers: { name: string } }>();
  if (!data) return { title: "Robot Not Found" };
  return {
    title: `${data.name} by ${data.manufacturers?.name} — Review, Specs & Pricing`,
    description: data.description_short || `Detailed review, specs, ROI calculator, and pricing for ${data.name}.`,
  };
}

export default async function RobotDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const supabase = createServerClient();

  const [robotRes] = await Promise.all([
    supabase.from("robots").select("*, manufacturers(name, slug, country, website), robot_categories(name, slug)")
      .eq("slug", slug).single().returns<RobotDetail>(),
  ]);

  const robot = robotRes.data;
  if (!robot) notFound();

  // Parallel fetches using robot.id
  const [{ data: reviews }, { data: priceHistory }, { data: similarData }, { data: applications }, { data: financing }] = await Promise.all([
    supabase.from("reviews").select("id, review_type, title, body, robo_score, score_breakdown, pros, cons, verdict, verified_purchase, published_at, users(name)")
      .eq("robot_id", robot.id).not("published_at", "is", null).order("published_at", { ascending: false }).returns<ReviewRow[]>(),
    supabase.from("price_history").select("recorded_at, price, retailer")
      .eq("robot_id", robot.id).order("recorded_at", { ascending: true }).returns<PricePoint[]>(),
    supabase.from("robots").select("id, slug, name, robo_score, price_current, description_short, images, manufacturers(name), robot_categories(slug)")
      .eq("category_id", robot.category_id).neq("id", robot.id).eq("status", "active")
      .order("robo_score", { ascending: false, nullsFirst: false }).limit(3).returns<SimilarRobot[]>(),
    supabase.from("robot_applications").select("*").eq("robot_id", robot.id).returns<ApplicationRow[]>(),
    supabase.from("financing_options").select("*").eq("robot_id", robot.id).returns<FinancingRow[]>(),
  ]);

  const breakdown = robot.score_breakdown as RoboScoreBreakdown | null;
  const specs = robot.specs as Record<string, unknown>;
  const robotImages = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];
  const mfr = robot.manufacturers;
  const cat = robot.robot_categories;
  const expertReview = (reviews || []).find((r) => r.review_type === "expert");
  const communityReviews = (reviews || []).filter((r) => r.review_type === "community");
  const similar = similarData || [];
  const apps = applications || [];
  const fins = financing || [];
  const keySpecs = Object.entries(specs).slice(0, 6);

  // Buyer fields — cast through unknown since select("*") returns extra columns
  const b = robot as unknown as Record<string, unknown>;
  const hasBuyerData = !!(b.labor_replaced_fte || b.annual_maintenance_cost || b.training_required);
  const hasPower = !!(b.power_source || b.battery_runtime_hrs || b.power_consumption_watts);
  const hasSafety = (Array.isArray(b.certifications) && b.certifications.length > 0) || (Array.isArray(b.safety_features) && b.safety_features.length > 0);

  return (
    <div>
      <AskAiButton robotName={robot.name} />
      <ProductSchema name={robot.name} slug={robot.slug} description={robot.description_short || ""} manufacturer={mfr?.name || ""} price={robot.price_current} score={robot.robo_score} categorySlug={categorySlug} model={robot.model_number} status={robot.status} />
      {expertReview && <ReviewSchema robotName={robot.name} reviewTitle={expertReview.title} reviewBody={expertReview.body.slice(0, 200)} author="Robotomated Editorial" score={expertReview.robo_score} publishedAt={expertReview.published_at} />}

      {/* ── STICKY SECTION NAV ── */}
      <SectionNav robotName={robot.name} hasApps={apps.length > 0} hasBreakdown={!!breakdown} hasReview={!!expertReview} hasSimilar={similar.length > 0} hasBuyerData={hasBuyerData} />

      {/* ── 1. HERO ── */}
      <section id="overview" className="scroll-mt-24 border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Browse", href: "/explore" }, { name: cat?.name || "Category", href: `/explore/${categorySlug}` }, { name: robot.name, href: `/explore/${categorySlug}/${robot.slug}` }]} />

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="relative h-64 w-full overflow-hidden rounded-xl lg:h-80 lg:w-96 lg:shrink-0">
              {robotImages.length > 0 ? (
                <Image src={robotImages[0].url} alt={robotImages[0].alt || robot.name} fill sizes="(max-width:1024px) 100vw, 384px" className="object-cover" priority />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-steel to-navy-lighter"><span className="text-4xl opacity-20">&#129302;</span></div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <CompanyLogo logoUrl={(mfr as unknown as Record<string, unknown>)?.logo_url as string | null} name={mfr?.name || ""} size={28} />
                    <Link href={`/manufacturers/${mfr?.slug}`} className="text-sm text-muted hover:text-blue">{mfr?.name}</Link>
                    <SaveRobotButton robotId={robot.id} />
                  </div>
                  <h1 className="font-display text-3xl font-bold sm:text-4xl">{robot.name}</h1>
                  {robot.model_number && <p className="mt-1 font-mono text-xs text-muted/60">Model: {robot.model_number}</p>}
                </div>
                {robot.robo_score != null && robot.robo_score > 0 && <RoboScoreRing score={robot.robo_score} />}
              </div>

              <p className="mt-4 leading-relaxed text-muted">{robot.description_short}</p>

              {/* Price */}
              <div className="mt-5">
                <PriceDisplay price={robot.price_current} status={robot.status} size="lg" />
                {robot.price_msrp != null && robot.price_current != null && robot.price_msrp > robot.price_current && (
                  <span className="ml-3 font-mono text-sm text-muted line-through">${robot.price_msrp.toLocaleString()}</span>
                )}
                {b.price_lease_monthly ? (
                  <p className="mt-1 text-sm text-muted">or from <span className="font-mono font-semibold text-blue">${(b.price_lease_monthly as number).toLocaleString()}/mo</span> lease</p>
                ) : null}
              </div>

              {/* CTAs */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link href={`/best-price/${robot.slug}`} className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90">Where to Buy</Link>
                <Link href="/explore" className="rounded-lg border border-white/[0.1] px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-white/[0.04]">Compare</Link>
              </div>

              {mfr?.website && (
                <a href={mfr.website} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-blue hover:underline">
                  Visit {mfr.name} Official Site <ExtIcon />
                </a>
              )}

              {/* Key specs */}
              {keySpecs.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {keySpecs.map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
                      <span className="text-[10px] text-muted/60">{fmtKey(key)} </span>
                      <span className="font-mono text-xs font-semibold">{fmtVal(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ROI CALCULATOR ── */}
      {hasBuyerData && (
        <Section title="ROI & Cost Analysis" id="roi">
          <div className="grid gap-6 lg:grid-cols-2">
            <RoiCalculator price={robot.price_current} priceLeaseMonthly={b.price_lease_monthly as number | null} priceType={b.price_type as string | null} integrationCost={b.integration_cost_estimate as number | null} trainingCost={b.training_cost as number | null} annualMaintenance={b.annual_maintenance_cost as number | null} laborReplacedFte={b.labor_replaced_fte as number | null} powerConsumptionWatts={b.power_consumption_watts as number | null} robotName={robot.name} />
            <TcoBreakdown price={robot.price_current} priceType={b.price_type as string | null} priceLeaseMonthly={b.price_lease_monthly as number | null} integrationCost={b.integration_cost_estimate as number | null} trainingCost={b.training_cost as number | null} annualMaintenance={b.annual_maintenance_cost as number | null} warrantyYears={b.warranty_years as number | null} expectedLifespan={b.expected_lifespan_years as number | null} spareParts={b.spare_parts_availability as string | null} powerConsumptionWatts={b.power_consumption_watts as number | null} trainingRequired={b.training_required as string | null} financingNotes={b.financing_notes as string | null} />
          </div>
        </Section>
      )}

      {/* ── 3. APPLICATIONS ── */}
      {apps.length > 0 && (
        <Section title="Applications & Use Cases" id="applications">
          <div className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <div key={app.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{app.application_name}</h3>
                    <p className="text-xs text-muted/60">{app.industry}</p>
                  </div>
                  {app.difficulty && (
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium",
                      app.difficulty === "easy" ? "bg-green/10 text-green" :
                      app.difficulty === "medium" || app.difficulty === "basic" ? "bg-blue/10 text-blue" :
                      "bg-orange/10 text-orange"
                    )}>{app.difficulty}</span>
                  )}
                </div>
                {app.task_description && <p className="mt-2 text-xs leading-relaxed text-muted/80">{app.task_description}</p>}
                <div className="mt-3 flex flex-wrap gap-3">
                  {app.time_savings_percent && <Stat label="Time Saved" value={`${app.time_savings_percent}%`} color="text-green" />}
                  {app.cost_savings_percent && <Stat label="Cost Saved" value={`${app.cost_savings_percent}%`} color="text-green" />}
                  {app.deployment_time_days != null && <Stat label="Deploy" value={`${app.deployment_time_days}d`} color="text-blue" />}
                  {app.cycle_time_seconds && <Stat label="Cycle" value={`${app.cycle_time_seconds}s`} color="text-muted" />}
                </div>
                {app.labor_savings_description && <p className="mt-2 text-[11px] text-muted/70">{app.labor_savings_description}</p>}
                {app.real_world_example && (
                  <div className="mt-3 rounded-lg border border-blue/10 bg-blue/5 px-3 py-2">
                    <p className="text-[10px] font-medium text-blue">Real-world deployment</p>
                    <p className="mt-0.5 text-[11px] text-muted">{app.real_world_example}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 4. SCORE BREAKDOWN ── */}
      {breakdown && (
        <Section title="RoboScore Breakdown" id="score">
          <div className="max-w-lg">
            <ScoreBreakdownChart breakdown={breakdown} />
          </div>
          <p className="mt-4 text-xs text-muted">
            <Link href="/methodology" className="text-blue hover:underline">Read our scoring methodology</Link>
          </p>
        </Section>
      )}

      {/* ── 5. POWER & BATTERY ── */}
      {hasPower && (
        <Section title="Power & Operation">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!!b.power_source && <InfoCard label="Power Source" value={String(b.power_source).replace(/^\w/, c => c.toUpperCase())} />}
            {!!b.battery_runtime_hrs && <InfoCard label="Runtime" value={`${b.battery_runtime_hrs} hours`} />}
            {!!b.charge_time_hrs && <InfoCard label="Charge Time" value={`${b.charge_time_hrs} hours`} />}
            {!!b.hot_swap_battery && <InfoCard label="Hot-Swap Battery" value="Yes" color="text-green" />}
            {!!b.power_consumption_watts && <InfoCard label="Power Draw" value={`${b.power_consumption_watts}W`} />}
            {!!b.operating_voltage && <InfoCard label="Voltage" value={String(b.operating_voltage)} />}
            {!!b.operating_environment && <InfoCard label="Environment" value={String(b.operating_environment).replace(/^\w/, c => c.toUpperCase())} />}
            {!!b.temperature_range && <InfoCard label="Temp Range" value={String(b.temperature_range)} />}
            {!!b.noise_level_db && <InfoCard label="Noise Level" value={`${b.noise_level_db} dB`} />}
          </div>
        </Section>
      )}

      {/* ── 6. FINANCING ── */}
      {fins.length > 0 && (
        <Section title="Financing Options">
          <div className="grid gap-4 sm:grid-cols-2">
            {fins.map((f) => (
              <div key={f.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{f.provider}</h3>
                    <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">{f.type}</span>
                  </div>
                  {f.monthly_payment && (
                    <span className="font-mono text-lg font-bold text-green">${f.monthly_payment.toLocaleString()}<span className="text-xs font-normal text-muted">/mo</span></span>
                  )}
                </div>
                {f.term_months != null && f.term_months > 0 && <p className="mt-2 text-xs text-muted">{f.term_months}-month term{f.down_payment_percent ? ` · ${f.down_payment_percent}% down` : ""}</p>}
                {f.term_months === 0 && <p className="mt-2 text-xs text-muted">Month-to-month · Cancel anytime</p>}
                <div className="mt-2 flex gap-3 text-[10px]">
                  {f.includes_maintenance && <span className="text-green">Maintenance included</span>}
                  {f.includes_support && <span className="text-green">Support included</span>}
                </div>
                {f.notes && <p className="mt-2 text-[11px] text-muted/70">{f.notes}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 7. FULL SPECS ── */}
      {Object.keys(specs).length > 0 && (
        <Section title="Full Specifications" id="specs">
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.03]"}>
                    <td className="px-4 py-3 font-medium text-muted">{fmtKey(key)}</td>
                    <td className="px-4 py-3 font-mono">{fmtVal(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {/* ── 8. SAFETY & CERTIFICATIONS ── */}
      {hasSafety && (
        <Section title="Safety & Certifications">
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.isArray(b.certifications) && b.certifications.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {(b.certifications as string[]).map((cert) => (
                    <span key={cert} className="rounded-full border border-green/20 bg-green/5 px-3 py-1 text-xs font-medium text-green">{cert}</span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(b.safety_features) && b.safety_features.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted">Safety Features</h3>
                <ul className="space-y-1.5">
                  {(b.safety_features as string[]).map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-muted/80">
                      <svg className="h-3.5 w-3.5 shrink-0 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* ── 9. EXPERT REVIEW ── */}
      {expertReview && (
        <Section title="Expert Review" id="reviews">
          <ExpertReviewCard title={expertReview.title} body={expertReview.body} roboScore={expertReview.robo_score} scoreBreakdown={expertReview.score_breakdown as RoboScoreBreakdown | null} pros={expertReview.pros as string[]} cons={expertReview.cons as string[]} verdict={expertReview.verdict} publishedAt={expertReview.published_at} />
        </Section>
      )}

      {/* ── 10. COMMUNITY REVIEWS ── */}
      <Section title="Community Reviews">
        {communityReviews.length > 0 && (
          <div className="mb-6 space-y-4">
            {communityReviews.map((review) => (
              <CommunityReviewCard key={review.id} title={review.title} body={review.body} roboScore={review.robo_score} pros={review.pros as string[]} cons={review.cons as string[]} verifiedPurchase={review.verified_purchase} authorName={(review.users as { name: string | null } | null)?.name || null} publishedAt={review.published_at} />
            ))}
          </div>
        )}
        <CommunityReviewForm robotId={robot.id} robotName={robot.name} />
      </Section>

      {/* ── 11. WHERE TO BUY + PRICE HISTORY ── */}
      <Section title="Where to Buy" id="buy">
        <PriceComparison robotSlug={robot.slug} prices={(priceHistory || []).map((p) => ({ retailer: p.retailer, price: p.price, currency: "USD" }))} affiliateUrl={robot.affiliate_url} manufacturerWebsite={mfr?.website || null} />
        <AffiliateDisclosureInline />
      </Section>

      <Section title="Price History">
        <PriceChart data={priceHistory || []} />
      </Section>

      {/* ── 12. SIMILAR ROBOTS ── */}
      {similar.length > 0 && (
        <Section title="Similar Robots" id="similar">
          <div className="grid gap-4 sm:grid-cols-3">
            {similar.map((s) => {
              const sCatSlug = (s.robot_categories as { slug: string } | null)?.slug || categorySlug;
              const sMfr = (s.manufacturers as { name: string } | null)?.name || "";
              const sImgs = (Array.isArray(s.images) ? s.images : []) as { url: string }[];
              return (
                <Link key={s.id} href={`/explore/${sCatSlug}/${s.slug}`} className="glass glass-hover group rounded-xl transition-all hover:-translate-y-1">
                  <div className="relative h-32 overflow-hidden rounded-t-xl">
                    {sImgs[0]?.url ? <Image src={sImgs[0].url} alt={s.name} fill sizes="33vw" className="object-cover" /> : <div className="flex h-full items-center justify-center bg-gradient-to-br from-steel to-navy-lighter"><span className="opacity-20">&#129302;</span></div>}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-muted/60">{sMfr}</p>
                    <h3 className="font-semibold transition-colors group-hover:text-blue">{s.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <PriceDisplay price={s.price_current} size="sm" />
                      {s.robo_score != null && s.robo_score > 0 && <RoboScoreBadge score={s.robo_score} />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── AI ADVISOR CTA ── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="glass rounded-2xl p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold">Not sure if this is right for you?</h2>
            <p className="mt-3 text-muted">Our Robot Advisor can compare {robot.name} with alternatives for your specific needs.</p>
            <Link href="/advisor" className="mt-6 inline-block rounded-lg bg-gradient-to-r from-blue to-violet px-8 py-3 text-sm font-semibold text-white hover:opacity-90">Ask Robot Advisor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 font-display text-xl font-bold text-foreground">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function SectionNav({ robotName, hasApps, hasBreakdown, hasReview, hasSimilar, hasBuyerData }: {
  robotName: string; hasApps: boolean; hasBreakdown: boolean; hasReview: boolean; hasSimilar: boolean; hasBuyerData: boolean;
}) {
  const sections = [
    { id: "overview", label: "Overview" },
    ...(hasBuyerData ? [{ id: "roi", label: "Cost & ROI" }] : []),
    ...(hasApps ? [{ id: "applications", label: "Applications" }] : []),
    ...(hasBreakdown ? [{ id: "score", label: "Score" }] : []),
    { id: "specs", label: "Specs" },
    ...(hasReview ? [{ id: "reviews", label: "Reviews" }] : []),
    { id: "buy", label: "Where to Buy" },
    ...(hasSimilar ? [{ id: "similar", label: "Alternatives" }] : []),
  ];
  return (
    <nav className="sticky top-[57px] z-20 hidden border-b border-border bg-white/95 backdrop-blur-sm md:block">
      <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-6">
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}
            className="whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-xs text-neutral-500 transition-colors hover:border-blue hover:text-foreground">
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function InfoCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="glass rounded-lg p-3">
      <p className="text-[10px] text-muted/60">{label}</p>
      <p className={cn("font-mono text-sm font-semibold", color || "text-foreground")}>{value}</p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <span className={cn("font-mono text-sm font-bold", color)}>{value}</span>
      <span className="ml-1 text-[10px] text-muted/50">{label}</span>
    </div>
  );
}

function ExtIcon() {
  return <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
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
