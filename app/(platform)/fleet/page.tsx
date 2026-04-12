import type { Metadata } from "next";
import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/auth-server";
import { createServerClient } from "@/lib/supabase/server";
import { FleetDashboardCards } from "@/components/fleet/fleet-dashboard-cards";
import { AssetTable } from "@/components/fleet/asset-table";
import { MaintenanceCalendar } from "@/components/fleet/maintenance-calendar";
import {
  DEMO_ASSETS,
  DEMO_MAINTENANCE_LOGS,
  DEMO_SCHEDULES,
  computeFleetStats,
} from "@/lib/fleet/demo-data";
import type { DemoAsset, DemoMaintenanceLog, DemoSchedule } from "@/lib/fleet/demo-data";

export const metadata: Metadata = {
  title: "Fleet Management | Robotomated",
  description:
    "Track your robot fleet, schedule maintenance, log service, and monitor uptime across all your robotic assets.",
};

export default async function FleetPage() {
  const supabase = await createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isDemo = !user;

  let assets: DemoAsset[] = DEMO_ASSETS;
  let logs: DemoMaintenanceLog[] = DEMO_MAINTENANCE_LOGS;
  let schedules: DemoSchedule[] = DEMO_SCHEDULES;

  if (user) {
    const db = createServerClient();

    const [{ data: dbAssets }, { data: dbLogs }, { data: dbSchedules }] =
      await Promise.all([
        db
          .from("robot_assets")
          .select("*, robots(name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        db
          .from("maintenance_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("log_date", { ascending: false }),
        db
          .from("maintenance_schedules")
          .select("*, robot_assets!inner(user_id)")
          .eq("robot_assets.user_id", user.id)
          .order("next_due", { ascending: true }),
      ]);

    if (dbAssets && dbAssets.length > 0) {
      assets = dbAssets.map((a: Record<string, unknown>) => {
        const robotJoin = a.robots as { name: string } | null;
        return {
          id: a.id as string,
          custom_name: (a.custom_name as string) || "",
          robot_name: robotJoin?.name || "Unknown Robot",
          serial_number: (a.serial_number as string) || "",
          purchase_date: (a.purchase_date as string) || "",
          purchase_price: (a.purchase_price as number) || 0,
          site_location: (a.site_location as string) || "",
          department: (a.department as string) || "",
          status: a.status as "active" | "maintenance" | "offline" | "decommissioned",
          notes: a.notes as string | null,
          created_at: a.created_at as string,
        };
      });

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
    // If user has no assets, fall back to demo data
  }

  const stats = computeFleetStats(assets, logs, schedules);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1 font-mono text-[10px]">
        <Link href="/" className="text-white/25 transition-colors hover:text-white/50">Home</Link>
        <span className="text-white/15">/</span>
        <span className="text-white/40">Fleet Management</span>
      </nav>

      {/* Demo banner */}
      {isDemo && (
        <div className="mb-6 rounded-xl border border-[#7B2FFF]/30 bg-[#7B2FFF]/5 px-4 py-3 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#7B2FFF]">
              Demo Mode
            </p>
            <p className="text-xs text-white/50">
              Sign in with a Pro account to manage your own fleet.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="mt-2 inline-block rounded-lg bg-[#7B2FFF] px-4 py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity sm:mt-0"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Overdue alert */}
      {stats.overdue > 0 && (
        <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-400/20">
            <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-red-400">
              {stats.overdue} maintenance task{stats.overdue !== 1 ? "s" : ""} overdue
            </p>
            <p className="text-xs text-white/50">
              Review your maintenance schedule and log any completed services.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Fleet Management
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {isDemo ? "Preview of fleet tracking for Pro users" : `Managing ${assets.length} robot${assets.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isDemo ? (
            <span className="inline-flex items-center gap-2 rounded-[10px] bg-[#00C2FF]/50 px-4 py-2.5 text-sm font-bold text-[#0A0F1E] cursor-not-allowed">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Robot
            </span>
          ) : (
            <Link
              href="/fleet/add"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#00C2FF] px-4 py-2.5 text-sm font-bold text-[#0A0F1E] hover:opacity-90 transition-opacity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Robot
            </Link>
          )}
          {isDemo ? (
            <span className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/40 cursor-not-allowed">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Log Service
            </span>
          ) : (
            <Link
              href="/fleet/add"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/[0.08] transition-colors"
            >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Log Service
            </Link>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <FleetDashboardCards
          totalAssets={stats.totalAssets}
          activeRobots={stats.activeRobots}
          maintenanceDue={stats.maintenanceDue}
          overdue={stats.overdue}
          totalFleetValue={stats.totalFleetValue}
          ytdMaintenanceSpend={stats.ytdMaintenanceSpend}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Asset Table — spans 2 cols on large screens */}
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Fleet Assets
            </h2>
            <span className="text-xs text-white/30">{assets.length} total</span>
          </div>
          <AssetTable
            assets={assets}
            logs={logs}
            schedules={schedules}
            isDemo={isDemo}
          />
        </div>

        {/* Maintenance Calendar — sidebar */}
        <div>
          <MaintenanceCalendar schedules={schedules} assets={assets} />
        </div>
      </div>

      {/* Next step */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Link href="/fleet/add" className="group rounded-lg border border-white/[0.06] bg-[#0D0D0D] p-5 transition-all hover:border-[#2563EB]/30">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">Manage</p>
          <p className="mt-1 text-sm font-bold text-white transition-colors group-hover:text-[#2563EB]">Add a robot to your fleet</p>
          <p className="mt-1 text-xs text-white/40">Register a new asset for tracking.</p>
        </Link>
        <Link href="/tools/maintenance-estimator" className="group rounded-lg border border-white/[0.06] bg-[#0D0D0D] p-5 transition-all hover:border-[#2563EB]/30">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">Plan</p>
          <p className="mt-1 text-sm font-bold text-white transition-colors group-hover:text-[#2563EB]">Estimate maintenance costs</p>
          <p className="mt-1 text-xs text-white/40">Forecast your fleet operating budget.</p>
        </Link>
        <Link href="/certify" className="group rounded-lg border border-white/[0.06] bg-[#0D0D0D] p-5 transition-all hover:border-[#2563EB]/30">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/25">Train</p>
          <p className="mt-1 text-sm font-bold text-white transition-colors group-hover:text-[#2563EB]">Certify your operators</p>
          <p className="mt-1 text-xs text-white/40">Certified operators have 73% fewer incidents.</p>
        </Link>
      </div>
    </div>
  );
}
