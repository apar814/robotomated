"use client";

import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
}

const BADGE_CONFIG = [
  { key: "identity", label: "Identity", check: (d: WizardData) => !!d.identityDocUrl || d.identityMethod === "linkedin" },
  { key: "insured", label: "Insured", check: (d: WizardData) => !!d.insuranceDocUrl },
  { key: "background", label: "Background", check: (d: WizardData) => d.backgroundCheckConsent },
  { key: "rco", label: "RCO", check: (_d: WizardData) => false },
] as const;

const FULFILLMENT_COLORS: Record<string, string> = {
  delivery: "#7B2FFF",
  pickup: "#0EA5E9",
  onsite: "#00E5A0",
  remote: "#F59E0B",
};

function formatRate(rate: string, period: string): string {
  if (!rate) return "";
  const num = parseFloat(rate);
  if (isNaN(num)) return "";
  return `$${num.toLocaleString()}/${period}`;
}

export default function StepPreview({ data }: StepProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Here&apos;s how businesses will find you
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Review your profile before publishing.
        </p>
      </div>

      {/* Profile Header */}
      <div
        className="rounded-lg border p-5"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-center gap-4">
          {data.profileImageUrl ? (
            <img
              src={data.profileImageUrl}
              alt={data.companyName}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: "#64748b" }}
            >
              {data.companyName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              {data.companyName || "Your Company"}
            </div>
            {data.city && data.state && (
              <div
                className="text-sm"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {data.city}, {data.state} · {data.serviceRadius} mile radius
              </div>
            )}
          </div>
        </div>

        {/* Verification Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          {BADGE_CONFIG.map((badge) => {
            const active = badge.check(data);
            return (
              <span
                key={badge.key}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: active ? "rgba(0,229,160,0.1)" : "rgba(100,116,139,0.1)",
                  color: active ? "#00E5A0" : "#64748b",
                  border: `1px solid ${active ? "rgba(0,229,160,0.3)" : "rgba(100,116,139,0.2)"}`,
                }}
              >
                {active ? "✓" : "○"} {badge.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Robot Fleet */}
      {data.robots.length > 0 && (
        <div>
          <div
            className="mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Robot Fleet ({data.robots.length})
          </div>
          <div className="space-y-3">
            {data.robots.map((robot) => (
              <div
                key={robot.id}
                className="rounded-lg border p-4"
                style={{
                  borderColor: "var(--theme-border)",
                  background: "var(--theme-card)",
                }}
              >
                <div
                  className="text-sm font-bold"
                  style={{ color: "var(--theme-text-primary)" }}
                >
                  {robot.name || "Unnamed Robot"}
                </div>
                {robot.manufacturer && (
                  <div
                    className="text-xs"
                    style={{ color: "var(--theme-text-muted)" }}
                  >
                    by {robot.manufacturer}
                  </div>
                )}

                {/* Rates */}
                <div className="mt-2 flex flex-wrap gap-3">
                  {robot.dailyRate && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#0EA5E9" }}
                    >
                      {formatRate(robot.dailyRate, "day")}
                    </span>
                  )}
                  {robot.weeklyRate && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#0EA5E9" }}
                    >
                      {formatRate(robot.weeklyRate, "week")}
                    </span>
                  )}
                  {robot.monthlyRate && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#0EA5E9" }}
                    >
                      {formatRate(robot.monthlyRate, "month")}
                    </span>
                  )}
                </div>

                {/* Fulfillment Types */}
                {robot.fulfillmentTypes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {robot.fulfillmentTypes.map((ft) => (
                      <span
                        key={ft}
                        className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        style={{
                          background: `${FULFILLMENT_COLORS[ft] || "#64748b"}15`,
                          color: FULFILLMENT_COLORS[ft] || "#64748b",
                        }}
                      >
                        {ft}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specializations */}
      {(data.specializations.length > 0 || data.taskSpecializations.length > 0) && (
        <div>
          <div
            className="mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Specializations
          </div>
          <div className="flex flex-wrap gap-2">
            {data.specializations.map((spec) => (
              <span
                key={spec}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(123,47,255,0.1)",
                  color: "#7B2FFF",
                  border: "1px solid rgba(123,47,255,0.2)",
                }}
              >
                {spec}
              </span>
            ))}
            {data.taskSpecializations.map((task) => (
              <span
                key={task}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(14,165,233,0.1)",
                  color: "#0EA5E9",
                  border: "1px solid rgba(14,165,233,0.2)",
                }}
              >
                {task}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Service Area */}
      {data.city && data.state && (
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "var(--theme-border)",
            background: "var(--theme-card)",
          }}
        >
          <div
            className="mb-1 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--theme-text-muted)" }}
          >
            Service Area
          </div>
          <div
            className="text-sm font-semibold"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {data.city}, {data.state} · {data.serviceRadius} mile radius
          </div>
          {data.additionalCities.length > 0 && (
            <div
              className="mt-1 text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              + {data.additionalCities.map((c) => `${c.city}, ${c.state}`).join(" · ")}
            </div>
          )}
        </div>
      )}

      {/* RSP Score */}
      <div
        className="rounded-lg border p-4 text-center"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          RSP Score
        </div>
        <div
          className="mt-1 text-sm font-semibold"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Pending — calculated after first job
        </div>
      </div>
    </div>
  );
}
