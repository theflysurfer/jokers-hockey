import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function checkSchema() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📊 Checking database schema...\n");

    // Check users table
    const usersResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log("👤 Users table:");
    console.table(usersResult.rows);

    // Check matches table
    const matchesResult = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'matches'
      ORDER BY ordinal_position
    `);

    console.log("\n⚽ Matches table:");
    console.table(matchesResult.rows);

    // List all tables
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("\n📋 All tables in database:");
    tablesResult.rows.forEach(row => console.log(`  - ${row.table_name}`));

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkSchema();
