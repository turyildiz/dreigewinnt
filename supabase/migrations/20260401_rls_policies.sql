-- ============================================================
-- RLS Policies for Dreigewinnt
-- Generated: 2026-04-01
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- BUSINESSES
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Drop any existing broad policies
DROP POLICY IF EXISTS "allow all" ON public.businesses;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.businesses;

-- anon + authenticated: read active businesses only
CREATE POLICY "businesses_select_active"
  ON public.businesses FOR SELECT
  USING (status = 'active');

-- All mutations require service role (bypasses RLS entirely)
-- No INSERT/UPDATE/DELETE policy needed — service role bypasses RLS.


-- ────────────────────────────────────────────────────────────
-- EVENTS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.events;

-- anon: read active events only
CREATE POLICY "events_select_active"
  ON public.events FOR SELECT
  USING (status = 'active');


-- ────────────────────────────────────────────────────────────
-- ARTICLES
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.articles;

-- anon: read published articles only
CREATE POLICY "articles_select_published"
  ON public.articles FOR SELECT
  USING (status = 'published');


-- ────────────────────────────────────────────────────────────
-- BUSINESS_POSTS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.business_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.business_posts;

-- anon: read all posts (public feed)
CREATE POLICY "business_posts_select_public"
  ON public.business_posts FOR SELECT
  USING (true);


-- ────────────────────────────────────────────────────────────
-- BUSINESS_PHOTOS
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.business_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.business_photos;

-- anon: read all photos
CREATE POLICY "business_photos_select_public"
  ON public.business_photos FOR SELECT
  USING (true);


-- ────────────────────────────────────────────────────────────
-- ADMIN_USERS — no anon access at all
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.admin_users;

-- No SELECT policy for anon/authenticated — service role only


-- ────────────────────────────────────────────────────────────
-- QUEUE_ITEMS — public can INSERT (business submissions)
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.queue_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow all" ON public.queue_items;

-- anon: insert only (public submission form)
CREATE POLICY "queue_items_insert_public"
  ON public.queue_items FOR INSERT
  WITH CHECK (true);

-- No SELECT for anon — admin reviews via service role


-- ────────────────────────────────────────────────────────────
-- JOBS (if table exists)
-- ────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'jobs') THEN
    EXECUTE 'ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS "allow all" ON public.jobs';
    EXECUTE 'CREATE POLICY jobs_select_active ON public.jobs FOR SELECT USING (status = ''active'')';
  END IF;
END $$;
