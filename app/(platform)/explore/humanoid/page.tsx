import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Humanoid Robots — The Revolution Is Here | Robotomated",
  description:
    "Track every major humanoid robot player: Figure, Agility Robotics, Tesla Optimus, Unitree, and 137 Chinese manufacturers. Independent analysis, RoboScores, and pricing for the humanoid revolution.",
};

interface HumanoidRobot {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  manufacturers: { name: string } | null;
  robot_categories: { slug: string } | null;
}

const STAT_CARDS = [
  {
    value: "137",
    label: "Chinese humanoid companies",
    detail: "Active manufacturers developing humanoid platforms",
  },
  {
    value: "0",
    label: "US commercially available humanoids",
    detail: "As of early 2026 — pre-order and R&D only",
  },
  {
    value: "90%",
    label: "Cost reduction Figure gen 1 to gen 3",
    detail: "Driving toward the $50K unit economics target",
  },
];

const INSIGHT_CARDS = [
  {
    title: "The Data Advantage",
    description:
      "Fleet neural learning is the real moat. Every robot deployed feeds data back to improve every other robot. Figure leads here with full autonomy and fleet-wide model updates. This is the network effect that will separate winners from commodity hardware.",
  },
  {
    title: "The Manufacturing Race",
    description:
      "China has 137 humanoid robot companies. The US has zero commercially available humanoids as of early 2026. But availability alone does not equal capability — most Chinese platforms are teleoperated or semi-autonomous, lacking the fleet learning infrastructure that defines next-generation robotics.",
  },
  {
    title: "The 10-Year Reality",
    description:
      "Waymo took 12 years from DARPA Grand Challenge to commercial robotaxi service. Humanoid robotics is on a similar trajectory. Companies promising mass deployment within 2 years are selling a timeline, not a product. The infrastructure for reliability at scale does not exist yet.",
  },
  {
    title: "The Cost Curve",
    description:
      "Figure achieved a 90% cost reduction from gen 1 to gen 3, targeting 50,000 units per year. This mirrors the EV battery cost curve — exponential improvement once manufacturing scales. The question is not if humanoids become affordable, but when and who gets there first.",
  },
];

export default async function HumanoidPage() {
  const supabase = createServerClient();

  const { data: robots } = await supabase
    .from("robots")
    .select(
      "id,slug,name,robo_score,price_current,description_short,manufacturers(name),robot_categories(slug)"
    )
    .eq("status", "active")
    .returns<HumanoidRobot[]>();

  const humanoidRobots = (robots || []).filter(
    (r) => r.robot_categories?.slug === "humanoid"
  );

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 pb-12 pt-12">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Explore", href: "/explore" },
              { name: "Humanoid", href: "/explore/humanoid" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold text-text-primary sm:text-5xl">
            The Humanoid Revolution Is Here
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-text-secondary">
            Figure, Agility Robotics, Tesla, Unitree, and 137 Chinese
            manufacturers are racing to build the first commercially viable
            humanoid robot. We track them all — independently, with no
            manufacturer influence.
          </p>
        </div>
      </section>

      {/* Key Stat Callout Cards */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-obsidian-surface p-6 text-center"
              >
                <p className="text-4xl font-bold text-electric-blue">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-text-primary">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs text-text-tertiary">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Market Intelligence
          </h2>
          <h3 className="mt-2 text-2xl font-bold text-text-primary">
            What the data actually tells us
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {INSIGHT_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-obsidian-surface p-6"
              >
                <h4 className="text-lg font-semibold text-text-primary">
                  {card.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Robot Grid */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Database
          </h2>
          <h3 className="mt-2 text-2xl font-bold text-text-primary">
            Humanoid Robots We Track
          </h3>

          {humanoidRobots.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {humanoidRobots.map((robot) => (
                <Link
                  key={robot.id}
                  href={`/robots/${robot.slug}`}
                  className="group rounded-lg border border-border bg-obsidian-surface p-6 transition-colors hover:border-electric-blue"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {robot.manufacturers?.name ?? "Unknown"}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-text-primary group-hover:text-electric-blue">
                        {robot.name}
                      </h4>
                    </div>
                    {robot.robo_score != null && (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-electric-blue text-sm font-bold text-electric-blue">
                        {robot.robo_score}
                      </div>
                    )}
                  </div>
                  {robot.description_short && (
                    <p className="mt-3 line-clamp-2 text-sm text-text-tertiary">
                      {robot.description_short}
                    </p>
                  )}
                  {robot.price_current != null && (
                    <p className="mt-3 text-sm font-semibold text-blue-400">
                      ${robot.price_current.toLocaleString()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-text-tertiary">
                Humanoid robots are being added to our database as
                manufacturers reach commercial availability. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Ready to explore humanoid automation?
          </h2>
          <p className="mt-3 text-text-tertiary">
            Use our tools to find the right robot for your operation, or talk to
            our AI advisor for personalized guidance.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/find-my-robot"
              className="inline-flex items-center rounded-lg bg-electric-blue px-6 py-3 text-sm font-semibold text-obsidian transition-opacity hover:opacity-90"
            >
              Find My Robot
            </Link>
            <Link
              href="/advisor"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-electric-blue hover:text-electric-blue"
            >
              Talk to AI Advisor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
