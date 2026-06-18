import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}

const variantClasses = {
  primary:
    "border-guhr-gold bg-guhr-gold text-white shadow-sm hover:bg-[#B99A4D] focus-visible:ring-guhr-gold/35",
  secondary:
    "border-guhr-border bg-white/82 text-guhr-text shadow-sm hover:border-guhr-gold/45 hover:bg-white focus-visible:ring-guhr-gold/25",
  ghost:
    "border-transparent bg-transparent text-guhr-muted hover:bg-white/70 hover:text-guhr-text focus-visible:ring-guhr-gold/20",
  danger:
    "border-red-200 bg-red-50 text-guhr-red hover:bg-red-100 focus-visible:ring-red-200",
};

const sizeClasses = {
  sm: "h-9 gap-2 px-3 text-sm",
  md: "h-10 gap-2.5 px-4 text-sm",
  icon: "h-9 w-9 justify-center p-0",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border font-medium transition duration-200 ease-out focus:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
