import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy and sell robots from verified dealers and manufacturers.",
};

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <p className="mt-2 text-muted">
        Buy and sell robots from verified dealers.
      </p>
    </div>
  );
}
