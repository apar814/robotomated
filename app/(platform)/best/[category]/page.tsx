import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge, RoboScoreRing, ScoreBar } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { FaqSchema, ProductSchema } from "@/components/seo/json-ld";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

const YEAR = new Date().getFullYear();

interface CatDetail { id: string; slug: string; name: string; description: string | null }

interface BestRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  price_current: number | null;
  description_short: string | null;
  description_long: string | null;
  status: string;
  specs: Record<string, unknown>;
  manufacturers: { name: string; slug: string } | null;
  robot_categories: { slug: string } | null;
}

interface Props { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data } = await supabase.from("robot_categories").select("slug").returns<{ slug: string }[]>();
  return (data || []).map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("robot_categories").select("name").eq("slug", slug).single().returns<{ name: string }>();
  if (!data) return { title: "Category Not Found" };
  return {
    title: `Best ${data.name} Robots ${YEAR} — Top Picks & Reviews`,
    description: `Our picks for the best ${data.name.toLowerCase()} robots in ${YEAR}. Ranked by RoboScore with detailed comparisons, specs, and expert analysis.`,
    alternates: { canonical: `/best/${slug}` },
  };
}

export default async function BestCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const supabase = createServerClient();

  const { data: cat } = await supabase
    .from("robot_categories").select("id, slug, name, description").eq("slug", slug).single().returns<CatDetail>();
  if (!cat) notFound();

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, robo_score, score_breakdown, price_current, description_short, description_long, status, specs, manufacturers(name, slug), robot_categories(slug)")
    .eq("category_id", cat.id)
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false, nullsFirst: false })
    .returns<BestRobot[]>();

  const ranked = robots || [];

  // Get all categories for cross-linking
  const { data: allCats } = await supabase
    .from("robot_categories").select("slug, name").order("display_order").returns<{ slug: string; name: string }[]>();

  const faqs = [
    { question: `What is the best ${cat.name.toLowerCase()} robot in ${YEAR}?`, answer: ranked[0] ? `The ${ranked[0].name} by ${(ranked[0].manufacturers as { name: string } | null)?.name || "its manufacturer"} is our top pick with a RoboScore of ${ranked[0].robo_score?.toFixed(1)}/100.` : "Check back soon for our rankings." },
    { question: `How many ${cat.name.toLowerCase()} robots have you reviewed?`, answer: `We've reviewed and scored ${ranked.length} ${cat.name.toLowerCase()} robots that are currently available.` },
    { question: "What is RoboScore?", answer: "RoboScore is our transparent, 100-point rating system. Each robot is scored across 8 dimensions: Performance, Reliability, Ease of Use, Intelligence, Value, Ecosystem, Safety, and Design. Our methodology is fully public." },
    { question: `What should I look for in a ${cat.name.toLowerCase()} robot?`, answer: cat.description || `Key factors include performance, reliability, ease of use, and value for money. Our RoboScore system weighs all of these dimensions to help you make an informed decision.` },
  ];

  return (
    <div>
      <FaqSchema items={faqs} />
      {ranked.map((r, i) => (
        <ProductSchema
          key={r.id}
          name={r.name}
          slug={r.slug}
          description={r.description_short || ""}
          manufacturer={(r.manufacturers as { name: string } | null)?.name || ""}
          price={r.price_current}
          score={r.robo_score}
          categorySlug={slug}
          status={r.status}
        />
      ))}

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Best Robots", href: "/explore" },
            { name: cat.name, href: `/best/${slug}` },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            Best {cat.name} Robots {YEAR}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {cat.description || `Our top picks for ${cat.name.toLowerCase()} robots, ranked by RoboScore.`}
          </p>
          <p className="mt-2 text-xs text-muted">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </section>

      {/* Ranked list */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl space-y-6">
          {ranked.map((robot, i) => {
            const mfr = (robot.manufacturers as { name: string; slug: string } | null);
            const bd = robot.score_breakdown as RoboScoreBreakdown | null;
            const keySpecs = Object.entries(robot.specs as Record<string, unknown>).slice(0, 4);

            return (
              <div key={robot.id} className="rounded-xl border border-border bg-navy-light p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  {/* Rank badge */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-lighter font-mono text-lg font-bold text-blue">
                    #{i + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted">{mfr?.name}</p>
                        <Link href={`/explore/${slug}/${robot.slug}`}>
                          <h3 className="text-xl font-bold transition-colors hover:text-blue">{robot.name}</h3>
                        </Link>
                      </div>
                      {robot.robo_score != null && <RoboScoreRing score={robot.robo_score} size={80} />}
                    </div>

                    <p className="mt-3 text-sm text-muted">{robot.description_short}</p>

                    {/* Key specs */}
                    {keySpecs.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {keySpecs.map(([k, v]) => (
                          <span key={k} className="rounded-md border border-border bg-navy-lighter px-2.5 py-1 text-xs">
                            <span className="text-muted">{formatKey(k)}:</span>{" "}
                            <span className="font-mono font-medium">{formatVal(v)}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <span className="font-mono text-lg font-semibold">
                        {robot.price_current != null ? `$${robot.price_current.toLocaleString()}` : "Contact"}
                      </span>
                      <Link
                        href={`/explore/${slug}/${robot.slug}`}
                        className="rounded-lg bg-blue px-5 py-2 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
                      >
                        Full Review
                      </Link>
                      {i < ranked.length - 1 && ranked[i + 1] && (
                        <Link
                          href={`/compare/${[robot.slug, ranked[i + 1].slug].sort().join("-vs-")}`}
                          className="rounded-lg border border-border px-5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-navy-lighter hover:text-foreground"
                        >
                          vs {ranked[i + 1].name}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-category links */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-xl font-bold">More Best Robot Guides</h2>
          <div className="flex flex-wrap gap-2">
            {(allCats || []).filter((c) => c.slug !== slug).map((c) => (
              <Link
                key={c.slug}
                href={`/best/${c.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-blue/30 hover:text-foreground"
              >
                Best {c.name} Robots
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <FaqSection items={faqs} />
        </div>
      </section>
    </div>
  );
}

function formatKey(key: string): string {
  return key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (c) => c.toUpperCase());
}
function formatVal(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
