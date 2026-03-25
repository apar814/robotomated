import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { cn } from "@/lib/utils/cn";

export interface RobotCardData {
  id: string;
  slug: string;
  name: string;
  robo_score: number | null;
  price_current: number | null;
  price_msrp?: number | null;
  description_short: string | null;
  status: string;
  category_slug: string;
  category_name?: string;
  manufacturer_name: string;
  image_url?: string | null;
  year_released?: number | null;
  specs?: Record<string, unknown> | null;
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
}

interface RobotCardProps {
  robot: RobotCardData;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

export function RobotCard({ robot, compareSelected, onCompareToggle, compareDisabled }: RobotCardProps) {
  const hasRealImage = robot.image_url && !robot.image_url.includes("unsplash.com");
  const isNew = robot.year_released && robot.year_released >= 2024;
  const hasDiscount = robot.price_msrp && robot.price_current && robot.price_msrp > robot.price_current;
  const specs = robot.specs as Record<string, unknown> | null;

  // Extract key buyer specs
  const specEntries: { label: string; value: string }[] = [];
  if (specs) {
    if (specs.payload_kg) specEntries.push({ label: "Payload", value: `${specs.payload_kg}kg` });
    if (specs.reach_mm) specEntries.push({ label: "Reach", value: `${specs.reach_mm}mm` });
    if (specs.dof) specEntries.push({ label: "DOF", value: `${specs.dof}` });
    if (specs.ip_rating) specEntries.push({ label: "Protection", value: String(specs.ip_rating) });
    if (specs.battery_hrs) specEntries.push({ label: "Battery", value: `${specs.battery_hrs}h` });
    if (specs.suction_pa) specEntries.push({ label: "Suction", value: `${Number(specs.suction_pa).toLocaleString()}Pa` });
    if (specs.weight_kg) specEntries.push({ label: "Weight", value: `${specs.weight_kg}kg` });
    if (specs.max_speed) specEntries.push({ label: "Speed", value: String(specs.max_speed) });
  }

  return (
    <div className="glass glass-hover group relative flex flex-col rounded-xl transition-all duration-300 hover:-translate-y-1">
      {/* Compare checkbox */}
      {onCompareToggle && (
        <label
          className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-xs backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={compareSelected}
            disabled={compareDisabled && !compareSelected}
            onChange={() => onCompareToggle(robot.id)}
            className="h-3.5 w-3.5 accent-blue"
          />
          <span className="text-white/70">Compare</span>
        </label>
      )}

      {/* Image */}
      <Link href={`/explore/${robot.category_slug}/${robot.slug}`} className="block">
        <div className="relative h-44 overflow-hidden rounded-t-xl bg-white/[0.03]">
          {hasRealImage ? (
            <SafeImage
              src={robot.image_url!}
              alt={robot.name}
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              fallbackLabel={robot.manufacturer_name}
              fallbackSublabel={robot.name}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.04] px-4 text-center">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/20">{robot.manufacturer_name}</span>
              <span className="mt-1 text-sm font-semibold text-white/30">{robot.name}</span>
            </div>
          )}

          {/* Score badge */}
          {robot.robo_score != null && robot.robo_score > 0 && (
            <div className="absolute right-3 top-3">
              <RoboScoreBadge score={robot.robo_score} />
            </div>
          )}

          {/* New badge */}
          {isNew && !onCompareToggle && (
            <span className="absolute right-3 top-3 rounded-full bg-blue px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
          )}

          {/* Category */}
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm">
            {robot.category_name || robot.category_slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
          <h3 className="font-semibold leading-tight text-foreground transition-colors group-hover:text-blue">{robot.name}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-white/30">by {robot.manufacturer_name}</p>

        {/* Key specs grid */}
        {specEntries.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-lg bg-white/[0.03] px-3 py-2">
            {specEntries.slice(0, 4).map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] uppercase tracking-wide text-white/30">{label}</p>
                <p className="text-xs font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            {robot.price_current != null ? (
              <>
                <span className="font-mono text-base font-bold text-green">{formatPrice(robot.price_current)}</span>
                {hasDiscount && (
                  <span className="font-mono text-xs text-white/30 line-through">{formatPrice(robot.price_msrp!)}</span>
                )}
              </>
            ) : robot.status === "coming_soon" ? (
              <span className="text-sm text-white/30">Coming Soon</span>
            ) : (
              <span className="text-sm text-orange">Request Quote</span>
            )}
          </div>

          <Link
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className="mt-2 block w-full rounded-lg border border-border py-2 text-center text-xs font-medium text-foreground transition-colors hover:border-blue/30 hover:text-blue"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
