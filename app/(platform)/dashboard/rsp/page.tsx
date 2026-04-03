"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// ── Types ──

interface StatCard {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
}

interface FleetRobot {
  id: string;
  name: string;
  manufacturer: string;
  status: "operational" | "deployed" | "maintenance" | "idle";
  utilization: number;
  currentJob?: string;
  lastMaintenance: string;
}

interface MaintenanceLog {
  id: string;
  robotName: string;
  type: "scheduled" | "emergency" | "preventive";
  description: string;
  cost: number;
  date: string;
  status: "completed" | "pending" | "in_progress";
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dueDate: string;
}

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  title: string;
  date: string;
}

interface MaintenanceAlert {
  id: string;
  robotName: string;
  dueDate: string;
  type: string;
}

// ── Mock Data ──

const MOCK_STATS: StatCard[] = [
  { label: "Active Jobs", value: "3", change: "+1 this week", changeType: "up" },
  { label: "Revenue This Month", value: "$12,450", change: "+8.2%", changeType: "up" },
  { label: "Pending Bids", value: "7", change: "2 expiring soon", changeType: "neutral" },
  { label: "Fleet Utilization", value: "68%", change: "-4%", changeType: "down" },
];

const MOCK_FLEET: FleetRobot[] = [
  {
    id: "1",
    name: "AMR-200 Unit A",
    manufacturer: "Locus Robotics",
    status: "deployed",
    utilization: 92,
    currentJob: "Warehouse picking at Acme Logistics",
    lastMaintenance: "2026-03-15",
  },
  {
    id: "2",
    name: "AMR-200 Unit B",
    manufacturer: "Locus Robotics",
    status: "operational",
    utilization: 45,
    lastMaintenance: "2026-03-20",
  },
  {
    id: "3",
    name: "Scrubber Pro X1",
    manufacturer: "Avidbots",
    status: "maintenance",
    utilization: 0,
    lastMaintenance: "2026-04-01",
  },
  {
    id: "4",
    name: "Patrol Bot S3",
    manufacturer: "Knightscope",
    status: "idle",
    utilization: 0,
    lastMaintenance: "2026-02-28",
  },
];

const MOCK_MAINTENANCE: MaintenanceLog[] = [
  {
    id: "1",
    robotName: "Scrubber Pro X1",
    type: "scheduled",
    description: "Quarterly brush replacement and sensor calibration",
    cost: 450,
    date: "2026-04-01",
    status: "in_progress",
  },
  {
    id: "2",
    robotName: "AMR-200 Unit A",
    type: "preventive",
    description: "Battery health check and wheel inspection",
    cost: 180,
    date: "2026-03-15",
    status: "completed",
  },
  {
    id: "3",
    robotName: "Patrol Bot S3",
    type: "emergency",
    description: "LIDAR sensor replacement after collision",
    cost: 1200,
    date: "2026-02-20",
    status: "completed",
  },
];

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0042",
    clientName: "Acme Logistics",
    amount: 4500,
    status: "paid",
    dueDate: "2026-03-15",
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0043",
    clientName: "Metro Distribution",
    amount: 2800,
    status: "sent",
    dueDate: "2026-04-10",
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-0044",
    clientName: "Summit Healthcare",
    amount: 3200,
    status: "overdue",
    dueDate: "2026-03-25",
  },
  {
    id: "4",
    invoiceNumber: "INV-2026-0045",
    clientName: "Greenfield Farms",
    amount: 1950,
    status: "draft",
    dueDate: "2026-04-20",
  },
];

const MOCK_REVIEWS: Review[] = [
  { id: "1", reviewer: "Acme Logistics", rating: 5, title: "Excellent warehouse picking service", date: "2026-03-28" },
  { id: "2", reviewer: "Metro Distribution", rating: 4, title: "Good performance, minor scheduling hiccup", date: "2026-03-20" },
];

const MOCK_ALERTS: MaintenanceAlert[] = [
  { id: "1", robotName: "AMR-200 Unit B", dueDate: "2026-04-10", type: "Quarterly service" },
  { id: "2", robotName: "Patrol Bot S3", dueDate: "2026-04-15", type: "Battery replacement" },
];

// ── Status Config ──

const STATUS_BADGE: Record<string, string> = {
  operational: "bg-lime/15 text-lime border-lime/20",
  deployed: "bg-electric-blue/15 text-electric-blue border-electric-blue/20",
  maintenance: "bg-amber/15 text-amber border-amber/20",
  idle: "bg-text-tertiary/15 text-text-secondary border-text-tertiary/20",
};

const INVOICE_STATUS_BADGE: Record<string, string> = {
  draft: "bg-text-tertiary/15 text-text-secondary",
  sent: "bg-electric-blue/15 text-electric-blue",
  paid: "bg-lime/15 text-lime",
  overdue: "bg-magenta/15 text-magenta",
  cancelled: "bg-text-tertiary/15 text-text-secondary",
};

const MAINT_TYPE_BADGE: Record<string, string> = {
  scheduled: "bg-electric-blue/15 text-electric-blue",
  emergency: "bg-magenta/15 text-magenta",
  preventive: "bg-lime/15 text-lime",
};

const TABS = ["Overview", "Jobs", "Fleet", "Maintenance", "Invoices"] as const;
type Tab = (typeof TABS)[number];

// ── Component ──

export default function RSPDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
            RSP Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your Robot Service Provider business
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors",
                activeTab === tab
                  ? "border-electric-blue text-electric-blue"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Overview" && <OverviewTab />}
        {activeTab === "Jobs" && <JobsTab />}
        {activeTab === "Fleet" && <FleetTab />}
        {activeTab === "Maintenance" && <MaintenanceTab />}
        {activeTab === "Invoices" && <InvoicesTab />}
      </div>
    </div>
  );
}

// ── Overview Tab ──

function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-obsidian-surface p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              {stat.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-text-primary">
              {stat.value}
            </p>
            {stat.change && (
              <p
                className={cn(
                  "mt-1 text-[11px]",
                  stat.changeType === "up" && "text-lime",
                  stat.changeType === "down" && "text-magenta",
                  stat.changeType === "neutral" && "text-text-secondary"
                )}
              >
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Reviews */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-lime" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Recent Reviews
          </span>
        </div>

        {MOCK_REVIEWS.length > 0 ? (
          <div className="space-y-3">
            {MOCK_REVIEWS.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border bg-obsidian-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {review.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary">
                      by {review.reviewer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm font-bold text-electric-blue">
                      {review.rating}
                    </span>
                    <span className="text-[10px] text-text-tertiary">/5</span>
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-text-tertiary">{review.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No reviews yet" />
        )}
      </div>

      {/* Upcoming Maintenance Alerts */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-amber" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Upcoming Maintenance
          </span>
        </div>

        {MOCK_ALERTS.length > 0 ? (
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border border-amber/20 bg-amber/5 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {alert.robotName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {alert.type}
                  </p>
                </div>
                <p className="font-mono text-xs text-amber">{alert.dueDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No upcoming maintenance" />
        )}
      </div>
    </div>
  );
}

// ── Jobs Tab ──

function JobsTab() {
  return (
    <div className="space-y-8">
      {/* Open Jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Open Jobs in Your Market
            </span>
          </div>
          <Link
            href="/robowork/jobs"
            className="font-mono text-[10px] text-electric-blue transition-colors hover:underline"
          >
            Browse all jobs &rarr;
          </Link>
        </div>
        <EmptyState message="No open jobs matching your capabilities right now. Check back soon or expand your service area." />
      </div>

      {/* Active Bids */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-violet" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Active Bids
          </span>
        </div>
        <EmptyState message="You have no active bids. Browse open jobs to submit your first bid." />
      </div>

      {/* Completed Jobs */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-lime" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Completed Jobs
          </span>
        </div>
        <EmptyState message="No completed jobs yet. Your job history will appear here." />
      </div>
    </div>
  );
}

// ── Fleet Tab ──

function FleetTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Your Fleet
          </span>
        </div>
        <button className="rounded bg-electric-blue px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
          Add Robot
        </button>
      </div>

      {MOCK_FLEET.length > 0 ? (
        <div className="space-y-3">
          {MOCK_FLEET.map((robot) => (
            <div
              key={robot.id}
              className="rounded-lg border border-border bg-obsidian-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary">
                      {robot.name}
                    </h3>
                    <span
                      className={cn(
                        "rounded border px-2 py-0.5 text-[10px] font-semibold capitalize",
                        STATUS_BADGE[robot.status]
                      )}
                    >
                      {robot.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {robot.manufacturer}
                  </p>
                  {robot.currentJob && (
                    <p className="mt-1 text-[11px] text-electric-blue">
                      {robot.currentJob}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg font-bold text-text-primary">
                    {robot.utilization}%
                  </p>
                  <p className="text-[10px] text-text-tertiary">utilization</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
                <span className="text-[10px] text-text-tertiary">
                  Last maintenance: {robot.lastMaintenance}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No robots in your fleet yet. Add your first robot to start bidding on jobs." />
      )}
    </div>
  );
}

// ── Maintenance Tab ──

function MaintenanceTab() {
  return (
    <div className="space-y-8">
      {/* Maintenance Log */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
              Maintenance Log
            </span>
          </div>
          <button className="rounded border border-border px-4 py-2 text-xs font-bold text-text-primary transition-colors hover:border-electric-blue hover:text-electric-blue">
            Schedule Maintenance
          </button>
        </div>

        {MOCK_MAINTENANCE.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Robot
                  </th>
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Type
                  </th>
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Description
                  </th>
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Cost
                  </th>
                  <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Date
                  </th>
                  <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {MOCK_MAINTENANCE.map((log) => (
                  <tr key={log.id}>
                    <td className="py-3 pr-4 text-sm font-semibold text-text-primary">
                      {log.robotName}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold capitalize",
                          MAINT_TYPE_BADGE[log.type]
                        )}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-text-secondary">
                      {log.description}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-text-primary">
                      ${log.cost.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-text-secondary">
                      {log.date}
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold capitalize",
                          log.status === "completed" && "bg-lime/15 text-lime",
                          log.status === "pending" && "bg-text-tertiary/15 text-text-secondary",
                          log.status === "in_progress" && "bg-amber/15 text-amber"
                        )}
                      >
                        {log.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="No maintenance records yet." />
        )}
      </div>

      {/* Cost Tracking */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Cost Summary
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total This Month", value: "$450" },
            { label: "Average Per Robot", value: "$610" },
            { label: "YTD Total", value: "$1,830" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-obsidian-surface p-4"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                {item.label}
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-text-primary">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Invoices Tab ──

function InvoicesTab() {
  const outstanding = MOCK_INVOICES.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue"
  ).reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header with action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Invoices
          </span>
        </div>
        <button className="rounded bg-electric-blue px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">
          Create Invoice
        </button>
      </div>

      {/* Outstanding Summary */}
      <div className="rounded-lg border border-amber/20 bg-amber/5 p-5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-amber">
          Outstanding Amount
        </p>
        <p className="mt-1 font-mono text-2xl font-extrabold text-text-primary">
          ${outstanding.toLocaleString()}
        </p>
        <p className="mt-1 text-[11px] text-text-secondary">
          {MOCK_INVOICES.filter((inv) => inv.status === "overdue").length} overdue
        </p>
      </div>

      {/* Invoice List */}
      {MOCK_INVOICES.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Invoice
                </th>
                <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Client
                </th>
                <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Amount
                </th>
                <th className="pb-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Due Date
                </th>
                <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 pr-4 font-mono text-xs font-semibold text-electric-blue">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 pr-4 text-sm text-text-primary">
                    {inv.clientName}
                  </td>
                  <td className="py-3 pr-4 font-mono text-sm font-bold text-text-primary">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-text-secondary">
                    {inv.dueDate}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-semibold capitalize",
                        INVOICE_STATUS_BADGE[inv.status]
                      )}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No invoices yet. Create your first invoice to get started." />
      )}
    </div>
  );
}

// ── Empty State ──

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-obsidian-surface/50 p-8 text-center">
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
