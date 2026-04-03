export default function CertifyLoading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="border-b border-border px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-border" />
          <div className="mx-auto mt-6 h-12 w-full max-w-xl animate-pulse rounded-lg bg-border" />
          <div className="mx-auto mt-4 h-6 w-full max-w-md animate-pulse rounded-lg bg-border" />
          <div className="mt-10 flex justify-center gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-8 w-16 animate-pulse rounded bg-border" />
                <div className="mx-auto mt-2 h-4 w-24 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-border" />
          <div className="mx-auto mt-4 h-5 w-96 animate-pulse rounded-lg bg-border" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-[#0C0C0C] p-6"
              >
                <div className="flex justify-between">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-border" />
                  <div className="h-8 w-12 animate-pulse rounded bg-border" />
                </div>
                <div className="mt-4 h-6 w-32 animate-pulse rounded bg-border" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-border" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
                </div>
                <div className="mt-5 flex gap-4 border-t border-border pt-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-4 w-16 animate-pulse rounded bg-border"
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-3 w-full animate-pulse rounded bg-border"
                    />
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
                  <div className="h-10 flex-1 animate-pulse rounded-lg bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
