import type { Metadata } from "next";
import { FindMyRobotWizard } from "@/components/find-my-robot/wizard";

export const metadata: Metadata = {
  title: "Find Your Robot — Personalized Recommendations",
  description:
    "Answer 5 quick questions and get personalized robot recommendations based on your industry, budget, and requirements.",
};

export default function FindMyRobotPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--theme-bg)" }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="mb-6 text-center font-[family-name:var(--font-brand)] text-[13px] font-medium uppercase tracking-[0.15em] text-white/60">
          [ ROBOT FINDER ]
        </p>
        <FindMyRobotWizard />
      </div>
    </div>
  );
}
