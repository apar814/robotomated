import Link from "next/link";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { cn } from "@/lib/utils/cn";

export interface RobotCardData {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  description_short: string | null;
  status: string;
  category_slug: string;
  manufacturer_name: string;
}

interface RobotCardProps {
  robot: RobotCardData;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

export function RobotCard({ robot, compareSelected, onCompareToggle, compareDisabled }: RobotCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-navy-light transition-all hover:border-blue/30">
      {/* Compare checkbox */}
      {onCompareToggle && (
        <label className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-navy/80 px-2 py-1 text-xs backdrop-blur-sm">
          <input
            type="checkbox"
            checked={compareSelected}
            disabled={compareDisabled && !compareSelected}
            onChange={() => onCompareToggle(robot.id)}
            className="h-3.5 w-3.5 rounded border-border bg-navy-lighter accent-blue"
          />
          <span className="text-muted">Compare</span>
        </label>
      )}

      {/* Image placeholder */}
      <Link href={`/explore/${robot.category_slug}/${robot.slug}`} className="block">
        <div className="flex h-40 items-center justify-center rounded-t-xl bg-navy-lighter">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-muted/30" fill="none" stroke="currentColor" strokeWidth={1}>
            <rect x="4" y="4" width="16" height="12" rx="2" />
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="15" cy="10" r="1.5" />
            <path d="M8 20h8 M10 16v4 M14 16v4" />
          </svg>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{robot.manufacturer_name}</p>
            <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
              <h3 className="truncate font-semibold transition-colors group-hover:text-blue">{robot.name}</h3>
            </Link>
          </div>
          {robot.robo_score != null && <RoboScoreBadge score={robot.robo_score} />}
        </div>

        <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted">
          {robot.description_short}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="font-mono text-sm font-semibold">
            {robot.price_current != null
              ? `$${robot.price_current.toLocaleString()}`
              : "Contact"}
          </span>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            robot.status === "active" ? "bg-green/10 text-green" :
            robot.status === "coming_soon" ? "bg-violet/10 text-violet" :
            "bg-muted/10 text-muted"
          )}>
            {robot.status === "coming_soon" ? "Coming Soon" : robot.status === "active" ? "Available" : "Discontinued"}
          </span>
        </div>
      </div>
    </div>
  );
}
