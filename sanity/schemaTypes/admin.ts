import { CogIcon } from "@sanity/icons/Cog";
import { CommentIcon } from "@sanity/icons/Comment";
import { ImageIcon } from "@sanity/icons/Image";
import { SearchIcon } from "@sanity/icons/Search";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import { backgroundImage, imageWithAlt, SERVICE_GROUPS } from "./fields";

// Admin-only types. Never put secrets here: the dataset is publicly readable.

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "business", title: "Business", default: true },
    { name: "social", title: "Social and Google" },
    { name: "instagram", title: "Instagram feed" },
  ],
  fields: [
    defineField({ name: "businessName", type: "string", group: "business", validation: (r) => r.required() }),
    defineField({ name: "phone", title: "Phone (display)", type: "string", group: "business", placeholder: "(705) 739-8289" }),
    defineField({
      name: "phoneE164",
      title: "Phone (for tap-to-call)",
      type: "string",
      group: "business",
      placeholder: "+17057398289",
      validation: (r) => r.regex(/^\+1\d{10}$/, { name: "E.164" }).error("Use the +1XXXXXXXXXX format."),
    }),
    defineField({ name: "email", type: "string", group: "business", validation: (r) => r.email() }),
    defineField({ name: "street", type: "string", group: "business" }),
    defineField({ name: "unit", type: "string", group: "business" }),
    defineField({ name: "city", type: "string", group: "business" }),
    defineField({ name: "region", title: "Province", type: "string", group: "business" }),
    defineField({ name: "postalCode", type: "string", group: "business" }),
    defineField({ name: "landmark", type: "string", group: "business", description: "e.g. in Barriegate Centre" }),
    defineField({ name: "lat", title: "Latitude", type: "number", group: "business" }),
    defineField({ name: "lng", title: "Longitude", type: "number", group: "business" }),
    defineField({ name: "since", title: "In business since", type: "number", group: "business" }),
    imageWithAlt("logo", "Logo", { group: "business" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url", group: "social" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url", group: "social" }),
    defineField({ name: "googleUrl", title: "Google listing URL", type: "url", group: "social" }),
    defineField({ name: "googleRating", title: "Google rating", type: "number", group: "social", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "googleReviewCount", title: "Google review count", type: "number", group: "social", validation: (r) => r.integer().min(0) }),
    defineField({
      name: "instagramExclude",
      title: "Hide these Instagram posts",
      type: "array",
      group: "instagram",
      description: "Paste the post ID (or the full post link) of anything that shouldn't appear, e.g. hours notices.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "instagramHashtag",
      title: "Only show posts with this hashtag",
      type: "string",
      group: "instagram",
      description: "Optional, e.g. lovelyportfolio (without the #). Leave empty to show every photo post.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const service = defineType({
  name: "service",
  title: "Services",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2 }),
    defineField({ name: "price", title: "Price text", type: "string", description: "e.g. $25 or $50 to $65+. Leave empty to show an [Ask April] marker." }),
    defineField({
      name: "group",
      type: "string",
      options: { list: SERVICE_GROUPS, layout: "radio", direction: "horizontal" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", description: "Lower numbers show first within the group.", initialValue: 10 }),
  ],
  orderings: [
    {
      title: "Group, then order",
      name: "groupOrder",
      by: [
        { field: "group", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", group: "group", price: "price" },
    prepare: ({ title, group, price }) => ({ title, subtitle: [group, price].filter(Boolean).join(" · ") }),
  },
});

export const review = defineType({
  name: "review",
  title: "Reviews",
  type: "document",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 5,
      description: "Copied word for word from Google.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "First name and last initial",
      description: "Just the first name is fine if that's all Google shows.",
      type: "string",
      placeholder: "Tegan S.",
      validation: (r) => r.required().regex(/^[^\s]+( [A-Z]\.)?$/).error('Use "First L." or just the first name.'),
    }),
    defineField({ name: "sourceUrl", title: "Link to the review", type: "url" }),
    defineField({
      name: "show",
      title: "Show on the site",
      type: "boolean",
      description: "Only turn on once April has approved this review.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", quote: "quote", show: "show" },
    prepare: ({ title, quote, show }) => ({
      title: `${title ?? "Unnamed"}${show ? "" : " (hidden)"}`,
      subtitle: quote,
    }),
  },
});

export const about = defineType({
  name: "about",
  title: "About April",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "story", title: "April's story", type: "text", rows: 4, description: "2 to 3 lines in her own words. Leave empty to show an [Ask April] marker." }),
    defineField({ name: "secondParagraph", title: "Second paragraph", type: "text", rows: 3 }),
    imageWithAlt("photo", "Photo"),
  ],
  preview: { prepare: () => ({ title: "About April" }) },
});

const seoEntry = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    options: { collapsible: true, collapsed: false },
    fields: [
      defineField({ name: "title", type: "string", validation: (r) => r.max(65).warning("Keep under ~60 characters.") }),
      defineField({ name: "description", type: "text", rows: 2, validation: (r) => r.max(160).warning("Keep under ~155 characters.") }),
      backgroundImage("image", "Social share image", "1200 × 630 works best. Falls back to the hero photo."),
    ],
  });

export const pageSeo = defineType({
  name: "pageSeo",
  title: "Page SEO",
  type: "document",
  icon: SearchIcon,
  fields: [
    seoEntry("home", "Home"),
    seoEntry("services", "Services page"),
    seoEntry("work", "Work page"),
    seoEntry("journal", "Journal page"),
  ],
  preview: { prepare: () => ({ title: "Page SEO" }) },
});

export const backgrounds = defineType({
  name: "backgrounds",
  title: "Section backgrounds",
  type: "document",
  icon: ImageIcon,
  fields: [
    backgroundImage("hero", "Hero", "Full-screen photo behind the headline. Wide, at least 2400px."),
    backgroundImage("clean", "Clean. Always. band", "Clean stations or the polish wall."),
    backgroundImage("visit", "Visit section", "Optional photo shown faintly behind the hours card."),
  ],
  preview: { prepare: () => ({ title: "Section backgrounds" }) },
});
