"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useGuest, toSaved } from "./GuestProvider";
import type { CardModel } from "@/lib/media";
import { cn } from "@/lib/utils";

export function WatchlistButton({
  item,
  compact = false,
}: {
  item: Pick<CardModel, "id" | "mediaType" | "title" | "posterPath" | "year" | "vote">;
  compact?: boolean;
}) {
  const { inWatchlist, toggleWatchlist, hydrated } = useGuest();
  const saved = hydrated && inWatchlist(item.id, item.mediaType);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(toSaved(item));
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-black/70 text-ink ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-black/85",
        compact ? "p-1.5" : "px-3 py-1.5 text-sm",
      )}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`}
    >
      {saved ? <BookmarkCheck className="h-4 w-4 text-accent" /> : <Bookmark className="h-4 w-4" />}
      {compact ? null : <span>{saved ? "In watchlist" : "Watchlist"}</span>}
    </button>
  );
}
