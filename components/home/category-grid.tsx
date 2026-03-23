import Link from "next/link";
import type { RobotCategory } from "@/lib/supabase/types";

const iconPaths: Record<string, string> = {
  warehouse: "M4 20V10l8-6 8 6v10H4z M10 20v-6h4v6",
  factory: "M4 20V9l4 2.5V9l4 2.5V9l4 2.5V9l4 2.5V20H4z",
  home: "M5 20V11l7-5 7 5v9H5z M10 20v-5h4v5",
  medical: "M12 5v14M5 12h14 M9 5h6v3H9z",
  truck: "M2 16V9h10l3 3v4H2z M16 16v-4h2l3 2v2h-5z M5 18a2 2 0 100-4 2 2 0 000 4z M18 18a2 2 0 100-4 2 2 0 000 4z",
};

interface CategoryWithCount extends RobotCategory {
  robot_count: number;
}

export function CategoryGrid({ categories }: { categories: CategoryWithCount[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/explore/${cat.slug}`}
          className="group rounded-xl border border-border bg-navy-light p-5 transition-all hover:border-blue/40 hover:shadow-[0_0_20px_rgba(0,194,255,0.08)]"
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue/10 transition-colors group-hover:bg-blue/20">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-blue"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={iconPaths[cat.icon_name || ""] || iconPaths.home} />
            </svg>
          </div>
          <h3 className="text-sm font-semibold">{cat.name}</h3>
          <p className="mt-1 text-xs text-muted">
            {cat.robot_count} {cat.robot_count === 1 ? "robot" : "robots"}
          </p>
        </Link>
      ))}
    </div>
  );
}
