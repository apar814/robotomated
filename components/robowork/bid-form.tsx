"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { FULFILLMENT_OPTIONS } from "@/lib/robowork/constants";

interface BidFormProps {
  jobSlug: string;
  jobTitle: string;
}

export function BidForm({ jobSlug, jobTitle }: BidFormProps) {
  const [proposedPrice, setProposedPrice] = useState("");
  const [message, setMessage] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("with_operator");
  const [includesOperator, setIncludesOperator] = useState(true);
  const [proposedStartDate, setProposedStartDate] = useState("");
  const [proposedEndDate, setProposedEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!proposedPrice || Number(proposedPrice) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/robowork/jobs/${jobSlug}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rsp_id: "00000000-0000-0000-0000-000000000000", // placeholder — real RSP auth comes later
          proposed_price: Number(proposedPrice),
          message,
          fulfillment_type: fulfillmentType,
          includes_operator: includesOperator,
          proposed_start_date: proposedStartDate || null,
          proposed_end_date: proposedEndDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit bid");
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
      <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-8 text-center">
        <div className="mb-3 text-3xl">&#10003;</div>
        <h3 className="text-lg font-bold text-text-primary">Bid Submitted</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Your bid for &ldquo;{jobTitle}&rdquo; has been submitted. The business will be notified.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded border border-border bg-obsidian-elevated px-3 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-electric-blue placeholder:text-text-tertiary";

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-obsidian-surface p-6">
      <h3 className="mb-6 text-lg font-bold text-text-primary">Submit a Bid</h3>

      {error && (
        <div className="mb-4 rounded border border-magenta/20 bg-magenta/5 px-4 py-2 text-sm text-magenta">
          {error}
        </div>
      )}

      {/* Proposed price */}
      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-text-ghost">
          Proposed Price (USD) *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">$</span>
          <input
            type="number"
            required
            min={1}
            step={0.01}
            className={cn(inputClass, "pl-7")}
            placeholder="5,000"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-text-ghost">
          Message to Business
        </label>
        <textarea
          rows={4}
          className={inputClass}
          placeholder="Describe your approach, experience with this type of task, and why you're the right fit..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Fulfillment type */}
      <div className="mb-4">
        <label className="mb-2 block font-mono text-[9px] uppercase tracking-widest text-text-ghost">
          Fulfillment Type
        </label>
        <div className="flex flex-wrap gap-2">
          {FULFILLMENT_OPTIONS.filter((f) => f.value !== "any").map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setFulfillmentType(opt.value);
                setIncludesOperator(opt.value === "with_operator");
              }}
              className={cn(
                "rounded border px-3 py-2 text-xs transition-colors",
                fulfillmentType === opt.value
                  ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                  : "border-border text-text-secondary hover:border-text-tertiary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Includes operator toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIncludesOperator(!includesOperator)}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            includesOperator ? "bg-electric-blue" : "bg-text-tertiary"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
              includesOperator ? "left-[18px]" : "left-0.5"
            )}
          />
        </button>
        <span className="text-xs text-text-secondary">Includes operator</span>
      </div>

      {/* Dates */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Proposed Start
          </label>
          <input
            type="date"
            className={inputClass}
            value={proposedStartDate}
            onChange={(e) => setProposedStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-text-ghost">
            Proposed End
          </label>
          <input
            type="date"
            className={inputClass}
            value={proposedEndDate}
            onChange={(e) => setProposedEndDate(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-electric-blue px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Bid"}
      </button>
    </form>
  );
}
