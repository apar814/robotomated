"use client";

import { useState } from "react";
import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

const REQUIREMENTS = [
  "Bank account (checking or business)",
  "SSN or EIN",
  "Business address",
];

export default function StepPayment({ data, updateData }: StepProps) {
  const [showSuccess, setShowSuccess] = useState(data.paymentSetupStarted);

  function handleConnect() {
    updateData({ paymentSetupStarted: true });
    setShowSuccess(true);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Set up payments in 2 minutes
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Get paid fast and securely for every job.
        </p>
      </div>

      {/* Revenue Flow Visual */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div
          className="mb-3 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          How payments work
        </div>
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {/* Box 1 */}
          <div
            className="shrink-0 rounded-lg border px-4 py-3 text-center"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Business pays
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              100%
            </div>
          </div>

          {/* Arrow */}
          <div style={{ color: "var(--theme-text-muted)" }} className="text-lg shrink-0">
            →
          </div>

          {/* Box 2 */}
          <div
            className="shrink-0 rounded-lg border px-4 py-3 text-center"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Robotomated
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              (escrow)
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "var(--theme-text-muted)" }}
            >
              12%
            </div>
          </div>

          {/* Arrow */}
          <div style={{ color: "var(--theme-text-muted)" }} className="text-lg shrink-0">
            →
          </div>

          {/* Box 3 */}
          <div
            className="shrink-0 rounded-lg border px-4 py-3 text-center"
            style={{
              background: "var(--theme-card)",
              borderColor: "var(--theme-border)",
            }}
          >
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              You receive
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: "#D4D4D4" }}
            >
              88%
            </div>
          </div>
        </div>

        <div
          className="mt-3 text-center text-xs font-semibold"
          style={{ color: "#00E5A0" }}
        >
          Founding RSPs: 92% / 8%
        </div>
      </div>

      {/* Requirements */}
      <div>
        <div
          className="mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--theme-text-muted)" }}
        >
          What you&apos;ll need
        </div>
        <ul className="space-y-2">
          {REQUIREMENTS.map((req) => (
            <li key={req} className="flex items-center gap-2">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                style={{ background: "#D4D4D4" }}
              >
                ✓
              </span>
              <span
                className="text-sm"
                style={{ color: "var(--theme-text-primary)" }}
              >
                {req}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Connect Button or Success */}
      {!showSuccess ? (
        <button
          type="button"
          onClick={handleConnect}
          className="w-full rounded-lg px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: "#D4D4D4" }}
        >
          Connect your bank account
        </button>
      ) : (
        <div
          className="rounded-lg border p-4 text-center"
          style={{
            borderColor: "#00E5A0",
            background: "rgba(0,229,160,0.05)",
          }}
        >
          <div className="text-lg font-bold" style={{ color: "#00E5A0" }}>
            You&apos;re on the list
          </div>
          <div
            className="mt-1 text-sm"
            style={{ color: "var(--theme-text-muted)" }}
          >
            We&apos;ll notify you when payouts go live.
          </div>
        </div>
      )}

      {/* Security Note */}
      <div
        className="rounded-lg border p-3"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4D4D4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          <div>
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Your data is safe
            </div>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Bank info is stored by Stripe — Robotomated never sees your account numbers.
            </p>
          </div>
        </div>
      </div>

      {/* Tax Note */}
      <div
        className="text-center text-xs"
        style={{ color: "var(--theme-text-muted)" }}
      >
        We handle your 1099.
      </div>

      {/* Set up later */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm underline"
          style={{ color: "var(--theme-text-muted)" }}
          onClick={() => {
            // Visual cue — the wizard container handles navigation
          }}
        >
          Set up later
        </button>
      </div>
    </div>
  );
}
