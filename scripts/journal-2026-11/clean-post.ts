/**
 * Writes the body of the already-published "How we keep the salon clean between clients" post,
 * which until now held only the placeholder outline. Patches the post in place: title, slug,
 * date, tag and cover stay as they are.
 *
 *   npx tsx --env-file=.env.local scripts/journal-2026-11/clean-post.ts
 *
 * Facts come from April's "Our Standards of Care, Cleanliness & Safety" document (Nov 2026);
 * the checklist for any salon follows the American Academy of Dermatology's safety tips.
 */
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../../sanity/env";
import { toPortableText } from "./portable-text";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("SANITY_API_WRITE_TOKEN is missing from .env.local");
  process.exit(1);
}
const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const ID = "post-how-we-keep-the-salon-clean";

const excerpt =
  "What happens to our tools and stations after you leave the chair: autoclave sterilization, surface disinfection and single-use supplies, explained simply.";
const seoTitle = "How We Keep Our Barrie Nail Salon Clean | Lovely Nails Spa";
const seoDescription =
  "Autoclave-sterilized tools, stations disinfected between every client and single-use supplies. How Lovely Nails Spa in Barrie keeps every visit clean.";

const body = `
When you sit down for a manicure or pedicure, you are trusting the salon with your health as well as your nails. At Lovely Nails, your health, safety and comfort are our top priorities, and we would rather show you how we work than simply ask you to take our word for it.

Here is what happens between one client and the next.

## 1. Metal tools are sterilized, not just wiped

Clippers, pushers and other reusable metal implements are thoroughly cleaned first, disinfected as required, and then sterilized in an autoclave, following health inspection procedures.

An autoclave is the same kind of equipment used to sterilize instruments in clinics and dental offices. It uses steam under pressure to reach temperatures that wiping and soaking alone cannot. Cleaning removes what you can see; sterilizing takes care of what you can't.

## 2. Every station is disinfected between clients

Manicure tables, pedicure stations, chairs and other work surfaces are cleaned and disinfected between every client using professional-grade disinfectants. Not at the end of the day, not when it looks busy: between every client.

## 3. Single-use means single-use

Anything disposable is used only once and safely thrown away after your service. Nothing that can't be sterilized is saved for the next person.

## 4. Clean habits all day long

Beyond each appointment, our team follows consistent cleaning and sanitation routines throughout the day, so the whole salon stays clean, safe and welcoming, not just your chair.

![salon-polish-display.jpg|Polish display stands on the counter at Lovely Nails Spa|The polish counter at our salon on Burton Ave.]

## What to look for in any nail salon

Whether you visit us or somewhere else, a few simple checks help you choose a salon you can trust. These are based on the American Academy of Dermatology's [manicure and pedicure safety tips](https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/manicure-pedicure-safety):

- **Look at the stations.** Work areas should be clean and tidy, with no used tools lying around.
- **Ask how the tools are cleaned.** A good salon will happily tell you. You are always welcome to ask us.
- **Check the pedicure area.** Foot baths should be cleaned and disinfected between clients.
- **Don't shave before a pedicure.** Skip shaving your lower legs for at least 24 hours beforehand. Tiny nicks you can't see are an easy way in for bacteria.
- **Trust your instincts.** If a salon doesn't look clean, it is fine to leave.

## Our promise

Your trust is important to us. We are committed to giving every client a beautiful experience in an environment where cleanliness, safety and care come first, whether it is your first visit or your fiftieth.

You can read our full [standards of care](/#care) on our homepage. Questions about how we work? Call us at [(705) 739-8289](tel:+17057398289) or ask at your next visit at 274 Burton Ave, Unit 11, in Barriegate Centre.
`;

async function assetId(file: string) {
  const id = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $file] | order(_createdAt desc)[0]._id`,
    { file },
  );
  if (!id) throw new Error(`No image in Sanity named ${file}`);
  return id;
}

async function main() {
  const exists = await client.fetch<string | null>(`*[_id == $id][0]._id`, { id: ID });
  if (!exists) throw new Error(`${ID} not found`);
  await client
    .patch(ID)
    .set({ excerpt, seoTitle, seoDescription, body: await toPortableText(body, assetId) })
    .commit();
  console.log(`Updated ${ID}`);
}

main().catch((err) => {
  console.error("Update failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
