/**
 * In-process login rate limiter.
 *
 * Stores attempt counts in a Map keyed by email address.
 * Max 5 failed attempts per 15-minute sliding window.
 *
 * NOTE: This is per-process state. On multi-instance deployments (e.g. multiple
 * Vercel serverless instances) use a shared store (Redis/Upstash). For a
 * single-admin personal portfolio this is sufficient.
 */

const MAX_ATTEMPTS = 5;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, AttemptRecord>();

export async function checkLoginRateLimit(
  key: string
): Promise<{ allowed: boolean; retryAfterMinutes: number }> {
  const now    = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    return { allowed: true, retryAfterMinutes: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const elapsed  = now - record.windowStart;
    const remaining = Math.ceil((WINDOW_MS - elapsed) / 60_000);
    return { allowed: false, retryAfterMinutes: remaining };
  }

  return { allowed: true, retryAfterMinutes: 0 };
}

export async function recordLoginAttempt(key: string): Promise<void> {
  const now    = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.windowStart > WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
  } else {
    record.count += 1;
  }
}

export async function clearLoginAttempts(key: string): Promise<void> {
  attempts.delete(key);
}
