import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { RoboScoreBadge } from "@/components/ui/robo-score";
// SocialProofStrip removed — stats now inline
import { HeroNetworkSvg } from "@/components/ui/hero-network-svg";
import { HeroBackground } from "@/components/hero/hero-background";
import { HeroCounter } from "@/components/home/hero-counter";
import { NewsletterForm } from "@/components/home/newsletter-form";
import ChannelShowcase from "@/components/home/channel-showcase";
import { RobotimusHeroPanel } from "@/components/home/robotimus-hero-panel";
import { CertificationSection } from "@/components/home/certification-section";
import { OpportunityBanner } from "@/components/home/opportunity-banner";
import { RaaSExplainer } from "@/components/home/raas-explainer";
import { RecentlyFunded } from "@/components/home/recently-funded";
import { LiveActivity } from "@/components/home/live-activity";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import { HeroPills } from "@/components/home/hero-pills";
import { VideoHero } from "@/components/ui/video-hero";
import { MarketPulseTicker } from "@/components/home/market-pulse-ticker";
import { WhyRobotomated } from "@/components/home/why-robotomated";
import { Typewriter } from "@/components/home/typewriter";
import { WorkforceAnnouncement } from "@/components/home/workforce-announcement";
import { MotionSection } from "@/components/ui/motion-section";
import type { RobotCategory } from "@/lib/supabase/types";

interface FeaturedRobot {
  id: string; slug: string; name: string;
  robo_score: number | null; price_current: number | null; price_msrp: number | null;
  description_short: string | null; images: unknown; year_released: number | null;
  manufacturer_id: string; category_id: string;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string; name: string } | null;
}

async function getData() {
  const supabase = createServerClient();

  const categories = await cached<(RobotCategory & { robot_count: number })[]>("home:cats:v2", 3600, async () => {
    const { data: cats } = await supabase.from("robot_categories").select("*").order("display_order").returns<RobotCategory[]>();
    const { data: robots } = await supabase.from("robots").select("category_id").returns<{ category_id: string }[]>();
    const counts: Record<string, number> = {};
    robots?.forEach((r) => { counts[r.category_id] = (counts[r.category_id] || 0) + 1; });
    return (cats || []).map((c) => ({ ...c, robot_count: counts[c.id] || 0 }));
  });

  const { count: manufacturerCount } = await supabase
    .from("manufacturers")
    .select("id", { count: "exact", head: true });

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

  return { categories, trending, totalRobots, manufacturerCount: manufacturerCount || 0 };
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  return `$${price.toLocaleString()}`;
}

export default async function HomePage() {
  const { categories, trending, totalRobots, manufacturerCount } = await getData();

  return (
    <div className="flex flex-col" style={{ background: "var(--theme-bg)" }}>

      {/* ══════════════════════════════════════════
          0. MARKET PULSE TICKER — live market updates
          ══════════════════════════════════════════ */}
      <WorkforceAnnouncement />
      <MarketPulseTicker />

      {/* ══════════════════════════════════════════
          1. HERO — 2-column with Robotimus panel
          ══════════════════════════════════════════ */}
      {/* HERO — DESIGN.md: full-bleed, bottom-left headline, one CTA */}
      <section className="relative min-h-[600px] lg:min-h-[700px]" style={{ background: "#000000" }}>
        <div className="absolute inset-0 flex items-end px-6 pb-24 sm:px-12 sm:pb-32 lg:px-20 lg:pb-40">
          <div className="max-w-4xl">
            <span className="label-uppercase text-[12px] tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.45)" }}>
              01 / WHAT WE COVER
            </span>
            <h1
              className="mt-4 font-[family-name:var(--font-sans)]"
              style={{ fontSize: "clamp(40px, 5.5vw, 96px)", fontWeight: 500, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#FFFFFF" }}
            >
              {totalRobots} robots. Every spec, every review, every certification path.
            </h1>
            <div className="mt-8">
              <Link
                href="/explore"
                className="inline-block border border-white/20 px-6 py-3 text-[14px] font-medium uppercase tracking-[0.04em] text-white/80 transition-colors hover:border-white hover:text-white"
                style={{ borderRadius: "2px" }}
              >
                EXPLORE THE DATABASE &rarr;
              </Link>
            </div>
            <p className="mt-8 font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {totalRobots} robots &middot; {manufacturerCount} manufacturers &middot; Independent scoring
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS BAR
          ══════════════════════════════════════════ */}
      {/* STATS — DESIGN.md: large mono numbers, uppercase labels, hairline separators */}
      <section className="px-6 py-16" style={{ background: "#000000" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { value: <HeroCounter target={totalRobots} suffix="+" duration={2000} delay={0} />, label: "ROBOTS TRACKED" },
              { value: <HeroCounter target={manufacturerCount} suffix="+" duration={1800} delay={200} />, label: "MANUFACTURERS" },
              { value: <HeroCounter target={103} prefix="$" suffix="B" duration={2200} delay={400} />, label: "MARKET SIZE" },
              { value: <HeroCounter target={5} duration={800} delay={600} />, label: "ACCESS PATHS" },
            ].map((s, i) => (
              <div key={s.label} className="px-6 py-6 text-center" style={{ borderRight: i < 3 ? "1px solid #1F1F1F" : "none" }}>
                <span className="block font-mono font-medium text-white" style={{ fontSize: "clamp(28px, 3vw, 48px)" }}>{s.value}</span>
                <span className="mt-2 block text-[12px] font-medium uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LiveActivity />

      <div className="border-t border-b px-6 py-4" style={{ borderColor: "#1F1F1F" }}>
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.25)" }}>
          INDEPENDENT · NO MANUFACTURER PAYS FOR SCORES
        </p>
      </div>

      {/* ══════════════════════════════════════════
          2.5. RECENTLY VIEWED (personalization)
          ══════════════════════════════════════════ */}
      <RecentlyViewed />

      {/* ══════════════════════════════════════════
          3. THE 5 CHANNELS — Most important section
          ══════════════════════════════════════════ */}
      <ChannelShowcase />

      {/* ══════════════════════════════════════════
          3.5. WHY ROBOTOMATED — Value proposition
          ══════════════════════════════════════════ */}
      <WhyRobotomated />

      {/* ══════════════════════════════════════════
          3.6. TRUST STATEMENT BAR
          ══════════════════════════════════════════ */}
      {/* Trust bar removed — already stated in hero and stats */}

      {/* ══════════════════════════════════════════
          5. TRENDING ROBOTS
          ══════════════════════════════════════════ */}
      <MotionSection as="section" className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#0EA5E9]" />
            <span className="font-[family-name:var(--font-brand)] text-[10px] uppercase tracking-[0.2em] text-[#0EA5E9]">
              Intelligence
            </span>
          </div>
          <h2
            className="font-[family-name:var(--font-ui)] font-bold tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "var(--theme-text-primary)" }}
          >
            Trending This Week
          </h2>
          <p className="mt-3 max-w-lg font-[family-name:var(--font-ui)] text-base leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
            {totalRobots} robots, independently scored. No manufacturer pays for placement.
          </p>

          {/* Search bar — command center style */}
          <Link
            href="/explore"
            className="mt-8 flex items-center gap-3 rounded-xl px-5 py-4 transition-all hover:border-[#0EA5E9]/30 hover:shadow-[0_0_20px_rgba(14,165,233,0.06)]"
            style={{ background: "var(--layer-1, rgba(13,13,13,1))", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <svg className="h-5 w-5 shrink-0 text-[#0EA5E9]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 font-[family-name:var(--font-ui)] text-[15px] text-white/40">
              Search by name, manufacturer, use case, or spec...
            </span>
            <kbd className="hidden rounded-md px-2 py-0.5 font-[family-name:var(--font-mono)] text-[11px] sm:inline" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
              ⌘K
            </kbd>
          </Link>

          {/* Category filter pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.filter(c => c.robot_count > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/explore/${cat.slug}`}
                className="shrink-0 rounded-full px-3.5 py-1.5 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.06em] transition-all hover:border-[#0EA5E9]/30 hover:text-[#0EA5E9]"
                style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Robot grid — with images */}
          <div className="mt-10 overflow-visible">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.slice(0, 6).map((robot) => {
                const mfr = (robot.manufacturers as { name: string } | null)?.name || "";
                const cat = robot.robot_categories as { slug: string; name: string } | null;
                const imgs = (Array.isArray(robot.images) ? robot.images : []) as { url: string; alt: string }[];
                const hasImg = imgs[0]?.url && !imgs[0].url.includes("unsplash");
                return (
                  <Link
                    key={robot.id}
                    href={`/explore/${cat?.slug || "all"}/${robot.slug}`}
                    className="card-2080 holo-card group block"
                  >
                    {/* Image zone */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#0F1628] to-[#141C33]">
                      {hasImg ? (
                        <img
                          src={imgs[0].url}
                          alt={imgs[0].alt || robot.name}
                          className="h-full w-full object-cover object-center transition-transform duration-600 group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-white/[0.06]"><rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="18" r="2.5" fill="currentColor"/><circle cx="28" cy="18" r="2.5" fill="currentColor"/></svg>
                          <span className="mt-1 font-[family-name:var(--font-ui)] text-xs font-medium text-white/45">{robot.name}</span>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(18,18,18,0.95)]" />
                      {/* Category badge */}
                      {cat && (
                        <div className="absolute left-3 top-3 rounded-md px-2.5 py-1" style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                          <span className="font-[family-name:var(--font-brand)] text-[9px] tracking-[0.15em] text-white/70">{cat.name.toUpperCase()}</span>
                        </div>
                      )}
                      {/* RoboScore */}
                      {robot.robo_score != null && robot.robo_score > 0 && (
                        <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)", border: `1px solid ${robot.robo_score >= 80 ? "rgba(16,185,129,0.4)" : robot.robo_score >= 60 ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)"}`, boxShadow: `0 0 12px ${robot.robo_score >= 80 ? "rgba(16,185,129,0.15)" : robot.robo_score >= 60 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)"}` }}>
                          <span className="font-[family-name:var(--font-brand)] text-[14px] font-bold" style={{ color: robot.robo_score >= 80 ? "#10B981" : robot.robo_score >= 60 ? "#F59E0B" : "#EF4444" }}>{robot.robo_score}</span>
                        </div>
                      )}
                    </div>
                    {/* Info zone */}
                    <div className="p-4">
                      <span className="font-[family-name:var(--font-brand)] text-[9px] uppercase tracking-[0.15em] text-[#0EA5E9]">{mfr}</span>
                      <p className="mt-1.5 font-[family-name:var(--font-ui)] text-[16px] font-semibold text-white transition-colors group-hover:text-[#0EA5E9]">{robot.name}</p>
                      <div className="my-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }} />
                      <div className="flex items-center justify-between">
                        {robot.price_current != null ? (
                          <span className="font-[family-name:var(--font-mono)] text-[18px] font-bold text-[#C8FF00]">
                            {formatPrice(robot.price_current)}
                          </span>
                        ) : (
                          <span className="font-[family-name:var(--font-mono)] text-[11px] text-white/35">Contact for pricing</span>
                        )}
                        <span className="rounded-md px-3 py-1.5 font-[family-name:var(--font-brand)] text-[9px] tracking-[0.1em] text-[#0EA5E9] transition-all hover:bg-[#0EA5E9] hover:text-black" style={{ background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)" }}>
                          EXPLORE →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </MotionSection>

      {/* ══════════════════════════════════════════
          5.5. THE $24T OPPORTUNITY BANNER
          ══════════════════════════════════════════ */}
      <OpportunityBanner />

      {/* ══════════════════════════════════════════
          6. CERTIFICATION & TRAINING
          ══════════════════════════════════════════ */}
      <CertificationSection />

      {/* ══════════════════════════════════════════
          7. RAAS / DEPLOY SECTION
          ══════════════════════════════════════════ */}
      <RaaSExplainer />

      {/* ══════════════════════════════════════════
          7.75. THE ABUNDANCE EQUATION
          ══════════════════════════════════════════ */}
      <section className="scan-line-overlay px-6 py-32" style={{ background: "var(--layer-0, #080808)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <p className="font-[family-name:var(--font-ui)]" style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, color: "#F0F4FF", letterSpacing: "-0.03em" }}>
                  THE WORLD IS
                </p>
                <p className="font-[family-name:var(--font-ui)]" style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em", WebkitTextStroke: "1.5px rgba(240,244,255,0.4)", color: "transparent" }}>
                  GOING TO RUN
                </p>
                <p className="shimmer-text font-[family-name:var(--font-brand)]" style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                  ON ROBOTS.
                </p>
              </div>
              <blockquote className="font-[family-name:var(--font-ui)] font-bold italic leading-snug text-white" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
                &ldquo;You can create a world where goods and services prices trend toward zero and GDP spikes to infinity.&rdquo;
              </blockquote>
              <p className="mt-4 font-[family-name:var(--font-mono)] text-sm text-white/40">— Brett Adcock, Founder &amp; CEO, Figure AI</p>
            </div>
            <div className="card-2080 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-ui)] text-sm text-white/50">Human labor (fully burdened)</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-white">$46/hour</span>
                </div>
                <div className="-mx-3 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "rgba(14,165,233,0.06)", borderLeft: "2px solid #0EA5E9" }}>
                  <span className="font-[family-name:var(--font-ui)] text-sm text-white/50">Robot (leased, amortized)</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#0EA5E9]">$0.45/hour</span>
                </div>
                <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-ui)] text-sm font-semibold text-white/60">Cost difference</span>
                    <span className="font-[family-name:var(--font-brand)] text-3xl font-extrabold text-[#0EA5E9]" style={{ textShadow: "0 0 30px rgba(14,165,233,0.4)" }}>100×</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 font-[family-name:var(--font-ui)] text-sm leading-relaxed text-white/40">
                At $0.45/hour, every business can afford automation. That is the world we are building toward — and Robotomated is how you get there.
              </p>
              <Link href="/tools/robot-economics" className="mt-4 inline-block font-[family-name:var(--font-brand)] text-[11px] tracking-[0.08em] text-[#0EA5E9] hover:underline">
                CALCULATE YOUR ECONOMICS →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. SOCIAL PROOF STATS
          ══════════════════════════════════════════ */}
      <section className="px-6 py-28" style={{ background: "var(--layer-0, var(--theme-bg))" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-2xl lg:grid-cols-4" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(14,165,233,0.02)" }}>
            {[
              { value: totalRobots.toString(), label: "Robots in Database" },
              { value: manufacturerCount.toString(), label: "Manufacturers Indexed" },
              { value: "$24T", label: "Projected Market by 2040" },
              { value: "137", label: "Humanoid Startups (China)" },
            ].map((s, i) => (
              <div key={s.label} className="stat-cell px-8 py-8 text-center transition-colors hover:bg-[rgba(14,165,233,0.04)]" style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <p className="font-[family-name:var(--font-brand)] font-bold text-[#0EA5E9]" style={{ fontSize: "clamp(36px, 5vw, 64px)", textShadow: "0 0 30px rgba(14,165,233,0.3)" }}>{s.value}</p>
                <p className="mt-3 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. RECENTLY FUNDED
          ══════════════════════════════════════════ */}
      <RecentlyFunded />

      {/* ══════════════════════════════════════════
          10. NEWSLETTER
          ══════════════════════════════════════════ */}
      <section className="px-6 py-28" style={{ background: "var(--layer-0, var(--theme-bg))" }}>
        <div className="mx-auto max-w-xl text-center">
          <span className="font-[family-name:var(--font-brand)] text-[10px] tracking-[0.2em] text-[#0EA5E9]">
            [ NEWSLETTER ]
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-ui)] text-3xl font-bold sm:text-4xl" style={{ color: "var(--theme-text-primary)" }}>
            The Automation Intelligence Brief
          </h2>
          <p className="mx-auto mt-4 max-w-md font-[family-name:var(--font-ui)] text-base leading-[1.7]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Weekly robotics intelligence for operations leaders.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <p className="mt-4 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            Join 2,500+ operations leaders. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
