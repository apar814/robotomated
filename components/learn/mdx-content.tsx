import { MDXRemote } from "next-mdx-remote/rsc";
import { type BundledLanguage, codeToHtml } from "shiki";
import Link from "next/link";

async function CodeBlock({ children, className }: { children: string; className?: string }) {
  const lang = (className?.replace("language-", "") || "text") as BundledLanguage;
  const html = await codeToHtml(children.trim(), {
    lang,
    theme: "github-dark-default",
  });

  return (
    <div
      className="mb-4 overflow-x-auto rounded-lg text-sm [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Heading2({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = typeof children === "string" ? children : "";
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return <h2 id={id} className="mb-3 mt-10 scroll-mt-20 text-xl font-bold" {...props}>{children}</h2>;
}

function Heading3({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const text = typeof children === "string" ? children : "";
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return <h3 id={id} className="mb-2 mt-6 scroll-mt-20 text-lg font-semibold" {...props}>{children}</h3>;
}

const mdxComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="mb-4 text-3xl font-bold" {...props} />,
  h2: Heading2,
  h3: Heading3,
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-4 leading-relaxed text-muted" {...props} />,
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="mb-4 list-disc space-y-1.5 pl-6 text-muted" {...props} />,
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-muted" {...props} />,
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li className="text-muted" {...props} />,
  a: ({ href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return <Link href={href} className="text-blue hover:underline" {...props} />;
    }
    return <a href={href} className="text-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mb-4 border-l-2 border-blue pl-4 italic text-muted" {...props} />
  ),
  pre: ({ children }: { children: React.ReactElement<{ children: string; className?: string }> }) => {
    const childProps = children?.props;
    if (childProps?.children) {
      return <CodeBlock className={childProps.className}>{childProps.children}</CodeBlock>;
    }
    return <pre className="mb-4 overflow-x-auto rounded-lg bg-navy-lighter p-4 font-mono text-sm">{children}</pre>;
  },
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-navy-lighter px-1.5 py-0.5 font-mono text-sm text-blue" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => <thead className="bg-navy-lighter" {...props} />,
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted" {...props} />,
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => <td className="border-t border-border px-4 py-2.5 text-muted" {...props} />,
  hr: () => <hr className="my-8 border-border" />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold text-foreground" {...props} />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-4 rounded-lg" alt={props.alt || ""} {...props} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <article className="max-w-none">
      <MDXRemote source={source} components={mdxComponents} />
    </article>
  );
}
