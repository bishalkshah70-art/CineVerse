/**
 * Rule-based recommender. This is not machine learning.
 *
 * Scoring:
 *  1. Start from TMDB similar/recommendation candidates plus regional popular titles.
 *  2. Boost overlap with preferred genres, countries, and languages.
 *  3. Boost titles related to the watchlist / likes.
 *  4. Prefer fresher, well-reviewed titles without requiring huge popularity.
 *  5. Penalize disliked titles and near-duplicates of the same franchise seed.
 *  6. Diversify the final list by genre and origin country.
 */

export type RecTitle = {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  year: string | null;
  vote: number | null;
  voteCount?: number | null;
  popularity?: number | null;
  genreIds: number[];
  originCountry?: string[];
  originalLanguage?: string | null;
  overview?: string | null;
  source?: "similar" | "recommended" | "popular" | "watchlist";
  seedTitle?: string;
};

export type RecPrefs = {
  genres: number[];
  countries: string[];
  languages: string[];
  likes: Array<{ id: number; mediaType: "movie" | "tv" }>;
  dislikes: Array<{ id: number; mediaType: "movie" | "tv" }>;
  watchlist: Array<{ id: number; mediaType: "movie" | "tv"; title?: string }>;
};

export type RankedTitle = RecTitle & { score: number; reasons: string[] };

function keyOf(item: { id: number; mediaType: string }) {
  return `${item.mediaType}-${item.id}`;
}

export function scoreTitle(item: RecTitle, prefs: RecPrefs): RankedTitle {
  const reasons: string[] = [];
  let score = 0;

  const disliked = prefs.dislikes.some(
    (d) => d.id === item.id && d.mediaType === item.mediaType,
  );
  if (disliked) return { ...item, score: -1000, reasons: ["Hidden because you passed on this title"] };

  const genreHits = item.genreIds.filter((id) => prefs.genres.includes(id));
  if (genreHits.length) {
    score += genreHits.length * 6;
    reasons.push("Matches genres you follow");
  }

  const countryHits = (item.originCountry ?? []).filter((c) =>
    prefs.countries.includes(c),
  );
  if (countryHits.length) {
    score += 5;
    reasons.push("From a country you follow");
  }

  if (item.originalLanguage && prefs.languages.includes(item.originalLanguage)) {
    score += 4;
    reasons.push("In a language you follow");
  }

  if (item.source === "similar" || item.source === "recommended") {
    score += 8;
    if (item.seedTitle) reasons.push(`Because you saved ${item.seedTitle}`);
    else reasons.push("Similar to titles you saved");
  }

  if (item.vote && item.vote >= 7.2) {
    score += 3;
    if ((item.voteCount ?? 0) < 1500 && (item.popularity ?? 0) < 40) {
      score += 3;
      reasons.push("Well reviewed, less ubiquitous");
    } else {
      reasons.push("Strong audience rating");
    }
  }

  if (item.year) {
    const age = new Date().getFullYear() - Number(item.year);
    if (age >= 0 && age <= 2) score += 2;
  }

  score += Math.min(item.popularity ?? 0, 80) / 40;

  if (!reasons.length) reasons.push("Popular in your selected region");

  return { ...item, score, reasons };
}

export function rankRecommendations(
  candidates: RecTitle[],
  prefs: RecPrefs,
  limit = 24,
): RankedTitle[] {
  const blocked = new Set([
    ...prefs.watchlist.map(keyOf),
    ...prefs.dislikes.map(keyOf),
  ]);

  const scored = candidates
    .filter((item) => !blocked.has(keyOf(item)))
    .map((item) => scoreTitle(item, prefs))
    .filter((item) => item.score > -500)
    .sort((a, b) => b.score - a.score);

  const picked: RankedTitle[] = [];
  const usedGenres = new Map<number, number>();
  const usedCountries = new Map<string, number>();

  for (const item of scored) {
    if (picked.length >= limit) break;
    const g = item.genreIds[0];
    const c = item.originCountry?.[0];
    if (g != null && (usedGenres.get(g) ?? 0) >= 4) continue;
    if (c && (usedCountries.get(c) ?? 0) >= 4) continue;
    picked.push(item);
    if (g != null) usedGenres.set(g, (usedGenres.get(g) ?? 0) + 1);
    if (c) usedCountries.set(c, (usedCountries.get(c) ?? 0) + 1);
  }

  return picked;
}

export function explain(item: RankedTitle) {
  return item.reasons[0] ?? "Suggested from your local preferences";
}
