import guhrLogo from "../../images/guhrlogo.png";

export function Header() {
  return (
    <header className="border-b border-guhr-border/70 bg-guhr-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <img
          src={guhrLogo}
          alt="Guhr Steuerberatungsgesellschaft mbH"
          className="h-14 w-auto max-w-[242px] object-contain sm:h-16 sm:max-w-[284px]"
        />
        <div className="inline-flex items-center rounded-full border border-guhr-border bg-white/88 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-guhr-text px-3.5 text-sm font-semibold text-white shadow-sm transition"
            aria-pressed="true"
          >
            <span className="text-lg leading-none" aria-hidden="true">🇬🇧</span>
            EN
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold text-guhr-muted transition hover:bg-guhr-background hover:text-guhr-text"
            aria-pressed="false"
          >
            <span className="flag-de h-5 w-5 shrink-0 rounded-full shadow-sm" aria-hidden="true" />
            DE
          </button>
        </div>
      </div>
    </header>
  );
}
