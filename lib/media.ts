import { titleOf, yearOf } from "./utils";
import type { MediaCard } from "./tmdb/schemas";

export type CardModel = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  originalTitle?: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  year: string | null;
  date: string | null;
  vote: number | null;
  voteCount: number | null;
  overview: string | null;
  genreIds: number[];
  originalLanguage?: string | null;
  originCountry?: string[];
  popularity?: number | null;
  runtime?: number | null;
  seasons?: number | null;
};

export function toCard(
  item: MediaCard,
  fallback: "movie" | "tv" = "movie",
): CardModel | null {
  if (item.media_type === "person") return null;
  const mediaType = item.media_type === "tv" || item.media_type === "movie"
    ? item.media_type
    : fallback;
  const title = titleOf(item);
  if (!item.id || title === "Untitled") return null;
  const date = item.release_date || item.first_air_date || null;
  return {
    id: item.id,
    mediaType,
    title,
    originalTitle: item.original_title || item.original_name || null,
    posterPath: item.poster_path ?? null,
    backdropPath: item.backdrop_path ?? null,
    year: yearOf(date),
    date,
    vote: item.vote_average && item.vote_average > 0 ? item.vote_average : null,
    voteCount: item.vote_count ?? null,
    overview: item.overview ?? null,
    genreIds: item.genre_ids ?? [],
    originalLanguage: item.original_language ?? null,
    originCountry: item.origin_country,
    popularity: item.popularity ?? null,
    runtime: item.runtime ?? null,
    seasons: item.number_of_seasons ?? null,
  };
}

export function toCards(items: MediaCard[], fallback: "movie" | "tv" = "movie") {
  return items
    .map((item) => toCard(item, fallback))
    .filter((item): item is CardModel => item !== null);
}

export function pickTrailer(
  videos?: Array<{ key: string; site: string; type: string; official?: boolean }>,
) {
  if (!videos?.length) return null;
  const youtube = videos.filter((v) => v.site === "YouTube");
  return (
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0] ||
    null
  );
}

export function officialYoutubeUrl(key: string) {
  return `https://www.youtube.com/embed/${encodeURIComponent(key)}?rel=0`;
}
