import { cn } from "@/lib/utils/cn";

interface SectorCodeProps {
  code: string;
  className?: string;
}

export function SectorCode({ code, className }: SectorCodeProps) {
  return (
    <span
      className={cn(
        "inline-flex font-mono text-[9px] font-bold tracking-wider text-electric-blue px-1.5 py-0.5 rounded-[2px]",
        className
      )}
      style={{
        background: "rgba(37,99,235,0.06)",
        border: "1px solid rgba(37,99,235,0.08)",
      }}
    >
      [{code}]
    </span>
  );
}

export const SECTOR_CODES: Record<string, string> = {
  warehouse: "WRH",
  manufacturing: "MFG",
  consumer: "CON",
  medical: "MED",
  construction: "CST",
  agricultural: "AGR",
  delivery: "DEL",
  drone: "UAV",
  software: "SFT",
  security: "SEC",
  hospitality: "HSP",
  mining: "MNG",
  eldercare: "ELD",
  retail: "RTL",
  exoskeleton: "EXO",
  underwater: "UND",
  space: "SPC",
};
