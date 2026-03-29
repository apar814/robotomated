"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: "blue" | "green" | "violet" | "amber" | "red";
}

const accentColors: Record<string, string> = {
  blue: "border-[#00C2FF]/30 bg-[#00C2FF]/5",
  green: "border-[#00E5A0]/30 bg-[#00E5A0]/5",
  violet: "border-[#7B2FFF]/30 bg-[#7B2FFF]/5",
  amber: "border-amber-400/30 bg-amber-400/5",
  red: "border-red-400/30 bg-red-400/5",
};

const valueColors: Record<string, string> = {
  blue: "text-[#00C2FF]",
  green: "text-[#00E5A0]",
  violet: "text-[#7B2FFF]",
  amber: "text-amber-400",
  red: "text-red-400",
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
