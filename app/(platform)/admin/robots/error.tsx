"use client";

import Link from "next/link";

export default function AdminRobotsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Failed to load robots</h1>
      <p className="mt-3 text-sm text-muted">
        {error.message || "An unexpected error occurred while loading the admin robots page."}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-navy hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="rounded-lg border border-border px-5 py-2 text-sm text-muted hover:text-foreground"
        >
          Back to Dashboard
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
