-- ==============================================================================
-- VIETNAM ATLAS - PRODUCTION SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor (Dashboard > SQL Editor > New Query).
-- It creates the places, cities, and guides tables with optimized indexes and RLS.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PLACES TABLE
CREATE TABLE IF NOT EXISTS public.places (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT DEFAULT 'Địa điểm',
  category_en TEXT DEFAULT 'Attractions',
  area TEXT DEFAULT '',
  city TEXT DEFAULT '',
  city_slug TEXT DEFAULT '',
  region TEXT CHECK (region IN ('north', 'central', 'south')),
  "desc" TEXT DEFAULT '',
  desc_en TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  photo_page TEXT DEFAULT '',
  photo_license TEXT DEFAULT 'Public domain',
  photo_credit TEXT DEFAULT 'Owner',
  photo_status TEXT DEFAULT 'ok',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  maps_url TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  extra_photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_places_published ON public.places (published);
CREATE INDEX IF NOT EXISTS idx_places_region ON public.places (region);
CREATE INDEX IF NOT EXISTS idx_places_city_slug ON public.places (city_slug);
CREATE INDEX IF NOT EXISTS idx_places_name_en ON public.places (name_en);

-- 3. CITIES TABLE
CREATE TABLE IF NOT EXISTS public.cities (
  city_slug TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  region TEXT CHECK (region IN ('north', 'central', 'south')),
  photo_url TEXT DEFAULT '',
  photo_credit TEXT DEFAULT '',
  photo_license TEXT DEFAULT '',
  photo_page TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cities_region ON public.cities (region);

-- 4. GUIDES TABLE
CREATE TABLE IF NOT EXISTS public.guides (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  reading_time TEXT DEFAULT '5 min read',
  category TEXT DEFAULT 'Field Advice',
  hero_image TEXT DEFAULT '',
  photo_credit TEXT DEFAULT 'Wikimedia Commons',
  photo_license TEXT DEFAULT 'CC BY-SA 4.0',
  photo_page TEXT DEFAULT '',
  problem_statement TEXT DEFAULT '',
  steps JSONB DEFAULT '[]'::jsonb,
  tips JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  cta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. AUTO-UPDATE UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_places_updated_at ON public.places;
CREATE TRIGGER trigger_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_cities_updated_at ON public.cities;
CREATE TRIGGER trigger_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_guides_updated_at ON public.guides;
CREATE TRIGGER trigger_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published places
DROP POLICY IF EXISTS "Public can view published places" ON public.places;
CREATE POLICY "Public can view published places"
  ON public.places FOR SELECT
  USING (published = true);

-- Allow public read access to all cities
DROP POLICY IF EXISTS "Public can view cities" ON public.cities;
CREATE POLICY "Public can view cities"
  ON public.cities FOR SELECT
  USING (true);

-- Allow public read access to all guides
DROP POLICY IF EXISTS "Public can view guides" ON public.guides;
CREATE POLICY "Public can view guides"
  ON public.guides FOR SELECT
  USING (true);

-- Note: The Service Role Key (used in backend API routes) automatically bypasses RLS
-- to allow full Admin operations (SELECT unpublished, INSERT, UPDATE, DELETE).
