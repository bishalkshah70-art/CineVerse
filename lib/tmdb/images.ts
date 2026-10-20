export type PosterSize = "w185" | "w342" | "w500" | "w780";
export type BackdropSize = "w780" | "w1280" | "original";
export type ProfileSize = "w185" | "h632";

const BASE = "https://image.tmdb.org/t/p";

export function tmdbImage(
  path: string | null | undefined,
  size: string = "w342",
) {
  if (!path) return null;
  return `${BASE}/${size}${path}`;
}

export function posterSrc(path: string | null | undefined, size: PosterSize = "w342") {
  return tmdbImage(path, size);
}

export function backdropSrc(
  path: string | null | undefined,
  size: BackdropSize = "w1280",
) {
  return tmdbImage(path, size);
}

export function logoSrc(path: string | null | undefined) {
  return tmdbImage(path, "w154");
}
