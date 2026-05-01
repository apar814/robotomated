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
      <svg className="mb-4 h-12 w-12 text-white/28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      <h1 className="text-2xl font-bold sm:text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-white/40">
        An unexpected error occurred. This has been reported to our team. Try refreshing, or start from the homepage.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
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
