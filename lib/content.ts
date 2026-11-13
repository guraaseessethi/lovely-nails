// Data access for the site. Every read is cached indefinitely and tagged by
// document type; the Sanity webhook (/api/revalidate) expires the right tag.
import { cacheLife, cacheTag } from "next/cache";
import type { PortableTextBlock } from "next-sanity";
import { client } from "./sanity/client";
import { IMAGE, type RawImage, toImg } from "./sanity/image";
import {
  SERVICE_GROUPS,
  WORK_CATEGORIES,
  type About,
  type Backgrounds,
  type DayHours,
  type Notice,
  type PageSeo,
  type PostCard,
  type Review,
  type Service,
  type Settings,
  type WorkCategory,
  type WorkPhoto,
} from "./types";

async function query<T>(groq: string, params: Record<string, string> = {}, tags: string[]): Promise<T> {
  "use cache";
  cacheLife("max");
  cacheTag(...tags);
  return client.fetch<T>(groq, params);
}

export async function getSettings(): Promise<Settings> {
  const raw = await query<(Omit<Settings, "logo" | "instagramExclude"> & { logo: RawImage; instagramExclude?: string[] }) | null>(
    `*[_id == "siteSettings"][0]{..., logo${IMAGE}}`,
    {},
    ["siteSettings"],
  );
  return {
    ...raw,
    businessName: raw?.businessName ?? "Lovely Nails Spa",
    logo: toImg(raw?.logo ?? null, "Lovely Nails Spa logo"),
    instagramExclude: raw?.instagramExclude ?? [],
  };
}

type HoursDoc = { days?: DayHours[]; notice?: { enabled?: boolean; text?: string; endDate?: string } } | null;

export async function getHours(): Promise<DayHours[]> {
  const doc = await query<HoursDoc>(`*[_id == "hours"][0]{days[]{day, closed, open, close}}`, {}, ["hours"]);
  return doc?.days ?? [];
}

/** The announcement banner. Re-checked hourly so it disappears on its own after its end date. */
export async function getNotice(): Promise<Notice> {
  "use cache";
  cacheLife("hours");
  cacheTag("hours");
  const doc = await client.fetch<HoursDoc>(`*[_id == "hours"][0]{notice}`);
  const n = doc?.notice;
  if (!n?.enabled || !n.text) return null;
  if (n.endDate) {
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto" }).format(new Date());
    if (today > n.endDate) return null;
  }
  return { text: n.text };
}


export async function getServices(): Promise<Service[]> {
  const rows = await query<(Service & { order?: number })[]>(
    `*[_type == "service"]{"id": _id, name, description, price, group, order}`,
    {},
    ["service"],
  );
  return rows.sort(
    (a, b) => SERVICE_GROUPS.indexOf(a.group) - SERVICE_GROUPS.indexOf(b.group) || (a.order ?? 99) - (b.order ?? 99),
  );
}

export async function getReviews(): Promise<Review[]> {
  return query<Review[]>(
    `*[_type == "review" && show == true] | order(_createdAt asc){"id": _id, quote, name, sourceUrl}`,
    {},
    ["review"],
  );
}

export async function getAbout(): Promise<About> {
  const raw = await query<{ story?: string; secondParagraph?: string; photo: RawImage } | null>(
    `*[_id == "about"][0]{story, secondParagraph, photo${IMAGE}}`,
    {},
    ["about"],
  );
  return { story: raw?.story, secondParagraph: raw?.secondParagraph, photo: toImg(raw?.photo ?? null) };
}

export async function getBackgrounds(): Promise<Backgrounds> {
  const raw = await query<Record<"hero" | "clean" | "visit", RawImage> | null>(
    `*[_id == "backgrounds"][0]{hero${IMAGE}, clean${IMAGE}, visit${IMAGE}}`,
    {},
    ["backgrounds"],
  );
  return { hero: toImg(raw?.hero ?? null), clean: toImg(raw?.clean ?? null), visit: toImg(raw?.visit ?? null) };
}

export async function getPageSeo(): Promise<PageSeo> {
  type RawEntry = { title?: string; description?: string; image: RawImage } | null;
  const raw = await query<Record<keyof PageSeo, RawEntry> | null>(
    `*[_id == "pageSeo"][0]{
      "home": home{title, description, image${IMAGE}},
      "services": services{title, description, image${IMAGE}},
      "work": work{title, description, image${IMAGE}},
      "journal": journal{title, description, image${IMAGE}}
    }`,
    {},
    ["pageSeo"],
  );
  const out: PageSeo = {};
  for (const key of ["home", "services", "work", "journal"] as const) {
    const e = raw?.[key];
    if (e) out[key] = { title: e.title, description: e.description, image: toImg(e.image) };
  }
  return out;
}

/**
 * Newest first: new uploads are added to the end of the list in the Studio, so the
 * site shows the list bottom-up. April can drag photos to change the order.
 */
export async function getWorkPhotos(): Promise<WorkPhoto[]> {
  type Raw = NonNullable<RawImage> & { _key: string; category?: string; caption?: string };
  const rows = await query<Raw[] | null>(
    `*[_id == "workPhotos"][0].photos[]{_key, category, caption, alt, crop, hotspot,
      "asset": asset->{_id, metadata{lqip, dimensions{width, height}}}}`,
    {},
    ["workPhotos"],
  );
  return [...(rows ?? [])].reverse().flatMap((r) => {
    const img = toImg(r, "Nails by Lovely Nails Spa");
    if (!img) return [];
    const category = WORK_CATEGORIES.includes(r.category as WorkCategory) ? (r.category as WorkCategory) : undefined;
    return [{ ...img, key: r._key, category, caption: r.caption }];
  });
}

const POST_CARD = `"slug": slug.current, title, date, tag, excerpt, "cover": coverImage${IMAGE}`;
type RawCard = Omit<PostCard, "cover"> & { cover: RawImage };
const toCard = (p: RawCard): PostCard => ({ ...p, cover: toImg(p.cover, p.title) });

export async function getPosts(): Promise<PostCard[]> {
  const rows = await query<RawCard[]>(
    `*[_type == "post" && defined(slug.current)] | order(date desc, _createdAt desc){${POST_CARD}}`,
    {},
    ["post"],
  );
  return rows.map(toCard);
}

export async function hasPublishedPosts() {
  return (await getPosts()).length > 0;
}

export type Post = PostCard & {
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
};

export async function getPost(slug: string): Promise<Post | null> {
  const raw = await query<(RawCard & Omit<Post, keyof PostCard>) | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      ${POST_CARD}, seoTitle, seoDescription, "updatedAt": _updatedAt,
      body[]{..., _type == "image" => {alt, caption, crop, hotspot, "asset": asset->{_id, metadata{lqip, dimensions{width, height}}}}}
    }`,
    { slug },
    ["post"],
  );
  return raw ? { ...toCard(raw), body: raw.body ?? [], seoTitle: raw.seoTitle, seoDescription: raw.seoDescription, updatedAt: raw.updatedAt } : null;
}

export async function getYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
