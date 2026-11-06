import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// useCdn is off on purpose: results are cached by Next.js and refreshed by the
// Sanity webhook, so reads must never come from a stale API CDN edge.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
