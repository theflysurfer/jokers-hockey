import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function createAnnouncementPhotosTable() {
  console.log("Creating announcement_photos table...");

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS announcement_photos (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        announcement_id VARCHAR NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
        photo_id VARCHAR NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Table announcement_photos created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createAnnouncementPhotosTable();
