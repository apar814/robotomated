import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content/learn");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: string;
  audience: "beginner" | "enthusiast" | "professional" | "developer";
  industry?: string[];
  description: string;
  readTime: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  authorBio?: string;
  featured?: boolean;
  robotSlugs?: string[];
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
  categorySlug: string;
}

export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  if (!fs.existsSync(CONTENT_DIR)) return articles;

  const categories = fs.readdirSync(CONTENT_DIR).filter((f) =>
    fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()
  );

  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(catDir, file), "utf-8");
      const { data, content } = matter(raw);
      const fm = data as ArticleFrontmatter;
      articles.push({
        frontmatter: { ...fm, slug: fm.slug || file.replace(/\.mdx$/, "") },
        content,
        categorySlug: cat,
      });
    }
  }

  return articles.sort(
    (a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime()
  );
}

export function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;

  return {
    frontmatter: { ...fm, slug: fm.slug || slug },
    content,
    categorySlug: category,
  };
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const articles = getAllArticles();
  const map = new Map<string, number>();

  for (const a of articles) {
    map.set(a.categorySlug, (map.get(a.categorySlug) || 0) + 1);
  }

  return Array.from(map.entries()).map(([slug, count]) => ({
    slug,
    name: formatCategoryName(slug),
    count,
  }));
}

export function formatCategoryName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ id, text, level: match[1].length });
  }

  return headings;
}
