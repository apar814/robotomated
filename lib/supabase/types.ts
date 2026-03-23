// ============================================================================
// Robotomated.com — Supabase Database Types
// Matches 001_initial_schema.sql
// ============================================================================

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type RobotStatus = "active" | "discontinued" | "coming_soon";
export type ReviewType = "expert" | "community" | "video";
export type SubscriptionTier = "free" | "pro" | "enterprise";

// ---------------------------------------------------------------------------
// Score Breakdown (shared across robots & reviews)
// ---------------------------------------------------------------------------

export interface RoboScoreBreakdown {
  performance: number;
  reliability: number;
  ease_of_use: number;
  intelligence: number;
  value: number;
  ecosystem: number;
  safety: number;
  design: number;
}

// ---------------------------------------------------------------------------
// Row types (what you get back from SELECT)
// ---------------------------------------------------------------------------

export interface RobotCategory {
  id: string;
  slug: string;
  name: string;
  parent_id: string | null;
  description: string | null;
  icon_name: string | null;
  display_order: number;
  created_at: string;
}

export interface Manufacturer {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  founded_year: number | null;
  website: string | null;
  logo_url: string | null;
  verified: boolean;
  created_at: string;
}

export interface Robot {
  id: string;
  slug: string;
  name: string;
  manufacturer_id: string;
  category_id: string;
  model_number: string | null;
  year_released: number | null;
  price_msrp: number | null;
  price_current: number | null;
  description_short: string | null;
  description_long: string | null;
  specs: Record<string, unknown>;
  images: RobotImage[];
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  affiliate_url: string | null;
  amazon_asin: string | null;
  status: RobotStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  robot_id: string;
  reviewer_id: string | null;
  review_type: ReviewType;
  title: string;
  body: string;
  robo_score: number | null;
  score_breakdown: RoboScoreBreakdown | null;
  pros: string[];
  cons: string[];
  verdict: string | null;
  verified_purchase: boolean;
  published_at: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  persona_type: string | null;
  preferences: Record<string, unknown>;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

export interface AdvisorConversation {
  id: string;
  user_id: string | null;
  session_id: string;
  messages: ConversationMessage[];
  use_case: string | null;
  budget_min: number | null;
  budget_max: number | null;
  recommendations: string[];
  created_at: string;
}

export interface PriceHistory {
  id: string;
  robot_id: string;
  retailer: string;
  price: number;
  currency: string;
  recorded_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string | null;
  confirmed: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Supporting types
// ---------------------------------------------------------------------------

export interface RobotImage {
  url: string;
  alt: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Joined / enriched types (for API responses)
// ---------------------------------------------------------------------------

export interface RobotWithRelations extends Robot {
  manufacturer: Manufacturer;
  category: RobotCategory;
}

export interface ReviewWithRobot extends Review {
  robot: Robot;
}

// ---------------------------------------------------------------------------
// Supabase Database type (for createClient<Database>)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      robot_categories: {
        Row: RobotCategory;
        Insert: Omit<RobotCategory, "id" | "created_at">;
        Update: Partial<Omit<RobotCategory, "id">>;
      };
      manufacturers: {
        Row: Manufacturer;
        Insert: Omit<Manufacturer, "id" | "created_at">;
        Update: Partial<Omit<Manufacturer, "id">>;
      };
      robots: {
        Row: Robot;
        Insert: Omit<Robot, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Robot, "id">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id">>;
      };
      users: {
        Row: User;
        Insert: Omit<User, "created_at">;
        Update: Partial<Omit<User, "id">>;
      };
      advisor_conversations: {
        Row: AdvisorConversation;
        Insert: Omit<AdvisorConversation, "id" | "created_at">;
        Update: Partial<Omit<AdvisorConversation, "id">>;
      };
      price_history: {
        Row: PriceHistory;
        Insert: Omit<PriceHistory, "id">;
        Update: Partial<Omit<PriceHistory, "id">>;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
        Insert: Omit<NewsletterSubscriber, "id" | "created_at">;
        Update: Partial<Omit<NewsletterSubscriber, "id">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      robot_status: RobotStatus;
      review_type: ReviewType;
      subscription_tier: SubscriptionTier;
    };
  };
}
