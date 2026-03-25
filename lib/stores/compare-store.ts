"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStore {
  slugs: string[];
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      slugs: [],
      add: (slug) => set((s) => s.slugs.length >= 3 || s.slugs.includes(slug) ? s : { slugs: [...s.slugs, slug] }),
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
    }),
    { name: "robotomated-compare" }
  )
);
