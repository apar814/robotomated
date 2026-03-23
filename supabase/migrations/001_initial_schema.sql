-- ============================================================================
-- Robotomated.com — Initial Database Schema
-- Migration 001: Core tables, indexes, RLS policies
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE robot_status AS ENUM ('active', 'discontinued', 'coming_soon');
CREATE TYPE review_type AS ENUM ('expert', 'community', 'video');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Robot Categories (hierarchical via parent_id)
CREATE TABLE robot_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES robot_categories(id) ON DELETE SET NULL,
  description   TEXT,
  icon_name     TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Manufacturers
CREATE TABLE manufacturers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  country       TEXT,
  founded_year  INTEGER,
  website       TEXT,
  logo_url      TEXT,
  verified      BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Users (extends Supabase Auth)
CREATE TABLE users (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT NOT NULL UNIQUE,
  name              TEXT,
  avatar_url        TEXT,
  persona_type      TEXT,
  preferences       JSONB DEFAULT '{}',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Robots
CREATE TABLE robots (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  manufacturer_id   UUID NOT NULL REFERENCES manufacturers(id) ON DELETE RESTRICT,
  category_id       UUID NOT NULL REFERENCES robot_categories(id) ON DELETE RESTRICT,
  model_number      TEXT,
  year_released     INTEGER,
  price_msrp        DECIMAL(12,2),
  price_current     DECIMAL(12,2),
  description_short TEXT,
  description_long  TEXT,
  specs             JSONB DEFAULT '{}',
  images            JSONB DEFAULT '[]',
  robo_score        DECIMAL(5,2) CHECK (robo_score >= 0 AND robo_score <= 100),
  score_breakdown   JSONB DEFAULT '{}',
  affiliate_url     TEXT,
  amazon_asin       TEXT,
  status            robot_status NOT NULL DEFAULT 'active',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id          UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  reviewer_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  review_type       review_type NOT NULL DEFAULT 'community',
  title             TEXT NOT NULL,
  body              TEXT NOT NULL,
  robo_score        DECIMAL(5,2) CHECK (robo_score >= 0 AND robo_score <= 100),
  score_breakdown   JSONB DEFAULT '{}',
  pros              JSONB DEFAULT '[]',
  cons              JSONB DEFAULT '[]',
  verdict           TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Advisor Conversations
CREATE TABLE advisor_conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id      TEXT NOT NULL,
  messages        JSONB NOT NULL DEFAULT '[]',
  use_case        TEXT,
  budget_min      DECIMAL(12,2),
  budget_max      DECIMAL(12,2),
  recommendations JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Price History
CREATE TABLE price_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  retailer    TEXT NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'USD',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT NOT NULL UNIQUE,
  source      TEXT,
  confirmed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Categories
CREATE INDEX idx_categories_slug ON robot_categories(slug);
CREATE INDEX idx_categories_parent ON robot_categories(parent_id);

-- Manufacturers
CREATE INDEX idx_manufacturers_slug ON manufacturers(slug);

-- Robots
CREATE INDEX idx_robots_slug ON robots(slug);
CREATE INDEX idx_robots_manufacturer ON robots(manufacturer_id);
CREATE INDEX idx_robots_category ON robots(category_id);
CREATE INDEX idx_robots_status ON robots(status);
CREATE INDEX idx_robots_score ON robots(robo_score DESC NULLS LAST);
CREATE INDEX idx_robots_price ON robots(price_current);

-- Reviews
CREATE INDEX idx_reviews_robot ON reviews(robot_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_published ON reviews(published_at DESC NULLS LAST);
CREATE INDEX idx_reviews_type ON reviews(review_type);

-- Advisor Conversations
CREATE INDEX idx_advisor_user ON advisor_conversations(user_id);
CREATE INDEX idx_advisor_session ON advisor_conversations(session_id);

-- Price History
CREATE INDEX idx_price_history_robot ON price_history(robot_id);
CREATE INDEX idx_price_history_recorded ON price_history(recorded_at DESC);

-- Newsletter
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER robots_updated_at
  BEFORE UPDATE ON robots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE robot_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: categories, manufacturers, robots, reviews, price_history
CREATE POLICY "Categories are publicly readable"
  ON robot_categories FOR SELECT
  USING (true);

CREATE POLICY "Manufacturers are publicly readable"
  ON manufacturers FOR SELECT
  USING (true);

CREATE POLICY "Active robots are publicly readable"
  ON robots FOR SELECT
  USING (true);

CREATE POLICY "Published reviews are publicly readable"
  ON reviews FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Price history is publicly readable"
  ON price_history FOR SELECT
  USING (true);

-- AUTHENTICATED WRITE: reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (reviewer_id = auth.uid());

-- USERS: own profile only
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ADVISOR CONVERSATIONS: own only
CREATE POLICY "Users can read own conversations"
  ON advisor_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations"
  ON advisor_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anonymous advisor conversations"
  ON advisor_conversations FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- NEWSLETTER: insert only (public)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- SERVICE ROLE bypasses RLS for admin operations (Supabase default)
