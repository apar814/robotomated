import Link from "next/link";

interface NextStep {
  label: string;
  title: string;
  subtitle: string;
  href: string;
}

const PRESETS: Record<string, NextStep[]> = {
  explore: [
    { label: "Next", title: "Compare robots side by side", subtitle: "Across every dimension and price point.", href: "/compare" },
    { label: "Next", title: "Get a deployment recommendation", subtitle: "Tell Robotimus your use case and budget.", href: "/advisor" },
    { label: "Next", title: "Get certified to operate", subtitle: "Industry-standard credential, free to start.", href: "/certify" },
  ],
  learn: [
    { label: "Apply", title: "Find the right robot", subtitle: "Search and compare across all categories.", href: "/explore" },
    { label: "Apply", title: "Get a recommendation", subtitle: "Tell Robotimus what you need.", href: "/advisor" },
    { label: "Grow", title: "Get RCO certified", subtitle: "Prove your robotics expertise.", href: "/certify" },
  ],
  manufacturers: [
    { label: "Next", title: "Compare their robots", subtitle: "Side-by-side across every dimension.", href: "/compare" },
    { label: "Next", title: "Calculate your ROI", subtitle: "5-year total cost of ownership.", href: "/tools/tco-calculator" },
    { label: "Next", title: "Hire instead of buy", subtitle: "Deploy a robot without owning one.", href: "/robowork" },
  ],
  news: [
    { label: "Next", title: "Explore robots in the news", subtitle: "See which robots are trending.", href: "/explore" },
    { label: "Next", title: "Market intelligence", subtitle: "Funding, investors, and trends.", href: "/market" },
    { label: "Next", title: "Get the weekly brief", subtitle: "Robotics intelligence, delivered.", href: "/newsletter" },
  ],
};

export function NextStepBar({ preset }: { preset: keyof typeof PRESETS }) {
  const steps = PRESETS[preset];
  if (!steps) return null;

  return (
    <section className="border-t border-border px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <Link
              key={step.href}
              href={step.href}
              className="group rounded-lg border border-border bg-obsidian-surface p-5 transition-all hover:border-[#2563EB]/30"
            >
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">{step.label}</p>
              <p className="mt-1 text-sm font-bold text-white transition-colors group-hover:text-[#2563EB]">
                {step.title}
              </p>
              <p className="mt-1 text-xs text-white/40">{step.subtitle}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
