"use client";

import Link from "next/link";
import { RobotimusIcon } from "@/components/advisor/robotimus-avatar";

export function AskAiButton({ robotName }: { robotName: string }) {
  const query = encodeURIComponent(`I'm evaluating the ${robotName}. What should I know before buying?`);

  return (
    <Link
      href={`/advisor?q=${query}`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-white/15"
    >
      <RobotimusIcon className="h-5 w-5" />
      Ask Robotimus
    </Link>
  );
}
