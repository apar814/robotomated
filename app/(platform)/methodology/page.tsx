import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScoreBar } from "@/components/ui/robo-score";
import { ScoreARobot } from "@/components/ui/score-a-robot";
import { DIMENSIONS } from "@/lib/scoring/roboscore";

export const metadata: Metadata = {
  title: "RoboScore Methodology — How We Rate Robots",
  description: "Our transparent, explainable scoring system. Learn exactly how RoboScore rates robots across 8 weighted dimensions.",
};

export default function MethodologyPage() {
  return (
    <div>
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Methodology", href: "/methodology" },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
            RoboScore Methodology
          </h1>
          <p className="mt-3 text-muted">
            Our scoring system is fully public. No black boxes. No pay-to-play. Every score is explainable.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-xl font-bold">How It Works</h2>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Every robot in our database receives a RoboScore from 0 to 100. This score is a weighted average
            of 8 individual dimension scores, each measuring a distinct aspect of the robot&apos;s capabilities.
          </p>
          <p className="mb-4 text-sm leading-relaxed text-muted">
            Each dimension is scored independently on a 0–100 scale, then combined using the weights below.
            The result is a single number that represents the robot&apos;s overall quality — while the breakdown
            shows exactly where it excels and where it falls short.
          </p>

          <div className="mt-8 rounded-xl border border-border bg-navy-light p-6">
            <h3 className="mb-1 text-center text-sm font-semibold text-muted">Example: Perfect Scores</h3>
            <p className="mb-6 text-center text-xs text-muted">If a robot scored 100 on every dimension</p>
            <div className="mx-auto max-w-md space-y-3">
              {DIMENSIONS.map((dim) => (
                <ScoreBar
                  key={dim.key}
                  label={dim.label}
                  score={100}
                  weight={`${Math.round(dim.weight * 100)}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions detail */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-xl font-bold">The 8 Dimensions</h2>
          <div className="space-y-8">
            {DIMENSIONS.map((dim, i) => (
              <div key={dim.key} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 font-mono text-sm font-bold text-white">
                  {Math.round(dim.weight * 100)}%
                </div>
                <div>
                  <h3 className="font-semibold">{dim.label}</h3>
                  <p className="mt-1 text-sm text-muted">{dim.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    {getDetailedDescription(dim.key)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold">Our Process</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { step: "1", title: "Data Collection", desc: "We gather official specs, run benchmarks where possible, and collect real-world usage data from operators and owners." },
              { step: "2", title: "Dimension Scoring", desc: "Each dimension receives a 0–100 score based on objective criteria calibrated against the full database." },
              { step: "3", title: "Weighted Average", desc: "Dimension scores are combined using fixed weights (shown above). The formula never changes based on the robot." },
              { step: "4", title: "Peer Review", desc: "Scores are reviewed for consistency across the category. We recalibrate when new robots shift benchmarks." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="rounded-xl border border-border bg-navy-light p-5">
                <span className="font-mono text-xs text-white">{step}</span>
                <h3 className="mt-1 font-semibold">{title}</h3>
                <p className="mt-2 text-xs text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Independence */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-xl font-bold">Editorial Independence</h2>
          <div className="rounded-xl border border-orange/20 bg-orange/5 p-6">
            <p className="text-sm leading-relaxed text-muted">
              <strong className="text-foreground">Manufacturers cannot pay to influence scores.</strong>{" "}
              We don&apos;t accept sponsored reviews. Our revenue comes from affiliate commissions
              and subscriptions — never from manufacturers trying to boost their ratings.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              If we discover a conflict of interest, we disclose it publicly and re-score
              affected robots. Editorial independence is our core value proposition.
            </p>
          </div>
        </div>
      </section>

      {/* Score interpretation */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-xl font-bold">Score Interpretation</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy-lighter">
                  <th className="px-4 py-3 text-left font-medium text-muted">Range</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Rating</th>
                  <th className="px-4 py-3 text-left font-medium text-muted">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { range: "90–100", rating: "Exceptional", color: "text-white", meaning: "Best-in-class. Excels across most dimensions." },
                  { range: "80–89", rating: "Excellent", color: "text-white", meaning: "Strong performer with minor trade-offs." },
                  { range: "70–79", rating: "Good", color: "text-white", meaning: "Solid choice for most use cases." },
                  { range: "60–69", rating: "Average", color: "text-white/60", meaning: "Gets the job done but has notable weaknesses." },
                  { range: "Below 60", rating: "Below Average", color: "text-white/60", meaning: "Consider alternatives unless uniquely suited." },
                ].map(({ range, rating, color, meaning }, i) => (
                  <tr key={range} className={i % 2 === 0 ? "bg-navy-light" : "bg-navy-lighter"}>
                    <td className="px-4 py-3 font-mono font-semibold">{range}</td>
                    <td className={`px-4 py-3 font-semibold ${color}`}>{rating}</td>
                    <td className="px-4 py-3 text-muted">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Score a Robot tool */}
      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-xl font-bold">Score a Robot Your Way</h2>
          <p className="mb-8 text-sm text-muted">
            Every buyer has different priorities. Adjust the weights below to see how your use case
            changes what matters most. A warehouse manager might weight Performance at 40% and Design at 0%.
            A hospital administrator might weight Safety at 30%.
          </p>
          <ScoreARobot />
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold">See It in Action</h2>
          <p className="mt-3 text-muted">
            Browse our database and see how RoboScore helps you compare robots objectively.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/explore" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90">
              Explore Robots
            </Link>
            <Link href="/reviews" className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter">
              Read Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function getDetailedDescription(key: string): string {
  const details: Record<string, string> = {
    performance: "We measure task-specific metrics: suction power for vacuums, payload capacity for industrial arms, picks-per-hour for warehouse AMRs. Raw capability under real-world conditions.",
    reliability: "Based on manufacturer MTBF data, warranty terms, build quality assessment, and real-world failure reports from operators. Longer track records score higher.",
    ease_of_use: "How quickly can a new user set up and operate the robot? We evaluate unboxing experience, app quality, programming interfaces, and documentation completeness.",
    intelligence: "Autonomy level, sensor suite quality, mapping accuracy, object recognition, and decision-making capability. Can it handle unexpected situations without human intervention?",
    value: "Price-to-capability ratio considering the total cost of ownership — not just sticker price. We factor in maintenance costs, consumables, and expected operational savings.",
    ecosystem: "Integration breadth (APIs, smart home, WMS), accessory availability, third-party support, community size, and vendor stability. Proprietary lock-in reduces this score.",
    safety: "Certifications (ISO, UL, CE), collision avoidance systems, force-limiting, emergency stop reliability, and compliance with relevant safety standards for the category.",
    design: "Industrial design quality, ergonomics, space efficiency, and visual coherence. A minor factor but relevant for consumer products and shared workspaces.",
  };
  return details[key] || "";
}
