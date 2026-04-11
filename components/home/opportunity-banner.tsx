import Link from "next/link";

const CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-[var(--theme-accent-blue)]">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
    stat: "$24T",
    title: "Projected market by 2040",
    body: "Robotics is on track to be one of the largest industries in human history. The infrastructure to support it — operators, platforms, standards — barely exists yet.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-[var(--theme-accent-blue)]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    stat: "+34%",
    title: "RCO holders earn more on RoboWork",
    body: "Certified operators command a premium — and that gap is widening as businesses demand accountability, safety compliance, and insurance coverage for every deployment.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5 text-[var(--theme-accent-blue)]">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
    stat: "73%",
    title: "Incident reduction with certified ops",
    body: "Insurance carriers are starting to require RCO certification. Early movers who are already certified will be the ones businesses must hire to stay compliant and covered.",
  },
];

export function OpportunityBanner() {
  return (
    <section
      className="border-t px-6 py-32"
      style={{ borderColor: "var(--theme-border)", background: "var(--theme-bg)", color: "var(--theme-text-primary)" }}
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 flex items-center gap-2 font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[var(--theme-accent-blue)]">
          <span className="inline-block h-px w-8 bg-[var(--theme-accent-blue)]" />
          The $24 Trillion Shift
        </p>
        <h2
          className="font-display font-bold tracking-[-0.03em]"
          style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--theme-text-primary)" }}
        >
          Robots are replacing<br className="hidden sm:block" />
          human labor faster than<br className="hidden lg:block" />
          anyone predicted.
        </h2>
        <p
          className="mt-6 max-w-[600px] text-lg leading-relaxed"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          137 humanoid companies in China alone. Figure AI at $39.5B. Amazon
          deploying Digit at scale. The window to move is open right now.
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border p-6"
              style={{
                background: "var(--theme-card)",
                borderColor: "var(--theme-border)",
              }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-[10px]"
                style={{ background: "var(--theme-accent-blue-dim)" }}
              >
                {card.icon}
              </div>
              <p
                className="font-[family-name:var(--font-brand)] text-3xl font-bold"
                style={{ color: "var(--theme-accent-blue)" }}
              >
                {card.stat}
              </p>
              <h3
                className="mt-1 font-display text-base font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {card.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/certify"
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: "var(--theme-accent-blue)",
              color: "#fff",
            }}
          >
            Get RCO Certified
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
