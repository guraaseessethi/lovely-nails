import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import type { Img } from "../types";

const builder = createImageUrlBuilder({ projectId, dataset });

type Crop = { top: number; bottom: number; left: number; right: number };
type Hotspot = { x: number; y: number };

/** Shape returned by the IMAGE projection in queries. */
export type RawImage = {
  alt?: string;
  crop?: Crop;
  hotspot?: Hotspot;
  asset?: { _id: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
} | null;

/** GROQ projection for any image field. */
export const IMAGE = `{alt, crop, hotspot, "asset": asset->{_id, metadata{lqip, dimensions{width, height}}}}`;

/** Turns a raw Sanity image into what next/image needs. Crop is baked into the URL; hotspot becomes object-position. */
export function toImg(raw: RawImage, fallbackAlt = ""): Img | undefined {
  if (!raw?.asset?._id) return undefined;
  const dims = raw.asset.metadata?.dimensions ?? { width: 1600, height: 1200 };
  const crop = raw.crop ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const width = Math.round(dims.width * (1 - crop.left - crop.right));
  const height = Math.round(dims.height * (1 - crop.top - crop.bottom));
  const src = builder.image({ asset: { _ref: raw.asset._id }, crop: raw.crop, hotspot: raw.hotspot }).url();
  const position = raw.hotspot
    ? `${Math.round(((raw.hotspot.x - crop.left) / (1 - crop.left - crop.right)) * 100)}% ${Math.round(((raw.hotspot.y - crop.top) / (1 - crop.top - crop.bottom)) * 100)}%`
    : undefined;
  return { src, alt: raw.alt ?? fallbackAlt, width, height, lqip: raw.asset.metadata?.lqip, position };
}

/** Fixed-size crop URL, for Open Graph images. */
export function ogImageUrl(img: Img) {
  const url = new URL(img.src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("auto", "format");
  return url.toString();
}
