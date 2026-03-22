import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Robots",
  description:
    "Browse and compare robots across categories. Filter by use case, price, and RoboScore.",
};

export default function RobotsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Explore Robots</h1>
      <p className="mt-2 text-muted">
        Browse and compare robots across every category.
      </p>
    </div>
  );
}
