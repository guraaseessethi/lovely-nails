import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { readToken, refreshToken, timingSafeMatch, writeToken } from "@/lib/instagram";

const DAY = 24 * 60 * 60 * 1000;

/**
 * Daily Vercel Cron (see vercel.json). Renews the Instagram token well before its
 * 60-day expiry, then drops the cached feed so fresh image URLs are fetched.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!timingSafeMatch(auth, process.env.CRON_SECRET)) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const stored = await readToken();
  if (!stored) return Response.json({ connected: false });

  let refreshed = false;
  if (Date.now() - stored.refreshedAt > DAY) {
    try {
      await writeToken(await refreshToken(stored));
      refreshed = true;
    } catch (err) {
      console.error("Instagram token refresh failed:", err instanceof Error ? err.message : err);
    }
  }

  revalidateTag("instagram", { expire: 0 });
  return Response.json({ connected: true, refreshed });
}
