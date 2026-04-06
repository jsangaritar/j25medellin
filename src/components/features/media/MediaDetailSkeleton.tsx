import { Skeleton } from '@/components/ui/skeleton';

export function MediaDetailSkeleton() {
  return (
    <section className="mx-auto max-w-[1440px] px-14 py-10 max-md:px-5">
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div>
          <Skeleton className="mb-6 aspect-video rounded-xl" />
          <div className="mb-3 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mb-3 h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
        <div>
          <Skeleton className="mb-4 h-5 w-40" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
