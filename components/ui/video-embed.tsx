"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

interface VideoMeta {
  type: "youtube" | "vimeo" | "direct" | "external";
  id: string | null;
  embedUrl: string | null;
  rawUrl?: string;
  thumbUrl: string | null;
}

export function parseVideoUrl(url: string): VideoMeta | null {
  if (!url) return null;

  const ytPatterns = [
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of ytPatterns) {
    const m = url.match(p);
    if (m) return {
      type: "youtube", id: m[1],
      embedUrl: `https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1`,
      thumbUrl: `https://img.youtube.com/vi/${m[1]}/maxresdefault.jpg`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return {
    type: "vimeo", id: vimeo[1],
    embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?title=0&byline=0&portrait=0`,
    thumbUrl: null,
  };

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { type: "direct", id: null, embedUrl: null, rawUrl: url, thumbUrl: null };

  return { type: "external", id: null, embedUrl: null, rawUrl: url, thumbUrl: null };
}

interface VideoEmbedProps {
  url: string;
  title?: string;
  caption?: string;
  posterUrl?: string | null;
  className?: string;
}

export function VideoEmbed({ url, title, caption, posterUrl, className = "" }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const meta = useMemo(() => parseVideoUrl(url), [url]);
  const thumbnailSrc = posterUrl || meta?.thumbUrl;

  if (!meta) return null;

  if (meta.type === "external") {
    return (
      <div className={`flex items-center gap-4 rounded-xl border border-border bg-neutral-50 p-6 ${className}`}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-200">
          <svg className="h-5 w-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title || "Watch demo video"}</p>
          {caption && <p className="text-xs text-neutral-500">{caption}</p>}
          <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-blue hover:underline">
            Watch on manufacturer site →
          </a>
        </div>
      </div>
    );
  }

  if (meta.type === "direct") {
    return (
      <div className={`overflow-hidden rounded-xl bg-neutral-900 ${className}`}>
        <video src={meta.rawUrl} poster={thumbnailSrc || undefined} controls preload="metadata" className="aspect-video w-full" title={title} />
        {caption && <p className="px-4 py-2 text-xs text-neutral-500">{caption}</p>}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl bg-neutral-900 ${className}`}>
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src={`${meta.embedUrl}&autoplay=1`}
            title={title || "Robot demo video"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full cursor-pointer" aria-label={`Play ${title || "video"}`}>
            {thumbnailSrc ? (
              <Image src={thumbnailSrc} alt={title || "Video thumbnail"} fill className="object-cover" unoptimized />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
            )}
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 transition-all group-hover:border-white/70 group-hover:bg-white/20">
                <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              {title && <p className="max-w-xs px-4 text-center text-sm font-medium text-white drop-shadow-lg">{title}</p>}
            </div>
            {meta.type === "youtube" && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-xs text-white">
                <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6a3 3 0 00-2.1 2.1C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
                  <path fill="white" d="M9.75 15.02l6.25-3.02-6.25-3.02v6.04z" />
                </svg>
                YouTube
              </div>
            )}
          </button>
        )}
      </div>
      {caption && <p className="border-t border-neutral-800 px-4 py-2.5 text-xs text-neutral-500">{caption}</p>}
    </div>
  );
}
