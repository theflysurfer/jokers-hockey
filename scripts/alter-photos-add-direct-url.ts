import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function alterPhotosTable() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("🔧 Adding image_url column to photos table...\n");

    // Add image_url column
    await pool.query(`
      ALTER TABLE photos
      ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);
    console.log("✅ Column 'image_url' added to photos table");

    // Make image_url_id nullable so we can use either imageUrlId (Payload) or imageUrl (direct)
    await pool.query(`
      ALTER TABLE photos
      ALTER COLUMN image_url_id DROP NOT NULL;
    `);
    console.log("✅ Column 'image_url_id' is now nullable");

    // Make uploaded_by_id nullable (for WhatsApp imports without user)
    await pool.query(`
      ALTER TABLE photos
      ALTER COLUMN uploaded_by_id DROP NOT NULL;
    `);
    console.log("✅ Column 'uploaded_by_id' is now nullable");

    // Make approval_status nullable (for WhatsApp imports auto-approved)
    await pool.query(`
      ALTER TABLE photos
      ALTER COLUMN approval_status DROP NOT NULL;
    `);
    console.log("✅ Column 'approval_status' is now nullable");

    console.log("\n🎉 Photos table structure updated successfully!");

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

alterPhotosTable();
