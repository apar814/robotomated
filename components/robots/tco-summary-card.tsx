interface TcoSummaryCardProps {
  price: number | null;
  maintenanceLow: number | null;
  maintenanceHigh: number | null;
  maintenancePct: number | null;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${value.toLocaleString()}`;
  return `$${value}`;
}

export function TcoSummaryCard({
  price,
  maintenanceLow,
  maintenanceHigh,
  maintenancePct,
}: TcoSummaryCardProps) {
  // Calculate annual maintenance estimate
  let annualMaintenance: number | null = null;
  let maintenanceDisplay: string | null = null;

  if (maintenanceLow != null && maintenanceHigh != null) {
    annualMaintenance = Math.round((maintenanceLow + maintenanceHigh) / 2);
    maintenanceDisplay = `${formatCurrency(maintenanceLow)} – ${formatCurrency(maintenanceHigh)}/yr`;
  } else if (maintenancePct != null && price != null) {
    annualMaintenance = Math.round(price * (maintenancePct / 100));
    maintenanceDisplay = `~${formatCurrency(annualMaintenance)}/yr (${maintenancePct}%)`;
  }

  // 5-year total
  const fiveYearTotal =
    price != null && annualMaintenance != null
      ? price + 5 * annualMaintenance
      : null;

  // Cost per shift: 5yr / (5 years * 250 days * 3 shifts)
  const costPerShift =
    fiveYearTotal != null ? fiveYearTotal / (5 * 250 * 3) : null;

  // Cost per hour: shift / 8
  const costPerHour = costPerShift != null ? costPerShift / 8 : null;

  return (
    <div className="rounded-md border border-border border-l-2 border-l-blue-500 bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label green mb-3">
        <span className="font-mono text-[13px] tracking-widest">[TCO] TOTAL COST</span>
      </div>

      {/* Purchase Price */}
      <div className="mb-3">
        <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          Purchase Price
        </p>
        {price != null ? (
          <p className="font-mono text-2xl font-bold text-blue-400">
            {formatCurrency(price)}
          </p>
        ) : (
          <p className="font-mono text-2xl font-bold text-text-tertiary">RFQ</p>
        )}
      </div>

      {/* Annual Maintenance */}
      <div className="mb-3">
        <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          Est. Annual Maintenance
        </p>
        <p className="font-mono text-sm text-text-secondary">
          {maintenanceDisplay ?? (
            price != null
              ? price < 5000
                ? "Est. $50–200/year"
                : price < 100000
                  ? `Est. ${formatCurrency(Math.round(price * 0.08))}–${formatCurrency(Math.round(price * 0.12))}/year (8–12%)`
                  : `Est. ${formatCurrency(Math.round(price * 0.15))}–${formatCurrency(Math.round(price * 0.20))}/year (15–20%)`
              : "Contact manufacturer for maintenance pricing"
          )}
        </p>
      </div>

      {/* 5-Year Total */}
      <div className="mb-3">
        <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          5-Year Total
        </p>
        <p className="font-mono text-lg font-bold text-text-primary">
          {fiveYearTotal != null ? formatCurrency(fiveYearTotal) : "Requires pricing data"}
        </p>
      </div>

      {/* Cost per Shift */}
      <div className="mb-2">
        <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          Cost per Shift
        </p>
        <p className="font-mono text-sm text-text-tertiary">
          {costPerShift != null
            ? `${formatCurrency(Math.round(costPerShift))}`
            : "—"}
        </p>
      </div>

      {/* Cost per Hour */}
      <div className="mb-3">
        <p className="font-mono text-[13px] uppercase tracking-wider text-text-ghost">
          Cost per Hour
        </p>
        <p className="font-mono text-sm text-text-tertiary">
          {costPerHour != null
            ? `$${costPerHour.toFixed(2)}`
            : "—"}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-[13px] text-text-ghost">
        Based on industry averages. Actual costs vary.
      </p>
    </div>
  );
}
