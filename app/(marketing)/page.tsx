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
import { RoboWorkSection } from "@/components/home/robowork-section";
import { RecentlyFunded } from "@/components/home/recently-funded";
import { RecentlyViewed } from "@/components/home/recently-viewed";
import { JobInput } from "@/components/home/job-input";
import { VideoHero } from "@/components/ui/video-hero";
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
          1. HERO — 2-column with Robotimus panel
          ══════════════════════════════════════════ */}
      <VideoHero
        videoUrl={process.env.HERO_VIDEO_URL || null}
        posterUrl={null}
        overlayOpacity={0.7}
        className="min-h-[600px] lg:min-h-[700px]"
      >
        {/* Fallback background layers (show when no video) */}
        <HeroBackground className="pointer-events-none absolute inset-0" />
        <HeroNetworkSvg className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15" />

        <div className="px-6 py-20 sm:py-28 lg:py-36">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-[55%_45%] lg:gap-16">
            {/* Left column — job-first messaging + input */}
            <div className="relative">
              <span className="hud-label blink-cursor">
                The Intelligence Layer for Robotics
              </span>
              <h1
                className="mt-8 font-display font-extrabold leading-[1.05]"
                style={{ fontSize: "clamp(36px, 5vw, 72px)", letterSpacing: "-0.03em", color: "var(--theme-text-primary)", textShadow: "0 0 80px rgba(14,165,233,0.12)" }}
              >
                What job needs<br />
                to get <span className="hero-accent">done?</span>
              </h1>
              <p className="mt-6 max-w-[480px] font-[family-name:var(--font-ui)] text-base leading-[1.75]" style={{ color: "var(--theme-text-secondary)" }}>
                Describe your operation. We{"'"}ll find the robot — and tell you exactly what it costs, how fast it deploys, and how many hours it saves.
              </p>

              {/* Job input */}
              <div className="mt-8">
                <JobInput />
              </div>

              {/* Stats inline */}
              <p className="mt-6 font-mono text-[11px] text-white/20">
                {totalRobots} robots &middot; {manufacturerCount} manufacturers &middot; Independently scored
              </p>
            </div>

            {/* Right column — Robotimus panel */}
            <div className="flex justify-center lg:justify-end lg:pt-16">
              <RobotimusHeroPanel />
            </div>
          </div>
        </div>
      </VideoHero>

      {/* ══════════════════════════════════════════
          2. STATS BAR
          ══════════════════════════════════════════ */}
      <section className="border-y px-6 py-6" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { value: <HeroCounter target={totalRobots} suffix="+" duration={2000} delay={0} />, label: "Robots Tracked" },
            { value: <HeroCounter target={manufacturerCount} suffix="+" duration={1800} delay={200} />, label: "Manufacturers Indexed" },
            { value: <HeroCounter target={103} prefix="$" suffix="B" duration={2200} delay={400} />, label: "2030 Global Market" },
            { value: <HeroCounter target={5} duration={800} delay={600} />, label: "Deployment Channels" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              {i > 0 && <span className="mr-4 font-[family-name:var(--font-mono)] text-white/10">//</span>}
              <span className="font-[family-name:var(--font-brand)] font-bold text-[var(--theme-accent-blue)]" style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>{s.value}</span>
              <span className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "var(--theme-text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="border-b px-6 py-3" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--theme-text-muted)" }}>Independent</span>
          <span className="h-1 w-1 rounded-full bg-electric-blue" />
          <span className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--theme-text-muted)" }}>No manufacturer pays for scores</span>
        </div>
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
          4. FEATURED ROBOTS
          ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          5. TRENDING ROBOTS
          ══════════════════════════════════════════ */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          {/* Section heading — DJI-scale */}
          <h2
            className="font-display font-bold tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 4vw, 56px)", color: "var(--theme-text-primary)" }}
          >
            Trending This Week
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
            {totalRobots} robots, independently scored. No manufacturer pays for placement.
          </p>

          {/* Search bar */}
          <Link
            href="/explore"
            className="mt-8 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-transparent px-5 py-4 transition-colors hover:border-[#0EA5E9]/30"
          >
            <svg className="h-5 w-5 shrink-0 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <span className="flex-1 text-[15px] text-white/30">
              Search by name, manufacturer, use case, or spec...
            </span>
            <kbd className="hidden rounded border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[13px] text-white/20 sm:inline">
              &#8984;K
            </kbd>
          </Link>

          {/* Category filter pills — clean pill style */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {categories.filter(c => c.robot_count > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/explore/${cat.slug}`}
                className="shrink-0 rounded-full border border-white/[0.08] px-3.5 py-1.5 font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.06em] text-white/50 transition-colors hover:border-[#0EA5E9]/30 hover:text-[#0EA5E9]"
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
                    className="group block overflow-hidden rounded-xl border border-white/[0.06] bg-[#0D0D0D] transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5E9]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                  >
                    {/* Image — 60% of card height */}
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-[#0F1628] to-[#141C33]">
                      {hasImg ? (
                        <img
                          src={imgs[0].url}
                          alt={imgs[0].alt || robot.name}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-white/[0.06]"><rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="18" r="2.5" fill="currentColor"/><circle cx="28" cy="18" r="2.5" fill="currentColor"/></svg>
                          <span className="mt-1 text-xs font-medium text-white/20">{robot.name}</span>
                        </div>
                      )}
                      {/* RoboScore overlay */}
                      {robot.robo_score != null && robot.robo_score > 0 && (
                        <div className="absolute right-3 top-3">
                          <RoboScoreBadge score={robot.robo_score} />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <span className="font-[family-name:var(--font-ui)] text-[10px] font-medium uppercase tracking-[0.1em] text-[#0EA5E9]">{mfr}</span>
                      <p className="mt-1 text-[15px] font-semibold text-white transition-colors group-hover:text-[#0EA5E9]">{robot.name}</p>
                      <div className="mt-3 flex items-center justify-between">
                        {robot.price_current != null ? (
                          <span className="font-mono text-base font-bold text-[#C8FF00]">
                            {formatPrice(robot.price_current)}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-white/30">Contact for pricing</span>
                        )}
                        <span className="text-[12px] font-medium text-[#0EA5E9] opacity-0 transition-opacity group-hover:opacity-100">
                          Full Analysis &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5.5. THE $24T OPPORTUNITY BANNER
          ══════════════════════════════════════════ */}
      <OpportunityBanner />

      {/* ══════════════════════════════════════════
          6. CERTIFICATION & TRAINING
          ══════════════════════════════════════════ */}
      <CertificationSection />

      {/* ══════════════════════════════════════════
          7. ROBOWORK PREVIEW
          ══════════════════════════════════════════ */}
      <RoboWorkSection />

      {/* ══════════════════════════════════════════
          7.5. RAAS EXPLAINER
          ══════════════════════════════════════════ */}
      <RaaSExplainer />

      {/* ══════════════════════════════════════════
          7.75. THE ABUNDANCE EQUATION
          ══════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] px-6 py-32" style={{ background: "#080808" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 flex items-center gap-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
                <span className="inline-block h-px w-8 bg-[#0EA5E9]" />
                The Abundance Equation
              </p>
              <blockquote className="font-display font-bold italic leading-snug text-white" style={{ fontSize: "clamp(24px, 3vw, 40px)" }}>
                &ldquo;You can create a world where goods and services prices trend toward zero and GDP spikes to infinity.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-white/50">-- Brett Adcock, CEO, Figure AI</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Human labor (fully burdened)</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-white">$46/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-ui)] text-sm text-white/60">Robot (leased, amortized)</span>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-[#C8FF00]">$0.45/hour</span>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-ui)] text-sm font-semibold text-white/80">Cost difference</span>
                    <span className="font-[family-name:var(--font-brand)] text-2xl font-extrabold text-[#0EA5E9]">100x</span>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/50">
                At $0.45/hour, every business can afford automation. That is the world we are building toward -- and Robotomated is how you get there.
              </p>
              <Link href="/tools/robot-economics" className="mt-4 inline-block text-sm font-semibold text-[#0EA5E9] hover:underline">
                Calculate your economics &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. SOCIAL PROOF STATS
          ══════════════════════════════════════════ */}
      <section className="border-y px-6 py-28" style={{ borderColor: "var(--theme-border)" }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
            {[
              { value: totalRobots.toString(), label: "Robots in Database" },
              { value: manufacturerCount.toString(), label: "Manufacturers Indexed" },
              { value: "$24T", label: "Projected Global Market by 2040" },
              { value: "137", label: "Humanoid Startups (China Alone)" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-[family-name:var(--font-brand)] font-bold" style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--theme-accent-blue)" }}>{s.value}</p>
                <p className="mt-3 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--theme-text-muted)" }}>{s.label}</p>
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
      <section
        className="px-6 py-28"
        style={{
          background: "var(--theme-section-alt)",
          borderTop: "1px solid var(--theme-border)",
          borderBottom: "1px solid var(--theme-border)",
        }}
      >
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-3 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--theme-accent-blue)]">
            [ Newsletter ]
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl" style={{ color: "var(--theme-text-primary)" }}>
            The Automation Intelligence Brief
          </h2>
          <p className="mx-auto mt-4 max-w-md font-[family-name:var(--font-ui)] text-base leading-[1.7]" style={{ color: "var(--theme-text-secondary)" }}>
            Weekly robotics intelligence for operations leaders.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
          <p className="mt-4 text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
            Join 2,500+ operations leaders. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
