import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Robotomated -- The Operating System for Robotics",
  description:
    "Robotomated is the independent intelligence layer for the robotics era. We help buyers find, evaluate, deploy, and operate robots -- without bias.",
  openGraph: {
    title: "About Robotomated -- The Operating System for Robotics",
    description:
      "The independent intelligence layer for the robotics era. We help buyers find, evaluate, deploy, and operate robots.",
    url: "https://robotomated.com/about",
    type: "website",
  },
};

const CHANNELS = [
  {
    name: "Intelligence",
    description: "Unbiased reviews, data, and market intelligence to inform every decision.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    name: "Acquire",
    description: "Find and procure the right robot through marketplace or direct purchase.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  },
  {
    name: "Deploy",
    description: "Integration planning, site readiness, and launch support.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
  {
    name: "Operate",
    description: "Fleet management, maintenance scheduling, and performance monitoring.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.523-3.196a.75.75 0 010-1.299l5.523-3.195a.75.75 0 01.774 0l5.523 3.195a.75.75 0 010 1.3l-5.523 3.195a.75.75 0 01-.774 0zM4.898 17.512a.75.75 0 01-.376-.651V11.39l5.898 3.41a2.25 2.25 0 002.16 0l5.898-3.41v5.47a.75.75 0 01-.376.651l-5.898 3.41a2.25 2.25 0 01-2.16 0l-5.898-3.41z" />
      </svg>
    ),
  },
  {
    name: "Transition",
    description: "Upgrade paths, resale, and end-of-life planning for your fleet.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
      </svg>
    ),
  },
];

const VALUES = [
  {
    title: "Buyers First",
    description:
      "Every feature, every recommendation, every piece of content exists to serve the buyer. If it does not help someone make a better decision, it does not ship.",
  },
  {
    title: "Radical Transparency",
    description:
      "Our scoring methodology is public. Our business model is public. Our conflicts of interest -- if any arise -- will be public. Trust is built in the open.",
  },
  {
    title: "Accessible Automation",
    description:
      "Robotics should not require a PhD to understand or a Fortune 500 budget to access. We make automation approachable for businesses of every size.",
  },
  {
    title: "Human-Centered Technology",
    description:
      "We believe the purpose of automation is to amplify human capability, not to replace human purpose. Every robot should give someone their time back.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/[0.03] to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-electric-blue/20 bg-electric-blue/5 px-4 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-electric-blue">
              About Robotomated
            </span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
            The Operating System{" "}
            <span className="text-electric-blue">for Robotics.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            We are building the trusted, independent layer between robot buyers and the
            robotics industry. Unbiased intelligence. Transparent methodology. A platform
            that serves the buyer -- not the manufacturer.
          </p>
        </div>
      </section>

      {/* ── THE BELIEF ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              The Belief
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Robots are not replacing humans.{" "}
            <span className="text-lime">Robots are freeing humans.</span>
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            <p>
              The warehouse worker lifting 50-pound boxes twelve hours a day is not being
              &ldquo;replaced&rdquo; when a palletizing robot takes over the heaviest work. They are
              being freed -- to supervise, to solve problems, to move into roles that use their
              judgment instead of their joints. The same is true in hospitals, on construction
              sites, in agriculture, and in every industry where repetitive physical labor
              consumes human potential.
            </p>
            <p>
              But the transition to automation is hard. The market is confusing, the technology
              is complex, and the stakes are high. A warehouse manager making a $200,000 robot
              investment deserves the same quality of independent analysis that a homebuyer gets
              from a home inspector. That is what we are building.
            </p>
          </div>
        </div>
      </section>

      {/* ── THE MISSION ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              The Mission
            </span>
          </div>

          <blockquote className="font-display text-xl font-bold leading-snug tracking-tight text-text-primary sm:text-2xl lg:text-3xl">
            &ldquo;We accelerate the transition to a world where humans work on what
            matters -- and robots handle the rest.&rdquo;
          </blockquote>
        </div>
      </section>

      {/* ── FIVE CHANNELS ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-violet" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              The Platform
            </span>
          </div>

          <h2 className="mb-10 font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Five channels. One lifecycle.
          </h2>

          <div className="grid gap-4 sm:grid-cols-5">
            {CHANNELS.map((channel, i) => (
              <div
                key={channel.name}
                className="group relative flex flex-col items-center rounded-lg border border-border bg-obsidian-surface p-5 text-center transition-all hover:-translate-y-0.5 hover:border-border-active"
              >
                {i < CHANNELS.length - 1 && (
                  <div className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-text-ghost sm:block">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                )}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded bg-electric-blue/10 text-electric-blue transition-colors group-hover:bg-electric-blue/20">
                  {channel.icon}
                </div>
                <h3 className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                  {channel.name}
                </h3>
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  {channel.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
            The only platform that serves you across the entire robot lifecycle.
          </p>
        </div>
      </section>

      {/* ── WHY INDEPENDENT ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Why Independent
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            We don&apos;t sell robots. We don&apos;t manufacture robots.
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Our only incentive is to help you make the right decision. We earn money when
            you find the right robot -- not when you find the most expensive one. Our
            reviews are never influenced by manufacturer relationships, and our scoring
            methodology is fully public. Independence is not a feature. It is the
            foundation everything else is built on.
          </p>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Core Values
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border border-border bg-obsidian-surface p-6"
              >
                <h3 className="mb-2 font-display text-base font-bold text-text-primary">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FUTURE ── */}
      <section className="border-b border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-violet" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              The Future
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            In 10 years, robots will be as common in workplaces as computers are today.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            The question is not whether it will happen -- it is whether the transition will be
            guided by trusted, independent information or by vendor marketing. We are building
            the infrastructure to make sure it is the former.
          </p>
        </div>
      </section>

      {/* ── CTAs ── */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/robots"
              className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-6 transition-all hover:-translate-y-0.5 hover:border-electric-blue"
            >
              <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-electric-blue">
                Explore Robots
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Browse our database of verified robots with transparent scoring.
              </p>
              <span className="mt-4 font-mono text-[10px] text-electric-blue">
                Browse catalog &rarr;
              </span>
            </Link>

            <Link
              href="/robowork/post"
              className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-6 transition-all hover:-translate-y-0.5 hover:border-lime"
            >
              <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-lime">
                Post a Job
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Need a robot for a task? Post a job and get matched with verified providers.
              </p>
              <span className="mt-4 font-mono text-[10px] text-lime">
                Post now &rarr;
              </span>
            </Link>

            <Link
              href="/robowork/providers/register"
              className="group flex flex-col rounded-lg border border-border bg-obsidian-surface p-6 transition-all hover:-translate-y-0.5 hover:border-violet"
            >
              <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-violet">
                Become a Provider
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Own robots? Register as a Robot Service Provider and grow your business.
              </p>
              <span className="mt-4 font-mono text-[10px] text-violet">
                Register &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Robotomated exists right now ── */}
      <section className="px-6 py-16 sm:px-8" style={{ borderTop: "1px solid var(--theme-border)" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--theme-accent-magenta)" }} />
            <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: "var(--theme-text-muted)" }}>
              Market Context
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl" style={{ color: "var(--theme-text-primary)" }}>
            Why Robotomated exists right now.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-[1.8]" style={{ color: "var(--theme-text-secondary)" }}>
            <p>
              We are at the inflection point. The first commercially viable humanoid robots are entering
              the workforce. Manufacturing costs have dropped 90% in two years. Fleet neural learning
              means one robot{"'"}s experience instantly upgrades an entire fleet.
            </p>
            <p>
              But the buying landscape is complex: 137 Chinese manufacturers. No US-made humanoids
              commercially available as of early 2026. A 10-year typical deployment journey from
              prototype to scaled product. Data security questions nobody is answering.
            </p>
            <p>
              Businesses need an independent guide. Not a manufacturer with a product to sell.
              Not a consultant who charges $500/hour. A platform that serves buyers — with
              transparent data, independent scoring, and every tool needed to navigate the
              most significant workforce transformation since the internet.
            </p>
          </div>
          <div className="mt-8 flex gap-3">
            <Link
              href="/explore/humanoid"
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-black"
              style={{ background: "var(--theme-accent-blue)" }}
            >
              Explore Humanoid Robots
            </Link>
            <Link
              href="/tools/humanoid-comparison"
              className="rounded-lg border px-5 py-2.5 text-sm font-semibold"
              style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-primary)" }}
            >
              US vs China Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
