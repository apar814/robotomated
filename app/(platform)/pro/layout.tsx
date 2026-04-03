import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robotomated Pro — Unlimited Robotics Intelligence",
  description: "Unlock unlimited price alerts, weekly market reports, API access, and priority Robotimus support. Everything you need to make smarter robotics decisions.",
  alternates: { canonical: "/pro" },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
