"use client";

interface VideoEmbedProps {
  youtubeUrl: string;
  robotName: string;
}

function extractVideoId(url: string): string | null {
  // Handle various YouTube URL formats
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

export function VideoEmbed({ youtubeUrl, robotName }: VideoEmbedProps) {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) return null;

  return (
    <div className="relative overflow-hidden rounded-md border border-border bg-obsidian-surface">
      {/* Badge */}
      <div className="absolute left-3 top-3 z-10">
        <span className="inline-flex items-center gap-1.5 rounded bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-lime backdrop-blur-sm">
          <svg
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          Official Manufacturer Demo
        </span>
      </div>

      {/* 16:9 aspect ratio container */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={`${robotName} — Official Manufacturer Demo`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
