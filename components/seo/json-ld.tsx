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
  categorySlug: string;
  categoryName?: string;
  images?: string[];
  model?: string | null;
  status?: string;
}

export function ProductSchema({
  name, slug, description, manufacturer, price, currency = "USD",
  categorySlug, categoryName, images, model, status,
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
  if (categoryName) data.category = categoryName;
  if (images?.length) data.image = images;

  if (price != null) {
    data.offers = {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability,
    };
  }

  // No aggregateRating: a single editorial score cannot honestly back an
  // aggregate rating claim. Only real-data fields are emitted.
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
  publishedAt?: string | null;
}

export function ReviewSchema({
  robotName, reviewTitle, reviewBody, author, publishedAt,
}: ReviewSchemaProps) {
  // No reviewRating: score-derived ratings are withheld while the scoring
  // system is under review. Textual review markup only.
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Review",
        name: reviewTitle,
        reviewBody,
        author: { "@type": "Person", name: author },
        itemReviewed: { "@type": "Product", name: robotName },
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
// DefinedTerm / DefinedTermSet (glossary)
// ---------------------------------------------------------------------------
export function DefinedTermSetSchema({
  name, description, url, terms,
}: {
  name: string;
  description: string;
  url: string;
  terms: { term: string; slug: string; definition: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "DefinedTermSet",
        name,
        description,
        url: `${BASE_URL}${url}`,
        hasDefinedTerm: terms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.term,
          description: t.definition,
          url: `${BASE_URL}/learn/glossary/${t.slug}`,
        })),
      }}
    />
  );
}

export function DefinedTermSchema({
  term, slug, definition,
}: {
  term: string;
  slug: string;
  definition: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: term,
        description: definition,
        url: `${BASE_URL}/learn/glossary/${slug}`,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "Robotomated robotics glossary",
          url: `${BASE_URL}/learn/glossary`,
        },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Article (explainers)
// ---------------------------------------------------------------------------
export function ArticleSchema({
  title, description, url, publishedAt,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${BASE_URL}${url}`,
        datePublished: publishedAt,
        author: { "@type": "Organization", name: "Robotomated" },
        publisher: {
          "@type": "Organization",
          name: "Robotomated",
          url: BASE_URL,
        },
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
