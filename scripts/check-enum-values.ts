import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function checkEnumValues() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📊 Checking ENUM values...\n");

    const result = await pool.query(`
      SELECT
        t.typname AS enum_name,
        e.enumlabel AS enum_value,
        e.enumsortorder AS sort_order
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname LIKE '%photos%'
      ORDER BY t.typname, e.enumsortorder;
    `);

    if (result.rows.length > 0) {
      console.log("ENUM values for photos:");
      result.rows.forEach((row: any) => {
        console.log(`  ${row.enum_name}: ${row.enum_value}`);
      });
    } else {
      console.log("  ❌ No ENUM found for photos");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

checkEnumValues();
