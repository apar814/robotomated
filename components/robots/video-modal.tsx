"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VideoModalProps {
  youtubeUrl: string;
  robotName: string;
  trigger: React.ReactNode;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoModal({ youtubeUrl, robotName, trigger }: VideoModalProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const videoId = extractVideoId(youtubeUrl);

  const openModal = useCallback(() => {
    setOpen(true);
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    // Wait for exit animation before unmounting
    setTimeout(() => setOpen(false), 200);
  }, []);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeModal]);

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal();
  };

  if (!videoId) return <>{trigger}</>;

  return (
    <>
      {/* Trigger */}
      <span onClick={openModal} className="cursor-pointer">
        {trigger}
      </span>

      {/* Modal */}
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`relative w-full max-w-4xl transition-transform duration-200 ${
              visible ? "scale-100" : "scale-95"
            }`}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute -right-2 -top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-mono text-sm text-white transition-colors hover:bg-white/20"
              aria-label="Close video"
            >
              &times;
            </button>

            {/* 16:9 video container */}
            <div
              className="relative w-full overflow-hidden rounded-md border border-border"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1&modestbranding=1`}
                title={`${robotName} — Official Manufacturer Demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
