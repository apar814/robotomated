import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Robotomated Certified Operator (RCO) -- Industry Standard Robotics Credential",
  description:
    "Earn the Robotomated Certified Operator credential. Four levels from Foundation to Fleet Commander. Recognized by leading manufacturers and employers worldwide.",
};

const CERTIFICATIONS = [
  {
    level: 1,
    name: "Foundation",
    slug: "1",
    price: 149,
    questions: 50,
    duration: 60,
    passScore: 75,
    prerequisites: "None",
    color: "blue" as const,
    description:
      "Core robotics knowledge for anyone entering the field. Covers safety protocols, terminology, basic operations, and fundamental concepts.",
    skills: [
      "General robot safety",
      "Industry terminology",
      "Basic robot operations",
      "Emergency stop procedures",
      "Workspace safety zones",
      "Basic maintenance awareness",
    ],
  },
  {
    level: 2,
    name: "Specialist",
    slug: "2",
    price: 299,
    questions: 100,
    duration: 90,
    passScore: 75,
    prerequisites: "Level 1 Foundation",
    color: "violet" as const,
    description:
      "Deep expertise in your chosen specialization. Master the systems, safety protocols, and operational procedures for your robot category.",
    skills: [
      "Category-specific operations",
      "Advanced safety protocols",
      "Troubleshooting and diagnostics",
      "Integration fundamentals",
      "Performance optimization",
      "Compliance and regulations",
    ],
    specializations: [
      "AMR (Autonomous Mobile Robots)",
      "Collaborative Robots (Cobots)",
      "Industrial Robotics",
      "Drone Systems",
      "Medical Robotics",
      "Agricultural Robotics",
      "Humanoid Robotics",
    ],
  },
  {
    level: 3,
    name: "Master",
    slug: "3",
    price: 499,
    questions: 150,
    duration: 120,
    passScore: 80,
    prerequisites: "Level 2 Specialist",
    color: "green" as const,
    description:
      "Advanced multi-system expertise. Fleet management, cross-platform integration, advanced safety engineering, and operational excellence.",
    skills: [
      "Fleet management",
      "Advanced safety engineering",
      "Cross-platform integration",
      "Workflow automation design",
      "Risk assessment and mitigation",
      "Team training and leadership",
    ],
  },
  {
    level: 4,
    name: "Fleet Commander",
    slug: "4",
    price: 799,
    questions: 150,
    duration: 150,
    passScore: 80,
    prerequisites: "Level 3 Master",
    color: "violet" as const,
    description:
      "Enterprise-grade fleet operations and automation strategy. The highest RCO credential for leaders managing large-scale robotics deployments.",
    skills: [
      "Enterprise fleet operations",
      "Automation strategy",
      "ROI analysis and business cases",
      "Vendor evaluation and selection",
      "Regulatory compliance at scale",
      "Organizational change management",
    ],
  },
];

const LEVEL_BORDER: Record<string, string> = {
  blue: "border-blue/30 hover:border-blue/60",
  violet: "border-violet/30 hover:border-violet/60",
  green: "border-green/30 hover:border-green/60",
};

const LEVEL_BADGE_BG: Record<string, string> = {
  blue: "bg-blue/10 text-blue",
  violet: "bg-violet/10 text-violet",
  green: "bg-green/10 text-green",
};

const LEVEL_CTA: Record<string, string> = {
  blue: "bg-blue hover:bg-blue/90",
  violet: "bg-violet hover:bg-violet/90",
  green: "bg-green hover:bg-green/90 text-navy",
};

export default function CertifyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
            [ CERTIFICATION HUB ]
          </p>
          <div className="mt-4 mb-6 inline-block rounded-full bg-violet/10 px-4 py-1.5 font-[family-name:var(--font-ui)] text-sm font-medium uppercase tracking-[0.06em] text-violet">
            RCO Certification Program
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Become a Robotomated{" "}
            <span className="text-blue">Certified Operator</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            The industry-standard credential for robotics professionals.
            Four levels. Recognized by employers and manufacturers worldwide.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted">
            <div className="text-center">
              <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">2,400+</p>
              <p>Certified operators</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">180+</p>
              <p>Employers recognize RCO</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="font-[family-name:var(--font-brand)] text-3xl font-bold text-white">45+</p>
              <p>Manufacturers endorse</p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification levels */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-center font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
            [ CERTIFICATION LEVELS ]
          </p>
          <h2 className="mb-4 text-center font-display text-2xl font-bold sm:text-3xl">
            Four Levels of Mastery
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted">
            Each level builds on the last. Start at Foundation and advance
            through to Fleet Commander as your expertise grows.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.level}
                className={`glass-card rounded-xl p-6 transition-all ${LEVEL_BORDER[cert.color]}`}
              >
                {/* Badge + price */}
                <div className="mb-4 flex items-start justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-[0.06em] ${LEVEL_BADGE_BG[cert.color]}`}
                  >
                    Level {cert.level}
                  </span>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-mono)] text-2xl font-bold text-white">
                      ${cert.price}
                    </p>
                    <p className="font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-muted">one-time</p>
                  </div>
                </div>

                {/* Name + description */}
                <h3 className="font-display text-xl font-bold text-white">
                  {cert.name}
                </h3>
                <p className="mt-2 text-sm text-muted">{cert.description}</p>

                {/* Specializations (Level 2 only) */}
                {cert.specializations && (
                  <div className="mt-4">
                    <p className="mb-2 font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                      Choose your specialization
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cert.specializations.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full border border-border px-2.5 py-0.5 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-muted"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam details */}
                <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.06em] text-muted">
                  <span><span className="font-[family-name:var(--font-brand)]">{cert.questions}</span> questions</span>
                  <span><span className="font-[family-name:var(--font-brand)]">{cert.duration}</span> min</span>
                  <span><span className="font-[family-name:var(--font-brand)]">{cert.passScore}%</span> to pass</span>
                  <span>Prereq: {cert.prerequisites}</span>
                </div>

                {/* Skills */}
                <div className="mt-4">
                  <p className="mb-2 font-[family-name:var(--font-ui)] text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                    Skills validated
                  </p>
                  <ul className="grid grid-cols-2 gap-1 text-xs text-muted">
                    {cert.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/certify/${cert.slug}`}
                    className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors ${LEVEL_CTA[cert.color]}`}
                  >
                    Enroll Now
                  </Link>
                  <Link
                    href={`/certify/${cert.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-blue/30 hover:text-white"
                  >
                    View Details
                  </Link>
                </div>

                {/* Payment options */}
                <p className="mt-3 text-center text-[11px] text-muted">
                  Pay yourself | Have employer pay
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
            [ WHY IT MATTERS ]
          </p>
          <h2 className="font-display text-xl font-bold">
            Why RCO Matters
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-[family-name:var(--font-ui)] text-lg font-bold uppercase tracking-[0.06em] text-blue">Industry Standard</p>
              <p className="mt-2 text-sm text-muted">
                Built on real-world operational requirements, not academic theory.
                RCO validates what employers actually need.
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-ui)] text-lg font-bold uppercase tracking-[0.06em] text-violet">Manufacturer Endorsed</p>
              <p className="mt-2 text-sm text-muted">
                Leading robotics manufacturers recognize RCO credentials
                for operator certification and partner programs.
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-ui)] text-lg font-bold uppercase tracking-[0.06em] text-green">Publicly Verifiable</p>
              <p className="mt-2 text-sm text-muted">
                Every credential has a unique verification link. Employers
                can confirm certification status instantly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
