"use client";

import { useState } from "react";
import Link from "next/link";
import { RoboScoreBadge } from "@/components/ui/robo-score";

interface Step {
  question: string;
  key: string;
  options: { value: string; label: string; icon?: string }[];
}

const STEPS: Step[] = [
  {
    question: "What industry are you in?",
    key: "industry",
    options: [
      { value: "warehouse", label: "Warehouse & Logistics" },
      { value: "manufacturing", label: "Manufacturing" },
      { value: "construction", label: "Construction" },
      { value: "medical", label: "Healthcare / Medical" },
      { value: "agricultural", label: "Agriculture" },
      { value: "consumer", label: "Home / Consumer" },
      { value: "delivery", label: "Delivery / Last-Mile" },
      { value: "drone", label: "Drones & Aerial" },
    ],
  },
  {
    question: "What's the primary use case?",
    key: "useCase",
    options: [
      { value: "picking", label: "Picking & Sorting" },
      { value: "transport", label: "Material Transport" },
      { value: "inspection", label: "Inspection & Monitoring" },
      { value: "assembly", label: "Assembly & Manufacturing" },
      { value: "cleaning", label: "Cleaning & Maintenance" },
      { value: "surgery", label: "Surgery / Rehabilitation" },
      { value: "delivery", label: "Delivery" },
      { value: "general", label: "General Automation" },
    ],
  },
  {
    question: "What's your budget?",
    key: "budget",
    options: [
      { value: "under5k", label: "Under $5,000" },
      { value: "5k-25k", label: "$5,000 - $25,000" },
      { value: "25k-100k", label: "$25,000 - $100,000" },
      { value: "100k-500k", label: "$100,000 - $500,000" },
      { value: "500k-plus", label: "$500,000+" },
      { value: "raas", label: "Prefer monthly / RaaS" },
    ],
  },
  {
    question: "How important is ease of use?",
    key: "easeOfUse",
    options: [
      { value: "critical", label: "Critical — no robotics team" },
      { value: "important", label: "Important — limited tech staff" },
      { value: "moderate", label: "Moderate — have some expertise" },
      { value: "less", label: "Less important — we have engineers" },
    ],
  },
  {
    question: "What's your deployment timeline?",
    key: "timeline",
    options: [
      { value: "asap", label: "ASAP — need it now" },
      { value: "quarter", label: "This quarter" },
      { value: "6months", label: "Within 6 months" },
      { value: "researching", label: "Just researching" },
    ],
  },
];

interface RobotResult {
  slug: string;
  name: string;
  category: string;
  score: number | null;
  price: number | null;
  description: string | null;
  reason: string;
}

export function RobotFinderQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<RobotResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  function selectAnswer(key: string, value: string) {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      fetchResults(updated);
    }
  }

  async function fetchResults(ans: Record<string, string>) {
    setLoading(true);
    try {
      const res = await fetch("/api/tools/robot-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ans),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults(null);
  }

  // Results view
  if (results !== null) {
    return (
      <div>
        <h2 className="text-center text-xl font-bold">Your Top Robot Recommendations</h2>
        <p className="mt-2 text-center text-sm text-muted">Based on your answers: {STEPS.map(s => answers[s.key]).filter(Boolean).join(" → ")}</p>

        {results.length === 0 && (
          <p className="mt-8 text-center text-muted">No robots found matching your criteria. Try broadening your search.</p>
        )}

        <div className="mt-8 space-y-4">
          {results.map((robot, i) => (
            <Link
              key={robot.slug}
              href={`/explore/${robot.category}/${robot.slug}`}
              className="group block rounded-xl border border-border bg-navy-light p-6 transition-all hover:border-blue/30 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-blue">#{i + 1} Recommendation</span>
                  <h3 className="mt-1 text-lg font-bold transition-colors group-hover:text-blue">{robot.name}</h3>
                  <p className="mt-1 text-sm text-muted">{robot.description}</p>
                  <p className="mt-2 text-xs text-blue/80">{robot.reason}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {robot.score != null && <RoboScoreBadge score={robot.score} />}
                  {robot.price != null ? (
                    <span className="font-mono text-sm font-bold text-green">${robot.price.toLocaleString()}</span>
                  ) : (
                    <span className="text-xs text-orange">Contact</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={restart} className="text-sm text-muted hover:text-foreground">
            Start over
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue border-t-transparent" />
        <p className="mt-4 text-sm text-muted">Finding your perfect robots...</p>
      </div>
    );
  }

  // Quiz steps
  const currentStep = STEPS[step];
  const progress = ((step) / STEPS.length) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-8 h-1.5 rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-gradient-to-r from-blue to-violet transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <p className="mb-2 text-xs text-muted">Question {step + 1} of {STEPS.length}</p>
      <h2 className="text-xl font-bold">{currentStep.question}</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {currentStep.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => selectAnswer(currentStep.key, opt.value)}
            className="rounded-xl border border-border bg-navy-light px-5 py-4 text-left text-sm font-medium transition-all hover:border-blue/40 hover:bg-navy-lighter"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(step - 1)} className="mt-4 text-xs text-muted hover:text-foreground">
          ← Back
        </button>
      )}
    </div>
  );
}
