"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

type Step = 1 | 2 | 3 | 4 | 5;

const ROBOT_CATEGORIES = [
  "Warehouse / Logistics",
  "Manufacturing / Assembly",
  "Cleaning / Janitorial",
  "Security / Surveillance",
  "Healthcare / Medical",
  "Agriculture",
  "Construction",
  "Hospitality / Service",
  "Inspection / Maintenance",
  "Other",
];

const INDUSTRIES = [
  "Manufacturing",
  "Warehousing & Distribution",
  "Healthcare",
  "Retail",
  "Agriculture",
  "Construction",
  "Hospitality",
  "Food & Beverage",
  "Technology",
  "Government",
  "Other",
];

const REVENUE_RANGES = [
  "Under $1M",
  "$1M - $5M",
  "$5M - $25M",
  "$25M - $100M",
  "$100M - $500M",
  "$500M+",
];

const LEASE_TERMS = [12, 24, 36, 48, 60];

const LEASE_TYPES = [
  { value: "fmv", label: "Fair Market Value (FMV) -- Lower payments, return at end" },
  { value: "dollar_buyout", label: "$1 Buyout -- Higher payments, own at end" },
  { value: "percentage_buyout", label: "10% Buyout -- Balanced option" },
  { value: "not_sure", label: "Not sure -- Help me decide" },
];

const CREDIT_PROFILES = [
  "Excellent (750+)",
  "Good (700-749)",
  "Fair (650-699)",
  "Building credit / New business",
  "Prefer not to say",
];

const URGENCY_OPTIONS = [
  "Immediately (within 30 days)",
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "Just exploring options",
];

interface FormData {
  // Step 1
  robot_category: string;
  model_search: string;
  estimated_price: string;
  monthly_budget: string;
  // Step 2
  business_name: string;
  industry: string;
  revenue_range: string;
  employee_count: string;
  facility_sqft: string;
  state: string;
  // Step 3
  lease_term: string;
  lease_type: string;
  credit_profile: string;
  urgency: string;
  // Step 4
  use_case: string;
  hours_per_day: string;
  environment: string;
  // Step 5
  contact_name: string;
  business_email: string;
  phone: string;
}

const initialFormData: FormData = {
  robot_category: "",
  model_search: "",
  estimated_price: "",
  monthly_budget: "",
  business_name: "",
  industry: "",
  revenue_range: "",
  employee_count: "",
  facility_sqft: "",
  state: "",
  lease_term: "36",
  lease_type: "not_sure",
  credit_profile: "",
  urgency: "",
  use_case: "",
  hours_per_day: "",
  environment: "indoor",
  contact_name: "",
  business_email: "",
  phone: "",
};

export default function LeaseQuotePage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canAdvance(): boolean {
    switch (step) {
      case 1:
        return !!form.robot_category;
      case 2:
        return !!form.business_name && !!form.industry && !!form.state;
      case 3:
        return !!form.lease_term && !!form.credit_profile;
      case 4:
        return !!form.use_case;
      case 5:
        return !!form.contact_name && !!form.business_email;
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/lease/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="glass rounded-xl p-8">
          <h1 className="font-display text-3xl font-bold">
            Quote Request Received
          </h1>
          <p className="mt-4 text-muted">
            We have your lease inquiry and will match you with leasing providers
            within 48 hours. Check your email at{" "}
            <span className="text-foreground">{form.business_email}</span> for
            updates.
          </p>
          <Link
            href="/lease"
            className="mt-6 inline-block rounded-lg bg-[#00C2FF] px-6 py-2 font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90"
          >
            Back to Leasing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Lease", href: "/lease" },
          { name: "Get a Quote", href: "/lease/quote" },
        ]}
      />

      <h1 className="mt-8 font-display text-3xl font-bold">
        Get Lease Quotes
      </h1>
      <p className="mt-2 text-muted">
        Tell us about your needs and we will connect you with competitive
        leasing providers.
      </p>

      {/* Step Indicator */}
      <div className="mt-8 flex items-center gap-2">
        {([1, 2, 3, 4, 5] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => s < step && setStep(s)}
              disabled={s > step}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                s === step
                  ? "bg-[#00C2FF] text-[#0A0F1E]"
                  : s < step
                    ? "bg-[#00E5A0]/20 text-[#00E5A0] hover:bg-[#00E5A0]/30"
                    : "bg-white/5 text-muted"
              }`}
            >
              {s}
            </button>
            {s < 5 && (
              <div
                className={`h-px w-6 sm:w-10 ${
                  s < step ? "bg-[#00E5A0]/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {/* Step 1: Robot Info */}
        {step === 1 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Step 1: What Robot Do You Need?
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Robot Category *
                </label>
                <select
                  value={form.robot_category}
                  onChange={(e) => update("robot_category", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {ROBOT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Specific Model (optional)
                </label>
                <input
                  type="text"
                  value={form.model_search}
                  onChange={(e) => update("model_search", e.target.value)}
                  placeholder="e.g. Boston Dynamics Stretch, Locus Origin"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Estimated Robot Price
                </label>
                <input
                  type="text"
                  value={form.estimated_price}
                  onChange={(e) => update("estimated_price", e.target.value)}
                  placeholder="e.g. $150,000"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Monthly Budget
                </label>
                <input
                  type="text"
                  value={form.monthly_budget}
                  onChange={(e) => update("monthly_budget", e.target.value)}
                  placeholder="e.g. $5,000/month"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Business Info */}
        {step === 2 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Step 2: About Your Business
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => update("business_name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Industry *
                </label>
                <select
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Annual Revenue
                  </label>
                  <select
                    value={form.revenue_range}
                    onChange={(e) => update("revenue_range", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                  >
                    <option value="">Select range</option>
                    {REVENUE_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Number of Employees
                  </label>
                  <input
                    type="text"
                    value={form.employee_count}
                    onChange={(e) => update("employee_count", e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Facility Size (sq ft)
                  </label>
                  <input
                    type="text"
                    value={form.facility_sqft}
                    onChange={(e) => update("facility_sqft", e.target.value)}
                    placeholder="e.g. 25,000"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    State *
                  </label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    placeholder="e.g. California"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Lease Preferences */}
        {step === 3 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Step 3: Lease Preferences
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Preferred Lease Term *
                </label>
                <div className="flex flex-wrap gap-2">
                  {LEASE_TERMS.map((t) => (
                    <button
                      key={t}
                      onClick={() => update("lease_term", String(t))}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        form.lease_term === String(t)
                          ? "border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      {t} months
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Lease Type
                </label>
                <div className="space-y-2">
                  {LEASE_TYPES.map((lt) => (
                    <label
                      key={lt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition ${
                        form.lease_type === lt.value
                          ? "border-[#00C2FF] bg-[#00C2FF]/5"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="lease_type"
                        value={lt.value}
                        checked={form.lease_type === lt.value}
                        onChange={(e) => update("lease_type", e.target.value)}
                        className="accent-[#00C2FF]"
                      />
                      {lt.label}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Credit Profile *
                </label>
                <select
                  value={form.credit_profile}
                  onChange={(e) => update("credit_profile", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                >
                  <option value="">Select credit profile</option>
                  {CREDIT_PROFILES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Timeline
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) => update("urgency", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                >
                  <option value="">When do you need the robot?</option>
                  {URGENCY_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Use Case */}
        {step === 4 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Step 4: Your Use Case
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  What will the robot do? *
                </label>
                <textarea
                  value={form.use_case}
                  onChange={(e) => update("use_case", e.target.value)}
                  rows={4}
                  placeholder="Describe the tasks the robot will perform, the environment it will operate in, and any specific requirements."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Expected Daily Operating Hours
                </label>
                <input
                  type="text"
                  value={form.hours_per_day}
                  onChange={(e) => update("hours_per_day", e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Operating Environment
                </label>
                <div className="flex gap-2">
                  {["indoor", "outdoor", "both"].map((env) => (
                    <button
                      key={env}
                      onClick={() => update("environment", env)}
                      className={`rounded-lg border px-4 py-2 text-sm capitalize transition ${
                        form.environment === env
                          ? "border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      {env}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Contact */}
        {step === 5 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-xl font-semibold">
              Step 5: Your Contact Information
            </h2>
            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={form.contact_name}
                  onChange={(e) => update("contact_name", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Business Email *
                </label>
                <input
                  type="email"
                  value={form.business_email}
                  onChange={(e) => update("business_email", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm focus:border-[#00C2FF] focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setStep((step - 1) as Step)}
            disabled={step === 1}
            className="rounded-lg border border-white/10 px-6 py-2 text-sm font-medium transition hover:border-white/20 disabled:opacity-30"
          >
            Back
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep((step + 1) as Step)}
              disabled={!canAdvance()}
              className="rounded-lg bg-[#00C2FF] px-6 py-2 text-sm font-semibold text-[#0A0F1E] transition hover:bg-[#00C2FF]/90 disabled:opacity-30"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance() || submitting}
              className="rounded-lg bg-[#00E5A0] px-6 py-2 text-sm font-semibold text-[#0A0F1E] transition hover:bg-[#00E5A0]/90 disabled:opacity-30"
            >
              {submitting ? "Submitting..." : "Submit Quote Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
