import type { Metadata } from "next";
import { Suspense } from "react";
import { createServerClient } from "@/lib/supabase/server";
import { cached } from "@/lib/cache/redis";
import { BrowseClient } from "@/components/robots/browse-client";
import { GridSkeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Explore Robots",
  description: "Browse, search, and compare robots across all categories. Filter by price, RoboScore, manufacturer, and more.",
  openGraph: {
    title: "Explore 602 Robots — Robotomated",
    description: "Browse, search, and compare robots across all categories. Filter by price, RoboScore, manufacturer, and more.",
    images: [{ url: "/og-explore.png", width: 1200, height: 630, alt: "Robotomated — Browse & Compare Robots" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-explore.png"],
  },
};

interface Category { id: string; slug: string; name: string }
interface Mfr { id: string; name: string }

async function getFilterData() {
  const supabase = createServerClient();

  const categories = await cached<Category[]>("categories", 3600, async () => {
    const { data } = await supabase.from("robot_categories").select("id, slug, name").order("display_order").returns<Category[]>();
    return data || [];
  });

  const manufacturers = await cached<Mfr[]>("manufacturers", 3600, async () => {
    const { data } = await supabase.from("manufacturers").select("id, name").order("name").returns<Mfr[]>();
    return data || [];
  });

  return { categories, manufacturers };
}

export default async function ExplorePage() {
  const { categories, manufacturers } = await getFilterData();

  return (
    <div>
      <div className="border-b border-border px-4 py-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Explore Robots</h1>
        <p className="mt-3 text-muted">
          Browse{" "}
          <span className="text-foreground">every robot</span> in our database.
          Filter, sort, and compare.
        </p>
      </div>
      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><GridSkeleton /></div>}>
        <BrowseClient categories={categories} manufacturers={manufacturers} />
      </Suspense>
    </div>
  );
}
