/** Action image and video mapping system for task/industry visuals */

export interface ActionMedia {
  gradient: string;
  label: string;
  description: string;
  icon: string; // Lucide SVG path
}

// ── Task action visuals ──
export const TASK_ACTIONS: Record<string, ActionMedia> = {
  "move-materials": {
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)",
    label: "Move Materials",
    description: "AMRs moving pallets autonomously",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  "pick-pack": {
    gradient: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
    label: "Pick and Pack",
    description: "Automated order picking",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  "clean-surfaces": {
    gradient: "linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)",
    label: "Clean Surfaces",
    description: "Autonomous floor care",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z",
  },
  "inspect-equipment": {
    gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)",
    label: "Inspect Equipment",
    description: "Automated inspection and survey",
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  "secure-facility": {
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)",
    label: "Secure a Facility",
    description: "Autonomous patrol and monitoring",
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  "serve-customers": {
    gradient: "linear-gradient(135deg, #831843 0%, #ec4899 100%)",
    label: "Serve Customers",
    description: "Guest and patient service",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
  },
  "harvest-crops": {
    gradient: "linear-gradient(135deg, #14532d 0%, #22c55e 100%)",
    label: "Harvest Crops",
    description: "Automated agricultural operations",
    icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636",
  },
  "weld-assemble": {
    gradient: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)",
    label: "Weld, Paint, or Assemble",
    description: "Industrial manufacturing tasks",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085",
  },
  "deliver-items": {
    gradient: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 100%)",
    label: "Deliver Items",
    description: "Autonomous delivery within facilities",
    icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-2.25h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5",
  },
  "other": {
    gradient: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    label: "Something Else",
    description: "Tell us about your unique task",
    icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
  },
};

// ── Category gradients for robots without images ──
export const CATEGORY_GRADIENTS: Record<string, string> = {
  humanoid: "linear-gradient(135deg, #312e81 0%, #7c3aed 100%)",
  warehouse: "linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 100%)",
  manufacturing: "linear-gradient(135deg, #1e293b 0%, #64748b 100%)",
  medical: "linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)",
  agricultural: "linear-gradient(135deg, #14532d 0%, #22c55e 100%)",
  security: "linear-gradient(135deg, #1c1917 0%, #dc2626 100%)",
  hospitality: "linear-gradient(135deg, #78350f 0%, #f59e0b 100%)",
  construction: "linear-gradient(135deg, #44403c 0%, #a8a29e 100%)",
  cleaning: "linear-gradient(135deg, #083344 0%, #06b6d4 100%)",
  delivery: "linear-gradient(135deg, #7c2d12 0%, #f97316 100%)",
  drone: "linear-gradient(135deg, #0c4a6e 0%, #38bdf8 100%)",
  consumer: "linear-gradient(135deg, #1e1b4b 0%, #818cf8 100%)",
  software: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
  eldercare: "linear-gradient(135deg, #4c0519 0%, #f43f5e 100%)",
};

// ── Category icon SVG paths ──
export const CATEGORY_ICONS: Record<string, string> = {
  humanoid: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
  warehouse: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  manufacturing: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877",
  medical: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  agricultural: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591",
  security: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623",
  hospitality: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513",
  cleaning: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846",
  delivery: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375",
  drone: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
  consumer: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875",
};
