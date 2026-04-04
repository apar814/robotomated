"use client";

import { useState } from "react";
import { RobotVideoPlayer } from "./robot-video-player";

interface RobotMediaGalleryProps {
  images: { url: string; alt: string }[];
  youtubeId?: string;
  vimeoId?: string;
  robotName: string;
}

type Tab = "photos" | "video";

export function RobotMediaGallery({
  images,
  youtubeId,
  vimeoId,
  robotName,
}: RobotMediaGalleryProps) {
  const hasVideo = !!(youtubeId || vimeoId);
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const safeIndex =
    images.length > 0
      ? Math.min(selectedImageIndex, images.length - 1)
      : 0;

  return (
    <div>
      {/* Tabs */}
      <div
        className="mb-4 flex gap-1 rounded-lg p-1"
        style={{ background: "var(--theme-card)" }}
        role="tablist"
      >
        <button
          role="tab"
          aria-selected={activeTab === "photos"}
          onClick={() => setActiveTab("photos")}
          className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background:
              activeTab === "photos"
                ? "var(--theme-border)"
                : "transparent",
            color:
              activeTab === "photos"
                ? "var(--theme-text-primary)"
                : "var(--theme-text-muted)",
          }}
        >
          Photos
        </button>
        {hasVideo && (
          <button
            role="tab"
            aria-selected={activeTab === "video"}
            onClick={() => setActiveTab("video")}
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              background:
                activeTab === "video"
                  ? "var(--theme-border)"
                  : "transparent",
              color:
                activeTab === "video"
                  ? "var(--theme-text-primary)"
                  : "var(--theme-text-muted)",
            }}
          >
            Video
          </button>
        )}
      </div>

      {/* Photos Tab */}
      {activeTab === "photos" && (
        <div>
          {/* Main image */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              aspectRatio: "4/3",
              background: "var(--theme-card)",
              border: "1px solid var(--theme-border)",
            }}
          >
            {images.length > 0 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={images[safeIndex].url}
                alt={images[safeIndex].alt}
                className="h-full w-full object-contain"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-3"
                style={{ color: "var(--theme-text-muted)" }}
              >
                <svg
                  className="h-12 w-12 opacity-40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                  />
                </svg>
                <span className="text-sm">No images available for {robotName}</span>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="mt-3 flex gap-2 overflow-x-auto pb-1"
              role="listbox"
              aria-label={`${robotName} image thumbnails`}
            >
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  role="option"
                  aria-selected={index === safeIndex}
                  onClick={() => setSelectedImageIndex(index)}
                  className="flex-shrink-0 overflow-hidden rounded-lg transition-all"
                  style={{
                    width: 80,
                    height: 60,
                    border:
                      index === safeIndex
                        ? "2px solid var(--theme-accent-blue)"
                        : "1px solid var(--theme-border)",
                    opacity: index === safeIndex ? 1 : 0.7,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Tab */}
      {activeTab === "video" && hasVideo && (
        <div>
          <RobotVideoPlayer
            youtubeId={youtubeId}
            vimeoId={vimeoId}
            robotName={robotName}
          />

          <div className="mt-3 flex items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Source: Official Manufacturer Channel
            </span>
            {youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80"
                style={{ color: "var(--theme-accent-blue)" }}
              >
                Watch on YouTube
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
