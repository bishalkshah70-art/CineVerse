import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { mediaPath } from "@/lib/utils";
import { posterSrc } from "@/lib/tmdb/images";
import type { CardModel } from "@/lib/media";
import { WatchlistButton } from "@/components/guest/WatchlistButton";

export function PosterCard({
  item,
  sizes = "(max-width: 640px) 46vw, (max-width: 1024px) 22vw, 160px",
}: {
  item: CardModel;
  sizes?: string;
}) {
  const href = mediaPath(item.mediaType, item.id);
  const src = posterSrc(item.posterPath);
  return (
    <article className="group relative w-full min-w-0">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2 ring-1 ring-line">
          {src ? (
            <Image
              src={src}
              alt={`${item.title} poster`}
              fill
              sizes={sizes}
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-end bg-linear-to-br from-surface-2 to-bg p-3 text-sm text-muted">
              {item.title}
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/70 to-transparent" />
          {item.vote ? (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px]">
              <Star className="h-3 w-3 fill-accent text-accent" aria-hidden />
              {item.vote.toFixed(1)}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm leading-5">{item.title}</h3>
        <p className="text-xs text-muted">
          {item.year ?? "Date unknown"} · {item.mediaType === "tv" ? "TV" : "Movie"}
        </p>
      </Link>
      <div className="absolute right-2 top-2">
        <WatchlistButton item={item} compact />
      </div>
    </article>
  );
}

export function PosterGrid({ items }: { items: CardModel[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((item) => (
        <div key={`${item.mediaType}-${item.id}`} className="w-auto min-w-0">
          <PosterCard item={item} />
        </div>
      ))}
    </div>
  );
}
