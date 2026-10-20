import Link from "next/link";
import { EmptyState, SetupNotice } from "@/components/ui/EmptyState";
import { PosterGrid } from "@/components/media/PosterCard";
import { Filters } from "./Filters";
import { parseCatalog, toDiscoverParams, type Collection, type MediaKind } from "@/lib/catalog";
import { tmdbApi, TmdbConfigError } from "@/lib/tmdb/client";
import { toCards } from "@/lib/media";
import { getViewerContext } from "@/lib/region";

export async function CatalogPage({
  title,
  lead,
  kind,
  action,
  collections,
  searchParams,
  preset,
}: {
  title: string;
  lead: string;
  kind: MediaKind;
  action: string;
  collections?: Collection[];
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  preset?: Record<string, string>;
}) {
  const sp = await searchParams;
  const { region, language } = await getViewerContext();
  const catalog = parseCatalog(kind, sp);
  const discover = { ...toDiscoverParams(catalog, region, language), ...preset };

  const data = await (async () => {
    try {
      return await Promise.all([
        tmdbApi.page(`/discover/${kind}`, discover),
        tmdbApi.movieGenres(language),
        tmdbApi.tvGenres(language),
        tmdbApi.countries(),
        tmdbApi.languages(),
        tmdbApi.movieProviders(region),
        tmdbApi.tvProviders(region),
      ]);
    } catch (error) {
      if (error instanceof TmdbConfigError) return null;
      throw error;
    }
  })();

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SetupNotice />
      </div>
    );
  }

  const [page, movieGenres, tvGenres, countries, languages, movieProviders, tvProviders] = data;
  const items = toCards(page.results, kind);
  const genres = (kind === "movie" ? movieGenres.genres : tvGenres.genres)
    .map((g) => ({ id: g.id, name: g.name }));
  const countryOpts = countries
    .slice()
    .sort((a, b) => a.english_name.localeCompare(b.english_name))
    .map((c) => ({ id: c.iso_3166_1, name: c.english_name }));
  const languageOpts = languages
    .slice()
    .sort((a, b) => a.english_name.localeCompare(b.english_name))
    .map((l) => ({ id: l.iso_639_1, name: l.english_name }));
  const providers = (kind === "movie" ? movieProviders.results : tvProviders.results)
    .slice()
    .sort((a, b) => (a.display_priority ?? 99) - (b.display_priority ?? 99))
    .slice(0, 80)
    .map((provider) => ({
      id: provider.provider_id,
      name: provider.provider_name,
    }));

  const nextPage = (page.page ?? 1) + 1;
  const prevPage = (page.page ?? 1) - 1;
  const qs = new URLSearchParams(
    Object.entries(sp).flatMap(([key, value]) => {
      const first = Array.isArray(value) ? value[0] : value;
      return first && key !== "page" ? [[key, first]] : [];
    }),
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-8">
      <header>
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{lead}</p>
      </header>

      {collections?.length ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {collections.map((collection) => (
            <Link
              key={collection.href + collection.label}
              href={collection.href}
              className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm hover:border-accent"
            >
              {collection.label}
            </Link>
          ))}
        </div>
      ) : null}

      <Filters
        action={action}
        kind={kind}
        genres={genres}
        countries={countryOpts}
        languages={languageOpts}
        providers={providers}
      />

      {items.length ? (
        <PosterGrid items={items} />
      ) : (
        <EmptyState
          title="No titles match these filters"
          body="Try a wider year range or clear the provider filter. Coverage depends on TMDB metadata for this region."
        />
      )}

      <div className="flex justify-center gap-3 text-sm">
        {prevPage >= 1 ? (
          <Link
            href={`${action}?${qs.toString()}&page=${prevPage}`}
            className="rounded-full border border-line px-4 py-2"
          >
            Previous
          </Link>
        ) : null}

        {nextPage <= (page.total_pages ?? 1) ? (
          <Link
            href={`${action}?${qs.toString()}&page=${nextPage}`}
            className="rounded-full border border-line px-4 py-2"
          >
            Next
          </Link>
        ) : null}
      </div>
    </div>
  );
}
