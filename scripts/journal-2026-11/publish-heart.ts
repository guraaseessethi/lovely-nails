/**
 * Publishes the draft of April's letter (see heart-post.ts): copies the draft to the published
 * document and removes the draft, the same as pressing Publish in the Studio.
 *
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/publish-heart.ts
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" });
const ID = "post-the-heart-behind-lovely-nails";

async function main() {
  const draft = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, { id: `drafts.${ID}` });
  if (!draft) {
    const live = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: ID });
    console.log(live ? `${ID} is already published.` : `No draft or published post found for ${ID}.`);
    return;
  }
  const { _rev, _updatedAt, _createdAt, ...doc } = draft;
  await client.transaction().createOrReplace({ ...doc, _id: ID, _type: "post" }).delete(`drafts.${ID}`).commit();
  console.log(`Published ${ID}`);
}

main().catch((err) => {
  console.error("Publish failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
