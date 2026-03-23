// ============================================================================
// Robotomated.com — Supabase Database Types
// Matches 001_initial_schema.sql
// Compatible with @supabase/supabase-js v2.99+
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Database type (for createClient<Database>)
// ---------------------------------------------------------------------------

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      robot_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          parent_id: string | null;
          description: string | null;
          icon_name: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          parent_id?: string | null;
          description?: string | null;
          icon_name?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          parent_id?: string | null;
          description?: string | null;
          icon_name?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robot_categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "robot_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      manufacturers: {
        Row: {
          id: string;
          slug: string;
          name: string;
          country: string | null;
          founded_year: number | null;
          website: string | null;
          logo_url: string | null;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          country?: string | null;
          founded_year?: number | null;
          website?: string | null;
          logo_url?: string | null;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          country?: string | null;
          founded_year?: number | null;
          website?: string | null;
          logo_url?: string | null;
          verified?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      robots: {
        Row: {
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
          specs: Json;
          images: Json;
          robo_score: number | null;
          score_breakdown: Json;
          affiliate_url: string | null;
          amazon_asin: string | null;
          status: "active" | "discontinued" | "coming_soon";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          manufacturer_id: string;
          category_id: string;
          model_number?: string | null;
          year_released?: number | null;
          price_msrp?: number | null;
          price_current?: number | null;
          description_short?: string | null;
          description_long?: string | null;
          specs?: Json;
          images?: Json;
          robo_score?: number | null;
          score_breakdown?: Json;
          affiliate_url?: string | null;
          amazon_asin?: string | null;
          status?: "active" | "discontinued" | "coming_soon";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          manufacturer_id?: string;
          category_id?: string;
          model_number?: string | null;
          year_released?: number | null;
          price_msrp?: number | null;
          price_current?: number | null;
          description_short?: string | null;
          description_long?: string | null;
          specs?: Json;
          images?: Json;
          robo_score?: number | null;
          score_breakdown?: Json;
          affiliate_url?: string | null;
          amazon_asin?: string | null;
          status?: "active" | "discontinued" | "coming_soon";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robots_manufacturer_id_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "manufacturers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "robots_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "robot_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      reviews: {
        Row: {
          id: string;
          robot_id: string;
          reviewer_id: string | null;
          review_type: "expert" | "community" | "video";
          title: string;
          body: string;
          robo_score: number | null;
          score_breakdown: Json;
          pros: Json;
          cons: Json;
          verdict: string | null;
          verified_purchase: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          robot_id: string;
          reviewer_id?: string | null;
          review_type?: "expert" | "community" | "video";
          title: string;
          body: string;
          robo_score?: number | null;
          score_breakdown?: Json;
          pros?: Json;
          cons?: Json;
          verdict?: string | null;
          verified_purchase?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          robot_id?: string;
          reviewer_id?: string | null;
          review_type?: "expert" | "community" | "video";
          title?: string;
          body?: string;
          robo_score?: number | null;
          score_breakdown?: Json;
          pros?: Json;
          cons?: Json;
          verdict?: string | null;
          verified_purchase?: boolean;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          persona_type: string | null;
          preferences: Json;
          subscription_tier: "free" | "pro" | "enterprise";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          persona_type?: string | null;
          preferences?: Json;
          subscription_tier?: "free" | "pro" | "enterprise";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          persona_type?: string | null;
          preferences?: Json;
          subscription_tier?: "free" | "pro" | "enterprise";
          created_at?: string;
        };
        Relationships: [];
      };
      advisor_conversations: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          messages: Json;
          use_case: string | null;
          budget_min: number | null;
          budget_max: number | null;
          recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          messages?: Json;
          use_case?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          recommendations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string;
          messages?: Json;
          use_case?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          recommendations?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "advisor_conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      price_history: {
        Row: {
          id: string;
          robot_id: string;
          retailer: string;
          price: number;
          currency: string;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          robot_id: string;
          retailer: string;
          price: number;
          currency?: string;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          robot_id?: string;
          retailer?: string;
          price?: number;
          currency?: string;
          recorded_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_history_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          confirmed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      robot_status: "active" | "discontinued" | "coming_soon";
      review_type: "expert" | "community" | "video";
      subscription_tier: "free" | "pro" | "enterprise";
    };
  };
}

// ---------------------------------------------------------------------------
// Convenience type aliases
// ---------------------------------------------------------------------------

export type RobotStatus = Database["public"]["Enums"]["robot_status"];
export type ReviewType = Database["public"]["Enums"]["review_type"];
export type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

export type RobotCategory = Database["public"]["Tables"]["robot_categories"]["Row"];
export type Manufacturer = Database["public"]["Tables"]["manufacturers"]["Row"];
export type Robot = Database["public"]["Tables"]["robots"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type AdvisorConversation = Database["public"]["Tables"]["advisor_conversations"]["Row"];
export type PriceHistory = Database["public"]["Tables"]["price_history"]["Row"];
export type NewsletterSubscriber = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

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

export interface RobotImage {
  url: string;
  alt: string;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface RobotWithRelations extends Robot {
  manufacturers: Manufacturer;
  robot_categories: RobotCategory;
}

export interface ReviewWithRobot extends Review {
  robots: Robot;
}
