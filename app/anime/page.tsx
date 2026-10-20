import { CatalogPage } from "@/components/catalog/CatalogPage";
import { ANIME_COLLECTIONS } from "@/lib/catalog";

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      title="Anime"
      lead="Explore Japanese anime, animated series, and donghua."
      kind="tv"
      action="/anime"
      collections={ANIME_COLLECTIONS}
      searchParams={searchParams}
      preset={{
        with_genres: "16",
        with_original_language: "ja",
      }}
    />
  );
}
