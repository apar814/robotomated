import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { Typewriter } from "@/components/home/typewriter";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedRobots } from "@/components/home/featured-robots";
import type { RobotCategory } from "@/lib/supabase/types";

interface FeaturedRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  description_short: string | null;
  images: unknown;
  manufacturers: { name: string } | null;
}

async function getCategories() {
  const supabase = createServerClient();
  const { data: categories } = await supabase
    .from("robot_categories")
    .select("*")
    .order("display_order")
    .returns<RobotCategory[]>();

  if (!categories) return [];

  const { data: robots } = await supabase
    .from("robots")
    .select("category_id")
    .returns<{ category_id: string }[]>();

  const counts: Record<string, number> = {};
  robots?.forEach((r) => {
    counts[r.category_id] = (counts[r.category_id] || 0) + 1;
  });

  return categories.map((c) => ({
    ...c,
    robot_count: counts[c.id] || 0,
  }));
}

async function getFeaturedRobots() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("robots")
    .select("id, slug, name, manufacturer_id, robo_score, description_short, images, manufacturers(name)")
    .eq("status", "active")
    .not("robo_score", "is", null)
    .order("robo_score", { ascending: false })
    .limit(3)
    .returns<FeaturedRobot[]>();

  return data || [];
}

export default async function HomePage() {
  const [categories, featuredRobots] = await Promise.all([
    getCategories(),
    getFeaturedRobots(),
  ]);

  return (
    <div className="flex flex-col items-center">
      {/* ── Hero ── */}
      <section className="relative flex w-full flex-col items-center overflow-hidden px-4 pb-24 pt-24 text-center sm:pt-32">
        {/* Grid texture background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,194,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue opacity-[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 top-40 h-80 w-80 rounded-full bg-violet opacity-[0.07] blur-[100px]" />

        <h1 className="relative max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          The Intelligence Layer for the{" "}
          <span className="bg-gradient-to-r from-blue to-violet bg-clip-text text-transparent">
            Robotics Era
          </span>
        </h1>
        <p className="relative mt-6 max-w-2xl text-lg text-muted">
          Find, compare, and buy the right robot for your home, business, or
          facility — guided by AI.
        </p>
        <div className="relative mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/advisor"
            className="rounded-lg bg-blue px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
          >
            Start with AI Advisor
          </Link>
          <Link
            href="/robots"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter"
          >
            Browse All Robots
          </Link>
        </div>

        {/* Floating category cards */}
        <div className="relative mt-16 flex gap-4 sm:gap-6">
          {["Warehouse", "Healthcare", "Consumer"].map((label, i) => (
            <div
              key={label}
              className="animate-float rounded-xl border border-border bg-navy-light/80 px-5 py-4 backdrop-blur-sm"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue/10">
                <div className="h-5 w-5 rounded-sm bg-blue/60" />
              </div>
              <p className="text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Grid ── */}
      <section className="w-full border-t border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            Explore by Category
          </h2>
          <p className="mb-12 text-center text-muted">
            From factory floors to living rooms — find the robots that matter.
          </p>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* ── Featured Reviews Strip ── */}
      <section className="w-full border-t border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            Top-Rated Robots
          </h2>
          <p className="mb-12 text-center text-muted">
            The highest-scoring robots across our transparent RoboScore system.
          </p>
          <FeaturedRobots robots={featuredRobots} />
        </div>
      </section>

      {/* ── AI Advisor CTA ── */}
      <section className="w-full px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-navy-light p-8 sm:p-12">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Not sure where to start?
              </h2>
              <p className="mt-3 text-muted">
                Answer 3 questions. Get your perfect robot match.
              </p>
              <div className="mt-4 min-h-[2rem] text-sm">
                <Typewriter />
              </div>
            </div>
            <Link
              href="/advisor"
              className="shrink-0 rounded-lg bg-gradient-to-r from-blue to-violet px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Launch AI Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full border-t border-border px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold sm:text-3xl">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Browse categories, search by use case, or let our AI advisor guide you to the right robots.",
                color: "text-blue",
                border: "border-blue/20",
              },
              {
                step: "02",
                title: "Compare",
                desc: "Side-by-side specs, transparent RoboScores, expert reviews — everything you need to decide.",
                color: "text-violet",
                border: "border-violet/20",
              },
              {
                step: "03",
                title: "Get Guided",
                desc: "Personalized recommendations, pricing alerts, and a clear path from research to purchase.",
                color: "text-green",
                border: "border-green/20",
              },
            ].map(({ step, title, desc, color, border }) => (
              <div
                key={step}
                className={`rounded-xl border ${border} bg-navy-light p-6`}
              >
                <span className={`font-mono text-xs ${color}`}>{step}</span>
                <h3 className={`mt-2 text-lg font-semibold ${color}`}>
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="w-full border-t border-border px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Stay in the Loop</h2>
          <p className="mb-8 mt-3 text-muted">
            Weekly insights on robotics trends, new reviews, and the best deals.
          </p>
          <div className="relative">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
