import { cn } from "@/lib/utils/cn";

interface PriceDisplayProps {
  price: number | null;
  status?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${price.toLocaleString()}`;
  return `$${price}`;
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-3xl",
};

export function PriceDisplay({ price, status, size = "md", className }: PriceDisplayProps) {
  if (status === "coming_soon") {
    return <span className={cn("font-medium text-muted", sizeClasses[size], className)}>Coming Soon</span>;
  }

  if (price == null) {
    return <span className={cn("font-medium text-orange", sizeClasses[size], className)}>Request Quote</span>;
  }

  return (
    <span className={cn("font-mono font-bold text-green", sizeClasses[size], className)}>
      {formatPrice(price)}
    </span>
  );
}
