import { cn } from "@/utils/cn";

/** Shimmering skeleton placeholder for loading states. */
export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-slate-200/70 dark:bg-slate-800/70",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent" />
    </div>
  );
}

/** A convenient card skeleton used across grids. */
export function CardSkeleton() {
  return (
    <div className="card p-4">
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="mt-4 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  );
}
