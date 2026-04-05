import { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import FoundingRspActions from "./founding-rsp-actions";

export const metadata: Metadata = {
  title: "Founding RSP Applications — Admin",
};

interface Application {
  id: string;
  company_name: string;
  email: string;
  city: string;
  fleet_size: number | null;
  robot_types: string | null;
  why_founding: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  user_id: string | null;
}

export default async function FoundingRspAdminPage() {
  const supabase = createServerClient();

  const { data, error } = await (supabase as any)
    .from("founding_rsp_applications")
    .select("*")
    .order("created_at", { ascending: false });

  const applications: Application[] = data || [];

  const statusColor: Record<string, string> = {
    pending: "#eab308",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--theme-text, #e0e0e0)",
          marginBottom: 8,
        }}
      >
        Founding RSP Applications
      </h1>
      <p
        style={{
          color: "var(--theme-text-secondary, #888)",
          marginBottom: 24,
          fontSize: 14,
        }}
      >
        {applications.length} total applications
        {" · "}
        {applications.filter((a) => a.status === "pending").length} pending
        {" · "}
        {applications.filter((a) => a.status === "approved").length} approved
      </p>

      {error && (
        <p style={{ color: "#ef4444", marginBottom: 16 }}>
          Error loading applications: {error.message}
        </p>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--theme-border, #333)",
                textAlign: "left",
              }}
            >
              {[
                "Company",
                "Email",
                "City",
                "Fleet Size",
                "Robot Types",
                "Why",
                "Status",
                "Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text-secondary, #888)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                style={{
                  borderBottom: "1px solid var(--theme-border, #222)",
                }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text, #e0e0e0)",
                    fontWeight: 600,
                  }}
                >
                  {app.company_name}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text, #e0e0e0)",
                  }}
                >
                  {app.email}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text, #e0e0e0)",
                  }}
                >
                  {app.city}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text, #e0e0e0)",
                    textAlign: "center",
                  }}
                >
                  {app.fleet_size ?? "—"}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text, #e0e0e0)",
                  }}
                >
                  {app.robot_types || "—"}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text-secondary, #888)",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={app.why_founding}
                >
                  {app.why_founding.length > 100
                    ? app.why_founding.slice(0, 100) + "..."
                    : app.why_founding}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 10px",
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#000",
                      backgroundColor:
                        statusColor[app.status] || "#666",
                    }}
                  >
                    {app.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    color: "var(--theme-text-secondary, #888)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(app.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {app.status === "pending" && (
                    <FoundingRspActions id={app.id} />
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "var(--theme-text-secondary, #888)",
                  }}
                >
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
