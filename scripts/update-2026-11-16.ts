/**
 * One-off content update, 16 Nov 2026: April's new Dropbox folders "April Picture" and
 * "Front Desk Waiting Areas And Others". Patches the live dataset in place. Safe to re-run.
 *
 *   npx tsx --env-file=.env.local scripts/update-2026-11-16.ts
 *
 * - About April: her photo at the front desk (replaces the stock placeholder)
 * - Clean band: the manicure stations. Visit: the storefront on Burton Ave.
 *   The hero keeps its current photo: the new shots are ~1670px wide, too soft full-screen.
 * - Clean-salon Journal post: the sink and towel warmers photo (uploaded here, set by clean-post.ts)
 * - Gallery: 7 salon photos under "Lovely Nails", added at the end so nail work still leads
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

async function ref(file: string) {
  const path = join(PHOTOS, file);
  if (!existsSync(path)) throw new Error(`Missing photo: ${path}`);
  // Sanity de-duplicates by content hash, so re-running doesn't create copies.
  const asset = await client.assets.upload("image", createReadStream(path), { filename: basename(path) });
  return { _type: "reference", _ref: asset._id };
}

// Salon photos for the gallery, in the order they should appear (after all the nail work).
const SALON: [string, string][] = [
  ["salon-front-desk.jpg", "The front desk at Lovely Nails Spa with its \"Be so happy\" sign"],
  ["salon-pedicure-chairs.jpg", "Row of pedicure chairs at Lovely Nails Spa"],
  ["salon-manicure-stations.jpg", "Manicure stations and pedicure chairs inside Lovely Nails Spa"],
  ["salon-polish-wall-2026.jpg", "The Lovely Nails Spa polish wall"],
  ["salon-pedicure-buddha.jpg", "Buddha statue and plants in front of the pedicure area"],
  ["salon-facial-room.jpg", "The facial room at Lovely Nails Spa"],
  ["salon-welcome-seating.jpg", "Waiting chairs beside a \"Welcome to Lovely Nails\" sign"],
];

type Photo = { _key: string; alt?: string; [k: string]: unknown };

async function main() {
  console.log(`Updating ${projectId}/${dataset}`);

  await client
    .patch("about")
    .set({
      photo: {
        _type: "image",
        asset: await ref("april-front-desk.jpg"),
        alt: "April, owner of Lovely Nails Spa, smiling at the salon's front desk",
        hotspot: { _type: "sanity.imageHotspot", x: 0.55, y: 0.4, width: 0.6, height: 0.6 },
      },
    })
    .commit();
  console.log("  About April photo set");

  await client
    .patch("backgrounds")
    .set({
      clean: { _type: "image", asset: await ref("salon-manicure-stations.jpg") },
      visit: { _type: "image", asset: await ref("salon-storefront.jpg") },
    })
    .commit();
  console.log("  Clean band and Visit backgrounds set");

  const current = (await client.fetch<Photo[] | null>(`*[_id == "workPhotos"][0].photos`)) ?? [];
  const have = new Set(current.map((p) => p.alt));
  const added: Photo[] = [];
  for (const [file, alt] of SALON) {
    if (have.has(alt)) continue;
    added.push({ _key: key(), _type: "image", asset: await ref(file), alt, categories: ["Lovely Nails"] });
  }
  // The site shows the list bottom-up: put these at the start (reversed) so they come last, in SALON order.
  await client
    .patch("workPhotos")
    .set({ photos: [...added.reverse(), ...current] })
    .commit();
  console.log(`  ${added.length} salon photos added to the gallery`);

  // Used inside the clean-salon Journal post (scripts/journal-2026-11/clean-post.ts finds it by filename).
  await ref("salon-sink-towel-warmers.jpg");
  console.log("Done.");
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
