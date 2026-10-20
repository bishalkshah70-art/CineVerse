import { CatalogPage } from "@/components/catalog/CatalogPage";
import { MOVIE_COLLECTIONS } from "@/lib/catalog";

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      title="Movies"
      lead="Explore popular movies, new releases, and films from around the world."
      kind="movie"
      action="/movies"
      collections={MOVIE_COLLECTIONS}
      searchParams={searchParams}
    />
  );
}
