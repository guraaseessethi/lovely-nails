import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, POST_TAGS } from "./fields";

export const post = defineType({
  name: "post",
  title: "Journal",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "post", title: "Post", default: true },
    { name: "seo", title: "Google (optional)" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "post",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "post",
      description: "Click Generate after writing the title.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    imageWithAlt("coverImage", "Cover photo", { required: true, group: "post" }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      group: "post",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tag",
      title: "Topic",
      type: "string",
      group: "post",
      options: { list: POST_TAGS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "post",
      description: "One or two sentences shown on the post card. Up to 200 characters.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Post",
      type: "array",
      group: "post",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Small heading", value: "h3" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbers", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                icon: LinkIcon,
                fields: [
                  defineField({
                    name: "href",
                    title: "Web address",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Describe the photo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption (optional)", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "Google title",
      type: "string",
      group: "seo",
      description: "Leave empty to use the post title.",
      validation: (rule) => rule.max(65).warning("Google cuts titles off after about 60 characters."),
    }),
    defineField({
      name: "seoDescription",
      title: "Google description",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Leave empty to use the short summary.",
      validation: (rule) => rule.max(160).warning("Google cuts descriptions off after about 155 characters."),
    }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "date", media: "coverImage", tag: "tag" },
    prepare: ({ title, date, media, tag }) => ({ title, subtitle: [tag, date].filter(Boolean).join(" · "), media }),
  },
});
