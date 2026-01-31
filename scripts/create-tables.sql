-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  match_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  author_id VARCHAR,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Create index on published announcements
CREATE INDEX IF NOT EXISTS idx_announcements_published ON announcements(is_published, published_at DESC);

-- Create index on photos category
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category, created_at DESC);

-- Create announcement_photos junction table
CREATE TABLE IF NOT EXISTS announcement_photos (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id VARCHAR NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  photo_id VARCHAR NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for efficient joins
CREATE INDEX IF NOT EXISTS idx_announcement_photos_announcement ON announcement_photos(announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcement_photos_photo ON announcement_photos(photo_id);
