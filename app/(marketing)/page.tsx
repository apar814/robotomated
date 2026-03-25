import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/ui/safe-image";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreRing, RoboScoreBadge } from "@/components/ui/robo-score";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { TrustedBy } from "@/components/home/trusted-by";
import { HeroMosaic } from "@/components/home/hero-mosaic";
import { NewsTicker } from "@/components/home/news-ticker";
import { NewsSection } from "@/components/news/news-section";
import { NEWS_ARTICLES } from "@/lib/data/news";
import type { RobotCategory } from "@/lib/supabase/types";

interface FeaturedRobot {
  id: string; slug: string; name: string;
  robo_score: number | null; price_current: number | null; price_msrp: number | null;
  description_short: string | null; images: unknown; year_released: number | null;
  manufacturer_id: string; category_id: string;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
}

const categoryImages: Record<string, string> = {
  warehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  manufacturing: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
  consumer: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  medical: "https://images.unsplash.com/photo-1530497610245-b489b1aedd74?w=800&q=80",
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  agricultural: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
  delivery: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  drone: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
  software: "",
};

async function getData() {
  const supabase = createServerClient();

  const categories = await cached<(RobotCategory & { robot_count: number })[]>("home:cats:v2", 3600, async () => {
    const { data: cats } = await supabase.from("robot_categories").select("*").order("display_order").returns<RobotCategory[]>();
    const { data: robots } = await supabase.from("robots").select("category_id").returns<{ category_id: string }[]>();
    const counts: Record<string, number> = {};
    robots?.forEach((r) => { counts[r.category_id] = (counts[r.category_id] || 0) + 1; });
    return (cats || []).map((c) => ({ ...c, robot_count: counts[c.id] || 0 }));
  });

  const trending = await cached<FeaturedRobot[]>("home:trending:v2", 1800, async () => {
    const { data } = await supabase
      .from("robots").select("id,slug,name,robo_score,price_current,price_msrp,description_short,images,year_released,manufacturer_id,category_id,manufacturers(name),robot_categories(slug,name)")
      .eq("status", "active").not("robo_score", "is", null)
      .order("robo_score", { ascending: false }).limit(30).returns<FeaturedRobot[]>();

    const pool = data || [];
    const picked: FeaturedRobot[] = [];
    const usedMfrs = new Set<string>();
    const usedCats = new Set<string>();

    for (const r of pool) {
      if (picked.length >= 8) break;
      if (usedMfrs.has(r.manufacturer_id)) continue;
      if (usedCats.has(r.category_id)) continue;
      picked.push(r);
      usedMfrs.add(r.manufacturer_id);
      usedCats.add(r.category_id);
    }

    for (const r of pool) {
      if (picked.length >= 8) break;
      if (usedMfrs.has(r.manufacturer_id)) continue;
      if (picked.some(p => p.id === r.id)) continue;
      picked.push(r);
      usedMfrs.add(r.manufacturer_id);
    }

    return picked;
  });

  const totalRobots = categories.reduce((s, c) => s + c.robot_count, 0);

  return { categories, trending, totalRobots };
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

export default async function HomePage() {
  const { categories, trending, totalRobots } = await getData();

  return (
    <div className="dark-section flex flex-col bg-[#0A0F1E]">

      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:pt-16">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -left-40 top-10 h-[500px] w-[500px] rounded-full bg-blue opacity-[0.04] blur-[150px]" />
        <div className="pointer-events-none absolute -right-40 top-60 h-[500px] w-[500px] rounded-full bg-violet opacity-[0.04] blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-green opacity-[0.02] blur-[120px]" />

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* Right: robot mosaic + ticker */}
          <div className="hidden gap-6 lg:order-2 lg:flex lg:flex-1 lg:flex-col xl:flex-row xl:items-start">
            <div className="flex-1">
              <HeroMosaic robots={trending.slice(0, 4).map(r => {
                const imgs = Array.isArray(r.images) ? r.images as { url: string }[] : [];
                const realImg = imgs[0]?.url && !imgs[0].url.includes("unsplash") ? imgs[0].url : null;
                const cat = r.robot_categories as { slug: string; name: string } | null;
                return {
                  slug: r.slug,
                  name: r.name,
                  robo_score: r.robo_score,
                  image_url: realImg,
                  manufacturer_name: (r.manufacturers as { name: string } | null)?.name || "",
                  category_slug: cat?.slug || "all",
                };
              })} />
            </div>
            <NewsTicker />
          </div>

          {/* Left: headline + search */}
          <div className="text-center lg:order-1 lg:max-w-xl lg:text-left">
            <ScrollReveal>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-blue">The Robotics Intelligence Platform</p>
              <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find the <span className="bg-gradient-to-r from-blue to-cyan-glow bg-clip-text text-transparent">Right Robot</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/40">
                Compare {totalRobots}+ robots across {categories.length} categories. Real specs. Transparent scores. Best prices.
              </p>
            </ScrollReveal>

            {/* Search bar */}
            <ScrollReveal delay={150}>
              <Link href="/explore" className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 text-left backdrop-blur-sm transition-all hover:border-blue/30 hover:bg-white/[0.05] hover:shadow-[0_0_40px_rgba(0,194,255,0.06)]">
                <svg className="h-5 w-5 shrink-0 text-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <span className="text-sm text-white/35">Search {totalRobots}+ robots...</span>
                <kbd className="ml-auto hidden rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-white/20 sm:inline">&#8984;K</kbd>
              </Link>
            </ScrollReveal>

            {/* Category pills */}
            <ScrollReveal delay={250}>
              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                {categories.map((cat) => (
                  <Link key={cat.id} href={`/explore/${cat.slug}`} className="rounded-full border border-white/[0.06] px-4 py-1.5 text-xs font-medium text-white/35 transition-all hover:border-blue/30 hover:text-white/80">
                    {cat.name.split(" ")[0]}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ BRAND STRIP ══ */}
      <TrustedBy />

      {/* ══ TRENDING ROBOTS ══ */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Trending Robots</p>
              <h2 className="font-display text-2xl font-bold text-white">Top Rated This Month</h2>
            </div>
            <Link href="/explore" className="text-sm text-blue hover:underline">View All →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
            {trending.slice(0, 8).map((robot, i) => {
              const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
              const cat = (robot.robot_categories as { slug: string; name: string } | null);
              const imgs = Array.isArray(robot.images) ? robot.images as { url: string }[] : [];
              const realImg = imgs[0]?.url && !imgs[0].url.includes("unsplash.com") ? imgs[0].url : null;
              return (
                <ScrollReveal key={robot.id} delay={i * 50}>
                  <Link href={`/explore/${cat?.slug || "all"}/${robot.slug}`} className="group block min-w-[240px] overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-blue/20 hover:shadow-[0_4px_30px_rgba(0,194,255,0.06)] sm:min-w-0">
                    <div className="relative h-36 overflow-hidden bg-[#0D1321]">
                      {realImg ? (
                        <SafeImage src={realImg} alt={robot.name} sizes="25vw" className="object-cover object-[center_20%] opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100" fallbackLabel={mfr} fallbackSublabel={robot.name} />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F1628] to-[#141C33] px-3 text-center">
                          <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-white/[0.06]"><rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="18" r="2.5" fill="currentColor"/><circle cx="28" cy="18" r="2.5" fill="currentColor"/><rect x="18" y="28" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="34" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
                          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25">{mfr}</span>
                          <span className="mt-0.5 text-sm font-semibold text-white/45">{robot.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] text-white/30">{mfr}</p>
                      <h3 className="text-sm font-semibold leading-tight text-white/90 transition-colors group-hover:text-blue">{robot.name}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        {robot.price_current != null ? (
                          <span className="font-mono text-sm font-bold text-green">{formatPrice(robot.price_current)}</span>
                        ) : (
                          <span className="text-xs text-orange">Request Quote</span>
                        )}
                        {robot.robo_score != null && robot.robo_score > 0 && <RoboScoreBadge score={robot.robo_score} />}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ INDUSTRY PULSE ══ */}
      <NewsSection articles={NEWS_ARTICLES} />

      {/* ══ SHOP BY CATEGORY ══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Categories</p>
            <h2 className="mb-8 font-display text-2xl font-bold text-white">Shop by Category</h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.filter(c => c.robot_count > 0).map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 60}>
                <Link href={`/explore/${cat.slug}`} className="group relative block h-48 overflow-hidden rounded-xl border border-white/[0.06]">
                  {categoryImages[cat.slug] ? (
                    <Image src={categoryImages[cat.slug]} alt={cat.name} fill sizes="33vw" className="object-cover opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F1628] to-[#141C33]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E] via-[#0A0F1E]/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                    <p className="mt-1 text-xs text-white/50">{cat.robot_count} robots · Explore →</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY ROBOTOMATED ══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Why Robotomated</p>
            <h2 className="mb-10 text-center font-display text-2xl font-bold text-white">The Intelligence Layer for Robotics</h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-3">
            <ScrollReveal delay={0}>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-blue/20 hover:shadow-[0_0_30px_rgba(0,194,255,0.04)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10"><span className="text-lg text-blue">&#9733;</span></div>
                <h3 className="mb-2 font-display text-base font-bold text-white">Transparent Scoring</h3>
                <p className="text-sm leading-relaxed text-white/40">RoboScore rates every robot on 8 dimensions with public methodology. No pay-to-play. No black boxes.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-green/20 hover:shadow-[0_0_30px_rgba(0,229,160,0.04)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green/10"><span className="text-lg text-green">&#128200;</span></div>
                <h3 className="mb-2 font-display text-base font-bold text-white">ROI Calculator</h3>
                <p className="text-sm leading-relaxed text-white/40">Every robot page includes a live ROI calculator. Know your payback period before you buy.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-violet/20 hover:shadow-[0_0_30px_rgba(123,47,255,0.04)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10"><span className="text-lg text-violet">&#129302;</span></div>
                <h3 className="mb-2 font-display text-base font-bold text-white">AI Advisor</h3>
                <p className="text-sm leading-relaxed text-white/40">Describe your use case. Our AI matches you to the right robot based on specs, budget, and industry.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ COMPARE CTA ══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-bold text-white">Not sure which robot?</h2>
            <p className="mt-3 text-white/40">Compare specs, scores, and prices side-by-side. Or let our AI Advisor match you.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/compare" className="rounded-xl bg-blue px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(0,194,255,0.2)] transition-all hover:shadow-[0_0_30px_rgba(0,194,255,0.3)]">
                Compare Robots
              </Link>
              <Link href="/advisor" className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-8 py-3 text-sm font-semibold text-white transition-all hover:border-violet/30 hover:shadow-[0_0_20px_rgba(123,47,255,0.1)]">
                AI Advisor
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ NEWSLETTER ══ */}
      <section className="border-t border-white/[0.06] px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <ScrollReveal>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Free weekly newsletter</p>
            <h2 className="font-display text-xl font-bold text-white">Weekly Robot News, Deals & Reviews</h2>
            <p className="mb-2 mt-2 text-sm leading-relaxed text-white/35">New robot launches, expert reviews, price drops, and industry news — curated for buyers, operators, and robotics professionals.</p>
            <div className="mb-6 flex items-center justify-center gap-6 text-xs text-white/25">
              <span className="flex items-center gap-1.5"><span className="text-green">&#10003;</span> No spam, ever</span>
              <span className="flex items-center gap-1.5"><span className="text-green">&#10003;</span> Unsubscribe any time</span>
            </div>
            <div className="relative"><NewsletterForm /></div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
