// ── RoboWork shared constants ──

export const TASK_TYPES = [
  { value: "cleaning", label: "Cleaning & Sanitation", icon: "🧹" },
  { value: "delivery", label: "Delivery & Transport", icon: "📦" },
  { value: "security", label: "Security & Patrol", icon: "🛡️" },
  { value: "inspection", label: "Inspection & Survey", icon: "🔍" },
  { value: "assembly", label: "Assembly & Manufacturing", icon: "🔧" },
  { value: "picking", label: "Order Picking", icon: "📋" },
  { value: "packing", label: "Packing & Palletizing", icon: "📦" },
  { value: "welding", label: "Welding & Fabrication", icon: "⚡" },
  { value: "painting", label: "Painting & Coating", icon: "🎨" },
  { value: "agriculture", label: "Agriculture & Harvest", icon: "🌾" },
  { value: "healthcare", label: "Healthcare Support", icon: "🏥" },
  { value: "hospitality", label: "Hospitality Service", icon: "🏨" },
  { value: "construction", label: "Construction & Demo", icon: "🏗️" },
  { value: "other", label: "Other", icon: "⚙️" },
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
  asap: { label: "ASAP", color: "bg-magenta/15 text-magenta border-magenta/20" },
  within_week: { label: "Within a Week", color: "bg-amber/15 text-amber border-amber/20" },
  within_month: { label: "Within a Month", color: "bg-lime/15 text-lime border-lime/20" },
  flexible: { label: "Flexible", color: "bg-text-tertiary/15 text-text-secondary border-text-tertiary/20" },
} as const;

export const STATUS_CONFIG = {
  draft: { label: "Draft", color: "bg-text-tertiary/15 text-text-secondary" },
  open: { label: "Open", color: "bg-electric-blue/15 text-electric-blue" },
  in_review: { label: "In Review", color: "bg-amber/15 text-amber" },
  filled: { label: "Filled", color: "bg-lime/15 text-lime" },
  completed: { label: "Completed", color: "bg-lime/15 text-lime" },
  cancelled: { label: "Cancelled", color: "bg-magenta/15 text-magenta" },
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
