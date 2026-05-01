"use client";

import { useState } from "react";

interface RobotType {
  id: string;
  label: string;
  description: string;
}

interface Props {
  types: RobotType[];
  typeCounts: Record<string, number>;
}

export function IndustryTypeFilter({ types, typeCounts }: Props) {
  const [activeType, setActiveType] = useState<string | null>(null);

  const handleClick = (typeId: string | null) => {
    setActiveType(typeId);

    // Show/hide type sections
    const sections = document.querySelectorAll("[id^='type-']");
    sections.forEach((section) => {
      const el = section as HTMLElement;
      if (typeId === null) {
        el.style.display = "";
      } else {
        el.style.display = el.id === `type-${typeId}` ? "" : "none";
      }
    });

    // Update URL without reload
    const url = new URL(window.location.href);
    if (typeId) {
      url.searchParams.set("type", typeId);
    } else {
      url.searchParams.delete("type");
    }
    window.history.replaceState({}, "", url.toString());
  };

  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);

  return (
    <nav className="sticky top-[57px] z-20 border-b border-white/[0.07] bg-[#0A0F1E]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-4">
        <button
          onClick={() => handleClick(null)}
          className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-[11px] uppercase tracking-wider transition-colors ${
            activeType === null
              ? "border-white/20 text-white"
              : "border-transparent text-white/40 hover:text-white/70"
          }`}
        >
          All ({total})
        </button>
        {types.map((type) => {
          const count = typeCounts[type.id] || 0;
          if (count === 0) return null;
          return (
            <button
              key={type.id}
              onClick={() => handleClick(type.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-[11px] uppercase tracking-wider transition-colors ${
                activeType === type.id
                  ? "border-white/20 text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {type.label} ({count})
            </button>
          );
        })}
      </div>
    </nav>
  );
}
