"use client";

import { useState, useRef, useEffect } from "react";

interface VideoHeroProps {
  /** Direct video URL (MP4, WebM) */
  videoUrl?: string | null;
  /** Fallback poster image URL */
  posterUrl?: string | null;
  /** Alt text for accessibility */
  alt?: string;
  /** Overlay opacity 0-1 (default 0.6) */
  overlayOpacity?: number;
  /** Additional className for the container */
  className?: string;
  /** Children rendered on top of the video */
  children?: React.ReactNode;
}

/**
 * Full-bleed video hero component.
 * Autoplays muted, loops, fades in on load.
 * Falls back to poster image if no video or video fails to load.
 */
export function VideoHero({
  videoUrl,
  posterUrl,
  alt = "Background video",
  overlayOpacity = 0.6,
  className = "",
  children,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const hasVideo = !!videoUrl && !failed;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleCanPlay = () => setLoaded(true);
    const handleError = () => setFailed(true);

    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleError);

    // Attempt play (browsers may block autoplay)
    video.play().catch(() => {
      // Autoplay blocked — show poster instead
      setFailed(true);
    });

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video layer */}
      {hasVideo && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Poster fallback (shows when no video or video loading) */}
      {posterUrl && (!hasVideo || !loaded) && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterUrl})` }}
          role="img"
          aria-label={alt}
        />
      )}

      {/* Cinematic gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            `rgba(0, 0, 0, ${overlayOpacity})`,
          ].join(', '),
        }}
      />
      {/* Multi-layer radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(37,99,235,0.18) 0%, transparent 60%)",
            "radial-gradient(ellipse 60% 50% at 80% 120%, rgba(99,102,241,0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse 40% 40% at 10% 80%, rgba(37,99,235,0.06) 0%, transparent 50%)",
          ].join(', '),
        }}
      />

      {/* Content on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Inline video player for robot detail pages.
 * Autoplays muted on scroll into view, shows poster until loaded.
 */
export function VideoPlayer({
  videoUrl,
  posterUrl,
  alt = "Robot video",
  className = "",
}: {
  videoUrl: string;
  posterUrl?: string | null;
  alt?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Autoplay on scroll into view
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl || undefined}
        muted
        loop
        playsInline
        onCanPlayThrough={() => setLoaded(true)}
        className={`w-full transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ aspectRatio: "16/9" }}
        aria-label={alt}
      />
      {/* Loading skeleton */}
      {!loaded && (
        <div
          className="absolute inset-0 animate-shimmer rounded-lg"
          style={{ background: "rgba(255,255,255,0.03)", aspectRatio: "16/9" }}
        />
      )}
    </div>
  );
}
