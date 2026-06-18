import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-2xl border border-guhr-border bg-white/85 px-3 text-sm text-guhr-text outline-none transition placeholder:text-guhr-muted/70 focus:border-guhr-gold/70 focus:ring-4 focus:ring-guhr-gold/15",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
