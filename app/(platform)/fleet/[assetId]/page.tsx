import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createServerClient } from "@/lib/supabase/server";
import {
  DEMO_ASSETS,
  DEMO_MAINTENANCE_LOGS,
  DEMO_SCHEDULES,
} from "@/lib/fleet/demo-data";
import type { DemoAsset, DemoMaintenanceLog, DemoSchedule } from "@/lib/fleet/demo-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ assetId: string }>;
}): Promise<Metadata> {
  const { assetId } = await params;
  const asset = DEMO_ASSETS.find((a) => a.id === assetId);
  return {
    title: asset
      ? `${asset.custom_name || asset.robot_name} | Fleet | Robotomated`
      : "Asset Details | Fleet | Robotomated",
  };
}

const statusStyles: Record<string, string> = {
  active: "bg-[#00E5A0]/15 text-[#00E5A0] border-[#00E5A0]/30",
  maintenance: "bg-amber-400/15 text-amber-400 border-amber-400/30",
  offline: "bg-red-400/15 text-red-400 border-red-400/30",
  decommissioned: "bg-white/10 text-white/40 border-white/10",
};

const typeStyles: Record<string, string> = {
  routine: "bg-[#00C2FF]/15 text-[#00C2FF]",
  repair: "bg-amber-400/15 text-amber-400",
  emergency: "bg-red-400/15 text-red-400",
  upgrade: "bg-[#7B2FFF]/15 text-[#7B2FFF]",
};

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;

  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isDemo = !user || assetId.startsWith("demo-");

  let asset: DemoAsset | null = null;
  let logs: DemoMaintenanceLog[] = [];
  let schedules: DemoSchedule[] = [];

  if (isDemo) {
    asset = DEMO_ASSETS.find((a) => a.id === assetId) || null;
    logs = DEMO_MAINTENANCE_LOGS.filter((l) => l.asset_id === assetId);
    schedules = DEMO_SCHEDULES.filter((s) => s.asset_id === assetId);
  } else {
    const db = createServerClient();

    const { data: dbAsset } = await db
      .from("robot_assets")
      .select("*, robots(name)")
      .eq("id", assetId)
      .eq("user_id", user.id)
      .single();

    if (!dbAsset) {
      // Try demo fallback
      asset = DEMO_ASSETS.find((a) => a.id === assetId) || null;
      if (!asset) return notFound();
      logs = DEMO_MAINTENANCE_LOGS.filter((l) => l.asset_id === assetId);
      schedules = DEMO_SCHEDULES.filter((s) => s.asset_id === assetId);
    } else {
      const dbAny = dbAsset as Record<string, unknown>;
      const robotJoin = dbAny.robots as { name: string } | null;
      asset = {
        id: dbAny.id as string,
        custom_name: (dbAny.custom_name as string) || "",
        robot_name: robotJoin?.name || "Unknown Robot",
        serial_number: (dbAny.serial_number as string) || "",
        purchase_date: (dbAny.purchase_date as string) || "",
        purchase_price: (dbAny.purchase_price as number) || 0,
        site_location: (dbAny.site_location as string) || "",
        department: (dbAny.department as string) || "",
        status: dbAny.status as "active" | "maintenance" | "offline" | "decommissioned",
        notes: dbAny.notes as string | null,
        created_at: dbAny.created_at as string,
      };

      const [{ data: dbLogs }, { data: dbSchedules }] = await Promise.all([
        db
          .from("maintenance_logs")
          .select("*")
          .eq("asset_id", assetId)
          .order("log_date", { ascending: false }),
        db
          .from("maintenance_schedules")
          .select("*")
          .eq("asset_id", assetId)
          .order("next_due", { ascending: true }),
      ]);

      logs = (dbLogs || []).map((l: Record<string, unknown>) => ({
        id: l.id as string,
        asset_id: l.asset_id as string,
        log_date: l.log_date as string,
        maintenance_type: l.maintenance_type as "routine" | "repair" | "emergency" | "upgrade",
        description: (l.description as string) || "",
        technician: (l.technician as string) || "",
        cost: (l.cost as number) || 0,
        downtime_hours: (l.downtime_hours as number) || 0,
        parts_replaced: (l.parts_replaced as string[]) || [],
        next_service_date: l.next_service_date as string | null,
      }));

      schedules = (dbSchedules || []).map((s: Record<string, unknown>) => ({
        id: s.id as string,
        asset_id: s.asset_id as string,
        schedule_name: s.schedule_name as string,
        interval_type: s.interval_type as "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based",
        interval_value: s.interval_value as number,
        task_description: (s.task_description as string) || "",
        estimated_hours: (s.estimated_hours as number) || 0,
        estimated_cost: (s.estimated_cost as number) || 0,
        requires_professional: s.requires_professional as boolean,
        last_completed: s.last_completed as string | null,
        next_due: s.next_due as string | null,
        alert_days_before: s.alert_days_before as number,
        is_active: s.is_active as boolean,
      }));
    }
  }

  if (!asset) return notFound();

  // Compute metrics
  const now = new Date();
  const purchaseDate = asset.purchase_date ? new Date(asset.purchase_date) : null;
  const ageMonths = purchaseDate
    ? Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
    : null;

  const totalMaintenanceCost = logs.reduce((sum, l) => sum + l.cost, 0);
  const totalDowntime = logs.reduce((sum, l) => sum + l.downtime_hours, 0);

  // Uptime calculation (rough): total hours since purchase minus downtime
  const totalHoursSincePurchase = purchaseDate
    ? (now.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60)
    : null;
  const uptimePct = totalHoursSincePurchase
    ? Math.min(99.9, ((totalHoursSincePurchase - totalDowntime) / totalHoursSincePurchase) * 100)
    : null;

  function formatDate(d: string | null): string {
    if (!d) return "--";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
        <Link href="/fleet" className="hover:text-white/70 transition-colors">
          Fleet
        </Link>
        <span>/</span>
        <span className="text-white/60">
          {asset.custom_name || asset.robot_name}
        </span>
      </nav>

      {/* Demo banner */}
      {isDemo && (
        <div className="mb-6 rounded-xl border border-[#7B2FFF]/30 bg-[#7B2FFF]/5 px-4 py-3">
          <p className="text-xs text-white/50">
            <span className="font-semibold text-[#7B2FFF]">Demo Mode</span> — This is sample data.{" "}
            <Link href="/auth/login" className="text-[#7B2FFF] underline">Sign in</Link> to manage your own fleet.
          </p>
        </div>
      )}

      {/* Asset Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {asset.custom_name || asset.robot_name}
            </h1>
            <span
              className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[asset.status]}`}
            >
              {asset.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/50">
            {asset.robot_name}
            {asset.serial_number ? ` \u00b7 S/N: ${asset.serial_number}` : ""}
          </p>
          <p className="text-xs text-white/50">
            {asset.site_location}
            {asset.department ? ` \u00b7 ${asset.department}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {isDemo ? (
            <span className="inline-flex items-center gap-2 rounded-[10px] bg-[#00C2FF]/50 px-4 py-2.5 text-sm font-bold text-[#0A0F1E] cursor-not-allowed">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Service
            </span>
          ) : (
            <Link
              href={`/fleet/${assetId}/log-service`}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#00C2FF] px-4 py-2.5 text-sm font-bold text-[#0A0F1E] hover:opacity-90 transition-opacity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Log Service
            </Link>
          )}
          <span
            className={`inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold ${isDemo ? "text-white/40 cursor-not-allowed" : "text-white/80 hover:bg-white/[0.08] cursor-pointer"} transition-colors`}
          >
            Edit Schedule
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">Uptime</p>
          <p className="mt-1 text-2xl font-bold text-[#00E5A0]">
            {uptimePct ? `${uptimePct.toFixed(1)}%` : "--"}
          </p>
        </div>
        <div className="rounded-xl border border-[#00C2FF]/30 bg-[#00C2FF]/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">Total Cost</p>
          <p className="mt-1 text-2xl font-bold text-[#00C2FF]">
            ${(asset.purchase_price + totalMaintenanceCost).toLocaleString()}
          </p>
          <p className="text-[13px] text-white/50">Purchase + maintenance</p>
        </div>
        <div className="rounded-xl border border-[#7B2FFF]/30 bg-[#7B2FFF]/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">Maintenance</p>
          <p className="mt-1 text-2xl font-bold text-[#7B2FFF]">
            ${totalMaintenanceCost.toLocaleString()}
          </p>
          <p className="text-[13px] text-white/50">{logs.length} service events</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">Age</p>
          <p className="mt-1 text-2xl font-bold text-white/80">
            {ageMonths !== null ? (ageMonths >= 12 ? `${Math.floor(ageMonths / 12)}y ${ageMonths % 12}m` : `${ageMonths}m`) : "--"}
          </p>
          <p className="text-[13px] text-white/50">
            {purchaseDate ? `Since ${formatDate(asset.purchase_date)}` : "No purchase date"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Maintenance Schedule */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
            Maintenance Schedule
          </h2>
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] divide-y divide-white/[0.06]">
            {schedules.length > 0 ? (
              schedules.map((s) => {
                const isOverdue = s.next_due && new Date(s.next_due) < now;
                return (
                  <div key={s.id} className="px-4 py-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/90">{s.schedule_name}</p>
                        <p className="text-xs text-white/40">
                          Every {s.interval_value > 1 ? `${s.interval_value} ` : ""}
                          {s.interval_type}
                          {s.estimated_hours ? ` \u00b7 ~${s.estimated_hours}h` : ""}
                          {s.estimated_cost ? ` \u00b7 ~$${s.estimated_cost}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xs font-medium ${
                            isOverdue ? "text-red-400" : "text-white/60"
                          }`}
                        >
                          {s.next_due ? formatDate(s.next_due) : "Not scheduled"}
                          {isOverdue && " (overdue)"}
                        </p>
                        {s.requires_professional && (
                          <span className="mt-1 inline-block rounded bg-[#7B2FFF]/20 px-1.5 py-0.5 text-[13px] font-medium text-[#7B2FFF]">
                            PRO
                          </span>
                        )}
                      </div>
                    </div>
                    {s.task_description && (
                      <p className="mt-1 text-xs text-white/50">{s.task_description}</p>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-sm text-white/50">
                No maintenance schedules configured
              </div>
            )}
          </div>
        </div>

        {/* Service Log Timeline */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
            Service History
          </h2>
          <div className="space-y-0">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div key={log.id} className="relative flex gap-4 pb-6">
                  {/* Timeline line */}
                  {i < logs.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-0 w-px bg-white/[0.08]" />
                  )}
                  {/* Dot */}
                  <div
                    className={`mt-1 h-[22px] w-[22px] shrink-0 rounded-full border-2 ${
                      log.maintenance_type === "emergency"
                        ? "border-red-400 bg-red-400/20"
                        : log.maintenance_type === "repair"
                        ? "border-amber-400 bg-amber-400/20"
                        : log.maintenance_type === "upgrade"
                        ? "border-[#7B2FFF] bg-[#7B2FFF]/20"
                        : "border-[#00C2FF] bg-[#00C2FF]/20"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[13px] font-medium capitalize ${typeStyles[log.maintenance_type]}`}
                          >
                            {log.maintenance_type}
                          </span>
                          <span className="text-xs text-white/40">
                            {formatDate(log.log_date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/80">{log.description}</p>
                      </div>
                      {log.cost > 0 && (
                        <span className="shrink-0 text-xs font-mono text-white/50">
                          ${log.cost.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
                      {log.technician && <span>Tech: {log.technician}</span>}
                      {log.downtime_hours > 0 && (
                        <span>Downtime: {log.downtime_hours}h</span>
                      )}
                      {log.parts_replaced.length > 0 && (
                        <span>Parts: {log.parts_replaced.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-8 text-center text-sm text-white/50">
                No service logs yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes section */}
      {asset.notes && (
        <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Notes</h3>
          <p className="text-sm text-white/60">{asset.notes}</p>
        </div>
      )}
    </div>
  );
}
