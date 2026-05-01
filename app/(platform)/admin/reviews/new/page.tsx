"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DIMENSIONS, calculateRoboScore } from "@/lib/scoring/roboscore";
import { RoboScoreRing, ScoreBar } from "@/components/ui/robo-score";
import { ProsConsList } from "@/components/reviews/pros-cons-list";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

interface RobotOption { id: string; name: string; slug: string }

export default function AdminNewReviewPage() {
  const [robots, setRobots] = useState<RobotOption[]>([]);
  const [robotId, setRobotId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [verdict, setVerdict] = useState("");
  const [prosText, setProsText] = useState("");
  const [consText, setConsText] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const d of DIMENSIONS) init[d.key] = 75;
    return init;
  });
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // Fetch robots for selector
  useEffect(() => {
    fetch("/api/robots?sort=score_desc&perPage=100")
      .then((r) => r.json())
      .then((data) => {
        setRobots((data.robots || []).map((r: { id: string; name: string; slug: string }) => ({
          id: r.id, name: r.name, slug: r.slug,
        })));
      });
  }, []);

  const breakdown: RoboScoreBreakdown = {
    performance: scores.performance,
    reliability: scores.reliability,
    ease_of_use: scores.ease_of_use,
    intelligence: scores.intelligence,
    value: scores.value,
    ecosystem: scores.ecosystem,
    safety: scores.safety,
    design: scores.design,
  };

  let finalScore = 0;
  try { finalScore = calculateRoboScore(breakdown); } catch { /* ignore */ }

  const pros = prosText.split("\n").map((p) => p.trim()).filter(Boolean);
  const cons = consText.split("\n").map((c) => c.trim()).filter(Boolean);

  async function handleSubmit() {
    if (!robotId) { setError("Select a robot"); return; }
    if (!title.trim()) { setError("Title is required"); return; }
    if (!body.trim()) { setError("Review body is required"); return; }

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robot_id: robotId,
          title: title.trim(),
          body: body.trim(),
          verdict: verdict.trim() || null,
          pros,
          cons,
          robo_score: finalScore,
          score_breakdown: breakdown,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to publish review");
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
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold" style={{ color: "var(--status-success-text, #6B8AB8)" }}>Review Published!</h1>
        <p className="mt-3 text-muted">The expert review has been saved and published.</p>
        <Button className="mt-6" onClick={() => { setStatus("idle"); setTitle(""); setBody(""); }}>
          Write Another
        </Button>
      </div>
    );
  }

  if (preview) {
    const selectedRobot = robots.find((r) => r.id === robotId);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Preview</h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPreview(false)}>Back to Edit</Button>
            <Button onClick={handleSubmit} disabled={status === "submitting"}>
              {status === "submitting" ? "Publishing..." : "Publish Review"}
            </Button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-orange">{error}</p>}

        <div className="rounded-xl border border-white/20 bg-navy-light p-6">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-6">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-white">Expert Review</span>
            <span className="ml-auto text-xs text-muted">{selectedRobot?.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <RoboScoreRing score={finalScore} size={90} />
          </div>

          <div className="prose prose-invert mt-4 max-w-none text-sm text-muted">
            {body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="mt-6 max-w-lg space-y-3">
            {DIMENSIONS.map((dim) => (
              <ScoreBar key={dim.key} label={dim.label} score={breakdown[dim.key]} weight={`${Math.round(dim.weight * 100)}%`} />
            ))}
          </div>

          <div className="mt-6">
            <ProsConsList pros={pros} cons={cons} />
          </div>

          {verdict && (
            <div className="mt-6 rounded-lg border border-white/20 bg-white/5 p-4">
              <h4 className="mb-1 text-sm font-semibold text-white">Verdict</h4>
              <p className="text-sm text-muted">{verdict}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">New Expert Review</h1>

      {/* Robot selector */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Robot *</label>
        <select
          value={robotId}
          onChange={(e) => setRobotId(e.target.value)}
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none"
        >
          <option value="">Select a robot...</option>
          {robots.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Review Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. UR5e Review: The Cobot That Changed Manufacturing"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Score inputs */}
      <div className="mb-6">
        <label className="mb-4 block text-xs font-semibold uppercase tracking-wider text-muted">
          Dimension Scores (0–100)
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-xs text-muted">{dim.label}</label>
              <input
                type="range"
                min={0} max={100} step={1}
                value={scores[dim.key]}
                onChange={(e) => setScores({ ...scores, [dim.key]: parseInt(e.target.value) })}
                className="flex-1 accent-white"
              />
              <input
                type="number"
                min={0} max={100}
                value={scores[dim.key]}
                onChange={(e) => setScores({ ...scores, [dim.key]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                className="w-14 rounded border border-border bg-navy-lighter px-2 py-1 text-center font-mono text-xs text-foreground focus:border-white/50 focus:outline-none"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-navy-lighter p-3">
          <span className="text-sm font-semibold">Calculated RoboScore:</span>
          <span className="font-mono text-lg font-bold text-white">{finalScore.toFixed(1)}</span>
        </div>
      </div>

      {/* Body */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Review Body *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          placeholder="Write the full expert review..."
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Pros */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Pros (one per line)</label>
        <textarea
          value={prosText}
          onChange={(e) => setProsText(e.target.value)}
          rows={4}
          placeholder="Industry-leading ease of use&#10;Excellent force sensing&#10;Huge ecosystem of accessories"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Cons */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Cons (one per line)</label>
        <textarea
          value={consText}
          onChange={(e) => setConsText(e.target.value)}
          rows={4}
          placeholder="Limited to 5kg payload&#10;No IP67 rating"
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {/* Verdict */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Verdict</label>
        <textarea
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          rows={3}
          placeholder="One-paragraph summary verdict..."
          className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-white/50 focus:outline-none"
        />
      </div>

      {error && <p className="mb-4 text-sm text-orange">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setPreview(true)}>
          Preview
        </Button>
        <Button onClick={handleSubmit} disabled={status === "submitting"}>
          {status === "submitting" ? "Publishing..." : "Publish Review"}
        </Button>
      </div>
    </div>
  );
}
