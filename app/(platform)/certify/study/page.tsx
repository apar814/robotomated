import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "RCO Study Center -- Prepare for Your Certification | Robotomated",
  description:
    "Structured learning paths, practice questions, and weak-area targeting for all RCO certification levels.",
};

const STUDY_LEVELS = [
  {
    slug: "foundation",
    level: 1,
    name: "Foundation",
    hours: "14 hours across 5 modules",
    modules: 5,
    practiceQuestions: "100+",
    color: "blue",
    badge: "bg-blue/10 text-blue border-blue/20",
    border: "border-blue/20 hover:border-blue/50",
    cta: "bg-blue hover:bg-blue/90",
    description:
      "Core safety, robot types, deployment basics, fault diagnosis, and compliance.",
    moduleNames: [
      "Robot Safety Fundamentals",
      "Robot Types & Architecture",
      "Basic Deployment & Operations",
      "Basic Fault Diagnosis",
      "Compliance, Ethics & Documentation",
    ],
  },
  {
    slug: "specialist",
    level: 2,
    name: "Specialist",
    hours: "32 hours across 4 modules",
    modules: 4,
    practiceQuestions: "150+",
    color: "green",
    badge: "bg-green/10 text-green border-green/20",
    border: "border-green/20 hover:border-green/50",
    cta: "bg-green hover:bg-green/90 text-navy",
    description:
      "Advanced programming, fleet management, live fault diagnosis, and computer vision.",
    moduleNames: [
      "Robot Programming & Control Systems",
      "Multi-Robot Fleet Operations",
      "Live Fault Diagnosis Under Pressure",
      "Computer Vision & AI Integration",
    ],
  },
  {
    slug: "master",
    level: 3,
    name: "Master",
    hours: "49 hours across 4 modules",
    modules: 4,
    practiceQuestions: "200+",
    color: "violet",
    badge: "bg-violet/10 text-violet border-violet/20",
    border: "border-violet/20 hover:border-violet/50",
    cta: "bg-violet hover:bg-violet/90",
    description:
      "Sim-to-real transfer, dexterous manipulation, world models, and system architecture.",
    moduleNames: [
      "Simulation to Reality Bridge",
      "Dexterous Manipulation",
      "World Models & Scene Understanding",
      "Edge Inference & System Architecture",
    ],
  },
  {
    slug: "fleet-commander",
    level: 4,
    name: "Fleet Commander",
    hours: "62 hours across 4 modules",
    modules: 4,
    practiceQuestions: "150+",
    color: "amber",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    border: "border-amber-500/20 hover:border-amber-500/50",
    cta: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700",
    description:
      "Program design, crisis management, business operations, and enterprise capstone prep.",
    moduleNames: [
      "Program Design & Training",
      "Crisis Management & Incident Command",
      "Robot Business Operations",
      "Enterprise Capstone Preparation",
    ],
  },
];

export default function StudyCenterPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-[#2563EB]">
            [ STUDY CENTER ]
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Prepare for Your{" "}
            <span className="text-blue">Certification</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Structured learning paths, unlimited practice questions, and
            AI-powered weak-area targeting. Study at your pace.
          </p>
        </div>
      </section>

      {/* Study paths */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          {STUDY_LEVELS.map((lvl) => (
            <div
              key={lvl.slug}
              className={`rounded-2xl border bg-[#0A0A0A] p-6 transition-all sm:p-8 ${lvl.border}`}
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[13px] font-bold uppercase tracking-[0.1em] ${lvl.badge}`}
                    >
                      Level {lvl.level}
                    </span>
                    <span className="text-xs text-muted">{lvl.hours}</span>
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white">
                    {lvl.name} Study Path
                  </h2>
                  <p className="mt-2 text-sm text-muted">{lvl.description}</p>

                  {/* Module list */}
                  <div className="mt-5 space-y-2">
                    {lvl.moduleNames.map((mod, idx) => (
                      <div
                        key={mod}
                        className="flex items-center gap-3 text-sm text-muted"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border font-[family-name:var(--font-mono)] text-[13px] text-white">
                          {idx + 1}
                        </span>
                        {mod}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:items-end">
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                        {lvl.modules}
                      </p>
                      <p className="text-[13px] uppercase tracking-wider text-muted">
                        Modules
                      </p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                        {lvl.practiceQuestions}
                      </p>
                      <p className="text-[13px] uppercase tracking-wider text-muted">
                        Questions
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/certify/study/${lvl.slug}`}
                    className={`mt-2 inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all ${lvl.cta}`}
                  >
                    Start Studying
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study features */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold">
            Study System Features
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Structured Learning Paths",
                desc: "Modules in the right order with time estimates and prerequisites.",
              },
              {
                title: "Practice Questions",
                desc: "Unlimited practice from the question bank. Different subset each session.",
              },
              {
                title: "Study vs Test Mode",
                desc: "Study mode shows feedback after each answer. Test mode simulates the real exam.",
              },
              {
                title: "Weak Area Targeting",
                desc: "After each session, see domains below 80%. Focus practice mode for weak areas.",
              },
              {
                title: "Progress Tracking",
                desc: "Track completion across modules. Resume where you left off.",
              },
              {
                title: "Robotimus Assistant",
                desc: "Ask Robotimus to explain any topic. Pre-loaded with curriculum context.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-[#0A0A0A] p-5"
              >
                <h3 className="font-[family-name:var(--font-ui)] text-sm font-bold uppercase tracking-[0.06em] text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
