"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MONETIZATION, SORT_OPTIONS } from "@/lib/constants";

type Option = { id: string | number; name: string };

export function Filters({
  action,
  genres,
  countries,
  languages,
  providers,
  kind,
}: {
  action: string;
  genres: Option[];
  countries: Option[];
  languages: Option[];
  providers: Option[];
  kind: "movie" | "tv";
}) {
  const router = useRouter();
  const params = useSearchParams();

  function submit(formData: FormData) {
    const next = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value) next.set(key, value);
    }
    next.delete("page");
    router.push(`${action}?${next.toString()}`);
  }

  return (
    <form action={submit} className="grid gap-3 rounded-2xl border border-line bg-surface p-4 md:grid-cols-3 lg:grid-cols-4">
      <Select name="genre" label="Genre" defaultValue={params.get("genre") ?? ""} options={genres} />
      <Select name="country" label="Country of production" defaultValue={params.get("country") ?? ""} options={countries} />
      <Select name="language" label="Original language" defaultValue={params.get("language") ?? ""} options={languages} />
      <label className="text-xs text-muted">
        Year
        <input
          name="year"
          defaultValue={params.get("year") ?? ""}
          inputMode="numeric"
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>
      <label className="text-xs text-muted">
        Minimum rating
        <input
          name="minRating"
          defaultValue={params.get("minRating") ?? ""}
          className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink"
        />
      </label>
      <Select
        name="sort"
        label="Sort"
        defaultValue={params.get("sort") ?? "popularity.desc"}
        options={SORT_OPTIONS.filter((s) =>
          kind === "movie" ? s.value !== "first_air_date.desc" : s.value !== "primary_release_date.desc" && s.value !== "revenue.desc",
        ).map((s) => ({ id: s.value, name: s.label }))}
      />
      <Select name="provider" label="Streaming provider" defaultValue={params.get("provider") ?? ""} options={providers} />
      <Select
        name="monetization"
        label="Availability type"
        defaultValue={params.get("monetization") ?? ""}
        options={MONETIZATION.map((m) => ({ id: m.value, name: m.label }))}
      />
      <label className="text-xs text-muted">
        Runtime min
        <input name="runtimeMin" defaultValue={params.get("runtimeMin") ?? ""} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink" />
      </label>
      <label className="text-xs text-muted">
        Runtime max
        <input name="runtimeMax" defaultValue={params.get("runtimeMax") ?? ""} className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink" />
      </label>
      {kind === "tv" ? (
        <Select
          name="status"
          label="Series status"
          defaultValue={params.get("status") ?? ""}
          options={[
            { id: "0", name: "Returning" },
            { id: "3", name: "Ended" },
            { id: "1", name: "Planned" },
          ]}
        />
      ) : null}
      <div className="flex items-end gap-2">
        <button type="submit" className="rounded-full bg-accent px-4 py-2 text-sm text-[#160d24]">
          Apply filters
        </button>
        <button
          type="button"
          className="text-sm text-muted"
          onClick={() => router.push(action)}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Option[];
  defaultValue: string;
}) {
  return (
    <label className="text-xs text-muted">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={String(option.id)} value={String(option.id)}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
