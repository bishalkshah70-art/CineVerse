"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GUEST_KEY,
  emptyGuest,
  hasSaved,
  parseGuest,
  toggleSaved,
  type GuestState,
  type SavedTitle,
} from "@/lib/guest";
import type { CardModel } from "@/lib/media";

type GuestContextValue = {
  state: GuestState;
  hydrated: boolean;
  toggleWatchlist: (item: SavedTitle) => void;
  toggleLike: (item: SavedTitle) => void;
  toggleDislike: (item: SavedTitle) => void;
  remember: (item: SavedTitle) => void;
  addSearch: (q: string) => void;
  clearSearches: () => void;
  setPrefs: (partial: Partial<Pick<GuestState, "genres" | "countries" | "languages">>) => void;
  inWatchlist: (id: number, mediaType: "movie" | "tv") => boolean;
};

const GuestContext = createContext<GuestContextValue | null>(null);

export function toSaved(item: Pick<CardModel, "id" | "mediaType" | "title" | "posterPath" | "year" | "vote">): SavedTitle {
  return {
    id: item.id,
    mediaType: item.mediaType,
    title: item.title,
    posterPath: item.posterPath,
    year: item.year,
    vote: item.vote,
  };
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GuestState>(emptyGuest);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(parseGuest(localStorage.getItem(GUEST_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(GUEST_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const value = useMemo<GuestContextValue>(
    () => ({
      state,
      hydrated,
      toggleWatchlist: (item) =>
        setState((s) => ({ ...s, watchlist: toggleSaved(s.watchlist, item) })),
      toggleLike: (item) =>
        setState((s) => ({
          ...s,
          likes: toggleSaved(s.likes, item),
          dislikes: s.dislikes.filter((x) => !(x.id === item.id && x.mediaType === item.mediaType)),
        })),
      toggleDislike: (item) =>
        setState((s) => ({
          ...s,
          dislikes: toggleSaved(s.dislikes, item),
          likes: s.likes.filter((x) => !(x.id === item.id && x.mediaType === item.mediaType)),
          watchlist: s.watchlist.filter((x) => !(x.id === item.id && x.mediaType === item.mediaType)),
        })),
      remember: (item) =>
        setState((s) => ({
          ...s,
          recent: [item, ...s.recent.filter((x) => !(x.id === item.id && x.mediaType === item.mediaType))].slice(0, 40),
        })),
      addSearch: (q) =>
        setState((s) => ({
          ...s,
          recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 8),
        })),
      clearSearches: () => setState((s) => ({ ...s, recentSearches: [] })),
      setPrefs: (partial) => setState((s) => ({ ...s, ...partial })),
      inWatchlist: (id, mediaType) => hasSaved(state.watchlist, id, mediaType),
    }),
    [state, hydrated],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}
