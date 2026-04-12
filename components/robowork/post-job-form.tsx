"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  TASK_TYPES,
  INDUSTRIES,
  FULFILLMENT_OPTIONS,
  URGENCY_CONFIG,
} from "@/lib/robowork/constants";
import { TASK_TYPE_ICONS } from "@/components/ui/icons";

type FormData = {
  title: string;
  task_type: string;
  industry: string;
  description: string;
  requirements: string;
  city: string;
  state: string;
  remote_ok: boolean;
  start_date: string;
  end_date: string;
  urgency: string;
  budget_min: string;
  budget_max: string;
  fulfillment_type: string;
  robot_type: string;
  site_details: string;
  business_name: string;
  business_email: string;
};

const INITIAL: FormData = {
  title: "",
  task_type: "",
  industry: "",
  description: "",
  requirements: "",
  city: "",
  state: "",
  remote_ok: false,
  start_date: "",
  end_date: "",
  urgency: "flexible",
  budget_min: "",
  budget_max: "",
  fulfillment_type: "any",
  robot_type: "any",
  site_details: "",
  business_name: "",
  business_email: "",
};

const STEP_LABELS = [
  "Task Details",
  "Location & Timing",
  "Budget & Preferences",
  "Contact Info",
  "Review & Publish",
];

export function PostJobForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    switch (step) {
      case 0:
        return !!(form.title && form.task_type && form.industry && form.description);
      case 1:
        return true; // all optional
      case 2:
        return true;
      case 3:
        return !!(form.business_name && form.business_email);
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/robowork/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget_min: form.budget_min ? Number(form.budget_min) : null,
          budget_max: form.budget_max ? Number(form.budget_max) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create job");
      }

      const data = await res.json();
      router.push(`/robowork/jobs/${data.slug}?published=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-border bg-obsidian-elevated px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-electric-blue placeholder:text-text-tertiary";
  const labelClass = "mb-1.5 block font-mono text-[13px] uppercase tracking-widest text-text-ghost";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center gap-1">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i < step
                    ? "bg-electric-blue text-white"
                    : i === step
                      ? "border-2 border-electric-blue bg-electric-blue/10 text-electric-blue"
                      : "border border-border text-text-tertiary"
                )}
              >
                {i < step ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
            </div>
            <span
              className={cn(
                "text-center font-mono text-[8px] uppercase tracking-wider",
                i <= step ? "text-text-secondary" : "text-text-ghost"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded border border-magenta/20 bg-magenta/5 px-4 py-2 text-sm text-magenta">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-border bg-obsidian-surface p-6">
        {/* STEP 0: Task Details */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text-primary">What&apos;s the task?</h2>

            <div>
              <label className={labelClass}>Job Title *</label>
              <input
                className={inputClass}
                placeholder="e.g. Warehouse floor scrubbing — 50,000 sq ft facility"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Task Type *</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {TASK_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set("task_type", t.value)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded border px-2 py-3 text-center transition-colors",
                      form.task_type === t.value
                        ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                        : "border-border text-text-secondary hover:border-text-tertiary"
                    )}
                  >
                    {(() => { const Icon = TASK_TYPE_ICONS[t.value]; return Icon ? <Icon size={18} /> : null; })()}
                    <span className="text-[13px] leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Industry *</label>
              <select
                className={inputClass}
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                rows={5}
                className={inputClass}
                placeholder="Describe the task in detail. What needs to be done? What are the conditions on site?"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Requirements</label>
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Any specific requirements? Certifications, insurance, experience, etc."
                value={form.requirements}
                onChange={(e) => set("requirements", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 1: Location & Timing */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text-primary">Where and when?</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("remote_ok", !form.remote_ok)}
                className={cn(
                  "relative h-5 w-9 rounded-full transition-colors",
                  form.remote_ok ? "bg-electric-blue" : "bg-text-tertiary"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                    form.remote_ok ? "left-[18px]" : "left-0.5"
                  )}
                />
              </button>
              <span className="text-sm text-text-secondary">Remote operation OK</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Start Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.start_date}
                  onChange={(e) => set("start_date", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.end_date}
                  onChange={(e) => set("end_date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Urgency</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(URGENCY_CONFIG).map(([key, conf]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set("urgency", key)}
                    className={cn(
                      "rounded border px-4 py-2 text-xs transition-colors",
                      form.urgency === key
                        ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                        : "border-border text-text-secondary hover:border-text-tertiary"
                    )}
                  >
                    {conf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Budget & Preferences */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text-primary">Budget and preferences</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Budget Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">$</span>
                  <input
                    type="number"
                    className={cn(inputClass, "pl-7")}
                    placeholder="1,000"
                    value={form.budget_min}
                    onChange={(e) => set("budget_min", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Budget Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">$</span>
                  <input
                    type="number"
                    className={cn(inputClass, "pl-7")}
                    placeholder="10,000"
                    value={form.budget_max}
                    onChange={(e) => set("budget_max", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Fulfillment Type</label>
              <div className="flex flex-wrap gap-2">
                {FULFILLMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => set("fulfillment_type", opt.value)}
                    className={cn(
                      "rounded border px-4 py-2 text-xs transition-colors",
                      form.fulfillment_type === opt.value
                        ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                        : "border-border text-text-secondary hover:border-text-tertiary"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Robot Type Preference</label>
              <input
                className={inputClass}
                placeholder='e.g. "Floor scrubber" or "Any"'
                value={form.robot_type}
                onChange={(e) => set("robot_type", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Site Details</label>
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Describe the site: floor type, obstacles, access, power availability, safety requirements..."
                value={form.site_details}
                onChange={(e) => set("site_details", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text-primary">Contact information</h2>
            <p className="text-sm text-text-secondary">
              Your email will not be shown publicly. Providers will submit bids through the platform.
            </p>

            <div>
              <label className={labelClass}>Business Name *</label>
              <input
                className={inputClass}
                placeholder="Your company name"
                value={form.business_name}
                onChange={(e) => set("business_name", e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Business Email *</label>
              <input
                type="email"
                className={inputClass}
                placeholder="contact@company.com"
                value={form.business_email}
                onChange={(e) => set("business_email", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 4: Review & Publish */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-text-primary">Review your job posting</h2>

            <div className="space-y-4 rounded border border-border bg-obsidian-elevated p-4">
              <ReviewRow label="Title" value={form.title} />
              <ReviewRow
                label="Task Type"
                value={TASK_TYPES.find((t) => t.value === form.task_type)?.label || form.task_type}
              />
              <ReviewRow label="Industry" value={form.industry} />
              <ReviewRow label="Description" value={form.description} />
              {form.requirements && <ReviewRow label="Requirements" value={form.requirements} />}
              <ReviewRow
                label="Location"
                value={
                  [form.city, form.state].filter(Boolean).join(", ") ||
                  (form.remote_ok ? "Remote" : "Not specified")
                }
              />
              {form.remote_ok && <ReviewRow label="Remote OK" value="Yes" />}
              {form.start_date && <ReviewRow label="Start Date" value={form.start_date} />}
              {form.end_date && <ReviewRow label="End Date" value={form.end_date} />}
              <ReviewRow
                label="Urgency"
                value={URGENCY_CONFIG[form.urgency as keyof typeof URGENCY_CONFIG]?.label || form.urgency}
              />
              {(form.budget_min || form.budget_max) && (
                <ReviewRow
                  label="Budget"
                  value={`$${form.budget_min || "0"} - $${form.budget_max || "open"}`}
                />
              )}
              <ReviewRow
                label="Fulfillment"
                value={FULFILLMENT_OPTIONS.find((f) => f.value === form.fulfillment_type)?.label || form.fulfillment_type}
              />
              {form.robot_type !== "any" && <ReviewRow label="Robot Type" value={form.robot_type} />}
              {form.site_details && <ReviewRow label="Site Details" value={form.site_details} />}
              <ReviewRow label="Business" value={form.business_name} />
              <ReviewRow label="Email" value={form.business_email} />
            </div>

            {/* Fee disclosure */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">No upfront cost.</span>{" "}
                Robotomated charges an 8% fee upon job completion only. You pay nothing to post, nothing to receive bids, and nothing if you don&apos;t hire.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="rounded border border-border px-5 py-2.5 text-sm text-text-secondary transition-colors hover:border-text-tertiary hover:text-text-primary"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="rounded bg-electric-blue px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="rounded bg-electric-blue px-8 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Job"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="w-28 shrink-0 font-mono text-[13px] uppercase tracking-wider text-text-tertiary">
        {label}
      </span>
      <span className="text-sm text-text-primary">{value}</span>
    </div>
  );
}
