import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { NewsletterPageClient } from "./newsletter-client";

export const metadata: Metadata = {
  title: "The Robotomated Brief — Weekly Robotics Intelligence",
  description: "Weekly robotics intelligence for operators, buyers, and builders. 464+ robots tracked, market funding data, price movements, and industry analysis delivered every Monday.",
  alternates: { canonical: "/newsletter" },
};

export default async function NewsletterPage() {
  const supabase = createServerClient();
  const { count } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true });

  return <NewsletterPageClient subscriberCount={count || 0} />;
}
