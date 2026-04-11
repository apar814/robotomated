"use client";

import Link from "next/link";
import { RobotimusIcon } from "@/components/advisor/robotimus-avatar";

export function AskAiButton({ robotName }: { robotName: string }) {
  const query = encodeURIComponent(`I'm evaluating the ${robotName}. What should I know before buying?`);

  return (
    <Link
      href={`/advisor?q=${query}`}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#0EA5E9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0EA5E9]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#0EA5E9]/30"
    >
      <RobotimusIcon className="h-5 w-5" />
      Ask Robotimus
    </Link>
  );
}
