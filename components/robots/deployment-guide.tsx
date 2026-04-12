"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface DeploymentGuideProps {
  deploymentWeeksMin: number | null;
  deploymentWeeksMax: number | null;
  floorSpace: number | null;
  power: string | null;
  network: string | null;
  wmsIntegrations: string[] | null;
  erpIntegrations: string[] | null;
  apiAvailable: boolean | null;
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-[13px] text-text-data">{value}</p>
    </div>
  );
}

export function DeploymentGuide({
  deploymentWeeksMin,
  deploymentWeeksMax,
  floorSpace,
  power,
  network,
  wmsIntegrations,
  erpIntegrations,
  apiAvailable,
}: DeploymentGuideProps) {
  const [open, setOpen] = useState(false);

  const timelineText =
    deploymentWeeksMin != null && deploymentWeeksMax != null
      ? `${deploymentWeeksMin}–${deploymentWeeksMax} weeks to operational`
      : deploymentWeeksMin != null
        ? `${deploymentWeeksMin} weeks to operational`
        : "NOT SPECIFIED";

  const hasWms = wmsIntegrations != null && wmsIntegrations.length > 0;
  const hasErp = erpIntegrations != null && erpIntegrations.length > 0;

  return (
    <div className="rounded-md border border-border bg-obsidian-surface">
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="section-label mb-0">
          <span className="font-mono text-[9px] tracking-widest">
            [DEPLOYMENT] GUIDE
          </span>
        </div>
        <span className="font-mono text-xs text-text-tertiary">
          {open ? "−" : "+"}
        </span>
      </button>

      {/* Expandable Content */}
      {open && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {/* Timeline */}
          <p className="mb-4 font-mono text-lg font-bold text-text-primary">
            {timelineText}
          </p>

          {/* Infrastructure Requirements */}
          <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            Infrastructure Requirements
          </p>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <DataItem
              label="Floor Space"
              value={
                floorSpace != null
                  ? `${floorSpace.toLocaleString()} sq ft`
                  : "NOT SPECIFIED"
              }
            />
            <DataItem label="Power" value={power ?? "NOT SPECIFIED"} />
            <DataItem label="Network" value={network ?? "NOT SPECIFIED"} />
            <DataItem
              label="Timeline"
              value={timelineText}
            />
          </div>

          {/* Integrations */}
          <p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            Integrations
          </p>
          <div className="space-y-2">
            {/* WMS */}
            <div>
              <span className="font-mono text-[9px] text-text-tertiary">
                WMS:{" "}
              </span>
              {hasWms ? (
                <span className="font-mono text-[13px] text-text-data">
                  {wmsIntegrations.join(", ")}
                </span>
              ) : (
                <span className="font-mono text-[13px] text-text-ghost">
                  NOT SPECIFIED
                </span>
              )}
            </div>

            {/* ERP */}
            <div>
              <span className="font-mono text-[9px] text-text-tertiary">
                ERP:{" "}
              </span>
              {hasErp ? (
                <span className="font-mono text-[13px] text-text-data">
                  {erpIntegrations.join(", ")}
                </span>
              ) : (
                <span className="font-mono text-[13px] text-text-ghost">
                  NOT SPECIFIED
                </span>
              )}
            </div>

            {/* API */}
            <div>
              <span className="font-mono text-[9px] text-text-tertiary">
                API:{" "}
              </span>
              {apiAvailable === true ? (
                <span className="inline-block rounded-[2px] border border-[rgba(200,255,0,0.08)] bg-blue-600-dim px-1.5 py-0.5 font-mono text-[9px] text-blue-400">
                  AVAILABLE
                </span>
              ) : apiAvailable === false ? (
                <span className="inline-block rounded-[2px] border border-[rgba(255,0,110,0.08)] bg-magenta-dim px-1.5 py-0.5 font-mono text-[9px] text-magenta">
                  UNAVAILABLE
                </span>
              ) : (
                <span className="font-mono text-[13px] text-text-ghost">
                  NOT SPECIFIED
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
