"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";


type MovieDetails = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  episode_run_time?: number[];
  vote_average?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
};


type ProviderItem = {
  provider_id: number;
  provider_name: string;
  logo_path?: string;
};

type ProviderCountry = {
  link?: string;
  flatrate?: ProviderItem[];
  free?: ProviderItem[];
  ads?: ProviderItem[];
  rent?: ProviderItem[];
  buy?: ProviderItem[];
};
type Video = {
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
};

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [providers, setProviders] = useState<ProviderCountry | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [playbackMessage, setPlaybackMessage] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/tmdb?category=detail&type=tv&id=${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load this movie.");
        }

        setMovie(data.details);
        setVideos(data.videos?.results ?? []);
        setProviders(data.providers?.results?.NP ?? null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMovie();
    return () => controller.abort();
  }, [id]);

  const title = movie?.title ?? movie?.name ?? "Movie";
  const trailer = videos.find(
    (video) =>
      video.site === "YouTube" &&
      video.key &&
      video.type === "Trailer"
  ) ?? videos.find(
    (video) => video.site === "YouTube" && video.key
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090d] p-10 text-white">
        Loading movie details...
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-[#08090d] p-10 text-white">
        <p className="mb-5 text-red-400">{error || "TV show not found."}</p>
        <Link href="/" className="text-red-400 hover:text-red-300">
          ← Back to CineVerse
        </Link>
      </main>
    );
  }

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div
        className="relative min-h-[420px] bg-cover bg-center"
        style={backdrop ? { backgroundImage: `url("${backdrop}")` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/70 to-black/30" />

        <div className="relative mx-auto max-w-7xl px-5 py-8">
          <Link
            href="/"
            className="inline-block rounded-lg border border-white/20 bg-black/40 px-4 py-2 hover:bg-white/10"
          >
            ← Back to CineVerse
          </Link>

          <div className="flex flex-col items-start gap-8 pt-24 sm:flex-row sm:items-end">
            {poster && (
              <img
                src={poster}
                alt={`${title} poster`}
                className="w-44 rounded-xl shadow-2xl sm:w-56"
              />
            )}

            <div className="max-w-3xl pb-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-400">
                TV show details
              </p>
              <h1 className="text-4xl font-black sm:text-6xl">{title}</h1>

              <p className="mt-4 text-sm text-gray-300">
                {(movie.release_date ?? movie.first_air_date)?.slice(0, 4) || "Release date unavailable"}
                {movie.runtime ? ` · ${movie.runtime} min` : movie.episode_run_time?.[0] ? ` · ${movie.episode_run_time[0]} min per episode` : ""}
                {typeof movie.vote_average === "number"
                  ? ` · ★ ${movie.vote_average.toFixed(1)}/10`
                  : ""}
              </p>

              {movie.genres?.length ? (
                <p className="mt-3 text-sm text-gray-300">
                  {movie.genres.map((genre) => genre.name).join(" · ")}
                </p>
              ) : null}

              <p className="mt-5 max-w-2xl leading-7 text-gray-200">
                {movie.overview || "No description is available for this title."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/tv/${id}/episodes`}
                  className="inline-flex items-center rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                >
                  ▶ Watch Episodes
                </Link>
                {trailer ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-500"
                  >
                    ▶ Watch trailer
                  </a>
                ) : null}
              </div>
              <section className="mt-8 max-w-2xl rounded-xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-lg font-bold">Where to watch in Nepal</h2>
                {providers ? (
                  <>
                    {providers.link ? (
                      <a
                        href={providers.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-red-400 underline hover:text-red-300"
                      >
                        View official availability on TMDB
                      </a>
                    ) : null}
                    {([
                      ["Streaming", providers.flatrate],
                      ["Free", providers.free],
                      ["Free with ads", providers.ads],
                      ["Rent", providers.rent],
                      ["Buy", providers.buy],
                    ] as const).map(([label, items]) =>
                      items?.length ? (
                        <div key={label} className="mt-4">
                          <h3 className="text-sm font-semibold text-gray-300">{label}</h3>
                          <ul className="mt-2 flex flex-wrap gap-2">
                            {items.map((item) => (
                              <li
                                key={item.provider_id}
                                className="rounded-lg border border-white/10 px-3 py-2 text-sm"
                              >
                                {item.provider_name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null
                    )}
                    {!providers.link &&
                    !providers.flatrate?.length &&
                    !providers.free?.length &&
                    !providers.ads?.length &&
                    !providers.rent?.length &&
                    !providers.buy?.length ? (
                      <p className="mt-2 text-sm text-gray-400">
                        TMDB has no Nepal availability details for this title.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-400">
                    Nepal availability information is currently unavailable.
                  </p>
                )}
                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Availability can change. Check the provider&apos;s official page for current access and any fees.
                </p>
              </section>

              {!trailer ? (
                <p className="mt-3 text-sm text-gray-400">
                  No trailer is currently listed on TMDB.
                </p>
              ) : null}
              {playbackMessage ? (
                <p role="status" className="mt-4 max-w-2xl rounded-lg border border-white/15 bg-white/5 p-4 text-sm leading-6 text-gray-200">
                  {playbackMessage}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-gray-500">
        Movie information and artwork provided by TMDB. This site is not endorsed or certified by TMDB.
      </footer>
    </main>
  );
}
