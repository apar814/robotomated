"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type {
  EmployerIntent,
  CertificationEnrollment,
  Cohort,
} from "@/lib/workforce/types";
import {
  STATUS_LABELS,
  ROLE_TYPE_LABELS,
  TIMELINE_LABELS,
} from "@/lib/workforce/types";

interface EnrollmentWithEmail extends CertificationEnrollment {
  user_email: string;
  cohorts?: { name: string; start_date: string };
}

interface DashboardData {
  employers: EmployerIntent[];
  enrollments: EnrollmentWithEmail[];
  cohorts: Cohort[];
  summary: {
    total_employers: number;
    new_employers: number;
    total_students: number;
    total_revenue: number;
    placements: number;
  };
}

export default function WorkforceNetworkDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [empFilter, setEmpFilter] = useState<string>("all");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/workforce");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Unauthorized");
          return;
        }
        throw new Error("Failed to load");
      }
      setData(await res.json());
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function updateStatus(
    table: "employer_intent" | "certification_enrollments",
    id: string,
    statusData: Record<string, unknown>
  ) {
    await fetch("/api/admin/workforce/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update_status",
        id,
        table,
        data: statusData,
      }),
    });
    fetchData();
  }

  function exportCSV(type: "employers" | "enrollments") {
    if (!data) return;

    let csv = "";
    if (type === "employers") {
      csv =
        "Company,Contact,Title,Email,Phone,Role,Hires,Timeline,Salary Min,Salary Max,WTP,Status,Notes,Date\n";
      data.employers.forEach((e) => {
        csv += `"${e.company_name}","${e.contact_name}","${e.contact_title || ""}","${e.contact_email}","${e.contact_phone || ""}","${e.role_type}",${e.hires_needed},"${e.timeline}",${e.salary_min || ""},${e.salary_max || ""},"${e.willingness_to_pay || ""}","${e.status}","${(e.notes || "").replace(/"/g, '""')}","${e.created_at}"\n`;
      });
    } else {
      csv =
        "Email,Cohort,Tier,Amount,Payment,Completion,Placement,Enrolled\n";
      data.enrollments.forEach((e) => {
        csv += `"${e.user_email}","${e.cohorts?.name || ""}","${e.tier}",${e.amount_paid_cents ? (e.amount_paid_cents / 100).toFixed(2) : ""},"${e.payment_status}","${e.completion_status}","${e.placement_status}","${e.enrolled_at}"\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workforce-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="text-text-secondary">Loading workforce dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2" style={{ color: "var(--status-error-muted)" }}>{error}</p>
          <Link href="/admin" className="text-white text-sm hover:underline">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const filteredEmployers =
    empFilter === "all"
      ? data.employers
      : data.employers.filter((e) => e.status === empFilter);

  const statCards = [
    {
      label: "Employer Leads",
      value: data.summary.total_employers,
      accent: "text-white",
    },
    {
      label: "New (Uncontacted)",
      value: data.summary.new_employers,
      accent: "text-white",
    },
    {
      label: "Enrolled Students",
      value: data.summary.total_students,
      accent: "text-white",
    },
    {
      label: "Revenue",
      value: `$${(data.summary.total_revenue / 100).toLocaleString()}`,
      accent: "text-white",
    },
    {
      label: "Placements",
      value: data.summary.placements,
      accent: "text-white",
    },
  ];

  return (
    <main className="min-h-screen bg-obsidian px-4 pt-8 pb-24 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin"
            className="text-text-tertiary text-sm hover:text-text-secondary"
          >
            &larr; Admin
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-1">
            Workforce Network
          </h1>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-obsidian-surface border border-border rounded-lg p-4"
          >
            <p className={`text-2xl font-bold ${s.accent}`}>{s.value}</p>
            <p className="text-xs text-text-tertiary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Three Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Employer Pipeline ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Employer Pipeline
            </h2>
            <button
              onClick={() => exportCSV("employers")}
              className="text-xs text-white hover:underline"
            >
              Export CSV
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {["all", "new", "contacted", "qualified", "closed_won"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setEmpFilter(f)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    empFilter === f
                      ? "bg-white/10 text-white"
                      : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  {f === "all"
                    ? "All"
                    : f === "closed_won"
                      ? "Won"
                      : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              )
            )}
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {filteredEmployers.map((emp) => (
              <div
                key={emp.id}
                className="bg-obsidian-surface border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-text-primary text-sm">
                      {emp.company_name}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {emp.contact_name}
                      {emp.contact_title ? ` · ${emp.contact_title}` : ""}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {emp.contact_email}
                      {emp.contact_phone ? ` · ${emp.contact_phone}` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded shrink-0 ${
                      emp.status === "new"
                        ? "bg-amber/10 text-amber"
                        : emp.status === "closed_won"
                          ? "bg-lime/10 text-white"
                          : emp.status === "closed_lost"
                            ? "bg-white/5 text-white/60"
                            : "bg-white/5 text-white"
                    }`}
                  >
                    {STATUS_LABELS[emp.status]}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-2">
                  {ROLE_TYPE_LABELS[emp.role_type]} · {emp.hires_needed} hire
                  {emp.hires_needed > 1 ? "s" : ""} ·{" "}
                  {TIMELINE_LABELS[emp.timeline]}
                  {emp.salary_min || emp.salary_max
                    ? ` · $${(emp.salary_min || 0).toLocaleString()}-$${(emp.salary_max || 0).toLocaleString()}`
                    : ""}
                </p>
                {emp.notes && (
                  <p className="text-xs text-text-tertiary italic mb-2 line-clamp-2">
                    {emp.notes}
                  </p>
                )}
                <div className="flex gap-2 flex-wrap">
                  {emp.status === "new" && (
                    <button
                      onClick={() =>
                        updateStatus("employer_intent", emp.id, {
                          status: "contacted",
                          contacted_at: new Date().toISOString(),
                        })
                      }
                      className="text-xs bg-white/5 text-white px-2 py-1 rounded hover:bg-white/10"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {emp.status === "contacted" && (
                    <button
                      onClick={() =>
                        updateStatus("employer_intent", emp.id, {
                          status: "qualified",
                        })
                      }
                      className="text-xs bg-white/5 text-white px-2 py-1 rounded hover:bg-white/10"
                    >
                      Mark Qualified
                    </button>
                  )}
                  {(emp.status === "qualified" ||
                    emp.status === "contacted") && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus("employer_intent", emp.id, {
                            status: "closed_won",
                          })
                        }
                        className="text-xs bg-lime/10 text-white px-2 py-1 rounded hover:bg-lime/20"
                      >
                        Won
                      </button>
                      <button
                        onClick={() =>
                          updateStatus("employer_intent", emp.id, {
                            status: "closed_lost",
                          })
                        }
                        className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded hover:bg-white/10"
                      >
                        Lost
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {filteredEmployers.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-8">
                {empFilter === "all"
                  ? "No employer leads yet"
                  : `No ${empFilter} employers`}
              </p>
            )}
          </div>
        </div>

        {/* ─── Student Pipeline ─── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">
              Student Pipeline
            </h2>
            <button
              onClick={() => exportCSV("enrollments")}
              className="text-xs text-white hover:underline"
            >
              Export CSV
            </button>
          </div>
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {data.enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-obsidian-surface border border-border rounded-lg p-4"
              >
                <p className="font-semibold text-text-primary text-sm">
                  {enr.user_email}
                </p>
                <p className="text-xs text-text-tertiary mb-2">
                  {enr.cohorts?.name || "Unknown Cohort"} ·{" "}
                  {enr.tier === "early_bird" ? "Early Bird" : "Standard"} ·{" "}
                  {enr.amount_paid_cents
                    ? `$${(enr.amount_paid_cents / 100).toFixed(0)}`
                    : "Unpaid"}
                </p>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      enr.payment_status === "paid"
                        ? "bg-lime/10 text-white"
                        : "bg-amber/10 text-amber"
                    }`}
                  >
                    {enr.payment_status}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-white">
                    {enr.completion_status.replace("_", " ")}
                  </span>
                  {enr.placement_status !== "not_applicable" && (
                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded ${
                        enr.placement_status === "placed"
                          ? "bg-lime/10 text-white"
                          : "bg-white/5 text-white"
                      }`}
                    >
                      {enr.placement_status}
                    </span>
                  )}
                </div>
                {enr.payment_status === "paid" &&
                  enr.placement_status === "not_applicable" && (
                    <button
                      onClick={() =>
                        updateStatus("certification_enrollments", enr.id, {
                          placement_status: "seeking",
                        })
                      }
                      className="text-xs bg-white/5 text-white px-2 py-1 rounded hover:bg-white/10"
                    >
                      Mark Seeking Placement
                    </button>
                  )}
              </div>
            ))}
            {data.enrollments.length === 0 && (
              <p className="text-text-tertiary text-sm text-center py-8">
                No enrollments yet
              </p>
            )}
          </div>
        </div>

        {/* ─── Placements & Cohorts ─── */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Placements & Cohorts
          </h2>
          <div className="space-y-3">
            {/* Cohort progress */}
            {data.cohorts.map((cohort) => (
              <div
                key={cohort.id}
                className="bg-obsidian-surface border border-border rounded-lg p-4"
              >
                <p className="font-semibold text-text-primary text-sm">
                  {cohort.name}
                </p>
                <p className="text-xs text-text-tertiary mb-2">
                  {new Date(cohort.start_date).toLocaleDateString()} &mdash;{" "}
                  {new Date(cohort.end_date).toLocaleDateString()} ·{" "}
                  <span
                    className={
                      cohort.status === "open"
                        ? "text-white"
                        : cohort.status === "full"
                          ? "text-white/60"
                          : "text-white/80"
                    }
                  >
                    {cohort.status}
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-obsidian rounded-full h-2.5">
                    <div
                      className="bg-white/40 rounded-full h-2.5 transition-all"
                      style={{
                        width: `${Math.min(100, (cohort.enrolled_count / cohort.capacity) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary font-mono">
                    {cohort.enrolled_count}/{cohort.capacity}
                  </span>
                </div>
              </div>
            ))}

            {/* Placed students */}
            <h3 className="text-sm font-semibold text-text-secondary mt-4 mb-2">
              Placed Students
            </h3>
            {data.enrollments.filter((e) => e.placement_status === "placed")
              .length === 0 ? (
              <p className="text-text-tertiary text-xs">
                No placements yet. Students will appear here after being matched
                with employers.
              </p>
            ) : (
              data.enrollments
                .filter((e) => e.placement_status === "placed")
                .map((e) => (
                  <div
                    key={e.id}
                    className="bg-obsidian-surface border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-mono">
                        PLACED
                      </span>
                    </div>
                    <p className="text-sm text-text-primary">{e.user_email}</p>
                    {e.placed_at && (
                      <p className="text-xs text-text-tertiary">
                        Placed {new Date(e.placed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
