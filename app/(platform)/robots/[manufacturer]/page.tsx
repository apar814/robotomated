import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { FaqSchema, ProductSchema } from "@/components/seo/json-ld";

const YEAR = new Date().getFullYear();

interface MfrDetail {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  founded_year: number | null;
  website: string | null;
  verified: boolean;
}

interface MfrRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  status: string;
  robot_categories: { slug: string; name: string } | null;
}

// ISR: regenerate every hour, render on-demand for uncached pages
export const revalidate = 3600;
export const dynamicParams = true;

interface Props { params: Promise<{ manufacturer: string }> }

export async function generateStaticParams() {
  // Only pre-render top manufacturers at build time to reduce memory usage
  const supabase = createServerClient();
  const { data: robots } = await supabase.from("robots").select("manufacturer_id").eq("status", "active");
  const counts: Record<string, number> = {};
  (robots || []).forEach((r) => { counts[r.manufacturer_id] = (counts[r.manufacturer_id] || 0) + 1; });
  const topIds = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([id]) => id);
  const { data } = await supabase.from("manufacturers").select("slug").in("id", topIds).returns<{ slug: string }[]>();
  return (data || []).map((m) => ({ manufacturer: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { manufacturer: slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("manufacturers").select("name").eq("slug", slug).single().returns<{ name: string }>();
  if (!data) return { title: "Manufacturer Not Found" };
  return {
    title: `Best ${data.name} Robots ${YEAR} — Reviews & Comparison`,
    description: `Explore all ${data.name} robots. Expert RoboScore ratings, specs, and prices. Find the best ${data.name} robot for your needs.`,
    alternates: { canonical: `/robots/${slug}` },
  };
}

export default async function ManufacturerPage({ params }: Props) {
  const { manufacturer: slug } = await params;
  const supabase = createServerClient();

  const { data: mfr } = await supabase
    .from("manufacturers").select("*").eq("slug", slug).single().returns<MfrDetail>();
  if (!mfr) notFound();

  const { data: robots } = await supabase
    .from("robots")
    .select("id, slug, name, robo_score, price_current, description_short, status, robot_categories(slug, name)")
    .eq("manufacturer_id", mfr.id)
    .order("robo_score", { ascending: false, nullsFirst: false })
    .returns<MfrRobot[]>();

  const allRobots = robots || [];
  const activeRobots = allRobots.filter((r) => r.status === "active");

  const faqs = [
    { question: `How many ${mfr.name} robots are available?`, answer: `We currently track ${allRobots.length} ${mfr.name} robots, with ${activeRobots.length} currently available for purchase.` },
    { question: `What is the highest-rated ${mfr.name} robot?`, answer: activeRobots[0] ? `The ${activeRobots[0].name} leads with a RoboScore of ${activeRobots[0].robo_score?.toFixed(1) || "N/A"} out of 100.` : `Check back soon for ratings.` },
    { question: `Where is ${mfr.name} headquartered?`, answer: mfr.country ? `${mfr.name} is based in ${mfr.country}${mfr.founded_year ? `, founded in ${mfr.founded_year}` : ""}.` : `Visit their website for more details.` },
    { question: "How does RoboScore work?", answer: "RoboScore rates robots on 8 dimensions: Performance (25%), Reliability (20%), Ease of Use (15%), Intelligence (15%), Value (10%), Ecosystem (8%), Safety (5%), and Design (2%). All scores are transparent and explainable." },
  ];

  return (
    <div>
      <FaqSchema items={faqs} />

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Manufacturers", href: "/explore" },
            { name: mfr.name, href: `/robots/${slug}` },
          ]} />

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            Best {mfr.name} Robots {YEAR}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            All {allRobots.length} {mfr.name} robots reviewed and rated.
            {mfr.country && ` Based in ${mfr.country}.`}
            {mfr.founded_year && ` Founded ${mfr.founded_year}.`}
          </p>
          <p className="mt-2 text-xs text-muted">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRobots.map((robot) => {
              const cat = robot.robot_categories as { slug: string; name: string } | null;
              return (
                <Link
                  key={robot.id}
                  href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
                  className="group rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted">{cat?.name}</p>
                      <h3 className="truncate font-semibold transition-colors group-hover:text-white">{robot.name}</h3>
                    </div>
                    {robot.robo_score != null && <RoboScoreBadge score={robot.robo_score} />}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted">{robot.description_short}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">
                      {robot.price_current != null ? `$${robot.price_current.toLocaleString()}` : "Contact"}
                    </span>
                    <span className="text-xs text-white">View &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-xl font-bold">Explore by Category</h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(allRobots.map((r) => {
              const cat = r.robot_categories as { slug: string; name: string } | null;
              return cat ? JSON.stringify({ slug: cat.slug, name: cat.name }) : null;
            }).filter(Boolean))).map((catJson) => {
              const cat = JSON.parse(catJson as string);
              return (
                <Link
                  key={cat.slug}
                  href={`/best/${cat.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
                >
                  Best {cat.name} Robots
                </Link>
              );
            })}
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
