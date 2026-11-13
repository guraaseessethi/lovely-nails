/**
 * One-off content update, 13 Nov 2026: April's 2026 price list and her photos from the shared
 * Dropbox folder ("Lovely Nails"). Patches the live dataset in place, so other Studio edits are
 * kept. Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/update-2026-11-13.ts
 *
 * - Services replaced with the 2026 price list (old 2018 entries removed)
 * - Hero, care band and Visit backgrounds: real salon photos instead of stock
 * - Published journal post cover: real salon photo instead of stock
 * - Work photos: 8 old-site photos swapped for their full-resolution originals, 13 new photos,
 *   the 2 stock photos removed, orange-pink ombre moved to "Ombre, French & Chrome"
 *
 * Photos are read from PHOTOS_DIR (default ../photos), folder from-dropbox/.
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";
import { PRICE_LIST_2026 } from "./price-list-2026";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const PHOTOS = resolve(process.env.PHOTOS_DIR ?? "../photos", "from-dropbox");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

const uploaded = new Map<string, string>();
async function upload(file: string) {
  const cached = uploaded.get(file);
  if (cached) return cached;
  const path = join(PHOTOS, file);
  if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
  // Sanity de-duplicates by content hash, so re-running doesn't create copies.
  const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
  console.log(`  uploaded ${file}`);
  uploaded.set(file, asset._id);
  return asset._id;
}
const ref = async (file: string) => ({ _type: "reference", _ref: await upload(file) });

// Old-site photos on the site at 1200px, matched (pixel comparison) to their 6016px originals.
const ORIGINALS: Record<string, string> = {
  "Deep burgundy polish on long almond nails": "original-ALE9741-burgundy-almond.jpg",
  "Sheer pink polish on natural nails": "original-ALE9754-sheer-pink.jpg",
  "Pale neutral polish on long tapered nails": "original-ALE9771-pale-neutral.jpg",
  "Light blue polish on almond nails": "original-ALE9780-light-blue.jpg",
  "Coral pink polish with a white accent nail": "original-ALE9782-coral-accent.jpg",
  "Pastel blue and pink polish beside two roses": "original-ALE9784-roses.jpg",
  "Four hands showing four different polish colours": "original-ALE9789-four-hands.jpg",
  "Charcoal polish on short almond nails": "original-ALE9793-charcoal.jpg",
};

// Stock photos that were standing in for her own work.
const REMOVE = new Set(["Nude polish on natural nails", "Tortoiseshell gel nails"]);

const RECATEGORIZE: Record<string, string> = {
  "Orange to hot pink ombre on almond nails": "Ombre, French & Chrome",
};

// New photos, shown first on the site in this order. Categories follow her Dropbox folders.
const NEW_PHOTOS: [string, string, string][] = [
  ["pink-green-ombre-almond.png", "Ombre, French & Chrome", "Hot pink to lime green ombre on almond nails"],
  ["red-snowflake-almond.png", "Seasonal", "Glossy red almond nails with white snowflakes"],
  ["blue-white-marble.png", "Theme", "Blue and white marbled nail art with a hand-painted accent"],
  ["pink-french-square-flower.png", "Ombre, French & Chrome", "Pink French tips on square nails with a white flower accent"],
  ["lilac-chrome-stiletto.png", "Ombre, French & Chrome", "Lilac chrome on long stiletto nails"],
  ["neon-green-witch-stiletto.png", "Theme", "Neon green and black Halloween designs on stiletto nails"],
  ["baby-blue-floral-accent.png", "Seasonal", "Baby blue nails with floral accent nails"],
  ["french-ombre-almond.png", "Ombre, French & Chrome", "Pink-to-white French ombre on almond nails"],
  ["halloween-ghost-mummy-pumpkin.png", "Theme", "Halloween nails with a ghost, mummies and jack-o'-lanterns"],
  ["nude-gold-stripe-almond.png", "Everyday", "Nude almond nails with fine gold stripe accents"],
  ["red-silver-web-design.png", "Theme", "Red and silver spider-web designs on long nails"],
  ["burgundy-glitter-accent.jpg", "Everyday", "Burgundy polish with a silver glitter accent nail"],
  ["pale-lilac-tapered.jpg", "Everyday", "Pale lilac polish on long tapered nails"],
];

type Photo = { _key: string; _type: "image"; alt?: string; category?: string; asset?: unknown; [k: string]: unknown };

async function main() {
  console.log(`Updating ${projectId}/${dataset}`);

  console.log("Services: 2026 price list");
  const tx = client.transaction();
  PRICE_LIST_2026.forEach(({ id, group, name, price, description }, i) =>
    tx.createOrReplace({
      _id: `service-${id}`,
      _type: "service",
      name,
      group,
      price,
      order: (i + 1) * 10,
      ...(description ? { description } : {}),
    }),
  );
  const keep = new Set(PRICE_LIST_2026.map((s) => `service-${s.id}`));
  const existing = await client.fetch<string[]>(`*[_type == "service"]._id`);
  const stale = existing.filter((id) => !keep.has(id.replace(/^drafts\./, "")));
  stale.forEach((id) => tx.delete(id));
  await tx.commit();
  console.log(`  ${PRICE_LIST_2026.length} written, ${stale.length} old entries removed`);

  await client
    .patch("pageSeo")
    .set({
      "services.description":
        "Manicures from $25, pedicures from $40, Gel/Shellac, Solar and Bio/Builder nails, waxing and facials in Barrie. See the full menu and call to book.",
    })
    .commit();
  console.log("  page SEO: services description now quotes the confirmed prices");

  console.log("Backgrounds: real salon photos");
  await client
    .patch("backgrounds")
    .set({
      hero: { _type: "image", asset: await ref("salon-interior-polish-wall.jpg") },
      clean: { _type: "image", asset: await ref("salon-polish-display.jpg") },
      visit: { _type: "image", asset: await ref("salon-polish-wall-sign.jpg") },
    })
    .commit();

  console.log("Journal covers");
  const covers: [string, string, string][] = [
    ["post-how-we-keep-the-salon-clean", "salon-interior-polish-wall.jpg", "The polish wall and a clean station at Lovely Nails Spa"],
    ["drafts.post-how-we-keep-the-salon-clean", "salon-interior-polish-wall.jpg", "The polish wall and a clean station at Lovely Nails Spa"],
    ["drafts.post-shellac-bio-seaweed-or-regular-polish", "salon-polish-wall-sign.jpg", "The Lovely Nails Spa polish wall"],
    ["drafts.post-nail-extension-aftercare", "pink-french-square-flower.png", "Pink French tips on square nail extensions"],
  ];
  // "raw" so unpublished drafts are visible too.
  const ids = await client.fetch<string[]>(
    `*[_id in $ids]._id`,
    { ids: covers.map((c) => c[0]) },
    { perspective: "raw" },
  );
  for (const [id, file, alt] of covers) {
    if (!ids.includes(id)) continue;
    await client.patch(id).set({ coverImage: { _type: "image", asset: await ref(file), alt } }).commit();
    console.log(`  ${id}`);
  }

  console.log("Work photos");
  const current = (await client.fetch<Photo[] | null>(`*[_id == "workPhotos"][0].photos`)) ?? [];
  const kept: Photo[] = [];
  let upgraded = 0;
  for (const p of current) {
    if (p.alt && REMOVE.has(p.alt)) continue;
    let next = p;
    if (p.alt && ORIGINALS[p.alt]) {
      // New file, so any crop or hotspot set on the old one no longer applies.
      next = { ...next, asset: await ref(ORIGINALS[p.alt]), crop: undefined, hotspot: undefined };
      upgraded++;
    }
    if (p.alt && RECATEGORIZE[p.alt]) next = { ...next, category: RECATEGORIZE[p.alt] };
    kept.push(next);
  }
  const have = new Set(current.map((p) => p.alt));
  const added: Photo[] = [];
  for (const [file, category, alt] of NEW_PHOTOS) {
    if (have.has(alt)) continue;
    added.push({ _key: key(), _type: "image", asset: await ref(file), alt, category });
  }
  // The site shows the list bottom-up, so append in reverse to keep NEW_PHOTOS order on the site.
  await client
    .patch("workPhotos")
    .set({ photos: [...kept, ...added.reverse()] })
    .commit();
  console.log(
    `  ${current.length - kept.length} stock removed, ${upgraded} upgraded to originals, ${added.length} added`,
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
