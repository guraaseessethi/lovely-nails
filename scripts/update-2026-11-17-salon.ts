/**
 * "Step into Lovely Nails" (/salon) shows only photos of the store itself. Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/update-2026-11-17-salon.ts
 *
 * - Switches on "Photo of the salon" for the store photos already in Work photos, gives each a
 *   short caption and clears their nail categories, so they stay out of the nail gallery filters.
 * - Adds the rest of April's "Front Desk Waiting Areas And Others" Dropbox folder.
 *
 * Photos are read from PHOTOS_DIR (default ../photos), folder from-dropbox/.
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
const PHOTOS = resolve(process.env.PHOTOS_DIR ?? "../photos", "from-dropbox");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// In the order they should appear on the salon page.
const STORE: { file: string; alt: string; caption: string }[] = [
  { file: "salon-storefront.jpg", alt: "The Lovely Nails Spa storefront on Burton Ave in Barriegate Centre", caption: "Our storefront" },
  { file: "salon-front-desk.jpg", alt: "The front desk at Lovely Nails Spa with its \"Be so happy\" sign", caption: "Front desk" },
  { file: "salon-manicure-stations.jpg", alt: "Manicure stations and pedicure chairs inside Lovely Nails Spa", caption: "Manicure stations" },
  { file: "salon-pedicure-chairs.jpg", alt: "Row of pedicure chairs at Lovely Nails Spa", caption: "Pedicure chairs" },
  { file: "salon-pedicure-buddha.jpg", alt: "Buddha statue and plants in front of the pedicure area", caption: "Pedicure area" },
  { file: "salon-polish-wall-2026.jpg", alt: "The Lovely Nails Spa polish wall", caption: "Polish wall" },
  { file: "salon-sink-towel-warmers.jpg", alt: "Hand-washing sink and towel warmers beside the polish wall", caption: "Sink and towel warmers" },
  { file: "salon-facial-room.jpg", alt: "The facial room at Lovely Nails Spa", caption: "Facial room" },
  { file: "salon-welcome-seating.jpg", alt: "Waiting chairs beside a \"Welcome to Lovely Nails\" sign", caption: "Welcome seating" },
  { file: "salon-waiting-chairs.jpg", alt: "Two black armchairs in the waiting area", caption: "Waiting area" },
  { file: "salon-hallway.jpg", alt: "Hallway to the washrooms with a Buddha statue at the end", caption: "Hallway" },
];

type Photo = { _key: string; _type: "image"; alt?: string; categories?: string[]; salon?: boolean; caption?: string; asset?: { _ref: string }; [k: string]: unknown };

async function main() {
  console.log(`Updating ${projectId}/${dataset}`);
  const current = (await client.fetch<Photo[] | null>(`*[_id == "workPhotos"][0].photos`)) ?? [];
  const names = new Map<string, string>(
    (await client.fetch<{ _id: string; originalFilename?: string }[]>(
      `*[_type == "sanity.imageAsset" && _id in $ids]{_id, originalFilename}`,
      { ids: current.map((p) => p.asset?._ref).filter(Boolean) },
    )).map((a) => [a._id, a.originalFilename ?? ""]),
  );
  const byFile = new Map(STORE.map((s) => [s.file, s]));

  let marked = 0;
  const kept: Photo[] = current.map((p) => {
    const store = byFile.get(names.get(p.asset?._ref ?? "") ?? "");
    if (!store) return p;
    marked++;
    byFile.delete(store.file);
    return { ...p, salon: true, alt: store.alt, caption: store.caption, categories: [] };
  });

  const added: Photo[] = [];
  for (const s of byFile.values()) {
    const path = join(PHOTOS, s.file);
    if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
    const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
    added.push({ _key: key(), _type: "image", asset: { _ref: asset._id }, alt: s.alt, caption: s.caption, salon: true, categories: [] });
    console.log(`  uploaded ${s.file}`);
  }

  // The site lists photos bottom-up; put new store photos at the start so they don't lead the nail gallery
  // (they're hidden there anyway) and keep STORE order on the salon page.
  const order = new Map(STORE.map((s, i) => [s.alt, i]));
  const all = [...added, ...kept];
  const salon = all.filter((p) => p.salon && order.has(p.alt ?? "")).sort((a, b) => order.get(b.alt!)! - order.get(a.alt!)!);
  const rest = all.filter((p) => !(p.salon && order.has(p.alt ?? "")));
  await client.patch("workPhotos").set({ photos: [...salon, ...rest] }).commit();
  console.log(`  ${marked} existing photos marked as salon photos, ${added.length} added`);
  console.log("Done.");
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
