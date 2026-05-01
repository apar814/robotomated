import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title:
    "US vs China Humanoid Robots — Independent Analysis | Robotomated",
  description:
    "Compare US and Chinese humanoid robots side by side: Figure, Agility, Tesla Optimus, Boston Dynamics Atlas, Unitree H1/G1, and more. Independent analysis covering price, autonomy, fleet learning, and data compliance.",
};

interface ComparisonRow {
  manufacturer: string;
  origin: "US" | "China";
  robot: string;
  estPrice: string;
  autonomy: string;
  fleetLearning: string;
  selfCharging: string;
  dataCompliant: string;
  availability: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    manufacturer: "Figure",
    origin: "US",
    robot: "Figure 02",
    estPrice: "$150K+",
    autonomy: "Full",
    fleetLearning: "Yes",
    selfCharging: "Yes",
    dataCompliant: "Yes",
    availability: "Pre-order",
  },
  {
    manufacturer: "Agility Robotics",
    origin: "US",
    robot: "Digit",
    estPrice: "$250K+",
    autonomy: "Semi",
    fleetLearning: "Limited",
    selfCharging: "No",
    dataCompliant: "Yes",
    availability: "Limited",
  },
  {
    manufacturer: "Boston Dynamics",
    origin: "US",
    robot: "Atlas",
    estPrice: "N/A",
    autonomy: "Full",
    fleetLearning: "No",
    selfCharging: "No",
    dataCompliant: "Yes",
    availability: "R&D only",
  },
  {
    manufacturer: "Tesla",
    origin: "US",
    robot: "Optimus Gen 2",
    estPrice: "TBD",
    autonomy: "Semi",
    fleetLearning: "Yes",
    selfCharging: "TBD",
    dataCompliant: "Yes",
    availability: "Prototype",
  },
  {
    manufacturer: "Unitree",
    origin: "China",
    robot: "H1",
    estPrice: "~$90K",
    autonomy: "Semi",
    fleetLearning: "No",
    selfCharging: "Yes",
    dataCompliant: "Review needed",
    availability: "Available",
  },
  {
    manufacturer: "Unitree",
    origin: "China",
    robot: "G1",
    estPrice: "~$16K",
    autonomy: "Teleoperated",
    fleetLearning: "No",
    selfCharging: "Yes",
    dataCompliant: "Review needed",
    availability: "Available",
  },
  {
    manufacturer: "Open Mind",
    origin: "China",
    robot: "Various",
    estPrice: "TBD",
    autonomy: "Semi",
    fleetLearning: "TBD",
    selfCharging: "TBD",
    dataCompliant: "Review needed",
    availability: "Prototype",
  },
];

const TAKEAWAY_CARDS = [
  {
    title: "Price Leader",
    accent: "lime" as const,
    description:
      "Chinese manufacturers, especially Unitree, are leading on price. The G1 at approximately $16K is an order of magnitude cheaper than any US competitor. However, lower price corresponds to lower autonomy — most affordable Chinese humanoids are teleoperated or semi-autonomous, requiring human oversight for complex tasks.",
  },
  {
    title: "Technology Leader",
    accent: "electric-blue" as const,
    description:
      "US companies, particularly Figure, lead on technology depth. Fleet neural learning — where every deployed robot improves every other robot — is the capability that will define market leaders. Combined with full autonomy and self-charging, Figure's approach prioritizes long-term operational value over short-term price competition.",
  },
  {
    title: "Data Security",
    accent: "magenta" as const,
    description:
      "For enterprise buyers, data residency compliance is non-negotiable. US-manufactured robots offer full data residency compliance out of the box. Chinese-manufactured robots require additional review for data handling, storage location, and access controls — particularly relevant for defense, healthcare, and critical infrastructure applications.",
  },
];

function AvailabilityBadge({ status }: { status: string }) {
  let colorClasses: string;
  switch (status) {
    case "Available":
      colorClasses = "bg-white/5 text-white border-white/20";
      break;
    case "Pre-order":
      colorClasses =
        "bg-white/5 text-white border-white/20";
      break;
    case "Limited":
      colorClasses =
        "bg-white/5 text-white border-white/20";
      break;
    case "Prototype":
      colorClasses =
        "bg-magenta/10 text-magenta border-magenta/20";
      break;
    case "R&D only":
      colorClasses =
        "bg-text-ghost/10 text-text-ghost border-text-ghost/20";
      break;
    default:
      colorClasses = "bg-text-ghost/10 text-text-ghost border-text-ghost/20";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${colorClasses}`}
    >
      {status}
    </span>
  );
}

function OriginFlag({ origin }: { origin: "US" | "China" }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 text-xs font-semibold ${
        origin === "US"
          ? "bg-white/5 text-white"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      {origin}
    </span>
  );
}

const TABLE_HEADERS = [
  "Manufacturer",
  "Origin",
  "Robot",
  "Est. Price",
  "Autonomy",
  "Fleet Learning",
  "Self-Charging",
  "Data Compliant",
  "Availability",
];

export default function HumanoidComparisonPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border px-4 pb-12 pt-12">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Tools", href: "/tools/tco-calculator" },
              {
                name: "Humanoid Comparison",
                href: "/tools/humanoid-comparison",
              },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold text-text-primary sm:text-5xl">
            US vs China Humanoid Robots: An Independent Analysis
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-text-secondary">
            A side-by-side comparison of every major humanoid robot platform,
            evaluated on price, autonomy, fleet learning, and data compliance.
          </p>
        </div>
      </section>

      {/* Independence Disclaimer */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg border border-white/20 bg-white/5 p-5">
            <p className="text-sm font-semibold text-white">
              Independence Disclaimer
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Robotomated is independent. We have no financial relationship with
              any manufacturer listed on this page. This analysis is based on
              publicly available information, our own research, and direct
              evaluation where possible. No manufacturer has paid for placement,
              favorable analysis, or early access to this comparison.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Comparison
          </h2>
          <h3 className="mt-2 text-2xl font-bold text-text-primary">
            Head-to-Head Analysis
          </h3>

          {/* Desktop Table */}
          <div className="mt-8 hidden overflow-x-auto rounded-lg border border-border lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-obsidian-surface">
                  {TABLE_HEADERS.map((header) => (
                    <th
                      key={header}
                      className="whitespace-nowrap px-4 py-3 font-mono text-xs uppercase tracking-wider text-text-ghost"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, i) => (
                  <tr
                    key={`${row.manufacturer}-${row.robot}`}
                    className={`border-b border-border transition-colors hover:bg-obsidian-surface ${
                      i % 2 === 1 ? "bg-obsidian-surface/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {row.manufacturer}
                    </td>
                    <td className="px-4 py-3">
                      <OriginFlag origin={row.origin} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.robot}
                    </td>
                    <td className="px-4 py-3 font-mono text-text-primary">
                      {row.estPrice}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.autonomy}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.fleetLearning}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.selfCharging}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {row.dataCompliant}
                    </td>
                    <td className="px-4 py-3">
                      <AvailabilityBadge status={row.availability} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mt-8 grid gap-4 lg:hidden">
            {COMPARISON_DATA.map((row) => (
              <div
                key={`mobile-${row.manufacturer}-${row.robot}`}
                className="rounded-lg border border-border bg-obsidian-surface p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">
                      {row.manufacturer}
                    </p>
                    <p className="mt-0.5 text-sm text-text-secondary">
                      {row.robot}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <OriginFlag origin={row.origin} />
                    <AvailabilityBadge status={row.availability} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-text-ghost">Est. Price</p>
                    <p className="font-mono text-text-primary">
                      {row.estPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-ghost">Autonomy</p>
                    <p className="text-text-secondary">{row.autonomy}</p>
                  </div>
                  <div>
                    <p className="text-text-ghost">Fleet Learning</p>
                    <p className="text-text-secondary">{row.fleetLearning}</p>
                  </div>
                  <div>
                    <p className="text-text-ghost">Self-Charging</p>
                    <p className="text-text-secondary">{row.selfCharging}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-text-ghost">Data Compliant</p>
                    <p className="text-text-secondary">{row.dataCompliant}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-ghost">
            Analysis
          </h2>
          <h3 className="mt-2 text-2xl font-bold text-text-primary">
            Key Takeaways
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {TAKEAWAY_CARDS.map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-border bg-obsidian-surface p-6"
              >
                <div
                  className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
                    card.accent === "lime"
                      ? "bg-white/5 text-white"
                      : card.accent === "electric-blue"
                        ? "bg-white/5 text-white"
                        : "bg-magenta/15 text-magenta"
                  }`}
                >
                  {card.title}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-tertiary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            Need help choosing?
          </h2>
          <p className="mt-3 text-text-tertiary">
            Our AI advisor can help you evaluate humanoid robots for your
            specific use case, facility requirements, and budget.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/advisor"
              className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-obsidian transition-opacity hover:opacity-90"
            >
              Talk to AI Advisor
            </Link>
            <Link
              href="/find-my-robot"
              className="inline-flex items-center rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-white/20 hover:text-white"
            >
              Find My Robot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
