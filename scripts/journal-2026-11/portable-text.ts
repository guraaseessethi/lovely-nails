// Converts the simple post format in posts.ts to Sanity Portable Text.
// "## " heading, "### " small heading, "- " bullet, blank line between paragraphs,
// **bold**, [link](url), and "![file|alt|caption]" for a photo already in Sanity.
import { randomUUID } from "node:crypto";

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };

/** Inline **bold** and [text](url) -> spans and link mark definitions. */
function inline(text: string) {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) children.push({ _type: "span", _key: key(), text: text.slice(last, m.index), marks: [] });
    if (m[1]) {
      children.push({ _type: "span", _key: key(), text: m[1], marks: ["strong"] });
    } else {
      const def: MarkDef = { _type: "link", _key: key(), href: m[3] };
      markDefs.push(def);
      // Bold inside a link, e.g. [**(705) 739-8289**](tel:...), isn't used, so links stay plain.
      children.push({ _type: "span", _key: key(), text: m[2], marks: [def._key] });
    }
    last = m.index! + m[0].length;
  }
  if (last < text.length) children.push({ _type: "span", _key: key(), text: text.slice(last), marks: [] });
  return { children, markDefs };
}

export async function toPortableText(body: string, assetId: (file: string) => Promise<string>) {
  const blocks: unknown[] = [];
  for (const chunk of body.trim().split(/\n\s*\n/)) {
    const lines = chunk.trim().split("\n");
    const image = lines[0].match(/^!\[(.+?)\|(.+?)\|(.*)\]$/);
    if (image) {
      const [, file, alt, caption] = image;
      blocks.push({
        _type: "image",
        _key: key(),
        asset: { _type: "reference", _ref: await assetId(file) },
        alt,
        ...(caption ? { caption } : {}),
      });
      continue;
    }
    if (lines.every((l) => l.startsWith("- "))) {
      for (const l of lines) blocks.push({ _type: "block", _key: key(), style: "normal", listItem: "bullet", level: 1, ...inline(l.slice(2)) });
      continue;
    }
    const heading = lines[0].match(/^(#{2,3}) (.+)$/);
    if (heading) {
      blocks.push({ _type: "block", _key: key(), style: heading[1] === "##" ? "h2" : "h3", ...inline(heading[2]) });
      continue;
    }
    blocks.push({ _type: "block", _key: key(), style: "normal", ...inline(lines.join(" ")) });
  }
  return blocks;
}
