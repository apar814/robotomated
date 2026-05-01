"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const tiers = ["Bronze (Free)", "Silver ($499/mo)", "Gold ($1,499/mo)", "Platinum ($4,999/mo)"] as const;

export function PartnerContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      tier: (form.elements.namedItem("tier") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/manufacturers/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(body.error || "Submission failed");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--status-success, #3A5876)" }}>
          <svg className="h-8 w-8" style={{ color: "var(--status-success-text, #6B8AB8)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-bold">Message received</h3>
        <p className="mt-2 text-muted">
          Our partnerships team will be in touch within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
          <input
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            placeholder="Your full name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            placeholder="you@company.com"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Company</span>
          <input
            name="company"
            type="text"
            required
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
            placeholder="Your company name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Tier interest</span>
          <select
            name="tier"
            required
            className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
          >
            <option value="">Select a tier</option>
            {tiers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Message</span>
        <textarea
          name="message"
          rows={4}
          className="w-full rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
          placeholder="Tell us about your partnership goals..."
        />
      </label>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-400">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full py-3 text-base"
      >
        {status === "submitting" ? "Sending..." : "Schedule a call"}
      </Button>
    </form>
  );
}
