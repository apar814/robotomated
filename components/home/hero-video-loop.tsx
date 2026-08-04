"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  company: string;
  useCase: string;
  youtubeId: string;
}

// POLICY: only official manufacturer-channel uploads are permitted here
// (copyright + editorial independence — no reuploads, no third-party edits).
// Verify each youtubeId resolves to the manufacturer's own channel before
// adding it. While this array is empty the section renders nothing.
const ROBOT_VIDEOS: Video[] = [];

export function HeroVideoLoop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || ROBOT_VIDEOS.length < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROBOT_VIDEOS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  if (ROBOT_VIDEOS.length === 0) return null;

  const current = ROBOT_VIDEOS[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: "16 / 9", background: "var(--theme-bg)" }}
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* YouTube IFrame */}
      <iframe
        key={current.youtubeId}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${current.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1`}
        title={current.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 border-0"
      />

      {/* Bottom-left metadata — DESIGN.md hero pattern, no overlay tint */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
        <div className="max-w-2xl">
          <p className="label-uppercase text-[12px] tracking-[0.12em]">{current.useCase}</p>
          <h2
            className="mt-2 font-[family-name:var(--font-sans)] font-medium tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
          >
            {current.title}
          </h2>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[12px] text-white/50">
            {current.company}
          </p>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {ROBOT_VIDEOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setAutoPlay(false);
            }}
            className={`h-[2px] transition-all ${
              idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
            aria-label={`Video ${idx + 1}`}
          />
        ))}
      </div>

      {/* Play state — mono metadata */}
      <div className="absolute right-6 top-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.12em] text-white/50">
        {autoPlay ? "Playing" : "Paused"}
      </div>
    </div>
  );
}
