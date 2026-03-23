"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        On this page
      </h4>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={cn(
            "block rounded-md py-1 text-xs transition-colors",
            h.level === 3 ? "pl-4" : "pl-0",
            activeId === h.id
              ? "font-medium text-blue"
              : "text-muted hover:text-foreground"
          )}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
