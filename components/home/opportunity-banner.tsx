import Link from "next/link";

const CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" style={{ color: "var(--interactive, #D4D4D4)" }}>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" style={{ color: "var(--interactive, #D4D4D4)" }}>
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" style={{ color: "var(--interactive, #D4D4D4)" }}>
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
        <div className="section-marker mb-4">07 / THE OPPORTUNITY</div>
        <h2
          className="font-[family-name:var(--font-sans)] font-medium tracking-[-0.03em]"
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

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="p-6"
              style={{
                background: "var(--theme-card, #0A0A0A)",
                border: "1px solid var(--theme-border, #1F1F1F)",
                borderRadius: "2px",
              }}
            >
              <div className="mb-4">{card.icon}</div>
              <p
                className="font-[family-name:var(--font-mono)] text-3xl font-medium"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {card.stat}
              </p>
              <h3
                className="mt-1 font-[family-name:var(--font-sans)] text-base font-medium"
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
            className="inline-flex items-center gap-2 border px-6 py-3 text-[14px] font-medium uppercase tracking-[0.04em] transition-colors duration-75 hover:border-white hover:text-white"
            style={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: "2px",
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
