/**
 * Loads the seven scheduled Journal posts into Sanity as published posts with future dates.
 * The site only shows a post from its date onwards (see getPosts in lib/content.ts).
 *
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/publish.ts            # create missing posts
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/publish.ts --force    # overwrite Studio edits too
 *
 * Images are photos already in Sanity, found by their original filename.
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";
import { toPortableText } from "./portable-text";
import { POSTS } from "./posts";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const FORCE = process.argv.includes("--force");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const assets = new Map<string, string>();
async function assetId(file: string) {
  if (!assets.has(file)) {
    const id = await client.fetch<string | null>(
      `*[_type == "sanity.imageAsset" && originalFilename == $file] | order(_createdAt desc)[0]._id`,
      { file },
    );
    if (!id) throw new Error(`No image in Sanity named ${file}`);
    assets.set(file, id);
  }
  return assets.get(file)!;
}

async function main() {
  console.log(`Loading ${POSTS.length} scheduled posts into ${projectId}/${dataset}${FORCE ? " (force)" : ""}`);
  for (const p of POSTS) {
    const doc = {
      _id: `post-${p.slug}`,
      _type: "post",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      date: p.date,
      tag: p.tag,
      excerpt: p.excerpt,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      coverImage: { _type: "image", asset: { _type: "reference", _ref: await assetId(p.cover.file) }, alt: p.cover.alt },
      body: await toPortableText(p.body, assetId),
    };
    if (FORCE) await client.createOrReplace(doc);
    else await client.createIfNotExists(doc);
    console.log(`  ${p.date}  ${p.title}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error("Publish failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
