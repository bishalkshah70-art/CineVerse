
import { NextResponse } from "next/server";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey || apiKey === "YOUR_V3_API_KEY") {
    return NextResponse.json(
      { error: "Configure a valid TMDB v3 API key in .env.local" },
      { status: 500 }
    );
  }

  const params = new URL(request.url).searchParams;
  const category = params.get("category") || "trending";
  const query = params.get("query")?.trim();
  const id = params.get("id");
  const type = params.get("type") === "tv" ? "tv" : "movie";

  const endpoints: Record<string, string> = {
    trending: "/trending/all/week",
    movies: "/movie/popular",
    tv: "/tv/popular",
  };

  try {
    if (category === "detail") {
      if (!id || !/^\d+$/.test(id)) {
        return NextResponse.json(
          { error: "A valid TMDB ID is required" },
          { status: 400 }
        );
      }

      const options = {
        headers: { accept: "application/json" },
        next: { revalidate: 300 },
      };

      const detailUrl = new URL(
        `${TMDB_BASE_URL}/${type}/${id}`
      );
      detailUrl.searchParams.set("api_key", apiKey);
      detailUrl.searchParams.set("language", "en-US");

      const videosUrl = new URL(
        `${TMDB_BASE_URL}/${type}/${id}/videos`
      );
      videosUrl.searchParams.set("api_key", apiKey);
      videosUrl.searchParams.set("language", "en-US");

      const [detailResponse, videosResponse] = await Promise.all([
        fetch(detailUrl, options),
        fetch(videosUrl, options),
      ]);

      if (!detailResponse.ok) {
        return NextResponse.json(
          { error: "Title not found on TMDB" },
          { status: detailResponse.status }
        );
      }

      const details = await detailResponse.json();
      const videos = videosResponse.ok
        ? await videosResponse.json()
        : { results: [] };

      return NextResponse.json({ details, videos });
    }

    let endpoint = endpoints[category];

    if (query) endpoint = "/search/multi";

    if (!endpoint) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("language", "en-US");

    if (query) {
      url.searchParams.set("query", query);
      url.searchParams.set("include_adult", "false");
    }

    const response = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TMDB request failed", status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to TMDB" },
      { status: 502 }
    );
  }
}
