export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function titleOf(item: {
  title?: string | null;
  name?: string | null;
}) {
  return item.title || item.name || "Untitled";
}

export function yearOf(date?: string | null) {
  if (!date || date.length < 4) return null;
  return date.slice(0, 4);
}

export function formatDate(date?: string | null, locale = "en-US") {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function formatVote(value?: number | null) {
  if (value == null || value <= 0) return null;
  return value.toFixed(1);
}

export function mediaPath(type: "movie" | "tv" | "person", id: number) {
  if (type === "movie") return `/movie/${id}`;
  if (type === "tv") return `/tv/${id}`;
  return `/person/${id}`;
}

export function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function clampPage(value: string | undefined, fallback = 1) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(Math.floor(n), 500);
}

export function uniqueById<T extends { id: number; mediaType?: string }>(
  items: T[],
) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.mediaType ?? "x"}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function runtimeLabel(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}
