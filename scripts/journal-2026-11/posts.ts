// Seven Journal posts scheduled Nov 2026 to Feb 2027 (see publish.ts).
// Facts come from April's 2026 price list, her standards-of-care document and the site settings.
// Body format: "## " heading, "### " small heading, "- " bullet, blank line between paragraphs,
// **bold**, [link](url), and "![file|alt|caption]" for a photo already in Sanity.

export type JournalPost = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  cover: { file: string; alt: string };
  body: string;
};

export const POSTS: JournalPost[] = [
  {
    slug: "gel-shellac-or-regular-polish",
    date: "2026-11-18",
    tag: "Nail care",
    title: "Gel, Shellac or regular polish? How to choose your next manicure",
    excerpt:
      "Three finishes, three very different results. Here is how regular polish, gel and Shellac compare on wear, removal and price, so you can book the right one.",
    seoTitle: "Gel vs Shellac vs Regular Polish | Lovely Nails Spa Barrie",
    seoDescription:
      "How regular polish, gel and Shellac manicures compare on wear time, removal and price at our Barrie nail salon on Burton Ave.",
    cover: { file: "salon-polish-wall-sign.jpg", alt: "The polish wall under the Lovely Nails Spa sign" },
    body: `
Should you get gel, Shellac or just regular polish? It is one of the most common questions about manicures. There is no single right answer. It depends on how long you want your colour to last, how hard you are on your hands, and how often you like to change things up.

## Regular polish

Regular polish is the classic manicure finish. It air dries, it comes off at home with remover, and you can change colours whenever you like.

- **Best for:** a fresh look for an event, people who like to switch colours often, or anyone giving their nails a break from gel.
- **How long it lasts:** usually a few days to a week before tips start to wear, depending on what you do with your hands.
- **Price at our salon:** a natural manicure starts at **$25**, and a natural polish change on hands starts at **$20**.

## Gel polish and Shellac

Gel polish is painted on like regular polish, then cured under a lamp so it sets hard straight away. You leave the salon with nails that are completely dry, glossy and much tougher than regular polish.

Shellac is a brand of gel polish. It is a little softer and is known for coming off easily when it is time for removal. On our menu the two sit together as Gel/Shellac, and your tech will help you pick.

- **Best for:** a manicure that keeps its shine through work, school, typing and housework.
- **How long it lasts:** often around two weeks, sometimes longer.
- **Price at our salon:** a Gel/Shellac manicure starts at **$40**, and a Gel/Shellac pedicure starts at **$50**.

![lavender-short-gel.jpg|Pastel lavender gel on short rounded nails|A soft lavender gel manicure on short, natural nails.]

## Please don't peel it off

The one rule with gel: let us take it off. Peeling or picking gel lifts away thin layers of your natural nail along with it, which leaves nails thin and bendy. A Gel/Shellac polish removal at our salon is **$15**, and it is the kindest thing you can do for your nails between sets.

If you like a little extra reading, the American Academy of Dermatology has helpful [tips for healthy nails with gel manicures](https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/gel-manicures), including taking an occasional break between sets.

## So which one should you book?

- Choose **regular polish** if you change colours every week or want a quick refresh.
- Choose **gel or Shellac** if you want two weeks of shine without chips.
- Not sure? Book either and ask. Our team will look at your nails and talk it through with you before we start.

You can see every manicure and pedicure option on our [full service menu](/services), or call us at [(705) 739-8289](tel:+17057398289). Walk-ins are welcome, but appointments are highly recommended.
`,
  },
  {
    slug: "christmas-and-new-year-nail-ideas",
    date: "2026-12-02",
    tag: "Trends",
    title: "Christmas and New Year nail ideas from our Barrie salon",
    excerpt:
      "Gold stars, emerald ombre, deep reds and a little sparkle. A few of the holiday sets we have been painting, and how to book yours before the December rush.",
    seoTitle: "Christmas & New Year Nails in Barrie | Lovely Nails Spa",
    seoDescription:
      "Holiday nail ideas from Lovely Nails Spa in Barrie: gold accents, emerald ombre, festive reds and New Year sparkle. Tips for booking before December fills up.",
    cover: { file: "nude-gold-swirl-stars-stiletto.png", alt: "Sheer nude stiletto nails with gold swirls and star accents" },
    body: `
December is a busy month for nails. Office parties, family dinners, New Year's Eve: there is always a reason to want your hands to look their best. Here are a few holiday looks straight from our chairs, plus some practical tips for getting the timing right.

## Gold, but make it soft

If you want something festive that still goes with everything, gold accents on a sheer nude base are hard to beat. Thin gold swirls and tiny stars catch the light at a dinner table without feeling like a costume. This style works on almond and stiletto shapes, and it carries on looking right well into January.

## Emerald ombre with gold stars

Green is having a moment. A deep emerald fading into a soft pink base, finished with a few hand-painted gold stars, feels like Christmas without a single candy cane.

![emerald-ombre-gold-stars.png|Emerald green ombre on almond nails with gold star accents|Emerald ombre with hand-painted gold stars.]

## Classic red, done three ways

Red never leaves the holiday list. A few ways to keep it interesting:

- **Glossy red with white snowflakes** for a cosy, wintery feel.
- **Tortoiseshell and deep red** with a single gold accent nail, which looks rich and grown up.
- **One red accent nail** on an otherwise neutral set, if you prefer something quieter.

![tortoiseshell-red-gold.png|Tortoiseshell, deep red and gold accent nails|Tortoiseshell and deep red with a gold accent nail.]

## Metallic blue for the New Year

Silvery, metallic blue chrome is a fun way to ring in the New Year. It pairs well with sequins and party lights, and it photographs beautifully at midnight.

![blue-chrome-christmas-candy.png|Metallic blue nails holding a dish of gold-wrapped candies by a Christmas tree|Metallic blue chrome, ready for the holidays.]

## How to book your holiday set

- **Book early.** The weeks before Christmas fill up quickly. If you have a party on a specific date, call ahead.
- **Choose gel if it needs to last.** A Gel/Shellac manicure starts at **$40** and usually keeps its shine through a couple of weeks of wrapping, cooking and celebrating.
- **Bring a photo.** If you have seen a design you love, show us. Nail art and designs are an add-on from **$5**, and the final price depends on the detail.
- **Think about your plans.** Long stilettos look stunning in photos, but if you are hosting and doing the dishes, a shorter almond shape is easier to live with.

You can scroll more of our holiday work in the [Christmas & New Year section of our gallery](/work). To book, call [(705) 739-8289](tel:+17057398289) or visit us at 274 Burton Ave, Unit 11, in Barriegate Centre.
`,
  },
  {
    slug: "winter-hand-and-foot-care",
    date: "2026-12-16",
    tag: "Nail care",
    title: "Winter hand and foot care for a Barrie winter",
    excerpt:
      "Cold wind, dry indoor heat and road salt are hard on skin and nails. Simple habits that help, and the salon treatments that give your hands and feet a reset.",
    seoTitle: "Winter Hand & Foot Care Tips | Lovely Nails Spa Barrie",
    seoDescription:
      "Keep hands and feet comfortable through a Barrie winter: everyday habits for dry skin and nails, plus paraffin wax, pedicures and foot massage at our salon.",
    cover: { file: "white-french-flower-classic.jpg", alt: "Classic white French tips with a hand-painted white flower, resting on a knit sweater" },
    body: `
Anyone who has spent a winter in Barrie knows what it does to your hands. Cold wind outside, dry furnace heat inside, gloves on, gloves off, and lots of hand washing in between. Skin gets tight, cuticles crack, and nails can turn brittle and start to peel.

The good news is that a few simple habits make a real difference.

## Everyday habits for your hands

- **Moisturise often, especially after washing.** Thicker creams and ointments tend to work better than light lotions on very dry skin. Keep one by the sink and one in your bag.
- **Treat your cuticles too.** A drop of cuticle oil or a bit of hand cream rubbed into the nail edges at night keeps them from splitting.
- **Wear gloves.** Outside in the cold, and inside when you wash dishes or clean. Hot water and cleaning products dry skin out fast.
- **Go for warm, not hot.** Very hot water feels great on a cold day but strips natural oils from your skin.
- **Add moisture to the air.** A humidifier in the bedroom helps if your home's heat runs dry.

The American Academy of Dermatology has a good list of [tips for relieving dry skin](https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin) if you want to read more. If your hands are cracked, painful or not getting better, it is worth seeing your doctor.

## Don't forget your feet

Feet get ignored in winter because they live in socks and boots, but heels dry out and crack just like hands do. Moisturise your feet at night, then pull on cotton socks to help it sink in. Dry your feet well after the shower, and give your boots a chance to dry out between wears.

## Salon treatments that help

- **Paraffin wax ($15):** warm wax wraps your hands, holds in heat and leaves skin feeling soft. It is a lovely add-on to a manicure on a cold day.
- **A pedicure:** a natural pedicure starts at **$40**, and a Gel/Shellac pedicure at **$50**. Even if nobody will see your toes until spring, the care is for you.
- **Foot massage:** 30 minutes for **$40**, 45 minutes for **$60** or a full hour for **$70**. After a day in winter boots, it is hard to beat.

## Gel and winter nails

If your nails are peeling and splitting, a Gel/Shellac manicure can protect the tips while they grow. Just remember to come in for removal rather than peeling it off, which does more damage to dry nails than anything else.

See our [full service menu](/services) for every option, or call [(705) 739-8289](tel:+17057398289) to book. Stay warm out there.
`,
  },
  {
    slug: "solar-nails-or-builder-gel",
    date: "2027-01-06",
    tag: "Nail care",
    title: "Solar nails or builder gel? Choosing your nail extensions",
    excerpt:
      "Both give you strong, longer nails, but they are made very differently. How Solar nails and Bio/Builder gel compare, what fills involve, and current prices.",
    seoTitle: "Solar Nails vs Builder Gel in Barrie | Lovely Nails Spa",
    seoDescription:
      "Thinking about nail extensions in Barrie? How Solar nails and Bio/Builder gel compare on strength, feel and upkeep, plus set and fill prices.",
    cover: { file: "black-white-pink-abstract-square.png", alt: "Black, white and pink abstract line art on long square nails" },
    body: `
If you want nails that are longer or stronger than your own, you will see two options on our menu: **Solar** and **Bio/Builder**. Both are popular, both can look amazing, and both are often called "extensions". Here is how they actually differ.

## What are Solar nails?

Solar nails are a well-known acrylic system made by CND. A liquid and a powder are blended into a bead, then sculpted onto your nail (or a tip) and shaped by hand. It sets hard and very strong.

Solar is the classic choice for "pink and whites", the crisp French look with a pink base and a bright white tip, and it holds up well to long lengths and bold shapes.

- **Solar set:** from **$60**
- **Solar fill:** from **$50**

## What is Bio/Builder gel?

Builder gel is a thicker gel that is brushed on and cured under a lamp. It adds strength and a little length, with a bit more flex than acrylic, so it can feel more like a natural nail. Many people use it to protect their own nails while they grow out.

- **Bio/Builder set:** from **$65**
- **Bio/Builder fill:** from **$55**

![pink-french-square-flower.png|Pink French tips on square nails with a white flower accent|Pink French tips on square nails with a hand-painted flower.]

## Which one is right for you?

- Choose **Solar** if you want real length, sharp shapes like coffin or stiletto, or the classic pink and white French look.
- Choose **Bio/Builder** if you want strength and shine with a more natural feel, or you are trying to grow out your own nails.
- If you are unsure, tell your tech how you use your hands. Someone who types all day and someone who gardens every weekend may get a different recommendation, and that is the point of asking.

## What are fills?

Your natural nail keeps growing under the enhancement, which leaves a gap at the base. A fill tidies that up and rebalances the nail so it stays strong. Most people come back every two to four weeks; your tech will suggest what suits you.

## Other extension services

- Polish change with trim and shaping: from **$40**
- Length reduction (trim and shaping): **$25**
- Artificial nail removal: **$25**
- Nail repair or replacement: from **$5**
- Nail art and designs: from **$5**

Prices vary with length and design. If you have a photo of a style you love, bring it along.

## Looking after extensions

Treat your nails as jewels, not tools: no opening cans or scraping labels. Come in for removal instead of pulling them off. The American Academy of Dermatology also shares [tips for reducing nail damage from artificial nails](https://www.aad.org/public/everyday-care/nail-care-secrets/basics/pedicures/reduce-artificial-nail-damage) worth a read.

Browse our [full service menu](/services) or see more sets in [our gallery](/work). To book, call [(705) 739-8289](tel:+17057398289).
`,
  },
  {
    slug: "your-first-waxing-appointment",
    date: "2027-01-20",
    tag: "In the salon",
    title: "Your first wax: what to know before you book",
    excerpt:
      "Nervous about your first wax? How long your hair should be, what to skip beforehand, what it feels like, and how to care for your skin after.",
    seoTitle: "First Waxing Appointment Tips | Lovely Nails Spa Barrie",
    seoDescription:
      "Booking your first wax in Barrie? How to prepare, what to expect and how to care for your skin after eyebrow, face, body or Brazilian waxing.",
    cover: { file: "salon-interior-polish-wall.jpg", alt: "The polish wall and a clean station at Lovely Nails Spa" },
    body: `
Alongside nails, we offer waxing for the face and body. If it is your first time, it is normal to have questions. Here is a simple guide so you know exactly what to expect.

## Before your appointment

- **Let the hair grow a little.** For the wax to grip properly, hair should be about a quarter of an inch long, roughly the size of a grain of rice. If you usually shave, stop for about two weeks first.
- **Skip lotion and oil on the day.** They make it harder for the wax to hold the hair.
- **Tell us about your skin.** If you use retinoids or acne treatments, or your skin is sunburned, irritated or broken, mention it when you book. It can affect whether waxing is right for you that day.
- **Gently exfoliate a day or two before** if you are waxing your body. It helps with ingrown hairs.

## What it feels like

There is no point pretending: waxing stings for a second. The good news is that it is quick, and most people find it gets easier with regular visits as hair grows back finer. Breathe out as the strip comes off, and let us know if you need a moment.

## After your wax

- Skip hot tubs, saunas, tanning and intense workouts for a day or so.
- Wear loose clothing over freshly waxed areas.
- Keep the skin clean and avoid heavy fragranced products for a day.
- After a few days, gentle exfoliation helps prevent ingrown hairs.

## How often should you come back?

Most people return every three to six weeks, depending on the area and how fast their hair grows. Staying on a schedule keeps hair at the right length and usually makes each visit easier.

## Waxing at Lovely Nails Spa

Our waxing menu covers face and body. A few popular services:

- Eyebrow wax: **$15**
- Eyebrow wax and tint: **$35**
- Lip, chin, sideburns or neck: **$7**
- Full face: from **$35**
- Underarms: from **$15**
- Half arms from **$35**, full arms from **$45**
- Lower legs from **$40**, full legs from **$60**
- Bikini line from **$40**, Brazilian from **$50**

Like every service at our salon, waxing follows our standards of care: work surfaces are cleaned and disinfected between clients, and disposable supplies are used once and thrown away.

See the [full waxing menu](/services) or call [(705) 739-8289](tel:+17057398289) to book.
`,
  },
  {
    slug: "your-childs-first-manicure",
    date: "2027-02-03",
    tag: "Family",
    title: "Your child's first manicure: a guide for parents",
    excerpt:
      "A first manicure can be a really special outing. What to expect, how to keep it fun, and our prices for children 10 and under.",
    seoTitle: "Kids Manicures in Barrie (10 and Under) | Lovely Nails Spa",
    seoDescription:
      "Planning your child's first manicure or pedicure in Barrie? What to expect, tips for a happy visit, and kids prices at Lovely Nails Spa on Burton Ave.",
    cover: { file: "pastel-painted-flowers.png", alt: "Pastel nails in five colours with painted flowers" },
    body: `
We have been welcoming families since 2008, and a child's first visit is always a special one. A first manicure can feel like a big-kid treat, and with a little planning it is easy to make it a happy one.

## Our kids services (10 and under)

- Manicure: **$20**
- Pedicure: **$35**
- Polish only: **$15** for hands, **$20** for toes
- Shellac add-on: **$10**
- Nail art, chrome, French or ombre add-on: from **$5**

## Tips for a happy first visit

- **Pick a good time.** A visit after a nap or a snack goes much better than one squeezed in before dinner.
- **Make it a date.** Booking side by side with a parent or grandparent turns it into a fun outing, and it helps little ones feel at ease.
- **Let them choose the colour.** Kids love picking from the polish wall. Bright and glittery is half the fun.
- **Keep it simple.** For a first visit, a polish change on hands is quick and easy. You can always add toes next time.
- **Talk about the dry time.** Regular polish needs a little patience to dry, so plan a calm activity right after.

## Regular polish or Shellac for kids?

Regular polish is usually the easiest choice for young children. It is quick and gentle, and it can be taken off at home whenever you like. If there is a special occasion coming up, such as a wedding, a recital or a birthday party, a Shellac add-on helps the colour last.

## Cleanliness matters, especially for little hands

Every client is treated the same way. Our reusable metal tools are cleaned and sterilized in an autoclave, work surfaces are disinfected between clients, and disposable items are used once and thrown away. You can read more about how we do it in our post on [keeping the salon clean between clients](/journal/how-we-keep-the-salon-clean).

## Building good habits

A manicure is a nice chance to talk about looking after nails: keeping them clean, trimming them straight across, and not biting them. The American Academy of Dermatology has a friendly page on [what kids should know about nail care](https://www.aad.org/public/parents-kids/healthy-habits/parents/kids/nail-care) that you can read together.

To book a visit for your little one, call [(705) 739-8289](tel:+17057398289), or see all our services on the [menu](/services).
`,
  },
  {
    slug: "valentines-day-nail-ideas",
    date: "2027-02-10",
    tag: "Trends",
    title: "Valentine's Day nail ideas for 2027",
    excerpt:
      "Tiny hearts, soft pinks, strawberries and deep reds. Valentine's nail ideas from our Barrie salon, from barely-there to all-out romantic.",
    seoTitle: "Valentine's Day Nails in Barrie | Lovely Nails Spa",
    seoDescription:
      "Valentine's nail ideas from Lovely Nails Spa in Barrie: tiny hearts, pinks, reds and playful strawberry art. How to book your set before February 14.",
    cover: { file: "pink-tiny-hearts.png", alt: "Bubblegum pink nails with tiny red heart accents" },
    body: `
Valentine's Day is a great excuse for a little nail art, whether you are celebrating with a partner, with friends, or just treating yourself. Here are a few ideas from our salon, from barely-there to all-out romantic.

## Tiny hearts

A soft pink base with a single tiny red heart on a nail or two is the definition of subtle. It is sweet, it is easy to wear to work, and it still looks good after the 14th.

## Pink French with a twist

Swap the classic white tip for a coloured one. Mint, lilac or a hot pink French tip on a sheer base feels fresh, and you can add one accent nail with a little design.

![mint-french-strawberry.png|Mint French tips with pink strawberry accent nails|Mint French tips with strawberry accent nails.]

## Deep reds and florals

If you love a richer look, burgundy almond nails with hand-painted florals on an accent nail feel romantic and grown up. It is a great choice if you have a dinner reservation.

![burgundy-floral-almond.png|Burgundy almond nails with hand-painted floral accents|Burgundy almond nails with hand-painted florals.]

## All-out red

Nothing says Valentine's like a glossy, classic red. On short nails it looks polished and timeless, and on longer almond or stiletto shapes it is pure glamour.

## Planning your Valentine's set

- **Book ahead.** The week before Valentine's Day fills up fast.
- **Choose gel for staying power.** A Gel/Shellac manicure starts at **$40** and will still look fresh on the big night if you come in a few days early.
- **Bring inspiration.** Show us a photo and we will help adapt it to your nail shape and length. Nail art is an add-on from **$5**, depending on the design.
- **Make it a date.** Booking a mani and pedi with a friend is a lovely way to celebrate, too.

See more of our work in [the gallery](/work), check prices on our [menu](/services), and call [(705) 739-8289](tel:+17057398289) to book.
`,
  },
];
