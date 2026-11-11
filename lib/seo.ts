import type { Metadata } from "next";
import type { Post } from "./content";
import { getBackgrounds, getPageSeo } from "./content";
import { ogImageUrl } from "./sanity/image";
import type { Img, PageSeo } from "./types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lovelynailsbarrie.com").replace(/\/$/, "");
export const SITE_NAME = "Lovely Nails Spa";

// Fallbacks from the content plan, used until Page SEO is filled in Sanity.
// Prices stay out of these until April confirms them.
const DEFAULTS: Record<keyof PageSeo, { title: string; description: string; path: string }> = {
  home: {
    title: "Lovely Nails Spa | Nail Salon in Barrie on Burton Ave",
    description:
      "Family nail spa in Barrie since 2008. Gel, shellac, nail art and pedicures in a clean, friendly salon. Walk-ins welcome.",
    path: "/",
  },
  services: {
    title: "Manicures, Pedicures and Gel Nails in Barrie | Lovely Nails Spa",
    description: "Manicures, pedicures, CND Shellac, Solar gel and nail art in Barrie. See the full menu and call to book.",
    path: "/services",
  },
  work: {
    title: "Nail Art and Gel Nail Photos | Lovely Nails Spa Barrie",
    description: "Real sets from our Burton Ave salon: gel, shellac, ombre, nail art and pedicures.",
    path: "/work",
  },
  journal: {
    title: "Nail Care Tips from Our Barrie Salon | Lovely Nails Spa",
    description: "Aftercare, trends and salon news from April and the team.",
    path: "/journal",
  },
};

function build({ title, description, path, image, type = "website" }: {
  title: string;
  description: string;
  path: string;
  image?: Img;
  type?: "website" | "article";
}): Metadata {
  const images = image ? [{ url: ogImageUrl(image), width: 1200, height: 630, alt: image.alt || title }] : undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, locale: "en_CA", type, images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images: images?.map((i) => i.url) },
  };
}

export async function pageMetadata(key: keyof PageSeo): Promise<Metadata> {
  const [seo, backgrounds] = await Promise.all([getPageSeo(), getBackgrounds()]);
  const d = DEFAULTS[key];
  const entry = seo[key];
  return build({
    title: entry?.title || d.title,
    description: entry?.description || d.description,
    path: d.path,
    image: entry?.image ?? seo.home?.image ?? backgrounds.hero,
  });
}

export function postMetadata(post: Post): Metadata {
  const title = post.seoTitle || `${post.title} | ${SITE_NAME}`;
  const meta = build({
    title,
    description: post.seoDescription || post.excerpt || DEFAULTS.journal.description,
    path: `/journal/${post.slug}`,
    image: post.cover,
    type: "article",
  });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.date, modifiedTime: post.updatedAt },
  };
}
