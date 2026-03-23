"use client";

import Link from "next/link";

export function AskAiButton({ robotName }: { robotName: string }) {
  const query = encodeURIComponent(`Tell me about ${robotName} — is it right for me?`);

  return (
    <Link
      href={`/advisor?q=${query}`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue to-violet px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue/30"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <circle cx="15" cy="10" r="1.5" />
        <path d="M8 20h8 M10 16v4 M14 16v4" />
      </svg>
      Ask AI
    </Link>
  );
}
