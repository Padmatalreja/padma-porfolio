// Run with: node scripts/run-schema.mjs
import { Pool, neonConfig } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import ws from "ws";

// Neon serverless in Node.js requires a WebSocket constructor
neonConfig.webSocketConstructor = ws;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATABASE_URL =
  "postgresql://neondb_owner:npg_V4LijBMD8RfN@ep-billowing-sunset-b5faxsh2-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const schema = readFileSync(join(__dirname, "neon-schema.sql"), "utf8");

const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log("✅ Schema applied successfully to Neon database.");
  } finally {
    client.release();
  }
} catch (err) {
  console.error("❌ Schema error:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
