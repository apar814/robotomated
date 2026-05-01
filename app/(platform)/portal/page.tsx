"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ManufacturerPortalPage() {
  const [form, setForm] = useState({
    company_name: "",
    contact_email: "",
    robot_name: "",
    model_number: "",
    product_url: "",
    specs_text: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name || !form.contact_email || !form.robot_name) {
      setError("Company name, email, and robot name are required");
      return;
    }

    setStatus("submitting");
    setError("");

    // Parse specs from text (JSON or key:value lines)
    let specs = {};
    if (form.specs_text.trim()) {
      try {
        specs = JSON.parse(form.specs_text);
      } catch {
        // Try key:value format
        const parsed: Record<string, string> = {};
        for (const line of form.specs_text.split("\n")) {
          const [k, ...v] = line.split(":");
          if (k?.trim()) parsed[k.trim()] = v.join(":").trim();
        }
        specs = parsed;
      }
    }

    try {
      const res = await fetch("/api/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company_name,
          contact_email: form.contact_email,
          robot_name: form.robot_name,
          model_number: form.model_number || null,
          product_url: form.product_url || null,
          specs,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--status-success, #3A5876)" }}>
            <svg className="h-8 w-8" style={{ color: "var(--status-success-text, #6B8AB8)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--status-success-text, #6B8AB8)" }}>Submission Received!</h1>
        <p className="mt-3 text-muted">
          Thanks for submitting {form.robot_name}. Our team will review it and reach out
          to {form.contact_email} within 3 business days.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-white hover:underline">
          Back to Robotomated
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Manufacturer Portal</h1>
      <p className="mt-3 text-muted">
        Submit your robot for listing on Robotomated. We review every submission and add
        qualifying robots to our database with a full RoboScore evaluation.
      </p>
      <p className="mt-2 text-xs text-muted">
        Listing is free. We never charge manufacturers to appear in our database.
        Scores are determined independently.{" "}
        <Link href="/methodology" className="text-white hover:underline">Read our methodology</Link>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-xl border border-border bg-navy-light p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Company Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-muted">Company Name *</label>
              <input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} required className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs text-muted">Contact Email *</label>
              <input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} required className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-navy-light p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">Robot Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-muted">Robot Name *</label>
              <input value={form.robot_name} onChange={(e) => update("robot_name", e.target.value)} required className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs text-muted">Model Number</label>
              <input value={form.model_number} onChange={(e) => update("model_number", e.target.value)} className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs text-muted">Product URL</label>
            <input type="url" value={form.product_url} onChange={(e) => update("product_url", e.target.value)} placeholder="https://yourcompany.com/robot" className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none" />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs text-muted">
              Specifications (JSON or key: value format, one per line)
            </label>
            <textarea value={form.specs_text} onChange={(e) => update("specs_text", e.target.value)} rows={6} placeholder={'payload_kg: 5\nreach_mm: 850\ndof: 6\nweight_kg: 20.6'} className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none" />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs text-muted">Additional Notes</label>
            <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} placeholder="Any additional context about the robot..." className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none" />
          </div>
        </div>

        {error && <p className="text-sm text-orange">{error}</p>}

        <Button type="submit" disabled={status === "submitting"} className="w-full py-3">
          {status === "submitting" ? "Submitting..." : "Submit Robot for Listing"}
        </Button>
      </form>
    </div>
  );
}
