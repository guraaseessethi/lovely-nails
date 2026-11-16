/**
 * Sets the salon's Facebook page link (Admin > Site settings > Social and Google). Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/facebook-2026-11-16.ts
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

async function main() {
  const before = await client.fetch<string | null>(`*[_id == "siteSettings"][0].facebook`);
  await client.patch("siteSettings").set({ facebook: "https://www.facebook.com/profile.php?id=100088430612311" }).commit();
  console.log(`Facebook link updated (was: ${before ?? "empty"})`);
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
