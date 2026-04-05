"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { TaskCard } from "@/components/find-my-robot/task-card";

/* ────────────────────────────────────────────
   Types
   ──────────────────────────────────────────── */

interface WizardState {
  problem: string;
  industry: string;
  facilitySize: string;
  workers: string;
  urgency: string;
  priorities: string[];
  budget: string;
}

interface Recommendation {
  name: string;
  category: string;
  priceRange: string;
  whyMatch: string;
  score: number;
}

const INITIAL_STATE: WizardState = {
  problem: "",
  industry: "",
  facilitySize: "",
  workers: "",
  urgency: "",
  priorities: [],
  budget: "",
};

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

const PROBLEMS = [
  { id: "material-transport", label: "Move materials around a facility", icon: "MT" },
  { id: "pick-pack", label: "Pick and pack orders", icon: "PP" },
  { id: "cleaning", label: "Clean floors or surfaces", icon: "CL" },
  { id: "inspection", label: "Inspect equipment or inventory", icon: "IN" },
  { id: "security", label: "Secure a facility", icon: "SC" },
  { id: "service", label: "Serve customers or patients", icon: "SV" },
  { id: "agriculture", label: "Harvest or process crops", icon: "AG" },
  { id: "manufacturing", label: "Weld, paint, or assemble", icon: "WA" },
  { id: "delivery", label: "Deliver items within a building", icon: "DL" },
  { id: "other", label: "Something else", icon: "OT" },
];

const INDUSTRIES = [
  "Warehouse",
  "Manufacturing",
  "Construction",
  "Agriculture",
  "Healthcare",
  "Hospitality",
  "Security",
  "Retail",
  "Food & Beverage",
  "Other",
];

const FACILITY_SIZES = [
  { value: "small", label: "< 5K sqft" },
  { value: "medium", label: "5 - 25K sqft" },
  { value: "large", label: "25 - 100K sqft" },
  { value: "xlarge", label: "100K+ sqft" },
];

const WORKER_COUNTS = [
  { value: "1-10", label: "1 - 10" },
  { value: "10-50", label: "10 - 50" },
  { value: "50-200", label: "50 - 200" },
  { value: "200+", label: "200+" },
];

const URGENCY_OPTIONS = [
  { value: "exploring", label: "Exploring options" },
  { value: "quarter", label: "Planning this quarter" },
  { value: "asap", label: "Need ASAP" },
];

const PRIORITY_OPTIONS = [
  "Low upfront cost",
  "Fast ROI",
  "Easy to operate",
  "Minimal maintenance",
  "Works with existing systems",
];

const BUDGET_OPTIONS = [
  { value: "under-25k", label: "Under $25K", subtitle: "Starter" },
  { value: "25k-100k", label: "$25K - $100K", subtitle: "Growth" },
  { value: "100k-500k", label: "$100K - $500K", subtitle: "Scale" },
  { value: "500k-plus", label: "$500K+", subtitle: "Enterprise" },
  { value: "unsure", label: "Not sure yet", subtitle: "Show me options" },
];

/* ────────────────────────────────────────────
   Mock recommendation engine
   ──────────────────────────────────────────── */

function generateRecommendations(state: WizardState): Recommendation[] {
  const recs: Recommendation[] = [];

  const problemMap: Record<string, Recommendation[]> = {
    "material-transport": [
      { name: "Locus Origin", category: "AMR", priceRange: "$25K - $35K", whyMatch: "Purpose-built for warehouse material transport with collaborative navigation", score: 87 },
      { name: "MiR250", category: "AMR", priceRange: "$30K - $50K", whyMatch: "Versatile mobile robot with strong payload capacity for facility logistics", score: 85 },
      { name: "Fetch Freight 1500", category: "AMR", priceRange: "$40K - $60K", whyMatch: "Heavy-duty transport robot with 1500kg payload for industrial environments", score: 82 },
      { name: "AutoGuide MAX-N", category: "AGV", priceRange: "$50K - $80K", whyMatch: "Flexible navigation system that adapts to changing facility layouts", score: 79 },
    ],
    "pick-pack": [
      { name: "Berkshire Grey Robotic Pick", category: "Picking Robot", priceRange: "$100K - $250K", whyMatch: "AI-powered piece-picking with high accuracy for order fulfillment", score: 88 },
      { name: "RightHand RightPick", category: "Picking Robot", priceRange: "$80K - $150K", whyMatch: "Machine learning-driven piece picking optimized for e-commerce", score: 85 },
      { name: "Covariant Brain", category: "AI Picking", priceRange: "$150K - $300K", whyMatch: "Neural network vision system that handles unknown items with high accuracy", score: 83 },
    ],
    "cleaning": [
      { name: "Brain Corp BrainOS Fleet", category: "Cleaning Robot", priceRange: "$15K - $30K", whyMatch: "Autonomous floor cleaning with cloud fleet management and analytics", score: 90 },
      { name: "Avidbots Neo 2", category: "Cleaning Robot", priceRange: "$40K - $60K", whyMatch: "Full-size autonomous scrubber for large commercial spaces", score: 86 },
      { name: "Whiz by SoftBank", category: "Cleaning Robot", priceRange: "$10K - $20K", whyMatch: "Compact vacuum robot ideal for offices and smaller facilities", score: 82 },
    ],
    "inspection": [
      { name: "Spot by Boston Dynamics", category: "Inspection Robot", priceRange: "$75K - $150K", whyMatch: "Quadruped robot with thermal and visual inspection capabilities", score: 91 },
      { name: "ANYmal C", category: "Inspection Robot", priceRange: "$100K - $200K", whyMatch: "Ruggedized inspection robot for hazardous and industrial environments", score: 87 },
      { name: "ExRobotics ExR-2", category: "Inspection Robot", priceRange: "$80K - $120K", whyMatch: "Explosion-proof inspection robot for oil and gas facilities", score: 84 },
    ],
    "security": [
      { name: "Knightscope K5", category: "Security Robot", priceRange: "$5K - $10K/mo", whyMatch: "Autonomous security patrol with 360-degree cameras and anomaly detection", score: 83 },
      { name: "Cobalt Robotics", category: "Security Robot", priceRange: "$6K - $12K/mo", whyMatch: "Indoor security robot with human-in-the-loop monitoring service", score: 81 },
      { name: "Ascento Guard", category: "Security Robot", priceRange: "$4K - $8K/mo", whyMatch: "Bi-pedal wheeled robot for outdoor perimeter security patrols", score: 78 },
    ],
    "service": [
      { name: "Bear Robotics Servi Plus", category: "Service Robot", priceRange: "$15K - $25K", whyMatch: "Restaurant and hospitality delivery robot with multi-tray design", score: 85 },
      { name: "Relay by Savioke", category: "Service Robot", priceRange: "$20K - $35K", whyMatch: "Hotel delivery robot with elevator integration and guest interaction", score: 83 },
      { name: "Pudu BellaBot", category: "Service Robot", priceRange: "$12K - $20K", whyMatch: "Interactive service robot with cat-like design for customer-facing environments", score: 80 },
    ],
    "agriculture": [
      { name: "Aigen Element", category: "Agricultural Robot", priceRange: "$50K - $100K", whyMatch: "Solar-powered weeding robot that eliminates need for herbicides", score: 86 },
      { name: "Harvest CROO", category: "Agricultural Robot", priceRange: "$200K - $400K", whyMatch: "Autonomous strawberry harvester with gentle pick technology", score: 83 },
      { name: "FarmWise Titan", category: "Agricultural Robot", priceRange: "$100K - $200K", whyMatch: "Precision weeding and crop care robot with computer vision", score: 81 },
    ],
    "manufacturing": [
      { name: "Universal Robots UR10e", category: "Cobot", priceRange: "$35K - $50K", whyMatch: "Collaborative robot arm ideal for welding, painting, and assembly tasks", score: 89 },
      { name: "FANUC CRX-10iA", category: "Cobot", priceRange: "$40K - $55K", whyMatch: "Easy-to-program cobot with drag-and-drop teaching for manufacturing", score: 87 },
      { name: "Doosan M1013", category: "Cobot", priceRange: "$30K - $45K", whyMatch: "6-axis cobot with intuitive programming and strong safety features", score: 84 },
      { name: "ABB GoFa CRB 15000", category: "Cobot", priceRange: "$45K - $65K", whyMatch: "High-precision collaborative robot for assembly and material handling", score: 82 },
    ],
    "delivery": [
      { name: "TUG T3 by Aethon", category: "Delivery Robot", priceRange: "$40K - $70K", whyMatch: "Hospital and facility delivery robot with autonomous elevator operation", score: 86 },
      { name: "Pudu FlashBot", category: "Delivery Robot", priceRange: "$15K - $25K", whyMatch: "Multi-floor delivery robot with large cabin for diverse payloads", score: 83 },
      { name: "Ottonomy Ottobot", category: "Delivery Robot", priceRange: "$20K - $35K", whyMatch: "Indoor delivery robot with UV-C sanitization for healthcare settings", score: 80 },
    ],
    "other": [
      { name: "Universal Robots UR5e", category: "Cobot", priceRange: "$25K - $35K", whyMatch: "Versatile collaborative robot arm suitable for a wide range of automation tasks", score: 88 },
      { name: "MiR250", category: "AMR", priceRange: "$30K - $50K", whyMatch: "Flexible mobile robot platform that adapts to many use cases", score: 85 },
      { name: "Spot by Boston Dynamics", category: "Inspection Robot", priceRange: "$75K - $150K", whyMatch: "Multi-purpose quadruped for inspection, data collection, and more", score: 84 },
    ],
  };

  const base = problemMap[state.problem] || problemMap["other"];
  recs.push(...base);

  // Filter by budget if specific
  if (state.budget && state.budget !== "unsure") {
    const budgetMax: Record<string, number> = {
      "under-25k": 25000,
      "25k-100k": 100000,
      "100k-500k": 500000,
      "500k-plus": Infinity,
    };
    const max = budgetMax[state.budget] ?? Infinity;

    // Boost score for budget-appropriate options
    for (const rec of recs) {
      const priceMatch = rec.priceRange.match(/\$(\d+)K/);
      if (priceMatch) {
        const approxPrice = parseInt(priceMatch[1]) * 1000;
        if (approxPrice <= max) {
          rec.score = Math.min(100, rec.score + 3);
        }
      }
    }
  }

  // Sort by score descending, return top 4
  return recs.sort((a, b) => b.score - a.score).slice(0, 4);
}

/* ────────────────────────────────────────────
   Progress Bar
   ──────────────────────────────────────────── */

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-text-muted">
          Step {step} of {total}
        </span>
        <span className="font-mono text-xs text-text-muted">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] transition-all duration-500 ease-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-mono transition-colors duration-300 ${
                i + 1 < step
                  ? "border-[#00E5A0] bg-[#00E5A0]/10 text-[#00E5A0]"
                  : i + 1 === step
                  ? "border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]"
                  : "border-white/10 text-white/20"
              }`}
            >
              {i + 1 < step ? "\u2713" : i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Step Components
   ──────────────────────────────────────────── */

function StepProblem({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold font-display text-white sm:text-3xl">
        What problem are you trying to solve?
      </h2>
      <p className="mb-8 text-sm text-text-muted">
        Select the task you need automated. This helps us narrow the right category.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p) => (
          <TaskCard
            key={p.id}
            taskKey={p.id}
            selected={value === p.id}
            onSelect={() => onChange(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function StepOperation({
  state,
  onChange,
}: {
  state: WizardState;
  onChange: (key: keyof WizardState, value: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold font-display text-white sm:text-3xl">
        Tell us about your operation
      </h2>
      <p className="mb-8 text-sm text-text-muted">
        These details help us match robots to your specific environment.
      </p>
      <div className="space-y-6">
        {/* Industry */}
        <div>
          <label className="mb-2 block text-sm font-medium text-white/70">
            Industry
          </label>
          <select
            value={state.industry}
            onChange={(e) => onChange("industry", e.target.value)}
            className="glass w-full rounded-lg border-white/10 bg-[#0C0C0C] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#00C2FF] focus:ring-1 focus:ring-[#00C2FF]/30"
          >
            <option value="">Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        {/* Facility Size */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Facility size
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FACILITY_SIZES.map((fs) => (
              <button
                key={fs.value}
                onClick={() => onChange("facilitySize", fs.value)}
                className={`glass rounded-lg px-3 py-2.5 text-center text-sm transition-all duration-200 ${
                  state.facilitySize === fs.value
                    ? "!border-[#00C2FF] !bg-[#00C2FF]/5 text-[#00C2FF]"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workers */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            Number of workers
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WORKER_COUNTS.map((wc) => (
              <button
                key={wc.value}
                onClick={() => onChange("workers", wc.value)}
                className={`glass rounded-lg px-3 py-2.5 text-center text-sm transition-all duration-200 ${
                  state.workers === wc.value
                    ? "!border-[#00C2FF] !bg-[#00C2FF]/5 text-[#00C2FF]"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {wc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            How urgent is this?
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {URGENCY_OPTIONS.map((urg) => (
              <button
                key={urg.value}
                onClick={() => onChange("urgency", urg.value)}
                className={`glass rounded-lg px-4 py-3 text-center text-sm transition-all duration-200 ${
                  state.urgency === urg.value
                    ? "!border-[#00C2FF] !bg-[#00C2FF]/5 text-[#00C2FF]"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {urg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPriorities({
  priorities,
  onChange,
}: {
  priorities: string[];
  onChange: (priorities: string[]) => void;
}) {
  const handleToggle = useCallback(
    (priority: string) => {
      if (priorities.includes(priority)) {
        onChange(priorities.filter((p) => p !== priority));
      } else if (priorities.length < 5) {
        onChange([...priorities, priority]);
      }
    },
    [priorities, onChange]
  );

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold font-display text-white sm:text-3xl">
        What matters most to you?
      </h2>
      <p className="mb-8 text-sm text-text-muted">
        Click in order of importance (1 = most important). Click again to remove.
      </p>
      <div className="space-y-3">
        {PRIORITY_OPTIONS.map((priority) => {
          const rank = priorities.indexOf(priority);
          const isSelected = rank !== -1;
          return (
            <button
              key={priority}
              onClick={() => handleToggle(priority)}
              className={`glass glass-hover flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition-all duration-200 ${
                isSelected
                  ? "!border-[#7B2FFF] !bg-[#7B2FFF]/5 ring-1 ring-[#7B2FFF]/30"
                  : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold font-mono transition-colors ${
                  isSelected
                    ? "border-[#7B2FFF] bg-[#7B2FFF]/20 text-[#7B2FFF]"
                    : "border-white/10 text-white/20"
                }`}
              >
                {isSelected ? rank + 1 : "-"}
              </div>
              <span
                className={`text-sm ${
                  isSelected ? "text-white" : "text-white/60"
                }`}
              >
                {priority}
              </span>
            </button>
          );
        })}
      </div>
      {priorities.length > 0 && (
        <p className="mt-4 text-center font-mono text-xs text-text-muted">
          {priorities.length} of 5 ranked
        </p>
      )}
    </div>
  );
}

function StepBudget({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold font-display text-white sm:text-3xl">
        What is your investment range?
      </h2>
      <p className="mb-8 text-sm text-text-muted">
        This helps us recommend robots that fit your budget.
      </p>
      <div className="space-y-3">
        {BUDGET_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`glass glass-hover flex w-full items-center justify-between rounded-xl px-6 py-5 text-left transition-all duration-200 ${
              value === opt.value
                ? "!border-[#00E5A0] !bg-[#00E5A0]/5 ring-1 ring-[#00E5A0]/30"
                : ""
            }`}
          >
            <span
              className={`text-lg font-semibold ${
                value === opt.value ? "text-white" : "text-white/80"
              }`}
            >
              {opt.label}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-mono ${
                value === opt.value
                  ? "bg-[#00E5A0]/10 text-[#00E5A0]"
                  : "bg-white/5 text-white/40"
              }`}
            >
              {opt.subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepResults({
  state,
  recommendations,
}: {
  state: WizardState;
  recommendations: Recommendation[];
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    try {
      await fetch("/api/find-my-robot/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          wizardState: state,
          recommendations: recommendations.slice(0, 4),
        }),
      });
    } catch {
      // Still show success — email is best-effort
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold font-display text-white sm:text-3xl">
        Your top matches
      </h2>
      <p className="mb-8 text-sm text-text-muted">
        Based on your requirements, here are the robots we recommend.
      </p>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div
            key={rec.name}
            className="glass rounded-xl p-5 transition-all duration-200 hover:border-white/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C2FF]/10 font-mono text-xs font-bold text-[#00C2FF]">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    {rec.name}
                  </h3>
                </div>
                <div className="mb-2 ml-9 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-xs text-white/50">
                    {rec.category}
                  </span>
                  <span className="font-mono text-xs text-[#00E5A0]">
                    {rec.priceRange}
                  </span>
                </div>
                <p className="ml-9 text-sm leading-relaxed text-white/60">
                  {rec.whyMatch}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#7B2FFF]/10">
                  <span className="font-mono text-lg font-bold text-[#7B2FFF]">
                    {rec.score}
                  </span>
                </div>
                <span className="mt-1 font-mono text-[10px] text-white/30">
                  MATCH
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="mt-10 space-y-4">
        {/* Email report */}
        <div className="glass rounded-xl p-6">
          <h3 className="mb-1 text-sm font-semibold text-white">
            Get my personalized report
          </h3>
          <p className="mb-4 text-xs text-text-muted">
            We will send a detailed comparison with ROI analysis to your inbox.
          </p>
          {submitted ? (
            <div className="rounded-lg bg-[#00E5A0]/10 px-4 py-3 text-center">
              <p className="text-sm font-medium text-[#00E5A0]">
                Report requested. Check your inbox shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="glass flex-1 rounded-lg bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#00C2FF]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-[#00C2FF] px-5 py-2.5 text-sm font-semibold text-[#0A0F1E] transition-opacity hover:opacity-90"
              >
                Send report
              </button>
            </form>
          )}
        </div>

        {/* Robotimus */}
        <Link
          href="/advisor"
          className="glass glass-hover flex items-center justify-between rounded-xl px-6 py-4 transition-all duration-200"
        >
          <div>
            <h3 className="text-sm font-semibold text-white">
              Ask Robotimus about these options
            </h3>
            <p className="text-xs text-text-muted">
              Get instant answers about specs, integration, and deployment.
            </p>
          </div>
          <span className="ml-4 shrink-0 text-[#7B2FFF]">&rarr;</span>
        </Link>

        {/* RoboWork */}
        <Link
          href="/robowork"
          className="glass glass-hover flex items-center justify-between rounded-xl border-dashed px-6 py-4 transition-all duration-200"
        >
          <div>
            <h3 className="text-sm font-semibold text-white">
              Not ready to buy? Hire a robot for 30 days instead.
            </h3>
            <p className="text-xs text-text-muted">
              RoboWork lets you try before you commit.
            </p>
          </div>
          <span className="ml-4 shrink-0 rounded-full bg-[#00E5A0]/10 px-3 py-1 font-mono text-xs text-[#00E5A0]">
            RoboWork
          </span>
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Loading Animation
   ──────────────────────────────────────────── */

function AnalyzingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6 h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#00C2FF]/20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-[#7B2FFF]/30" />
        <div className="absolute inset-4 rounded-full bg-[#00C2FF]/40" />
      </div>
      <h3 className="mb-2 font-display text-lg font-semibold text-white">
        Analyzing your requirements...
      </h3>
      <p className="text-sm text-text-muted">
        Matching against our robot database
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main Wizard
   ──────────────────────────────────────────── */

export function FindMyRobotWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const TOTAL_STEPS = 5;

  const updateField = useCallback(
    (key: keyof WizardState, value: string) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updatePriorities = useCallback((priorities: string[]) => {
    setState((prev) => ({ ...prev, priorities }));
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return !!state.problem;
      case 2:
        return !!state.industry && !!state.facilitySize && !!state.workers && !!state.urgency;
      case 3:
        return state.priorities.length >= 1;
      case 4:
        return !!state.budget;
      default:
        return false;
    }
  }, [step, state]);

  const handleNext = useCallback(() => {
    if (!canProceed()) return;

    if (step === 4) {
      // Show loading, then results
      setStep(5);
      setLoading(true);
      setTimeout(() => {
        const recs = generateRecommendations(state);
        setRecommendations(recs);
        setLoading(false);
      }, 1800);
    } else {
      setStep((s) => s + 1);
    }
  }, [step, state, canProceed]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  // Auto-advance on selection for step 1
  useEffect(() => {
    if (step === 1 && state.problem) {
      const timer = setTimeout(() => setStep(2), 300);
      return () => clearTimeout(timer);
    }
  }, [step, state.problem]);

  // Auto-advance on budget selection for step 4
  useEffect(() => {
    if (step === 4 && state.budget) {
      const timer = setTimeout(() => {
        setStep(5);
        setLoading(true);
        setTimeout(() => {
          const recs = generateRecommendations(state);
          setRecommendations(recs);
          setLoading(false);
        }, 1800);
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.budget]);

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-display text-white sm:text-4xl">
          Find Your Robot
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          5 questions. Personalized recommendations. No signup required.
        </p>
      </div>

      {/* Progress */}
      <ProgressBar step={step} total={TOTAL_STEPS} />

      {/* Step Content */}
      <div className="transition-opacity duration-300">
        {step === 1 && (
          <StepProblem
            value={state.problem}
            onChange={(v) => updateField("problem", v)}
          />
        )}
        {step === 2 && (
          <StepOperation state={state} onChange={updateField} />
        )}
        {step === 3 && (
          <StepPriorities
            priorities={state.priorities}
            onChange={updatePriorities}
          />
        )}
        {step === 4 && (
          <StepBudget
            value={state.budget}
            onChange={(v) => updateField("budget", v)}
          />
        )}
        {step === 5 && loading && <AnalyzingLoader />}
        {step === 5 && !loading && recommendations.length > 0 && (
          <StepResults state={state} recommendations={recommendations} />
        )}
      </div>

      {/* Navigation */}
      {step < 5 && (
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              step === 1
                ? "cursor-not-allowed text-white/10"
                : "text-white/50 hover:text-white"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200 ${
              canProceed()
                ? "bg-[#00C2FF] text-[#0A0F1E] hover:opacity-90"
                : "cursor-not-allowed bg-white/5 text-white/20"
            }`}
          >
            {step === 4 ? "See my matches" : "Continue"}
          </button>
        </div>
      )}

      {/* Restart on results */}
      {step === 5 && !loading && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setState(INITIAL_STATE);
              setStep(1);
              setRecommendations([]);
            }}
            className="text-sm text-white/30 transition-colors hover:text-white/60"
          >
            Start over
          </button>
        </div>
      )}
    </div>
  );
}
