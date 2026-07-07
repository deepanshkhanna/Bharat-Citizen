import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-10 h-32 w-full rounded-2xl" />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function SchemesSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      <Skeleton className="h-10 w-64" />
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-8 h-12 w-full rounded-full" />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function SchemeDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="border-b border-border py-6 last:border-0">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-16 w-full rounded-2xl" />
    </div>
  );
}
