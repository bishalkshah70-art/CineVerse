"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { officialYoutubeUrl } from "@/lib/media";

export function TrailerDialog({
  title,
  youtubeKey,
}: {
  title: string;
  youtubeKey: string | null;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!youtubeKey) {
    return (
      <p className="text-sm text-muted">
        No authorized trailer is listed for this title.
      </p>
    );
  }

  return (
    <div id="trailer">
      <button
        type="button"
        className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#160d24]"
        onClick={() => setOpen(true)}
      >
        Watch trailer
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} trailer`}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-4xl overflow-hidden rounded-2xl bg-surface ring-1 ring-line"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <h2 className="text-sm">{title}</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close trailer"
                className="rounded-full p-2 hover:bg-surface-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                title={`${title} trailer`}
                src={officialYoutubeUrl(youtubeKey)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
