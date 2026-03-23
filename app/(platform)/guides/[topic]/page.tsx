import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { FaqSection } from "@/components/seo/faq-section";
import { FaqSchema } from "@/components/seo/json-ld";

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

interface GuideFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  category?: string;
  faqs?: { question: string; answer: string }[];
  related?: string[];
}

interface Props { params: Promise<{ topic: string }> }

function getGuide(slug: string): { frontmatter: GuideFrontmatter; content: string } | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as GuideFrontmatter, content };
}

export async function generateStaticParams() {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ topic: f.replace(/\.mdx$/, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const guide = getGuide(topic);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    alternates: { canonical: `/guides/${topic}` },
  };
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mb-4 text-3xl font-bold" {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="mb-3 mt-8 text-xl font-bold" {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="mb-2 mt-6 text-lg font-semibold" {...props} />,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed text-muted" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mb-4 list-disc space-y-1 pl-6 text-muted" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="mb-4 list-decimal space-y-1 pl-6 text-muted" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="text-muted" {...props} />,
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className="text-blue hover:underline" {...props} />,
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => <blockquote className="mb-4 border-l-2 border-blue pl-4 italic text-muted" {...props} />,
  code: (props: React.HTMLAttributes<HTMLElement>) => <code className="rounded bg-navy-lighter px-1.5 py-0.5 font-mono text-sm text-blue" {...props} />,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <pre className="mb-4 overflow-x-auto rounded-lg bg-navy-lighter p-4 font-mono text-sm" {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => <div className="mb-4 overflow-x-auto"><table className="w-full text-sm" {...props} /></div>,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="border-b border-border bg-navy-lighter px-4 py-2 text-left font-medium text-muted" {...props} />,
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border-b border-border px-4 py-2 text-muted" {...props} />,
};

export default async function GuidePage({ params }: Props) {
  const { topic } = await params;
  const guide = getGuide(topic);
  if (!guide) notFound();

  const { frontmatter, content } = guide;
  const faqs = frontmatter.faqs || [];

  return (
    <div>
      {faqs.length > 0 && <FaqSchema items={faqs} />}

      <section className="border-b border-border px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[
            { name: "Home", href: "/" },
            { name: "Guides", href: "/learn" },
            { name: frontmatter.title, href: `/guides/${topic}` },
          ]} />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{frontmatter.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted">
            <span>By {frontmatter.author}</span>
            <span>Updated {new Date(frontmatter.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-4 py-12">
        <article className="prose-robotomated mx-auto max-w-3xl">
          <MDXRemote source={content} components={mdxComponents} />
        </article>
      </section>

      {faqs.length > 0 && (
        <section className="border-b border-border px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <FaqSection items={faqs} />
          </div>
        </section>
      )}

      {/* Related links */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-xl font-bold">Continue Learning</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/explore" className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
              Explore All Robots
            </Link>
            <Link href="/advisor" className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
              AI Advisor
            </Link>
            {frontmatter.category && (
              <Link href={`/best/${frontmatter.category}`} className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-blue/30 hover:text-foreground">
                Best {frontmatter.category} Robots
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
