import { describe, expect, it } from "vitest";
import { parseCatalog, toDiscoverParams } from "./catalog";

describe("catalog query mapping", () => {
  it("maps filters onto TMDB discover parameters", () => {
    const catalog = parseCatalog("movie", {
      genre: "28",
      country: "NP",
      language: "ne",
      year: "2024",
      minRating: "7",
      provider: "8",
      page: "2",
    });
    const params = toDiscoverParams(catalog, "NP", "en-US");
    expect(params.with_genres).toBe("28");
    expect(params.with_origin_country).toBe("NP");
    expect(params.with_original_language).toBe("ne");
    expect(params.primary_release_year).toBe("2024");
    expect(params["vote_average.gte"]).toBe("7");
    expect(params.with_watch_providers).toBe("8");
    expect(params.watch_region).toBe("NP");
    expect(params.page).toBe("2");
  });

  it("does not claim a provider without a region", () => {
    const catalog = parseCatalog("tv", { monetization: "free" });
    const params = toDiscoverParams(catalog, "US", "en-US");
    expect(params.with_watch_monetization_types).toBe("free");
    expect(params.watch_region).toBe("US");
  });
});
