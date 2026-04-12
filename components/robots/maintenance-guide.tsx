import { cn } from "@/lib/utils/cn";

interface MaintenanceGuideProps {
  warrantyMonths: number | null;
  warrantyCoverage: string | null;
  supportModel: string | null;
  supportResponseHours: number | null;
  sparePartsAvailability: string | null;
}

function SupportBadge({ model }: { model: string }) {
  const colorMap: Record<string, string> = {
    "on-site": "text-blue-400 border-[rgba(200,255,0,0.08)] bg-blue-600-dim",
    remote: "text-electric-blue border-[rgba(37,99,235,0.08)] bg-electric-blue-dim",
    partner: "text-amber border-[rgba(251,191,36,0.08)] bg-[rgba(251,191,36,0.05)]",
    none: "text-magenta border-[rgba(255,0,110,0.08)] bg-magenta-dim",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-[2px] border px-1.5 py-0.5 font-mono text-[13px] uppercase",
        colorMap[model] ?? "text-text-tertiary border-border bg-obsidian-elevated"
      )}
    >
      {model}
    </span>
  );
}

function PartsBadge({ availability }: { availability: string }) {
  const colorMap: Record<string, string> = {
    stocked: "text-blue-400 border-[rgba(200,255,0,0.08)] bg-blue-600-dim",
    order: "text-electric-blue border-[rgba(37,99,235,0.08)] bg-electric-blue-dim",
    custom: "text-amber border-[rgba(251,191,36,0.08)] bg-[rgba(251,191,36,0.05)]",
    proprietary: "text-magenta border-[rgba(255,0,110,0.08)] bg-magenta-dim",
  };

  return (
    <span
      className={cn(
        "inline-block rounded-[2px] border px-1.5 py-0.5 font-mono text-[13px] uppercase",
        colorMap[availability] ?? "text-text-tertiary border-border bg-obsidian-elevated"
      )}
    >
      {availability}
    </span>
  );
}

const SCHEDULE_ROWS = [
  {
    interval: "Daily",
    task: "Visual inspection & debris removal",
    time: "5–10 min",
    cost: "—",
    type: "Operator",
  },
  {
    interval: "Weekly",
    task: "Sensor calibration check & log review",
    time: "15–30 min",
    cost: "—",
    type: "Operator",
  },
  {
    interval: "Monthly",
    task: "Lubrication, belt/chain tension check",
    time: "1–2 hrs",
    cost: "$50–150",
    type: "Technician",
  },
  {
    interval: "6-Month",
    task: "Full mechanical inspection & software update",
    time: "4–8 hrs",
    cost: "$500–2,000",
    type: "Certified Tech",
  },
  {
    interval: "Annual",
    task: "Comprehensive overhaul & recalibration",
    time: "1–2 days",
    cost: "$2,000–10,000",
    type: "OEM / Partner",
  },
];

export function MaintenanceGuide({
  warrantyMonths,
  warrantyCoverage,
  supportModel,
  supportResponseHours,
  sparePartsAvailability,
}: MaintenanceGuideProps) {
  return (
    <div className="rounded-md border border-border bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label mb-3">
        <span className="font-mono text-[13px] tracking-widest">
          [SERVICE] MAINTENANCE
        </span>
      </div>

      {/* Schedule Table */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-obsidian-elevated">
              <th className="px-2 py-1.5 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                Interval
              </th>
              <th className="px-2 py-1.5 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                Task
              </th>
              <th className="hidden px-2 py-1.5 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost sm:table-cell">
                Est. Time
              </th>
              <th className="px-2 py-1.5 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost">
                Est. Cost
              </th>
              <th className="hidden px-2 py-1.5 text-left font-mono text-[13px] uppercase tracking-wider text-text-ghost sm:table-cell">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE_ROWS.map((row) => (
              <tr
                key={row.interval}
                className="border-t border-border-subtle"
              >
                <td className="px-2 py-1.5 font-mono text-[11px] font-bold text-text-primary">
                  {row.interval}
                </td>
                <td className="px-2 py-1.5 text-[11px] text-text-secondary">
                  {row.task}
                </td>
                <td className="hidden px-2 py-1.5 font-mono text-[11px] text-text-tertiary sm:table-cell">
                  {row.time}
                </td>
                <td className="px-2 py-1.5 font-mono text-[11px] text-text-tertiary">
                  {row.cost}
                </td>
                <td className="hidden px-2 py-1.5 font-mono text-[11px] text-text-tertiary sm:table-cell">
                  {row.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Service Details */}
      <p className="mb-2 font-mono text-[13px] uppercase tracking-wider text-text-ghost">
        Service Details
      </p>
      <div className="space-y-2">
        {/* Warranty */}
        <div className="flex items-start gap-2">
          <span className="shrink-0 font-mono text-[13px] uppercase text-text-tertiary">
            Warranty:
          </span>
          <span className="font-mono text-[11px] text-text-secondary">
            {warrantyMonths != null
              ? `${warrantyMonths} months${warrantyCoverage ? ` — ${warrantyCoverage}` : ""}`
              : "Contact Vendor"}
          </span>
        </div>

        {/* Support */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-[13px] uppercase text-text-tertiary">
            Support:
          </span>
          {supportModel ? (
            <SupportBadge model={supportModel} />
          ) : (
            <span className="font-mono text-[11px] text-text-ghost">
              Contact Vendor
            </span>
          )}
        </div>

        {/* Response Time */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-[13px] uppercase text-text-tertiary">
            Response:
          </span>
          <span className="font-mono text-[11px] text-text-secondary">
            {supportResponseHours != null
              ? `${supportResponseHours} hours`
              : "Contact Vendor"}
          </span>
        </div>

        {/* Spare Parts */}
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-[13px] uppercase text-text-tertiary">
            Spare Parts:
          </span>
          {sparePartsAvailability ? (
            <PartsBadge availability={sparePartsAvailability} />
          ) : (
            <span className="font-mono text-[11px] text-text-ghost">
              Contact Vendor
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
