import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Advisor",
  description:
    "Describe your needs and get AI-powered robot recommendations instantly.",
};

export default function AdvisorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">AI Advisor</h1>
      <p className="mt-2 text-muted">
        Describe your needs — get matched to the right robot.
      </p>
    </div>
  );
}
