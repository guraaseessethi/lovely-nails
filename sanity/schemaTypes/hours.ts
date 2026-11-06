import { ClockIcon } from "@sanity/icons/Clock";
import { defineArrayMember, defineField, defineType } from "sanity";
import { TIME_OPTIONS } from "./fields";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const hours = defineType({
  name: "hours",
  title: "Hours and notices",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "days",
      title: "Weekly hours",
      type: "array",
      description: "One row per day. Tick Closed for days off.",
      validation: (rule) => rule.length(7).error("Keep exactly one row for each day of the week."),
      of: [
        defineArrayMember({
          type: "object",
          name: "dayHours",
          fields: [
            defineField({ name: "day", title: "Day", type: "string", readOnly: true, options: { list: DAYS } }),
            defineField({ name: "closed", title: "Closed", type: "boolean", initialValue: false }),
            defineField({
              name: "open",
              title: "Opens",
              type: "string",
              options: { list: TIME_OPTIONS },
              hidden: ({ parent }) => Boolean(parent?.closed),
              validation: (rule) =>
                rule.custom((value, ctx) => {
                  const parent = ctx.parent as { closed?: boolean } | undefined;
                  return parent?.closed || value ? true : "Pick an opening time or tick Closed.";
                }),
            }),
            defineField({
              name: "close",
              title: "Closes",
              type: "string",
              options: { list: TIME_OPTIONS },
              hidden: ({ parent }) => Boolean(parent?.closed),
              validation: (rule) =>
                rule.custom((value, ctx) => {
                  const parent = ctx.parent as { closed?: boolean; open?: string } | undefined;
                  if (parent?.closed) return true;
                  if (!value) return "Pick a closing time or tick Closed.";
                  return parent?.open && value <= parent.open ? "Closing time must be after opening time." : true;
                }),
            }),
          ],
          preview: {
            select: { day: "day", closed: "closed", open: "open", close: "close" },
            prepare: ({ day, closed, open, close }) => ({
              title: day,
              subtitle: closed ? "Closed" : [open, close].filter(Boolean).join(" to "),
            }),
          },
        }),
      ],
      initialValue: DAYS.map((day) => ({ _type: "dayHours", day, closed: day === "Sunday" })),
    }),
    defineField({
      name: "notice",
      title: "Announcement banner",
      type: "object",
      description: "A short message across the top of the homepage, e.g. holiday hours.",
      options: { collapsible: false },
      fields: [
        defineField({ name: "enabled", title: "Show the banner", type: "boolean", initialValue: false }),
        defineField({
          name: "text",
          title: "Message",
          type: "string",
          validation: (rule) =>
            rule.max(140).custom((value, ctx) => {
              const parent = ctx.parent as { enabled?: boolean } | undefined;
              return parent?.enabled && !value ? "Write a message, or turn the banner off." : true;
            }),
        }),
        defineField({
          name: "endDate",
          title: "Hide it after",
          type: "date",
          description: "Optional. The banner disappears on its own after this day.",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Hours and notices" }) },
});
