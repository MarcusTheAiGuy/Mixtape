import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasDb } from "@/lib/has-db";

export const runtime = "nodejs";

/**
 * Tiny endpoint used by SyncStatus to decide whether the page is in
 * "remote" (signed in + DB available) or "local" (demo) mode. Doesn't leak
 * anything sensitive — only booleans + the public username if available.
 */
export async function GET() {
  const session = await auth().catch(() => null);
  return NextResponse.json({
    authenticated: Boolean(session?.user?.id),
    hasDb: hasDb(),
    username: session?.user?.name ?? null,
  });
}
