import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { BrowseClient } from "@/components/robots/browse-client";
import { GridSkeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Category { id: string; slug: string; name: string; description: string | null }
interface Mfr { id: string; name: string; robot_count?: number }

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("robot_categories")
    .select("name, description")
    .eq("slug", slug)
    .single()
    .returns<{ name: string; description: string | null }>();

  if (!data) return { title: "Category Not Found" };

  return {
    title: `${data.name} Robots`,
    description: data.description || `Browse ${data.name} robots on Robotomated.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const supabase = createServerClient();

  const { data: cat } = await supabase
    .from("robot_categories")
    .select("id, slug, name, description")
    .eq("slug", slug)
    .single()
    .returns<Category>();

  if (!cat) notFound();

  // Get all categories for the filter sidebar
  const { data: cats } = await supabase
    .from("robot_categories")
    .select("id, slug, name")
    .order("display_order")
    .returns<Category[]>();

  // Get only manufacturers that have active robots in this category, with count
  const { data: robotMfrs } = await supabase
    .from("robots")
    .select("manufacturer_id, manufacturers(id, name)")
    .eq("category_id", cat.id)
    .eq("status", "active")
    .returns<{ manufacturer_id: string; manufacturers: { id: string; name: string } | null }[]>();

  // Aggregate by manufacturer and count
  const mfrMap = new Map<string, { id: string; name: string; count: number }>();
  for (const r of (robotMfrs || [])) {
    const m = r.manufacturers;
    if (!m) continue;
    const existing = mfrMap.get(m.id);
    if (existing) {
      existing.count++;
    } else {
      mfrMap.set(m.id, { id: m.id, name: m.name, count: 1 });
    }
  }

  // Sort by count descending
  const manufacturers: Mfr[] = Array.from(mfrMap.values())
    .sort((a, b) => b.count - a.count)
    .map(m => ({ id: m.id, name: m.name, robot_count: m.count }));

  return (
    <div>
      <div className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/explore" className="hover:text-foreground">Explore</Link>
            <span>/</span>
            <span className="text-foreground">{cat.name}</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{cat.name}</h1>
          {cat.description && (
            <p className="mt-2 max-w-2xl text-muted">{cat.description}</p>
          )}
        </div>
      </div>
      <Suspense fallback={<div className="px-4 py-12"><GridSkeleton count={9} /></div>}>
        <BrowseClient
          categories={cats || []}
          manufacturers={manufacturers}
          initialCategory={slug}
        />
      </Suspense>
    </div>
  );
}
