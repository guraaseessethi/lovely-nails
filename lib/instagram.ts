import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { createClient, parseConnectionString } from "@vercel/edge-config";
import { getSettings } from "./content";
import type { InstagramPost } from "./types";

// Two sources, in order:
// 1. Instagram API: INSTAGRAM_ACCESS_TOKEN (Vercel env var, a never-expiring token from Meta's
//    "Unified login" setup), or the older connect flow's token in Vercel Edge Config. Never in
//    Sanity or git. Shows up to 12 of her latest photo posts.
// 2. Behold (behold.so), as a fallback: public JSON with a few recent posts and image links that
//    don't expire. Override with INSTAGRAM_FEED_URL, or set it to "" to turn off.
const BEHOLD_FEED = process.env.INSTAGRAM_FEED_URL ?? "https://feeds.behold.so/b6mil0x9ivXmCrpHai4K";

const GRAPH = "https://graph.instagram.com";
const KEY = "instagram";

export type StoredToken = { token: string; userId: string; expiresAt: number; refreshedAt: number };

export function timingSafeMatch(given: string | null | undefined, expected: string | undefined) {
  if (!given || !expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function readToken(): Promise<StoredToken | null> {
  if (!process.env.EDGE_CONFIG) return null;
  try {
    const value = await createClient(process.env.EDGE_CONFIG).get<StoredToken>(KEY);
    return value?.token ? value : null;
  } catch {
    return null;
  }
}

/** Writes the token through the Vercel REST API (the read token in EDGE_CONFIG cannot write). */
export async function writeToken(value: StoredToken) {
  const conn = process.env.EDGE_CONFIG ? parseConnectionString(process.env.EDGE_CONFIG) : null;
  const apiToken = process.env.VERCEL_API_TOKEN;
  if (!conn || !apiToken) throw new Error("EDGE_CONFIG and VERCEL_API_TOKEN must be set");
  const team = process.env.VERCEL_TEAM_ID ? `?teamId=${encodeURIComponent(process.env.VERCEL_TEAM_ID)}` : "";
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${conn.id}/items${team}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ operation: "upsert", key: KEY, value }] }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Edge Config write failed (${res.status})`);
}

async function igJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (data as { error?: { message?: string }; error_message?: string }).error?.message;
    throw new Error(`Instagram API ${res.status}${msg ? `: ${msg}` : ""}`);
  }
  return data as T;
}

/** OAuth step 2: code -> short-lived token -> long-lived (60 day) token. */
export async function exchangeCode(code: string, redirectUri: string): Promise<StoredToken> {
  const short = await igJson<{ access_token: string; user_id: number | string }>(
    "https://api.instagram.com/oauth/access_token",
    {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_APP_ID ?? "",
        client_secret: process.env.INSTAGRAM_APP_SECRET ?? "",
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    },
  );
  const long = await igJson<{ access_token: string; expires_in: number }>(
    `${GRAPH}/access_token?${new URLSearchParams({
      grant_type: "ig_exchange_token",
      client_secret: process.env.INSTAGRAM_APP_SECRET ?? "",
      access_token: short.access_token,
    })}`,
  );
  const now = Date.now();
  return { token: long.access_token, userId: String(short.user_id), expiresAt: now + long.expires_in * 1000, refreshedAt: now };
}

/** Extends a long-lived token by another 60 days. Instagram only allows this once the token is a day old. */
export async function refreshToken(current: StoredToken): Promise<StoredToken> {
  const data = await igJson<{ access_token: string; expires_in: number }>(
    `${GRAPH}/refresh_access_token?${new URLSearchParams({ grant_type: "ig_refresh_token", access_token: current.token })}`,
  );
  const now = Date.now();
  return { ...current, token: data.access_token, expiresAt: now + data.expires_in * 1000, refreshedAt: now };
}

type Media = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  children?: { data: { media_type: string; media_url?: string }[] };
};

function altFrom(caption?: string) {
  const first = caption?.split(/\n|(?<=[.!?])\s/)[0]?.replace(/#\S+/g, "").trim();
  if (!first) return "Instagram post from Lovely Nails Spa";
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
}

/** Matches an excluded entry given as a media ID or as a post link. */
function isExcluded(m: { id: string; permalink: string }, exclude: string[]) {
  return exclude.some((raw) => {
    const e = raw.trim();
    if (!e) return false;
    if (e === m.id) return true;
    const code = e.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/)?.[1];
    return Boolean(code && m.permalink.includes(`/${code}`));
  });
}

type BeholdSize = { width: number; height: number; mediaUrl: string };
type BeholdPost = {
  id: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  prunedCaption?: string;
  hashtags?: string[];
  sizes?: { medium?: BeholdSize; large?: BeholdSize };
};

async function fetchBehold(url: string, exclude: string[], hashtag?: string): Promise<InstagramPost[]> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 21600, expire: 172800 });
  cacheTag("instagram");

  const { posts } = await igJson<{ posts: BeholdPost[] }>(url);
  const tag = hashtag?.replace(/^#/, "").toLowerCase();
  return posts
    .filter((p) => p.mediaType !== "VIDEO" && !isExcluded(p, exclude))
    .filter((p) => !tag || (p.hashtags ?? []).some((h) => h.toLowerCase() === tag))
    .flatMap((p) => {
      const size = p.sizes?.medium ?? p.sizes?.large;
      if (!size) return [];
      return [
        {
          id: p.id,
          src: size.mediaUrl,
          alt: altFrom(p.prunedCaption ?? p.caption),
          width: size.width,
          height: size.height,
          permalink: p.permalink,
          caption: p.prunedCaption ?? p.caption,
        },
      ];
    })
    .slice(0, 12);
}

const MEDIA_FIELDS = "id,caption,media_type,media_url,permalink,children{media_type,media_url}";
// April's Instagram professional account ID (public, shown in Meta's dashboard).
const IG_USER_ID = process.env.INSTAGRAM_USER_ID ?? "17841456669860981";

/**
 * Asks Instagram for the latest media with a token. Tokens from Meta's newer "Unified login"
 * (INSTAGRAM_ACCESS_TOKEN, a never-expiring system-user token) may work on either API host,
 * so both are tried; the Edge Config token from the older connect flow uses graph.instagram.com.
 */
async function fetchMedia(token: string): Promise<Media[]> {
  const q = new URLSearchParams({ fields: MEDIA_FIELDS, limit: "40", access_token: token });
  const urls = [`${GRAPH}/me/media?${q}`, `https://graph.facebook.com/${IG_USER_ID}/media?${q}`];
  let lastError: unknown;
  for (const url of urls) {
    try {
      return (await igJson<{ data: Media[] }>(url)).data;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

async function fetchFeed(exclude: string[], hashtag?: string): Promise<InstagramPost[]> {
  "use cache";
  // Instagram's CDN links expire after a few days, so never keep them long.
  cacheLife({ stale: 3600, revalidate: 43200, expire: 172800 });
  cacheTag("instagram");

  const token = process.env.INSTAGRAM_ACCESS_TOKEN || (await readToken())?.token;
  if (!token) return [];
  const data = await fetchMedia(token);
  const tag = hashtag?.replace(/^#/, "").toLowerCase();

  return data
    .filter((m) => m.media_type !== "VIDEO" && !isExcluded(m, exclude))
    .filter((m) => !tag || (m.caption ?? "").toLowerCase().includes(`#${tag}`))
    .flatMap((m) => {
      const src =
        m.media_type === "CAROUSEL_ALBUM"
          ? m.children?.data.find((c) => c.media_type === "IMAGE")?.media_url
          : m.media_url;
      if (!src) return [];
      return [{ id: m.id, src, alt: altFrom(m.caption), width: 1080, height: 1350, permalink: m.permalink, caption: m.caption }];
    })
    .slice(0, 12);
}

/** Latest photo posts, or [] if Instagram isn't connected or the API fails. Never throws. */
export async function getInstagramPosts(): Promise<InstagramPost[]> {
  let settings: Awaited<ReturnType<typeof getSettings>>;
  try {
    settings = await getSettings();
  } catch {
    return [];
  }
  // Her own token first (every post), then Behold (a few recent posts) if that's missing or fails.
  try {
    const posts = await fetchFeed(settings.instagramExclude, settings.instagramHashtag);
    if (posts.length > 0) return posts;
  } catch (err) {
    console.error("Instagram API feed unavailable:", err instanceof Error ? err.message : err);
  }
  if (!BEHOLD_FEED) return [];
  try {
    return await fetchBehold(BEHOLD_FEED, settings.instagramExclude, settings.instagramHashtag);
  } catch (err) {
    console.error("Behold feed unavailable:", err instanceof Error ? err.message : err);
    return [];
  }
}
