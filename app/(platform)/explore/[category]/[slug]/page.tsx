import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreRing, RoboScoreBadge, ScoreBar } from "@/components/ui/robo-score";
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
import { cn } from "@/lib/utils/cn";

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
  const b = robot as unknown as Record<string, unknown>;

  // Spec grouping
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
      <nav className="sticky top-[57px] z-20 hidden border-b border-border bg-white/95 backdrop-blur-sm md:block">
        <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-6">
          {[
            { id: "overview", label: "Overview" },
            { id: "roi", label: "ROI Calculator" },
            ...(breakdown ? [{ id: "score", label: "RoboScore" }] : []),
            { id: "specs", label: "Specs" },
            ...(expertReviews.length > 0 ? [{ id: "reviews", label: "Reviews" }] : []),
            { id: "buy", label: "Pricing" },
            ...(similar.length > 0 ? [{ id: "similar", label: "Alternatives" }] : []),
          ].map((s) => (
            <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap border-b-2 border-transparent px-4 py-3.5 text-xs text-neutral-500 transition-colors hover:border-green hover:text-foreground">{s.label}</a>
          ))}
        </div>
      </nav>

      {/* ══ SECTION 1 — HERO ══ */}
      <section id="overview" className="scroll-mt-24 border-b border-border px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Browse", href: "/explore" }, { name: cat?.name || "", href: `/explore/${categorySlug}` }, { name: robot.name, href: `/explore/${categorySlug}/${robot.slug}` }]} />

          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Hero image */}
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-neutral-100 lg:h-80 lg:w-[420px] lg:shrink-0">
              {robotImages.length > 0 && robotImages[0].url && !robotImages[0].url.includes("unsplash") ? (
                <SafeImage src={robotImages[0].url} alt={robotImages[0].alt || robot.name} sizes="(max-width:1024px) 100vw, 420px" className="object-cover" priority fallbackLabel={mfr?.name} fallbackSublabel={robot.name} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 px-6 text-center">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-300">{mfr?.name}</span>
                  <span className="mt-2 text-lg font-bold text-neutral-400">{robot.name}</span>
                </div>
              )}
            </div>

            {/* Hero content */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <CompanyLogo logoUrl={(mfr as unknown as Record<string, unknown>)?.logo_url as string | null} name={mfr?.name || ""} height={28} />
                    <Link href={`/manufacturers/${mfr?.slug}`} className="text-sm text-neutral-500 hover:text-blue">{mfr?.name}</Link>
                    <SaveRobotButton robotId={robot.id} />
                  </div>
                  <h1 className="mt-1 font-display text-3xl font-bold text-foreground sm:text-4xl">{robot.name}</h1>
                </div>
                {robot.robo_score != null && robot.robo_score > 0 && (
                  <a href="#score" className="shrink-0">
                    <RoboScoreRing score={robot.robo_score} size={80} />
                  </a>
                )}
              </div>

              <p className="mt-3 leading-relaxed text-neutral-600">{robot.description_short}</p>

              {/* Stat pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {robot.price_current != null && (
                  <StatPill label="Price" value={fmtPrice(robot.price_current)} />
                )}
                {specs.payload_kg != null && <StatPill label="Payload" value={`${String(specs.payload_kg)}kg`} />}
                {specs.reach_mm != null && <StatPill label="Reach" value={`${String(specs.reach_mm)}mm`} />}
                {specs.battery_hrs != null && <StatPill label="Battery" value={`${String(specs.battery_hrs)}h`} />}
                {specs.suction_pa != null && <StatPill label="Suction" value={`${Number(specs.suction_pa).toLocaleString()}Pa`} />}
                {specs.max_speed != null && <StatPill label="Speed" value={String(specs.max_speed)} />}
              </div>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {robot.affiliate_url ? (
                  <a href={robot.affiliate_url} target="_blank" rel="sponsored noopener noreferrer" className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Get Quote
                  </a>
                ) : mfr?.website ? (
                  <a href={mfr.website} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                    Get Quote from {mfr.name}
                  </a>
                ) : null}
                <Link href="/advisor" className="rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-blue">
                  Ask AI Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — BUSINESS IMPACT ══ */}
      {robot.price_current != null && (
        <section className="border-b border-border px-4 py-10">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            <ImpactCard icon="&#128101;" title="Workers augmented" description={specs.payload_kg != null ? `Handles tasks requiring up to ${String(specs.payload_kg)}kg lifting capacity` : `Automates repetitive ${cat?.name?.toLowerCase() || "operational"} tasks`} />
            <ImpactCard icon="&#9201;" title="Time saved per day" description={specs.battery_hrs != null ? `Operates up to ${String(specs.battery_hrs)} hours per charge with minimal downtime` : "Runs continuously during operational shifts without breaks"} />
            <ImpactCard icon="&#128200;" title="Est. payback period" description={robot.price_current! < 5000 ? "Typically under 6 months for consumer applications" : robot.price_current! < 50000 ? "Typically 12-24 months at standard utilization" : "Typically 18-36 months depending on utilization and labor costs"} />
          </div>
        </section>
      )}

      {/* ══ SECTION 3 — ROI CALCULATOR ══ */}
      <Section title="ROI Calculator" id="roi" subtitle="Estimate your return based on your operation's specifics">
        <RoiCalculatorStandalone robotName={robot.name} robotPrice={robot.price_current} robotSlug={`${categorySlug}/${robot.slug}`} />
      </Section>

      {/* ══ SECTION 4 — ROBOSCORE BREAKDOWN ══ */}
      {breakdown && (
        <Section title="RoboScore Breakdown" id="score" subtitle={`How ${robot.name} scores across 8 evaluation dimensions`}>
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-3">
              {DIMENSIONS.map((dim) => {
                const score = breakdown[dim.key];
                return (
                  <div key={dim.key}>
                    <ScoreBar label={dim.label} score={score} weight={`${Math.round(dim.weight * 100)}%`} />
                  </div>
                );
              })}
            </div>
            <div className="rounded-xl border border-border bg-neutral-50 p-5">
              <RoboScoreRing score={robot.robo_score!} size={100} />
              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                RoboScore is a weighted composite of 8 dimensions, independently evaluated by the Robotomated editorial team.
              </p>
              <Link href="/methodology" className="mt-3 block text-xs text-blue hover:underline">Read our scoring methodology →</Link>
            </div>
          </div>
        </Section>
      )}

      {/* ══ SECTION 5 — FULL SPECS ══ */}
      {Object.keys(specs).length > 0 && (
        <Section title="Technical Specifications" id="specs">
          <div className="space-y-6">
            {specGroups.map(([group, entries]) => (
              <div key={group}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{group}</h3>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {entries.map(([key, value], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50/60"}>
                          <td className="px-4 py-2.5 font-medium text-neutral-500 sm:w-48">{fmtKey(key)}</td>
                          <td className="px-4 py-2.5 font-mono text-foreground">{fmtVal(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ══ SECTION 6 — EXPERT REVIEWS ══ */}
      {expertReviews.length > 0 && (
        <Section title="Expert Reviews" id="reviews" subtitle={`What independent reviewers say about the ${robot.name}`}>
          <div className="space-y-4">
            {expertReviews.map((review) => (
              <ExpertReviewCard key={review.id} title={review.title} body={review.body} roboScore={review.robo_score} scoreBreakdown={review.score_breakdown as RoboScoreBreakdown | null} pros={review.pros as string[]} cons={review.cons as string[]} verdict={review.verdict} publishedAt={review.published_at} />
            ))}
          </div>
        </Section>
      )}

      {/* ══ SECTION 7 — COMMUNITY REVIEWS ══ */}
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

      {/* ══ SECTION 8 — PRICING + WHERE TO BUY ══ */}
      <Section title="Pricing & Where to Buy" id="buy">
        <div className="mb-6 rounded-xl border border-border bg-white p-6">
          <div className="flex flex-wrap items-baseline gap-3">
            <PriceDisplay price={robot.price_current} status={robot.status} size="lg" />
            {robot.price_msrp != null && robot.price_current != null && robot.price_msrp > robot.price_current && (
              <span className="font-mono text-sm text-neutral-400 line-through">${robot.price_msrp.toLocaleString()}</span>
            )}
          </div>
          {robot.price_current != null && robot.price_current > 50000 && (
            <p className="mt-2 text-xs text-neutral-500">Financing typically available through manufacturer or equipment leasing partners.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {robot.affiliate_url ? (
              <a href={robot.affiliate_url} target="_blank" rel="sponsored noopener noreferrer" className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                Request Quote from {mfr?.name}
              </a>
            ) : mfr?.website ? (
              <a href={mfr.website} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                Visit {mfr.name}
              </a>
            ) : null}
          </div>
        </div>
        <PriceComparison robotSlug={robot.slug} prices={(priceHistory || []).map((p) => ({ retailer: p.retailer, price: p.price, currency: "USD" }))} affiliateUrl={robot.affiliate_url} manufacturerWebsite={mfr?.website || null} />
        <AffiliateDisclosureInline />
        {(priceHistory || []).length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Price History</h3>
            <PriceChart data={priceHistory || []} />
          </div>
        )}
      </Section>

      {/* ══ SECTION 9 — SIMILAR ROBOTS ══ */}
      {similar.length > 0 && (
        <Section title="Alternatives to Consider" id="similar" subtitle={`Other ${cat?.name || ""} robots to evaluate`}>
          <div className="grid gap-4 sm:grid-cols-3">
            {similar.map((s, i) => {
              const sCatSlug = (s.robot_categories as { slug: string } | null)?.slug || categorySlug;
              const sMfr = (s.manufacturers as { name: string } | null)?.name || "";
              const sImgs = (Array.isArray(s.images) ? s.images : []) as { url: string }[];
              const realImg = sImgs[0]?.url && !sImgs[0].url.includes("unsplash") ? sImgs[0].url : null;
              const label = i === 0 ? "Best alternative" : i === 1 ? "Also consider" : "Budget option";
              return (
                <Link key={s.id} href={`/explore/${sCatSlug}/${s.slug}`} className="group overflow-hidden rounded-xl border border-border bg-white transition-all hover:-translate-y-1 hover:border-blue/30 hover:shadow-md">
                  <div className="relative h-32 bg-neutral-100">
                    {realImg ? (
                      <SafeImage src={realImg} alt={s.name} sizes="33vw" className="object-cover" fallbackLabel={sMfr} fallbackSublabel={s.name} />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 text-center">
                        <span className="text-[10px] text-neutral-300">{sMfr}</span>
                        <span className="text-xs font-semibold text-neutral-400">{s.name}</span>
                      </div>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-neutral-600 backdrop-blur-sm">{label}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] text-neutral-400">{sMfr}</p>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-blue">{s.name}</h3>
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

      {/* ══ AI ADVISOR CTA ══ */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-white to-neutral-50 p-8 text-center sm:p-12">
            <h2 className="font-display text-2xl font-bold text-foreground">Not sure if {robot.name} is right for you?</h2>
            <p className="mt-3 text-neutral-500">Our AI Advisor compares this robot with alternatives for your specific use case, budget, and team.</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/advisor" className="rounded-lg bg-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90">Ask Robot Advisor</Link>
              <Link href="/explore" className="rounded-lg border border-border px-8 py-3 text-sm font-semibold text-foreground hover:border-blue">Browse All Robots</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------
function Section({ title, children, id, subtitle }: { title: string; children: React.ReactNode; id?: string; subtitle?: string }) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="mb-6 mt-1 text-sm text-neutral-500">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-neutral-50 px-3 py-1.5">
      <span className="text-[10px] text-neutral-400">{label} </span>
      <span className="font-mono text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

function ImpactCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-neutral-500">{description}</p>
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

  // Remaining ungrouped specs
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
