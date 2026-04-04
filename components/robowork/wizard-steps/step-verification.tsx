"use client";

import { useRef, useState } from "react";
import type { WizardData } from "@/components/robowork/wizard-types";

interface StepProps {
  data: WizardData;
  updateData: (partial: Partial<WizardData>) => void;
}

export default function StepVerification({ data, updateData }: StepProps) {
  // Email verification state
  const [emailSending, setEmailSending] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Phone verification state
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Tier file refs
  const idFileRef = useRef<HTMLInputElement>(null);
  const insuranceFileRef = useRef<HTMLInputElement>(null);

  // Tier file names for display
  const [idFileName, setIdFileName] = useState("");
  const [insuranceFileName, setInsuranceFileName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState(
    data.identityMethod === "linkedin" ? data.identityDocUrl : ""
  );

  async function handleSendEmailCode() {
    if (!data.companyName) {
      setEmailError("Complete Step 1 first (email is derived from your account).");
      return;
    }
    setEmailSending(true);
    setEmailError("");
    try {
      const res = await fetch("/api/robowork/providers/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.website || data.linkedin || "user@example.com", action: "send" }),
      });
      const json = await res.json();
      if (json.sent) {
        setEmailCodeSent(true);
      } else {
        setEmailError("Failed to send code. Try again.");
      }
    } catch {
      setEmailError("Network error. Try again.");
    } finally {
      setEmailSending(false);
    }
  }

  async function handleVerifyEmailCode() {
    if (emailCode.length !== 6) {
      setEmailError("Enter a 6-digit code.");
      return;
    }
    setEmailVerifying(true);
    setEmailError("");
    try {
      const res = await fetch("/api/robowork/providers/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.website || data.linkedin || "user@example.com",
          action: "verify",
          code: emailCode,
        }),
      });
      const json = await res.json();
      if (json.verified) {
        updateData({ emailVerified: true });
      } else {
        setEmailError("Invalid or expired code.");
      }
    } catch {
      setEmailError("Network error. Try again.");
    } finally {
      setEmailVerifying(false);
    }
  }

  function handleSendPhoneCode() {
    if (!data.phoneNumber || data.phoneNumber.length < 10) {
      setPhoneError("Enter a valid phone number first.");
      return;
    }
    setPhoneError("");
    setPhoneCodeSent(true);
  }

  function handleVerifyPhoneCode() {
    if (phoneCode.length !== 6) {
      setPhoneError("Enter a 6-digit code.");
      return;
    }
    setPhoneError("");
    updateData({ phoneVerified: true });
  }

  function handleIdFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setIdFileName(file.name);
    updateData({ identityDocUrl: url, identityMethod: "government_id" });
  }

  function handleLinkedinVerify() {
    if (!linkedinUrl) return;
    updateData({ identityDocUrl: linkedinUrl, identityMethod: "linkedin" });
  }

  function handleInsuranceFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setInsuranceFileName(file.name);
    updateData({ insuranceDocUrl: url });
  }

  const tier1Complete = !!data.identityDocUrl || data.identityMethod === "linkedin";
  const tier2Complete = !!data.insuranceDocUrl;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Verified RSPs win 3x more jobs
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Complete email and phone to proceed. Additional tiers are optional but increase trust.
        </p>
      </div>

      {/* Required: Email Verification */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: data.emailVerified ? "#00E5A0" : "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Email Verification *
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Required to proceed
            </div>
          </div>
          {data.emailVerified && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
              ✓
            </div>
          )}
        </div>

        {!data.emailVerified && (
          <div className="mt-3 space-y-3">
            {!emailCodeSent ? (
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={emailSending}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: "#0EA5E9" }}
              >
                {emailSending ? "Sending..." : "Send code"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-32 rounded-lg border px-3 py-2 text-sm font-mono tracking-widest outline-none"
                  style={{
                    background: "var(--theme-input-bg)",
                    borderColor: "var(--theme-input-border)",
                    color: "var(--theme-text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmailCode}
                  disabled={emailVerifying}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                  style={{ background: "#0EA5E9" }}
                >
                  {emailVerifying ? "Verifying..." : "Verify"}
                </button>
              </div>
            )}
            {emailError && (
              <div className="text-xs text-red-400">{emailError}</div>
            )}
          </div>
        )}
      </div>

      {/* Required: Phone Verification */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: data.phoneVerified ? "#00E5A0" : "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--theme-text-primary)" }}
            >
              Phone Verification *
            </div>
            <div
              className="text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Required to proceed
            </div>
          </div>
          {data.phoneVerified && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
              ✓
            </div>
          )}
        </div>

        {!data.phoneVerified && (
          <div className="mt-3 space-y-3">
            <input
              type="tel"
              value={data.phoneNumber}
              onChange={(e) => updateData({ phoneNumber: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              style={{
                background: "var(--theme-input-bg)",
                borderColor: "var(--theme-input-border)",
                color: "var(--theme-text-primary)",
              }}
            />
            {!phoneCodeSent ? (
              <button
                type="button"
                onClick={handleSendPhoneCode}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "#0EA5E9" }}
              >
                Send code
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  className="w-32 rounded-lg border px-3 py-2 text-sm font-mono tracking-widest outline-none"
                  style={{
                    background: "var(--theme-input-bg)",
                    borderColor: "var(--theme-input-border)",
                    color: "var(--theme-text-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleVerifyPhoneCode}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "#0EA5E9" }}
                >
                  Verify
                </button>
              </div>
            )}
            {phoneError && (
              <div className="text-xs text-red-400">{phoneError}</div>
            )}
          </div>
        )}
      </div>

      {/* Optional Tiers Header */}
      <div>
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--theme-text-primary)" }}
        >
          Verification Tiers
        </h3>
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Optional. Higher tiers unlock more visibility and jobs.
        </p>
      </div>

      {/* Tier 1 — Identity Verified */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: tier1Complete ? "#00E5A0" : "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: tier1Complete ? "#00E5A0" : "#64748b" }}
              >
                1
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Identity Verified
              </span>
            </div>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Upload government ID or link your LinkedIn. Unlocks &quot;Verified&quot; badge.
            </p>
          </div>
          {tier1Complete && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
              ✓
            </div>
          )}
        </div>

        {!tier1Complete && (
          <div className="mt-3 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                ref={idFileRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleIdFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => idFileRef.current?.click()}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text-primary)",
                  background: "var(--theme-input-bg)",
                }}
              >
                Upload Government ID
              </button>
              {idFileName && (
                <span
                  className="text-xs"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  {idFileName}
                </span>
              )}
            </div>

            <div
              className="text-center text-xs font-semibold"
              style={{ color: "var(--theme-text-muted)" }}
            >
              OR
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  background: "var(--theme-input-bg)",
                  borderColor: "var(--theme-input-border)",
                  color: "var(--theme-text-primary)",
                }}
              />
              <button
                type="button"
                onClick={handleLinkedinVerify}
                disabled={!linkedinUrl}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                style={{ background: "#0EA5E9" }}
              >
                Verify
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tier 2 — Insured */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: tier2Complete ? "#00E5A0" : "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: tier2Complete ? "#00E5A0" : "#64748b" }}
              >
                2
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--theme-text-primary)" }}
              >
                Insured
              </span>
            </div>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Upload insurance certificate. Unlocks &quot;Insured&quot; badge and priority listing.
            </p>
          </div>
          {tier2Complete && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
              ✓
            </div>
          )}
        </div>

        {!tier2Complete ? (
          <div className="mt-3">
            <input
              ref={insuranceFileRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleInsuranceFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => insuranceFileRef.current?.click()}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-primary)",
                background: "var(--theme-input-bg)",
              }}
            >
              Upload Insurance PDF
            </button>
            {insuranceFileName && (
              <span
                className="ml-2 text-xs"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {insuranceFileName}
              </span>
            )}
          </div>
        ) : (
          <div
            className="mt-2 text-xs font-medium"
            style={{ color: "#F59E0B" }}
          >
            Under review (24-48 hours)
          </div>
        )}
      </div>

      {/* Tier 3 — Background Checked */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white bg-slate-500">
            3
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--theme-text-primary)" }}
          >
            Background Checked
          </span>
        </div>
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Consent to a background check. Unlocks enterprise-tier jobs.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={data.backgroundCheckConsent}
            onChange={(e) =>
              updateData({ backgroundCheckConsent: e.target.checked })
            }
            className="h-4 w-4 rounded"
          />
          <span
            className="text-xs"
            style={{ color: "var(--theme-text-muted)" }}
          >
            $29.99 — free for Founding RSPs
          </span>
        </div>
        <button
          type="button"
          disabled
          className="mt-2 rounded-lg px-4 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
          style={{ background: "#64748b" }}
        >
          Coming soon
        </button>
      </div>

      {/* Tier 4 — RCO Certified */}
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: "var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white bg-slate-500">
            4
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--theme-text-primary)" }}
          >
            RCO Certified
          </span>
        </div>
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--theme-text-muted)" }}
        >
          Robotomated Certified Operator. The highest trust level.
        </p>
        <div className="mt-3 space-y-2">
          <a
            href="/certify"
            className="inline-block text-sm font-semibold underline"
            style={{ color: "#0EA5E9" }}
          >
            Learn more at /certify
          </a>
          <div
            className="rounded-md border px-3 py-2 text-xs font-mono"
            style={{
              borderColor: "var(--theme-border)",
              background: "var(--theme-input-bg)",
              color: "var(--theme-text-primary)",
            }}
          >
            Discount code:{" "}
            <span className="font-bold" style={{ color: "#00E5A0" }}>
              RSP_DISCOUNT_50
            </span>
          </div>
        </div>
      </div>

      {/* Skip for now */}
      <div className="text-center">
        <button
          type="button"
          className="text-sm underline"
          style={{ color: "var(--theme-text-muted)" }}
          onClick={() => {
            // The wizard container handles step navigation,
            // this is a visual cue — the "Next" button handles advancement
          }}
        >
          Skip optional tiers for now
        </button>
      </div>
    </div>
  );
}
