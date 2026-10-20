import { ANIME_KEYWORD, FEATURED_PROVIDERS } from "./constants";
import { uniqueById } from "./utils";
import { tmdbApi } from "./tmdb/client";
import { toCards, type CardModel } from "./media";

export type RailModel = {
  id: string;
  title: string;
  href?: string;
  note?: string;
  items: CardModel[];
};

async function safeList(
  path: string,
  fallback: "movie" | "tv" | "all",
  params: Record<string, string> = {},
) {
  try {
    const results = await tmdbApi.list(path, params);
    const type = fallback === "all" ? "movie" : fallback;
    return toCards(results, type).map((item, index) => {
      const raw = results[index];
      if (raw?.media_type === "tv" || raw?.media_type === "movie") {
        return { ...item, mediaType: raw.media_type };
      }
      if (fallback === "all" && raw?.title) return { ...item, mediaType: "movie" as const };
      if (fallback === "all" && raw?.name) return { ...item, mediaType: "tv" as const };
      return item;
    });
  } catch {
    return [];
  }
}

export async function loadHomeRails(region: string, language: string) {
  const common = { language, region };
  const [
    trendingDay,
    trendingWeek,
    popularMovies,
    popularTv,
    latestMovies,
    latestTv,
    upcomingMovies,
    upcomingTv,
    topMovies,
    topTv,
    worldwide,
    regionalMovies,
    regionalTv,
    acclaimed,
    anime,
    asian,
    international,
    hidden,
    ...providerChunks
  ] = await Promise.all([
    safeList("/trending/all/day", "all", { language }),
    safeList("/trending/all/week", "all", { language }),
    safeList("/movie/popular", "movie", common),
    safeList("/tv/popular", "tv", { language }),
    safeList("/movie/now_playing", "movie", common),
    safeList("/tv/airing_today", "tv", { language }),
    safeList("/movie/upcoming", "movie", common),
    safeList("/discover/tv", "tv", {
      language,
      sort_by: "first_air_date.desc",
      "first_air_date.gte": new Date().toISOString().slice(0, 10),
      "first_air_date.lte": new Date(Date.now() + 1000 * 60 * 60 * 24 * 120)
        .toISOString()
        .slice(0, 10),
    }),
    safeList("/movie/top_rated", "movie", common),
    safeList("/tv/top_rated", "tv", { language }),
    safeList("/trending/all/week", "all", { language }),
    safeList("/discover/movie", "movie", {
      language,
      region,
      with_origin_country: region,
      sort_by: "popularity.desc",
    }),
    safeList("/discover/tv", "tv", {
      language,
      with_origin_country: region,
      sort_by: "popularity.desc",
    }),
    safeList("/discover/movie", "movie", {
      language,
      sort_by: "vote_average.desc",
      "vote_count.gte": "400",
      "vote_average.gte": "7.5",
    }),
    safeList("/discover/tv", "tv", {
      language,
      with_keywords: ANIME_KEYWORD,
      sort_by: "popularity.desc",
    }),
    safeList("/discover/tv", "tv", {
      language,
      with_origin_country: "KR|JP|CN|TW|TH",
      sort_by: "popularity.desc",
    }),
    safeList("/discover/movie", "movie", {
      language,
      sort_by: "popularity.desc",
      "with_origin_country": "FR|IN|NG|BR|IR|TR|ES|IT|DE|MX",
    }),
    safeList("/discover/movie", "movie", {
      language,
      sort_by: "vote_average.desc",
      "vote_count.gte": "80",
      "vote_count.lte": "1500",
      "vote_average.gte": "7.2",
    }),
    ...FEATURED_PROVIDERS.slice(0, 6).map((provider) =>
      safeList("/discover/movie", "movie", {
        language,
        watch_region: region,
        with_watch_providers: String(provider.id),
        with_watch_monetization_types: "flatrate",
        sort_by: "popularity.desc",
      }),
    ),
  ]);

  const free = await safeList("/discover/movie", "movie", {
    language,
    watch_region: region,
    with_watch_monetization_types: "free|ads",
    sort_by: "popularity.desc",
  });

  const featured = uniqueById(trendingDay.filter((item) => item.backdropPath)).slice(0, 8);

  const rails: RailModel[] = [
    { id: "trend-day", title: "Trending today", href: "/trending", items: trendingDay },
    { id: "trend-week", title: "Trending this week", href: "/trending?window=week", items: trendingWeek },
    { id: "pop-movies", title: "Popular movies", href: "/movies", items: popularMovies },
    { id: "pop-tv", title: "Popular TV shows", href: "/tv", items: popularTv },
    { id: "latest-movies", title: "Latest movies", href: "/latest?type=movie", items: latestMovies },
    { id: "latest-tv", title: "Latest TV shows", href: "/latest?type=tv", items: latestTv },
    { id: "upcoming-movies", title: "Upcoming movies", href: "/upcoming?type=movie", items: upcomingMovies },
    { id: "upcoming-tv", title: "Upcoming TV shows", href: "/upcoming?type=tv", items: upcomingTv },
    { id: "top-movies", title: "Top-rated movies", href: "/top-rated?type=movie", items: topMovies },
    { id: "top-tv", title: "Top-rated TV shows", href: "/top-rated?type=tv", items: topTv },
    { id: "worldwide", title: "Popular worldwide", href: "/trending", items: worldwide },
    {
      id: "regional",
      title: `Popular in ${region}`,
      href: `/countries/${region.toLowerCase()}`,
      items: uniqueById([...regionalMovies, ...regionalTv]),
    },
    {
      id: "acclaimed",
      title: "Critically acclaimed",
      href: "/movies?sort=vote_average.desc&minRating=7.5",
      items: acclaimed,
    },
    { id: "hidden", title: "Hidden gems", note: "Highly rated titles with quieter popularity.", items: hidden },
    { id: "anime", title: "Popular anime", href: "/anime", items: anime },
    { id: "asian", title: "Popular Asian dramas", href: "/tv?country=KR", items: asian },
    { id: "intl", title: "International cinema", href: "/countries", items: international },
    ...FEATURED_PROVIDERS.slice(0, 6).map((provider, index) => ({
      id: `provider-${provider.id}`,
      title: `Popular on ${provider.name}`,
      href: `/providers/${provider.id}`,
      note: `Titles TMDB associates with ${provider.name} in ${region}. Availability still varies by subscription and catalog.`,
      items: providerChunks[index] ?? [],
    })),
    {
      id: "free",
      title: "Free-to-watch discoveries",
      href: "/discover?monetization=free",
      note: "Based on TMDB/JustWatch free or ad-supported offers in your selected region.",
      items: free,
    },
  ];

  const seen = new Set(featured.map((item) => `${item.mediaType}-${item.id}`));
  const deduped = rails
    .map((rail) => ({
      ...rail,
      items: rail.items.filter((item) => {
        const key = `${item.mediaType}-${item.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    }))
    .filter((rail) => rail.items.length > 0);

  return { featured, rails: deduped };
}
