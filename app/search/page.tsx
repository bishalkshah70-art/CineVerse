"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const router = useRouter();

  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl space-y-6 px-4 py-10 sm:px-8">
      <h1 className="font-display text-4xl">Search CineVerse</h1>
      <p className="text-muted">Find movies and TV shows by title.</p>

      <form
        key={query}
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const value = String(formData.get("q") ?? "").trim();

          if (value) {
            router.push(`/search?q=${encodeURIComponent(value)}`);
          }
        }}
      >
        <input
          name="q"
          defaultValue={query}
          placeholder="Search movies and TV shows..."
          aria-label="Search movies and TV shows"
          className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-3"
        />
        <button
          className="rounded-xl bg-accent px-5 py-3 text-white"
          type="submit"
        >
          Search
        </button>
      </form>

      <p className="text-sm text-muted">
        Use the Search button in the header for instant suggestions.
      </p>
    </main>
  );
}
