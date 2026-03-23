import type { RoboScoreBreakdown } from "@/lib/supabase/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://robotomated.com";

// ---------------------------------------------------------------------------
// Generic script tag renderer
// ---------------------------------------------------------------------------
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Organization (site-wide)
// ---------------------------------------------------------------------------
export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Robotomated",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description:
          "The intelligence layer for the robotics era. Find, compare, and buy the right robot for your home, business, or facility.",
        sameAs: [],
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Product (robot pages)
// ---------------------------------------------------------------------------
interface ProductSchemaProps {
  name: string;
  slug: string;
  description: string;
  manufacturer: string;
  price?: number | null;
  currency?: string;
  score?: number | null;
  categorySlug: string;
  images?: string[];
  model?: string | null;
  status?: string;
}

export function ProductSchema({
  name, slug, description, manufacturer, price, currency = "USD",
  score, categorySlug, images, model, status,
}: ProductSchemaProps) {
  const availability = status === "active"
    ? "https://schema.org/InStock"
    : status === "coming_soon"
    ? "https://schema.org/PreOrder"
    : "https://schema.org/Discontinued";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: manufacturer },
    url: `${BASE_URL}/explore/${categorySlug}/${slug}`,
  };

  if (model) data.model = model;
  if (images?.length) data.image = images;

  if (price != null) {
    data.offers = {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability,
    };
  }

  if (score != null) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (score / 20).toFixed(1), // 0-100 → 0-5
      bestRating: "5",
      worstRating: "0",
      ratingCount: 1,
    };
  }

  return <JsonLd data={data} />;
}

// ---------------------------------------------------------------------------
// Review
// ---------------------------------------------------------------------------
interface ReviewSchemaProps {
  robotName: string;
  reviewTitle: string;
  reviewBody: string;
  author: string;
  score?: number | null;
  publishedAt?: string | null;
}

export function ReviewSchema({
  robotName, reviewTitle, reviewBody, author, score, publishedAt,
}: ReviewSchemaProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Review",
        name: reviewTitle,
        reviewBody,
        author: { "@type": "Person", name: author },
        itemReviewed: { "@type": "Product", name: robotName },
        ...(score != null && {
          reviewRating: {
            "@type": "Rating",
            ratingValue: (score / 20).toFixed(1),
            bestRating: "5",
            worstRating: "0",
          },
        }),
        ...(publishedAt && { datePublished: publishedAt }),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------
interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${BASE_URL}${item.href}`,
        })),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSchema({ items }: { items: FaqItem[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}
