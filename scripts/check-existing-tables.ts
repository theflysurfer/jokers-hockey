import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function checkTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📊 Checking existing tables...\n");

    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("Tables found:");
    result.rows.forEach((row: any) => console.log(`  - ${row.table_name}`));

    console.log("\n📊 Checking photos table schema...");
    const photosSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'photos'
      ORDER BY ordinal_position;
    `);

    if (photosSchema.rows.length > 0) {
      console.log("Photos columns:");
      photosSchema.rows.forEach((row: any) => {
        console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log("  ❌ Table photos not found");
    }

    console.log("\n📊 Checking announcements table schema...");
    const announcementsSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'announcements'
      ORDER BY ordinal_position;
    `);

    if (announcementsSchema.rows.length > 0) {
      console.log("Announcements columns:");
      announcementsSchema.rows.forEach((row: any) => {
        console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
      });
    } else {
      console.log("  ❌ Table announcements not found");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkTables();
