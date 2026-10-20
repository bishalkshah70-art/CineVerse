import { CatalogPage } from "@/components/catalog/CatalogPage";
import { TV_COLLECTIONS } from "@/lib/catalog";

export default async function TVPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <CatalogPage
      title="TV Shows"
      lead="Discover popular series, new episodes, and shows worth watching."
      kind="tv"
      action="/tv"
      collections={TV_COLLECTIONS}
      searchParams={searchParams}
    />
  );
}
