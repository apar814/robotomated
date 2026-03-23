import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-6xl font-bold text-blue">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-blue px-6 py-2.5 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
        >
          Go Home
        </Link>
        <Link
          href="/explore"
          className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-navy-lighter"
        >
          Explore Robots
        </Link>
      </div>
    </div>
  );
}
