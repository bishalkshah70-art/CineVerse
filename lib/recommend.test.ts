import { describe, expect, it } from "vitest";
import { rankRecommendations, type RecTitle, type RecPrefs } from "./recommend";

const prefs: RecPrefs = {
  genres: [18, 16],
  countries: ["JP", "NP"],
  languages: ["ja"],
  likes: [],
  dislikes: [{ id: 9, mediaType: "movie" }],
  watchlist: [{ id: 1, mediaType: "movie", title: "Seed" }],
};

function title(partial: Partial<RecTitle> & Pick<RecTitle, "id" | "title">): RecTitle {
  return {
    mediaType: "movie",
    posterPath: null,
    year: "2024",
    vote: 7.5,
    voteCount: 200,
    popularity: 20,
    genreIds: [18],
    originCountry: ["US"],
    originalLanguage: "en",
    source: "popular",
    ...partial,
  };
}

describe("rankRecommendations", () => {
  it("excludes watchlist and disliked titles", () => {
    const ranked = rankRecommendations(
      [
        title({ id: 1, title: "Seed" }),
        title({ id: 9, title: "Nope" }),
        title({ id: 3, title: "Drama" }),
      ],
      prefs,
      10,
    );
    expect(ranked.map((r) => r.id)).toEqual([3]);
  });

  it("boosts preferred countries, languages, and similar seeds", () => {
    const ranked = rankRecommendations(
      [
        title({ id: 10, title: "Generic hit", popularity: 90, vote: 6, genreIds: [28] }),
        title({
          id: 11,
          title: "Kyoto story",
          originCountry: ["JP"],
          originalLanguage: "ja",
          genreIds: [16],
          source: "similar",
          seedTitle: "Seed",
        }),
      ],
      prefs,
      10,
    );
    expect(ranked[0].title).toBe("Kyoto story");
    expect(ranked[0].reasons.some((r) => r.includes("saved"))).toBe(true);
  });

  it("caps how often one country repeats", () => {
    const many = Array.from({ length: 10 }, (_, i) =>
      title({
        id: 100 + i,
        title: `JP ${i}`,
        originCountry: ["JP"],
        originalLanguage: "ja",
        genreIds: [16],
      }),
    );
    const ranked = rankRecommendations(many, prefs, 10);
    expect(ranked.length).toBeLessThanOrEqual(4);
  });
});
