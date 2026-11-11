/**
 * One-off seed: uploads the photos and creates every document from the content plan.
 *
 *   npm run seed            create documents that don't exist yet (safe to re-run)
 *   npm run seed -- --force replace them all (overwrites edits made in the Studio)
 *
 * Reads SANITY_API_WRITE_TOKEN from .env.local. The token is never printed.
 * Photos are read from PHOTOS_DIR (default: ../photos, outside the repo).
 */
import { createReadStream, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}

const FORCE = process.argv.includes("--force");
const PHOTOS = resolve(process.env.PHOTOS_DIR ?? "../photos");
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
const today = new Date().toISOString().slice(0, 10);

const uploaded = new Map<string, string>();
async function upload(relPath: string): Promise<string> {
  const file = join(PHOTOS, relPath);
  if (!existsSync(file)) throw new Error(`Missing photo: ${file}`);
  const cached = uploaded.get(file);
  if (cached) return cached;
  // Sanity de-duplicates by content hash, so re-running doesn't create copies.
  const asset = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  console.log(`  uploaded ${relPath}`);
  uploaded.set(file, asset._id);
  return asset._id;
}

async function image(relPath: string, alt?: string, extra: Record<string, unknown> = {}) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: await upload(relPath) },
    ...(alt ? { alt } : {}),
    ...extra,
  };
}

const block = (text: string, style = "normal") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function save(doc: { _id: string; _type: string; [field: string]: unknown }) {
  if (FORCE) await client.createOrReplace(doc);
  else await client.createIfNotExists(doc);
  console.log(`  ${FORCE ? "wrote" : "ensured"} ${doc._id}`);
}

const GOOGLE_URL = "https://www.google.com/maps/place/Lovely+Nails+Spa/@44.3699919,-79.6735421,17z";

async function main() {
  console.log(`Seeding ${projectId}/${dataset}${FORCE ? " (force)" : ""} from ${PHOTOS}`);

  console.log("Site settings");
  await save({
    _id: "siteSettings",
    _type: "siteSettings",
    businessName: "Lovely Nails Spa",
    phone: "(705) 739-8289",
    phoneE164: "+17057398289",
    email: "info@lovelynailsbarrie.com",
    street: "274 Burton Ave",
    unit: "Unit 11",
    city: "Barrie",
    region: "ON",
    postalCode: "L4N 5W4",
    landmark: "In Barriegate Centre",
    lat: 44.3699919,
    lng: -79.6735421,
    since: 2008,
    logo: await image("from-old-site/logo-transparent.png", "Lovely Nails Spa logo"),
    instagram: "https://www.instagram.com/lovelynailsspabarrie/",
    facebook: "https://www.facebook.com/lovely.nailsbarrie",
    googleUrl: GOOGLE_URL,
    googleRating: 4.7,
    googleReviewCount: 328,
    instagramExclude: [],
  });

  console.log("Hours and notices (Google's hours)");
  const day = (d: string, open?: string, close?: string) => ({
    _type: "dayHours",
    _key: d.toLowerCase(),
    day: d,
    closed: !open,
    ...(open ? { open, close } : {}),
  });
  await save({
    _id: "hours",
    _type: "hours",
    days: [
      ...["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => day(d, "10:00", "19:00")),
      day("Saturday", "10:00", "16:00"),
      day("Sunday"),
    ],
    notice: { enabled: false },
  });

  console.log("Services (2018 prices, waiting on April's OK)");
  const services: [string, string, string, string | undefined, string][] = [
    // id, group, name, price, description
    ["manicure", "Nails", "Manicure", "From $25", "Polish removal, shaping, cuticles, hand massage and polish. $40 with CND Shellac or Bio Seaweed Gel."],
    ["artificial-nails", "Nails", "Artificial nails", "$50 to $65+", "CND Solar or Bio-Gel. Tips and overlays on natural nails."],
    ["full-sets-fills", "Nails", "Full sets and fills", undefined, ""],
    ["ombre", "Nails", "Ombre nails", undefined, ""],
    ["nail-art", "Nails", "Nail art", undefined, "Bring a photo of the design you like."],
    ["pedicure", "Pedicure", "Pedicure", "From $40", "Polish removal, shaping, cuticles, callus removal, sugar scrub, foot massage and polish. $55 with CND Shellac or Bio Seaweed Gel."],
    ["foot-massage", "Pedicure", "Foot massage", undefined, ""],
    ["classic-facial", "Skin", "Classic facial (60 min)", "$95", "Cleanse, tone, skin assessment, exfoliation, two electrotherapy treatments, massage and mask."],
    ["specialized-facial", "Skin", "Acne, anti-aging, lymphatic or cupping facial (75 min)", "$110", "A specialized treatment plus the classic facial steps."],
    ["microdermabrasion", "Skin", "Microdermabrasion (40 min)", "$75", "Cleanse, tone, exfoliate, microdermabrasion and mask."],
    ["microdermabrasion-facial", "Skin", "Microdermabrasion with full facial (75 min)", "$110", "Adds ultrasound, iontophoresis, massage and a rubber mask."],
    ["waxing", "Waxing", "Waxing", "$7 to $50+", "Face, back, chest, arms, legs, bikini and Brazilian."],
  ];
  for (const [i, [id, group, name, price, description]] of services.entries()) {
    await save({
      _id: `service-${id}`,
      _type: "service",
      name,
      group,
      order: (i + 1) * 10,
      ...(price ? { price } : {}),
      ...(description ? { description } : {}),
    });
  }

  console.log("Reviews (hidden until April approves the exact wording)");
  const reviews: [string, string][] = [
    ["tegan-s", "Tegan S."],
    ["eva-s", "Eva S."],
    ["mackenzie-m", "Mackenzie M."],
    ["celeste-r", "Celeste R."],
    ["melissa-v", "Melissa V."],
  ];
  for (const [id, name] of reviews) {
    await save({
      _id: `review-${id}`,
      _type: "review",
      name,
      quote: `[Paste ${name}'s Google review here, word for word, once April approves it.]`,
      sourceUrl: GOOGLE_URL,
      show: false,
    });
  }

  console.log("About April");
  await save({
    _id: "about",
    _type: "about",
    // story stays empty on purpose: the site shows an [Ask April] marker until she provides it.
    secondParagraph:
      "Lifelong regulars, families who bring their kids, seniors who feel looked after. That's the salon April has built on Burton Ave since 2008, one appointment at a time.",
    photo: await image(
      "stock/about-tech-painting-nails_unsplash-giorgio-trovato.jpg",
      "A nail technician painting a client's nails",
    ),
  });

  console.log("Section backgrounds");
  await save({
    _id: "backgrounds",
    _type: "backgrounds",
    hero: await image("stock/hero-salon-interior_pexels-alec-adriano.jpg"),
    clean: await image("stock/polish-wall_unsplash-h-co.jpg"),
    visit: await image("stock/pexels-gabrielpuyen-6135677.jpg"),
  });

  console.log("Page SEO (prices left out until April confirms them)");
  await save({
    _id: "pageSeo",
    _type: "pageSeo",
    home: {
      title: "Lovely Nails Spa | Nail Salon in Barrie on Burton Ave",
      description:
        "Family nail spa in Barrie since 2008. Gel, shellac, nail art and pedicures in a clean, friendly salon. Walk-ins welcome.",
    },
    services: {
      title: "Manicures, Pedicures and Gel Nails in Barrie | Lovely Nails Spa",
      description: "Manicures, pedicures, CND Shellac, Solar gel and nail art in Barrie. See the full menu and call to book.",
    },
    work: {
      title: "Nail Art and Gel Nail Photos | Lovely Nails Spa Barrie",
      description: "Real sets from our Burton Ave salon: gel, shellac, ombre, nail art and pedicures.",
    },
    journal: {
      title: "Nail Care Tips from Our Barrie Salon | Lovely Nails Spa",
      description: "Aftercare, trends and salon news from April and the team.",
    },
  });

  console.log("Work photos");
  // Listed in the order the site shows them. The site shows the Studio list bottom-up
  // (newest uploads first), so the array is reversed before saving.
  const work: [string, string, string][] = [
    // file, category, alt. Categories are April's list (Nov 2026); she can change any of them in the Studio.
    ["from-april/ombre-orange-pink-almond.jpg", "Party", "Orange to hot pink ombre on almond nails"],
    ["from-april/milky-white-gold-flake.jpg", "Special Occasion", "Milky white gel with gold flakes on oval nails"],
    ["from-april/french-tips-almond.jpg", "Wedding", "Classic white French tips on almond nails"],
    ["from-april/sheer-pink-square.jpg", "Simple", "Sheer pink on long square nails"],
    ["from-april/lavender-short-gel.jpg", "Everyday", "Pastel lavender gel on short rounded nails"],
    ["from-old-site/old-site-ALE9798.jpg", "Wedding", "Pedicure with white-tipped toes resting on a towel beside a yellow rose"],
    ["from-old-site/old-site-ALE9757.jpg", "Special Occasion", "Pink-to-white ombre on long almond nails"],
    ["from-old-site/old-site-ALE9741.jpg", "Party", "Deep burgundy polish on long almond nails"],
    ["from-old-site/old-site-ALE9754.jpg", "Simple", "Sheer pink polish on natural nails"],
    ["from-old-site/old-site-ALE9762.jpg", "Simple", "Short natural nails holding a yellow rose"],
    ["from-old-site/old-site-ALE9767.jpg", "Everyday", "Burgundy polish on short nails, hands crossed"],
    ["from-old-site/old-site-ALE9771.jpg", "Simple", "Pale neutral polish on long tapered nails"],
    ["from-old-site/old-site-ALE9780.jpg", "Everyday", "Light blue polish on almond nails"],
    ["from-old-site/old-site-ALE9782.jpg", "Everyday", "Coral pink polish with a white accent nail"],
    ["from-old-site/old-site-ALE9784.jpg", "Seasonal", "Pastel blue and pink polish beside two roses"],
    ["from-old-site/old-site-ALE9789.jpg", "Lovely Nails", "Four hands showing four different polish colours"],
    ["from-old-site/old-site-ALE9793.jpg", "Everyday", "Charcoal polish on short almond nails"],
    ["stock/gallery-gel-tortoiseshell_unsplash-bryony-elena.jpg", "Theme", "Tortoiseshell gel nails"],
    ["stock/gallery-natural-nude_unsplash-chelson-tamares.jpg", "Simple", "Nude polish on natural nails"],
  ];

  const photos = [];
  for (const [file, category, alt] of work) {
    photos.push({ _key: key(), ...(await image(file, alt, { category })) });
  }
  await save({ _id: "workPhotos", _type: "workPhotos", photos: photos.reverse() });

  console.log("Journal drafts (not published: April shapes each one first)");
  const posts: [string, string, string, string, string, string][] = [
    // slug, title, tag, cover, built from, search term
    ["nail-extension-aftercare", "Aftercare for your nail extensions: the do's and don'ts", "Aftercare", "stock/gallery-gel-tortoiseshell_unsplash-bryony-elena.jpg", "her \"Art of Aftercare\" Instagram guide", "nail extension aftercare"],
    ["why-your-nail-tech-asks-questions", "Why your nail tech asks so many questions", "In the salon", "stock/pexels-artempodrez-4783332.jpg", "her Instagram post on the same topic", "gel nails last longer"],
    ["shellac-bio-seaweed-or-regular-polish", "Shellac, Bio Seaweed or regular polish: which to pick", "Nail care", "stock/pexels-polina-tankilevitch-3735653.jpg", "the polish choices on her old menu", "shellac vs gel Barrie"],
    ["whats-included-in-our-pedicure", "What's included in our pedicure", "Pedicures", "stock/pexels-rdne-7755558.jpg", "the old services list (callus care, sugar scrub, massage)", "pedicure Barrie"],
    ["bring-your-mom-or-kids-for-a-nail-day", "Bringing your mom (or your kids) for a nail day", "Family", "stock/blog-kids-manicure_unsplash-pablo-escobar.jpg", "the family theme in 14 recent Google reviews", "family nail salon Barrie"],
    ["how-we-keep-the-salon-clean", "How we keep the salon clean between clients", "In the salon", "stock/blog-clean-tools_unsplash-ksenia-pixelesse.jpg", "the clean theme in 20 recent Google reviews", "clean nail salon Barrie"],
  ];
  const coverAlt: Record<string, string> = {
    "stock/gallery-gel-tortoiseshell_unsplash-bryony-elena.jpg": "Tortoiseshell gel nails",
    "stock/pexels-artempodrez-4783332.jpg": "A technician in black gloves working on a client's hand under a nail lamp",
    "stock/pexels-polina-tankilevitch-3735653.jpg": "A fan of nail polish colour swatches",
    "stock/pexels-rdne-7755558.jpg": "A technician giving a client a pedicure",
    "stock/blog-kids-manicure_unsplash-pablo-escobar.jpg": "A child's hands getting a manicure",
    "stock/blog-clean-tools_unsplash-ksenia-pixelesse.jpg": "Clean nail tools laid out on a towel",
  };
  for (const [slug, title, tag, cover, from, term] of posts) {
    await save({
      _id: `drafts.post-${slug}`,
      _type: "post",
      title,
      slug: { _type: "slug", current: slug },
      tag,
      date: today,
      coverImage: await image(cover, coverAlt[cover]),
      body: [
        block("Draft outline, not published"),
        block(`Built from: ${from}. Search term it targets: ${term}.`),
        block("[Ask April: a few bullet points or a voice note on this topic. Kooht Studio will shape it into the post.]"),
      ],
    });
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
