import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "In-depth robot reviews with transparent RoboScore ratings across 8 dimensions.",
};

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Reviews</h1>
      <p className="mt-2 text-muted">
        In-depth reviews with transparent RoboScore ratings.
      </p>
    </div>
  );
}
