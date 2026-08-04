import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Get RCO Certified -- Robot Operator Certification | Robotomated",
  description:
    "What RCO certification tests, the standards behind the curriculum, and how employers verify credentials.",
  keywords: [
    "robot operator certification",
    "robot operator jobs",
    "RCO certification value",
  ],
};

// Substantiated program facts only — pulled from the exam configuration
// itself (lib/certifications.ts). No testimonials: unattributed quotes were
// removed per docs/claims-policy.md.
const PROGRAM_FACTS = [
  {
    title: "Standards-based curriculum",
    body: "Exam content covers ISO 10218 (industrial robot safety), ISO/TS 15066 (collaborative robot force and pressure limits), E-Stop and lockout/tagout protocol, and OSHA-tracked incident metrics like lost-time incidents.",
  },
  {
    title: "Proctored, scored, renewable",
    body: "Every level is a timed exam with a published pass score. Higher levels add practical assessments. Certifications carry renewal dates — the curriculum is updated quarterly as the industry changes.",
  },
  {
    title: "Employer-verifiable credentials",
    body: "Every certificate has a public verification page. An employer can confirm any candidate's level, standing, and renewal date in seconds — no phone calls, no PDFs.",
  },
];

export default function WhyCertifyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE CASE FOR CERTIFICATION ]
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            The ROI of{" "}
            <span className="text-white font-semibold">RCO Certification</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            In a fast-growing field, certification is the
            difference between being a robot operator and being{" "}
            <span className="font-semibold text-white">the person they call when it matters</span>.
          </p>
        </div>
      </section>

      {/* What Certification Actually Tests */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            What Certification Actually Tests
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {PROGRAM_FACTS.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <p className="text-sm font-semibold text-white">{f.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Living Certification */}
      <section className="border-b border-border bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE LIVING CERTIFICATION ]
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold">
            Your Certification Evolves With the Industry
          </h2>
          <p className="mt-4 text-muted">
            The RCO program is updated quarterly as the robotics industry
            evolves. When you earn an RCO certification, you get access to all
            curriculum updates until your renewal date — at no extra cost.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Quarterly Updates",
                desc: "Curriculum reflects the latest in agentic AI, VLA models, digital twins, and emerging safety standards.",
              },
              {
                title: "Free Until Renewal",
                desc: "All updates included in your certification period. No additional fees.",
              },
              {
                title: "Always Current",
                desc: "Your RCO cert earned in Q1 2026 stays current through Q4 2027.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-xs text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications That Will Matter in 2030 */}
      <section className="border-b border-border px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center font-display text-2xl font-bold">
            Certifications That Will Matter in 2030
          </h2>

          <div className="space-y-4">
            {[
              {
                name: "RCO Foundation",
                why: "The baseline. Like a driver's license for robot operators. Every facility will require it.",
                timeline: "Required now at leading companies",
              },
              {
                name: "RCO Specialist — Agentic Systems",
                why: "The most in-demand track by 2027. Managing AI agents that control physical robots.",
                timeline: "Available 2026 — first movers win",
              },
              {
                name: "RCO Specialist — Cybersecurity",
                why: "A hacked robot can injure people. Security certification will be mandatory in critical infrastructure.",
                timeline: "Available 2026 — insurance will drive demand",
              },
              {
                name: "RCO Master",
                why: "Proves you can handle anything. The Gauntlet assessment is what separates the best from the rest.",
                timeline: "Increasing employer requirement for senior roles",
              },
              {
                name: "RCO Fleet Commander",
                why: "Enterprise leadership. Required for VP+ roles at companies with 100+ robot fleets.",
                timeline: "Growing requirement as fleets scale",
              },
            ].map((cert) => (
              <div
                key={cert.name}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {cert.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{cert.why}</p>
                <p className="mt-2 text-xs text-white">{cert.timeline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold">
            The future of robotics runs on{" "}
            <span className="text-white font-semibold">certified operators</span>.
          </h2>
          <p className="mt-4 text-muted">
            Start your certification journey today. No prerequisites for Level 1.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/certify"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Start RCO Foundation — $149
            </Link>
            <Link
              href="/certify/employer"
              className="inline-flex items-center rounded-lg border border-border px-8 py-4 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              Employer? Get bulk pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
