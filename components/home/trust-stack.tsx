import Link from "next/link";
import { CERT_LEVELS } from "@/lib/certifications";

interface TrustSignal {
  stat: string;
  label: string;
  description: string;
  href: string;
}

// Claim-based stats (+73% incident reduction, +34% earning premium, $24T market)
// are intentionally absent: no citation exists anywhere in the repo for them.
// Only database-backed numbers and product facts (cert level count) render here.
export function TrustStack({
  totalRobots,
  manufacturerCount,
}: {
  totalRobots: number;
  manufacturerCount: number;
}) {
  const signals: TrustSignal[] = [
    {
      stat: "0%",
      label: "MANUFACTURER BIAS",
      description: "No paid placements. Ever.",
      href: "/methodology",
    },
    {
      stat: String(totalRobots),
      label: "ROBOTS TRACKED",
      description: "Every spec, every review.",
      href: "/explore",
    },
    {
      stat: String(manufacturerCount),
      label: "MANUFACTURERS",
      description: "Independently scored.",
      href: "/manufacturers",
    },
    {
      stat: String(CERT_LEVELS.length),
      label: "CERTIFICATION LEVELS",
      description: "From awareness to CRO.",
      href: "/certify",
    },
  ];

  return (
    <section className="px-6 py-28" style={{ background: "var(--theme-bg)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="section-marker">03 / TRUST</div>
        <h2
          className="font-[family-name:var(--font-sans)] font-medium tracking-[-0.02em]"
          style={{ fontSize: "clamp(32px, 4vw, 40px)", color: "var(--theme-text-primary)" }}
        >
          Independent by design
        </h2>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4">
          {signals.map((signal, i) => (
            <Link
              key={signal.label}
              href={signal.href}
              className="group px-6 py-8"
              style={{ borderRight: i < signals.length - 1 ? "1px solid var(--theme-border)" : "none" }}
            >
              <span
                className="block font-[family-name:var(--font-mono)] font-medium"
                style={{ fontSize: "clamp(28px, 3vw, 48px)", color: "var(--theme-text-primary)" }}
              >
                {signal.stat}
              </span>
              <span
                className="mt-2 block text-[12px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {signal.label}
              </span>
              <span className="mt-3 block text-[14px]" style={{ color: "var(--theme-text-secondary)" }}>
                {signal.description}
              </span>
              <span
                className="mt-4 block text-[12px] font-medium uppercase tracking-[0.12em] text-white/40 transition-colors group-hover:text-white"
              >
                View &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
