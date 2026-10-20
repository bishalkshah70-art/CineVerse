"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useGuest } from "@/components/guest/GuestProvider";
import { mediaPath } from "@/lib/utils";

type Hit = {
  id: number;
  mediaType: "movie" | "tv" | "person";
  title: string;
  year?: string | null;
  posterPath?: string | null;
  rating?: number;
};

export function SearchControls() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { state, addSearch, clearSearches } = useGuest();
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setHits([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/tmdb?query=${encodeURIComponent(trimmed)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = (await res.json()) as {
          results?: Array<{
            id: number;
            media_type?: string;
            title?: string;
            name?: string;
            poster_path?: string | null;
            release_date?: string;
            first_air_date?: string;
            vote_average?: number;
          }>;
        };

        const normalized: Hit[] = (data.results ?? [])
          .filter((item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            Number.isFinite(item.id)
          )
          .map((item) => ({
            id: item.id,
            mediaType: item.media_type as "movie" | "tv",
            title: item.title ?? item.name ?? "Untitled",
            year: (item.release_date ?? item.first_air_date)?.slice(0, 4),
            posterPath: item.poster_path,
            rating: item.vote_average,
          }));

        setHits(normalized.slice(0, 8));
      } catch (e) {
        if ((e as Error).name !== "AbortError") setError("Could not search right now.");
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => window.clearTimeout(handle);
  }, [q, open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-muted"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-xl rounded-2xl border border-line bg-surface p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!q.trim()) return;
                addSearch(q.trim());
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
              }}
            >
              <Search className="h-5 w-5 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search titles, people, genres…"
                className="w-full bg-transparent py-2 outline-none"
                aria-label="Search query"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close search">
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="mt-3 max-h-80 overflow-y-auto text-sm">
              {loading ? <p className="text-muted">Searching…</p> : null}
              {error ? (
                <p className="text-danger">
                  {error}{" "}
                  <button type="button" className="underline" onClick={() => setQ(q + " ")}>
                    Retry
                  </button>
                </p>
              ) : null}
              {!q && state.recentSearches.length ? (
                <div>
                  <div className="mb-2 flex justify-between text-xs text-muted">
                    <span>Recent searches</span>
                    <button type="button" onClick={clearSearches}>
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {state.recentSearches.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/search?q=${encodeURIComponent(item)}`}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-2 py-2 hover:bg-surface-2"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {hits.length ? (
                <ul className="space-y-1">
                  {hits.map((hit) => (
                    <li key={`${hit.mediaType}-${hit.id}`}>
                      <Link
                        href={mediaPath(hit.mediaType, hit.id)}
                        onClick={() => {
                          addSearch(q.trim());
                          setOpen(false);
                        }}
                        className="block rounded-lg px-2 py-2 hover:bg-surface-2"
                      >
                        <span className="flex items-center gap-3">
                          {hit.posterPath ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${hit.posterPath}`}
                              alt=""
                              className="h-16 w-11 shrink-0 rounded object-cover"
                            />
                          ) : (
                            <span className="flex h-16 w-11 shrink-0 items-center justify-center rounded bg-surface-2 text-xs text-muted">
                              No image
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block font-medium">{hit.title}</span>
                            <span className="block text-xs capitalize text-muted">
                              {hit.mediaType === "tv" ? "TV show" : "Movie"}
                              {hit.year ? ` · ${hit.year}` : ""}
                              {typeof hit.rating === "number" && hit.rating > 0
                                ? ` · ★ ${hit.rating.toFixed(1)}/10`
                                : ""}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : q.trim().length >= 2 && !loading ? (
                <p className="text-muted">No matching titles.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
