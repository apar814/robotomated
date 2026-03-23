import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreRing, RoboScoreBadge, ScoreBar } from "@/components/ui/robo-score";
import { PriceChart } from "@/components/robots/price-chart";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RobotDetail {
  id: string;
  slug: string;
  name: string;
  manufacturer_id: string;
  category_id: string;
  model_number: string | null;
  year_released: number | null;
  price_msrp: number | null;
  price_current: number | null;
  description_short: string | null;
  description_long: string | null;
  specs: Record<string, unknown>;
  images: { url: string; alt: string }[];
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  affiliate_url: string | null;
  amazon_asin: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  manufacturers: { name: string; slug: string; country: string | null; website: string | null };
  robot_categories: { name: string; slug: string };
}

interface ReviewRow {
  id: string;
  review_type: string;
  title: string;
  body: string;
  robo_score: number | null;
  pros: string[];
  cons: string[];
  verdict: string | null;
  verified_purchase: boolean;
  published_at: string | null;
  users: { name: string | null } | null;
}

interface PricePoint {
  recorded_at: string;
  price: number;
  retailer: string;
}

interface SimilarRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string } | null;
}

// ---------------------------------------------------------------------------
// Dimension config
// ---------------------------------------------------------------------------
const DIMENSIONS: { key: keyof RoboScoreBreakdown; label: string; weight: string }[] = [
  { key: "performance", label: "Performance", weight: "25%" },
  { key: "reliability", label: "Reliability", weight: "20%" },
  { key: "ease_of_use", label: "Ease of Use", weight: "15%" },
  { key: "intelligence", label: "Intelligence", weight: "15%" },
  { key: "value", label: "Value", weight: "10%" },
  { key: "ecosystem", label: "Ecosystem", weight: "8%" },
  { key: "safety", label: "Safety", weight: "5%" },
  { key: "design", label: "Design", weight: "2%" },
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("robots")
    .select("name, description_short, manufacturers(name)")
    .eq("slug", slug)
    .single()
    .returns<{ name: string; description_short: string | null; manufacturers: { name: string } }>();

  if (!data) return { title: "Robot Not Found" };

  return {
    title: `${data.name} by ${data.manufacturers?.name} — Review & Specs`,
    description: data.description_short || `Detailed review, specs, and RoboScore for ${data.name}.`,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function RobotDetailPage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const supabase = createServerClient();

  // Fetch robot + reviews + price history + similar in parallel
  const [robotRes, reviewsRes, priceRes] = await Promise.all([
    supabase
      .from("robots")
      .select("*, manufacturers(name, slug, country, website), robot_categories(name, slug)")
      .eq("slug", slug)
      .single()
      .returns<RobotDetail>(),
    supabase
      .from("reviews")
      .select("id, review_type, title, body, robo_score, pros, cons, verdict, verified_purchase, published_at, users(name)")
      .eq("robot_id", slug) // We'll fix this below
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .returns<ReviewRow[]>(),
    supabase
      .from("price_history")
      .select("recorded_at, price, retailer")
      .order("recorded_at", { ascending: true })
      .returns<PricePoint[]>(),
  ]);

  const robot = robotRes.data;
  if (!robot) notFound();

  // Fetch reviews using the actual robot ID
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, review_type, title, body, robo_score, pros, cons, verdict, verified_purchase, published_at, users(name)")
    .eq("robot_id", robot.id)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .returns<ReviewRow[]>();

  // Fetch price history using robot ID
  const { data: priceHistory } = await supabase
    .from("price_history")
    .select("recorded_at, price, retailer")
    .eq("robot_id", robot.id)
    .order("recorded_at", { ascending: true })
    .returns<PricePoint[]>();

  // Similar robots
  const { data: similarData } = await supabase
    .from("robots")
    .select("id, slug, name, robo_score, price_current, description_short, manufacturers(name), robot_categories(slug)")
    .eq("category_id", robot.category_id)
    .neq("id", robot.id)
    .eq("status", "active")
    .order("robo_score", { ascending: false, nullsFirst: false })
    .limit(3)
    .returns<SimilarRobot[]>();

  const breakdown = robot.score_breakdown as RoboScoreBreakdown | null;
  const specs = robot.specs as Record<string, unknown>;
  const mfr = robot.manufacturers;
  const cat = robot.robot_categories;
  const expertReview = (reviews || []).find((r) => r.review_type === "expert");
  const communityReviews = (reviews || []).filter((r) => r.review_type === "community");
  const similar = similarData || [];

  // Key specs for the strip
  const keySpecs = Object.entries(specs).slice(0, 5);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/explore" className="hover:text-foreground">Explore</Link>
            <span>/</span>
            <Link href={`/explore/${categorySlug}`} className="hover:text-foreground">{cat?.name}</Link>
            <span>/</span>
            <span className="text-foreground">{robot.name}</span>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Image placeholder */}
            <div className="flex h-64 w-full items-center justify-center rounded-xl bg-navy-lighter lg:h-80 lg:w-96 lg:shrink-0">
              <svg viewBox="0 0 24 24" className="h-16 w-16 text-muted/30" fill="none" stroke="currentColor" strokeWidth={0.8}>
                <rect x="4" y="4" width="16" height="12" rx="2" />
                <circle cx="9" cy="10" r="1.5" />
                <circle cx="15" cy="10" r="1.5" />
                <path d="M8 20h8 M10 16v4 M14 16v4" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">{mfr?.name}</p>
                  <h1 className="text-3xl font-bold sm:text-4xl">{robot.name}</h1>
                  {robot.model_number && (
                    <p className="mt-1 font-mono text-xs text-muted">Model: {robot.model_number}</p>
                  )}
                </div>
                {robot.robo_score != null && (
                  <RoboScoreRing score={robot.robo_score} />
                )}
              </div>

              <p className="mt-4 text-muted">{robot.description_short}</p>

              {/* Price + CTA */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {robot.price_current != null ? (
                  <span className="text-2xl font-bold">${robot.price_current.toLocaleString()}</span>
                ) : (
                  <span className="text-lg text-muted">Contact for pricing</span>
                )}
                {robot.price_msrp != null && robot.price_current != null && robot.price_msrp > robot.price_current && (
                  <span className="text-sm text-muted line-through">${robot.price_msrp.toLocaleString()}</span>
                )}
                {robot.affiliate_url && (
                  <a
                    href={robot.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-blue px-6 py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
                  >
                    Buy Now
                  </a>
                )}
                {!robot.affiliate_url && mfr?.website && (
                  <a
                    href={mfr.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter"
                  >
                    Visit Manufacturer
                  </a>
                )}
              </div>

              {/* Key specs strip */}
              {keySpecs.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {keySpecs.map(([key, value]) => (
                    <div key={key} className="rounded-lg border border-border bg-navy-lighter px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-muted">{formatSpecKey(key)}</p>
                      <p className="font-mono text-sm font-semibold">{formatSpecValue(value)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Score Breakdown ── */}
      {breakdown && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">RoboScore Breakdown</h2>
            <div className="max-w-lg space-y-3">
              {DIMENSIONS.map(({ key, label, weight }) => (
                <ScoreBar key={key} label={label} score={breakdown[key]} weight={weight} />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              Scores are 0–100 per dimension. Weights reflect importance in the overall RoboScore.{" "}
              <Link href="/learn/methodology" className="text-blue hover:underline">Read our methodology</Link>.
            </p>
          </div>
        </section>
      )}

      {/* ── Specs Table ── */}
      {Object.keys(specs).length > 0 && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Full Specifications</h2>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-navy-light" : "bg-navy-lighter"}>
                      <td className="px-4 py-3 font-medium text-muted">{formatSpecKey(key)}</td>
                      <td className="px-4 py-3 font-mono">{formatSpecValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Expert Review ── */}
      {expertReview && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Expert Review</h2>
            <div className="rounded-xl border border-border bg-navy-light p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold">{expertReview.title}</h3>
                {expertReview.robo_score != null && <RoboScoreBadge score={expertReview.robo_score} />}
              </div>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">
                {expertReview.body}
              </p>

              {/* Pros / Cons */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(expertReview.pros as string[])?.length > 0 && (
                  <div className="rounded-lg border border-green/20 bg-green/5 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-green">Pros</h4>
                    <ul className="space-y-1">
                      {(expertReview.pros as string[]).map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted">
                          <span className="mt-0.5 text-green">+</span> {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(expertReview.cons as string[])?.length > 0 && (
                  <div className="rounded-lg border border-orange/20 bg-orange/5 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-orange">Cons</h4>
                    <ul className="space-y-1">
                      {(expertReview.cons as string[]).map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted">
                          <span className="mt-0.5 text-orange">−</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {expertReview.verdict && (
                <div className="mt-4 border-t border-border pt-4">
                  <h4 className="text-sm font-semibold">Verdict</h4>
                  <p className="mt-1 text-sm text-muted">{expertReview.verdict}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Community Reviews ── */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Community Reviews</h2>
          {communityReviews.length === 0 ? (
            <div className="rounded-xl border border-border bg-navy-light p-8 text-center">
              <p className="text-muted">No community reviews yet.</p>
              <p className="mt-1 text-sm text-muted">Be the first to review this robot.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {communityReviews.map((review) => (
                <div key={review.id} className="rounded-xl border border-border bg-navy-light p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{review.title}</h4>
                      <p className="mt-0.5 text-xs text-muted">
                        by {(review.users as { name: string | null } | null)?.name || "Anonymous"}
                        {review.verified_purchase && (
                          <span className="ml-2 rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-medium text-green">
                            Verified
                          </span>
                        )}
                      </p>
                    </div>
                    {review.robo_score != null && <RoboScoreBadge score={review.robo_score} />}
                  </div>
                  <p className="mt-3 text-sm text-muted">{review.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Price History ── */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-xl font-bold">Price History</h2>
          <PriceChart data={priceHistory || []} />
        </div>
      </section>

      {/* ── Similar Robots ── */}
      {similar.length > 0 && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-6 text-xl font-bold">Similar Robots</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {similar.map((s) => {
                const sCatSlug = (s.robot_categories as { slug: string } | null)?.slug || categorySlug;
                const sMfr = (s.manufacturers as { name: string } | null)?.name || "";
                return (
                  <Link
                    key={s.id}
                    href={`/explore/${sCatSlug}/${s.slug}`}
                    className="group rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-blue/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted">{sMfr}</p>
                        <h3 className="font-semibold transition-colors group-hover:text-blue">{s.name}</h3>
                      </div>
                      {s.robo_score != null && <RoboScoreBadge score={s.robo_score} />}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted">{s.description_short}</p>
                    {s.price_current != null && (
                      <p className="mt-3 font-mono text-sm font-semibold">${s.price_current.toLocaleString()}</p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── AI Advisor CTA ── */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-border bg-navy-light p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold">Not sure if this is right for you?</h2>
            <p className="mt-3 text-muted">
              Our AI Advisor can help you compare {robot.name} with alternatives based on your specific needs.
            </p>
            <Link
              href="/advisor"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-blue to-violet px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Ask AI Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatSpecKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatSpecValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
