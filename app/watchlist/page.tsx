"use client";

import Link from "next/link";
import { useGuest } from "@/components/guest/GuestProvider";
import { mediaPath } from "@/lib/utils";

export default function WatchlistPage() {
  const { state, hydrated, toggleWatchlist } = useGuest();

  if (!hydrated) {
    return <main className="px-4 py-10">Loading your watchlist...</main>;
  }

  const items = state.watchlist;

  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl space-y-6 px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl">My Watchlist</h1>
      <p className="text-muted">
        Movies and TV shows you&apos;ve saved to watch later.
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line p-8 text-center">
          <h2 className="text-xl font-semibold">Your list is empty</h2>
          <p className="mt-2 text-muted">
            Browse movies and TV shows, then use the Watchlist button to save them here.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link className="rounded-full border border-line px-4 py-2" href="/movies">
              Browse movies
            </Link>
            <Link className="rounded-full border border-line px-4 py-2" href="/tv">
              Browse TV
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={`${item.mediaType}-${item.id}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-line p-4"
            >
              <Link
                className="min-w-0 flex-1"
                href={mediaPath(item.mediaType, item.id)}
              >
                <span className="block truncate font-medium">{item.title}</span>
                <span className="text-sm capitalize text-muted">
                  {item.mediaType === "tv" ? "TV show" : "Movie"}
                </span>
              </Link>
              <button
                type="button"
                className="shrink-0 rounded-full border border-line px-3 py-2 text-sm"
                onClick={() => toggleWatchlist(item)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
