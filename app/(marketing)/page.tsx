import Link from "next/link";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreRing, RoboScoreBadge } from "@/components/ui/robo-score";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { TrustedBy } from "@/components/home/trusted-by";
import { HeroAnimation } from "@/components/home/hero-animation";
import { NewsTicker } from "@/components/home/news-ticker";
import type { RobotCategory } from "@/lib/supabase/types";

interface FeaturedRobot {
  id: string; slug: string; name: string;
  robo_score: number | null; price_current: number | null; price_msrp: number | null;
  description_short: string | null; images: unknown; year_released: number | null;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
}

const categoryImages: Record<string, string> = {
  warehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
  manufacturing: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
  consumer: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  medical: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
  healthcare: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  agricultural: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
  delivery: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  drone: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
  software: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&q=80",
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

  const trending = await cached<FeaturedRobot[]>("home:trending", 1800, async () => {
    const { data } = await supabase
      .from("robots").select("id,slug,name,robo_score,price_current,price_msrp,description_short,images,year_released,manufacturers(name),robot_categories(slug,name)")
      .eq("status", "active").not("robo_score", "is", null)
      .order("robo_score", { ascending: false }).limit(8).returns<FeaturedRobot[]>();
    return data || [];
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
    <div className="flex flex-col">
      {/* ── HERO: Search-first marketplace (dark section) ── */}
      <section className="dark-section bg-mesh bg-dots relative overflow-hidden px-4 pb-16 pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-60 top-20 h-96 w-96 rounded-full bg-blue opacity-[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute -right-60 top-40 h-96 w-96 rounded-full bg-violet opacity-[0.05] blur-[120px]" />

        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-8">
        {/* Right side: wordmark + news ticker — hidden on mobile */}
        <div className="hidden gap-6 lg:order-2 lg:flex lg:flex-1 lg:flex-col xl:flex-row xl:items-start">
          <div className="flex-1">
            <HeroAnimation />
          </div>
          <NewsTicker />
        </div>

        <div className="text-center lg:order-1 lg:max-w-xl lg:text-left">
          <ScrollReveal>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the Right Robot
            </h1>
            <p className="mt-4 text-lg text-white/45">
              Compare {totalRobots}+ robots across {categories.length} categories. Real specs. Transparent scores. Best prices.
            </p>
          </ScrollReveal>

          {/* Search bar */}
          <ScrollReveal delay={150}>
            <Link href="/explore" className="mx-auto mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/[0.08] bg-navy-light/80 px-5 py-4 text-left backdrop-blur-sm transition-all hover:border-blue/30 hover:shadow-[0_0_30px_rgba(0,194,255,0.06)]">
              <svg className="h-5 w-5 shrink-0 text-white/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <span className="text-sm text-white/45">Search {totalRobots}+ robots across {categories.length} categories...</span>
            </Link>
          </ScrollReveal>

          {/* Category pills */}
          <ScrollReveal delay={250}>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/explore/${cat.slug}`} className="rounded-full border border-white/[0.08] px-4 py-2 text-xs font-medium text-white/45 transition-all hover:border-blue/30 hover:text-white/95">
                  {cat.name.split(" ")[0]}
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Popular searches */}
          <ScrollReveal delay={350}>
            <p className="mt-5 text-xs text-white/25">
              Popular: <Link href="/explore/consumer/unitree-g1-basic" className="text-white/40 hover:text-blue">Unitree G1</Link> &middot; <Link href="/explore/medical/davinci-5" className="text-white/40 hover:text-blue">da Vinci 5</Link> &middot; <Link href="/explore/manufacturing/ur20-v2" className="text-white/40 hover:text-blue">UR20</Link> &middot; <Link href="/explore/consumer/roborock-s8-maxv-ultra-v2" className="text-white/40 hover:text-blue">Roborock S8 MaxV</Link>
            </p>
          </ScrollReveal>
        </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <TrustedBy />

      {/* ── TRENDING ROBOTS ── */}
      <section className="border-y border-border px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Trending Robots</h2>
            <Link href="/explore" className="text-sm text-blue hover:underline">View All &rarr;</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
            {trending.slice(0, 8).map((robot, i) => {
              const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
              const cat = (robot.robot_categories as { slug: string; name: string } | null);
              const imgs = Array.isArray(robot.images) ? robot.images as { url: string }[] : [];
              return (
                <ScrollReveal key={robot.id} delay={i * 50}>
                  <Link href={`/explore/${cat?.slug || "all"}/${robot.slug}`} className="glass glass-hover group block min-w-[240px] rounded-xl transition-all hover:-translate-y-1 sm:min-w-0">
                    <div className="relative h-36 overflow-hidden rounded-t-xl bg-neutral-100">
                      {imgs[0]?.url ? (
                        <Image src={imgs[0].url} alt={robot.name} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100"><span className="text-2xl opacity-20">&#129302;</span></div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-neutral-400">{mfr}</p>
                      <h3 className="text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-blue">{robot.name}</h3>
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

      {/* ── SHOP BY CATEGORY ── */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="mb-8 font-display text-xl font-bold text-foreground">Shop by Category</h2>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.filter(c => c.robot_count > 0).map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 60}>
                <Link href={`/explore/${cat.slug}`} className="group relative block h-48 overflow-hidden rounded-xl">
                  <Image src={categoryImages[cat.slug] || categoryImages.consumer} alt={cat.name} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                    <p className="mt-1 text-xs text-white/70">{cat.robot_count} robots &middot; Explore &rarr;</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP RATED ── */}
      <section className="border-y border-border px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="mb-8 font-display text-xl font-bold text-foreground">Top Rated</h2>
          </ScrollReveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {trending.slice(0, 3).map((robot, i) => {
              const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
              const cat = (robot.robot_categories as { slug: string } | null);
              const imgs = Array.isArray(robot.images) ? robot.images as { url: string }[] : [];
              return (
                <ScrollReveal key={robot.id} delay={i * 100}>
                  <Link href={`/explore/${cat?.slug || "all"}/${robot.slug}`} className="glass glass-hover group flex gap-4 rounded-xl p-5 transition-all hover:-translate-y-1">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {imgs[0]?.url ? (
                        <Image src={imgs[0].url} alt={robot.name} fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-100"><span className="opacity-20">&#129302;</span></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold leading-tight text-foreground transition-colors group-hover:text-blue">{robot.name}</h3>
                          <p className="text-xs text-neutral-400">{mfr}</p>
                        </div>
                        {robot.robo_score != null && <RoboScoreRing score={robot.robo_score} size={48} />}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{robot.description_short}</p>
                      {robot.price_current != null && (
                        <p className="mt-2 font-mono text-sm font-bold text-green">{formatPrice(robot.price_current)}</p>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARE CTA ── */}
      <section className="bg-[#F3F2EF] px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold text-foreground">Not sure which robot?</h2>
            <p className="mt-3 text-neutral-500">Compare specs, scores, and prices side-by-side. Or let our AI Advisor match you.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/explore" className="rounded-xl bg-blue px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Compare Robots
              </Link>
              <Link href="/advisor" className="rounded-xl border border-border bg-white px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:border-blue/30">
                AI Advisor
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="border-t border-border px-4 py-14">
        <div className="mx-auto max-w-xl text-center">
          <ScrollReveal>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue">Free weekly newsletter</p>
            <h2 className="font-display text-xl font-bold text-foreground">Weekly Robot News, Deals & Reviews</h2>
            <p className="mb-2 mt-2 text-sm leading-relaxed text-neutral-500">New robot launches, expert reviews, price drops, and industry news — curated for buyers, operators, and robotics professionals.</p>
            <div className="mb-6 flex items-center justify-center gap-6 text-xs text-neutral-400">
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
