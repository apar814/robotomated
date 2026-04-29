// lib/workforce/types.ts — Workforce Network type definitions

export type RoleType =
  | "robot_tech"
  | "cobot_programmer"
  | "amr_fleet"
  | "drone_pilot"
  | "safety_inspector"
  | "other";

export type Timeline =
  | "immediately"
  | "1_3_months"
  | "3_6_months"
  | "6_12_months"
  | "exploring";

export type WillingnessToPay =
  | "yes_percentage"
  | "yes_flat_fee"
  | "not_yet"
  | "need_more_info";

export type EmployerStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "closed_won"
  | "closed_lost";

export type PaymentStatus = "pending" | "paid" | "refunded";
export type CompletionStatus = "not_started" | "in_progress" | "completed" | "dropped";
export type PlacementStatus = "not_applicable" | "seeking" | "matched" | "placed" | "declined";
export type CohortStatus = "open" | "full" | "in_progress" | "completed";
export type EnrollmentTier = "early_bird" | "standard";

export interface EmployerIntent {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_title: string | null;
  role_type: RoleType;
  role_type_other: string | null;
  hires_needed: number;
  timeline: Timeline;
  salary_min: number | null;
  salary_max: number | null;
  willingness_to_pay: WillingnessToPay | null;
  notes: string | null;
  source: string | null;
  status: EmployerStatus;
  contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Cohort {
  id: string;
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  capacity: number;
  enrolled_count: number;
  status: CohortStatus;
  created_at: string;
}

export interface CertificationEnrollment {
  id: string;
  user_id: string;
  cohort_id: string;
  tier: EnrollmentTier;
  amount_paid_cents: number | null;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  payment_status: PaymentStatus;
  completion_status: CompletionStatus;
  placement_status: PlacementStatus;
  employer_id_placed_with: string | null;
  enrolled_at: string;
  completed_at: string | null;
  placed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Form submission type (public form subset)
export interface EmployerIntentSubmission {
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_title?: string;
  role_type: RoleType;
  role_type_other?: string;
  hires_needed: number;
  timeline: Timeline;
  salary_min?: number;
  salary_max?: number;
  willingness_to_pay?: WillingnessToPay;
  notes?: string;
}

// Display labels
export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  robot_tech: "Robot Technician",
  cobot_programmer: "Cobot Programmer",
  amr_fleet: "AMR Fleet Operator",
  drone_pilot: "Drone Pilot",
  safety_inspector: "Safety Inspector",
  other: "Other",
};

export const TIMELINE_LABELS: Record<Timeline, string> = {
  immediately: "Immediately",
  "1_3_months": "1-3 Months",
  "3_6_months": "3-6 Months",
  "6_12_months": "6-12 Months",
  exploring: "Just Exploring",
};

export const WTP_LABELS: Record<WillingnessToPay, string> = {
  yes_percentage: "Yes, percentage of salary",
  yes_flat_fee: "Yes, flat placement fee",
  not_yet: "Not yet, but open to it",
  need_more_info: "Need more information",
};

export const STATUS_LABELS: Record<EmployerStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  closed_won: "Won",
  closed_lost: "Lost",
};
