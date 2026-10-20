export type SavedTitle = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  year: string | null;
  vote: number | null;
};

export type GuestState = {
  watchlist: SavedTitle[];
  likes: SavedTitle[];
  dislikes: SavedTitle[];
  recent: SavedTitle[];
  recentSearches: string[];
  genres: number[];
  countries: string[];
  languages: string[];
};

export const GUEST_KEY = "cineverse.guest.v1";

export const emptyGuest = (): GuestState => ({
  watchlist: [],
  likes: [],
  dislikes: [],
  recent: [],
  recentSearches: [],
  genres: [],
  countries: [],
  languages: [],
});

function isSavedTitle(value: unknown): value is SavedTitle {
  if (!value || typeof value !== "object") return false;
  const item = value as SavedTitle;
  return (
    typeof item.id === "number" &&
    (item.mediaType === "movie" || item.mediaType === "tv") &&
    typeof item.title === "string"
  );
}

export function parseGuest(raw: string | null): GuestState {
  const base = emptyGuest();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<GuestState>;
    return {
      watchlist: (parsed.watchlist ?? []).filter(isSavedTitle).slice(0, 200),
      likes: (parsed.likes ?? []).filter(isSavedTitle).slice(0, 200),
      dislikes: (parsed.dislikes ?? []).filter(isSavedTitle).slice(0, 200),
      recent: (parsed.recent ?? []).filter(isSavedTitle).slice(0, 40),
      recentSearches: Array.isArray(parsed.recentSearches)
        ? parsed.recentSearches.filter((s): s is string => typeof s === "string").slice(0, 8)
        : [],
      genres: Array.isArray(parsed.genres) ? parsed.genres.filter((n) => typeof n === "number") : [],
      countries: Array.isArray(parsed.countries) ? parsed.countries.filter((n) => typeof n === "string") : [],
      languages: Array.isArray(parsed.languages) ? parsed.languages.filter((n) => typeof n === "string") : [],
    };
  } catch {
    return base;
  }
}

export function toggleSaved(list: SavedTitle[], item: SavedTitle) {
  const exists = list.some((x) => x.id === item.id && x.mediaType === item.mediaType);
  if (exists) return list.filter((x) => !(x.id === item.id && x.mediaType === item.mediaType));
  return [item, ...list].slice(0, 200);
}

export function hasSaved(list: SavedTitle[], id: number, mediaType: "movie" | "tv") {
  return list.some((x) => x.id === id && x.mediaType === mediaType);
}
