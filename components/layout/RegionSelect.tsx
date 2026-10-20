"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function RegionSelect({
  region,
  countries,
}: {
  region: string;
  countries: Array<{ iso_3166_1: string; english_name: string }>;
}) {
  const router = useRouter();
  const options = countries.length
    ? countries
    : [
        { iso_3166_1: "US", english_name: "United States" },
        { iso_3166_1: "NP", english_name: "Nepal" },
        { iso_3166_1: "IN", english_name: "India" },
        { iso_3166_1: "GB", english_name: "United Kingdom" },
      ];

  return (
    <label className="relative inline-flex items-center gap-1 text-sm text-muted">
      <Globe className="h-4 w-4" aria-hidden />
      <span className="sr-only">Watch region</span>
      <select
        className="max-w-[9rem] appearance-none bg-transparent py-1 pr-4 text-ink"
        value={region}
        onChange={async (e) => {
          await fetch("/api/region", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ region: e.target.value }),
          });
          router.refresh();
        }}
      >
        {options.map((c) => (
          <option key={c.iso_3166_1} value={c.iso_3166_1}>
            {c.iso_3166_1} · {c.english_name}
          </option>
        ))}
      </select>
    </label>
  );
}
