import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
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

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
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
    <div className="group flex cursor-pointer flex-col rounded-xl border border-white/[0.06] bg-[#0D0D0D] transition-all duration-250 ease-out hover:-translate-y-[3px] hover:border-[rgba(14,165,233,0.3)] hover:shadow-[0_0_0_1px_rgba(14,165,233,0.1),0_8px_32px_rgba(0,0,0,0.4)]">
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

      {/* Image area */}
      <Link href={`/explore/${robot.category_slug}/${robot.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.03]">
          {hasRealImage ? (
            <SafeImage
              src={robot.image_url!}
              alt={robot.name}
              sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
              className="object-cover object-[center_20%] transition-transform duration-400 group-hover:scale-[1.04]"
              fallbackLabel={robot.manufacturer_name}
              fallbackSublabel={robot.name}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0F1628] to-[#141C33] px-4 text-center">
              <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-white/[0.06]"><rect x="12" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="20" cy="18" r="2.5" fill="currentColor"/><circle cx="28" cy="18" r="2.5" fill="currentColor"/><rect x="18" y="28" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="14" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="34" cy="40" r="3" stroke="currentColor" strokeWidth="1.5"/></svg>
              <span className="mt-1 font-[family-name:var(--font-ui)] text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25">{robot.manufacturer_name}</span>
              <span className="mt-0.5 font-[family-name:var(--font-ui)] text-sm font-semibold text-white/45">{robot.name}</span>
            </div>
          )}

          {/* Category badge - top left */}
          {sectorCode && (
            <div className="absolute left-3 top-3 rounded border border-white/10 bg-black/60 px-2 py-0.5 backdrop-blur-sm">
              <span className="font-[family-name:var(--font-ui)] text-[10px] uppercase tracking-[0.08em] text-white/80">
                {robot.category_name || robot.category_slug}
              </span>
            </div>
          )}

          {/* RoboScore badge - top right */}
          {robot.robo_score != null && robot.robo_score > 0 && (
            <div className="absolute right-3 top-3 rounded-md bg-black/70 px-2.5 py-1.5 backdrop-blur-sm">
              <div
                className="font-[family-name:var(--font-brand)] text-lg font-bold leading-none"
                style={{ color: getScoreColor(robot.robo_score) }}
              >
                {robot.robo_score}
              </div>
              <div className="mt-0.5 font-[family-name:var(--font-ui)] text-[8px] uppercase tracking-[0.12em] text-white/40">
                Score
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Info area */}
      <div className="flex flex-1 flex-col px-4 py-3.5">
        {/* Manufacturer */}
        <span className="font-[family-name:var(--font-ui)] text-[10px] font-medium uppercase tracking-[0.1em] text-[#0EA5E9]">
          {robot.manufacturer_name}
        </span>

        {/* Robot name */}
        <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
          <h3 className="mt-1 font-[family-name:var(--font-ui)] text-[15px] font-semibold leading-tight text-white transition-colors group-hover:text-[#0EA5E9]">
            {robot.name}
          </h3>
        </Link>

        {/* Key spec */}
        {keySpec && (
          <div className="mt-1.5">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase text-white/35">
              {keySpec.label} {keySpec.value}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="my-2.5 border-t border-white/[0.06]" />

        {/* Bottom row: price + action */}
        <div className="mt-auto flex items-center justify-between">
          {robot.price_current != null ? (
            <span className="font-[family-name:var(--font-mono)] text-base font-bold text-[#C8FF00]">
              {formatPrice(robot.price_current)}
            </span>
          ) : (
            <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-white/35">
              RFQ
            </span>
          )}
          <Link
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className="rounded border border-[rgba(14,165,233,0.2)] bg-[rgba(14,165,233,0.1)] px-2.5 py-1 font-[family-name:var(--font-ui)] text-[11px] font-medium text-[#0EA5E9] transition-all hover:bg-[#0EA5E9] hover:text-black"
          >
            View &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
