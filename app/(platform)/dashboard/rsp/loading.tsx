export default function RSPDashboardLoading() {
  return (
    <div className="animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 rounded bg-obsidian-surface" />
          <div className="mt-2 h-4 w-72 rounded bg-obsidian-surface" />
        </div>

        {/* Tabs skeleton */}
        <div className="mb-8 flex gap-4 border-b border-border pb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-20 rounded bg-obsidian-surface" />
          ))}
        </div>

        {/* Stats cards skeleton */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-obsidian-surface p-5"
            >
              <div className="h-3 w-24 rounded bg-border" />
              <div className="mt-3 h-7 w-16 rounded bg-border" />
              <div className="mt-2 h-3 w-20 rounded bg-border" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-obsidian-surface p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-40 rounded bg-border" />
                  <div className="mt-2 h-3 w-56 rounded bg-border" />
                </div>
                <div className="h-6 w-16 rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
