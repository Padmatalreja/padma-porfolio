/**
 * Legacy shim — kept so any stale imports compile.
 * All real database access goes through lib/db.ts directly.
 */
export { query as createClient } from "@/lib/db";
