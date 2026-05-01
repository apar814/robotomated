import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "RCO Awareness -- Free Robot Literacy Certification | Robotomated",
  description:
    "Free Level 0 robot literacy certification. 5 modules, 40 questions, 3 hours. No prerequisites. Permanent credential. Join 10,000+ professionals who understand the robot economy.",
};

/* ═══════════════════════════════════════════════════
   MODULE DATA
   ═══════════════════════════════════════════════════ */

const MODULES = [
  {
    number: 1,
    title: "The Robot Revolution",
    time: "45 min",
    description:
      "Why robots are arriving now, the 5 types you need to know, and real deployments changing industries today.",
    topics: [
      "The convergence of AI + hardware + cost reduction",
      "5 robot types: AMR, cobot, industrial, drone, humanoid",
      "Real deployments: warehouse, hospital, farm, construction",
      "The $0.45/hour reality vs. human labor economics",
      "Who is winning the robot race (and why it matters to you)",
    ],
  },
  {
    number: 2,
    title: "How Robots Actually Work",
    time: "60 min",
    description:
      "Sensors, actuators, the AI brain, power systems, and communications. No engineering degree required.",
    topics: [
      "Sensors: LiDAR, cameras, force/torque, IMU",
      "Actuators: motors, grippers, wheels, legs",
      "The AI brain: perception, planning, control loops",
      "Power: batteries, charging, runtime tradeoffs",
      "Communications: WiFi, 5G, ROS2, fleet protocols",
    ],
  },
  {
    number: 3,
    title: "Working Safely Alongside Robots",
    time: "45 min",
    description:
      "The 5 safety rules every person near a robot must know. Emergency procedures. When to call for help.",
    topics: [
      "The 5 universal robot safety rules",
      "Emergency stop procedures (every type of robot)",
      "Safety zones: collaborative, restricted, exclusion",
      "Common incidents and how they happen",
      "Your legal rights working alongside robots",
    ],
  },
  {
    number: 4,
    title: "The Robot Economy",
    time: "30 min",
    description:
      "Buy vs. lease vs. hire. Robot-as-a-Service (RaaS). Total cost of ownership. The $0.45/hour reality.",
    topics: [
      "Buy vs. lease vs. RaaS: when each makes sense",
      "Total cost of ownership beyond purchase price",
      "The $0.45/hour robot vs. the $25/hour human",
      "Jobs robots create (not just replace)",
      "How to evaluate ROI on a robot investment",
    ],
  },
  {
    number: 5,
    title: "Your First Robot Interaction",
    time: "30 min",
    description:
      "Browser-based simulator. 3 tasks to complete. Prove you can interact with a robot safely and effectively.",
    topics: [
      "Task 1: Navigate an AMR through a warehouse",
      "Task 2: Teach a cobot a simple pick-and-place",
      "Task 3: Emergency stop a malfunctioning robot",
      "Debrief: what you learned, what surprised you",
      "Your readiness score and next steps",
    ],
  },
];

const WHO_IS_THIS_FOR = [
  {
    role: "Warehouse Workers",
    why: "Robots are already on your floor. Understanding them makes you more valuable, not replaceable.",
  },
  {
    role: "Facility Managers",
    why: "You will evaluate robot vendors within 2 years. Know what questions to ask.",
  },
  {
    role: "Executives",
    why: "Stop relying on vendor pitches. Understand the technology driving your automation decisions.",
  },
  {
    role: "Students",
    why: "The robotics job market grows 25% annually. Get certified before you graduate.",
  },
  {
    role: "Anyone Curious",
    why: "Robots are entering everyday life. Literacy is the new advantage.",
  },
];

/* ═══════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════ */

export default function AwarenessPage() {
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
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ FREE CERTIFICATION ]
          </p>

          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Become{" "}
            <span className="text-white font-semibold">
              Robot Literate
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            3 hours. Zero prerequisites. Permanent credential.
            <br />
            <span className="font-semibold text-white">
              Join 10,000+ professionals who understand the robot economy.
            </span>
          </p>

          {/* Stats */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "FREE", label: "Forever" },
              { value: "40", label: "Questions" },
              { value: "5", label: "Modules" },
              { value: "\u221E", label: "Permanent" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/certify/exam?level=0"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Start Free &rarr;
            </Link>
            <p className="text-xs text-muted">
              No credit card. Just your email to receive your certificate.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ 5 MODULES ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ 5 MODULES ]
          </p>
          <h2 className="mb-4 text-center font-display text-3xl font-bold sm:text-4xl">
            Everything You Need to Know
          </h2>
          <p className="mx-auto mb-14 max-w-xl text-center text-muted">
            Each module is self-paced. Complete them in order or jump to
            what interests you. All free, forever.
          </p>

          <div className="space-y-6">
            {MODULES.map((mod) => (
              <div
                key={mod.number}
                className="group relative rounded-2xl border border-border bg-[#0A0A0A] p-7 transition-all hover:border-white/20"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Number badge */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white/5">
                    <span className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                      {String(mod.number).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-xl font-bold text-white">
                        {mod.title}
                      </h3>
                      <span className="rounded-full border border-border px-3 py-1 font-[family-name:var(--font-mono)] text-xs text-muted">
                        {mod.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {mod.description}
                    </p>

                    {/* Topics */}
                    <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
                      {mod.topics.map((topic) => (
                        <div
                          key={topic}
                          className="flex items-start gap-2 text-xs text-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE EXAM ═══ */}
      <section className="border-y border-border px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ THE EXAM ]
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Prove Your Literacy
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            40 questions. 60 minutes. 70% to pass.
            <br />
            <span className="font-semibold text-white">
              Unlimited retakes. Immediate results.
            </span>
          </p>

          <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "40", label: "Questions" },
              { value: "60", label: "Minutes" },
              { value: "70%", label: "To Pass" },
              { value: "\u221E", label: "Retakes" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-[#0A0A0A] px-4 py-5"
              >
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] uppercase tracking-[0.1em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted">
            Domain-level feedback on every attempt. Know exactly where to
            improve.
          </p>
        </div>
      </section>

      {/* ═══ WHO IS THIS FOR ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ WHO IS THIS FOR ]
          </p>
          <h2 className="mb-12 text-center font-display text-3xl font-bold sm:text-4xl">
            Built for Everyone
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHO_IS_THIS_FOR.map((persona) => (
              <div
                key={persona.role}
                className="rounded-xl border border-border bg-[#0A0A0A] p-6 transition-all hover:border-white/20"
              >
                <h3 className="font-display text-base font-bold text-white">
                  {persona.role}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {persona.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CAREER PATH ═══ */}
      <section className="border-y border-border bg-[#0A0A0A] px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.2em] text-muted">
            [ WHAT COMES NEXT ]
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Level 0 Is Just the Beginning
          </h2>
          <p className="mt-4 text-muted">
            Pass Level 0 and unlock a{" "}
            <span className="font-semibold text-white">$20 discount</span> on
            Level 1 Foundation.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-lg border border-border bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L0 Awareness
              </p>
              <p className="text-xs text-muted">FREE</p>
            </div>
            <span className="text-muted">&rarr;</span>
            <div className="rounded-lg border border-border bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L1 Foundation
              </p>
              <p className="text-xs text-muted">
                <span className="text-muted line-through">$149</span>{" "}
                <span className="font-semibold text-white">$129</span>
              </p>
            </div>
            <span className="text-muted">&rarr;</span>
            <div className="rounded-lg border border-border bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L2 Specialist
              </p>
              <p className="text-xs text-muted">$299</p>
            </div>
            <span className="text-muted">&rarr;</span>
            <div className="rounded-lg border border-border bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L3 Master
              </p>
              <p className="text-xs text-muted">$499</p>
            </div>
            <span className="text-muted">&rarr;</span>
            <div className="rounded-lg border border-border bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L4 Commander
              </p>
              <p className="text-xs text-muted">$799</p>
            </div>
            <span className="text-muted">&rarr;</span>
            <div className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5">
              <p className="font-[family-name:var(--font-brand)] text-sm font-bold text-white">
                L5 CRO
              </p>
              <p className="text-xs text-muted">$2,499</p>
            </div>
          </div>

          <Link
            href="/certify/level"
            className="mt-8 inline-flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
          >
            View full certification ladder &rarr;
          </Link>
        </div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Start Your Robot Literacy Journey —{" "}
            <span className="text-white font-semibold">Free</span>
          </h2>
          <p className="mt-4 text-muted">
            3 hours. 5 modules. 40 questions. Permanent credential. Zero
            cost.
          </p>
          <div className="mt-8">
            <Link
              href="/certify/exam?level=0"
              className="inline-flex items-center rounded-lg border border-white/20 bg-white/5 px-10 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            >
              Start Free &rarr;
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
