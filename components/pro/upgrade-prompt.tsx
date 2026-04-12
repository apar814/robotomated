"use client";

import { useState } from "react";
import Link from "next/link";

interface UpgradePromptProps {
  feature: string;
  description: string;
  inline?: boolean;
}

/** Inline upgrade prompt — appears at the exact moment of highest value */
export function UpgradePrompt({ feature, description, inline }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (inline) {
    return (
      <div className="rounded-xl border border-[#2563EB]/15 bg-[#2563EB]/[0.03] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{feature}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/40">{description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/pro"
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-black transition-opacity hover:opacity-90"
            >
              Unlock — $49/mo
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-xs text-white/20 transition-colors hover:text-white/40"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/** Modal upgrade prompt — for hard limits (e.g., 10th Robotimus query) */
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0A0A0A] p-8 text-center shadow-2xl">
        <div className="mb-5 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
            <svg className="h-6 w-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">{feature}</h2>
        <p className="mt-3 text-sm text-white/40">{description}</p>
        <p className="mt-4 text-xs text-white/25">$49/month &middot; 7-day free trial &middot; Cancel anytime</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/pro"
            className="rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Start Free Trial
          </Link>
          <button onClick={onClose} className="text-sm text-white/25 transition-colors hover:text-white/40">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

/** Inline gate for Pro-only content — shows preview then upgrade prompt */
export function ProGate({
  children,
  isPro,
  feature,
  description,
}: {
  children: React.ReactNode;
  isPro: boolean;
  feature: string;
  description: string;
}) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none opacity-30 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-[#2563EB]/15 bg-[#0A0A0A]/95 p-6 text-center backdrop-blur-sm">
          <p className="text-sm font-semibold text-white">{feature}</p>
          <p className="mt-2 text-xs text-white/40">{description}</p>
          <Link
            href="/pro"
            className="mt-4 inline-block rounded-lg bg-[#2563EB] px-5 py-2.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
          >
            Unlock with Pro — $49/mo
          </Link>
        </div>
      </div>
    </div>
  );
}
