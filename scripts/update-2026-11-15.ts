/**
 * One-off content update, 15 Nov 2026: the second batch of photos in April's shared Dropbox
 * folder ("Lovely Nails"). Patches the live dataset in place, so other Studio edits are kept.
 * Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/update-2026-11-15.ts
 *
 * - Work photos move from one category to several (`category` -> `categories`). April files a
 *   photo under every folder it belongs to, so each photo gets all of its Dropbox folders,
 *   plus the category it already had. "New Year" becomes "Christmas & New Year".
 * - 3 more old-site photos swapped for their full-resolution originals (matched pixel by pixel)
 * - 25 new photos
 *
 * Photos are read from PHOTOS_DIR (default ../photos), folder from-dropbox/.
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";
import { WORK_CATEGORIES } from "../lib/types";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const PHOTOS = resolve(process.env.PHOTOS_DIR ?? "../photos", "from-dropbox");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

async function ref(file: string) {
  const path = join(PHOTOS, file);
  if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
  // Sanity de-duplicates by content hash, so re-running doesn't create copies.
  const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
  return { _type: "reference", _ref: asset._id };
}

// Dropbox folder names -> site categories.
const C = {
  christmas: "Christmas & New Year",
  everyday: "Everyday",
  graduation: "Graduation",
  lovely: "Lovely Nails",
  ombre: "Ombre, French & Chrome",
  seasonal: "Seasonal",
  simple: "Simple",
  special: "Special Occasion",
  theme: "Theme",
  wedding: "Wedding",
} as const;

// Photos already on the site, by alt text: every Dropbox folder each one is now in.
const FOLDERS: Record<string, string[]> = {
  "Baby blue nails with floral accent nails": [C.seasonal, C.special, C.everyday, C.lovely],
  "Glossy red almond nails with white snowflakes": [C.seasonal, C.everyday, C.lovely],
  "Pink-to-white French ombre on almond nails": [C.ombre, C.wedding, C.everyday, C.simple],
  "Lilac chrome on long stiletto nails": [C.ombre, C.seasonal, C.graduation, C.special, C.everyday, C.lovely],
  "Orange to hot pink ombre on almond nails": [C.ombre, C.special, C.lovely],
  "Pink French tips on square nails with a white flower accent": [C.ombre, C.special, C.everyday],
  "Hot pink to lime green ombre on almond nails": [C.ombre, C.special, C.lovely],
  "Blue and white marbled nail art with a hand-painted accent": [C.theme, C.special],
  "Halloween nails with a ghost, mummies and jack-o'-lanterns": [C.theme, C.lovely],
  "Red and silver spider-web designs on long nails": [C.theme],
  "Neon green and black Halloween designs on stiletto nails": [C.theme, C.lovely],
  "Pastel lavender gel on short rounded nails": [C.wedding, C.special, C.everyday, C.simple, C.lovely],
  "Nude almond nails with fine gold stripe accents": [C.special, C.everyday],
  "Deep burgundy polish on long almond nails": [C.everyday, C.simple],
  "Sheer pink polish on natural nails": [C.everyday, C.simple],
  "Pale lilac polish on long tapered nails": [C.everyday],
  "Burgundy polish with a silver glitter accent nail": [C.everyday, C.simple],
  "Pale neutral polish on long tapered nails": [C.everyday, C.simple],
  "Light blue polish on almond nails": [C.everyday, C.simple],
  "Coral pink polish with a white accent nail": [C.everyday, C.simple],
  "Pastel blue and pink polish beside two roses": [C.everyday, C.simple],
  "Four hands showing four different polish colours": [C.everyday, C.simple],
  "Charcoal polish on short almond nails": [C.everyday, C.simple],
  "Short natural nails holding a yellow rose": [C.simple],
  "Burgundy polish on short nails, hands crossed": [C.simple],
  "Pink-to-white ombre on long almond nails": [C.simple],
};

// Old-site photos still on the site at 801-1200px, matched to their 2017 originals in Dropbox.
const ORIGINALS: Record<string, string> = {
  "Short natural nails holding a yellow rose": "original-ALE9762-yellow-rose.jpg",
  "Burgundy polish on short nails, hands crossed": "original-ALE9767-burgundy-short.jpg",
  "Pink-to-white ombre on long almond nails": "original-ALE9757-pink-white.jpg",
};

// New photos, shown first on the site in this order. Categories are the Dropbox folders each is in.
const NEW_PHOTOS: [string, string[], string][] = [
  ["nude-gold-swirl-stars-stiletto.png", [C.christmas, C.special, C.lovely], "Sheer nude stiletto nails with gold swirls and star accents"],
  ["emerald-ombre-gold-stars.png", [C.christmas, C.graduation, C.wedding, C.special, C.ombre, C.lovely], "Emerald green ombre on almond nails with gold star accents"],
  ["lilac-pink-marble-graduation.png", [C.graduation, C.special, C.lovely], "Lilac nails with pink marble accents for graduation"],
  ["blue-chrome-christmas-candy.png", [C.christmas], "Metallic blue nails holding a dish of gold-wrapped candies by a Christmas tree"],
  ["tortoiseshell-red-gold.png", [C.christmas, C.special, C.lovely], "Tortoiseshell, deep red and gold accent nails"],
  ["royal-blue-graduation.png", [C.graduation, C.special, C.lovely], "Royal blue graduation nails with clear floral accent nails"],
  ["mint-french-strawberry.png", [C.seasonal], "Mint French tips with pink strawberry accent nails"],
  ["purple-gold-leaf-almond.png", [C.christmas, C.lovely], "Matte purple almond nails with gold leaf and black fern accents"],
  ["black-white-pink-abstract-square.png", [C.christmas, C.wedding, C.special, C.lovely], "Black, white and pink abstract line art on long square nails"],
  ["green-blue-chrome-square.png", [C.special], "Green-to-blue chrome on long square nails"],
  ["burgundy-floral-almond.png", [C.christmas, C.seasonal, C.special, C.lovely], "Burgundy almond nails with hand-painted floral accents"],
  ["milky-french-ombre-almond.jpg", [C.ombre, C.wedding, C.special, C.everyday, C.simple, C.lovely], "Milky pink-to-white French ombre on almond nails"],
  ["neon-yellow-leopard.png", [C.christmas, C.seasonal, C.special, C.lovely], "Neon yellow nails with leopard print accents"],
  ["pastel-painted-flowers.png", [C.seasonal, C.everyday], "Pastel nails in five colours with painted flowers"],
  ["black-white-horror-stiletto.png", [C.theme], "Black and white stiletto nails with hockey-mask horror art"],
  ["milky-white-gold-foil.png", [C.wedding, C.everyday, C.lovely], "Milky white nails with gold foil flakes"],
  ["sheer-pink-ghosts.jpg", [C.theme], "Sheer pink nails with little ghosts, stars and burgundy tips"],
  ["rainbow-neon-french-stiletto.png", [C.christmas], "Clear stiletto nails with rainbow neon French tips"],
  ["nude-yellow-tip-lines-stiletto.png", [C.wedding, C.lovely], "Nude stiletto nails with yellow tips and fine black lines"],
  ["royal-blue-flower-accent-square.jpg", [C.special], "Royal blue long square nails with white flower accent nails"],
  ["pink-chrome-square.png", [C.lovely], "Pink chrome on long square nails"],
  ["soft-pink-square-holiday.png", [C.special, C.simple], "Soft pink square nails with a holiday backdrop"],
  ["pink-tiny-hearts.png", [C.everyday, C.simple], "Bubblegum pink nails with tiny red heart accents"],
  ["white-french-flower-classic.jpg", [C.ombre, C.wedding, C.special, C.everyday, C.simple, C.lovely], "Classic white French tips with a hand-painted white flower"],
  // Her salon sign. April also filed it under Christmas; kept to Lovely Nails since it isn't a nail set.
  ["salon-be-so-happy-sign.png", [C.lovely], "A hand on the salon sign: \"Be so happy that when others look at you they become happy too\""],
];

type Photo = { _key: string; _type: "image"; alt?: string; category?: string; categories?: string[]; [k: string]: unknown };

/** Known categories only, in the site's filter order, no duplicates. */
const tidy = (list: (string | undefined)[]) => {
  const names = new Set(list.map((c) => (c === "New Year" ? C.christmas : c)));
  return WORK_CATEGORIES.filter((c) => names.has(c));
};

async function main() {
  console.log(`Updating ${projectId}/${dataset}`);

  const current = (await client.fetch<Photo[] | null>(`*[_id == "workPhotos"][0].photos`)) ?? [];
  let upgraded = 0;
  const kept: Photo[] = [];
  for (const p of current) {
    const { category, ...rest } = p;
    let next: Photo = { ...rest, categories: tidy([...(p.categories ?? []), category, ...(FOLDERS[p.alt ?? ""] ?? [])]) };
    if (p.alt && ORIGINALS[p.alt]) {
      // New file, so any crop or hotspot set on the old one no longer applies.
      next = { ...next, asset: await ref(ORIGINALS[p.alt]), crop: undefined, hotspot: undefined };
      upgraded++;
    }
    kept.push(next);
  }

  const have = new Set(current.map((p) => p.alt));
  const added: Photo[] = [];
  for (const [file, categories, alt] of NEW_PHOTOS) {
    if (have.has(alt)) continue;
    added.push({ _key: key(), _type: "image", asset: await ref(file), alt, categories: tidy(categories) });
    console.log(`  uploaded ${file}`);
  }

  // The site shows the list bottom-up, so append in reverse to keep NEW_PHOTOS order on the site.
  await client
    .patch("workPhotos")
    .set({ photos: [...kept, ...added.reverse()] })
    .commit();
  console.log(`  ${kept.length} moved to multiple categories, ${upgraded} upgraded to originals, ${added.length} added`);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
