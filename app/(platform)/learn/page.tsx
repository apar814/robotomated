import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Educational content about robotics — guides, tutorials, and industry insights.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Learn</h1>
      <p className="mt-2 text-muted">
        Guides, tutorials, and insights for the robotics era.
      </p>
    </div>
  );
}
