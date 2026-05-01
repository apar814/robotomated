"use client";

import { useState } from "react";
import {
  ROLE_TYPE_LABELS,
  TIMELINE_LABELS,
  WTP_LABELS,
  type RoleType,
  type Timeline,
  type WillingnessToPay,
} from "@/lib/workforce/types";

type Step = 1 | 2 | 3;

export function EmployerIntentForm() {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Company info
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactTitle, setContactTitle] = useState("");

  // Step 2: Role needs
  const [roleType, setRoleType] = useState<RoleType | "">("");
  const [roleTypeOther, setRoleTypeOther] = useState("");
  const [hiresNeeded, setHiresNeeded] = useState(1);

  // Step 3: Timeline & comp
  const [timeline, setTimeline] = useState<Timeline | "">("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [willingnessToPay, setWillingnessToPay] = useState<WillingnessToPay | "">("");
  const [notes, setNotes] = useState("");

  function canProceedStep1() {
    return companyName.trim() && contactName.trim() && contactEmail.trim();
  }

  function canProceedStep2() {
    return roleType !== "";
  }

  function canSubmit() {
    return timeline !== "";
  }

  async function handleSubmit() {
    if (!canSubmit()) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/employers/submit-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone || undefined,
          contact_title: contactTitle || undefined,
          role_type: roleType,
          role_type_other: roleType === "other" ? roleTypeOther : undefined,
          hires_needed: hiresNeeded,
          timeline,
          salary_min: salaryMin ? parseInt(salaryMin, 10) : undefined,
          salary_max: salaryMax ? parseInt(salaryMax, 10) : undefined,
          willingness_to_pay: willingnessToPay || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Submission failed");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <p className="text-3xl font-bold text-lime mb-3">Request Received</p>
        <p className="text-text-secondary text-lg mb-2">
          We'll reach out within 24 hours to discuss your hiring needs.
        </p>
        <p className="text-text-tertiary text-sm">
          Check your inbox at <strong className="text-text-primary">{contactEmail}</strong> for a confirmation.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-obsidian border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-white/50 transition-colors";
  const labelClass = "block text-sm font-medium text-text-secondary mb-1.5";
  const btnPrimary =
    "w-full bg-white text-obsidian font-semibold py-3.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const btnSecondary =
    "w-full border border-border text-text-secondary font-medium py-3 rounded-lg hover:border-white/20 hover:text-text-primary transition-colors";

  // Step indicators
  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono ${
              s === step
                ? "bg-white text-obsidian"
                : s < step
                  ? "bg-lime/20 text-lime"
                  : "bg-obsidian border border-border text-text-tertiary"
            }`}
          >
            {s < step ? "\u2713" : s}
          </div>
          {s < 3 && (
            <div
              className={`w-8 h-px ${s < step ? "bg-lime/40" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {stepIndicator}

      {/* Step 1: Company Info */}
      {step === 1 && (
        <div className="space-y-5">
          <p className="text-sm text-text-tertiary font-mono uppercase tracking-wider mb-4">
            Step 1 of 3: Company Info
          </p>
          <div>
            <label htmlFor="company_name" className={labelClass}>Company Name *</label>
            <input
              type="text"
              id="company_name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
              placeholder="Acme Robotics"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact_name" className={labelClass}>Your Name *</label>
              <input
                type="text"
                id="contact_name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={inputClass}
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="contact_title" className={labelClass}>Title</label>
              <input
                type="text"
                id="contact_title"
                value={contactTitle}
                onChange={(e) => setContactTitle(e.target.value)}
                className={inputClass}
                placeholder="VP Operations"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact_email" className={labelClass}>Email *</label>
              <input
                type="email"
                id="contact_email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputClass}
                placeholder="jane@acme.com"
              />
            </div>
            <div>
              <label htmlFor="contact_phone" className={labelClass}>Phone</label>
              <input
                type="tel"
                id="contact_phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputClass}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <button
            onClick={() => canProceedStep1() && setStep(2)}
            disabled={!canProceedStep1()}
            className={btnPrimary}
          >
            Next: Role Requirements
          </button>
        </div>
      )}

      {/* Step 2: Role Needs */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-text-tertiary font-mono uppercase tracking-wider mb-4">
            Step 2 of 3: Role Requirements
          </p>
          <div>
            <label htmlFor="role_type" className={labelClass}>Role Type *</label>
            <select
              id="role_type"
              value={roleType}
              onChange={(e) => setRoleType(e.target.value as RoleType)}
              className={inputClass}
            >
              <option value="">Select a role type</option>
              {(Object.entries(ROLE_TYPE_LABELS) as [RoleType, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                )
              )}
            </select>
          </div>
          {roleType === "other" && (
            <div>
              <label htmlFor="role_type_other" className={labelClass}>
                Describe the role
              </label>
              <input
                type="text"
                id="role_type_other"
                value={roleTypeOther}
                onChange={(e) => setRoleTypeOther(e.target.value)}
                className={inputClass}
                placeholder="e.g., Welding robot operator"
              />
            </div>
          )}
          <div>
            <label htmlFor="hires_needed" className={labelClass}>
              Number of Hires Needed *
            </label>
            <input
              type="number"
              id="hires_needed"
              value={hiresNeeded}
              onChange={(e) =>
                setHiresNeeded(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              min={1}
              max={100}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStep(1)} className={btnSecondary}>
              Back
            </button>
            <button
              onClick={() => canProceedStep2() && setStep(3)}
              disabled={!canProceedStep2()}
              className={btnPrimary}
            >
              Next: Timeline
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Timeline & Comp */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-text-tertiary font-mono uppercase tracking-wider mb-4">
            Step 3 of 3: Timeline & Compensation
          </p>
          <div>
            <label htmlFor="timeline" className={labelClass}>
              Hiring Timeline *
            </label>
            <select
              id="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as Timeline)}
              className={inputClass}
            >
              <option value="">Select timeline</option>
              {(Object.entries(TIMELINE_LABELS) as [Timeline, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                )
              )}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="salary_min" className={labelClass}>
                Salary Min ($)
              </label>
              <input
                type="number"
                id="salary_min"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className={inputClass}
                placeholder="45000"
              />
            </div>
            <div>
              <label htmlFor="salary_max" className={labelClass}>
                Salary Max ($)
              </label>
              <input
                type="number"
                id="salary_max"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className={inputClass}
                placeholder="75000"
              />
            </div>
          </div>
          <div>
            <label htmlFor="willingness_to_pay" className={labelClass}>
              Willing to Pay a Placement Fee?
            </label>
            <select
              id="willingness_to_pay"
              value={willingnessToPay}
              onChange={(e) =>
                setWillingnessToPay(e.target.value as WillingnessToPay)
              }
              className={inputClass}
            >
              <option value="">Select one (optional)</option>
              {(Object.entries(WTP_LABELS) as [WillingnessToPay, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                )
              )}
            </select>
          </div>
          <div>
            <label htmlFor="notes" className={labelClass}>
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Specific robot models, required certifications, location preferences..."
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setStep(2)} className={btnSecondary}>
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit() || status === "submitting"}
              className={btnPrimary}
            >
              {status === "submitting" ? "Submitting..." : "Submit Request"}
            </button>
          </div>
          <p className="text-xs text-text-tertiary text-center">
            No commitment. No recruiting fees during our launch period.
          </p>
        </div>
      )}
    </div>
  );
}
