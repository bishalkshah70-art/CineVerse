import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line px-4 py-10 text-sm text-muted sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-ink">{BRAND.name}</p>
          <p className="mt-2 max-w-xl leading-6">{BRAND.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2">
          <Link href="/discover">Discover</Link>
          <Link href="/countries">Countries</Link>
          <Link href="/providers">Where to watch</Link>
          <Link href="/latest">Latest</Link>
          <Link href="/profile">Preferences</Link>
          <Link href="/watchlist">Watchlist</Link>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-[1400px] text-xs leading-5">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
        Streaming availability data is provided by JustWatch via TMDB. CineVerse
        does not host full-length movies or episodes. Smart-TV apps are a
        separate product surface from this responsive website.
      </p>
    </footer>
  );
}
