/**
 * April's letter "The Heart Behind Lovely Nails" (16 Nov 2026), in full, as a Journal post.
 * Created as a DRAFT: April approves it by pressing Publish in the Studio. The homepage's
 * "Meet the owner" section links to it once it's published.
 *
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/heart-post.ts
 *
 * Her words unchanged apart from typos: "stared" -> "started", "Lovely Nail" -> "Lovely Nails",
 * 2028 -> 2008, "part our" -> "part of our", "Heart" -> "heart".
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";
import { toPortableText } from "./portable-text";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const HEART_SLUG = "the-heart-behind-lovely-nails";
const ID = `post-${HEART_SLUG}`;

const body = `
When I started Lovely Nails in 2008, I began with a simple belief: build genuine connections, one client and one appointment at a time.

Over the years, those appointments became more than nail services. Clients became familiar faces, friendships, and part of our extended family in the community. We have welcomed generations of families, parents bringing their children, daughters bringing their mothers and fathers, and couples coming together. These relationships have grown into years of trust, loyalty, and shared memories.

I have always believed that people may forget what you did for them, but they will remember how you made them feel. That is the feeling I have always wanted every client to take with them when they leave Lovely Nails.

Equally important to me was creating a workplace where our nail technicians feel respected, valued, and proud of what they do. One of my favourite philosophies is simple: Take care of your employees, and they will take care of the clients. I believe that when people feel supported and appreciated, they naturally bring that same care and kindness to others.

Looking back, I feel incredibly grateful for every client who has walked through our doors and every team member who has been part of this journey. Lovely Nails has grown through relationships, not just appointments, and that will always be the heart of our business.

**April Thu Hoegy**, the founder of Lovely Nails Spa
`;

async function assetId(file: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $file] | order(_createdAt desc)[0]._id`,
    { file },
  );
  if (!id) throw new Error(`No image in Sanity named ${file}`);
  return id;
}

async function main() {
  const published = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: ID });
  if (published) {
    console.log(`${ID} is already published; leaving it alone.`);
    return;
  }
  await client.createOrReplace({
    _id: `drafts.${ID}`,
    _type: "post",
    title: "The Heart Behind Lovely Nails",
    slug: { _type: "slug", current: HEART_SLUG },
    date: "2026-11-16",
    tag: "In the salon",
    excerpt:
      "April on why she started Lovely Nails in 2008, the families who have become part of it, and why taking care of her team means taking care of you.",
    seoTitle: "The Heart Behind Lovely Nails | Lovely Nails Spa Barrie",
    seoDescription:
      "A letter from April Thu Hoegy, founder of Lovely Nails Spa in Barrie, on genuine connections, generations of families and caring for her team.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: await assetId("april-front-desk.jpg") },
      alt: "April, founder of Lovely Nails Spa, at the salon's front desk",
      hotspot: { _type: "sanity.imageHotspot", x: 0.55, y: 0.4, width: 0.6, height: 0.6 },
    },
    body: await toPortableText(body, assetId),
  });
  console.log(`Draft saved: drafts.${ID}`);
}

main().catch((err) => {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
