import { CatalogPage } from "@/components/catalog/CatalogPage";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requestedKind = Array.isArray(params.kind)
    ? params.kind[0]
    : params.kind;
  const kind = requestedKind === "tv" ? "tv" : "movie";

  return (
    <CatalogPage
      title="Discover"
      lead="Find something new with filters for genre, year, language, and more."
      kind={kind}
      action="/discover"
      searchParams={searchParams}
    />
  );
}
