"use client";

import { useEffect, useState } from "react";
import { Rail } from "@/components/media/Rail";
import { useGuest } from "@/components/guest/GuestProvider";
import type { CardModel } from "@/lib/media";

type RecResponse = {
  sections: Array<{ id: string; title: string; note?: string; items: CardModel[] }>;
};

export function ClientRails() {
  const { state, hydrated } = useGuest();
  const [sections, setSections] = useState<RecResponse["sections"]>([]);

  useEffect(() => {
    if (!hydrated) return;
    const ctrl = new AbortController();
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: ctrl.signal,
      body: JSON.stringify({
        watchlist: state.watchlist,
        likes: state.likes,
        dislikes: state.dislikes,
        genres: state.genres,
        countries: state.countries,
        languages: state.languages,
      }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: RecResponse | null) => {
        if (data?.sections) setSections(data.sections);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [hydrated, state.watchlist, state.likes, state.dislikes, state.genres, state.countries, state.languages]);

  if (!sections.length) return null;
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <Rail key={section.id} title={section.title} note={section.note} items={section.items} />
      ))}
    </div>
  );
}
