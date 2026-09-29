import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_V4LijBMD8RfN@ep-billowing-sunset-b5faxsh2-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const client = await pool.connect();
try {
  const res = await client.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);
  console.log("Tables in Neon database:");
  res.rows.forEach((r) => console.log(" •", r.table_name));
} finally {
  client.release();
  await pool.end();
}
