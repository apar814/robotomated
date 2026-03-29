"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ServiceLogFormProps {
  assetId: string;
  assetName: string;
}

export function ServiceLogForm({ assetId, assetName }: ServiceLogFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    log_date: new Date().toISOString().split("T")[0],
    maintenance_type: "routine" as "routine" | "repair" | "emergency" | "upgrade",
    description: "",
    technician: "",
    cost: "",
    downtime_hours: "",
    parts_replaced: "",
    next_service_date: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.log_date || !form.description) {
      setError("Date and description are required");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/fleet/maintenance-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: assetId,
          log_date: form.log_date,
          maintenance_type: form.maintenance_type,
          description: form.description,
          technician: form.technician || null,
          cost: form.cost ? Number(form.cost) : null,
          downtime_hours: form.downtime_hours ? Number(form.downtime_hours) : null,
          parts_replaced: form.parts_replaced
            ? form.parts_replaced.split(",").map((s) => s.trim()).filter(Boolean)
            : null,
          next_service_date: form.next_service_date || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to log service");
      }

      setStatus("success");
      setTimeout(() => router.push(`/fleet/${assetId}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-[#00E5A0]/30 bg-[#00E5A0]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00E5A0]/20">
          <svg className="h-6 w-6 text-[#00E5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Service Logged</h3>
        <p className="mt-1 text-sm text-white/50">Redirecting to asset page...</p>
      </div>
    );
  }

  const typeOptions = [
    { value: "routine", label: "Routine Maintenance", desc: "Scheduled preventive service" },
    { value: "repair", label: "Repair", desc: "Fix a known issue" },
    { value: "emergency", label: "Emergency", desc: "Unplanned breakdown" },
    { value: "upgrade", label: "Upgrade", desc: "Hardware or software upgrade" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <p className="text-xs text-white/40">Logging service for</p>
        <p className="text-sm font-semibold text-white/90">{assetName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">
            Service Date *
          </label>
          <input
            type="date"
            value={form.log_date}
            onChange={(e) => update("log_date", e.target.value)}
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#00C2FF]/50 focus:outline-none [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">
            Service Type *
          </label>
          <select
            value={form.maintenance_type}
            onChange={(e) => update("maintenance_type", e.target.value)}
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#00C2FF]/50 focus:outline-none [color-scheme:dark]"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">
          Description *
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          placeholder="What was done during this service?"
          className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#00C2FF]/50 focus:outline-none resize-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">
            Technician
          </label>
          <input
            type="text"
            value={form.technician}
            onChange={(e) => update("technician", e.target.value)}
            placeholder="Name of technician"
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#00C2FF]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">
            Cost ($)
          </label>
          <input
            type="number"
            value={form.cost}
            onChange={(e) => update("cost", e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#00C2FF]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">
            Downtime (hours)
          </label>
          <input
            type="number"
            value={form.downtime_hours}
            onChange={(e) => update("downtime_hours", e.target.value)}
            placeholder="0"
            min="0"
            step="0.5"
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#00C2FF]/50 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">
          Parts Replaced
        </label>
        <input
          type="text"
          value={form.parts_replaced}
          onChange={(e) => update("parts_replaced", e.target.value)}
          placeholder="Comma-separated: Drive belt, Air filter, Sensor module"
          className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#00C2FF]/50 focus:outline-none"
        />
        <p className="mt-1 text-xs text-white/30">Separate multiple parts with commas</p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-white/60">
          Next Service Date
        </label>
        <input
          type="date"
          value={form.next_service_date}
          onChange={(e) => update("next_service_date", e.target.value)}
          className="w-full rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-3 text-sm text-white focus:border-[#00C2FF]/50 focus:outline-none [color-scheme:dark]"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/fleet/${assetId}`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving..." : "Log Service"}
        </Button>
      </div>
    </form>
  );
}
