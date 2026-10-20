import { z } from "zod";

export const MediaCard = z
  .object({
    id: z.number(),
    title: z.string().optional(),
    name: z.string().optional(),
    original_title: z.string().optional(),
    original_name: z.string().optional(),
    poster_path: z.string().nullable().optional(),
    backdrop_path: z.string().nullable().optional(),
    overview: z.string().nullable().optional(),
    vote_average: z.number().optional(),
    vote_count: z.number().optional(),
    popularity: z.number().optional(),
    release_date: z.string().nullable().optional(),
    first_air_date: z.string().nullable().optional(),
    media_type: z.enum(["movie", "tv", "person"]).optional(),
    genre_ids: z.array(z.number()).optional(),
    original_language: z.string().optional(),
    origin_country: z.array(z.string()).optional(),
    adult: z.boolean().optional(),
    known_for_department: z.string().optional(),
    profile_path: z.string().nullable().optional(),
    runtime: z.number().nullable().optional(),
    number_of_seasons: z.number().optional(),
    number_of_episodes: z.number().optional(),
  })
  .passthrough();

export const PagedMedia = z
  .object({
    page: z.number().optional(),
    total_pages: z.number().optional(),
    total_results: z.number().optional(),
    results: z.array(MediaCard).default([]),
  })
  .passthrough();

export const Genre = z.object({ id: z.number(), name: z.string() });
export const GenreList = z.object({ genres: z.array(Genre) });

export const Country = z.object({
  iso_3166_1: z.string(),
  english_name: z.string(),
  native_name: z.string().optional(),
});

export const Language = z.object({
  iso_639_1: z.string(),
  english_name: z.string(),
  name: z.string().optional(),
});

export const Provider = z.object({
  provider_id: z.number(),
  provider_name: z.string(),
  logo_path: z.string().nullable().optional(),
  display_priority: z.number().optional(),
});

export const ProviderList = z.object({
  results: z.array(Provider).default([]),
});

const Offer = z
  .array(
    z.object({
      provider_id: z.number().optional(),
      provider_name: z.string(),
      logo_path: z.string().nullable().optional(),
    }),
  )
  .optional();

export const WatchProviders = z.object({
  id: z.number().optional(),
  results: z.record(
    z.string(),
    z.object({
      link: z.string().optional(),
      flatrate: Offer,
      free: Offer,
      ads: Offer,
      rent: Offer,
      buy: Offer,
    }),
  ),
});

export const Video = z.object({
  key: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean().optional(),
  name: z.string().optional(),
});

export const CastMember = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string().optional(),
  job: z.string().optional(),
  profile_path: z.string().nullable().optional(),
});

export const Company = z.object({
  id: z.number(),
  name: z.string(),
  origin_country: z.string().optional(),
});

export const Season = z.object({
  id: z.number().optional(),
  name: z.string(),
  season_number: z.number(),
  episode_count: z.number().optional(),
  air_date: z.string().nullable().optional(),
  overview: z.string().nullable().optional(),
  poster_path: z.string().nullable().optional(),
});

export const Episode = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string().nullable().optional(),
  episode_number: z.number(),
  season_number: z.number().optional(),
  air_date: z.string().nullable().optional(),
  still_path: z.string().nullable().optional(),
  runtime: z.number().nullable().optional(),
  vote_average: z.number().optional(),
});

export const MovieDetail = MediaCard.extend({
  genres: z.array(Genre).optional(),
  runtime: z.number().nullable().optional(),
  status: z.string().optional(),
  tagline: z.string().nullable().optional(),
  budget: z.number().optional(),
  revenue: z.number().optional(),
  homepage: z.string().nullable().optional(),
  imdb_id: z.string().nullable().optional(),
  production_countries: z
    .array(z.object({ iso_3166_1: z.string(), name: z.string() }))
    .optional(),
  production_companies: z.array(Company).optional(),
  spoken_languages: z.array(Language).optional(),
  videos: z.object({ results: z.array(Video) }).optional(),
  credits: z
    .object({
      cast: z.array(CastMember).optional(),
      crew: z.array(CastMember).optional(),
    })
    .optional(),
  similar: PagedMedia.optional(),
  recommendations: PagedMedia.optional(),
  "watch/providers": WatchProviders.optional(),
  release_dates: z
    .object({
      results: z.array(
        z.object({
          iso_3166_1: z.string(),
          release_dates: z.array(
            z.object({
              certification: z.string().optional(),
              release_date: z.string().optional(),
              type: z.number().optional(),
            }),
          ),
        }),
      ),
    })
    .optional(),
});

export const TvDetail = MediaCard.extend({
  genres: z.array(Genre).optional(),
  status: z.string().optional(),
  tagline: z.string().nullable().optional(),
  type: z.string().optional(),
  homepage: z.string().nullable().optional(),
  in_production: z.boolean().optional(),
  last_air_date: z.string().nullable().optional(),
  next_episode_to_air: Episode.nullable().optional(),
  last_episode_to_air: Episode.nullable().optional(),
  number_of_seasons: z.number().optional(),
  number_of_episodes: z.number().optional(),
  episode_run_time: z.array(z.number()).optional(),
  networks: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        logo_path: z.string().nullable().optional(),
        origin_country: z.string().optional(),
      }),
    )
    .optional(),
  created_by: z.array(CastMember).optional(),
  production_countries: z
    .array(z.object({ iso_3166_1: z.string(), name: z.string() }))
    .optional(),
  production_companies: z.array(Company).optional(),
  spoken_languages: z.array(Language).optional(),
  seasons: z.array(Season).optional(),
  content_ratings: z
    .object({
      results: z.array(
        z.object({ iso_3166_1: z.string(), rating: z.string() }),
      ),
    })
    .optional(),
  videos: z.object({ results: z.array(Video) }).optional(),
  credits: z
    .object({
      cast: z.array(CastMember).optional(),
      crew: z.array(CastMember).optional(),
    })
    .optional(),
  similar: PagedMedia.optional(),
  recommendations: PagedMedia.optional(),
  "watch/providers": WatchProviders.optional(),
});

export const SeasonDetail = z.object({
  id: z.number().optional(),
  name: z.string(),
  overview: z.string().nullable().optional(),
  season_number: z.number(),
  air_date: z.string().nullable().optional(),
  episodes: z.array(Episode).default([]),
});

export const PersonDetail = z.object({
  id: z.number(),
  name: z.string(),
  biography: z.string().nullable().optional(),
  birthday: z.string().nullable().optional(),
  deathday: z.string().nullable().optional(),
  place_of_birth: z.string().nullable().optional(),
  profile_path: z.string().nullable().optional(),
  known_for_department: z.string().optional(),
  combined_credits: z
    .object({
      cast: z.array(MediaCard).optional(),
      crew: z.array(MediaCard).optional(),
    })
    .optional(),
});

export const NetworkDetail = z.object({
  id: z.number(),
  name: z.string(),
  headquarters: z.string().optional(),
  homepage: z.string().nullable().optional(),
  logo_path: z.string().nullable().optional(),
  origin_country: z.string().optional(),
});

export type MediaCard = z.infer<typeof MediaCard>;
export type PagedMedia = z.infer<typeof PagedMedia>;
export type MovieDetail = z.infer<typeof MovieDetail>;
export type TvDetail = z.infer<typeof TvDetail>;
export type SeasonDetail = z.infer<typeof SeasonDetail>;
export type PersonDetail = z.infer<typeof PersonDetail>;
export type WatchProviders = z.infer<typeof WatchProviders>;
export type Provider = z.infer<typeof Provider>;
export type Genre = z.infer<typeof Genre>;
export type Country = z.infer<typeof Country>;
export type Language = z.infer<typeof Language>;
export type Episode = z.infer<typeof Episode>;
export type Video = z.infer<typeof Video>;
