import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "RCO Level 5: Chief Robotics Officer -- The CRO Designation | Robotomated",
  description:
    "The highest credential in robotics. Not awarded. Earned. Portfolio submission, panel review, and contribution commitment. The CRO designation is for those who have shaped the industry.",
};

/* ═══════════════════════════════════════════════════
   GATE DATA
   ═══════════════════════════════════════════════════ */

const PREREQUISITES = [
  "RCO Fleet Commander (Level 4)",
  "5+ years post-Level 4 experience",
];

const PLUS_ONE = [
  "Managed a 500+ robot fleet",
  "Founded a robotics company (revenue-generating)",
  "Published peer-reviewed robotics research",
  "VP+ role at a company deploying 100+ robots",
  "Led a government robotics program",
  "Created a university robotics curriculum",
];

const PANEL_SECTIONS = [
  { name: "Portfolio Defense", time: "15 min" },
  { name: "Technical Depth", time: "20 min" },
  { name: "Strategic Challenge", time: "20 min" },
  { name: "Industry Perspective", time: "20 min" },
  { name: "Open Q&A", time: "15 min" },
];

const SCORING_CATEGORIES = [
  { name: "Technical Mastery", weight: "25%" },
  { name: "Strategic Thinking", weight: "25%" },
  { name: "Leadership Impact", weight: "25%" },
  { name: "Communication", weight: "25%" },
];

const TIMELINE_STEPS = [
  { step: "Application", detail: "Submit portfolio + fee" },
  { step: "Gate 1 Review", detail: "30 days" },
  { step: "Panel Scheduled", detail: "2-4 weeks after Gate 1" },
  { step: "Decision", detail: "7 days after panel" },
  { step: "Certificate", detail: "14 days after decision" },
];

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */

export default function CROPage() {
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

        {/* Subtle glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 opacity-[0.04]">
          <div className="h-full w-full rounded-full bg-gradient-to-b from-white to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-white/70">
            [ LEVEL 5 — BY MERIT AND CONTRIBUTION ]
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              Chief Robotics Officer
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            The highest credential in robotics.{" "}
            <span className="font-semibold text-white">
              Not awarded. Earned.
            </span>
          </p>

          <p className="mt-6 font-[family-name:var(--font-brand)] text-2xl font-bold tracking-[0.05em] text-white sm:text-3xl">
            CRO{" "}
            <span className="text-base font-medium text-muted">
              (Robotomated Certified)
            </span>
          </p>

          <div className="mt-8">
            <p className="font-[family-name:var(--font-brand)] text-4xl font-bold text-white">
              $2,499
            </p>
            <p className="mt-2 text-sm text-muted">
              or waived for 40+ curriculum contribution hours
            </p>
          </div>
        </div>
      </section>

      {/* ═══ THE THREE GATES ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE THREE GATES ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Three Gates. No Shortcuts.
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            Every CRO holder has passed through all three gates. There is no
            alternative path. There is no exception process.
          </p>

          <div className="space-y-8">
            {/* Gate 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-7 transition-all hover:border-white/20">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.1em] text-white/70">
                    Gate 1
                  </span>
                  <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
                    PORTFOLIO SUBMISSION
                  </p>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                Portfolio Submission
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Your body of work, documented and defensible. This is not a
                resume — it is evidence.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-border px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    3 Deployment Case Studies
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    1,500-3,000 words each. Real deployments. Real numbers.
                    Real lessons learned.
                  </p>
                </div>
                <div className="rounded-lg border border-border px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    Published Work
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    White paper, patent, conference keynote, or book. Peer
                    recognition of your expertise.
                  </p>
                </div>
                <div className="rounded-lg border border-border px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    2 Reference Letters
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    From Level 4+ RCO holders or advisory board members who
                    can vouch for your impact.
                  </p>
                </div>
                <div className="rounded-lg border border-border px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    3 Self-Assessment Essays
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Your philosophy on robotics leadership, biggest failure
                    and what you learned, vision for the industry.
                  </p>
                </div>
              </div>
            </div>

            {/* Gate 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-7 transition-all hover:border-white/20">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.1em] text-white/70">
                    Gate 2
                  </span>
                  <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
                    PANEL REVIEW
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                    90
                  </p>
                  <p className="font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.06em] text-muted">
                    minutes
                  </p>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                Panel Review
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                90 minutes with 3 CRO holders or advisory board members. You
                defend your portfolio, your thinking, and your vision.
              </p>

              <div className="mt-6 space-y-2">
                {PANEL_SECTIONS.map((section) => (
                  <div
                    key={section.name}
                    className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                  >
                    <span className="text-sm font-medium text-white">
                      {section.name}
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-muted">
                      {section.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white/[0.02] p-4">
                <p className="mb-3 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Scoring
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SCORING_CATEGORIES.map((cat) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted">{cat.name}</span>
                      <span className="font-[family-name:var(--font-mono)] font-semibold text-white">
                        {cat.weight}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">
                  Pass: <span className="text-white">80% overall</span>, no
                  category below{" "}
                  <span className="text-white">70%</span>
                </p>
              </div>
            </div>

            {/* Gate 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-7 transition-all hover:border-white/20">
              <div className="mb-5">
                <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-[0.1em] text-white/70">
                  Gate 3
                </span>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
                  CONTRIBUTION COMMITMENT
                </p>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                Contribution Commitment
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                CRO is not a trophy. It is a commitment to give back to the
                profession. Every year. No exceptions.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    commitment: "Review 50 Master exam questions per year",
                    detail:
                      "Ensure the certification stays current and rigorous",
                  },
                  {
                    commitment:
                      "Mentor one Level 3 or Level 4 candidate per year",
                    detail: "Minimum 8 mentorship sessions",
                  },
                  {
                    commitment:
                      "Contribute curriculum content every 2 years",
                    detail:
                      "New modules, case studies, or assessment scenarios",
                  },
                  {
                    commitment: "Attend annual CRO summit",
                    detail:
                      "Virtual or in-person. Shape the future of the certification",
                  },
                ].map((item) => (
                  <div
                    key={item.commitment}
                    className="rounded-lg border border-border px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-white">
                      {item.commitment}
                    </p>
                    <p className="mt-1 text-xs text-muted">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PREREQUISITES ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ PREREQUISITES ]
          </p>
          <h2 className="mb-12 text-center font-display text-3xl font-bold sm:text-4xl">
            Who Can Apply
          </h2>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                Required
              </h3>
              <div className="space-y-3">
                {PREREQUISITES.map((req) => (
                  <div
                    key={req}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                      &#10003;
                    </span>
                    <span className="text-white">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                Plus ONE of the Following
              </h3>
              <div className="space-y-3">
                {PLUS_ONE.map((req) => (
                  <div
                    key={req}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                    <span className="text-muted">{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CRO COUNCIL ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE COUNCIL ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            The RCO Advisory Council
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted">
            All CRO holders form the RCO Advisory Council — the governing
            body of the world&apos;s most rigorous robotics certification.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Meets quarterly (virtual)",
              "Votes on curriculum changes",
              "Approves new specializations",
              "Sets Level 4 to 5 requirements",
              "Defines industry standards",
              "All decisions published publicly",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm text-muted"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/council"
              className="inline-flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
            >
              View Council Decisions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ TIMELINE ]
          </p>
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            From Application to Designation
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 h-full w-px bg-border sm:left-1/2" />

            <div className="space-y-6">
              {TIMELINE_STEPS.map((step, i) => (
                <div
                  key={step.step}
                  className="relative flex items-center gap-4 sm:justify-center"
                >
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-[#0A0A0A]">
                    <span className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border bg-[#050505] px-4 py-3 sm:w-72">
                    <p className="text-sm font-semibold text-white">
                      {step.step}
                    </p>
                    <p className="text-xs text-muted">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE ELON TEST ═══ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8">
            <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-white/60">
              [ THE ELON TEST ]
            </p>
            <h3 className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">
              &ldquo;Would Elon hire someone with CRO? Only if they earned
              it the right way.&rdquo;
            </h3>

            <div className="mt-6 space-y-3">
              {[
                "Deployed robots at scale — with documented results",
                "Published their thinking — peer-reviewed or industry-recognized",
                "Defended their work — to a panel of experts, live",
                "Contributes back — mentoring, curriculum, question review",
                "Renews or loses it — no lifetime pass for past achievement",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                    &#10003;
                  </span>
                  <span className="text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Apply for{" "}
            <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              CRO Designation
            </span>
          </h2>
          <p className="mt-4 text-muted">
            The founding class is forming. Be among the first to earn the
            highest credential in robotics.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href="/certify/cro/apply"
              className="inline-flex items-center rounded-lg bg-white px-10 py-4 text-sm font-semibold text-navy transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
            >
              Apply for CRO Designation
            </Link>
            <p className="font-[family-name:var(--font-mono)] text-sm text-muted">
              Current CRO Holders:{" "}
              <span className="font-bold text-white">0</span>{" "}
              <span className="text-xs">(founding class forming)</span>
            </p>
          </div>
          <p className="mt-6 text-xs text-muted">
            Issued by Robotomated — The Operating System for Robotics
          </p>
        </div>
      </section>
    </div>
  );
}
