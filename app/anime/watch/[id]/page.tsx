import Link from "next/link";
import VideoPlayer from "@/components/media/VideoPlayer";
import { getAnimeEpisodes } from "@/lib/streaming/types";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    season?: string;
    episode?: string;
    audio?: string;
    server?: string;
  }>;
};

export default async function AnimeWatchPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const query = await searchParams;

  if (!/^\d+$/.test(id)) {
    return (
      <main className="min-h-screen bg-[#08090d] p-8 text-white">
        Invalid anime ID.
      </main>
    );
  }

  const episodes = getAnimeEpisodes(id);
  const seasonNumber = Math.max(0, Number(query.season) || 1);
  const episodeNumber = Math.max(1, Number(query.episode) || 1);
  const audio = query.audio === "dub" ? "dub" : "sub";

  const seasonEpisodes = episodes
    .filter((item) => (item.season ?? 1) === seasonNumber)
    .sort((a, b) => a.number - b.number);

  const episode = seasonEpisodes.find(
    (item) => item.number === episodeNumber
  );

  const sources =
    episode?.sources.filter((item) => item.audio === audio) ?? [];

  const source =
    sources.find((item) => item.id === query.server) ?? sources[0];

  const seasons = [...new Set(episodes.map((item) => item.season ?? 1))]
    .sort((a, b) => a - b);

  function watchHref(
    season: number,
    number: number,
    language = audio,
    server?: string
  ) {
    const search = new URLSearchParams({
      season: String(season),
      episode: String(number),
      audio: language,
    });

    if (server) search.set("server", server);

    return `/anime/watch/${id}?${search.toString()}`;
  }

  const currentIndex = seasonEpisodes.findIndex(
    (item) => item.number === episodeNumber
  );
  const previous = currentIndex > 0 ? seasonEpisodes[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < seasonEpisodes.length - 1
      ? seasonEpisodes[currentIndex + 1]
      : null;

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <header className="border-b border-white/10 bg-[#0d0e14]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-7">
          <Link href="/anime" className="text-xl font-black tracking-tight">
            <span className="text-red-500">CINE</span>VERSE
            <span className="ml-2 text-xs font-medium text-gray-500">
              ANIME
            </span>
          </Link>
          <Link
            href="/anime"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            ← Anime catalog
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            Now watching
          </p>
          <h1 className="mt-2 text-2xl font-black sm:text-3xl">
            {episode?.title || `Episode ${episodeNumber}`}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Anime ID {id} <span className="mx-2">•</span>
            Season {seasonNumber} <span className="mx-2">•</span>
            Episode {episodeNumber}
          </p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
              {source ? (
                <VideoPlayer
                  key={`${id}-${seasonNumber}-${episodeNumber}-${audio}-${source.id}`}
                  src={source.url}
                  title={episode?.title || `Episode ${episodeNumber}`}
                  captions={source.subtitles?.[0]?.url}
                />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center bg-[#0b0c12] p-6 text-center sm:p-10">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400">
                    ▶
                  </div>
                  <h2 className="text-xl font-bold">No stream configured</h2>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-gray-400">
                    There is no authorized video source for this episode and
                    audio language. Add a compatible HLS or MP4 source that
                    you own or are authorized to stream.
                  </p>
                  <p className="mt-3 text-xs text-gray-600">
                    Metadata and video playback are provided separately.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#101117] p-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Audio
                </p>
                <div className="mt-2 flex gap-2">
                  {(["sub", "dub"] as const).map((language) => (
                    <Link
                      key={language}
                      href={watchHref(seasonNumber, episodeNumber, language)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                        audio === language
                          ? "bg-red-500 text-white"
                          : "border border-white/10 text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {language === "sub" ? "Subtitles" : "Dub"}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {previous ? (
                  <Link
                    href={watchHref(seasonNumber, previous.number)}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="rounded-lg border border-white/5 px-3 py-2 text-sm text-gray-600">
                    ← Previous
                  </span>
                )}

                {next ? (
                  <Link
                    href={watchHref(seasonNumber, next.number)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold hover:bg-red-400"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="rounded-lg border border-white/5 px-3 py-2 text-sm text-gray-600">
                    Next →
                  </span>
                )}
              </div>
            </div>

            <section className="mt-5 rounded-xl border border-white/10 bg-[#101117] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold">Playback servers</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {sources.length} {sources.length === 1 ? "source" : "sources"} available for {audio === "sub" ? "subtitles" : "dub"}
                  </p>
                </div>
                <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                  {source ? "Source selected" : "Unavailable"}
                </span>
              </div>

              {sources.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sources.map((item, index) => (
                    <Link
                      key={item.id}
                      href={watchHref(
                        seasonNumber,
                        episodeNumber,
                        audio,
                        item.id
                      )}
                      className={`rounded-lg border px-4 py-2 text-sm ${
                        source?.id === item.id
                          ? "border-red-500 bg-red-500/10 text-red-300"
                          : "border-white/10 text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {item.label || `Server ${index + 1}`}
                      {source?.id === item.id ? " ✓" : ""}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  No authorized {audio === "sub" ? "subtitle" : "dub"} servers
                  are configured for this episode.
                </p>
              )}
            </section>
          </section>

          <aside className="overflow-hidden rounded-xl border border-white/10 bg-[#101117]">
            <div className="border-b border-white/10 p-4">
              <h2 className="font-bold">Episodes</h2>
              <p className="mt-1 text-xs text-gray-500">
                {seasonEpisodes.length} configured episodes
              </p>

              {seasons.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <Link
                      key={season}
                      href={watchHref(season, 1)}
                      className={`rounded-md border px-3 py-1.5 text-xs ${
                        season === seasonNumber
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-white/10 text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      Season {season}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="max-h-[560px] space-y-1 overflow-y-auto p-2">
              {seasonEpisodes.length ? (
                seasonEpisodes.map((item) => {
                  const selected = item.number === episodeNumber;

                  return (
                    <Link
                      key={`${item.season}-${item.number}`}
                      href={watchHref(seasonNumber, item.number)}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        selected
                          ? "border-red-500/40 bg-red-500/10"
                          : "border-transparent hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-md text-sm font-bold ${
                          selected
                            ? "bg-red-500 text-white"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {item.number}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          Episode {item.number}
                        </span>
                      </span>
                      {selected && (
                        <span className="text-xs font-semibold text-red-400">
                          NOW
                        </span>
                      )}
                    </Link>
                  );
                })
              ) : (
                <div className="p-5 text-sm leading-6 text-gray-500">
                  No episodes are configured for this season yet. Add episode
                  metadata and authorized sources to your server-side
                  configuration.
                </div>
              )}
            </div>
          </aside>
        </div>

        <p className="mt-6 text-xs leading-5 text-gray-600">
          CineVerse uses separate metadata and playback sources. Configure
          only videos you own or are authorized to distribute.
        </p>
      </div>
    </main>
  );
}
