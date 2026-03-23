import Link from "next/link";
import { BreadcrumbSchema } from "@/components/seo/json-ld";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.name}
              </Link>
            ) : (
              <span className="text-foreground">{item.name}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
