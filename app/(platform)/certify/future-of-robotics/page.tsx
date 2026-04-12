import type { Metadata } from "next";
import Link from "next/link";
import { ROBOTICS_MEGATRENDS } from "@/lib/certify/trend-modules";
import { AUTONOMY_LEVELS } from "@/lib/certify/autonomy-levels";

export const metadata: Metadata = {
  title:
    "Where Robotics Is Going: 2026-2035 -- Future of Robot Operations | Robotomated",
  description:
    "12 megatrends reshaping robotics. From agentic AI to swarm intelligence to robot cybersecurity. Understand where the industry is heading and how to prepare your career.",
  keywords: [
    "future of robotics",
    "robotics careers 2030",
    "agentic AI robotics",
    "robot operator jobs",
    "VLA models",
    "digital twin robotics",
    "robot cybersecurity",
    "swarm intelligence",
  ],
};

const IMPACT_COLORS = {
  transformational: "bg-red-500/10 text-red-400 border-red-500/20",
  critical: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  high: "bg-blue/10 text-blue border-blue/20",
};

export default function FutureOfRoboticsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ INDUSTRY INTELLIGENCE ]
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Where Robotics Is Going:{" "}
            <span className="text-blue">2026-2035</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            12 megatrends reshaping how robots work, how humans work with robots,
            and what skills the next generation of operators will need.
            <br />
            <span className="mt-2 block font-semibold text-white">
              We are not certifying people to operate today&apos;s robots. We are
              certifying people to thrive in the autonomous future.
            </span>
          </p>
        </div>
      </section>

      {/* Autonomy Framework */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ THE AUTONOMY FRAMEWORK ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold">
            Robot Autonomy Levels: L0 to L5
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted">
            Like SAE driving levels but for all robots. Understanding where your
            robot falls on this spectrum defines what skills you need.
          </p>

          <div className="space-y-4">
            {AUTONOMY_LEVELS.map((level) => (
              <div
                key={level.level}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue/20 bg-blue/5 font-[family-name:var(--font-brand)] text-xl font-bold text-blue">
                    L{level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-white">
                        {level.name}
                      </h3>
                      <span className="rounded-full bg-violet/10 px-2.5 py-0.5 text-[13px] font-semibold text-violet">
                        RCO: {level.rcoLevelRequired}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {level.description}
                    </p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-border/50 bg-[#0C0C0C] px-3 py-2">
                        <p className="text-[13px] font-semibold uppercase tracking-wider text-green">
                          Human Role
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {level.humanRole}
                        </p>
                      </div>
                      <div className="rounded-lg border border-border/50 bg-[#0C0C0C] px-3 py-2">
                        <p className="text-[13px] font-semibold uppercase tracking-wider text-blue">
                          Failure Mode
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {level.failureMode}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {level.examples.map((ex) => (
                        <span
                          key={ex}
                          className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted"
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12 Megatrends */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ 12 MEGATRENDS ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold">
            The Forces Reshaping Robotics
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted">
            Every certification level addresses the trends relevant to that
            operator&apos;s role. Master and Fleet Commander candidates must
            understand all 12.
          </p>

          <div className="space-y-6">
            {ROBOTICS_MEGATRENDS.map((trend) => (
              <div
                key={trend.id}
                className="rounded-2xl border border-border bg-[#0A0A0A] p-6 sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white/45">
                        {String(trend.number).padStart(2, "0")}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        {trend.name}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[13px] font-bold uppercase tracking-wider ${IMPACT_COLORS[trend.impactLevel]}`}
                      >
                        {trend.impactLevel}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-green">
                      {trend.tagline}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {trend.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                      Timeframe
                    </p>
                    <p className="text-xs text-white">{trend.timeframe}</p>
                  </div>
                </div>

                {/* What operators need to know */}
                <div className="mt-5 border-t border-border pt-5">
                  <p className="mb-3 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.1em] text-blue">
                    What Operators Need to Know
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {trend.whatOperatorsNeedToKnow.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-xs text-muted"
                      >
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key tech + companies */}
                <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                      Key Tech
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trend.keyTechnologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border px-2 py-0.5 text-[13px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                      Key Companies
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trend.keyCompanies.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-violet/20 bg-violet/5 px-2 py-0.5 text-[13px] text-violet"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Relevant levels */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {trend.relevantLevels.map((l) => (
                    <span
                      key={l}
                      className="rounded-full bg-green/10 px-2 py-0.5 text-[13px] font-semibold text-green"
                    >
                      {l.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">
            Prepare for the{" "}
            <span className="text-blue">autonomous future</span>
          </h2>
          <p className="mt-4 text-muted">
            The RCO certification program is updated quarterly to reflect these
            trends. Your certification stays current until renewal — at no extra
            cost.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/certify"
              className="inline-flex items-center rounded-lg bg-blue px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue/90"
            >
              Start Your Certification
            </Link>
            <Link
              href="/certify/why-certify"
              className="inline-flex items-center rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Why Certify?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
