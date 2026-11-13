import { defineField } from "sanity";

export const WORK_CATEGORIES = ["Everyday", "Ombre, French & Chrome", "Party", "Special Occasion", "Theme", "Wedding", "Graduation", "New Year", "Seasonal", "Simple", "Lovely Nails"];

// Must match SERVICE_GROUPS in lib/types.ts.
export const SERVICE_GROUPS = ["Natural nails", "Enhancements", "Waxing", "Facials", "Foot massage", "Kids"];

export const POST_TAGS = ["Nail care", "Aftercare", "Trends", "In the salon", "Pedicures", "Nail art", "Family"];

/** Image with a required alt text field, so nothing reaches the site undescribed. */
export function imageWithAlt(name: string, title: string, opts: { required?: boolean; description?: string; group?: string } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    description: opts.description,
    group: opts.group,
    options: { hotspot: true },
    validation: opts.required ? (rule) => rule.required() : undefined,
    fields: [
      defineField({
        name: "alt",
        title: "Describe the photo",
        type: "string",
        description: "One short sentence for people who can't see it, e.g. \"Glossy red almond gel nails\".",
        validation: (rule) => rule.required().error("Add a short description of the photo."),
      }),
    ],
  });
}

/** Background images are decorative, so alt is optional. */
export function backgroundImage(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
  });
}

/** 30-minute steps from 7:00 to 21:00, stored as "HH:mm". */
export const TIME_OPTIONS = Array.from({ length: 29 }, (_, i) => {
  const minutes = 7 * 60 + i * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const value = `${String(h).padStart(2, "0")}:${m ? "30" : "00"}`;
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return { title: `${hour12}:${m ? "30" : "00"} ${h >= 12 ? "PM" : "AM"}`, value };
});
