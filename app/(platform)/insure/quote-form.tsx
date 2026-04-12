"use client";

import { useState } from "react";

interface InsuranceQuoteFormProps {
  coverageTypes: string[];
}

export function InsuranceQuoteForm({ coverageTypes }: InsuranceQuoteFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    const coverageNeeds = coverageTypes.filter(
      (_, i) => (form.elements.namedItem(`coverage_${i}`) as HTMLInputElement)?.checked
    );

    const body = {
      robot_brand: data.get("robot_brand"),
      robot_model: data.get("robot_model"),
      robot_value: Number(data.get("robot_value")),
      robot_count: Number(data.get("robot_count")) || 1,
      use_case: data.get("use_case"),
      location: data.get("location"),
      coverage_needs: coverageNeeds,
      annual_budget: data.get("annual_budget"),
      contact_name: data.get("contact_name"),
      contact_email: data.get("contact_email"),
      contact_phone: data.get("contact_phone"),
    };

    try {
      const res = await fetch("/api/insure/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00E5A0]/20">
          <svg className="h-8 w-8 text-[#00E5A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-white">
          Inquiry Submitted
        </h3>
        <p className="mt-2 text-muted">
          We will match you with insurers who specialize in robotic systems.
          Expect quotes within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
      {error && (
        <div className="sm:col-span-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="robot_brand" className="text-sm font-medium text-muted">
          Robot Brand
        </label>
        <input
          id="robot_brand"
          name="robot_brand"
          type="text"
          required
          placeholder="e.g. Fanuc, ABB"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="robot_model" className="text-sm font-medium text-muted">
          Robot Model
        </label>
        <input
          id="robot_model"
          name="robot_model"
          type="text"
          required
          placeholder="e.g. CRX-10iA"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="robot_value" className="text-sm font-medium text-muted">
          Estimated Value (USD)
        </label>
        <input
          id="robot_value"
          name="robot_value"
          type="number"
          required
          min="0"
          placeholder="50000"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="robot_count" className="text-sm font-medium text-muted">
          Number of Robots
        </label>
        <input
          id="robot_count"
          name="robot_count"
          type="number"
          min="1"
          defaultValue={1}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="use_case" className="text-sm font-medium text-muted">
          Use Case
        </label>
        <select
          id="use_case"
          name="use_case"
          required
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#00C2FF] focus:outline-none"
        >
          <option value="">Select use case</option>
          <option value="manufacturing">Manufacturing / Assembly</option>
          <option value="warehouse">Warehouse / Logistics</option>
          <option value="construction">Construction</option>
          <option value="healthcare">Healthcare</option>
          <option value="agriculture">Agriculture</option>
          <option value="food_service">Food Service</option>
          <option value="research">Research / Education</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="text-sm font-medium text-muted">
          Coverage Needed
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coverageTypes.map((type, i) => (
            <label
              key={type}
              className="flex items-center gap-3 rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-white/20"
            >
              <input
                type="checkbox"
                name={`coverage_${i}`}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#00C2FF] focus:ring-[#00C2FF]"
              />
              <span className="text-sm text-white">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="location" className="text-sm font-medium text-muted">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          placeholder="City, State"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="annual_budget" className="text-sm font-medium text-muted">
          Annual Budget
        </label>
        <select
          id="annual_budget"
          name="annual_budget"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#00C2FF] focus:outline-none"
        >
          <option value="">Select range</option>
          <option value="under_5k">Under $5,000</option>
          <option value="5k_15k">$5,000 - $15,000</option>
          <option value="15k_50k">$15,000 - $50,000</option>
          <option value="50k_plus">$50,000+</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact_name" className="text-sm font-medium text-muted">
          Contact Name
        </label>
        <input
          id="contact_name"
          name="contact_name"
          type="text"
          required
          placeholder="Jane Smith"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact_email" className="text-sm font-medium text-muted">
          Contact Email
        </label>
        <input
          id="contact_email"
          name="contact_email"
          type="email"
          required
          placeholder="jane@company.com"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact_phone" className="text-sm font-medium text-muted">
          Phone (optional)
        </label>
        <input
          id="contact_phone"
          name="contact_phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#00C2FF] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Get Quotes"}
        </button>
      </div>
    </form>
  );
}
