import { getAnimeEpisodes } from "@/lib/streaming/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return Response.json(
      { error: "Invalid anime ID." },
      { status: 400 },
    );
  }

  const episodes = getAnimeEpisodes(id);

  return Response.json(
    { animeId: id, episodes },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
