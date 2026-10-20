import { describe, expect, it } from "vitest";
import { parseGuest, toggleSaved } from "./guest";

describe("guest storage", () => {
  it("recovers from invalid JSON", () => {
    expect(parseGuest("{not json")).toEqual(parseGuest(null));
  });

  it("toggles watchlist items", () => {
    const item = {
      id: 1,
      mediaType: "movie" as const,
      title: "Dune",
      posterPath: null,
      year: "2021",
      vote: 8,
    };
    const once = toggleSaved([], item);
    expect(once).toHaveLength(1);
    expect(toggleSaved(once, item)).toHaveLength(0);
  });
});
