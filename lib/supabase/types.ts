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
          partnership_status: string | null;
          partnership_tier: string | null;
          partner_contact_name: string | null;
          partner_contact_email: string | null;
          data_accuracy: number;
          last_verified: string | null;
          featured_until: string | null;
          sponsored_listings: boolean;
          claimed_profile: boolean;
          claimed_at: string | null;
          claimed_by: string | null;
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
          partnership_status?: string | null;
          partnership_tier?: string | null;
          partner_contact_name?: string | null;
          partner_contact_email?: string | null;
          data_accuracy?: number;
          last_verified?: string | null;
          featured_until?: string | null;
          sponsored_listings?: boolean;
          claimed_profile?: boolean;
          claimed_at?: string | null;
          claimed_by?: string | null;
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
          partnership_status?: string | null;
          partnership_tier?: string | null;
          partner_contact_name?: string | null;
          partner_contact_email?: string | null;
          data_accuracy?: number;
          last_verified?: string | null;
          featured_until?: string | null;
          sponsored_listings?: boolean;
          claimed_profile?: boolean;
          claimed_at?: string | null;
          claimed_by?: string | null;
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
          youtube_url: string | null;
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
          youtube_url?: string | null;
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
          youtube_url?: string | null;
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
      email_sends: {
        Row: {
          id: string;
          recipient_email: string;
          template_id: string;
          sent_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_email: string;
          template_id: string;
          sent_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_email?: string;
          template_id?: string;
          sent_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      careers_interest: {
        Row: {
          id: string;
          email: string;
          type: string;
          role_interest: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          type: string;
          role_interest?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          type?: string;
          role_interest?: string | null;
          created_at?: string;
        };
        Relationships: [];
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
      robot_service_providers: {
        Row: {
          id: string;
          user_id: string | null;
          company_name: string;
          slug: string;
          description: string | null;
          bio: string | null;
          city: string | null;
          state: string | null;
          country: string;
          service_radius: number;
          operating_regions: string[];
          verified: boolean;
          verified_at: string | null;
          verification_documents: string[];
          rating: number;
          total_jobs: number;
          completed_jobs: number;
          response_time_hours: number | null;
          insurance_verified: boolean;
          background_checked: boolean;
          profile_image: string | null;
          portfolio_images: string[];
          website: string | null;
          linkedin: string | null;
          specializations: string[];
          fulfillment_types: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_name: string;
          slug: string;
          description?: string | null;
          bio?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          service_radius?: number;
          operating_regions?: string[];
          verified?: boolean;
          verified_at?: string | null;
          verification_documents?: string[];
          rating?: number;
          total_jobs?: number;
          completed_jobs?: number;
          response_time_hours?: number | null;
          insurance_verified?: boolean;
          background_checked?: boolean;
          profile_image?: string | null;
          portfolio_images?: string[];
          website?: string | null;
          linkedin?: string | null;
          specializations?: string[];
          fulfillment_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_name?: string;
          slug?: string;
          description?: string | null;
          bio?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string;
          service_radius?: number;
          operating_regions?: string[];
          verified?: boolean;
          verified_at?: string | null;
          verification_documents?: string[];
          rating?: number;
          total_jobs?: number;
          completed_jobs?: number;
          response_time_hours?: number | null;
          insurance_verified?: boolean;
          background_checked?: boolean;
          profile_image?: string | null;
          portfolio_images?: string[];
          website?: string | null;
          linkedin?: string | null;
          specializations?: string[];
          fulfillment_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robot_service_providers_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      rsp_robots: {
        Row: {
          id: string;
          rsp_id: string;
          robot_id: string | null;
          custom_name: string | null;
          custom_manufacturer: string | null;
          custom_category: string | null;
          description: string | null;
          fulfillment_types: string[];
          daily_rate: number | null;
          weekly_rate: number | null;
          monthly_rate: number | null;
          minimum_days: number;
          available: boolean;
          available_from: string | null;
          city: string | null;
          state: string | null;
          operator_included: boolean;
          remote_capable: boolean;
          images: string[];
          specifications: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rsp_id: string;
          robot_id?: string | null;
          custom_name?: string | null;
          custom_manufacturer?: string | null;
          custom_category?: string | null;
          description?: string | null;
          fulfillment_types?: string[];
          daily_rate?: number | null;
          weekly_rate?: number | null;
          monthly_rate?: number | null;
          minimum_days?: number;
          available?: boolean;
          available_from?: string | null;
          city?: string | null;
          state?: string | null;
          operator_included?: boolean;
          remote_capable?: boolean;
          images?: string[];
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rsp_id?: string;
          robot_id?: string | null;
          custom_name?: string | null;
          custom_manufacturer?: string | null;
          custom_category?: string | null;
          description?: string | null;
          fulfillment_types?: string[];
          daily_rate?: number | null;
          weekly_rate?: number | null;
          monthly_rate?: number | null;
          minimum_days?: number;
          available?: boolean;
          available_from?: string | null;
          city?: string | null;
          state?: string | null;
          operator_included?: boolean;
          remote_capable?: boolean;
          images?: string[];
          specifications?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rsp_robots_rsp_id_fkey";
            columns: ["rsp_id"];
            isOneToOne: false;
            referencedRelation: "robot_service_providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rsp_robots_robot_id_fkey";
            columns: ["robot_id"];
            isOneToOne: false;
            referencedRelation: "robots";
            referencedColumns: ["id"];
          }
        ];
      };
      robowork_jobs: {
        Row: {
          id: string;
          slug: string;
          business_name: string;
          business_email: string;
          business_user_id: string | null;
          title: string;
          description: string;
          task_type: string;
          industry: string;
          city: string | null;
          state: string | null;
          country: string;
          remote_ok: boolean;
          start_date: string | null;
          end_date: string | null;
          duration_days: number | null;
          budget_min: number | null;
          budget_max: number | null;
          fulfillment_type: string;
          robot_type: string;
          status: string;
          urgency: string;
          requirements: string | null;
          site_details: string | null;
          attachments: string[];
          view_count: number;
          bid_count: number;
          selected_bid_id: string | null;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          business_name: string;
          business_email: string;
          business_user_id?: string | null;
          title: string;
          description: string;
          task_type: string;
          industry: string;
          city?: string | null;
          state?: string | null;
          country?: string;
          remote_ok?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          duration_days?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          fulfillment_type?: string;
          robot_type?: string;
          status?: string;
          urgency?: string;
          requirements?: string | null;
          site_details?: string | null;
          attachments?: string[];
          view_count?: number;
          bid_count?: number;
          selected_bid_id?: string | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          business_name?: string;
          business_email?: string;
          business_user_id?: string | null;
          title?: string;
          description?: string;
          task_type?: string;
          industry?: string;
          city?: string | null;
          state?: string | null;
          country?: string;
          remote_ok?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          duration_days?: number | null;
          budget_min?: number | null;
          budget_max?: number | null;
          fulfillment_type?: string;
          robot_type?: string;
          status?: string;
          urgency?: string;
          requirements?: string | null;
          site_details?: string | null;
          attachments?: string[];
          view_count?: number;
          bid_count?: number;
          selected_bid_id?: string | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "robowork_jobs_business_user_id_fkey";
            columns: ["business_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      robowork_bids: {
        Row: {
          id: string;
          job_id: string;
          rsp_id: string;
          rsp_robot_id: string | null;
          proposed_price: number;
          price_breakdown: Json;
          message: string | null;
          fulfillment_type: string | null;
          proposed_start_date: string | null;
          proposed_end_date: string | null;
          includes_operator: boolean;
          status: string;
          business_response: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          rsp_id: string;
          rsp_robot_id?: string | null;
          proposed_price: number;
          price_breakdown?: Json;
          message?: string | null;
          fulfillment_type?: string | null;
          proposed_start_date?: string | null;
          proposed_end_date?: string | null;
          includes_operator?: boolean;
          status?: string;
          business_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          rsp_id?: string;
          rsp_robot_id?: string | null;
          proposed_price?: number;
          price_breakdown?: Json;
          message?: string | null;
          fulfillment_type?: string | null;
          proposed_start_date?: string | null;
          proposed_end_date?: string | null;
          includes_operator?: boolean;
          status?: string;
          business_response?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robowork_bids_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "robowork_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "robowork_bids_rsp_id_fkey";
            columns: ["rsp_id"];
            isOneToOne: false;
            referencedRelation: "robot_service_providers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "robowork_bids_rsp_robot_id_fkey";
            columns: ["rsp_robot_id"];
            isOneToOne: false;
            referencedRelation: "rsp_robots";
            referencedColumns: ["id"];
          }
        ];
      };
      robowork_reviews: {
        Row: {
          id: string;
          job_id: string;
          rsp_id: string;
          reviewer_name: string | null;
          reviewer_company: string | null;
          rating: number;
          title: string | null;
          body: string | null;
          would_hire_again: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          rsp_id: string;
          reviewer_name?: string | null;
          reviewer_company?: string | null;
          rating: number;
          title?: string | null;
          body?: string | null;
          would_hire_again?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          rsp_id?: string;
          reviewer_name?: string | null;
          reviewer_company?: string | null;
          rating?: number;
          title?: string | null;
          body?: string | null;
          would_hire_again?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "robowork_reviews_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "robowork_jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "robowork_reviews_rsp_id_fkey";
            columns: ["rsp_id"];
            isOneToOne: false;
            referencedRelation: "robot_service_providers";
            referencedColumns: ["id"];
          }
        ];
      };
      manufacturer_claims: {
        Row: {
          id: string;
          manufacturer_id: string;
          contact_name: string;
          job_title: string;
          work_email: string;
          linkedin_url: string | null;
          description: string | null;
          contact_info: string | null;
          logo_url: string | null;
          catalog_url: string | null;
          interested_featured: boolean;
          interested_sponsored: boolean;
          preferred_contact: string;
          status: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          manufacturer_id: string;
          contact_name: string;
          job_title: string;
          work_email: string;
          linkedin_url?: string | null;
          description?: string | null;
          contact_info?: string | null;
          logo_url?: string | null;
          catalog_url?: string | null;
          interested_featured?: boolean;
          interested_sponsored?: boolean;
          preferred_contact?: string;
          status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          manufacturer_id?: string;
          contact_name?: string;
          job_title?: string;
          work_email?: string;
          linkedin_url?: string | null;
          description?: string | null;
          contact_info?: string | null;
          logo_url?: string | null;
          catalog_url?: string | null;
          interested_featured?: boolean;
          interested_sponsored?: boolean;
          preferred_contact?: string;
          status?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "manufacturer_claims_manufacturer_id_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "manufacturers";
            referencedColumns: ["id"];
          }
        ];
      };
      manufacturer_partnerships: {
        Row: {
          id: string;
          contact_name: string;
          email: string;
          company: string;
          tier_interest: string | null;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_name: string;
          email: string;
          company: string;
          tier_interest?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          contact_name?: string;
          email?: string;
          company?: string;
          tier_interest?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      manufacturer_contact_clicks: {
        Row: {
          id: string;
          manufacturer_id: string;
          click_type: string;
          referrer: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          manufacturer_id: string;
          click_type: string;
          referrer?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          manufacturer_id?: string;
          click_type?: string;
          referrer?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "manufacturer_contact_clicks_manufacturer_id_fkey";
            columns: ["manufacturer_id"];
            isOneToOne: false;
            referencedRelation: "manufacturers";
            referencedColumns: ["id"];
          }
        ];
      };
      // --- Leasing tables (migration 020) ---
      lease_inquiries: {
        Row: { id: string; robot_id: string | null; robot_slug: string | null; robot_name: string | null; business_name: string; business_email: string; business_phone: string | null; industry: string | null; facility_size: string | null; employee_count: string | null; preferred_term: number; budget_monthly: number | null; total_budget: number | null; credit_rating: string; use_case: string | null; urgency: string | null; currently_leasing: boolean; existing_equipment: string | null; status: string; assigned_to: string | null; notes: string | null; utm_source: string | null; utm_medium: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; robot_slug?: string | null; robot_name?: string | null; business_name: string; business_email: string; business_phone?: string | null; industry?: string | null; facility_size?: string | null; employee_count?: string | null; preferred_term?: number; budget_monthly?: number | null; total_budget?: number | null; credit_rating?: string; use_case?: string | null; urgency?: string | null; currently_leasing?: boolean; existing_equipment?: string | null; status?: string; assigned_to?: string | null; notes?: string | null; utm_source?: string | null; utm_medium?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; robot_slug?: string | null; robot_name?: string | null; business_name?: string; business_email?: string; business_phone?: string | null; industry?: string | null; facility_size?: string | null; employee_count?: string | null; preferred_term?: number; budget_monthly?: number | null; total_budget?: number | null; credit_rating?: string; use_case?: string | null; urgency?: string | null; currently_leasing?: boolean; existing_equipment?: string | null; status?: string; assigned_to?: string | null; notes?: string | null; utm_source?: string | null; utm_medium?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      lease_transfers: {
        Row: { id: string; original_lease_id: string | null; robot_id: string | null; robot_name: string; robot_manufacturer: string | null; seller_name: string; seller_email: string; seller_phone: string | null; monthly_payment: number | null; remaining_months: number | null; remaining_balance: number | null; original_term: number | null; lease_company: string | null; transfer_fee: number | null; condition: number; condition_notes: string | null; images: string[]; city: string | null; state: string | null; available_from: string | null; status: string; buyer_name: string | null; buyer_email: string | null; completed_at: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; original_lease_id?: string | null; robot_id?: string | null; robot_name: string; robot_manufacturer?: string | null; seller_name: string; seller_email: string; seller_phone?: string | null; monthly_payment?: number | null; remaining_months?: number | null; remaining_balance?: number | null; original_term?: number | null; lease_company?: string | null; transfer_fee?: number | null; condition?: number; condition_notes?: string | null; images?: string[]; city?: string | null; state?: string | null; available_from?: string | null; status?: string; buyer_name?: string | null; buyer_email?: string | null; completed_at?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; original_lease_id?: string | null; robot_id?: string | null; robot_name?: string; robot_manufacturer?: string | null; seller_name?: string; seller_email?: string; seller_phone?: string | null; monthly_payment?: number | null; remaining_months?: number | null; remaining_balance?: number | null; original_term?: number | null; lease_company?: string | null; transfer_fee?: number | null; condition?: number; condition_notes?: string | null; images?: string[]; city?: string | null; state?: string | null; available_from?: string | null; status?: string; buyer_name?: string | null; buyer_email?: string | null; completed_at?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      robot_time_shares: {
        Row: { id: string; robot_id: string | null; robot_name: string; robot_manufacturer: string | null; robot_model: string | null; owner_id: string | null; owner_name: string; owner_email: string; city: string | null; state: string | null; available_hours: Json; hourly_rate: number | null; half_day_rate: number | null; daily_rate: number | null; minimum_hours: number; robot_type: string | null; capabilities: string[]; operator_included: boolean; remote_capable: boolean; industries: string[]; description: string | null; images: string[]; status: string; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; robot_name: string; robot_manufacturer?: string | null; robot_model?: string | null; owner_id?: string | null; owner_name: string; owner_email: string; city?: string | null; state?: string | null; available_hours?: Json; hourly_rate?: number | null; half_day_rate?: number | null; daily_rate?: number | null; minimum_hours?: number; robot_type?: string | null; capabilities?: string[]; operator_included?: boolean; remote_capable?: boolean; industries?: string[]; description?: string | null; images?: string[]; status?: string; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; robot_name?: string; robot_manufacturer?: string | null; robot_model?: string | null; owner_id?: string | null; owner_name?: string; owner_email?: string; city?: string | null; state?: string | null; available_hours?: Json; hourly_rate?: number | null; half_day_rate?: number | null; daily_rate?: number | null; minimum_hours?: number; robot_type?: string | null; capabilities?: string[]; operator_included?: boolean; remote_capable?: boolean; industries?: string[]; description?: string | null; images?: string[]; status?: string; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      time_share_bookings: {
        Row: { id: string; time_share_id: string; business_name: string; business_email: string; start_date_time: string; end_date_time: string; total_hours: number | null; total_cost: number | null; fulfillment_type: string | null; task_description: string | null; status: string; platform_fee: number | null; owner_payout: number | null; stripe_payment_intent_id: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; time_share_id: string; business_name: string; business_email: string; start_date_time: string; end_date_time: string; total_hours?: number | null; total_cost?: number | null; fulfillment_type?: string | null; task_description?: string | null; status?: string; platform_fee?: number | null; owner_payout?: number | null; stripe_payment_intent_id?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; time_share_id?: string; business_name?: string; business_email?: string; start_date_time?: string; end_date_time?: string; total_hours?: number | null; total_cost?: number | null; fulfillment_type?: string | null; task_description?: string | null; status?: string; platform_fee?: number | null; owner_payout?: number | null; stripe_payment_intent_id?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      // --- Certification tables (migration 021) ---
      rco_certifications: {
        Row: { id: string; slug: string; name: string; level: number; specialization: string | null; description: string | null; exam_duration: number; question_count: number; passing_score: number; price: number; renewal_years: number; renewal_price: number | null; prerequisites: string[]; skills: string[]; industries: string[]; active: boolean; created_at: string; updated_at: string; };
        Insert: { id?: string; slug: string; name: string; level: number; specialization?: string | null; description?: string | null; exam_duration?: number; question_count?: number; passing_score?: number; price: number; renewal_years?: number; renewal_price?: number | null; prerequisites?: string[]; skills?: string[]; industries?: string[]; active?: boolean; created_at?: string; updated_at?: string; };
        Update: { id?: string; slug?: string; name?: string; level?: number; specialization?: string | null; description?: string | null; exam_duration?: number; question_count?: number; passing_score?: number; price?: number; renewal_years?: number; renewal_price?: number | null; prerequisites?: string[]; skills?: string[]; industries?: string[]; active?: boolean; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      rco_exam_sessions: {
        Row: { id: string; user_id: string | null; certification_id: string; session_token: string; status: string; started_at: string; completed_at: string | null; expires_at: string | null; question_ids: Json; answers: Json; tab_switch_count: number; focus_lost_count: number; time_anomalies: Json; score: number | null; passed: boolean | null; flagged_for_review: boolean; ip_address: string | null; user_agent: string | null; created_at: string; };
        Insert: { id?: string; user_id?: string | null; certification_id: string; session_token: string; status?: string; started_at?: string; completed_at?: string | null; expires_at?: string | null; question_ids?: Json; answers?: Json; tab_switch_count?: number; focus_lost_count?: number; time_anomalies?: Json; score?: number | null; passed?: boolean | null; flagged_for_review?: boolean; ip_address?: string | null; user_agent?: string | null; created_at?: string; };
        Update: { id?: string; user_id?: string | null; certification_id?: string; session_token?: string; status?: string; started_at?: string; completed_at?: string | null; expires_at?: string | null; question_ids?: Json; answers?: Json; tab_switch_count?: number; focus_lost_count?: number; time_anomalies?: Json; score?: number | null; passed?: boolean | null; flagged_for_review?: boolean; ip_address?: string | null; user_agent?: string | null; created_at?: string; };
        Relationships: [];
      };
      rco_credentials: {
        Row: { id: string; user_id: string | null; certification_id: string; exam_session_id: string | null; credential_id: string; holder_name: string; holder_email: string; issued_at: string; expires_at: string | null; status: string; manufacturer_endorsements: string[]; verification_count: number; shareable_url: string | null; pdf_url: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; user_id?: string | null; certification_id: string; exam_session_id?: string | null; credential_id: string; holder_name: string; holder_email: string; issued_at?: string; expires_at?: string | null; status?: string; manufacturer_endorsements?: string[]; verification_count?: number; shareable_url?: string | null; pdf_url?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; user_id?: string | null; certification_id?: string; exam_session_id?: string | null; credential_id?: string; holder_name?: string; holder_email?: string; issued_at?: string; expires_at?: string | null; status?: string; manufacturer_endorsements?: string[]; verification_count?: number; shareable_url?: string | null; pdf_url?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      // --- Post-purchase tables (migration 022) ---
      service_requests: {
        Row: { id: string; robot_id: string | null; robot_name: string | null; robot_manufacturer: string | null; robot_model: string | null; business_name: string; business_email: string; service_type: string; description: string | null; urgency: string; city: string | null; state: string | null; preferred_date: string | null; flexible_date: boolean; budget_range: string | null; status: string; assigned_provider_id: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; robot_name?: string | null; robot_manufacturer?: string | null; robot_model?: string | null; business_name: string; business_email: string; service_type: string; description?: string | null; urgency?: string; city?: string | null; state?: string | null; preferred_date?: string | null; flexible_date?: boolean; budget_range?: string | null; status?: string; assigned_provider_id?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; robot_name?: string | null; robot_manufacturer?: string | null; robot_model?: string | null; business_name?: string; business_email?: string; service_type?: string; description?: string | null; urgency?: string; city?: string | null; state?: string | null; preferred_date?: string | null; flexible_date?: boolean; budget_range?: string | null; status?: string; assigned_provider_id?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      parts_listings: {
        Row: { id: string; robot_id: string | null; part_name: string; part_number: string | null; manufacturer: string | null; compatible_models: string[]; condition: string; price: number; quantity: number; city: string | null; state: string | null; ships_nationally: boolean; seller_id: string | null; seller_name: string; seller_email: string; images: string[]; status: string; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; part_name: string; part_number?: string | null; manufacturer?: string | null; compatible_models?: string[]; condition?: string; price: number; quantity?: number; city?: string | null; state?: string | null; ships_nationally?: boolean; seller_id?: string | null; seller_name: string; seller_email: string; images?: string[]; status?: string; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; part_name?: string; part_number?: string | null; manufacturer?: string | null; compatible_models?: string[]; condition?: string; price?: number; quantity?: number; city?: string | null; state?: string | null; ships_nationally?: boolean; seller_id?: string | null; seller_name?: string; seller_email?: string; images?: string[]; status?: string; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      trade_in_valuations: {
        Row: { id: string; robot_id: string | null; robot_name: string; robot_manufacturer: string | null; robot_model: string | null; year_purchased: number | null; purchase_price: number | null; operating_hours: number | null; condition: number; condition_notes: string | null; known_issues: string | null; software_version: string | null; last_maintenance: string | null; city: string | null; state: string | null; business_name: string; business_email: string; business_phone: string | null; market_demand_score: number; estimated_low: number | null; estimated_high: number | null; estimated_mid: number | null; valuation_factors: Json; recommendation: string | null; status: string; listed_as_cpo: boolean; sold_price: number | null; sold_at: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; robot_name: string; robot_manufacturer?: string | null; robot_model?: string | null; year_purchased?: number | null; purchase_price?: number | null; operating_hours?: number | null; condition?: number; condition_notes?: string | null; known_issues?: string | null; software_version?: string | null; last_maintenance?: string | null; city?: string | null; state?: string | null; business_name: string; business_email: string; business_phone?: string | null; market_demand_score?: number; estimated_low?: number | null; estimated_high?: number | null; estimated_mid?: number | null; valuation_factors?: Json; recommendation?: string | null; status?: string; listed_as_cpo?: boolean; sold_price?: number | null; sold_at?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; robot_name?: string; robot_manufacturer?: string | null; robot_model?: string | null; year_purchased?: number | null; purchase_price?: number | null; operating_hours?: number | null; condition?: number; condition_notes?: string | null; known_issues?: string | null; software_version?: string | null; last_maintenance?: string | null; city?: string | null; state?: string | null; business_name?: string; business_email?: string; business_phone?: string | null; market_demand_score?: number; estimated_low?: number | null; estimated_high?: number | null; estimated_mid?: number | null; valuation_factors?: Json; recommendation?: string | null; status?: string; listed_as_cpo?: boolean; sold_price?: number | null; sold_at?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      cpo_listings: {
        Row: { id: string; robot_id: string | null; trade_in_id: string | null; robot_name: string; robot_manufacturer: string | null; robot_model: string | null; year: number | null; condition: number; condition_report: string | null; operating_hours: number | null; certified_by: string | null; images: string[]; asking_price: number; negotiable: boolean; city: string | null; state: string | null; ships_nationally: boolean; warranty_months: number; robotomated_certified: boolean; seller_id: string | null; seller_email: string; status: string; view_count: number; inquiry_count: number; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; trade_in_id?: string | null; robot_name: string; robot_manufacturer?: string | null; robot_model?: string | null; year?: number | null; condition?: number; condition_report?: string | null; operating_hours?: number | null; certified_by?: string | null; images?: string[]; asking_price: number; negotiable?: boolean; city?: string | null; state?: string | null; ships_nationally?: boolean; warranty_months?: number; robotomated_certified?: boolean; seller_id?: string | null; seller_email: string; status?: string; view_count?: number; inquiry_count?: number; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; trade_in_id?: string | null; robot_name?: string; robot_manufacturer?: string | null; robot_model?: string | null; year?: number | null; condition?: number; condition_report?: string | null; operating_hours?: number | null; certified_by?: string | null; images?: string[]; asking_price?: number; negotiable?: boolean; city?: string | null; state?: string | null; ships_nationally?: boolean; warranty_months?: number; robotomated_certified?: boolean; seller_id?: string | null; seller_email?: string; status?: string; view_count?: number; inquiry_count?: number; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      robot_insurance_inquiries: {
        Row: { id: string; robot_id: string | null; robot_name: string | null; robot_manufacturer: string | null; robot_model: string | null; purchase_price: number | null; year_purchased: number | null; business_name: string; business_email: string; industry: string | null; use_case: string | null; location_type: string; operators_count: number; existing_coverage: boolean; coverage_type: string; budget_monthly: number | null; status: string; created_at: string; updated_at: string; };
        Insert: { id?: string; robot_id?: string | null; robot_name?: string | null; robot_manufacturer?: string | null; robot_model?: string | null; purchase_price?: number | null; year_purchased?: number | null; business_name: string; business_email: string; industry?: string | null; use_case?: string | null; location_type?: string; operators_count?: number; existing_coverage?: boolean; coverage_type?: string; budget_monthly?: number | null; status?: string; created_at?: string; updated_at?: string; };
        Update: { id?: string; robot_id?: string | null; robot_name?: string | null; robot_manufacturer?: string | null; robot_model?: string | null; purchase_price?: number | null; year_purchased?: number | null; business_name?: string; business_email?: string; industry?: string | null; use_case?: string | null; location_type?: string; operators_count?: number; existing_coverage?: boolean; coverage_type?: string; budget_monthly?: number | null; status?: string; created_at?: string; updated_at?: string; };
        Relationships: [];
      };
      // --- RSP Dashboard tables (migration 023) ---
      rsp_fleet_status: {
        Row: { id: string; rsp_id: string; rsp_robot_id: string; status: string; current_job_id: string | null; current_client_name: string | null; location: string | null; battery_level: number | null; last_maintenance_date: string | null; next_maintenance_date: string | null; hours_logged: number; alert_flags: string[]; updated_at: string; };
        Insert: { id?: string; rsp_id: string; rsp_robot_id: string; status?: string; current_job_id?: string | null; current_client_name?: string | null; location?: string | null; battery_level?: number | null; last_maintenance_date?: string | null; next_maintenance_date?: string | null; hours_logged?: number; alert_flags?: string[]; updated_at?: string; };
        Update: { id?: string; rsp_id?: string; rsp_robot_id?: string; status?: string; current_job_id?: string | null; current_client_name?: string | null; location?: string | null; battery_level?: number | null; last_maintenance_date?: string | null; next_maintenance_date?: string | null; hours_logged?: number; alert_flags?: string[]; updated_at?: string; };
        Relationships: [];
      };
      rsp_maintenance_logs: {
        Row: { id: string; rsp_id: string; rsp_robot_id: string; type: string; description: string | null; technician_name: string | null; parts_replaced: string[]; parts_cost: number; labor_hours: number; total_cost: number; completed_at: string | null; next_service_due: string | null; created_at: string; };
        Insert: { id?: string; rsp_id: string; rsp_robot_id: string; type?: string; description?: string | null; technician_name?: string | null; parts_replaced?: string[]; parts_cost?: number; labor_hours?: number; total_cost?: number; completed_at?: string | null; next_service_due?: string | null; created_at?: string; };
        Update: { id?: string; rsp_id?: string; rsp_robot_id?: string; type?: string; description?: string | null; technician_name?: string | null; parts_replaced?: string[]; parts_cost?: number; labor_hours?: number; total_cost?: number; completed_at?: string | null; next_service_due?: string | null; created_at?: string; };
        Relationships: [];
      };
      rsp_invoices: {
        Row: { id: string; rsp_id: string; job_id: string | null; client_email: string; invoice_number: string; status: string; line_items: Json; subtotal: number; tax: number; total: number; currency: string; due_date: string | null; paid_at: string | null; stripe_payment_intent_id: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; rsp_id: string; job_id?: string | null; client_email: string; invoice_number: string; status?: string; line_items?: Json; subtotal?: number; tax?: number; total?: number; currency?: string; due_date?: string | null; paid_at?: string | null; stripe_payment_intent_id?: string | null; created_at?: string; updated_at?: string; };
        Update: { id?: string; rsp_id?: string; job_id?: string | null; client_email?: string; invoice_number?: string; status?: string; line_items?: Json; subtotal?: number; tax?: number; total?: number; currency?: string; due_date?: string | null; paid_at?: string | null; stripe_payment_intent_id?: string | null; created_at?: string; updated_at?: string; };
        Relationships: [];
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
      robowork_fulfillment_type: "with_operator" | "drop_off" | "remote_operated";
      robowork_job_status: "draft" | "open" | "in_review" | "filled" | "completed" | "cancelled";
      robowork_urgency: "flexible" | "within_week" | "within_month" | "asap";
      robowork_bid_status: "pending" | "shortlisted" | "accepted" | "rejected" | "withdrawn";
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

export type RoboworkFulfillmentType = Database["public"]["Enums"]["robowork_fulfillment_type"];
export type RoboworkJobStatus = Database["public"]["Enums"]["robowork_job_status"];
export type RoboworkUrgency = Database["public"]["Enums"]["robowork_urgency"];
export type RoboworkBidStatus = Database["public"]["Enums"]["robowork_bid_status"];

export type RobotServiceProvider = Database["public"]["Tables"]["robot_service_providers"]["Row"];
export type RspRobot = Database["public"]["Tables"]["rsp_robots"]["Row"];
export type RoboworkJob = Database["public"]["Tables"]["robowork_jobs"]["Row"];
export type RoboworkBid = Database["public"]["Tables"]["robowork_bids"]["Row"];
export type RoboworkReview = Database["public"]["Tables"]["robowork_reviews"]["Row"];

export type ManufacturerClaim = Database["public"]["Tables"]["manufacturer_claims"]["Row"];
export type ManufacturerPartnership = Database["public"]["Tables"]["manufacturer_partnerships"]["Row"];
export type ManufacturerContactClick = Database["public"]["Tables"]["manufacturer_contact_clicks"]["Row"];

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

// Leasing types
export type LeaseInquiry = Database["public"]["Tables"]["lease_inquiries"]["Row"];
export type LeaseTransfer = Database["public"]["Tables"]["lease_transfers"]["Row"];
export type RobotTimeShare = Database["public"]["Tables"]["robot_time_shares"]["Row"];
export type TimeShareBooking = Database["public"]["Tables"]["time_share_bookings"]["Row"];

// Certification types
export type RcoCertification = Database["public"]["Tables"]["rco_certifications"]["Row"];
export type RcoExamSession = Database["public"]["Tables"]["rco_exam_sessions"]["Row"];
export type RcoCredential = Database["public"]["Tables"]["rco_credentials"]["Row"];

// Post-purchase types
export type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
export type PartsListing = Database["public"]["Tables"]["parts_listings"]["Row"];
export type TradeInValuation = Database["public"]["Tables"]["trade_in_valuations"]["Row"];
export type CpoListing = Database["public"]["Tables"]["cpo_listings"]["Row"];
export type RobotInsuranceInquiry = Database["public"]["Tables"]["robot_insurance_inquiries"]["Row"];

// RSP Dashboard types
export type RspFleetStatus = Database["public"]["Tables"]["rsp_fleet_status"]["Row"];
export type RspMaintenanceLog = Database["public"]["Tables"]["rsp_maintenance_logs"]["Row"];
export type RspInvoice = Database["public"]["Tables"]["rsp_invoices"]["Row"];
