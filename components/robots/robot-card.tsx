import Link from "next/link";
import Image from "next/image";
import { RoboScoreBadge } from "@/components/ui/robo-score";
import { PriceDisplay } from "@/components/ui/price-display";
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

const categoryGradients: Record<string, string> = {
  warehouse: "from-steel to-navy-lighter",
  manufacturing: "from-orange/10 to-navy-lighter",
  consumer: "from-cyan-glow/5 to-navy-lighter",
  medical: "from-violet/10 to-navy-lighter",
  healthcare: "from-violet/10 to-navy-lighter",
  delivery: "from-green/5 to-navy-lighter",
  construction: "from-orange/5 to-navy-lighter",
  agricultural: "from-green/10 to-navy-lighter",
  drone: "from-blue/10 to-navy-lighter",
  software: "from-violet/5 to-navy-lighter",
};

interface RobotCardProps {
  robot: RobotCardData;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
}

export function RobotCard({ robot, compareSelected, onCompareToggle, compareDisabled }: RobotCardProps) {
  const gradient = categoryGradients[robot.category_slug] || "from-steel to-navy-lighter";
  const isNew = robot.year_released && robot.year_released >= 2024;
  const hasDiscount = robot.price_msrp && robot.price_current && robot.price_msrp > robot.price_current;
  const specs = robot.specs as Record<string, unknown> | null;
  const specPills: string[] = [];
  if (specs) {
    if (specs.payload_kg) specPills.push(`${specs.payload_kg}kg payload`);
    if (specs.dof) specPills.push(`${specs.dof}-DOF`);
    if (specs.ip_rating) specPills.push(String(specs.ip_rating));
    if (specs.battery_hrs) specPills.push(`${specs.battery_hrs}h battery`);
    if (specs.suction_pa) specPills.push(`${Number(specs.suction_pa).toLocaleString()}Pa`);
  }

  return (
    <div className="glass glass-hover group relative flex flex-col rounded-xl transition-all duration-300 hover:-translate-y-1">
      {/* Compare checkbox */}
      {onCompareToggle && (
        <label className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-md bg-navy/70 px-2 py-1 text-xs backdrop-blur-sm">
          <input type="checkbox" checked={compareSelected} disabled={compareDisabled && !compareSelected} onChange={() => onCompareToggle(robot.id)} className="h-3.5 w-3.5 accent-blue" />
          <span className="text-muted">Compare</span>
        </label>
      )}

      {/* Image with category badge */}
      <Link href={`/explore/${robot.category_slug}/${robot.slug}`} className="block">
        <div className="relative h-44 overflow-hidden rounded-t-xl">
          {robot.image_url ? (
            <Image src={robot.image_url} alt={robot.name} fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br", gradient)}>
              <span className="text-3xl opacity-20">&#129302;</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          {/* Category pill */}
          <span className="absolute left-3 top-3 rounded-full bg-navy/70 px-2.5 py-0.5 text-[10px] font-medium text-foreground/80 backdrop-blur-sm">
            {robot.category_name || robot.category_slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </span>
          {/* New badge */}
          {isNew && !onCompareToggle && (
            <span className="absolute right-3 top-3 rounded-full bg-blue/90 px-2 py-0.5 text-[10px] font-bold text-navy">NEW</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
          <h3 className="font-semibold leading-tight transition-colors group-hover:text-blue">{robot.name}</h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted/60">by {robot.manufacturer_name}</p>

        {/* Score */}
        {robot.robo_score != null && robot.robo_score > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <RoboScoreBadge score={robot.robo_score} />
            <span className="text-[10px] text-muted/50">RoboScore</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <PriceDisplay price={robot.price_current} status={robot.status} size="md" />
          {hasDiscount && (
            <span className="font-mono text-xs text-muted line-through">{formatPrice(robot.price_msrp!)}</span>
          )}
        </div>

        {/* Spec pills */}
        {specPills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {specPills.slice(0, 3).map((s) => (
              <span key={s} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-muted/70">{s}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <Link
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className="block w-full rounded-lg bg-blue/10 py-2 text-center text-xs font-semibold text-blue transition-colors hover:bg-blue/20"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
