"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CardModel } from "@/lib/media";
import { PosterCard } from "./PosterCard";

export function Rail({
  title,
  href,
  note,
  items,
}: {
  title: string;
  href?: string;
  note?: string;
  items: CardModel[];
}) {
  const scroller = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-8">
        <div>
          {href ? (
            <Link href={href} className="font-display text-xl hover:text-accent">
              {title}
            </Link>
          ) : (
            <h2 className="font-display text-xl">{title}</h2>
          )}
          {note ? <p className="mt-1 max-w-3xl text-xs text-muted">{note}</p> : null}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="rounded-full border border-line bg-surface p-2"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="rounded-full border border-line bg-surface p-2"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2 sm:px-8"
      >
        {items.map((item) => (
          <div key={`${item.mediaType}-${item.id}`} className="w-[42vw] shrink-0 sm:w-[160px]">
            <PosterCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
