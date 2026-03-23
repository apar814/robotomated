"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        An unexpected error occurred. This has been reported to our team.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-blue px-6 py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter"
        >
          Go Home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 font-mono text-xs text-muted">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
