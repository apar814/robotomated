import type { Metadata } from "next";
import { RobotFinderQuiz } from "@/components/tools/robot-finder-quiz";

export const metadata: Metadata = {
  title: "Robot Finder Quiz — Find Your Perfect Robot in 60 Seconds",
  description: "Answer 5 questions and get personalized robot recommendations based on your industry, use case, budget, and requirements. Powered by real robot data.",
};

export default function RobotFinderPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Find Your Perfect Robot</h1>
        <p className="mt-3 text-muted">Answer 5 quick questions. Get 3 personalized recommendations.</p>
      </div>
      <RobotFinderQuiz />
    </div>
  );
}
