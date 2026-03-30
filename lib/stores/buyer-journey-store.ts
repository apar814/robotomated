import { create } from "zustand";

export interface BuyerProfile {
  industry: string | null;
  challenge: string | null;
  budget: string | null;
  completedAt: number | null;
}

interface BuyerJourneyState {
  profile: BuyerProfile;
  setIndustry: (industry: string) => void;
  setChallenge: (challenge: string) => void;
  setBudget: (budget: string) => void;
  complete: () => void;
  reset: () => void;
}

const STORAGE_KEY = "robotomated-buyer-journey";

function loadProfile(): BuyerProfile {
  if (typeof window === "undefined") return { industry: null, challenge: null, budget: null, completedAt: null };
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { industry: null, challenge: null, budget: null, completedAt: null };
}

function saveProfile(profile: BuyerProfile) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export const useBuyerJourney = create<BuyerJourneyState>((set, get) => ({
  profile: loadProfile(),
  setIndustry: (industry) => {
    const profile = { ...get().profile, industry, challenge: null };
    saveProfile(profile);
    set({ profile });
  },
  setChallenge: (challenge) => {
    const profile = { ...get().profile, challenge };
    saveProfile(profile);
    set({ profile });
  },
  setBudget: (budget) => {
    const profile = { ...get().profile, budget };
    saveProfile(profile);
    set({ profile });
  },
  complete: () => {
    const profile = { ...get().profile, completedAt: Date.now() };
    saveProfile(profile);
    set({ profile });
  },
  reset: () => {
    const profile = { industry: null, challenge: null, budget: null, completedAt: null };
    saveProfile(profile);
    set({ profile });
  },
}));
