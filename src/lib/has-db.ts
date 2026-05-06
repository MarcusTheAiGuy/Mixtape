/**
 * Whether a Postgres connection string is configured for this environment.
 * Server-only — DATABASE_URL is never exposed to the client.
 *
 * Use this to gate Prisma queries so we degrade gracefully (returning sample
 * data) until the database is provisioned, instead of crashing the page.
 */
export const hasDb = (): boolean =>
  typeof process !== "undefined" && Boolean(process.env.DATABASE_URL);
