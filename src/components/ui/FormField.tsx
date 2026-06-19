import { ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface FormFieldProps {
  children: ReactNode;
  icon: LucideIcon;
  label: string;
  select?: boolean;
}

export function FormField({ children, icon: Icon, label, select = false }: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-guhr-muted sm:mb-2 sm:text-sm">{label}</span>
      <span className="relative flex min-h-12 items-center gap-2.5 overflow-hidden rounded-[1.15rem] border border-guhr-border bg-white/82 px-3.5 shadow-sm transition focus-within:border-guhr-gold/45 focus-within:ring-4 focus-within:ring-guhr-gold/10 sm:min-h-14 sm:gap-3 sm:rounded-2xl sm:px-4">
        <Icon className="h-4 w-4 shrink-0 text-guhr-gold sm:h-5 sm:w-5" />
        <span className="min-w-0 flex-1">{children}</span>
        {select && (
          <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-guhr-muted" />
        )}
      </span>
    </label>
  );
}

export const embeddedFieldClassName = cn(
  "h-11 w-full rounded-none border-0 !bg-transparent px-0 text-sm text-guhr-text shadow-none outline-none ring-0 sm:h-12 sm:text-base",
  "focus:border-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
  "[&:-webkit-autofill]:shadow-[0_0_0_1000px_rgba(255,255,255,0)_inset]",
  "[&:-webkit-autofill]:[-webkit-text-fill-color:#1F2933]",
);

export const embeddedSelectClassName = cn(
  embeddedFieldClassName,
  "appearance-none pr-1",
);
