"use client";

import { useState } from "react";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  description: string;
  inline?: boolean;
}

/** Non-aggressive inline upgrade prompt */
export function UpgradePrompt({ feature, description, inline }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (inline) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-violet/20 bg-violet/5 px-4 py-3">
        <div>
          <p className="text-sm font-medium">{feature}</p>
          <p className="text-xs text-muted">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/pro"
            className="rounded-lg bg-gradient-to-r from-blue to-violet px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Upgrade
          </Link>
          <button onClick={() => setDismissed(true)} className="text-xs text-muted hover:text-foreground">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/** Modal-style upgrade prompt for hitting limits */
export function UpgradeModal({
  feature,
  description,
  onClose,
}: {
  feature: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-navy-light p-8 text-center shadow-xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-violet">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold">{feature}</h2>
        <p className="mt-3 text-sm text-muted">{description}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/pro"
            className="rounded-lg bg-gradient-to-r from-blue to-violet px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start 7-Day Free Trial
          </Link>
          <button onClick={onClose} className="text-sm text-muted hover:text-foreground">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
