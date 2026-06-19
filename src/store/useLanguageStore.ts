import { create } from "zustand";

export type Language = "en" | "de";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

function initialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("guhr-language") === "de" ? "de" : "en";
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLanguage(),
  setLanguage: (language) => {
    window.localStorage.setItem("guhr-language", language);
    set({ language });
  },
}));
