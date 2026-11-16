import { connection } from "next/server";
import { getInstagramPosts, readToken } from "@/lib/instagram";

/**
 * Temporary check: is the Instagram feed configured on this deployment, and what does Instagram say?
 * Never returns the token itself, only whether one is set and the API's own error text.
 */
export async function GET() {
  await connection();
  const raw = process.env.INSTAGRAM_ACCESS_TOKEN ?? "";
  const token = raw.trim().replace(/^["']|["']$/g, "");
  const edge = await readToken().catch(() => null);

  const hosts: Record<string, string> = {};
  if (token) {
    const fields = "id,media_type";
    for (const [name, base] of [
      ["graph.instagram.com", "https://graph.instagram.com/me/media"],
      ["graph.facebook.com", `https://graph.facebook.com/${process.env.INSTAGRAM_USER_ID ?? "17841456669860981"}/media`],
    ]) {
      const res = await fetch(`${base}?${new URLSearchParams({ fields, limit: "5", access_token: token })}`, {
        cache: "no-store",
      });
      const body = (await res.json().catch(() => ({}))) as { data?: unknown[]; error?: { message?: string } };
      hosts[name] = res.ok ? `ok, ${body.data?.length ?? 0} posts` : `${res.status}: ${body.error?.message ?? "error"}`;
    }
  }

  const posts = await getInstagramPosts();
  return Response.json({
    envTokenSet: Boolean(token),
    envTokenLength: token.length,
    envTokenHadSpacesOrQuotes: raw.length !== token.length,
    edgeConfigToken: Boolean(edge),
    hosts,
    postsShownOnSite: posts.length,
    firstPostSource: posts[0]?.src ? new URL(posts[0].src).hostname : null,
  });
}
