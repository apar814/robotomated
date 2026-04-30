import Link from "next/link";

const PILLARS = [
  {
    title: "Independent",
    description:
      "No manufacturer has ever paid for a RoboScore. Every ranking is earned through transparent, repeatable methodology. Our editorial independence is our moat.",
    stat: "0",
    statLabel: "Paid placements. Ever.",
    href: "/methodology",
  },
  {
    title: "Comprehensive",
    description:
      "Every robot worth considering. Every manufacturer worth knowing. Every category, price range, and geography. One platform to search them all.",
    stat: "900+",
    statLabel: "Robots tracked",
    href: "/explore",
  },
  {
    title: "Actionable",
    description:
      "From first search to deployed robot. Buy, lease, hire, certify, operate, transition. Robotomated covers the full lifecycle, not just the brochure.",
    stat: "5",
    statLabel: "Channels to access robots",
    href: "/advisor",
  },
];

export function WhyRobotomated() {
  return (
    <section
      className="border-y px-6 py-28"
      style={{
        borderColor: "var(--theme-border)",
        background: "var(--theme-section-alt)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="section-marker mb-4">06 / WHY ROBOTOMATED</div>
        <h2
          className="font-[family-name:var(--font-sans)] font-medium tracking-[-0.02em]"
          style={{
            fontSize: "clamp(28px, 3.5vw, 40px)",
            color: "var(--theme-text-primary)",
          }}
        >
          The intelligence layer the robotics industry was missing
        </h2>
        <p
          className="mt-4 max-w-2xl text-base leading-relaxed"
          style={{ color: "var(--theme-text-secondary)" }}
        >
          Manufacturer sites sell. Trade publications observe. Robotomated does
          what neither can: give you independent, scored, actionable intelligence
          on every robot that matters.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group block p-8 transition-colors duration-75"
              style={{
                border: "1px solid var(--theme-border, #1F1F1F)",
                background: "var(--theme-card)",
                borderRadius: "2px",
              }}
            >
              <p
                className="font-[family-name:var(--font-mono)] text-3xl font-medium"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {pillar.stat}
              </p>
              <p
                className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {pillar.statLabel}
              </p>

              <h3
                className="mt-6 font-[family-name:var(--font-sans)] text-xl font-medium"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {pillar.title}
              </h3>
              <p
                className="mt-3 text-[0.9rem] leading-relaxed"
                style={{ color: "var(--theme-text-secondary)" }}
              >
                {pillar.description}
              </p>

              <span
                className="mt-6 inline-block text-[12px] font-medium uppercase tracking-[0.04em] transition-colors duration-75 group-hover:text-white"
                style={{ color: "var(--theme-text-muted)" }}
              >
                Learn more &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
