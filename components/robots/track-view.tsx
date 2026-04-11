"use client";

import { useEffect } from "react";
import { trackRobotView } from "@/lib/personalization/browsing-history";

export function TrackView({ slug, category, name }: { slug: string; category: string; name: string }) {
  useEffect(() => {
    trackRobotView(slug, category, name);
  }, [slug, category, name]);
  return null;
}
