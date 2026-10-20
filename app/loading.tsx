import { GridSkeleton } from "@/components/ui/EmptyState";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-surface-2" />
      <GridSkeleton />
    </div>
  );
}
