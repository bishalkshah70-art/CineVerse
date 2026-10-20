import { connection } from "next/server";
import { Suspense } from "react";
import { HeroCarousel } from "@/components/media/HeroCarousel";
import { Rail } from "@/components/media/Rail";
import { ClientRails } from "@/components/recs/ClientRails";
import { SetupNotice } from "@/components/ui/EmptyState";
import { loadHomeRails } from "@/lib/rails";
import { getViewerContext } from "@/lib/region";
import { TmdbConfigError } from "@/lib/tmdb/client";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="h-[70vh] animate-pulse bg-surface" />}>
      <HomeContent />
    </Suspense>
  );
}

async function loadHomeContentData() {
  try {
    const { region, language } = await getViewerContext();
    return {
      ok: true as const,
      data: await loadHomeRails(region, language),
    };
  } catch (error) {
    if (error instanceof TmdbConfigError) {
      return { ok: false as const };
    }
    throw error;
  }
}

async function HomeContent() {
  await connection();

  const result = await loadHomeContentData();

  if (!result.ok) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <SetupNotice />
      </div>
    );
  }

  const { featured, rails } = result.data;

  return (
    <div>
      <HeroCarousel items={featured} />
      <div className="mt-10 space-y-10">
        <ClientRails />
        {rails.map((rail) => (
          <Rail
            key={rail.id}
            title={rail.title}
            href={rail.href}
            note={rail.note}
            items={rail.items}
          />
        ))}
      </div>
    </div>
  );
}
