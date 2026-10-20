import { ANIME_KEYWORD } from "./constants";
import { firstParam, clampPage } from "./utils";

export type MediaKind = "movie" | "tv";

export type CatalogQuery = {
  kind: MediaKind;
  page: number;
  genre?: string;
  country?: string;
  language?: string;
  year?: string;
  yearFrom?: string;
  yearTo?: string;
  minRating?: string;
  sort?: string;
  provider?: string;
  monetization?: string;
  runtimeMin?: string;
  runtimeMax?: string;
  status?: string;
  type?: string;
  keyword?: string;
  query?: string;
};

export function parseCatalog(
  kind: MediaKind,
  searchParams: Record<string, string | string[] | undefined>,
): CatalogQuery {
  const sortDefault = kind === "movie" ? "popularity.desc" : "popularity.desc";
  return {
    kind,
    page: clampPage(firstParam(searchParams.page)),
    genre: firstParam(searchParams.genre),
    country: firstParam(searchParams.country),
    language: firstParam(searchParams.language),
    year: firstParam(searchParams.year),
    yearFrom: firstParam(searchParams.yearFrom),
    yearTo: firstParam(searchParams.yearTo),
    minRating: firstParam(searchParams.minRating),
    sort: firstParam(searchParams.sort) || sortDefault,
    provider: firstParam(searchParams.provider),
    monetization: firstParam(searchParams.monetization),
    runtimeMin: firstParam(searchParams.runtimeMin),
    runtimeMax: firstParam(searchParams.runtimeMax),
    status: firstParam(searchParams.status),
    type: firstParam(searchParams.type),
    keyword: firstParam(searchParams.keyword),
    query: firstParam(searchParams.q),
  };
}

export function toDiscoverParams(
  catalog: CatalogQuery,
  region: string,
  language: string,
): Record<string, string> {
  const dateField = catalog.kind === "movie" ? "primary_release_date" : "first_air_date";
  const yearField = catalog.kind === "movie" ? "primary_release_year" : "first_air_date_year";
  const params: Record<string, string> = {
    language,
    region,
    include_adult: "false",
    page: String(catalog.page),
    sort_by: catalog.sort || "popularity.desc",
    "vote_count.gte": catalog.sort?.startsWith("vote_average") ? "50" : "",
  };

  if (catalog.genre) params.with_genres = catalog.genre;
  if (catalog.country) params.with_origin_country = catalog.country;
  if (catalog.language) params.with_original_language = catalog.language;
  if (catalog.year) params[yearField] = catalog.year;
  if (catalog.yearFrom) params[`${dateField}.gte`] = `${catalog.yearFrom}-01-01`;
  if (catalog.yearTo) params[`${dateField}.lte`] = `${catalog.yearTo}-12-31`;
  if (catalog.minRating) params["vote_average.gte"] = catalog.minRating;
  if (catalog.runtimeMin) params["with_runtime.gte"] = catalog.runtimeMin;
  if (catalog.runtimeMax) params["with_runtime.lte"] = catalog.runtimeMax;
  if (catalog.status) params.with_status = catalog.status;
  if (catalog.type) params.with_type = catalog.type;
  if (catalog.keyword) params.with_keywords = catalog.keyword;
  if (catalog.provider) {
    params.with_watch_providers = catalog.provider;
    params.watch_region = region;
    params.with_watch_monetization_types = catalog.monetization || "flatrate|free|ads|rent|buy";
  } else if (catalog.monetization) {
    params.with_watch_monetization_types = catalog.monetization;
    params.watch_region = region;
  }

  return Object.fromEntries(Object.entries(params).filter(([, v]) => v));
}

export function animeDefaults(extra: Partial<CatalogQuery> = {}): CatalogQuery {
  return {
    kind: "tv",
    page: extra.page ?? 1,
    keyword: ANIME_KEYWORD,
    ...extra,
  };
}

export type Collection = {
  href: string;
  label: string;
  hint?: string;
};

export const MOVIE_COLLECTIONS: Collection[] = [
  { href: "/movies", label: "Popular" },
  { href: "/trending?type=movie", label: "Trending" },
  { href: "/latest?type=movie&scope=released", label: "Latest releases" },
  { href: "/upcoming?type=movie", label: "Upcoming" },
  { href: "/top-rated?type=movie", label: "Top rated" },
  { href: "/movies?sort=popularity.desc", label: "Genre collections", hint: "Use filters" },
  { href: "/countries", label: "Country collections" },
  { href: "/languages", label: "Language collections" },
  { href: "/movies?yearFrom=2020&yearTo=2029", label: "2020s" },
  { href: "/movies?yearFrom=2010&yearTo=2019", label: "2010s" },
  { href: "/movies?yearFrom=2000&yearTo=2009", label: "2000s" },
  { href: "/movies?yearFrom=1990&yearTo=1999", label: "1990s" },
  { href: "/movies?yearFrom=1980&yearTo=1989", label: "1980s" },
  { href: "/movies?yearFrom=1950&yearTo=1979", label: "Classic cinema" },
  { href: "/movies?genre=16", label: "Animated films" },
  { href: "/movies?genre=10751", label: "Family movies" },
  { href: "/movies?genre=99", label: "Documentaries" },
  { href: "/movies?sort=vote_average.desc&minRating=7.5", label: "Critically acclaimed" },
  { href: "/discover?kind=movie&country=IN", label: "International films" },
  { href: "/movies?runtimeMax=40", label: "Short films" },
];

export const TV_COLLECTIONS: Collection[] = [
  { href: "/tv", label: "Popular series" },
  { href: "/trending?type=tv", label: "Trending series" },
  { href: "/latest?type=tv&scope=released", label: "Latest premieres" },
  { href: "/tv?status=0", label: "Returning series" },
  { href: "/tv?status=0&sort=first_air_date.desc", label: "Currently airing" },
  { href: "/upcoming?type=tv", label: "Upcoming series" },
  { href: "/tv?status=3&sort=first_air_date.desc", label: "Recently completed" },
  { href: "/tv?status=3", label: "Ended series" },
  { href: "/tv?type=2", label: "Miniseries" },
  { href: "/genres/tv-35", label: "Sitcoms" },
  { href: "/genres/tv-80", label: "Crime" },
  { href: "/genres/tv-18", label: "Dramas" },
  { href: "/genres/tv-99", label: "Documentaries" },
  { href: "/tv?type=3", label: "Reality" },
  { href: "/genres/tv-10764", label: "Reality (genre)" },
  { href: "/genres/tv-10763", label: "News" },
  { href: "/tv?type=5", label: "Talk shows" },
  { href: "/genres/tv-10767", label: "Talk" },
  { href: "/genres/tv-10766", label: "Soap operas" },
  { href: "/genres/tv-16", label: "Animated series" },
  { href: "/anime", label: "Anime" },
  { href: "/genres/tv-10762", label: "Kids" },
  { href: "/tv?country=KR", label: "International dramas" },
  { href: "/genres/tv-36", label: "Historical" },
  { href: "/genres/tv-10765", label: "Sci-Fi & Fantasy" },
  { href: "/genres/tv-9648", label: "Mystery" },
];

export const ANIME_COLLECTIONS: Collection[] = [
  { href: "/anime", label: "Popular anime" },
  { href: "/anime?sort=first_air_date.desc", label: "Trending / recent" },
  { href: "/anime?yearFrom=" + new Date().getFullYear(), label: "Upcoming / this year" },
  { href: "/anime?status=0", label: "Currently airing" },
  { href: "/anime?status=3", label: "Completed" },
  { href: "/movies?genre=16&language=ja", label: "Anime movies" },
  { href: "/anime?type=4", label: "TV anime" },
  { href: "/discover?kind=tv&language=ja&genre=16", label: "Japanese animation" },
  { href: "/discover?kind=tv&language=zh&genre=16", label: "Chinese animation / donghua" },
  { href: "/discover?kind=tv&genre=16", label: "International animation" },
  { href: "/movies?genre=16&genreExtra=&country=", label: "Family animation" },
  { href: "/genres/movie-16", label: "Animated movies" },
];
