"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface CommunityReviewFormProps {
  robotId: string;
  robotName: string;
}

export function CommunityReviewForm({ robotId, robotName }: CommunityReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (stars === 0) { setError("Please select a star rating"); return; }
    if (!title.trim()) { setError("Title is required"); return; }
    if (wordCount < 50) { setError("Review must be at least 50 words"); return; }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robot_id: robotId,
          stars,
          title: title.trim(),
          body: body.trim(),
          pros: pros.split("\n").map((p) => p.trim()).filter(Boolean),
          cons: cons.split("\n").map((c) => c.trim()).filter(Boolean),
          verified_purchase: verified,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit review");
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
      <div className="rounded-xl border border-green/20 bg-green/5 p-6 text-center">
        <h3 className="font-semibold text-green">Review Submitted!</h3>
        <p className="mt-2 text-sm text-muted">
          Your review of {robotName} is pending moderation. It will appear once approved.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-border bg-navy-light p-6 text-center text-sm text-muted transition-colors hover:border-white/20 hover:text-foreground"
      >
        Write a review of {robotName}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-navy-light p-6">
      <h3 className="mb-4 text-lg font-semibold">Review {robotName}</h3>

      {/* Star rating */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Rating *
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoverStars(s)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => setStars(s)}
              className="p-0.5"
            >
              <svg
                className={cn(
                  "h-7 w-7 transition-colors",
                  s <= (hoverStars || stars) ? "text-yellow-400" : "text-navy-lighter"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {stars > 0 && <span className="ml-2 text-sm text-muted">{stars}/5</span>}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted">
          <span>Review *</span>
          <span className={cn("normal-case", wordCount < 50 ? "text-orange" : "text-green")}>
            {wordCount}/50 words min
          </span>
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          placeholder="Share your detailed experience with this robot..."
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Pros */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Pros (one per line)
        </label>
        <textarea
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          rows={3}
          placeholder="Fast setup&#10;Great battery life&#10;Quiet operation"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Cons */}
      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Cons (one per line)
        </label>
        <textarea
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          rows={3}
          placeholder="Expensive replacement parts&#10;App could be better"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Verified */}
      <label className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          checked={verified}
          onChange={(e) => setVerified(e.target.checked)}
          className="h-4 w-4 rounded border-border bg-navy-lighter accent-white"
        />
        <span className="text-sm text-muted">I own or have used this robot</span>
      </label>

      {error && <p className="mb-4 text-sm text-orange">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Review"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
