import { localeForLanguage } from "../lib/i18n";
import type { Language } from "../store/useLanguageStore";

function formatter(language: Language, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(localeForLanguage(language), options);
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function daysAgo(days: number, hour = 9) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function formatDate(value: string, language: Language = "de") {
  return formatter(language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatShortDate(value: string, language: Language = "de") {
  return formatter(language, {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function formatDateTime(value: string, language: Language = "de") {
  return formatter(language, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function daysSince(value: string) {
  const start = new Date(value).getTime();
  const now = new Date().getTime();
  return Math.max(0, Math.floor((now - start) / DAY_IN_MS));
}

export function isCurrentMonth(value: string) {
  const date = new Date(value);
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}
