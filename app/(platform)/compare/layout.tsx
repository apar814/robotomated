import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Robots Side-by-Side",
  description: "Compare robot specs, RoboScores, pricing, and features side by side. Make informed decisions with transparent data on every robot in our database.",
  alternates: { canonical: "/compare" },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
