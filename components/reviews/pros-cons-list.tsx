export function ProsConsList({ pros, cons }: { pros: string[]; cons: string[] }) {
  if (!pros?.length && !cons?.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {pros?.length > 0 && (
        <div className="rounded-lg border border-green/20 bg-green/5 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Pros
          </h4>
          <ul className="space-y-2">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cons?.length > 0 && (
        <div className="rounded-lg border border-orange/20 bg-orange/5 p-4">
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cons
          </h4>
          <ul className="space-y-2">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
