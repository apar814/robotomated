import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-white text-[#0A0F1E] font-bold hover:opacity-88 active:scale-[0.98]",
  secondary: "border border-white/[0.12] bg-white/[0.05] text-white/80 font-semibold hover:bg-white/[0.08] hover:border-white/[0.18]",
  ghost: "text-white/50 hover:text-white hover:bg-white/[0.05]",
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
        "inline-flex items-center justify-center rounded-[10px] px-6 py-2.5 text-sm transition-all disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
