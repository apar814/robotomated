// ── RoboWork shared constants ──

export const TASK_TYPES = [
  { value: "cleaning", label: "Cleaning & Sanitation" },
  { value: "delivery", label: "Delivery & Transport" },
  { value: "security", label: "Security & Patrol" },
  { value: "inspection", label: "Inspection & Survey" },
  { value: "assembly", label: "Assembly & Manufacturing" },
  { value: "picking", label: "Order Picking" },
  { value: "packing", label: "Packing & Palletizing" },
  { value: "welding", label: "Welding & Fabrication" },
  { value: "painting", label: "Painting & Coating" },
  { value: "agriculture", label: "Agriculture & Harvest" },
  { value: "healthcare", label: "Healthcare Support" },
  { value: "hospitality", label: "Hospitality Service" },
  { value: "construction", label: "Construction & Demo" },
  { value: "other", label: "Other" },
] as const;

export const INDUSTRIES = [
  "Warehouse & Logistics",
  "Manufacturing",
  "Construction",
  "Agriculture",
  "Healthcare",
  "Hospitality",
  "Security",
  "Retail",
  "Food & Beverage",
  "Mining",
  "Energy",
  "Education",
  "Other",
] as const;

export const URGENCY_CONFIG = {
  asap: { label: "ASAP", color: "bg-red-500/15 text-red-400 border-red-500/20" },
  within_week: { label: "Within a Week", color: "bg-amber/15 text-amber border-amber/20" },
  within_month: { label: "Within a Month", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  flexible: { label: "Flexible", color: "bg-text-tertiary/15 text-text-secondary border-text-tertiary/20" },
} as const;

export const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-text-tertiary/15 text-text-secondary" },
  open: { label: "Open", color: "bg-blue-600/15 text-blue-400" },
  in_review: { label: "In Review", color: "bg-amber/15 text-amber" },
  filled: { label: "Filled", color: "bg-emerald-500/15 text-emerald-400" },
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400" },
  cancelled: { label: "Cancelled", color: "bg-red-500/15 text-red-400" },
} as const;

export const FULFILLMENT_OPTIONS = [
  { value: "with_operator", label: "With Operator" },
  { value: "drop_off", label: "Drop-off (self-service)" },
  { value: "remote_operated", label: "Remote Operated" },
  { value: "any", label: "Any / No Preference" },
] as const;

export const JOB_CATEGORIES = [
  {
    slug: "warehouse-automation",
    label: "Warehouse Automation",
    description: "Picking, packing, palletizing, and inventory management.",
    taskType: "picking",
  },
  {
    slug: "security-patrol",
    label: "Security & Patrol",
    description: "Autonomous perimeter monitoring and threat detection.",
    taskType: "security",
  },
  {
    slug: "cleaning-sanitation",
    label: "Cleaning & Sanitation",
    description: "Floor scrubbing, UV disinfection, and facility maintenance.",
    taskType: "cleaning",
  },
  {
    slug: "inspection-survey",
    label: "Inspection & Survey",
    description: "Drone surveys, pipeline inspection, and structural analysis.",
    taskType: "inspection",
  },
  {
    slug: "agriculture-harvest",
    label: "Agriculture & Harvest",
    description: "Automated harvesting, weeding, crop monitoring, and spraying.",
    taskType: "agriculture",
  },
  {
    slug: "healthcare-support",
    label: "Healthcare Support",
    description: "Medication delivery, patient transport, and facility logistics.",
    taskType: "healthcare",
  },
  {
    slug: "hospitality-service",
    label: "Hospitality Service",
    description: "Room service delivery, concierge bots, and guest assistance.",
    taskType: "hospitality",
  },
  {
    slug: "construction-welding",
    label: "Construction & Welding",
    description: "Robotic welding, bricklaying, demolition, and site work.",
    taskType: "construction",
  },
] as const;

export function formatBudget(min?: number | null, max?: number | null): string {
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return "Open budget";
}

export function relativeTime(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
