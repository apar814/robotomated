"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: "blue" | "green" | "violet" | "amber" | "red";
}

const accentColors: Record<string, string> = {
  blue: "border-white/[0.08] bg-white/[0.02]",
  green: "border-white/[0.08] bg-white/[0.02]",
  violet: "border-white/[0.08] bg-white/[0.02]",
  amber: "border-white/[0.08] bg-white/[0.02]",
  red: "border-white/[0.08] bg-white/[0.02]",
};

const valueColors: Record<string, string> = {
  blue: "text-white",
  green: "text-white",
  violet: "text-white",
  amber: "text-white",
  red: "text-white",
};

function StatCard({ label, value, subtitle, accent = "blue" }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${accentColors[accent]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueColors[accent]}`}>
        {value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
      )}
    </div>
  );
}

interface FleetDashboardCardsProps {
  totalAssets: number;
  activeRobots: number;
  maintenanceDue: number;
  overdue: number;
  totalFleetValue: number;
  ytdMaintenanceSpend: number;
}

export function FleetDashboardCards({
  totalAssets,
  activeRobots,
  maintenanceDue,
  overdue,
  totalFleetValue,
  ytdMaintenanceSpend,
}: FleetDashboardCardsProps) {
  const fmt = (n: number) =>
    n >= 1000
      ? `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
      : `$${n.toLocaleString()}`;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Total Assets"
        value={totalAssets}
        subtitle={`${activeRobots} active`}
        accent="blue"
      />
      <StatCard
        label="Active Robots"
        value={activeRobots}
        subtitle={`${totalAssets - activeRobots} inactive`}
        accent="green"
      />
      <StatCard
        label="Service Due"
        value={maintenanceDue}
        subtitle="within 7 days"
        accent={maintenanceDue > 0 ? "amber" : "blue"}
      />
      <StatCard
        label="Fleet Value"
        value={fmt(totalFleetValue)}
        accent="violet"
      />
      <StatCard
        label="YTD Maintenance"
        value={fmt(ytdMaintenanceSpend)}
        accent={overdue > 0 ? "red" : "blue"}
        subtitle={overdue > 0 ? `${overdue} overdue` : undefined}
      />
    </div>
  );
}
