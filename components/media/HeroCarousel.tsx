"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { backdropSrc } from "@/lib/tmdb/images";
import { mediaPath } from "@/lib/utils";
import type { CardModel } from "@/lib/media";
import { WatchlistButton } from "@/components/guest/WatchlistButton";

export function HeroCarousel({ items }: { items: CardModel[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = items[index];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused || items.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 9000);
    return () => window.clearInterval(id);
  }, [items.length, paused]);

  if (!current) return null;
  const src = backdropSrc(current.backdropPath);
  const href = mediaPath(current.mediaType, current.id);

  return (
    <section
      className="relative isolate min-h-[78vw] overflow-hidden md:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-bg via-bg/70 to-bg/10" />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[78vw] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 md:min-h-[560px] sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Featured</p>
        <h1 className="font-display mt-2 max-w-3xl text-4xl leading-tight md:text-6xl">
          {current.title}
        </h1>
        <p className="mt-3 flex flex-wrap gap-2 text-sm text-muted">
          <span>{current.year ?? "Year unknown"}</span>
          <span>·</span>
          <span>{current.mediaType === "tv" ? "TV series" : "Movie"}</span>
          {current.vote ? (
            <>
              <span>·</span>
              <span>
                {current.vote.toFixed(1)} / 10
                {current.voteCount ? ` (${current.voteCount.toLocaleString()} votes)` : ""}
              </span>
            </>
          ) : null}
        </p>
        {current.overview ? (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/90 md:text-base line-clamp-4">
            {current.overview}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#160d24]"
          >
            View details
          </Link>
          <Link
            href={`${href}#trailer`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-black/40 px-5 py-2.5 text-sm"
          >
            <Play className="h-4 w-4" /> Watch trailer
          </Link>
          <WatchlistButton item={current} />
        </div>
      </div>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-black/50 p-2 md:inline-flex"
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            aria-label="Previous featured title"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-line bg-black/50 p-2 md:inline-flex"
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            aria-label="Next featured title"
          >
            <ChevronRight />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={`${item.mediaType}-${item.id}`}
                type="button"
                aria-label={`Show ${item.title}`}
                className={`h-1.5 w-6 rounded-full ${i === index ? "bg-accent" : "bg-white/30"}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
