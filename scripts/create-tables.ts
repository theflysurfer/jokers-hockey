import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

neonConfig.webSocketConstructor = ws;

async function createTables() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log("📦 Creating tables from SQL file...\n");

    const sql = fs.readFileSync(path.join(__dirname, "create-tables.sql"), "utf-8");

    await pool.query(sql);

    console.log("✅ Tables created successfully!");
    console.log("   - photos");
    console.log("   - announcements");
    console.log("   - Indexes created");

  } catch (error) {
    console.error("❌ Error creating tables:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

createTables();
