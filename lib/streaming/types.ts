export type StreamSource = {
  id: string;
  label: string;
  url: string;
  type: "hls" | "mp4";
  audio: "sub" | "dub";
  subtitles?: {
    label: string;
    language: string;
    url: string;
  }[];
};

export type AnimeEpisode = {
  season: number;
  number: number;
  title: string;
  sources: StreamSource[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedMediaUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;

  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseSource(value: unknown): StreamSource | null {
  if (!isRecord(value)) return null;

  if (
    typeof value.id !== "string" ||
    typeof value.label !== "string" ||
    !isAllowedMediaUrl(value.url) ||
    (value.type !== "hls" && value.type !== "mp4") ||
    (value.audio !== "sub" && value.audio !== "dub")
  ) {
    return null;
  }

  const subtitles = Array.isArray(value.subtitles)
    ? value.subtitles.flatMap((item) => {
        if (
          !isRecord(item) ||
          typeof item.label !== "string" ||
          typeof item.language !== "string" ||
          !isAllowedMediaUrl(item.url)
        ) {
          return [];
        }

        return [{
          label: item.label,
          language: item.language,
          url: item.url,
        }];
      })
    : [];

  return {
    id: value.id,
    label: value.label,
    url: value.url,
    type: value.type,
    audio: value.audio,
    subtitles,
  };
}

export function getAnimeEpisodes(id: string): AnimeEpisode[] {
  const raw = process.env.ANIME_STREAMS_JSON;
  if (!raw || !id) return [];

  try {
    const config: unknown = JSON.parse(raw);
    if (!isRecord(config) || !Array.isArray(config[id])) return [];

    return config[id].flatMap((item): AnimeEpisode[] => {
      if (
        !isRecord(item) ||
        typeof item.number !== "number" ||
        !Number.isInteger(item.number) ||
        item.number < 1 ||
        typeof item.title !== "string" ||
        !Array.isArray(item.sources)
      ) {
        return [];
      }

      const season =
        typeof item.season === "number" &&
        Number.isInteger(item.season) &&
        item.season >= 0
          ? item.season
          : 1;

      return [{
        season,
        number: item.number,
        title: item.title,
        sources: item.sources
          .map(parseSource)
          .filter((source): source is StreamSource => source !== null),
      }];
    });
  } catch {
    console.error("ANIME_STREAMS_JSON is invalid JSON.");
    return [];
  }
}
