import type { Metadata } from "next";
import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { BrowseClient } from "@/components/robots/browse-client";

export const metadata: Metadata = {
  title: "Explore Robots",
  description: "Browse, search, and compare robots across all categories. Filter by price, RoboScore, manufacturer, and more.",
};

interface Category { id: string; slug: string; name: string }
interface Mfr { id: string; name: string }

async function getFilterData() {
  const supabase = createServerClient();
  const [{ data: cats }, { data: mfrs }] = await Promise.all([
    supabase.from("robot_categories").select("id, slug, name").order("display_order").returns<Category[]>(),
    supabase.from("manufacturers").select("id, name").order("name").returns<Mfr[]>(),
  ]);
  return { categories: cats || [], manufacturers: mfrs || [] };
}

export default async function ExplorePage() {
  const { categories, manufacturers } = await getFilterData();

  return (
    <div>
      <div className="border-b border-border px-4 py-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Explore Robots</h1>
        <p className="mt-3 text-muted">
          Browse {" "}
          <span className="text-foreground">every robot</span> in our database.
          Filter, sort, and compare.
        </p>
      </div>
      <Suspense fallback={<div className="py-20 text-center text-muted">Loading robots...</div>}>
        <BrowseClient categories={categories} manufacturers={manufacturers} />
      </Suspense>
    </div>
  );
}
