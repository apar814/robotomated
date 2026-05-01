/**
 * Image Registry — Single source of truth for every image on Robotomated.
 * Never a broken image anywhere.
 */

// ── Robot image resolution ──

export function getRobotImageUrl(robot: {
  images?: { url: string; alt?: string }[] | null;
  youtube_id?: string | null;
  category_slug?: string;
}): string | null {
  // Priority 1: Uploaded image from Supabase Storage
  const imgs = Array.isArray(robot.images) ? robot.images : [];
  const uploaded = imgs.find(
    (img) => img.url && !img.url.includes("unsplash.com")
  );
  if (uploaded?.url) return uploaded.url;

  // Priority 2: YouTube maxresdefault thumbnail
  if (robot.youtube_id) {
    return `https://img.youtube.com/vi/${robot.youtube_id}/maxresdefault.jpg`;
  }

  // Priority 3: null — caller renders category gradient fallback
  return null;
}

// ── YouTube thumbnail helpers ──

export function getYouTubeThumbnail(
  videoId: string,
  quality: "maxresdefault" | "hqdefault" | "mqdefault" | "sddefault" = "maxresdefault"
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

// ── Section hero image keywords ──

const SECTION_KEYWORDS: Record<string, string> = {
  warehouse: "warehouse,automation,industrial",
  medical: "hospital,technology,medical",
  manufacturing: "factory,robot,manufacturing",
  security: "security,surveillance,building",
  agricultural: "farm,drone,agriculture",
  humanoid: "futuristic,robot,artificial+intelligence",
  eldercare: "elderly,care,technology",
  construction: "construction,robotics,building",
  cleaning: "cleaning,robot,autonomous",
  delivery: "delivery,drone,logistics",
  hospitality: "hotel,service,robot",
  consumer: "home,smart,technology",
};

export function getSectionImageUrl(
  section: string,
  width = 1920,
  height = 1080
): string {
  const keywords = SECTION_KEYWORDS[section] || "robot,technology,automation";
  return `https://source.unsplash.com/${width}x${height}/?${keywords}`;
}

// ── Category gradient fallbacks ──

const CATEGORY_GRADIENTS: Record<string, string> = {
  warehouse: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #D4D4D4 100%)",
  medical: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #06B6D4 100%)",
  manufacturing: "linear-gradient(135deg, #0F172A 0%, #2D1B69 50%, #7C3AED 100%)",
  security: "linear-gradient(135deg, #0F172A 0%, #1C1917 50%, #F59E0B 100%)",
  agricultural: "linear-gradient(135deg, #0F172A 0%, #14532D 50%, #22C55E 100%)",
  humanoid: "linear-gradient(135deg, #0F172A 0%, #312E81 50%, #818CF8 100%)",
  construction: "linear-gradient(135deg, #0F172A 0%, #431407 50%, #EA580C 100%)",
  cleaning: "linear-gradient(135deg, #0F172A 0%, #164E63 50%, #06B6D4 100%)",
  delivery: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #D4D4D4 100%)",
  consumer: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #A78BFA 100%)",
};

export function getCategoryGradient(categorySlug: string): string {
  return (
    CATEGORY_GRADIENTS[categorySlug] ||
    "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #D4D4D4 100%)"
  );
}
