-- Extend users table for authentication (columns may already exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'parent';
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add unique constraint on email
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email) WHERE email IS NOT NULL;

-- Update existing admin user (only if email is not already set)
UPDATE users
SET
  email = COALESCE(email, 'dirjokersrha@outlook.fr'),
  role = 'admin',
  full_name = COALESCE(full_name, 'Admin Jokers'),
  updated_at = NOW()
WHERE username = 'admin';

-- Create Phase 2 tables (user_id is INTEGER to match users.id type)
CREATE TABLE IF NOT EXISTS teams (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id),
  team_id VARCHAR REFERENCES teams(id),
  full_name TEXT NOT NULL,
  jersey_number INTEGER,
  birth_date TIMESTAMP,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_inscriptions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id VARCHAR REFERENCES matches(id) NOT NULL,
  player_id VARCHAR REFERENCES players(id) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'confirmed',
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);

-- Insert default teams (only if they don't exist)
INSERT INTO teams (name, category)
SELECT name, category FROM (VALUES
  ('U7-U11', 'youth'),
  ('U13', 'youth'),
  ('U15', 'youth'),
  ('U17', 'youth'),
  ('U20', 'youth'),
  ('Adultes', 'adult'),
  ('École de patinage', 'youth')
) AS t(name, category)
WHERE NOT EXISTS (SELECT 1 FROM teams WHERE teams.name = t.name);
