const dateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
});

const dateTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function daysAgo(days: number, hour = 9) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatShortDate(value: string) {
  return shortDateFormatter.format(new Date(value));
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
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
