/**
 * Neon PostgreSQL client for Next.js.
 *
 * Uses the Neon HTTP fetch driver (@neondatabase/serverless `neon()`) which
 * sends queries over HTTPS rather than WebSocket. This avoids the ~300-800ms
 * WebSocket connection handshake cost on every cold request, making each query
 * significantly faster in a serverless/edge environment.
 *
 * The Pool/WebSocket driver is kept as a fallback for the admin panel where
 * we need transactions (multi-statement operations). Public read queries all
 * go through the faster HTTP driver.
 *
 * Usage:
 *   import { query, queryOne } from "@/lib/db";
 *
 *   // Tagged template (safe, auto-parameterised):
 *   const rows = await query`SELECT * FROM profiles WHERE id = ${id}`;
 *
 *   // Raw string with explicit params:
 *   const rows = await query("SELECT * FROM profiles WHERE id = $1", [id]);
 */

import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

// WebSocket constructor required for Pool (used in admin/write paths)
neonConfig.webSocketConstructor = ws;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set.");
  return url;
}

// ─── HTTP driver (fast, stateless — for reads) ───────────────────────────────
// Lazily initialised — neon() returns an sql tagged-template function.
let _sql: ReturnType<typeof neon> | null = null;
function getSql() {
  if (!_sql) _sql = neon(getDatabaseUrl());
  return _sql;
}

// ─── Pool (WebSocket — for admin writes that need connection state) ──────────
let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }
  return _pool;
}

type QueryResult = Record<string, unknown>[];

/**
 * Execute a SQL query.
 *
 * For simple reads this uses the HTTP driver (no connection overhead).
 * Pass { pool: true } as the last argument to force the WebSocket pool
 * (needed for admin mutations that rely on connection state).
 */
export async function query(
  stringsOrSql: TemplateStringsArray | string,
  ...values: unknown[]
): Promise<QueryResult> {
  // Check if last value is options object { pool: true }
  const lastVal = values[values.length - 1];
  const usePool =
    lastVal !== null &&
    typeof lastVal === "object" &&
    (lastVal as any).pool === true;
  const actualValues = usePool ? values.slice(0, -1) : values;

  if (usePool) {
    // Use WebSocket pool for admin write operations
    const pool = getPool();
    const client = await pool.connect();
    try {
      if (typeof stringsOrSql === "string") {
        const params = (actualValues[0] as unknown[]) ?? [];
        const res = await client.query(stringsOrSql, params as unknown[]);
        return res.rows as QueryResult;
      }
      const strings = stringsOrSql as TemplateStringsArray;
      let sql = "";
      const params: unknown[] = [];
      strings.forEach((s, i) => {
        sql += s;
        if (i < actualValues.length) {
          params.push(actualValues[i]);
          sql += `$${params.length}`;
        }
      });
      const res = await client.query(sql, params);
      return res.rows as QueryResult;
    } finally {
      client.release();
    }
  }

  // Default: HTTP driver — fast, no connection overhead
  const sql = getSql();

  if (typeof stringsOrSql === "string") {
    const params = (actualValues[0] as unknown[]) ?? [];
    const res = await sql(stringsOrSql, params as unknown[]);
    return res as QueryResult;
  }

  // Tagged template
  const strings = stringsOrSql as TemplateStringsArray;
  const res = await sql(strings, ...actualValues);
  return res as QueryResult;
}

/** Convenience: returns the first row or null. */
export async function queryOne(
  stringsOrSql: TemplateStringsArray | string,
  ...values: unknown[]
): Promise<Record<string, unknown> | null> {
  const rows = await (query as any)(stringsOrSql, ...values);
  return rows[0] ?? null;
}
