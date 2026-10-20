import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ANIME_COLLECTIONS } from "@/lib/catalog";
import { ANIME_KEYWORD } from "@/lib/constants";

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      title="Anime"
      lead="Explore anime series, Japanese animation, and new favourites."
      kind="tv"
      action="/anime"
      collections={ANIME_COLLECTIONS}
      searchParams={searchParams}
      preset={{ with_keywords: String(ANIME_KEYWORD) }}
    />
  );
}
