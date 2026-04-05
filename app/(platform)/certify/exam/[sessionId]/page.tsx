"use client";

import { useSearchParams } from "next/navigation";
import { use } from "react";
import ExamInterface from "@/components/certify/exam-interface";

export default function ExamPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8">
            <h2 className="font-display text-xl font-bold text-white">
              Invalid Exam Link
            </h2>
            <p className="mt-2 text-sm text-[var(--theme-muted)]">
              This exam link is missing a valid session token. Please start a
              new exam from the certifications page.
            </p>
            <a
              href="/certify"
              className="mt-6 inline-block rounded-lg bg-[var(--theme-blue)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
            >
              Return to Certifications
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <ExamInterface sessionId={sessionId} sessionToken={token} />;
}
