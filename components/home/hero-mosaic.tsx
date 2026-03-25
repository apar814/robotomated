"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { RoboScoreBadge } from "@/components/ui/robo-score";

interface MosaicRobot {
  slug: string;
  name: string;
  robo_score: number | null;
  image_url: string | null;
  manufacturer_name: string;
  category_slug: string;
}

const ROTATIONS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];
const OFFSETS = ["translate-y-2", "-translate-y-1", "-translate-y-3", "translate-y-1"];

export function HeroMosaic({ robots }: { robots: MosaicRobot[] }) {
  const items = robots.slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div className="relative mx-auto grid h-[360px] w-full max-w-[480px] grid-cols-2 gap-3 p-4">
      {/* Radial glow behind mosaic */}
      <div className="pointer-events-none absolute inset-0 -z-10 m-auto h-[300px] w-[300px] rounded-full bg-blue opacity-[0.08] blur-[100px]" />
      {items.map((robot, i) => {
        const hasImage = robot.image_url && !robot.image_url.includes("unsplash");
        return (
          <Link
            key={robot.slug}
            href={`/explore/${robot.category_slug}/${robot.slug}`}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] transition-all duration-300 hover:border-blue/30 hover:shadow-[0_8px_30px_rgba(0,194,255,0.1)] ${ROTATIONS[i]} ${OFFSETS[i]}`}
          >
            {hasImage ? (
              <SafeImage
                src={robot.image_url!}
                alt={robot.name}
                className="object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                fallbackLabel={robot.manufacturer_name}
                fallbackSublabel={robot.name}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-3 text-center">
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/15">{robot.manufacturer_name}</span>
                <span className="mt-1 text-sm font-bold text-white/25">{robot.name}</span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1E]/80 via-transparent to-transparent" />

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-0 p-3">
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[10px] text-white/30">{robot.manufacturer_name}</p>
                  <p className="truncate text-xs font-semibold text-white/90">{robot.name}</p>
                </div>
                {robot.robo_score != null && robot.robo_score > 0 && (
                  <RoboScoreBadge score={robot.robo_score} className="shrink-0 text-[9px]" />
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
