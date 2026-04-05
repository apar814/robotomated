"use client";

import { useEffect, useState, useCallback } from "react";

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceCheck {
  status: ServiceStatus;
  latency_ms?: number;
}

interface HealthData {
  status: ServiceStatus;
  services: {
    database: ServiceCheck;
    cache: ServiceCheck;
    payments: ServiceCheck;
    email: ServiceCheck;
    ai: ServiceCheck;
  };
  checked_at: string;
}

const SERVICE_META: Record<
  string,
  { label: string; description: string }
> = {
  database: { label: "Database", description: "Supabase PostgreSQL" },
  cache: { label: "Cache", description: "Upstash Redis" },
  payments: { label: "Payments", description: "Stripe" },
  email: { label: "Email", description: "Resend" },
  ai: { label: "AI", description: "Robotimus (Claude)" },
};

const STATUS_CONFIG: Record<
  ServiceStatus,
  { color: string; bg: string; icon: string; label: string }
> = {
  operational: {
    color: "var(--theme-accent-lime)",
    bg: "rgba(200, 255, 0, 0.08)",
    icon: "\u2713",
    label: "Operational",
  },
  degraded: {
    color: "#FBBF24",
    bg: "rgba(251, 191, 36, 0.08)",
    icon: "\u26A0",
    label: "Degraded",
  },
  down: {
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.08)",
    icon: "\u2717",
    label: "Down",
  },
};

const OVERALL_CONFIG: Record<
  ServiceStatus,
  { color: string; bg: string; label: string }
> = {
  operational: {
    color: "var(--theme-accent-lime)",
    bg: "rgba(200, 255, 0, 0.1)",
    label: "All Systems Operational",
  },
  degraded: {
    color: "#FBBF24",
    bg: "rgba(251, 191, 36, 0.1)",
    label: "Partial System Degradation",
  },
  down: {
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.1)",
    label: "System Outage Detected",
  },
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export function StatusBoard({ initialData }: { initialData: HealthData }) {
  const [data, setData] = useState<HealthData>(initialData);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/health/status", { cache: "no-store" });
      if (res.ok) {
        const json: HealthData = await res.json();
        setData(json);
      }
    } catch {
      // Keep showing last known data
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 60_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const overall = OVERALL_CONFIG[data.status];
  const services = Object.entries(data.services) as [
    string,
    ServiceCheck,
  ][];

  return (
    <div style={{ background: "var(--theme-bg)" }}>
      {/* Hero */}
      <section className="px-4 pt-20 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ color: "var(--theme-text-primary)" }}
          >
            System Status
          </h1>

          <div
            className="mx-auto mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3"
            style={{ background: overall.bg }}
          >
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{
                background: overall.color,
                boxShadow: `0 0 8px ${overall.color}`,
              }}
            />
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: overall.color }}
            >
              {overall.label}
            </span>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-4">
            {services.map(([key, service]) => {
              const meta = SERVICE_META[key];
              const cfg = STATUS_CONFIG[service.status];

              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border px-6 py-5"
                  style={{
                    borderColor: "var(--theme-border)",
                    background: "var(--theme-card)",
                  }}
                >
                  <div>
                    <h3
                      className="font-display text-base font-bold"
                      style={{ color: "var(--theme-text-primary)" }}
                    >
                      {meta.label}
                    </h3>
                    <p
                      className="mt-0.5 font-mono text-xs"
                      style={{ color: "var(--theme-text-muted)" }}
                    >
                      {meta.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {service.latency_ms !== undefined && (
                      <span
                        className="font-mono text-xs"
                        style={{ color: "var(--theme-text-muted)" }}
                      >
                        {service.latency_ms}ms
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-semibold"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p
              className="font-mono text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Last checked: {formatTime(data.checked_at)}
            </p>
            <p
              className="mt-1 font-mono text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              This page auto-refreshes every 60 seconds
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
