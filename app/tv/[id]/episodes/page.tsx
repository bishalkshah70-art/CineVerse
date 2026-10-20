"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Season = {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
};

type Episode = {
  id: number;
  episode_number: number;
  name: string;
  overview?: string;
  air_date?: string;
  still_path?: string | null;
  runtime?: number | null;
};

type ShowDetails = {
  id: number;
  name?: string;
  title?: string;
  seasons?: Season[];
};

export default function EpisodesPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [show, setShow] = useState<ShowDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [seasonMenuOpen, setSeasonMenuOpen] = useState(false);
  const [loadingShow, setLoadingShow] = useState(true);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSeasonMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function loadShow() {
      try {
        setLoadingShow(true);
        setError("");

        const response = await fetch(
          `/api/tmdb?category=detail&type=tv&id=${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load this show.");
        }

        const details = data.details as ShowDetails;
        setShow(details);

        const availableSeasons = (details.seasons ?? [])
          .filter((season) => season.season_number >= 0)
          .sort((a, b) => a.season_number - b.season_number);

        setSeasons(availableSeasons);

        const firstSeason = availableSeasons.find(
          (season) => season.season_number > 0
        );

        setSelectedSeason(
          firstSeason?.season_number ?? availableSeasons[0]?.season_number ?? 1
        );
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoadingShow(false);
      }
    }

    loadShow();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!id || !show) return;

    const controller = new AbortController();

    async function loadEpisodes() {
      try {
        setLoadingEpisodes(true);
        setError("");

        const response = await fetch(
          `/api/tmdb?category=season&id=${encodeURIComponent(id)}&season=${selectedSeason}`,
          { signal: controller.signal }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load this season.");
        }

        setEpisodes(data.episodes ?? []);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
          setEpisodes([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoadingEpisodes(false);
      }
    }

    loadEpisodes();
    return () => controller.abort();
  }, [id, show, selectedSeason]);

  const title = show?.name ?? show?.title ?? "Anime";
  const activeSeason = seasons.find(
    (season) => season.season_number === selectedSeason
  );

  if (loadingShow) {
    return (
      <main className="min-h-screen bg-[#08090d] p-8 text-white">
        Loading anime seasons...
      </main>
    );
  }

  if (!show) {
    return (
      <main className="min-h-screen bg-[#08090d] p-8 text-white">
        <p className="mb-5 text-red-400">{error || "Show not found."}</p>
        <Link href={`/tv/${id}`} className="text-red-400 hover:underline">
          ← Back to CineVerse
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href={`/tv/${id}`}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to {title}
        </Link>

        <h1 className="mt-6 text-3xl font-black sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Episodes</p>

        <div className="relative mt-6 inline-block" ref={menuRef}>
          <button
            type="button"
            aria-expanded={seasonMenuOpen}
            onClick={() => setSeasonMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-lg border border-white/15 bg-[#191a22] px-4 py-3 font-semibold hover:border-red-500"
          >
            <span>{activeSeason?.name ?? `Season ${selectedSeason}`}</span>
            <svg
              className={`h-4 w-4 transition-transform ${seasonMenuOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {seasonMenuOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-white/15 bg-[#191a22] p-2 shadow-2xl">
              {seasons.map((season) => (
                <button
                  type="button"
                  key={season.id}
                  onClick={() => {
                    setSelectedSeason(season.season_number);
                    setSeasonMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-white/10 ${
                    selectedSeason === season.season_number
                      ? "bg-red-600/20 text-red-300"
                      : "text-gray-200"
                  }`}
                >
                  <span>{season.name}</span>
                  <span className="ml-3 text-xs text-gray-500">
                    {season.episode_count} eps
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          {error && <p className="mb-4 text-red-400">{error}</p>}

          {loadingEpisodes ? (
            <p className="py-8 text-gray-400">Loading episodes...</p>
          ) : episodes.length > 0 ? (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {episodes.map((episode) => (
                <article
                  key={episode.id}
                  className="flex gap-4 py-5 sm:gap-5"
                >
                  <div className="w-28 shrink-0 sm:w-44">
                    {episode.still_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        loading="lazy"
                        className="aspect-video w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-white/5 text-2xl text-gray-600">
                        ▶
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-red-400">
                      EPISODE {episode.episode_number}
                    </p>
                    <h2 className="mt-1 text-base font-bold sm:text-lg">
                      {episode.name || `Episode ${episode.episode_number}`}
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      {episode.air_date || "Release date unavailable"}
                      {episode.runtime ? ` · ${episode.runtime} min` : ""}
                    </p>
                    {episode.overview ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-400">
                        {episode.overview}
                      </p>
                    ) : null}

                    <Link
                      href={`/anime/watch/${encodeURIComponent(id)}?season=${selectedSeason}&episode=${episode.episode_number}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
                    >
                      <span>▶</span> Watch episode
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="py-8 text-gray-400">
              No episodes are listed for this season.
            </p>
          )}
        </div>

        <p className="mt-8 text-xs leading-5 text-gray-500">
          Episode information is provided by TMDB. Video playback requires an
          authorized streaming source for the selected episode.
        </p>
      </div>
    </main>
  );
}
