import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function checkPhotosTable() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📸 Checking photos table structure...\n");

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'photos'
      ORDER BY ordinal_position
    `);

    console.table(result.rows);

    // Check if announcements table exists
    const announcementsCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'announcements'
      )
    `);

    console.log(`\n📢 Announcements table exists: ${announcementsCheck.rows[0].exists}`);

    if (announcementsCheck.rows[0].exists) {
      const announcementsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'announcements'
        ORDER BY ordinal_position
      `);
      console.log("\n📢 Announcements table structure:");
      console.table(announcementsResult.rows);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkPhotosTable();
