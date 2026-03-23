import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CompanyLogo } from "@/components/ui/company-logo";

interface MfrDetail {
  id: string; slug: string; name: string;
  country: string | null; founded_year: number | null; website: string | null; logo_url: string | null;
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
  const { data } = await supabase.from("manufacturers").select("name, website").eq("slug", slug).single().returns<{ name: string; website: string | null }>();
  if (!data) return { title: "Manufacturer Not Found" };
  return {
    title: `${data.name} Robots — All Products & Pricing`,
    description: `Browse all ${data.name} robots with specs, RoboScores, and pricing. Visit ${data.website || "their website"} for more.`,
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

  return (
    <div>
      <section className="border-b border-white/[0.06] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Manufacturers", href: "/manufacturers" },
            { name: mfr.name, href: `/manufacturers/${slug}` },
          ]} />

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-4">
                <CompanyLogo logoUrl={mfr.logo_url} name={mfr.name} size={48} />
                <h1 className="font-display text-3xl font-bold">{mfr.name}</h1>
              </div>
              <p className="mt-2 text-sm text-muted">
                {mfr.country && <span>HQ: {mfr.country}</span>}
                {mfr.founded_year && <span> &middot; Founded {mfr.founded_year}</span>}
                <span> &middot; {allRobots.length} robots listed</span>
              </p>
              {categories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {categories.map(c => (
                    <span key={c} className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-muted">{c}</span>
                  ))}
                </div>
              )}
              {minPrice != null && (
                <p className="mt-2 text-sm text-muted">
                  Price range: <span className="font-mono font-semibold text-green">${minPrice.toLocaleString()}</span>
                  {maxPrice != null && maxPrice !== minPrice && <span className="font-mono font-semibold text-green"> – ${maxPrice.toLocaleString()}</span>}
                </p>
              )}
            </div>
            {mfr.website && (
              <a
                href={mfr.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue/10 px-6 py-3 text-sm font-semibold text-blue transition-colors hover:bg-blue/20"
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

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allRobots.map((robot) => {
              const cat = robot.robot_categories as { slug: string; name: string } | null;
              const imgs = Array.isArray(robot.images) ? robot.images as { url: string }[] : [];
              return (
                <Link key={robot.id} href={`/explore/${cat?.slug || "all"}/${robot.slug}`} className="glass glass-hover group rounded-xl transition-all hover:-translate-y-1">
                  <div className="relative h-36 overflow-hidden rounded-t-xl">
                    {imgs[0]?.url ? (
                      <Image src={imgs[0].url} alt={robot.name} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-steel to-navy-lighter"><span className="text-2xl opacity-20">&#129302;</span></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    {cat && <span className="absolute left-3 top-3 rounded-full bg-navy/70 px-2 py-0.5 text-[10px] text-foreground/80 backdrop-blur-sm">{cat.name}</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold transition-colors group-hover:text-blue">{robot.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted/70">{robot.description_short}</p>
                    <div className="mt-3 flex items-center justify-between">
                      {robot.price_current != null ? (
                        <span className="font-mono text-sm font-bold text-green">${robot.price_current.toLocaleString()}</span>
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
