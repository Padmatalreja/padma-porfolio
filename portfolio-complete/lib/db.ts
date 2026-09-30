/**
 * Neon PostgreSQL client for Next.js.
 *
 * Two drivers are exposed:
 *
 *  1. query()          — HTTP driver (fast, stateless). Use for all reads and
 *                        simple single-statement writes.
 *
 *  2. queryWithPool()  — WebSocket Pool driver wrapped in a callback that
 *                        receives a raw pg PoolClient. Use when you need
 *                        explicit transaction control (BEGIN / COMMIT / ROLLBACK).
 *
 * Usage:
 *   import { query, queryWithPool } from "@/lib/db";
 *
 *   // HTTP driver — tagged template (auto-parameterised):
 *   const rows = await query`SELECT * FROM profiles WHERE id = ${id}`;
 *
 *   // HTTP driver — raw string:
 *   const rows = await query("SELECT * FROM profiles WHERE id = $1", [id]);
 *
 *   // Pool driver — transaction:
 *   await queryWithPool(async (client) => {
 *     await client.query("BEGIN");
 *     await client.query("UPDATE ...", [...]);
 *     await client.query("COMMIT");
 *   });
 */

import { neon, neonConfig, Pool } from "@neondatabase/serverless";
import type { PoolClient } from "@neondatabase/serverless";
import ws from "ws";

// WebSocket constructor required for Pool (used in admin/write paths)
neonConfig.webSocketConstructor = ws;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set.");
  return url;
}

// ─── HTTP driver (fast, stateless — for reads) ───────────────────────────────
let _sql: ReturnType<typeof neon> | null = null;
function getSql() {
  if (!_sql) _sql = neon(getDatabaseUrl());
  return _sql;
}

// ─── Pool (WebSocket — for transactions) ─────────────────────────────────────
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
 * Execute a SQL query via the HTTP driver (no connection overhead).
 * Supports both tagged-template and raw-string forms.
 */
export async function query(
  stringsOrSql: TemplateStringsArray | string,
  ...values: unknown[]
): Promise<QueryResult> {
  const sql = getSql();

  if (typeof stringsOrSql === "string") {
    const params = (values[0] as unknown[]) ?? [];
    const res    = await sql(stringsOrSql, params as unknown[]);
    return res as QueryResult;
  }

  const strings = stringsOrSql as TemplateStringsArray;
  const res     = await sql(strings, ...values);
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

/**
 * Execute a callback with a raw Pool client.
 * Use this when you need explicit transaction control (BEGIN/COMMIT/ROLLBACK).
 *
 * Example:
 *   await queryWithPool(async (client) => {
 *     await client.query("BEGIN");
 *     await client.query("UPDATE ...", [...]);
 *     await client.query("COMMIT");
 *   });
 */
export async function queryWithPool<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool   = getPool();
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}
