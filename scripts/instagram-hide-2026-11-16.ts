/**
 * Hides April's non-nail posts (hours notices, greetings, promos, brows) from the homepage Instagram strip
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
  // Holiday hours and closures
  "https://www.instagram.com/p/DclhA6ODshe/", // Labour Day weekend hours
  "https://www.instagram.com/p/DcB2WtnFY03/", // Labour Day weekend hours update
  "https://www.instagram.com/p/DayH6Q_xUQq/", // Civic long weekend hours
  "https://www.instagram.com/p/DUwER5cAR4m/", // Family Day, closed Feb 16
  "https://www.instagram.com/p/DSp7S_EDs7k/", // Christmas and New Year hours
  // Greetings and promos (text graphics, not nail photos)
  "https://www.instagram.com/p/Db--bi8jh0M/", // Aftercare tips graphic
  "https://www.instagram.com/p/Db552ClDnGt/", // "Why nail techs ask questions" graphic
  "https://www.instagram.com/p/DYABbuejsNo/", // Mother's Day treat
  "https://www.instagram.com/p/DXz570ijsT0/", // Mother's Day gift certificates
  "https://www.instagram.com/p/DWjeTy_DpQj/", // Happy Easter
  "https://www.instagram.com/p/DQxVafujtS6/", // Book for the holidays
  "https://www.instagram.com/p/DPwX65lDljY/", // Happy Thanksgiving
  "https://www.instagram.com/p/DLkCoZlODzI/", // Happy Canada Day
  "https://www.instagram.com/p/DKaDKxtOpQ2/", // Father's Day June special
  "https://www.instagram.com/p/DJKCfGLOChr/", // Mother's Day promo
  // Not nails
  "https://www.instagram.com/p/DJSX5u_OAxF/", // Eyebrow shading
  "https://www.instagram.com/p/DI2CWhaOroS/", // Permanent makeup consultation
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
