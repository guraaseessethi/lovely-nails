// Shapes the site renders. Sanity query results are mapped into these in lib/sanity/queries.ts.

export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
  lqip?: string;
  /** CSS object-position from the Sanity hotspot, e.g. "40% 60%" */
  position?: string;
};

export const WORK_CATEGORIES = ["Everyday", "Ombre, French & Chrome", "Party", "Special Occasion", "Theme", "Wedding", "Graduation", "New Year", "Seasonal", "Simple", "Lovely Nails"] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type WorkPhoto = Img & { key: string; category?: WorkCategory; caption?: string };

export type DayHours = { day: string; closed: boolean; open?: string; close?: string };

export type Notice = { text: string } | null;

export type Settings = {
  businessName: string;
  phone?: string; // display form, e.g. (705) 739-8289
  phoneE164?: string; // +17057398289
  email?: string;
  street?: string;
  unit?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  instagram?: string;
  facebook?: string;
  googleUrl?: string;
  googleRating?: number;
  googleReviewCount?: number;
  since?: number;
  logo?: Img;
  instagramExclude: string[];
  instagramHashtag?: string;
};

// Groups from April's 2026 price list, in menu order.
export const SERVICE_GROUPS = ["Natural nails", "Enhancements", "Waxing", "Facials", "Foot massage", "Kids"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

export type Service = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  group: ServiceGroup;
};

export type Review = { id: string; quote: string; name: string; sourceUrl?: string };

export type About = { story?: string; secondParagraph?: string; photo?: Img };

export type Backgrounds = { hero?: Img; clean?: Img; visit?: Img };

export type PostCard = {
  slug: string;
  title: string;
  date?: string;
  tag?: string;
  excerpt?: string;
  cover?: Img;
};

export type SeoEntry = { title?: string; description?: string; image?: Img };
export type PageSeo = Partial<Record<"home" | "services" | "work" | "journal", SeoEntry>>;

export type InstagramPost = Img & { id: string; permalink: string; caption?: string };
