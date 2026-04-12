import { cn } from "@/lib/utils/cn";

interface VendorHealthCardProps {
  manufacturer: {
    name: string;
    founded_year: number | null;
    country: string | null;
  };
  fundingTotal: string | null;
  employeesRange: string | null;
  healthScore: number | null;
}

function getHealthColor(score: number): { bar: string; text: string } {
  if (score >= 8) return { bar: "bg-blue-600", text: "text-blue-400" };
  if (score >= 6) return { bar: "bg-electric-blue", text: "text-electric-blue" };
  if (score >= 4) return { bar: "bg-amber", text: "text-amber" };
  return { bar: "bg-magenta", text: "text-magenta" };
}

export function VendorHealthCard({
  manufacturer,
  fundingTotal,
  employeesRange,
  healthScore,
}: VendorHealthCardProps) {
  const currentYear = new Date().getFullYear();
  const yearsActive =
    manufacturer.founded_year != null
      ? currentYear - manufacturer.founded_year
      : null;

  const healthColor = healthScore != null ? getHealthColor(healthScore) : null;

  return (
    <div className="rounded-md border border-border bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label mb-3">
        <span className="font-mono text-[9px] tracking-widest">[VENDOR] HEALTH</span>
      </div>

      {/* Manufacturer Name */}
      <p className="mb-3 font-mono text-sm font-bold text-text-primary">
        {manufacturer.name}
      </p>

      {/* Founded */}
      <div className="mb-2">
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Founded
        </p>
        <p className="font-mono text-sm text-text-data">
          {manufacturer.founded_year != null ? (
            <>
              EST. {manufacturer.founded_year}
              {yearsActive != null && (
                <span className="ml-1 text-text-tertiary">
                  ({yearsActive} years)
                </span>
              )}
            </>
          ) : (
            <span className="text-white/45">Undisclosed</span>
          )}
        </p>
      </div>

      {/* Funding */}
      <div className="mb-2">
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Funding
        </p>
        <p className="font-mono text-sm text-text-data">
          {fundingTotal ?? (
            <span className="text-white/45">Undisclosed</span>
          )}
        </p>
      </div>

      {/* Employees */}
      <div className="mb-2">
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Employees
        </p>
        <p className="font-mono text-sm text-text-data">
          {employeesRange ? (
            `~${employeesRange} employees`
          ) : (
            <span className="text-white/45">Undisclosed</span>
          )}
        </p>
      </div>

      {/* Country / HQ */}
      {manufacturer.country && (
        <div className="mb-3">
          <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            HQ
          </p>
          <p className="font-mono text-sm text-text-data">
            {manufacturer.country}
          </p>
        </div>
      )}

      {/* Health Score */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Vendor Health Score
        </p>
        {healthScore != null && healthColor != null ? (
          <div className="mt-1 flex items-center gap-2">
            <span className={cn("font-mono text-lg font-bold", healthColor.text)}>
              {healthScore}/10
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-sm bg-white/[0.05]">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-sm transition-[width] duration-700 ease-out",
                  healthColor.bar
                )}
                style={{ width: `${healthScore * 10}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-white/50">Health score pending verification</p>
        )}
      </div>
    </div>
  );
}
