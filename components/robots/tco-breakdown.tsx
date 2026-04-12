import { cn } from "@/lib/utils/cn";

interface TcoBreakdownProps {
  price: number | null;
  priceType: string | null;
  priceLeaseMonthly: number | null;
  integrationCost: number | null;
  trainingCost: number | null;
  annualMaintenance: number | null;
  warrantyYears: number | null;
  expectedLifespan: number | null;
  spareParts: string | null;
  powerConsumptionWatts: number | null;
  trainingRequired: string | null;
  financingNotes: string | null;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

const trainingLabels: Record<string, { label: string; color: string }> = {
  none: { label: "No training needed", color: "text-green" },
  basic: { label: "Basic (1-2 days)", color: "text-green" },
  intermediate: { label: "Intermediate (1-2 weeks)", color: "text-blue" },
  advanced: { label: "Advanced (2-4 weeks)", color: "text-orange" },
  specialist: { label: "Specialist (months)", color: "text-orange" },
};

const partsLabels: Record<string, { label: string; color: string }> = {
  excellent: { label: "Excellent", color: "text-green" },
  good: { label: "Good", color: "text-blue" },
  limited: { label: "Limited", color: "text-orange" },
  poor: { label: "Poor", color: "text-orange" },
};

export function TcoBreakdown({
  price, priceType, priceLeaseMonthly, integrationCost, trainingCost,
  annualMaintenance, warrantyYears, expectedLifespan, spareParts,
  powerConsumptionWatts, trainingRequired, financingNotes,
}: TcoBreakdownProps) {
  const hasData = price || priceLeaseMonthly || integrationCost || trainingCost || annualMaintenance;
  if (!hasData) return null;

  const isLease = priceType === "lease" || priceType === "raas";
  const lifespan = expectedLifespan || 5;
  const annualElectricity = powerConsumptionWatts
    ? Math.round((powerConsumptionWatts / 1000) * 8 * 260 * 0.12)
    : 0;

  // Calculate 5-year TCO
  const upfront = isLease ? 0 : (price || 0);
  const leaseTotal = isLease ? (priceLeaseMonthly || 0) * 12 * Math.min(lifespan, 5) : 0;
  const integrationTotal = integrationCost || 0;
  const trainingTotal = trainingCost || 0;
  const maintenanceTotal = (annualMaintenance || 0) * Math.min(lifespan, 5);
  const electricityTotal = annualElectricity * Math.min(lifespan, 5);
  const fiveYearTco = upfront + leaseTotal + integrationTotal + trainingTotal + maintenanceTotal + electricityTotal;

  const segments = [
    { label: isLease ? "Lease/Subscription" : "Purchase Price", value: isLease ? leaseTotal : upfront, color: "bg-blue" },
    { label: "Integration & Setup", value: integrationTotal, color: "bg-violet" },
    { label: "Training", value: trainingTotal, color: "bg-cyan-glow" },
    { label: "Maintenance (5yr)", value: maintenanceTotal, color: "bg-orange" },
    { label: "Electricity (5yr)", value: electricityTotal, color: "bg-green" },
  ].filter((s) => s.value > 0);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="font-display text-lg font-bold">Total Cost of Ownership</h3>
      <p className="mt-1 text-xs text-muted">{lifespan > 5 ? "5" : lifespan}-year projection</p>

      {/* TCO total */}
      <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center">
        <p className="text-xs text-muted">Estimated {Math.min(lifespan, 5)}-Year TCO</p>
        <p className="mt-1 font-mono text-2xl font-bold text-foreground">{formatCurrency(fiveYearTco)}</p>
        {fiveYearTco > 0 && (
          <p className="mt-0.5 text-xs text-muted">{formatCurrency(Math.round(fiveYearTco / (Math.min(lifespan, 5) * 12)))}/month effective</p>
        )}
      </div>

      {/* Visual bar breakdown */}
      {segments.length > 0 && (
        <div className="mt-4">
          <div className="flex h-3 overflow-hidden rounded-full">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className={cn("h-full", seg.color)}
                style={{ width: `${(seg.value / fiveYearTco) * 100}%`, opacity: 0.8 }}
              />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full", seg.color)} style={{ opacity: 0.8 }} />
                  <span className="text-muted">{seg.label}</span>
                </div>
                <span className="font-mono font-semibold">{formatCurrency(seg.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
        {warrantyYears && (
          <DetailItem label="Warranty" value={`${warrantyYears} year${warrantyYears > 1 ? "s" : ""}`} />
        )}
        {expectedLifespan && (
          <DetailItem label="Expected Lifespan" value={`${expectedLifespan} years`} />
        )}
        {trainingRequired && trainingLabels[trainingRequired] && (
          <DetailItem label="Training" value={trainingLabels[trainingRequired].label} color={trainingLabels[trainingRequired].color} />
        )}
        {spareParts && partsLabels[spareParts] && (
          <DetailItem label="Spare Parts" value={partsLabels[spareParts].label} color={partsLabels[spareParts].color} />
        )}
      </div>

      {/* Financing note */}
      {financingNotes && (
        <div className="mt-4 rounded-lg border border-blue/10 bg-blue/5 p-3">
          <p className="text-xs font-medium text-blue">Financing Available</p>
          <p className="mt-0.5 text-[11px] text-muted">{financingNotes}</p>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted/60">{label}</p>
      <p className={cn("text-xs font-medium", color || "text-foreground")}>{value}</p>
    </div>
  );
}
