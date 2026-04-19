import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { SECTOR_CODES } from "@/components/ui/sector-code";

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

function getScoreGlow(score: number): string {
  if (score >= 80) return "0 0 10px rgba(16,185,129,0.35)";
  if (score >= 60) return "0 0 10px rgba(245,158,11,0.3)";
  return "0 0 10px rgba(239,68,68,0.3)";
}

function getKeySpecs(
  specs: Record<string, unknown> | null
): { label: string; value: string }[] {
  if (!specs) return [];
  const results: { label: string; value: string }[] = [];
  if (specs.payload_kg)
    results.push({ label: "PAYLOAD", value: `${specs.payload_kg}KG` });
  if (specs.reach_mm)
    results.push({ label: "REACH", value: `${specs.reach_mm}MM` });
  if (specs.battery_hrs)
    results.push({ label: "RANGE", value: `${specs.battery_hrs}H` });
  if (specs.max_speed)
    results.push({
      label: "SPEED",
      value: String(specs.max_speed).toUpperCase(),
    });
  if (specs.dof) results.push({ label: "DOF", value: `${specs.dof}` });
  if (specs.weight_kg)
    results.push({ label: "WEIGHT", value: `${specs.weight_kg}KG` });
  if (specs.suction_pa)
    results.push({
      label: "SUCTION",
      value: `${Number(specs.suction_pa).toLocaleString()}PA`,
    });
  if (specs.ip_rating)
    results.push({ label: "PROTECTION", value: String(specs.ip_rating) });
  return results;
}

// Keep original single-spec function for backwards compatibility
function getKeySpec(
  specs: Record<string, unknown> | null
): { label: string; value: string } | null {
  const all = getKeySpecs(specs);
  return all.length > 0 ? all[0] : null;
}

interface RobotCardProps {
  robot: RobotCardData;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  compareDisabled?: boolean;
}

export function RobotCard({
  robot,
  compareSelected,
  onCompareToggle,
  compareDisabled,
}: RobotCardProps) {
  const hasRealImage =
    robot.image_url && !robot.image_url.includes("unsplash.com");
  const specs = robot.specs as Record<string, unknown> | null;
  const keySpecs = getKeySpecs(specs);
  const sectorCode = SECTOR_CODES[robot.category_slug];

  return (
    <div
      className="card-2080 holo-card morphing-border group flex flex-col"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty("--holo-x", `${x}%`);
        e.currentTarget.style.setProperty("--holo-y", `${y}%`);
        e.currentTarget.style.setProperty("--holo-opacity", "1");
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--holo-opacity", "0");
      }}
    >
      {/* Compare checkbox */}
      {onCompareToggle && (
        <label
          className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-xs backdrop-blur-sm"
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
      <Link
        href={`/explore/${robot.category_slug}/${robot.slug}`}
        className="block"
      >
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
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="h-10 w-10"
                style={{ color: "rgba(37,99,235,0.3)" }}
              >
                <rect
                  x="12"
                  y="8"
                  width="24"
                  height="20"
                  rx="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="18" r="2.5" fill="currentColor" />
                <circle cx="28" cy="18" r="2.5" fill="currentColor" />
                <rect
                  x="18"
                  y="28"
                  width="12"
                  height="8"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="14"
                  cy="40"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="34"
                  cy="40"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="mt-1 font-[family-name:var(--font-ui)] text-[13px] font-semibold uppercase tracking-[0.1em] text-white/65">
                {robot.manufacturer_name}
              </span>
              <span className="mt-0.5 font-[family-name:var(--font-ui)] text-sm font-bold text-white">
                {robot.name}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(18,18,18,0.95) 100%)",
            }}
          />

          {/* Category badge - top left */}
          {sectorCode && (
            <div
              className="absolute left-3 top-3 z-10 rounded-md px-2.5 py-1"
              style={{
                background: "rgba(8,8,8,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="font-[family-name:var(--font-brand)] text-[9px] uppercase tracking-[0.15em] text-white/70">
                {robot.category_name || robot.category_slug}
              </span>
            </div>
          )}

          {/* RoboScore badge - top right — circular gauge */}
          {robot.robo_score != null && robot.robo_score > 0 && (
            <div
              className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: "rgba(8,8,8,0.8)",
                backdropFilter: "blur(12px)",
                border: `2px solid ${getScoreColor(robot.robo_score)}`,
                boxShadow: getScoreGlow(robot.robo_score),
              }}
            >
              <span
                className="font-[family-name:var(--font-brand)] text-[14px] font-bold"
                style={{ color: getScoreColor(robot.robo_score) }}
              >
                {robot.robo_score}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info area */}
      <div className="flex flex-1 flex-col p-4">
        {/* Manufacturer */}
        <span className="font-[family-name:var(--font-brand)] text-[9px] uppercase tracking-[0.15em] text-[#0EA5E9]">
          {robot.manufacturer_name}
        </span>

        {/* Robot name */}
        <Link href={`/explore/${robot.category_slug}/${robot.slug}`}>
          <h3 className="mt-1.5 font-[family-name:var(--font-ui)] text-[16px] font-semibold leading-tight text-white transition-colors group-hover:text-[#0EA5E9]">
            {robot.name}
          </h3>
        </Link>

        {/* Spec pills — horizontal scroll */}
        {keySpecs.length > 0 && (
          <div className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-none">
            {keySpecs.map((spec) => (
              <span
                key={spec.label}
                className="shrink-0 rounded border px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] text-white/50"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {spec.label} {spec.value}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div
          className="my-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        />

        {/* Bottom row: price + action */}
        <div className="mt-auto flex items-center justify-between">
          {robot.price_current != null ? (
            <span className="font-[family-name:var(--font-mono)] text-[18px] font-bold text-[#C8FF00]">
              {formatPrice(robot.price_current)}
            </span>
          ) : (
            <span className="font-[family-name:var(--font-mono)] text-[11px] font-medium text-white/35">
              Contact for pricing
            </span>
          )}
          <Link
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className="rounded border px-2.5 py-1 font-[family-name:var(--font-brand)] text-[9px] tracking-[0.1em] transition-all duration-150 hover:bg-[#0EA5E9] hover:text-black focus-visible:bg-[#0EA5E9] focus-visible:text-black"
            style={{
              background: "rgba(14,165,233,0.1)",
              borderColor: "rgba(14,165,233,0.25)",
              color: "#0EA5E9",
            }}
            aria-label={`Explore ${robot.name}`}
          >
            EXPLORE &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
