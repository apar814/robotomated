import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { SectorCode, SECTOR_CODES } from "@/components/ui/sector-code";
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

function getKeySpec(specs: Record<string, unknown> | null): { label: string; value: string } | null {
  if (!specs) return null;
  if (specs.payload_kg) return { label: "PAYLOAD", value: `${specs.payload_kg}KG` };
  if (specs.reach_mm) return { label: "REACH", value: `${specs.reach_mm}MM` };
  if (specs.battery_hrs) return { label: "RANGE", value: `${specs.battery_hrs}H` };
  if (specs.max_speed) return { label: "SPEED", value: String(specs.max_speed).toUpperCase() };
  if (specs.dof) return { label: "DOF", value: `${specs.dof}` };
  if (specs.weight_kg) return { label: "WEIGHT", value: `${specs.weight_kg}KG` };
  if (specs.suction_pa) return { label: "SUCTION", value: `${Number(specs.suction_pa).toLocaleString()}PA` };
  if (specs.ip_rating) return { label: "PROTECTION", value: String(specs.ip_rating) };
  return null;
}

interface RobotCardProps {
  robot: RobotCardData;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

export function RobotCard({ robot, compareSelected, onCompareToggle, compareDisabled }: RobotCardProps) {
  const hasRealImage = robot.image_url && !robot.image_url.includes("unsplash.com");
  const specs = robot.specs as Record<string, unknown> | null;
  const keySpec = getKeySpec(specs);
  const sectorCode = SECTOR_CODES[robot.category_slug];

  return (
    <div className="obsidian-card group flex flex-col overflow-hidden">
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
        <div className="relative h-44 overflow-hidden bg-white/[0.03]">
          {hasRealImage ? (
            <SafeImage
              src={robot.image_url!}
              alt={robot.name}
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
              fallbackLabel={robot.manufacturer_name}
              fallbackSublabel={robot.name}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F1628] to-[#141C33] px-4 text-center">
              <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-white/[0.06]"><rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="18" r="2.5" fill="currentColor"/><circle cx="28" cy="18" r="2.5" fill="currentColor"/><rect x="18" y="28" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="34" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25">{robot.manufacturer_name}</span>
              <span className="mt-0.5 text-sm font-semibold text-white/45">{robot.name}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* 1. Robot name */}
        <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
          <h3 className="font-display text-sm font-semibold leading-tight text-primary transition-colors group-hover:text-electric-blue">
            {robot.name}
          </h3>
        </Link>

        {/* 2. Manufacturer + sector code */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[10px] text-tertiary">
            {robot.manufacturer_name}
          </span>
          {sectorCode && <SectorCode code={sectorCode} />}
        </div>

        {/* 3. RoboScore */}
        {robot.robo_score != null && robot.robo_score > 0 && (
          <div className="mt-3">
            <RoboScoreBadge score={robot.robo_score} />
          </div>
        )}

        {/* 4. Price */}
        <div className="mt-2">
          {robot.price_current != null ? (
            <span className="font-mono text-sm font-bold text-lime">
              {formatPrice(robot.price_current)}
            </span>
          ) : (
            <span className="font-mono text-sm font-bold text-tertiary">
              RFQ
            </span>
          )}
        </div>

        {/* 5. Key spec */}
        {keySpec && (
          <div className="mt-1.5">
            <span className="font-mono text-[10px] uppercase text-tertiary">
              {keySpec.label} {keySpec.value}
            </span>
          </div>
        )}

        {/* 6. CTA */}
        <div className="mt-auto pt-3">
          <Link
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className="text-[11px] font-medium text-electric-blue transition-colors hover:text-electric-blue/80"
          >
            View Analysis →
          </Link>
        </div>
      </div>
    </div>
  );
}
