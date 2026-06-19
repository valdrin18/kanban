import { cn } from "../../lib/utils";
import { useLanguageStore, type Language } from "../../store/useLanguageStore";
import guhrLogo from "../../images/guhrlogo.png";

export function Header() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  function languageButtonClass(target: Language) {
    return cn(
      "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold transition sm:h-9 sm:gap-2 sm:px-3.5 sm:text-sm",
      language === target
        ? "bg-guhr-text text-white shadow-sm"
        : "text-guhr-muted hover:bg-guhr-background hover:text-guhr-text",
    );
  }

  return (
    <header className="border-b border-guhr-border/70 bg-guhr-background/88 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3 px-3 py-1.5 sm:gap-4 sm:px-6 sm:py-2 lg:px-8">
        <img
          src={guhrLogo}
          alt="Guhr Steuerberatungsgesellschaft mbH"
          className="h-11 w-auto max-w-[176px] object-contain sm:h-16 sm:max-w-[284px]"
        />
        <div className="inline-flex shrink-0 items-center rounded-full border border-guhr-border bg-white/88 p-0.5 shadow-sm backdrop-blur sm:p-1">
          <button
            type="button"
            className={languageButtonClass("en")}
            aria-pressed={language === "en"}
            onClick={() => setLanguage("en")}
          >
            <span className="text-base leading-none sm:text-lg" aria-hidden="true">🇬🇧</span>
            EN
          </button>
          <button
            type="button"
            className={languageButtonClass("de")}
            aria-pressed={language === "de"}
            onClick={() => setLanguage("de")}
          >
            <span className="flag-de h-4 w-4 shrink-0 rounded-full shadow-sm sm:h-5 sm:w-5" aria-hidden="true" />
            DE
          </button>
        </div>
      </div>
    </header>
  );
}
