import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full resize-none rounded-3xl border border-guhr-border bg-white/85 px-4 py-3 text-sm leading-6 text-guhr-text outline-none transition placeholder:text-guhr-muted/70 focus:border-guhr-gold/70 focus:ring-4 focus:ring-guhr-gold/15",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
