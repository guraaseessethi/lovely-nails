/**
 * April's story for the "Meet the owner" section, from her document "The Heart Behind Lovely Nails"
 * (16 Nov 2026). Her own sentences, typos fixed ("stared" -> "started", 2028 -> 2008).
 *
 *   npx tsx --env-file=.env.local scripts/about-story-2026-11-16.ts
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const story =
  "When I started Lovely Nails in 2008, I began with a simple belief: build genuine connections, one client and one appointment at a time. I have always believed that people may forget what you did for them, but they will remember how you made them feel. That is the feeling I want every client to take with them when they leave.";

const secondParagraph =
  "Over the years, clients became familiar faces, friendships and part of our extended family in the community. We have welcomed generations of families: parents bringing their children, daughters bringing their mothers and fathers, and couples coming together. Lovely Nails has grown through relationships, not just appointments, and that will always be the heart of our business.";

client
  .patch("about")
  .set({ story, secondParagraph })
  .commit()
  .then(() => console.log("Updated about"))
  .catch((err) => {
    console.error("Update failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
