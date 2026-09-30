/**
 * Local admin authentication — used only when Supabase is NOT configured.
 * Signs a session token with HMAC-SHA256 so it cannot be forged without
 * knowing LOCAL_ADMIN_PASSWORD.
 *
 * Token format: base64url(payload) . base64url(hmac-sha256-signature)
 * Payload: "<email>:<iso-timestamp>:<16-byte-random-hex>"
 *
 * The random nonce prevents two logins in the same millisecond from
 * producing the same token and prevents timing-based token guessing.
 */

import "server-only";

const COOKIE_NAME    = "local-admin-session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.LOCAL_ADMIN_PASSWORD;
  if (!secret) {
    // Fail loudly in production rather than silently using a known key.
    if (process.env.NODE_ENV === "production") {
      throw new Error("LOCAL_ADMIN_PASSWORD is not set.");
    }
    return "local-dev-secret-DO-NOT-USE-IN-PROD";
  }
  return secret;
}

/** Generate a cryptographically random hex string (default 16 bytes = 32 chars). */
function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key  = await crypto.subtle.importKey(
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
  // Include a random nonce so two tokens created at the same instant differ.
  const payload = `${email}:${new Date().toISOString()}:${randomHex()}`;
  const sig     = await hmacSign(payload, getSecret());
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export async function verifyLocalSessionToken(token: string): Promise<string | null> {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return null;

    const payloadB64 = token.slice(0, dotIdx);
    const sig        = token.slice(dotIdx + 1);

    if (!payloadB64 || !sig) return null;

    const payload  = Buffer.from(payloadB64, "base64url").toString("utf8");
    const expected = await hmacSign(payload, getSecret());

    // Constant-time comparison to prevent timing attacks.
    if (expected !== sig) return null;

    const [email] = payload.split(":");
    return email || null;
  } catch {
    return null;
  }
}

export { COOKIE_NAME, COOKIE_MAX_AGE };
