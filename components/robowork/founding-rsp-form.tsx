"use client";

import { useState } from "react";

const ROBOT_CATEGORIES = [
  "warehouse",
  "medical",
  "manufacturing",
  "agricultural",
  "security",
  "hospitality",
  "construction",
  "eldercare",
  "consumer",
  "drone",
] as const;

type RobotCategory = (typeof ROBOT_CATEGORIES)[number];

export function FoundingRspForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("");
  const [robotTypes, setRobotTypes] = useState<RobotCategory[]>([]);
  const [fleetSize, setFleetSize] = useState("");
  const [motivation, setMotivation] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleCategory(cat: RobotCategory) {
    setRobotTypes((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (robotTypes.length === 0) {
      setError("Please select at least one robot type.");
      return;
    }

    if (motivation.length < 200) {
      setError("Your motivation must be at least 200 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/robowork/founding-rsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          city,
          robot_types: robotTypes,
          fleet_size: fleetSize ? Number(fleetSize) : null,
          motivation,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit application");
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
      <div className="rounded-lg border border-lime/20 bg-lime/5 p-8 text-center">
        <div className="mb-3 text-4xl text-lime">&#10003;</div>
        <h3 className="text-lg font-bold text-text-primary">
          Application received!
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          We review within 48 hours. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--theme-input-bg)",
    borderColor: "var(--theme-input-border)",
    color: "var(--theme-text-primary)",
  };

  const inputClass =
    "w-full rounded border px-3 py-2.5 text-sm outline-none transition-colors focus:border-electric-blue placeholder:text-text-tertiary";

  const labelClass =
    "mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-text-ghost";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-border bg-obsidian-surface p-6"
    >
      <h3 className="mb-6 text-lg font-bold text-text-primary">
        Apply to Become a Founding RSP
      </h3>

      {error && (
        <div className="mb-4 rounded border border-magenta/20 bg-magenta/5 px-4 py-2 text-sm text-magenta">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label className={labelClass}>Full Name *</label>
        <input
          type="text"
          required
          className={inputClass}
          style={inputStyle}
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className={labelClass}>Email *</label>
        <input
          type="email"
          required
          className={inputClass}
          style={inputStyle}
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Company */}
      <div className="mb-4">
        <label className={labelClass}>Company *</label>
        <input
          type="text"
          required
          className={inputClass}
          style={inputStyle}
          placeholder="RoboCo Inc."
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* City */}
      <div className="mb-4">
        <label className={labelClass}>City *</label>
        <input
          type="text"
          required
          className={inputClass}
          style={inputStyle}
          placeholder="Austin, TX"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Robot Types */}
      <div className="mb-4">
        <label className={labelClass}>Robot Types *</label>
        <div className="flex flex-wrap gap-2">
          {ROBOT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                robotTypes.includes(cat)
                  ? "border-electric-blue bg-electric-blue/10 text-electric-blue"
                  : "border-border text-text-secondary hover:border-text-tertiary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Size */}
      <div className="mb-4">
        <label className={labelClass}>Fleet Size</label>
        <input
          type="number"
          min={1}
          className={inputClass}
          style={inputStyle}
          placeholder="Number of robots"
          value={fleetSize}
          onChange={(e) => setFleetSize(e.target.value)}
        />
      </div>

      {/* Motivation */}
      <div className="mb-6">
        <label className={labelClass}>
          Why do you want to be a founding RSP? *
        </label>
        <textarea
          required
          rows={5}
          className={inputClass}
          style={inputStyle}
          placeholder="Minimum 200 characters"
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
        />
        <p className="mt-1 text-right font-mono text-[10px] text-text-tertiary">
          {motivation.length}/200 min
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded px-6 py-3 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#2563EB", color: "#000" }}
      >
        {submitting ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
