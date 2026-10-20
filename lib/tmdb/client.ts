import "server-only";
import { cacheLife } from "next/cache";
import { z } from "zod";
import * as schemas from "./schemas";

const BASE = "https://api.themoviedb.org/3";

export class TmdbConfigError extends Error {
  constructor(message = "TMDB_READ_TOKEN is not set.") {
    super(message);
    this.name = "TmdbConfigError";
  }
}

export class TmdbRequestError extends Error {
  status: number;
  constructor(status: number, path: string) {
    super(`TMDB request failed (${status}) for ${path}`);
    this.status = status;
    this.name = "TmdbRequestError";
  }
}

function token() {
  const value = process.env.TMDB_READ_TOKEN;
  if (!value) throw new TmdbConfigError();
  return value;
}

async function cachedJson(path: string, query: Record<string, string>) {
  "use cache";
  cacheLife("hours");
  const auth = process.env.TMDB_READ_TOKEN;
  if (!auth) throw new TmdbConfigError();
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, value);
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${auth}`, Accept: "application/json" },
  });
  if (res.status === 429) throw new TmdbRequestError(429, path);
  if (!res.ok) throw new TmdbRequestError(res.status, path);
  return res.json();
}

async function liveJson(path: string, query: Record<string, string>) {
  const auth = token();
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, value);
  }
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${auth}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 429) throw new TmdbRequestError(429, path);
  if (!res.ok) throw new TmdbRequestError(res.status, path);
  return res.json();
}

export async function tmdb<T>(
  path: string,
  schema: z.ZodType<T>,
  params: Record<string, string> = {},
  live = false,
): Promise<T> {
  token();
  const json = live ? await liveJson(path, params) : await cachedJson(path, params);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Unexpected TMDB payload for ${path}`);
  }
  return parsed.data;
}

export function isConfigured() {
  return Boolean(process.env.TMDB_READ_TOKEN);
}

export function defaultRegion() {
  return process.env.TMDB_DEFAULT_REGION || "US";
}

export function defaultLanguage() {
  return process.env.TMDB_METADATA_LANGUAGE || "en-US";
}

export const tmdbApi = {
  page: (path: string, params: Record<string, string> = {}) =>
    tmdb(path, schemas.PagedMedia, params),
  list: async (path: string, params: Record<string, string> = {}) =>
    (await tmdb(path, schemas.PagedMedia, params)).results,
  movie: (id: string, language: string) =>
    tmdb(`/movie/${id}`, schemas.MovieDetail, {
      language,
      append_to_response: "videos,credits,similar,recommendations,watch/providers,release_dates",
    }),
  tv: (id: string, language: string) =>
    tmdb(`/tv/${id}`, schemas.TvDetail, {
      language,
      append_to_response: "videos,credits,similar,recommendations,watch/providers,content_ratings",
    }),
  season: (id: string, season: string, language: string) =>
    tmdb(`/tv/${id}/season/${season}`, schemas.SeasonDetail, { language }),
  person: (id: string, language: string) =>
    tmdb(`/person/${id}`, schemas.PersonDetail, {
      language,
      append_to_response: "combined_credits",
    }),
  network: (id: string) => tmdb(`/network/${id}`, schemas.NetworkDetail),
  countries: () => tmdb("/configuration/countries", z.array(schemas.Country)),
  languages: () => tmdb("/configuration/languages", z.array(schemas.Language)),
  movieGenres: (language: string) =>
    tmdb("/genre/movie/list", schemas.GenreList, { language }),
  tvGenres: (language: string) =>
    tmdb("/genre/tv/list", schemas.GenreList, { language }),
  movieProviders: (watchRegion: string) =>
    tmdb("/watch/providers/movie", schemas.ProviderList, { watch_region: watchRegion }),
  tvProviders: (watchRegion: string) =>
    tmdb("/watch/providers/tv", schemas.ProviderList, { watch_region: watchRegion }),
  search: (query: string, language: string) =>
    tmdb("/search/multi", schemas.PagedMedia, {
      query,
      language,
      include_adult: "false",
    }, true),
};
