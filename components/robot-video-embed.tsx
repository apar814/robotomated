"use client";

import { useState } from "react";

interface RobotVideoEmbedProps {
  videoId: string;
  robotName: string;
}

export function RobotVideoEmbed({ videoId, robotName }: RobotVideoEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--theme-text-muted)" }}>
        See {robotName} in action
      </h3>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          aspectRatio: "16/9",
          border: "1px solid var(--theme-border)",
          background: "var(--theme-card)",
        }}
      >
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="group relative flex h-full w-full items-center justify-center"
            aria-label={`Play video: ${robotName}`}
          >
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={`${robotName} video thumbnail`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fall back to hqdefault if maxres fails
                const target = e.target as HTMLImageElement;
                if (target.src.includes("maxresdefault")) {
                  target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/20" />
            {/* Play button */}
            <div
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full transition-transform group-hover:scale-110"
              style={{ background: "var(--theme-accent-blue)", boxShadow: "0 0 30px rgba(37,99,235,0.4)" }}
            >
              <svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${robotName} video`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
