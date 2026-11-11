import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";
import { WORK_CATEGORIES } from "./fields";

export const workPhotos = defineType({
  name: "workPhotos",
  title: "Work photos",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description:
        "Drag a batch of photos straight onto this box to upload them all at once. Then click each one to pick its category and describe it. New uploads go to the bottom of this list and show first on the site; drag to change the order.",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              description: "Which filter this photo appears under on the site.",
              options: { list: WORK_CATEGORIES, layout: "radio" },
            }),
            defineField({
              name: "alt",
              title: "Describe the photo",
              type: "string",
              description: "One short sentence, e.g. \"Pale pink ombre on short square nails\".",
              validation: (rule) => rule.required().error("Add a short description of the photo."),
            }),
            defineField({
              name: "caption",
              title: "Caption (optional)",
              type: "string",
              description: "Shown on the photo, e.g. \"Spring florals\".",
              validation: (rule) => rule.max(60),
            }),
          ],
          preview: {
            select: { media: "asset", title: "alt", subtitle: "category" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Work photos" }) },
});
