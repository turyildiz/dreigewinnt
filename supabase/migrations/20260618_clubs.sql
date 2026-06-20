-- Sports clubs (Sportvereine) — mirrors businesses table structure
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  sport text,
  town text NOT NULL DEFAULT 'Rüsselsheim am Main',
  tier text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'pending',
  description text,
  full_description text,
  address text,
  phone text,
  email text,
  website text,
  hero_image_url text,
  logo_url text,
  is_spotlight boolean NOT NULL DEFAULT false,
  founded_year integer,
  members_count integer,
  social_instagram text,
  social_facebook text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Club photos (gallery) — mirrors business_photos
CREATE TABLE IF NOT EXISTS club_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Club posts (news/updates feed) — mirrors business_posts
CREATE TABLE IF NOT EXISTS club_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  images text[],
  source text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clubs_town ON clubs(town);
CREATE INDEX IF NOT EXISTS idx_clubs_sport ON clubs(sport);
CREATE INDEX IF NOT EXISTS idx_clubs_status ON clubs(status);
CREATE INDEX IF NOT EXISTS idx_club_photos_club_id ON club_photos(club_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_club_id ON club_posts(club_id);
CREATE INDEX IF NOT EXISTS idx_club_posts_created_at ON club_posts(created_at DESC);

-- RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_posts ENABLE ROW LEVEL SECURITY;

-- Public read for approved clubs
CREATE POLICY "Public can read approved clubs"
  ON clubs FOR SELECT
  USING (status = 'approved');

-- Public read for photos of approved clubs
CREATE POLICY "Public can read club photos"
  ON club_photos FOR SELECT
  USING (EXISTS (SELECT 1 FROM clubs WHERE clubs.id = club_photos.club_id AND clubs.status = 'approved'));

-- Public read for posts of approved clubs
CREATE POLICY "Public can read club posts"
  ON club_posts FOR SELECT
  USING (EXISTS (SELECT 1 FROM clubs WHERE clubs.id = club_posts.club_id AND clubs.status = 'approved'));

-- Service role bypasses RLS, so admin operations work via supabaseAdmin
