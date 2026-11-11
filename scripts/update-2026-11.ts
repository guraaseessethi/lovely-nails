/**
 * One-off content update from April's 10 Nov 2026 email. Patches the live dataset in place,
 * so Studio edits elsewhere are kept (unlike `npm run seed -- --force`). Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/update-2026-11.ts
 *
 * - Rogers TV link removed (the video is no longer online)
 * - Established 2008 (was 2011) in settings, About and home SEO
 * - Foot massage added to the menu
 * - Work photos moved to April's new categories, plus five new photos
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const PHOTOS = resolve(process.env.PHOTOS_DIR ?? "../photos");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// Existing photos, matched by their alt text.
const RECATEGORIZE: Record<string, string> = {
  "Pedicure with white-tipped toes resting on a towel beside a yellow rose": "Wedding",
  "Pink-to-white ombre on long almond nails": "Special Occasion",
  "Deep burgundy polish on long almond nails": "Party",
  "Sheer pink polish on natural nails": "Simple",
  "Short natural nails holding a yellow rose": "Simple",
  "Burgundy polish on short nails, hands crossed": "Everyday",
  "Pale neutral polish on long tapered nails": "Simple",
  "Light blue polish on almond nails": "Everyday",
  "Coral pink polish with a white accent nail": "Everyday",
  "Pastel blue and pink polish beside two roses": "Seasonal",
  "Four hands showing four different polish colours": "Lovely Nails",
  "Charcoal polish on short almond nails": "Everyday",
  "Tortoiseshell gel nails": "Theme",
  "Nude polish on natural nails": "Simple",
};
// Anything April uploaded herself under an old category.
const OLD_TO_NEW: Record<string, string> = {
  Gel: "Everyday",
  Shellac: "Everyday",
  Natural: "Simple",
  Art: "Theme",
  Ombre: "Party",
  Pedicure: "Everyday",
};

// Shown first on the site in this order (the site reads the Studio list bottom-up).
const NEW_PHOTOS: [string, string, string][] = [
  ["from-april/ombre-orange-pink-almond.jpg", "Party", "Orange to hot pink ombre on almond nails"],
  ["from-april/milky-white-gold-flake.jpg", "Special Occasion", "Milky white gel with gold flakes on oval nails"],
  ["from-april/french-tips-almond.jpg", "Wedding", "Classic white French tips on almond nails"],
  ["from-april/sheer-pink-square.jpg", "Simple", "Sheer pink on long square nails"],
  ["from-april/lavender-short-gel.jpg", "Everyday", "Pastel lavender gel on short rounded nails"],
];

type Photo = { _key: string; _type: "image"; alt?: string; category?: string; [k: string]: unknown };

async function main() {
  console.log(`Updating ${projectId}/${dataset}`);

  await client.patch("siteSettings").set({ since: 2008 }).unset(["rogersTvUrl"]).commit();
  console.log("  settings: since 2008, Rogers TV link removed (video is gone)");

  const about = await client.fetch<{ secondParagraph?: string } | null>(`*[_id == "about"][0]{secondParagraph}`);
  if (about?.secondParagraph?.includes("2011")) {
    await client.patch("about").set({ secondParagraph: about.secondParagraph.replaceAll("2011", "2008") }).commit();
    console.log("  about: 2011 -> 2008");
  }

  const seo = await client.fetch<{ description?: string } | null>(`*[_id == "pageSeo"][0].home{description}`);
  if (seo?.description?.includes("2011")) {
    await client.patch("pageSeo").set({ "home.description": seo.description.replaceAll("2011", "2008") }).commit();
    console.log("  page SEO: 2011 -> 2008");
  }

  await client.createIfNotExists({ _id: "service-foot-massage", _type: "service", name: "Foot massage", group: "Pedicure", order: 65 });
  console.log("  service: foot massage");

  const current = (await client.fetch<Photo[] | null>(`*[_id == "workPhotos"][0].photos`)) ?? [];
  const recategorized = current.map((p) => {
    const next = (p.alt && RECATEGORIZE[p.alt]) || (p.category && OLD_TO_NEW[p.category]) || p.category;
    return next === p.category ? p : { ...p, category: next };
  });
  const have = new Set(current.map((p) => p.alt));
  const added: Photo[] = [];
  for (const [file, category, alt] of NEW_PHOTOS) {
    if (have.has(alt)) continue;
    const path = join(PHOTOS, file);
    if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
    const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
    console.log(`  uploaded ${file}`);
    added.push({ _key: key(), _type: "image", asset: { _type: "reference", _ref: asset._id }, alt, category });
  }
  // Appended in reverse so the first entry above ends up last in the list, i.e. first on the site.
  await client
    .patch("workPhotos")
    .set({ photos: [...recategorized, ...added.reverse()] })
    .commit();
  console.log(`  work photos: ${current.length} recategorized, ${added.length} added`);

  console.log("Done.");
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
