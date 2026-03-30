import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categoryImages: Record<string, string[]> = {
  consumer: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop",
  ],
  medical: [
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&h=400&fit=crop",
  ],
  healthcare: [
    "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
  ],
  manufacturing: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop",
  ],
  construction: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
  ],
  agricultural: [
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
  ],
  delivery: [
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop",
  ],
  drone: [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&h=400&fit=crop",
  ],
  software: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&h=400&fit=crop",
  ],
};

async function fixImages() {
  console.log("[IMG] Fixing robot images...\n");
  let totalUpdated = 0;

  for (const [categorySlug, images] of Object.entries(categoryImages)) {
    const { data: category } = await supabase
      .from("robot_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!category) { console.log(`  Skip: ${categorySlug} (no category)`); continue; }

    const { data: robots } = await supabase
      .from("robots")
      .select("id")
      .eq("category_id", category.id);

    if (!robots || robots.length === 0) { console.log(`  Skip: ${categorySlug} (no robots)`); continue; }

    for (let i = 0; i < robots.length; i++) {
      const imageUrl = images[i % images.length];
      await supabase
        .from("robots")
        .update({ images: [{ url: imageUrl, alt: `${categorySlug} robot` }] })
        .eq("id", robots[i].id);
    }
    console.log(`  [OK] ${categorySlug}: ${robots.length} robots updated (${images.length} images rotated)`);
    totalUpdated += robots.length;
  }

  console.log(`\n[OK] Done: ${totalUpdated} robots updated with verified images`);
}

fixImages();
