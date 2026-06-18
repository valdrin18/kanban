import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "gold" | "green" | "orange" | "red" | "gray";
}

const toneClasses = {
  neutral: "border-guhr-border bg-white/80 text-guhr-muted",
  gold: "border-guhr-gold/25 bg-guhr-goldSoft text-[#77622E]",
  green: "border-green-200 bg-green-50 text-guhr-green",
  orange: "border-orange-200 bg-orange-50 text-guhr-orange",
  red: "border-red-200 bg-red-50 text-guhr-red",
  gray: "border-gray-200 bg-gray-100 text-guhr-gray",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
