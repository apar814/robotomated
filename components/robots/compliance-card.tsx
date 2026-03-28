interface ComplianceCardProps {
  safetyCerts: string[] | null;
  industryCerts: string[] | null;
}

function CertBadge({ label }: { label: string }) {
  return (
    <span className="inline-block rounded-[2px] border border-[rgba(14,165,233,0.08)] bg-electric-blue-dim px-1.5 py-0.5 font-mono text-[9px] text-electric-blue">
      {label}
    </span>
  );
}

export function ComplianceCard({ safetyCerts, industryCerts }: ComplianceCardProps) {
  const hasSafety = safetyCerts != null && safetyCerts.length > 0;
  const hasIndustry = industryCerts != null && industryCerts.length > 0;
  const hasAny = hasSafety || hasIndustry;

  return (
    <div className="rounded-md border border-border bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label mb-3">
        <span className="font-mono text-[9px] tracking-widest">
          [COMPLIANCE] CERTIFICATIONS
        </span>
      </div>

      {!hasAny && (
        <p className="font-mono text-sm text-text-ghost">
          No certifications listed
        </p>
      )}

      {/* Safety Certifications */}
      {hasSafety && (
        <div className="mb-3">
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            Safety
          </p>
          <div className="flex flex-wrap gap-1.5">
            {safetyCerts.map((cert) => (
              <CertBadge key={cert} label={cert} />
            ))}
          </div>
        </div>
      )}

      {/* Industry Certifications */}
      {hasIndustry && (
        <div>
          <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-text-ghost">
            Industry
          </p>
          <div className="flex flex-wrap gap-1.5">
            {industryCerts.map((cert) => (
              <CertBadge key={cert} label={cert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
