import { GridSkeleton } from "@/components/ui/skeleton";

export default function ManufacturersLoading() {
  return (
    <div className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-56 rounded-lg bg-white/[0.06]" />
          <div className="mt-3 h-4 w-80 rounded-lg bg-white/[0.06]" />
        </div>
        <GridSkeleton count={9} />
      </div>
    </div>
  );
}
