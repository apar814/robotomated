interface TrainingSectionProps {
  operatorTrainingHours: number | null;
}

export function TrainingSection({
  operatorTrainingHours,
}: TrainingSectionProps) {
  return (
    <div className="rounded-md border border-border bg-obsidian-surface p-4">
      {/* Label */}
      <div className="section-label mb-3">
        <span className="font-mono text-[9px] tracking-widest">
          [TRAINING] REQUIREMENTS
        </span>
      </div>

      {/* Training Hours */}
      <div className="mb-3">
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Operator Training
        </p>
        <p className="mt-0.5 font-mono text-lg font-bold text-text-primary">
          {operatorTrainingHours != null ? (
            <>
              {operatorTrainingHours} hours
              <span className="ml-2 text-sm font-normal text-text-tertiary">
                {operatorTrainingHours <= 8
                  ? "(~1 day)"
                  : operatorTrainingHours <= 40
                    ? `(~${Math.ceil(operatorTrainingHours / 8)} days)`
                    : `(~${Math.ceil(operatorTrainingHours / 40)} weeks)`}
              </span>
            </>
          ) : (
            <span className="text-text-ghost">Contact Vendor</span>
          )}
        </p>
      </div>

      {/* Generic Training Breakdown */}
      <div className="space-y-2">
        <p className="font-mono text-[9px] uppercase tracking-wider text-text-ghost">
          Typical Training Plan
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-mono text-[9px] text-text-tertiary">
              SAFETY & BASICS
            </p>
            <p className="font-mono text-[11px] text-text-secondary">
              2–4 hours
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-text-tertiary">
              OPERATIONS
            </p>
            <p className="font-mono text-[11px] text-text-secondary">
              4–16 hours
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-text-tertiary">
              TROUBLESHOOTING
            </p>
            <p className="font-mono text-[11px] text-text-secondary">
              2–8 hours
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-text-tertiary">
              MAINTENANCE
            </p>
            <p className="font-mono text-[11px] text-text-secondary">
              4–16 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
