import { Building2, ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-guhr-border/70 bg-guhr-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.35rem] border border-guhr-gold/25 bg-white shadow-sm">
            <span className="text-lg font-semibold tracking-normal text-guhr-gold">G</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-normal text-guhr-text sm:text-2xl">
                Guhr Onboarding CRM
              </h1>
              <span className="hidden rounded-full border border-guhr-border bg-white/70 px-2.5 py-1 text-xs font-medium text-guhr-muted sm:inline-flex">
                Berlin
              </span>
            </div>
            <p className="mt-1 text-sm text-guhr-muted">
              Mandanten-Onboarding für digitale Steuerberatung
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-guhr-muted">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-guhr-border bg-white/75 px-3 py-2">
            <Building2 className="h-4 w-4 text-guhr-gold" />
            Internal onboarding cockpit
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-guhr-border bg-white/75 px-3 py-2">
            <ShieldCheck className="h-4 w-4 text-guhr-green" />
            Local-first trial demo
          </div>
        </div>
      </div>
    </header>
  );
}
