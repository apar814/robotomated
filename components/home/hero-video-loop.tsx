"use client";

import { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  company: string;
  useCase: string;
  youtubeId: string;
}

const ROBOT_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Stretch in Amazon Warehouse",
    company: "Boston Dynamics",
    useCase: "Logistics & Warehouse",
    youtubeId: "O8NmWVKqMuk",
  },
  {
    id: "2",
    title: "Digit Scaling at Scale",
    company: "Agility Robotics",
    useCase: "Large-Scale Deployment",
    youtubeId: "tOH8ykKwGvA",
  },
  {
    id: "3",
    title: "Tesla Optimus Production",
    company: "Tesla",
    useCase: "Manufacturing",
    youtubeId: "cpIcnc3RF60",
  },
  {
    id: "4",
    title: "Figure AI Apollo Working",
    company: "Figure AI",
    useCase: "General Purpose Humanoid",
    youtubeId: "Yl-JH6nKl2o",
  },
];

export function HeroVideoLoop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROBOT_VIDEOS.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const current = ROBOT_VIDEOS[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "16 / 9" }}
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

      {/* Dark Overlay + Text */}
      <div className="absolute inset-0 flex flex-col justify-end bg-black/30 p-6">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs uppercase tracking-wider text-gray-300">
            {current.useCase}
          </p>
          <h2 className="mb-2 text-2xl font-bold text-white md:text-4xl">
            {current.title}
          </h2>
          <p className="text-sm text-gray-200">{current.company}</p>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-2">
        {ROBOT_VIDEOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setAutoPlay(false);
            }}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Video ${idx + 1}`}
          />
        ))}
      </div>

      {/* Play/Pause Indicator */}
      <div className="absolute right-6 top-6 text-xs text-white/70">
        {autoPlay ? "Playing" : "Paused"}
      </div>
    </div>
  );
}
