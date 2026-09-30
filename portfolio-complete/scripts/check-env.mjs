// Pre-build environment variable check.
// Runs automatically via the "prebuild" npm script before every `next build`.
// Add any new required variables to the `required` array below.

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "CONTACT_RATE_LIMIT_SALT",
  "LOCAL_ADMIN_EMAIL",
  "LOCAL_ADMIN_PASSWORD",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `\n❌  Missing required environment variables:\n` +
    missing.map((k) => `     • ${k}`).join("\n") +
    `\n\nCopy .env.example to .env.local and fill in the values.\n`
  );
  process.exit(1);
}

console.log("✅  All required environment variables are present.");
