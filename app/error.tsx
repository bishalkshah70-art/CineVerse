"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted">
        {error.message.includes("429")
          ? "TMDB rate-limited this request. Wait a moment and try again."
          : "The catalog could not be loaded. Check your connection and TMDB configuration."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-accent px-5 py-2 text-sm text-[#160d24]"
      >
        Try again
      </button>
    </div>
  );
}
