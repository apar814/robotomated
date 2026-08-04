import Link from "next/link";

interface CTAOption {
  title: string;
  description: string;
  cta: string;
  href: string;
  intent: string;
}

const CTA_OPTIONS: CTAOption[] = [
  {
    title: "Compare & research",
    description: "Search the full database, run TCO calculations, read independent reviews.",
    cta: "Explore robots",
    href: "/explore",
    intent: "DECISION-MAKER / RESEARCHER",
  },
  {
    title: "Buy or lease",
    description: "Purchase outright, lease monthly, or certified pre-owned.",
    cta: "Find my robot",
    href: "/find-my-robot",
    intent: "PROCUREMENT / OPERATIONS",
  },
  {
    title: "Hire a robot",
    description: "Post a job, get verified bids in 24h. Pay per outcome, not equipment.",
    cta: "Post a job",
    href: "/robowork/post",
    intent: "RAAS BUYER",
  },
  {
    title: "Get certified",
    description: "The RCO program. Earn more on RoboWork.",
    cta: "Start certification",
    href: "/certify",
    intent: "OPERATORS / PROFESSIONALS",
  },
];

export function CTANavigation() {
  return (
    <section className="px-6 py-28" style={{ background: "var(--theme-bg)" }}>
      <div className="mx-auto max-w-7xl">
        <div className="section-marker">02 / CHOOSE YOUR PATH</div>
        <h2
          className="font-[family-name:var(--font-sans)] font-medium tracking-[-0.02em]"
          style={{ fontSize: "clamp(32px, 4vw, 40px)", color: "var(--theme-text-primary)" }}
        >
          One platform, four ways in
        </h2>

        <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: "var(--theme-border)" }}>
          {CTA_OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="group flex h-full flex-col p-8 transition-colors"
              style={{ background: "var(--theme-bg)" }}
            >
              <span
                className="block text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {option.intent}
              </span>

              <span
                className="mt-4 block font-[family-name:var(--font-sans)] text-[18px] font-medium"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {option.title}
              </span>

              <span className="mt-2 block flex-grow text-[14px] leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                {option.description}
              </span>

              <span
                className="mt-6 inline-block self-start border border-white/20 px-4 py-2 text-[12px] font-medium uppercase tracking-[0.04em] text-white/80 transition-colors group-hover:border-white group-hover:text-white"
                style={{ borderRadius: "2px" }}
              >
                {option.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
