import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { readToken, timingSafeMatch } from "@/lib/instagram";
import { esc, page } from "./html";

/**
 * One-time "Connect Instagram" screen: /studio-tools/instagram?key=INSTAGRAM_CONNECT_KEY
 * April signs in on Instagram's own page, so her password never passes through this site.
 */
export async function GET(req: NextRequest) {
  if (!timingSafeMatch(req.nextUrl.searchParams.get("key"), process.env.INSTAGRAM_CONNECT_KEY)) {
    return page("Not found", "<p>This page doesn't exist.</p>", 404);
  }
  if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
    return page("Not set up yet", "<p>INSTAGRAM_APP_ID and INSTAGRAM_APP_SECRET are missing in Vercel.</p>", 500);
  }

  const state = randomBytes(24).toString("hex");
  const redirectUri = `${req.nextUrl.origin}/studio-tools/instagram/callback`;
  const authorize = `https://www.instagram.com/oauth/authorize?${new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "instagram_business_basic",
    state,
  })}`;

  const current = await readToken();
  const status = current
    ? `<p>Connected. The token is renewed automatically every day; it would lapse on ${esc(new Date(current.expiresAt).toDateString())} if renewals stopped.</p>`
    : "<p>Not connected yet. The Instagram account must be a Business or Creator account.</p>";

  return page(
    "Connect Instagram",
    `${status}<p>Click below, sign in to Instagram and allow access. You'll come straight back here.</p><a class="btn" href="${esc(authorize)}">${current ? "Reconnect" : "Connect"} Instagram</a>`,
    200,
    {
      "Set-Cookie": `ig_oauth_state=${state}; Path=/studio-tools/instagram; HttpOnly; Secure; SameSite=Lax; Max-Age=900`,
    },
  );
}
