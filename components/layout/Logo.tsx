import Link from "next/link";
import { BRAND } from "@/lib/constants";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label={`${BRAND.name} home`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 ring-1 ring-line">
        <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
          <path d="M8 6h6c6 0 10 5 10 10s-4 10-10 10H8V6z" fill="currentColor" className="text-accent" />
          <rect x="6" y="9" width="3" height="3" rx="0.6" fill="#0b0b0d" />
          <rect x="6" y="14.5" width="3" height="3" rx="0.6" fill="#0b0b0d" />
          <rect x="6" y="20" width="3" height="3" rx="0.6" fill="#0b0b0d" />
        </svg>
      </span>
      {compact ? null : (
        <span className="font-display text-lg tracking-wide">{BRAND.name}</span>
      )}
    </Link>
  );
}
