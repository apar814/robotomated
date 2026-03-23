import type { Metadata } from "next";
import { Suspense } from "react";
import { AdvisorClient } from "@/components/advisor/advisor-client";

export const metadata: Metadata = {
  title: "AI Robot Advisor — Find Your Perfect Robot",
  description:
    "Describe your needs and get AI-powered robot recommendations instantly. Powered by Claude.",
};

export default function AdvisorPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <Suspense fallback={<div className="flex flex-1 items-center justify-center text-muted">Loading advisor...</div>}>
        <AdvisorClient />
      </Suspense>
    </div>
  );
}
