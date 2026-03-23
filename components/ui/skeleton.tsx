import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-shimmer rounded-lg bg-white/[0.03]", className)} />
  );
}

export function RobotCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5">
      <Skeleton className="mb-4 h-40 w-full rounded-lg" />
      <Skeleton className="mb-2 h-2 w-16" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-3 h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="glass rounded-xl p-5">
      <Skeleton className="mb-3 h-2 w-20" />
      <Skeleton className="mb-2 h-5 w-full" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <RobotCardSkeleton key={i} />
      ))}
    </div>
  );
}
