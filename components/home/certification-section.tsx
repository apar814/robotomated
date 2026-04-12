import Link from "next/link";

const CERT_LADDER = [
  { name: "RCO Foundation", price: "$299" },
  { name: "RCO Specialist", price: "$599" },
  { name: "RCO Master", price: "$1,299" },
  { name: "RCO Fleet Commander", price: "$2,499" },
];

const PRO_BENEFITS = [
  "Industry-recognized credential",
  "Pay yourself or have employer pay",
  "Renews every 2 years",
  "Manufacturer endorsements available",
];

const BIZ_BENEFITS = [
  "Certify your entire operations team",
  "Verify RSPs are RCO certified",
  "Reduce liability with certified operators",
  "Track team certifications in dashboard",
  "Bulk pricing available",
];

export function CertificationSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
          <span className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
            Certification
          </span>
        </div>

        <h2
          className="font-display text-3xl font-extrabold text-primary sm:text-4xl lg:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Get Certified. Get Hired.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-tertiary">
          The Robotomated Certified Operator (RCO) program is the industry
          standard credential for robotics professionals.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* LEFT -- For Professionals */}
          <div className="rounded-lg border border-border bg-obsidian-surface p-8">
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              For Professionals
            </p>
            <p className="mt-2 text-lg font-bold text-primary">
              Build your career in robotics.
            </p>

            {/* Certification ladder */}
            <div className="mt-8 space-y-0">
              {CERT_LADDER.map((cert, i) => (
                <div key={cert.name} className="flex items-stretch gap-4">
                  {/* Connecting line + dot */}
                  <div className="flex w-5 flex-col items-center">
                    {i > 0 && (
                      <div className="h-4 w-px bg-electric-blue/30" />
                    )}
                    <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-electric-blue bg-obsidian-surface" />
                    {i < CERT_LADDER.length - 1 && (
                      <div className="flex-1 w-px bg-electric-blue/30" />
                    )}
                  </div>

                  {/* Card */}
                  <div className="mb-3 flex-1 rounded border border-border bg-obsidian-hover px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-primary">
                        {cert.name}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-[13px] font-bold text-blue-400">
                        {cert.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <ul className="mt-6 space-y-2.5">
              {PRO_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span className="text-[14px] leading-[1.6] text-secondary">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/certify"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-[15px] font-bold tracking-[0.02em] text-black transition-all hover:-translate-y-0.5"
              style={{ background: "#2563EB" }}
            >
              Start Certification
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* RIGHT -- For Businesses */}
          <div className="rounded-lg border border-border bg-obsidian-surface p-8">
            <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#2563EB]">
              For Businesses
            </p>
            <p className="mt-2 text-lg font-bold text-primary">
              Train your team. Reduce risk.
            </p>

            {/* Benefits */}
            <ul className="mt-8 space-y-2.5">
              {BIZ_BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  <span className="text-[14px] leading-[1.6] text-secondary">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-border bg-obsidian-hover px-4 py-4">
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-blue-400">73%</p>
                <p className="mt-1 text-[13px] leading-[1.5] text-tertiary">
                  Certified operators reduce incidents by 73%
                </p>
              </div>
              <div className="rounded border border-border bg-obsidian-hover px-4 py-4">
                <p className="font-[family-name:var(--font-brand)] text-2xl font-bold text-blue-400">+34%</p>
                <p className="mt-1 text-[13px] leading-[1.5] text-tertiary">
                  RCO holders earn 34% more on RoboWork
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/certify"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg border px-7 py-3.5 text-[15px] font-semibold text-[var(--theme-text-primary)] transition-all hover:-translate-y-0.5 hover:border-[#2563EB] hover:text-[#2563EB]"
              style={{ borderColor: "var(--theme-border)" }}
            >
              Certify Your Team
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
