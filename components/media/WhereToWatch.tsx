import { logoSrc } from "@/lib/tmdb/images";
import type { WatchProviders } from "@/lib/tmdb/schemas";

const GROUPS = [
  { key: "flatrate", label: "Subscription" },
  { key: "free", label: "Free" },
  { key: "ads", label: "Free with ads" },
  { key: "rent", label: "Rent" },
  { key: "buy", label: "Buy" },
] as const;

export function WhereToWatch({
  data,
  region,
}: {
  data?: WatchProviders;
  region: string;
}) {
  const local = data?.results?.[region];
  if (!local) {
    return (
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-xl">Where to watch</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          TMDB has no JustWatch availability for {region}. That does not mean the
          title is unavailable everywhere — only that this region has no verified
          offers in the metadata source. Try another region in the header.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-display text-xl">Where to watch in {region}</h2>
      <p className="mt-1 text-xs text-muted">
        Offers come from TMDB / JustWatch. Links go to legitimate storefronts.
        Pricing and catalogs change; CineVerse does not sell subscriptions.
      </p>
      <div className="mt-4 space-y-4">
        {GROUPS.map((group) => {
          const offers = local[group.key];
          if (!offers?.length) return null;
          return (
            <div key={group.key}>
              <h3 className="text-xs uppercase tracking-wider text-muted">{group.label}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {offers.map((offer) => (
                  <li key={`${group.key}-${offer.provider_name}`}>
                    <a
                      href={local.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm"
                    >
                      {offer.logo_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logoSrc(offer.logo_path) ?? ""}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded"
                        />
                      ) : null}
                      {offer.provider_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      {local.link ? (
        <a
          href={local.link}
          className="mt-4 inline-block text-sm text-accent"
          target="_blank"
          rel="noreferrer"
        >
          Open JustWatch listing
        </a>
      ) : null}
    </section>
  );
}
