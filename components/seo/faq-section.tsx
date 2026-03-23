"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ items, title = "Frequently Asked Questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <div>
      <h2 className="mb-6 text-xl font-bold">{title}</h2>
      <div className="space-y-2">
        {items.map((faq, i) => (
          <FaqAccordion key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

function FaqAccordion({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-navy-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
      >
        {question}
        <svg
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-border px-5 py-4 text-sm text-muted">
          {answer}
        </div>
      )}
    </div>
  );
}
