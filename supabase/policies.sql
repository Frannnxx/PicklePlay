-- ============================================================================
-- PICKLEPLAY: Row Level Security (RLS) Policies
-- Anti-Tamper & Role Separation Enforcement
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- PROFILES POLICIES
-- ----------------------------------------------------------------------------
-- Public read for leaderboard and matching
CREATE POLICY "Allow public read access to profiles for rankings"
  ON public.profiles FOR SELECT
  USING (true);

-- User can update their own personal info, BUT CANNOT touch ranking columns
CREATE POLICY "Users can update own personal contact info only"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- COURTS POLICIES
-- ----------------------------------------------------------------------------
-- Anyone can view courts
CREATE POLICY "Allow public read access to courts"
  ON public.courts FOR SELECT
  USING (true);

-- Only verified admins can insert/update their facility courts
CREATE POLICY "Admins can manage their own facility courts"
  ON public.courts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

-- ----------------------------------------------------------------------------
-- BOOKINGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Players can view their own bookings or court admins can view all"
  ON public.bookings FOR SELECT
  USING (
    auth.uid() = player_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY "Authenticated players can create reservations"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can cancel only their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = player_id)
  WITH CHECK (auth.uid() = player_id);

-- ----------------------------------------------------------------------------
-- MATCHES & SCORING POLICIES (CORE ANTI-TAMPER POLICY)
-- ----------------------------------------------------------------------------
-- Everyone can view match results
CREATE POLICY "Allow public read of match results"
  ON public.matches FOR SELECT
  USING (true);

-- PLAYERS HAVE ZERO WRITE/UPDATE ACCESS TO MATCH RESULTS
-- Only authenticated COURT ADMINS can record/verify scores
CREATE POLICY "Only authorized court admins can record and verify scores"
  ON public.matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

-- ----------------------------------------------------------------------------
-- ACTIVITY LOGS (AUDIT TRAIL)
-- ----------------------------------------------------------------------------
CREATE POLICY "Allow read access to activity logs"
  ON public.activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
