"use client";

import { useState } from "react";

interface RobotVideoPlayerProps {
  youtubeId?: string;
  vimeoId?: string;
  directUrl?: string;
  robotName: string;
  thumbnail?: string;
}

export function RobotVideoPlayer({
  youtubeId,
  vimeoId,
  directUrl,
  robotName,
  thumbnail,
}: RobotVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnailSrc =
    thumbnail ||
    (youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
      : undefined);

  function renderPlayer() {
    if (youtubeId) {
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={`${robotName} -- Official Demo`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
    if (vimeoId) {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0`}
          title={`${robotName} -- Official Demo`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      );
    }
    if (directUrl) {
      return (
        <video
          src={directUrl}
          controls
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
        />
      );
    }
    return null;
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "16/9",
        borderRadius: 12,
        background: "#000",
        border: "1px solid var(--theme-border)",
      }}
    >
      {playing ? (
        renderPlayer()
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group relative flex h-full w-full cursor-pointer items-center justify-center"
          aria-label={`Play ${robotName} demo video`}
        >
          {/* Thumbnail */}
          {thumbnailSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnailSrc}
              alt={`${robotName} video thumbnail`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (youtubeId && target.src.includes("maxresdefault")) {
                  target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                }
              }}
            />
          )}

          {/* Bottom gradient overlay with robot name */}
          <div
            className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-10"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
            }}
          >
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}
            >
              {robotName} -- Official Demo
            </span>
          </div>

          {/* Centered play button */}
          <div
            className="relative z-20 flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.7)",
              border: "2px solid rgba(255,255,255,0.8)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(37,99,235,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.7)";
            }}
          >
            <svg
              className="ml-1 h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
