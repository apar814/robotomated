import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Robots in Eldercare -- Solving the Global Caregiver Shortage | Robotomated",
  description:
    "Robotic care solutions for senior living, nursing homes, and hospitals. Compare eldercare robots for medication delivery, cleaning, companionship, and fall detection.",
  openGraph: {
    title:
      "Robots in Eldercare -- Solving the Global Caregiver Shortage | Robotomated",
    description:
      "Robotic care solutions for senior living, nursing homes, and hospitals. Compare eldercare robots for medication delivery, cleaning, companionship, and fall detection.",
    url: "https://robotomated.com/eldercare",
    type: "article",
  },
  alternates: {
    canonical: "https://robotomated.com/eldercare",
  },
};

const STATS = [
  {
    value: "100M+",
    label: "Caregivers needed globally by 2050",
    color: "var(--theme-blue, #D4D4D4)",
  },
  {
    value: "355K",
    label: "US caregiver shortage by 2040",
    color: "var(--theme-neutral, #D4D4D4)",
  },
  {
    value: "$10/day",
    label: "Robot operating cost vs $46/hr human",
    color: "var(--theme-green, #00E5A0)",
  },
  {
    value: "24/7",
    label: "8-hour shifts, no burnout",
    color: "var(--theme-blue, #D4D4D4)",
  },
];

const PROBLEMS = [
  {
    title: "Caregiver Shortage",
    stat: "7.4M",
    statLabel: "unfilled care positions globally",
    description:
      "The aging population is growing faster than the workforce trained to support it. By 2040, the US alone will be short 355,000 paid caregivers with no pipeline to fill the gap.",
  },
  {
    title: "Burnout Crisis",
    stat: "79%",
    statLabel: "of caregivers report burnout",
    description:
      "Physical strain from lifting, repetitive cleaning, and 12-hour shifts drives turnover above 60% annually. The people who stay suffer chronic injuries and compassion fatigue.",
  },
  {
    title: "Cost Pressure",
    stat: "$108K",
    statLabel: "average annual cost per resident",
    description:
      "Skilled nursing costs have risen 40% in a decade. Facilities face impossible math: raise prices beyond what families can pay, or cut staff ratios below what patients need.",
  },
];

const ROBOT_TASKS = [
  { task: "Medication delivery", icon: "Rx" },
  { task: "Meal delivery", icon: "M" },
  { task: "Linen transport", icon: "L" },
  { task: "Floor cleaning", icon: "C" },
  { task: "Security patrol", icon: "S" },
  { task: "Vital signs monitoring", icon: "V" },
  { task: "Fall detection", icon: "F" },
  { task: "Companionship", icon: "Co" },
];

const HUMAN_TASKS = [
  "Medical decisions",
  "Complex care",
  "Emotional support",
  "Family communication",
  "Emergency response",
];

const CASE_STUDIES = [
  {
    title: "Hospital TUG Fleet -- 47% Nurse Time Reclaimed",
    environment: "400-bed urban hospital",
    robot: "Aethon TUG T3",
    result:
      "Deployed 6 TUG robots for pharmacy, lab specimen, and linen transport. Nurses reclaimed 47% of time previously spent walking corridors. Medication delivery errors dropped 68% with automated chain-of-custody logging.",
    metric: "47%",
    metricLabel: "nurse time reclaimed",
  },
  {
    title: "Senior Living Relay -- Meal Delivery at Scale",
    environment: "220-unit assisted living community",
    robot: "Relay Robotics Service Bot",
    result:
      "Three Relay robots handle meal delivery across 4 floors, serving 660 meals daily. Staff reassigned from cart-pushing to resident interaction. Resident satisfaction scores increased 31% within 6 months.",
    metric: "660",
    metricLabel: "meals delivered daily",
  },
  {
    title: "Nursing Home Autonomous Cleaning",
    environment: "150-bed skilled nursing facility",
    robot: "Brain Corp BrainOS Floor Scrubber",
    result:
      "Autonomous floor scrubbers run nightly cleaning cycles across 42,000 sq ft. Infection rates dropped 23% due to consistent cleaning protocols. Environmental services staff reduced from 8 to 3 per shift with zero reduction in cleanliness scores.",
    metric: "23%",
    metricLabel: "infection rate reduction",
  },
];

export default function EldercarePage() {
  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline:
            "Robots in Eldercare -- Solving the Global Caregiver Shortage",
          description:
            "Robotic care solutions for senior living, nursing homes, and hospitals.",
          url: "https://robotomated.com/eldercare",
          publisher: {
            "@type": "Organization",
            name: "Robotomated",
            url: "https://robotomated.com",
          },
          datePublished: "2026-04-03",
          dateModified: "2026-04-03",
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[var(--theme-navy,#000000)] px-4 pb-20 pt-14">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--theme-navy,#000000)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Industries", href: "/industries" },
              { name: "Eldercare", href: "/eldercare" },
            ]}
          />
          <p className="mt-8 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ ELDERCARE ROBOTICS ]
          </p>
          <p className="mt-3 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--theme-blue,#D4D4D4)]">
            Industry Deep Dive
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Robotic Care for an Aging World
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/50">
            The world will need 100 million caregivers by 2050. There will not
            be enough humans to fill the gap. Robots are not the replacement --
            they are the force multiplier that keeps care systems from
            collapsing.
          </p>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 text-center backdrop-blur-sm"
            >
              <p
                className="font-[family-name:var(--font-brand)] text-3xl font-extrabold sm:text-4xl"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="mt-2 font-[family-name:var(--font-ui)] text-xs uppercase leading-snug tracking-[0.06em] text-white/40">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM SECTION ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ THE CRISIS ]
          </p>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The Crisis in Numbers
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                <p className="font-[family-name:var(--font-brand)] text-4xl font-extrabold text-[var(--theme-blue,#D4D4D4)]">
                  {p.stat}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-white/40">
                  {p.statLabel}
                </p>
                <h3 className="mt-6 text-lg font-bold text-white">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION STATEMENT ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Robots don&apos;t replace caregivers.
            <br />
            <span className="text-[var(--theme-green,#00E5A0)]">
              They protect them.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
            Automate the physical grind so humans can focus on what only humans
            can do: complex medical judgment, emotional connection, and
            compassionate presence.
          </p>
        </div>
      </section>

      {/* ── TASK GRID ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Robot tasks */}
            <div className="rounded-2xl border border-[var(--theme-blue,#D4D4D4)]/20 bg-[var(--theme-blue,#D4D4D4)]/[0.03] p-8">
              <p className="mb-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
                [ TASK DIVISION ]
              </p>
              <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-[var(--theme-blue,#D4D4D4)]">
                What Robots Handle
              </h3>
              <ul className="mt-6 space-y-4">
                {ROBOT_TASKS.map((t) => (
                  <li key={t.task} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-blue,#D4D4D4)]/10 font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--theme-blue,#D4D4D4)]">
                      {t.icon}
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {t.task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Human tasks */}
            <div className="rounded-2xl border border-[var(--theme-neutral,#D4D4D4)]/20 bg-[var(--theme-neutral,#D4D4D4)]/[0.03] p-8">
              <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-[var(--theme-neutral,#D4D4D4)]">
                What Humans Keep Doing
              </h3>
              <ul className="mt-6 space-y-4">
                {HUMAN_TASKS.map((task) => (
                  <li key={task} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-neutral,#D4D4D4)]/10 font-[family-name:var(--font-mono)] text-xs font-bold text-[var(--theme-neutral,#D4D4D4)]">
                      H
                    </span>
                    <span className="text-sm font-medium text-white/80">
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ CASE STUDIES ]
          </p>
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real Deployments, Measured Results
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-white/40">
            Three facilities. Three robot categories. Quantified outcomes.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.title}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                <p className="font-[family-name:var(--font-brand)] text-4xl font-extrabold text-[var(--theme-green,#00E5A0)]">
                  {cs.metric}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-white/40">
                  {cs.metricLabel}
                </p>
                <h3 className="mt-6 text-base font-bold leading-snug text-white">
                  {cs.title}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-xs font-medium uppercase tracking-[0.06em] text-[var(--theme-blue,#D4D4D4)]">
                  {cs.environment} -- {cs.robot}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/50">
                  {cs.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROBOWORK CTA ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-16 pt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/20 bg-white/[0.04] p-10 text-center backdrop-blur-sm">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ GET STARTED ]
          </p>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to Automate Your Facility?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            Post an eldercare robotics job on RoboWork and get matched with
            certified integrators, leasing providers, and deployment specialists.
          </p>
          <Link
            href="/robowork"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
          >
            Post an Eldercare Job
          </Link>
        </div>
      </section>

      {/* ── BUYER GUIDE CTA ── */}
      <section className="bg-[var(--theme-navy,#000000)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center backdrop-blur-sm">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
            [ BUYER GUIDE ]
          </p>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Eldercare Robotics Buyer Guide
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            A comprehensive comparison of eldercare robots across medication
            delivery, cleaning, companionship, and mobility assistance. Includes
            pricing, ROI calculators, and compliance checklists.
          </p>
          <p className="mt-4 text-xs text-white/50">
            Enter your email to download -- no spam, unsubscribe anytime.
          </p>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="work@facility.com"
              className="flex-1 rounded-xl border border-white/[0.12] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#D4D4D4)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#D4D4D4)]/50"
            />
            <button
              type="button"
              className="rounded-xl bg-[var(--theme-blue,#D4D4D4)] px-6 py-3 text-sm font-semibold text-[var(--theme-navy,#000000)] transition-colors hover:bg-[var(--theme-blue,#D4D4D4)]/80"
            >
              Download Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
