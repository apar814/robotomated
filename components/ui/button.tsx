import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-navy hover:opacity-90",
  secondary: "border border-border text-foreground hover:bg-navy-lighter",
  ghost: "text-muted hover:text-foreground hover:bg-navy-lighter",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
