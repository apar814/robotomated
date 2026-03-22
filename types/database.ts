// Generated types will replace this once Supabase schema is created.
// For now, define the shape so TypeScript is happy.

export interface Database {
  public: {
    Tables: {
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface Robot {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  category: RobotCategory;
  subcategory: string | null;
  description: string;
  image_url: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  roboscore: number | null;
  scores: RoboScoreBreakdown | null;
  specs: Record<string, unknown>;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  robot_id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  roboscore: number;
  scores: RoboScoreBreakdown;
  verdict: string;
  pros: string[];
  cons: string[];
  author: string;
  status: "draft" | "published";
  created_at: string;
}

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

export type RobotCategory =
  | "warehouse"
  | "manufacturing"
  | "healthcare"
  | "agriculture"
  | "construction"
  | "consumer"
  | "delivery"
  | "inspection"
  | "education"
  | "other";
