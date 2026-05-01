import Link from "next/link";
import { RoboScoreBadge } from "@/components/ui/robo-score";

export interface RobotRecommendation {
  name: string;
  slug: string;
  category?: string;
  score: number;
  price: number | null;
  reason: string;
  image_url?: string;
}

export function RobotCardInline({ robot }: { robot: RobotRecommendation }) {
  return (
    <div className="my-2 rounded-xl border border-border bg-navy-lighter p-4">
      <div className="flex items-start gap-3">
        {robot.image_url ? (
          <img
            src={robot.image_url}
            alt={robot.name}
            className="h-14 w-14 shrink-0 rounded-lg bg-navy-light object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-navy-light">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-muted/40" fill="none" stroke="currentColor" strokeWidth={1}>
              <rect x="4" y="4" width="16" height="12" rx="2" />
              <circle cx="9" cy="10" r="1.5" />
              <circle cx="15" cy="10" r="1.5" />
              <path d="M8 20h8 M10 16v4 M14 16v4" />
            </svg>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground">{robot.name}</h4>
            <RoboScoreBadge score={robot.score} />
          </div>
          <p className="mt-1 text-xs text-muted">{robot.reason}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-foreground">
              {robot.price != null ? `$${robot.price.toLocaleString()}` : "Contact"}
            </span>
            <Link
              href={`/explore/${robot.category || "all"}/${robot.slug}`}
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-opacity hover:opacity-90"
            >
              View Robot &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Parse robot recommendation blocks from message text.
 * Format: :::robot{"name":"...","slug":"...","category":"...","score":87.5,"price":29500,"reason":"..."}:::
 */
export function parseRobotCards(text: string): { segments: Array<{ type: "text" | "robot"; content: string; robot?: RobotRecommendation }> } {
  const segments: Array<{ type: "text" | "robot"; content: string; robot?: RobotRecommendation }> = [];
  const regex = /:::robot(\{[^}]+\}):::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    try {
      const robot = JSON.parse(match[1]) as RobotRecommendation;
      segments.push({ type: "robot", content: match[0], robot });
    } catch {
      segments.push({ type: "text", content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }

  return { segments };
}
