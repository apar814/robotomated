import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CompanyLogo } from "@/components/ui/company-logo";
import { JsonLd } from "@/components/seo/json-ld";

interface MfrDetail {
  id: string; slug: string; name: string;
  country: string | null; founded_year: number | null;
  website: string | null; logo_url: string | null;
  description: string | null;
}

interface MfrRobot {
  id: string; slug: string; name: string;
  robo_score: number | null; price_current: number | null;
  description_short: string | null; status: string; year_released: number | null;
  images: { url: string; alt: string }[] | null;
  robot_categories: { slug: string; name: string } | null;
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase.from("manufacturers").select("name, website, description").eq("slug", slug).single().returns<{ name: string; website: string | null; description: string | null }>();
  if (!data) return { title: "Manufacturer Not Found" };
  return {
    title: `${data.name} Robots — All Products, RoboScores & Pricing`,
    description: data.description || `Browse all ${data.name} robots with independent RoboScores, specs, and pricing. Compare models and find the right one.`,
    alternates: { canonical: `/manufacturers/${slug}` },
  };
}

export default async function ManufacturerDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: mfr } = await supabase.from("manufacturers").select("*").eq("slug", slug).single().returns<MfrDetail>();
  if (!mfr) notFound();

  const { data: robots } = await supabase
    .from("robots")
    .select("id,slug,name,robo_score,price_current,description_short,status,year_released,images,robot_categories(slug,name)")
    .eq("manufacturer_id", mfr.id)
    .order("robo_score", { ascending: false, nullsFirst: false })
    .returns<MfrRobot[]>();

  const allRobots = robots || [];
  const priceRange = allRobots.filter(r => r.price_current).map(r => r.price_current!);
  const minPrice = priceRange.length > 0 ? Math.min(...priceRange) : null;
  const maxPrice = priceRange.length > 0 ? Math.max(...priceRange) : null;
  const categories = [...new Set(allRobots.map(r => (r.robot_categories as { name: string } | null)?.name).filter(Boolean))];

  // Calculate average RoboScore
  const scoredRobots = allRobots.filter(r => r.robo_score != null && r.robo_score > 0);
  const avgScore = scoredRobots.length > 0
    ? Math.round(scoredRobots.reduce((sum, r) => sum + r.robo_score!, 0) / scoredRobots.length * 10) / 10
    : null;

  // Best robot = first in list (already sorted by robo_score desc)
  const bestRobot = scoredRobots[0] || null;
  const bestRobotCat = bestRobot ? (bestRobot.robot_categories as { slug: string; name: string } | null)?.slug || "all" : "";
  const bestRobotImgs = bestRobot && Array.isArray(bestRobot.images) ? bestRobot.images as { url: string }[] : [];

  // Schema.org Organization markup
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: mfr.name,
    url: mfr.website || `https://robotomated.com/manufacturers/${slug}`,
    ...(mfr.logo_url && { logo: mfr.logo_url }),
    ...(mfr.country && { address: { "@type": "PostalAddress", addressCountry: mfr.country } }),
    ...(mfr.founded_year && { foundingDate: `${mfr.founded_year}` }),
  };

  return (
    <div>
      <JsonLd data={orgSchema} />

      {/* Header */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Manufacturers", href: "/manufacturers" },
            { name: mfr.name, href: `/manufacturers/${slug}` },
          ]} />

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-4">
                <CompanyLogo logoUrl={mfr.logo_url} name={mfr.name} height={48} />
                <h1 className="font-display text-3xl font-bold">{mfr.name}</h1>
              </div>

              {/* Stats row */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
                {mfr.country && <span>HQ: {mfr.country}</span>}
                {mfr.founded_year && <span>Founded {mfr.founded_year}</span>}
                <span>{allRobots.length} robots listed</span>
                {avgScore != null && (
                  <span className="flex items-center gap-1.5">
                    Avg RoboScore: <RoboScoreBadge score={avgScore} />
                  </span>
                )}
              </div>

              {/* Description */}
              {mfr.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {mfr.description}
                </p>
              )}

              {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map(c => (
                    <span key={c} className="rounded-full bg-white/[0.02] px-2.5 py-0.5 text-[10px] text-muted">{c}</span>
                  ))}
                </div>
              )}
              {minPrice != null && (
                <p className="mt-2 text-sm text-muted">
                  Price range: <span className="font-mono font-semibold text-blue-400">${minPrice.toLocaleString()}</span>
                  {maxPrice != null && maxPrice !== minPrice && <span className="font-mono font-semibold text-blue-400"> – ${maxPrice.toLocaleString()}</span>}
                </p>
              )}
            </div>
            {mfr.website && (
              <a
                href={mfr.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-md bg-electric-blue-dim px-6 py-3 text-sm font-semibold text-electric-blue transition-colors hover:bg-electric-blue/20"
              >
                Visit {mfr.name}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Best Robot Highlight */}
      {bestRobot && (
        <section className="border-b border-border px-4 py-8">
          <div className="mx-auto max-w-6xl">
            <Link
              href={`/explore/${bestRobotCat}/${bestRobot.slug}`}
              className="group flex flex-col gap-6 rounded-md border border-electric-blue/20 bg-gradient-to-r from-electric-blue/5 to-violet/5 p-6 transition-all hover:border-electric-blue/40 sm:flex-row sm:items-center"
            >
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md">
                {bestRobotImgs[0]?.url ? (
                  <Image src={bestRobotImgs[0].url} alt={bestRobot.name} fill sizes="128px" className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-obsidian-3 to-obsidian-2">
                    <span className="text-3xl opacity-20">&#129302;</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-mono text-[9px] uppercase tracking-widest text-electric-blue">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-electric-blue" />Best from {mfr.name}
                </p>
                <h2 className="mt-1 text-xl font-bold transition-colors group-hover:text-electric-blue">
                  {bestRobot.name}
                </h2>
                <p className="mt-1 text-sm text-muted">{bestRobot.description_short}</p>
                <div className="mt-3 flex items-center gap-4">
                  {bestRobot.robo_score != null && <RoboScoreBadge score={bestRobot.robo_score} />}
                  {bestRobot.price_current != null && (
                    <span className="font-mono text-sm font-bold text-blue-400">${bestRobot.price_current.toLocaleString()}</span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-electric-blue group-hover:underline">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Robots Grid */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-text-ghost"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-electric-blue" />Product Catalog</p>
          <h2 className="mb-6 text-xl font-bold">All {mfr.name} Robots</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRobots.map((robot) => {
              const cat = robot.robot_categories as { slug: string; name: string } | null;
              const imgs = Array.isArray(robot.images) ? robot.images as { url: string }[] : [];
              return (
                <Link key={robot.id} href={`/explore/${cat?.slug || "all"}/${robot.slug}`} className="obsidian-card group overflow-hidden transition-all hover:-translate-y-1">
                  <div className="relative h-36 overflow-hidden rounded-t-md">
                    {imgs[0]?.url ? (
                      <Image src={imgs[0].url} alt={robot.name} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-obsidian-3 to-obsidian-2"><span className="text-2xl opacity-20">&#129302;</span></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                    {cat && <span className="absolute left-3 top-3 rounded-full bg-obsidian/70 px-2 py-0.5 text-[10px] text-foreground/80 backdrop-blur-sm">{cat.name}</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold transition-colors group-hover:text-electric-blue">{robot.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted/70">{robot.description_short}</p>
                    <div className="mt-3 flex items-center justify-between">
                      {robot.price_current != null ? (
                        <span className="font-mono text-sm font-bold text-blue-400">${robot.price_current.toLocaleString()}</span>
                      ) : (
                        <span className="text-xs text-orange">Request Quote</span>
                      )}
                      {robot.robo_score != null && robot.robo_score > 0 && <RoboScoreBadge score={robot.robo_score} />}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
