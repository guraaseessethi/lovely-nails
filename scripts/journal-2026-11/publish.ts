/**
 * Loads the seven scheduled Journal posts into Sanity as published posts with future dates.
 * The site only shows a post from its date onwards (see getPosts in lib/content.ts).
 *
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/publish.ts            # create missing posts
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/publish.ts --force    # overwrite Studio edits too
 *
 * Images are photos already in Sanity, found by their original filename.
 */
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";
import { POSTS } from "./posts";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const FORCE = process.argv.includes("--force");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

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

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };

/** Inline **bold** and [text](url) -> spans and link mark definitions. */
function inline(text: string) {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) children.push({ _type: "span", _key: key(), text: text.slice(last, m.index), marks: [] });
    if (m[1]) {
      children.push({ _type: "span", _key: key(), text: m[1], marks: ["strong"] });
    } else {
      const def: MarkDef = { _type: "link", _key: key(), href: m[3] };
      markDefs.push(def);
      // Bold inside a link, e.g. [**(705) 739-8289**](tel:...), isn't used, so links stay plain.
      children.push({ _type: "span", _key: key(), text: m[2], marks: [def._key] });
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) children.push({ _type: "span", _key: key(), text: text.slice(last), marks: [] });
  return { children, markDefs };
}

async function toPortableText(body: string) {
  const blocks: unknown[] = [];
  for (const chunk of body.trim().split(/\n\s*\n/)) {
    const lines = chunk.trim().split("\n");
    const image = lines[0].match(/^!\[(.+?)\|(.+?)\|(.*)\]$/);
    if (image) {
      const [, file, alt, caption] = image;
      blocks.push({
        _type: "image",
        _key: key(),
        asset: { _type: "reference", _ref: await assetId(file) },
        alt,
        ...(caption ? { caption } : {}),
      });
      continue;
    }
    if (lines.every((l) => l.startsWith("- "))) {
      for (const l of lines) blocks.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, ...inline(l.slice(2)) });
      continue;
    }
    const heading = lines[0].match(/^(#{2,3}) (.+)$/);
    if (heading) {
      blocks.push({ _type: "block", _key: key(), style: heading[1] === "##" ? "h2" : "h3", ...inline(heading[2]) });
      continue;
    }
    blocks.push({ _type: "block", _key: key(), style: "normal", ...inline(lines.join(" ")) });
  }
  return blocks;
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
      body: await toPortableText(p.body),
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
