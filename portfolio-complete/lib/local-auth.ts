/**
 * Local admin authentication — used only when Supabase is NOT configured.
 * Signs a session token with HMAC-SHA256 so it cannot be forged without
 * knowing LOCAL_ADMIN_PASSWORD.
 */

import "server-only";

const COOKIE_NAME = "local-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  return process.env.LOCAL_ADMIN_PASSWORD ?? "local-dev-secret";
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

export async function createLocalSessionToken(email: string): Promise<string> {
  const payload = `${email}:${Date.now()}`;
  const sig = await hmacSign(payload, getSecret());
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export async function verifyLocalSessionToken(token: string): Promise<string | null> {
  try {
    const [payloadB64, sig] = token.split(".");
    if (!payloadB64 || !sig) return null;
    const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expected = await hmacSign(payload, getSecret());
    if (expected !== sig) return null;
    const [email] = payload.split(":");
    return email || null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
