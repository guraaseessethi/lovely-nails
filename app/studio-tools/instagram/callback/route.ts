import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { exchangeCode, timingSafeMatch, writeToken } from "@/lib/instagram";
import { page } from "../html";

const CLEAR = { "Set-Cookie": "ig_oauth_state=; Path=/studio-tools/instagram; HttpOnly; Secure; SameSite=Lax; Max-Age=0" };

/** Instagram redirects back here with ?code=…&state=… after April allows access. */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  if (params.get("error")) {
    return page("Not connected", "<p>Access wasn't allowed on Instagram. Nothing was changed.</p>", 400, CLEAR);
  }
  const code = params.get("code");
  if (!code || !timingSafeMatch(params.get("state"), req.cookies.get("ig_oauth_state")?.value)) {
    return page("Link expired", "<p>Please start again from the connect link.</p>", 400, CLEAR);
  }

  try {
    const stored = await exchangeCode(code, `${req.nextUrl.origin}/studio-tools/instagram/callback`);
    await writeToken(stored);
    revalidateTag("instagram", { expire: 0 });
    return page("Instagram connected", "<p>All set. The latest photos will appear on the site shortly. You can close this tab.</p>", 200, CLEAR);
  } catch (err) {
    console.error("Instagram connect failed:", err instanceof Error ? err.message : err);
    return page("Something went wrong", "<p>Instagram didn't accept the connection. Please try again, or send this page to Kooht Studio.</p>", 500, CLEAR);
  }
}
