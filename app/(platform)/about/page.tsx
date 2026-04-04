import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Robotomated -- The Operating System for the Abundance Economy",
  description:
    "Robots are not replacing humans. Robots are freeing humans. Robotomated is the independent platform accelerating the transition to a world where humans work on what matters.",
  openGraph: {
    title: "About Robotomated -- The Operating System for the Abundance Economy",
    description:
      "Robots are not replacing humans. Robots are freeing humans. The independent intelligence layer for the robotics economy.",
    url: "https://robotomated.com/about",
    type: "website",
  },
};

const CHANNELS = [
  {
    number: "01",
    name: "Intelligence",
    description:
      "Unbiased reviews, scoring, and market intelligence. Every data point verified. Every methodology public.",
    example: "RoboScore benchmarks, industry reports, head-to-head comparisons",
    href: "/robots",
    cta: "Explore intelligence",
  },
  {
    number: "02",
    name: "Acquire",
    description:
      "Find and procure the right robot through marketplace matching, direct purchase, or lease-to-own programs.",
    example: "RFQ matching, vendor comparison, financing guidance",
    href: "/explore",
    cta: "Start acquiring",
  },
  {
    number: "03",
    name: "Deploy",
    description:
      "Integration planning, site readiness assessments, and launch support from certified providers.",
    example: "Facility mapping, safety compliance, workforce transition plans",
    href: "/robowork",
    cta: "Plan deployment",
  },
  {
    number: "04",
    name: "Operate",
    description:
      "Fleet management, maintenance scheduling, performance monitoring, and optimization dashboards.",
    example: "Uptime tracking, predictive maintenance, ROI analytics",
    href: "/robowork",
    cta: "Manage operations",
  },
  {
    number: "05",
    name: "Transition",
    description:
      "Upgrade paths, resale marketplace, end-of-life planning, and next-generation migration.",
    example: "Trade-in valuations, fleet refresh cycles, decommission protocols",
    href: "/explore",
    cta: "Plan transitions",
  },
];

const STATS = [
  { value: "975", label: "Robots tracked" },
  { value: "319", label: "Manufacturers indexed" },
  { value: "$24T", label: "Projected market by 2035" },
  { value: "137", label: "Chinese humanoid companies" },
  { value: "2027", label: "ISO safety standards deadline" },
];

export default function AboutPage() {
  return (
    <div>
      {/* ── SECTION 1: OPENING STATEMENT ── */}
      <section
        className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{ background: "#080808" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            <span
              className="block animate-fade-up text-white"
              style={{ animationDelay: "0ms", animationFillMode: "both" }}
            >
              Robots are not replacing humans.
            </span>
            <span
              className="mt-2 block animate-fade-up sm:mt-4"
              style={{
                color: "var(--theme-accent-lime)",
                animationDelay: "200ms",
                animationFillMode: "both",
              }}
            >
              Robots are freeing humans.
            </span>
          </h1>

          <p
            className="mx-auto mt-8 max-w-2xl animate-fade-up text-lg leading-relaxed sm:mt-12 sm:text-xl"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              animationDelay: "400ms",
              animationFillMode: "both",
            }}
          >
            To pursue what matters. To do work that has meaning.
            <br className="hidden sm:block" />
            To spend time with the people they love.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: THE PROBLEM ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ background: "#080808" }}>
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-center font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            The world faces an impossible labor equation.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                stat: "100M",
                context: "caregivers needed globally by 2050",
              },
              {
                stat: "2M",
                context: "manufacturing workers the US is short by 2030",
              },
              {
                stat: "25%",
                context: "of Americans over 70 will need daily care assistance by 2030",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-lg border p-6 text-center"
                style={{
                  borderColor: "var(--theme-border)",
                  background: "rgba(255, 255, 255, 0.03)",
                }}
              >
                <div
                  className="font-mono text-4xl font-extrabold sm:text-5xl"
                  style={{ color: "var(--theme-accent-blue)" }}
                >
                  {item.stat}
                </div>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {item.context}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            These aren&apos;t projections. This is math. Humanoid robots won&apos;t solve every
            problem. But they will solve these.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: THE BELIEF SYSTEM ── */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "var(--theme-section-alt, var(--theme-surface))" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-12 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            We believe three things.
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            <div
              className="rounded-lg border p-8"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Automation should be accessible.
              </h3>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                A 50-acre family farm and a Fortune 500 warehouse both deserve the same quality
                of robotics intelligence. The technology exists to serve everyone. The
                information layer should too. Access to automation guidance should not be gated
                by budget.
              </p>
            </div>

            <div
              className="rounded-lg border p-8"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Trust is the product.
              </h3>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                No manufacturer pays us to influence a score. No vendor gets preferred
                placement. Our only incentive is helping you make the right decision. The moment
                we compromise on that, we have nothing. Independence is not a feature. It is
                the entire foundation.
              </p>
            </div>

            <div
              className="rounded-lg border p-8"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                The abundance era is coming.
              </h3>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                Brett Adcock says we are building &ldquo;the iPhone moment for physical
                labor.&rdquo; Peter Diamandis calls it &ldquo;the single biggest economic
                transformation in human history.&rdquo; We agree. And we are building the
                infrastructure to make sure everyone benefits from it -- not just those who
                can afford consultants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: THE MISSION ── */}
      <section
        className="px-4 py-24 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(135deg, var(--theme-accent-blue), #0050aa)",
        }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl">
            We accelerate the transition to a world where humans work on what matters --
            and robots handle the rest.
          </blockquote>
        </div>
      </section>

      {/* ── SECTION 5: THE 5 CHANNELS ── */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "var(--theme-bg)" }}
      >
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-4 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            One platform. Five ways to participate in the robotics economy.
          </h2>
          <p
            className="mx-auto mb-14 max-w-2xl text-center text-base"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            The full lifecycle of robot adoption -- from research to retirement -- covered
            by a single independent platform.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((channel) => (
              <div
                key={channel.name}
                className="flex flex-col rounded-lg border p-6 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: "var(--theme-border)",
                  background: "var(--theme-card)",
                }}
              >
                <div
                  className="mb-4 font-mono text-3xl font-extrabold"
                  style={{ color: "var(--theme-accent-blue)" }}
                >
                  {channel.number}
                </div>
                <h3
                  className="mb-2 font-display text-lg font-bold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {channel.name}
                </h3>
                <p
                  className="mb-3 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {channel.description}
                </p>
                <p
                  className="mb-4 font-mono text-xs italic"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {channel.example}
                </p>
                <Link
                  href={channel.href}
                  className="mt-auto font-mono text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ color: "var(--theme-accent-blue)" }}
                >
                  {channel.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: THE NUMBERS ── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" style={{ background: "#080808" }}>
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-14 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            The landscape we cover.
          </h2>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-mono text-3xl font-extrabold sm:text-4xl"
                  style={{ color: "var(--theme-accent-blue)" }}
                >
                  {stat.value}
                </div>
                <p
                  className="mt-2 text-xs leading-relaxed sm:text-sm"
                  style={{ color: "var(--theme-text-secondary)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TEAM ETHOS ── */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        style={{ background: "var(--theme-bg)" }}
      >
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-10 font-display text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            We are independent. We are buyers-first.
          </h2>

          <div
            className="space-y-6 text-base leading-[1.8]"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            <p>
              Every feature, every recommendation, every piece of content exists to serve
              the buyer. If it does not help someone make a better decision, it does not
              ship. That is the filter. That is the standard. Full stop.
            </p>

            <p>
              Our scoring methodology is public. Our business model is public. Our conflicts
              of interest -- if any arise -- will be public. Trust is built in the open, and
              it is destroyed the moment you start hiding things. We choose radical
              transparency because it is the only approach that scales.
            </p>

            <p>
              Robotics should not require a PhD to understand or a Fortune 500 budget to
              access. We make automation approachable for businesses of every size -- from a
              single-location restaurant exploring service robots to a logistics company
              managing a fleet of thousands. Complexity on demand: simple by default, deep
              data when you need it.
            </p>

            <p>
              We believe the purpose of automation is to amplify human capability, not to
              replace human purpose. Every robot we recommend should give someone their time
              back -- time for creativity, for family, for the work that only humans can do.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CTAs ── */}
      <section
        className="px-4 py-20 sm:px-6 lg:px-8"
        style={{
          borderTop: "1px solid var(--theme-border)",
          background: "var(--theme-bg)",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            <Link
              href="/explore"
              className="group flex flex-col rounded-lg border p-8 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <span
                className="mb-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--theme-text-muted)" }}
              >
                For Businesses
              </span>
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Start your automation journey
              </h3>
              <p
                className="mt-2 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                Browse verified robots, compare specs, read independent reviews, and find the
                right solution for your operation.
              </p>
              <span
                className="mt-6 font-mono text-xs font-semibold"
                style={{ color: "var(--theme-accent-blue)" }}
              >
                Explore robots &rarr;
              </span>
            </Link>

            <Link
              href="/robowork/providers/register"
              className="group flex flex-col rounded-lg border p-8 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <span
                className="mb-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--theme-text-muted)" }}
              >
                For Providers
              </span>
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Grow your robotics business
              </h3>
              <p
                className="mt-2 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                Register as a verified Robot Service Provider. Reach qualified buyers. Build
                your reputation on the platform they trust.
              </p>
              <span
                className="mt-6 font-mono text-xs font-semibold"
                style={{ color: "var(--theme-accent-lime)" }}
              >
                Register as provider &rarr;
              </span>
            </Link>

            <Link
              href="/manufacturers/partner"
              className="group flex flex-col rounded-lg border p-8 transition-all duration-200 hover:-translate-y-1"
              style={{
                borderColor: "var(--theme-border)",
                background: "var(--theme-card)",
              }}
            >
              <span
                className="mb-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--theme-text-muted)" }}
              >
                For Manufacturers
              </span>
              <h3
                className="font-display text-lg font-bold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Reach the buyers who matter
              </h3>
              <p
                className="mt-2 flex-1 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                List your robots in our verified database. Earn independent reviews. Connect
                with serious buyers through the platform they use to make decisions.
              </p>
              <span
                className="mt-6 font-mono text-xs font-semibold"
                style={{ color: "var(--theme-accent-magenta, #ff006e)" }}
              >
                Partner with us &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
