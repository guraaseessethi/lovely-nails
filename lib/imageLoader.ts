import type { ImageLoaderProps } from "next/image";

// Sanity's image CDN resizes and converts formats itself, so next/image only
// has to ask for the right width. Anything else is served as given.
export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
