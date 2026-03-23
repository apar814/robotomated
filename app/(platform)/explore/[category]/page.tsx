import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { BrowseClient } from "@/components/robots/browse-client";
import Link from "next/link";

interface Category { id: string; slug: string; name: string; description: string | null }
interface Mfr { id: string; name: string }

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

async function getFilterData() {
  const supabase = createServerClient();
  const [{ data: cats }, { data: mfrs }] = await Promise.all([
    supabase.from("robot_categories").select("id, slug, name").order("display_order").returns<Category[]>(),
    supabase.from("manufacturers").select("id, name").order("name").returns<Mfr[]>(),
  ]);
  return { categories: cats || [], manufacturers: mfrs || [] };
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

  const { categories, manufacturers } = await getFilterData();

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
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading robots...</div>}>
        <BrowseClient
          categories={categories}
          manufacturers={manufacturers}
          initialCategory={slug}
        />
      </Suspense>
    </div>
  );
}
