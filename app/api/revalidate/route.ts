import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookBody = { _type?: string };

/**
 * Called by the Sanity webhook on every create, update or delete.
 * Expires the cache tag for that document type so the change is live on the next visit.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "Revalidation is not configured" }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<WebhookBody>(req, secret, true);
    if (!isValidSignature) return Response.json({ message: "Invalid signature" }, { status: 401 });
    if (!body?._type) return Response.json({ message: "Missing _type" }, { status: 400 });

    // expire: 0 so the next visitor gets fresh content rather than one stale view.
    revalidateTag(body._type, { expire: 0 });
    return Response.json({ revalidated: body._type });
  } catch {
    return Response.json({ message: "Could not parse webhook" }, { status: 400 });
  }
}
