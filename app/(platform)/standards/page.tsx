import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Robotics Safety Standards Center -- Independent Tracker | Robotomated",
  description:
    "The only independent robotics safety certification tracker in the industry. ISO 10218, ISO/TS 15066, IEC 62061, UL 2271, FDA 510(k), and emerging standards for collaborative robots.",
  openGraph: {
    title:
      "Robotics Safety Standards Center -- Independent Tracker | Robotomated",
    description:
      "Independent tracker for robotics safety certifications. ISO, IEC, UL, FDA, and emerging collaborative robot standards.",
    url: "https://robotomated.com/standards",
    type: "website",
  },
  alternates: {
    canonical: "https://robotomated.com/standards",
  },
};

type StandardStatus = "ratified" | "in-development";

interface Standard {
  name: string;
  body: string;
  description: string;
  appliesTo: string[];
  status: StandardStatus;
}

const STANDARDS: Standard[] = [
  {
    name: "ISO 10218-1",
    body: "ISO",
    description:
      "Safety requirements for industrial robot design and construction. Defines protective stop categories, speed limits, and force thresholds for robot arms.",
    appliesTo: ["Industrial", "Manufacturing"],
    status: "ratified",
  },
  {
    name: "ISO 10218-2",
    body: "ISO",
    description:
      "Safety requirements for industrial robot systems integration. Covers cell layout, safeguarding devices, and risk assessment procedures for complete workcell installations.",
    appliesTo: ["Industrial", "Manufacturing", "Warehouse"],
    status: "ratified",
  },
  {
    name: "ISO/TS 15066",
    body: "ISO",
    description:
      "Technical specification for collaborative robot systems. Defines force and pressure thresholds for human-robot contact across 29 body regions.",
    appliesTo: ["Collaborative", "Manufacturing", "Healthcare"],
    status: "ratified",
  },
  {
    name: "IEC 62061",
    body: "IEC",
    description:
      "Functional safety of electrical control systems for machinery. Specifies SIL (Safety Integrity Level) requirements for robot safety controllers and E-stop circuits.",
    appliesTo: ["Industrial", "Manufacturing"],
    status: "ratified",
  },
  {
    name: "UL 2271",
    body: "UL",
    description:
      "Safety standard for battery systems in light electric vehicles and robots. Covers thermal runaway, short circuit, overcharge, and crush testing for lithium-ion packs.",
    appliesTo: ["Mobile Robots", "Delivery", "Warehouse"],
    status: "ratified",
  },
  {
    name: "UN 38.3",
    body: "UN",
    description:
      "Transport testing for lithium batteries. Required for shipping any robot containing lithium cells. Covers altitude simulation, thermal cycling, vibration, shock, and short circuit.",
    appliesTo: ["All Robot Types", "Shipping"],
    status: "ratified",
  },
  {
    name: "FDA 510(k)",
    body: "FDA",
    description:
      "Premarket notification for medical devices including surgical robots, rehabilitation robots, and patient monitoring systems. Requires substantial equivalence demonstration.",
    appliesTo: ["Medical", "Surgical", "Rehabilitation"],
    status: "ratified",
  },
  {
    name: "IEEE P7009",
    body: "IEEE",
    description:
      "Standard for fail-safe design of autonomous and semi-autonomous systems. Addresses graceful degradation, human takeover protocols, and minimum risk conditions.",
    appliesTo: ["Autonomous Systems", "Delivery", "Security"],
    status: "in-development",
  },
  {
    name: "ASTM F3538",
    body: "ASTM",
    description:
      "Standard practice for safe operation of personal care robots in home and eldercare environments. Covers proximity sensing, fall prevention, and vulnerable population safeguards.",
    appliesTo: ["Eldercare", "Home", "Personal Care"],
    status: "in-development",
  },
];

const TIMELINE_STEPS = [
  {
    year: "2025",
    label: "Development",
    description: "Working groups drafting specifications",
    color: "var(--theme-blue, #00C2FF)",
    active: true,
  },
  {
    year: "2026",
    label: "Public Comment",
    description: "Industry review and feedback period",
    color: "var(--theme-violet, #7B2FFF)",
    active: false,
  },
  {
    year: "2027",
    label: "Ratification",
    description: "Final standards published",
    color: "var(--theme-green, #00E5A0)",
    active: false,
  },
  {
    year: "2028+",
    label: "Safe Deployment",
    description: "Collaborative deployment under certified standards",
    color: "var(--theme-green, #00E5A0)",
    active: false,
  },
];

const ENVIRONMENTS = [
  {
    name: "Warehouse with Trained Workers",
    description:
      "Controlled environment with safety-trained staff. Robots operate in defined zones with trained personnel who understand E-stop procedures and exclusion zones.",
    standards: [
      "ISO 10218-1",
      "ISO 10218-2",
      "IEC 62061",
      "UL 2271",
      "UN 38.3",
    ],
  },
  {
    name: "Hospital with Patients",
    description:
      "Semi-controlled environment with vulnerable individuals. Robots navigate shared corridors and interact near patients who may have limited mobility or cognitive impairment.",
    standards: [
      "ISO/TS 15066",
      "FDA 510(k)",
      "IEC 62061",
      "UL 2271",
      "UN 38.3",
    ],
  },
  {
    name: "Home with Vulnerable Populations",
    description:
      "Uncontrolled environment with elderly, children, or individuals with disabilities. No trained operators. Robots must be inherently safe with zero configuration required.",
    standards: [
      "ISO/TS 15066",
      "UL 2271",
      "UN 38.3",
      "ASTM F3538 (pending)",
      "IEEE P7009 (pending)",
    ],
  },
];

export default function StandardsPage() {
  const ratified = STANDARDS.filter((s) => s.status === "ratified");
  const inDevelopment = STANDARDS.filter((s) => s.status === "in-development");

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Robotics Safety Standards Center",
          description:
            "The only independent robotics safety certification tracker in the industry.",
          url: "https://robotomated.com/standards",
          publisher: {
            "@type": "Organization",
            name: "Robotomated",
            url: "https://robotomated.com",
          },
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[var(--theme-navy,#0A0F1E)] px-4 pb-12 pt-14">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--theme-navy,#0A0F1E)]" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Standards", href: "/standards" },
            ]}
          />
          <p className="mt-8 font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            [ SAFETY STANDARDS ]
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Robotics Safety Standards Center
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/50">
            The only independent tracker in the industry. No manufacturer
            sponsorship. No certification-for-hire. Just the facts on which
            standards exist, which are coming, and what they mean for your
            deployment.
          </p>
        </div>
      </section>

      {/* ── ALERT BANNER ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-16 pt-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] px-6 py-5 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
              !
            </span>
            <p className="text-sm leading-relaxed text-amber-200/80">
              <span className="font-semibold text-amber-200">Advisory:</span>{" "}
              Human-robot collaborative deployment standards are not expected to
              be ratified until 2027 at the earliest. Deployments in
              uncontrolled environments with vulnerable populations should
              proceed with additional risk assessment beyond current standards.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-4xl">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB] text-center">[ TIMELINE ]</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Collaborative Standards Timeline
          </h2>
          <div className="relative mt-14 flex items-start justify-between">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-4 h-px bg-white/[0.12]" />
            {TIMELINE_STEPS.map((step, i) => (
              <div
                key={step.year}
                className="relative z-10 flex flex-col items-center text-center"
                style={{ width: `${100 / TIMELINE_STEPS.length}%` }}
              >
                {/* Dot */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: step.color,
                    backgroundColor: step.active
                      ? step.color
                      : "transparent",
                  }}
                >
                  {step.active && (
                    <span className="h-2 w-2 rounded-full bg-[var(--theme-navy,#0A0F1E)]" />
                  )}
                </div>
                <p
                  className="mt-3 font-[family-name:var(--font-brand)] text-sm font-bold"
                  style={{ color: step.color }}
                >
                  {step.year}
                </p>
                <p className="mt-1 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-wider text-white/60">
                  {step.label}
                </p>
                <p className="mt-2 hidden text-xs leading-snug text-white/50 sm:block">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARDS BY STATUS ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          {/* Ratified */}
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-[var(--theme-green,#00E5A0)]/10 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-widest text-[var(--theme-green,#00E5A0)]">
                Ratified
              </span>
              <span className="text-sm text-white/50">
                {ratified.length} standards
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ratified.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl border border-[var(--theme-green,#00E5A0)]/10 bg-white/[0.02] p-6 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-mono text-base font-bold text-white">
                      {s.name}
                    </h3>
                    <span className="ml-2 shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-wider text-white/40">
                      {s.body}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {s.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.appliesTo.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[13px] font-medium text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Development */}
          <div className="mt-16">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 font-[family-name:var(--font-ui)] text-[13px] font-bold uppercase tracking-widest text-amber-400">
                In Development
              </span>
              <span className="text-sm text-white/50">
                {inDevelopment.length} standards
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inDevelopment.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl border border-amber-500/10 bg-white/[0.02] p-6 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-mono text-base font-bold text-white">
                      {s.name}
                    </h3>
                    <span className="ml-2 shrink-0 rounded-md bg-white/[0.06] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-wider text-white/40">
                      {s.body}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {s.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.appliesTo.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[13px] font-medium text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE BUYER GUIDANCE ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-6xl">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB] text-center">[ BUYER GUIDANCE ]</p>
          <h2 className="mt-3 text-center font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What Certifications Do You Need?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-white/40">
            Required standards depend on your deployment environment. The less
            controlled the environment, the more stringent the requirements.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {ENVIRONMENTS.map((env) => (
              <div
                key={env.name}
                className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                <h3 className="text-lg font-bold text-white">{env.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
                  {env.description}
                </p>
                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <p className="font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-widest text-white/50">
                    Required Standards
                  </p>
                  <ul className="mt-3 space-y-2">
                    {env.standards.map((std) => (
                      <li
                        key={std}
                        className="flex items-center gap-2 text-sm text-white/60"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-blue,#00C2FF)]" />
                        {std}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL ALERT CTA ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-16 pt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--theme-blue,#00C2FF)]/20 bg-[var(--theme-blue,#00C2FF)]/[0.03] p-10 text-center backdrop-blur-sm">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ ALERTS ]</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
            Get Notified When Standards Change
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            We monitor every standards body so you do not have to. Get
            alerts when new certifications are ratified, comment periods open,
            or requirements change for your deployment category.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="safety@yourcompany.com"
              className="flex-1 rounded-xl border border-white/[0.12] bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-[var(--theme-blue,#00C2FF)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--theme-blue,#00C2FF)]/50"
            />
            <button
              type="button"
              className="rounded-xl bg-[var(--theme-blue,#00C2FF)] px-6 py-3 text-sm font-semibold text-[var(--theme-navy,#0A0F1E)] transition-colors hover:bg-[var(--theme-blue,#00C2FF)]/80"
            >
              Subscribe to Alerts
            </button>
          </div>
          <p className="mt-3 text-xs text-white/45">
            Compliance updates only. No marketing. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── EXPLORE CTA ── */}
      <section className="bg-[var(--theme-navy,#0A0F1E)] px-4 pb-24 pt-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">[ EXPLORE ]</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
            Find Certified Robots
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            Browse our database filtered by safety certification. Every robot
            listing shows which standards it meets and which certifications are
            pending.
          </p>
          <Link
            href="/explore"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--theme-violet,#7B2FFF)] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--theme-violet,#7B2FFF)]/80"
          >
            Browse Certified Robots
          </Link>
        </div>
      </section>
    </div>
  );
}
