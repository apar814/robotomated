"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STAGES = [
  { key: "research", label: "Research", href: "/explore", paths: ["/explore", "/industries", "/problems", "/learn"] },
  { key: "compare", label: "Compare", href: "/compare", paths: ["/compare", "/tools/robot-finder"] },
  { key: "evaluate", label: "Evaluate", href: "/explore", paths: ["/explore/"] },
  { key: "validate", label: "Validate", href: "/tools/tco-calculator", paths: ["/tools/tco-calculator", "/tools/maintenance-estimator", "/case-studies"] },
  { key: "buy", label: "Buy", href: "/explore", paths: ["/best-price"] },
  { key: "deploy", label: "Deploy", href: "/fleet", paths: ["/fleet"] },
];

function getActiveStage(pathname: string): number {
  // Robot detail pages → evaluate stage
  if (/^\/explore\/[^/]+\/[^/]+/.test(pathname)) return 2;

  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (STAGES[i].paths.some(p => pathname.startsWith(p))) return i;
  }
  return 0;
}

const SHOW_ON = ["/explore/", "/compare", "/tools/", "/problems/", "/case-studies", "/best-price", "/fleet", "/industries/"];

export function BuyerJourneyBar() {
  const pathname = usePathname();

  // Only show on journey-relevant pages, not the homepage or admin
  const shouldShow = SHOW_ON.some(p => pathname.startsWith(p));
  if (!shouldShow) return null;

  const activeIdx = getActiveStage(pathname);

  return (
    <div className="border-b border-white/[0.05] bg-[#060608] px-4 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto">
        <span className="mr-2 shrink-0 text-[10px] font-semibold uppercase tracking-widest text-white/45">
          Your Journey
        </span>
        {STAGES.map((stage, i) => {
          const isActive = i === activeIdx;
          const isPast = i < activeIdx;
          return (
            <div key={stage.key} className="flex shrink-0 items-center">
              {i > 0 && (
                <div className={`mx-1 h-px w-4 sm:w-6 ${isPast ? "bg-blue/40" : "bg-white/[0.06]"}`} />
              )}
              <Link
                href={stage.href}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "bg-blue/10 text-blue"
                    : isPast
                      ? "text-white/40 hover:text-white/60"
                      : "text-white/45 hover:text-white/40"
                }`}
              >
                {stage.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
