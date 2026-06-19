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
        <div className="inline-flex items-center rounded-full border border-guhr-border bg-white/82 p-1 shadow-sm backdrop-blur">
          <button
            type="button"
            className="rounded-full bg-guhr-text px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition"
            aria-pressed="true"
          >
            EN
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-guhr-muted transition hover:bg-guhr-background hover:text-guhr-text"
            aria-pressed="false"
          >
            DE
          </button>
        </div>
      </div>
    </header>
  );
}
