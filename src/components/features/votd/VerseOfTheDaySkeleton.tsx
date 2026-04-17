import { Skeleton } from '@/components/ui/skeleton';

export function VerseOfTheDaySkeleton() {
  return (
    <div className="rounded-xl border border-border-light bg-bg-card p-8 max-md:p-5">
      <div className="mb-6 flex items-center justify-between max-md:flex-col max-md:items-start max-md:gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-5" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-9 w-48 rounded-xl" />
      </div>
      <Skeleton className="mb-2 h-5 w-full" />
      <Skeleton className="mb-6 h-5 w-3/4" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}
