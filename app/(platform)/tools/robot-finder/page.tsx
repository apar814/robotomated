import type { Metadata } from "next";
import { RobotFinderQuiz } from "@/components/tools/robot-finder-quiz";

export const metadata: Metadata = {
  title: "Robot Finder — Match Your Use Case | Robotomated",
  description:
    "Answer 7 questions and get personalized robot recommendations with ROI analysis. Match your industry, use case, budget, and technical requirements to the right robot.",
};

export default function RobotFinderPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Robot Finder — Match Your Use Case
        </h1>
        <p className="mt-3 font-mono text-sm text-text-tertiary">
          Answer 7 questions. Get your top matches with ROI analysis.
        </p>
      </div>
      <RobotFinderQuiz />
    </div>
  );
}
