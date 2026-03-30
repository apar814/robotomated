import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robotomated — The Robotics Intelligence Platform",
  description: "Find, compare, and understand robots. Independent reviews, transparent RoboScores, and AI-powered recommendations for warehouse, medical, manufacturing, and every industry.",
  alternates: { canonical: "/" },
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
