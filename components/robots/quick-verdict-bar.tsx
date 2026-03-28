import { cn } from "@/lib/utils/cn";

interface QuickVerdictBarProps {
  bestFor: string;
  avoidIf: string;
  paybackMonths: number | null;
  complexity: "Low" | "Medium" | "High" | null;
}

function getComplexityColor(complexity: "Low" | "Medium" | "High"): string {
  switch (complexity) {
    case "Low":
      return "text-lime";
    case "Medium":
      return "text-amber";
    case "High":
      return "text-magenta";
  }
}

export function QuickVerdictBar({
  bestFor,
  avoidIf,
  paybackMonths,
  complexity,
}: QuickVerdictBarProps) {
  return (
    <div className="border-y border-border bg-obsidian-surface px-4 py-3">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Best For */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            BEST FOR
          </p>
          <p className="mt-0.5 text-sm text-text-primary">{bestFor}</p>
        </div>

        {/* Avoid If */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            AVOID IF
          </p>
          <p className="mt-0.5 text-sm text-text-primary">{avoidIf}</p>
        </div>

        {/* Payback */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            PAYBACK
          </p>
          <p className="mt-0.5 font-mono text-sm">
            {paybackMonths != null ? (
              <span className="text-lime">{paybackMonths} months</span>
            ) : (
              <span className="text-text-ghost">TBD</span>
            )}
          </p>
        </div>

        {/* Complexity */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            COMPLEXITY
          </p>
          <p className="mt-0.5 font-mono text-sm">
            {complexity != null ? (
              <span className={getComplexityColor(complexity)}>
                {complexity}
              </span>
            ) : (
              <span className="text-text-ghost">TBD</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
