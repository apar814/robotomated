import { GridSkeleton } from "@/components/ui/skeleton";

export default function LeaseLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <GridSkeleton count={6} />
    </div>
  );
}
