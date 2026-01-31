import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function createTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📦 Creating announcements and announcement_photos tables...\n");

    // Create announcements table (matching photos table structure with INTEGER id)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        author_id INTEGER REFERENCES users(id),
        is_published BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published_at TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log("✅ Table 'announcements' created");

    // Create announcement_photos junction table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcement_photos (
        id SERIAL PRIMARY KEY,
        announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
        photo_id INTEGER NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("✅ Table 'announcement_photos' created");

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_announcements_published
      ON announcements(is_published, published_at DESC);
    `);
    console.log("✅ Index 'idx_announcements_published' created");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_announcement_photos_announcement
      ON announcement_photos(announcement_id);
    `);
    console.log("✅ Index 'idx_announcement_photos_announcement' created");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_announcement_photos_photo
      ON announcement_photos(photo_id);
    `);
    console.log("✅ Index 'idx_announcement_photos_photo' created");

    console.log("\n🎉 All tables and indexes created successfully!");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createTables();
