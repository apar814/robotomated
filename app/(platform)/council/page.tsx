import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "RCO Advisory Council -- Governing Body for Robotics Certification | Robotomated",
  description:
    "The governing body of the world's most rigorous robotics certification. Every decision public. Every vote transparent. Composed of all Level 5 CRO holders.",
};

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

const COUNCIL_POWERS = [
  {
    title: "New Specializations",
    description:
      "Vote to add or retire specialization tracks based on industry demand and technology evolution.",
  },
  {
    title: "Curriculum Changes",
    description:
      "Approve updates to exam content, study materials, and assessment methodology across all levels.",
  },
  {
    title: "Level 4 to 5 Requirements",
    description:
      "Set and adjust the prerequisites and gate requirements for the CRO designation.",
  },
  {
    title: "Industry Standards",
    description:
      "Propose and ratify robotics operations standards that the certification reflects.",
  },
];

const CAREER_LADDER = [
  {
    level: "L0",
    name: "Awareness",
    color: "border-green/30 bg-green/5 text-green",
    accent: "bg-green",
  },
  {
    level: "L1",
    name: "Foundation",
    color: "border-blue/30 bg-blue/5 text-blue",
    accent: "bg-blue",
  },
  {
    level: "L2",
    name: "Specialist",
    color: "border-green/30 bg-green/5 text-green",
    accent: "bg-green",
  },
  {
    level: "L3",
    name: "Master",
    color: "border-violet/30 bg-violet/5 text-violet",
    accent: "bg-violet",
  },
  {
    level: "L4",
    name: "Commander",
    color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
    accent: "bg-amber-500",
  },
  {
    level: "L5",
    name: "CRO (Council)",
    color: "border-white/30 bg-white/5 text-white",
    accent: "bg-white",
  },
];

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */

export default function CouncilPage() {
  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden border-b border-border px-4 py-20 sm:py-28">
        {/* Background grid effect */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-violet">
            [ THE COUNCIL ]
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            RCO Advisory{" "}
            <span className="bg-gradient-to-r from-violet via-blue to-green bg-clip-text text-transparent">
              Council
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            The governing body of the world&apos;s most rigorous robotics
            certification.
            <br />
            <span className="font-semibold text-white">
              Every decision public. Every vote transparent.
            </span>
          </p>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ HOW IT WORKS ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Governance by Merit
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            The council is not appointed. It is earned. Every Level 5 CRO
            holder joins automatically. No politics. No gatekeeping. Just
            proven expertise.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {COUNCIL_POWERS.map((power) => (
              <div
                key={power.title}
                className="rounded-xl border border-violet/10 bg-[#0A0A0A] p-6 transition-all hover:border-violet/30"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {power.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {power.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Membership",
                value: "All Level 5 CRO holders",
              },
              { label: "Meetings", value: "Quarterly (virtual)" },
              { label: "Transparency", value: "All decisions published" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border bg-[#0A0A0A] px-5 py-4 text-center"
              >
                <p className="font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COUNCIL MEMBERS ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-violet">
            [ COUNCIL MEMBERS ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            The Founding Class
          </h2>

          {/* Empty state */}
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-dashed border-violet/20 px-8 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-violet/20 bg-violet/5">
              <span className="font-[family-name:var(--font-brand)] text-2xl font-bold text-violet">
                0
              </span>
            </div>
            <p className="text-lg font-semibold text-white">
              Founding class forming
            </p>
            <p className="mt-2 text-sm text-muted">
              The first CRO holders will establish the council. Their names
              will appear here — publicly, permanently.
            </p>
            <Link
              href="/certify/cro"
              className="mt-6 inline-flex items-center rounded-lg border border-violet/30 px-6 py-3 text-sm font-medium text-violet transition-colors hover:bg-violet/10"
            >
              Apply for Level 5 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PUBLISHED DECISIONS ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ PUBLISHED DECISIONS ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Decision Archive
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted">
            Every council decision is published here with full rationale and
            vote count. Transparency is not optional — it is constitutional.
          </p>

          {/* Empty state */}
          <div className="rounded-2xl border border-dashed border-border px-8 py-16 text-center">
            <p className="text-lg font-semibold text-white">
              No decisions yet
            </p>
            <p className="mt-2 text-sm text-muted">
              The council forms when the first CRO class is designated. All
              future decisions will be archived here.
            </p>

            {/* Future format preview */}
            <div className="mx-auto mt-8 max-w-md">
              <p className="mb-3 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                Future decision format
              </p>
              <div className="rounded-lg border border-border bg-[#0A0A0A] p-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-xs text-muted">
                    2026-XX-XX
                  </span>
                  <span className="rounded-full bg-green/10 px-2.5 py-0.5 text-[10px] font-bold text-green">
                    APPROVED
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-white">
                  [Decision Topic]
                </p>
                <p className="mt-1 text-xs text-muted">
                  Vote: X-Y | Rationale: [published reasoning]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW TO JOIN ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.2em] text-green">
            [ HOW TO JOIN ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            The Path to the Council
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted">
            The path to the council starts at Level 0. Start at any level.
            The council awaits those who earn it.
          </p>

          {/* Career ladder */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {CAREER_LADDER.map((step, i) => (
              <div key={step.level} className="flex items-center gap-3">
                <div
                  className={`rounded-lg border px-5 py-3 text-center ${step.color}`}
                >
                  <p className="font-[family-name:var(--font-brand)] text-sm font-bold">
                    {step.level}
                  </p>
                  <p className="text-xs opacity-70">{step.name}</p>
                </div>
                {i < CAREER_LADDER.length - 1 && (
                  <span className="text-muted">&rarr;</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/certify/awareness"
              className="inline-flex items-center rounded-lg bg-green px-8 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-green/90 hover:shadow-lg hover:shadow-green/20"
            >
              Start at Level 0 — Free
            </Link>
            <p className="mt-4 text-xs text-muted">
              Or{" "}
              <Link
                href="/certify"
                className="text-blue transition-colors hover:text-blue/80"
              >
                view all certification levels
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The industry governs itself —{" "}
            <span className="bg-gradient-to-r from-violet to-blue bg-clip-text text-transparent">
              transparently
            </span>
          </h2>
          <p className="mt-4 text-muted">
            No backroom deals. No pay-to-play. The people who earned the
            right to shape robotics certification are the people who shape
            it.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/certify/cro"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-navy transition-all hover:bg-white/90"
            >
              Learn About CRO Designation
            </Link>
            <Link
              href="/certify"
              className="inline-flex items-center rounded-lg border border-border px-8 py-3.5 text-sm font-medium text-muted transition-colors hover:border-violet/30 hover:text-white"
            >
              View All Levels
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">
            Issued by Robotomated — The Operating System for Robotics
          </p>
        </div>
      </section>
    </div>
  );
}
