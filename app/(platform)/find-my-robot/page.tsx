import type { Metadata } from "next";
import { FindMyRobotWizard } from "@/components/find-my-robot/wizard";

export const metadata: Metadata = {
  title: "Find Your Robot — Personalized Recommendations",
  description:
    "Answer 5 quick questions and get personalized robot recommendations based on your industry, budget, and requirements.",
};

export default function FindMyRobotPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <FindMyRobotWizard />
    </div>
  );
}
