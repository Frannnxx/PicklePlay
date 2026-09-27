-- ============================================================================
-- PICKLEPLAY: Tagum City Pickleball System Schema (Supabase PostgreSQL)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Supports both PLAYER and ADMIN roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('PLAYER', 'ADMIN')),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE,
  skill_level VARCHAR(20) CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  
  -- Ranking statistics (strictly computed via match result trigger/service)
  rank INTEGER DEFAULT 999,
  ranking_points INTEGER DEFAULT 1000 CHECK (ranking_points >= 0),
  wins INTEGER DEFAULT 0 CHECK (wins >= 0),
  losses INTEGER DEFAULT 0 CHECK (losses >= 0),
  win_rate NUMERIC(5,2) DEFAULT 0.00,
  current_streak INTEGER DEFAULT 0,
  weekly_change INTEGER DEFAULT 0,
  
  -- Facility / Court owner details (if role = 'ADMIN')
  facility_name VARCHAR(150),
  court_address TEXT,
  business_number VARCHAR(100),
  
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courts Table
CREATE TABLE IF NOT EXISTS public.courts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  facility_name VARCHAR(150) NOT NULL,
  location TEXT NOT NULL,
  price_per_hour NUMERIC(8,2) NOT NULL DEFAULT 150.00,
  is_indoor BOOLEAN DEFAULT TRUE,
  surface_type VARCHAR(100) DEFAULT 'Cushioned Tournament Acrylic',
  open_hours VARCHAR(100) DEFAULT '06:00 AM - 10:00 PM',
  image_url TEXT,
  amenities TEXT[] DEFAULT ARRAY['Tournament Net', 'LED Floodlights', 'Covered Arena'],
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bookings Table (Court Reservations)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE RESTRICT,
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_price NUMERIC(8,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent double booking for the same court on the same date and slot
  CONSTRAINT unique_court_timeslot UNIQUE (court_id, booking_date, start_time)
);

-- 4. Matches Table (Official Game & Scoring Record)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number VARCHAR(50) UNIQUE NOT NULL,
  court_id UUID NOT NULL REFERENCES public.courts(id),
  player_a_id UUID NOT NULL REFERENCES public.profiles(id),
  player_b_id UUID NOT NULL REFERENCES public.profiles(id),
  booking_id UUID REFERENCES public.bookings(id),
  
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  
  -- Official scores entered exclusively by authorized Court Admin
  score_a INTEGER,
  score_b INTEGER,
  winner_id UUID REFERENCES public.profiles(id),
  loser_id UUID REFERENCES public.profiles(id),
  points_exchanged INTEGER DEFAULT 25,
  
  status VARCHAR(20) NOT NULL DEFAULT 'WAITING_SCORE' CHECK (status IN ('WAITING_SCORE', 'VERIFIED', 'CANCELLED')),
  verified_by_admin_id UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_match_players CHECK (player_a_id <> player_b_id)
);

-- 5. Ranking History Table (Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.ranking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  old_points INTEGER NOT NULL,
  points_change INTEGER NOT NULL,
  new_points INTEGER NOT NULL,
  reason VARCHAR(20) NOT NULL CHECK (reason IN ('WIN', 'LOSS', 'INITIAL', 'ADMIN_CORRECTION')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Open Pickup Games Table
CREATE TABLE IF NOT EXISTS public.open_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(150) NOT NULL,
  host_player_id UUID NOT NULL REFERENCES public.profiles(id),
  court_id UUID NOT NULL REFERENCES public.courts(id),
  skill_level VARCHAR(20) DEFAULT 'Intermediate',
  game_date DATE NOT NULL,
  game_time VARCHAR(50) NOT NULL,
  max_players INTEGER DEFAULT 4,
  current_players INTEGER DEFAULT 1,
  player_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit & Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  user_role VARCHAR(20) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  match_id UUID REFERENCES public.matches(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON public.profiles(rank);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON public.profiles(ranking_points DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(court_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_ranking_history_player ON public.ranking_history(player_id);
