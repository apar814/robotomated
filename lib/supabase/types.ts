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
          description: string | null;
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
          description?: string | null;
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
          description?: string | null;
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
          // Buyer intelligence fields
          maintenance_annual_pct: number | null;
          maintenance_annual_cost_low: number | null;
          maintenance_annual_cost_high: number | null;
          warranty_months: number | null;
          warranty_coverage: string | null;
          support_model: 'on-site' | 'remote' | 'partner' | 'none' | null;
          support_response_hours: number | null;
          spare_parts_availability: 'stocked' | 'order' | 'custom' | 'proprietary' | null;
          deployment_weeks_min: number | null;
          deployment_weeks_max: number | null;
          floor_space_sqft: number | null;
          power_requirements: string | null;
          network_requirements: string | null;
          wms_integrations: string[] | null;
          erp_integrations: string[] | null;
          api_available: boolean | null;
          operator_training_hours: number | null;
          safety_certifications: string[] | null;
          industry_certifications: string[] | null;
          vendor_funding_total: string | null;
          vendor_employees_range: string | null;
          vendor_health_score: number | null;
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
          // Buyer intelligence fields
          maintenance_annual_pct?: number | null;
          maintenance_annual_cost_low?: number | null;
          maintenance_annual_cost_high?: number | null;
          warranty_months?: number | null;
          warranty_coverage?: string | null;
          support_model?: 'on-site' | 'remote' | 'partner' | 'none' | null;
          support_response_hours?: number | null;
          spare_parts_availability?: 'stocked' | 'order' | 'custom' | 'proprietary' | null;
          deployment_weeks_min?: number | null;
          deployment_weeks_max?: number | null;
          floor_space_sqft?: number | null;
          power_requirements?: string | null;
          network_requirements?: string | null;
          wms_integrations?: string[] | null;
          erp_integrations?: string[] | null;
          api_available?: boolean | null;
          operator_training_hours?: number | null;
          safety_certifications?: string[] | null;
          industry_certifications?: string[] | null;
          vendor_funding_total?: string | null;
          vendor_employees_range?: string | null;
          vendor_health_score?: number | null;
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
          // Buyer intelligence fields
          maintenance_annual_pct?: number | null;
          maintenance_annual_cost_low?: number | null;
          maintenance_annual_cost_high?: number | null;
          warranty_months?: number | null;
          warranty_coverage?: string | null;
          support_model?: 'on-site' | 'remote' | 'partner' | 'none' | null;
          support_response_hours?: number | null;
          spare_parts_availability?: 'stocked' | 'order' | 'custom' | 'proprietary' | null;
          deployment_weeks_min?: number | null;
          deployment_weeks_max?: number | null;
          floor_space_sqft?: number | null;
          power_requirements?: string | null;
          network_requirements?: string | null;
          wms_integrations?: string[] | null;
          erp_integrations?: string[] | null;
          api_available?: boolean | null;
          operator_training_hours?: number | null;
          safety_certifications?: string[] | null;
          industry_certifications?: string[] | null;
          vendor_funding_total?: string | null;
          vendor_employees_range?: string | null;
          vendor_health_score?: number | null;
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
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_ends_at: string | null;
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
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
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
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_ends_at?: string | null;
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
      user_saved_robots: {
        Row: {
          id: string;
          user_id: string;
          robot_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          robot_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          robot_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_saved_robots_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_saved_robots_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      affiliate_clicks: {
        Row: {
          id: string;
          robot_id: string;
          retailer: string;
          user_id: string | null;
          session_id: string | null;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          robot_id: string;
          retailer: string;
          user_id?: string | null;
          session_id?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          robot_id?: string;
          retailer?: string;
          user_id?: string | null;
          session_id?: string | null;
          referrer?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      price_alerts: {
        Row: {
          id: string;
          robot_id: string;
          email: string;
          target_price: number;
          active: boolean;
          triggered_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          robot_id: string;
          email: string;
          target_price: number;
          active?: boolean;
          triggered_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          robot_id?: string;
          email?: string;
          target_price?: number;
          active?: boolean;
          triggered_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "price_alerts_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      manufacturer_submissions: {
        Row: {
          id: string;
          company_name: string;
          contact_email: string;
          robot_name: string;
          model_number: string | null;
          product_url: string | null;
          specs: Json;
          notes: string | null;
          status: string;
          reviewed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_email: string;
          robot_name: string;
          model_number?: string | null;
          product_url?: string | null;
          specs?: Json;
          notes?: string | null;
          status?: string;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_email?: string;
          robot_name?: string;
          model_number?: string | null;
          product_url?: string | null;
          specs?: Json;
          notes?: string | null;
          status?: string;
          reviewed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      revenue_entries: {
        Row: {
          id: string;
          month: string;
          source: string;
          amount: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          month: string;
          source: string;
          amount: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: string;
          source?: string;
          amount?: number;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          source: string | null;
          industry_preference: string | null;
          unsubscribe_token: string;
          confirmed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          source?: string | null;
          industry_preference?: string | null;
          unsubscribe_token?: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          source?: string | null;
          industry_preference?: string | null;
          unsubscribe_token?: string;
          confirmed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      news_items: {
        Row: {
          id: string;
          title: string;
          url: string;
          source: string;
          summary: string | null;
          category: string | null;
          image_url: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          source: string;
          summary?: string | null;
          category?: string | null;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          source?: string;
          summary?: string | null;
          category?: string | null;
          image_url?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      funding_rounds: {
        Row: {
          id: string;
          company: string;
          amount: string | null;
          round: string | null;
          date: string | null;
          investors: string | null;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          amount?: string | null;
          round?: string | null;
          date?: string | null;
          investors?: string | null;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          amount?: string | null;
          round?: string | null;
          date?: string | null;
          investors?: string | null;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      pro_waitlist: {
        Row: {
          id: string;
          email: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      robot_assets: {
        Row: {
          id: string;
          user_id: string;
          robot_id: string | null;
          custom_name: string | null;
          serial_number: string | null;
          purchase_date: string | null;
          purchase_price: number | null;
          site_location: string | null;
          department: string | null;
          status: "active" | "maintenance" | "offline" | "decommissioned";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          robot_id?: string | null;
          custom_name?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          site_location?: string | null;
          department?: string | null;
          status?: "active" | "maintenance" | "offline" | "decommissioned";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          robot_id?: string | null;
          custom_name?: string | null;
          serial_number?: string | null;
          purchase_date?: string | null;
          purchase_price?: number | null;
          site_location?: string | null;
          department?: string | null;
          status?: "active" | "maintenance" | "offline" | "decommissioned";
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robot_assets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "robot_assets_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      maintenance_logs: {
        Row: {
          id: string;
          asset_id: string;
          user_id: string;
          log_date: string;
          maintenance_type: "routine" | "repair" | "emergency" | "upgrade";
          description: string | null;
          technician: string | null;
          cost: number | null;
          downtime_hours: number | null;
          parts_replaced: string[] | null;
          next_service_date: string | null;
          documents: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          user_id: string;
          log_date: string;
          maintenance_type: "routine" | "repair" | "emergency" | "upgrade";
          description?: string | null;
          technician?: string | null;
          cost?: number | null;
          downtime_hours?: number | null;
          parts_replaced?: string[] | null;
          next_service_date?: string | null;
          documents?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          user_id?: string;
          log_date?: string;
          maintenance_type?: "routine" | "repair" | "emergency" | "upgrade";
          description?: string | null;
          technician?: string | null;
          cost?: number | null;
          downtime_hours?: number | null;
          parts_replaced?: string[] | null;
          next_service_date?: string | null;
          documents?: string[] | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "robot_assets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "maintenance_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      maintenance_schedules: {
        Row: {
          id: string;
          asset_id: string;
          schedule_name: string;
          interval_type: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based";
          interval_value: number;
          task_description: string | null;
          estimated_hours: number | null;
          estimated_cost: number | null;
          requires_professional: boolean;
          last_completed: string | null;
          next_due: string | null;
          alert_days_before: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          asset_id: string;
          schedule_name: string;
          interval_type: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based";
          interval_value?: number;
          task_description?: string | null;
          estimated_hours?: number | null;
          estimated_cost?: number | null;
          requires_professional?: boolean;
          last_completed?: string | null;
          next_due?: string | null;
          alert_days_before?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          asset_id?: string;
          schedule_name?: string;
          interval_type?: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based";
          interval_value?: number;
          task_description?: string | null;
          estimated_hours?: number | null;
          estimated_cost?: number | null;
          requires_professional?: boolean;
          last_completed?: string | null;
          next_due?: string | null;
          alert_days_before?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "maintenance_schedules_asset_id_fkey";
            columns: ["asset_id"];
            isOneToOne: false;
            referencedRelation: "robot_assets";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      robot_status: "active" | "discontinued" | "coming_soon";
      review_type: "expert" | "community" | "video";
      subscription_tier: "free" | "pro" | "enterprise";
      robot_asset_status: "active" | "maintenance" | "offline" | "decommissioned";
      maintenance_type: "routine" | "repair" | "emergency" | "upgrade";
      schedule_interval: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "hours-based";
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

export type RobotAssetStatus = Database["public"]["Enums"]["robot_asset_status"];
export type MaintenanceType = Database["public"]["Enums"]["maintenance_type"];
export type ScheduleInterval = Database["public"]["Enums"]["schedule_interval"];

export type RobotAsset = Database["public"]["Tables"]["robot_assets"]["Row"];
export type MaintenanceLog = Database["public"]["Tables"]["maintenance_logs"]["Row"];
export type MaintenanceSchedule = Database["public"]["Tables"]["maintenance_schedules"]["Row"];

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
