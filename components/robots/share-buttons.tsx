"use client";

import { useState } from "react";

interface ShareButtonsProps {
  robotName: string;
  robotScore: number | null;
  robotUrl: string; // e.g. /explore/warehouse/ur5e
}

export function ShareButtons({ robotName, robotScore, robotUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://robotomated.com${robotUrl}`;
  const scoreStr = robotScore != null ? ` — RoboScore ${robotScore.toFixed(1)}/100` : "";

  const tweetText = encodeURIComponent(
    `I'm evaluating the ${robotName}${scoreStr}. See full analysis: ${fullUrl} via @robotomated`,
  );
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* Twitter / X */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-mono text-[13px] text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
        Share
      </a>

      {/* LinkedIn */}
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-mono text-[13px] text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
          <path d="M8 11l0 5" />
          <path d="M8 8l0 .01" />
          <path d="M12 16l0 -5" />
          <path d="M16 16v-3a2 2 0 0 0 -4 0" />
        </svg>
        LinkedIn
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-mono text-[13px] text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
          <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        </svg>
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
