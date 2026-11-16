/**
 * Hides April's old holiday-hours and Mother's Day posts from the homepage Instagram strip
 * (Admin > Site settings > Instagram feed > "Hide these Instagram posts"). Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/instagram-hide-2026-11-16.ts
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const HIDE = [
  "https://www.instagram.com/p/DclhA6ODshe/", // Labour Day weekend hours
  "https://www.instagram.com/p/DcB2WtnFY03/", // Labour Day weekend hours update
  "https://www.instagram.com/p/DayH6Q_xUQq/", // Civic long weekend hours
  "https://www.instagram.com/p/DYABbuejsNo/", // Mother's Day
];

async function main() {
  const current = (await client.fetch<string[] | null>(`*[_id == "siteSettings"][0].instagramExclude`)) ?? [];
  const next = [...current, ...HIDE.filter((h) => !current.includes(h))];
  await client.patch("siteSettings").set({ instagramExclude: next }).commit();
  console.log(`Hiding ${next.length} Instagram posts`);
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
