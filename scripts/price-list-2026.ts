// April's 2026 price list ("2026 PRICE LIST.xlsx", Nov 2026), in menu order.
// Used by seed.ts and update-2026-11-13.ts. Spelling and capitalisation tidied; prices as given.

export type PriceListItem = { id: string; group: string; name: string; price: string; description?: string };

export const PRICE_LIST_2026: PriceListItem[] = [
  // Natural nails
  { id: "natural-manicure", group: "Natural nails", name: "Natural manicure", price: "$25+" },
  { id: "gel-shellac-manicure", group: "Natural nails", name: "Gel/Shellac manicure", price: "$40+" },
  { id: "natural-pedicure", group: "Natural nails", name: "Natural pedicure", price: "$40+" },
  { id: "gel-shellac-pedicure", group: "Natural nails", name: "Gel/Shellac pedicure", price: "$50+" },
  { id: "polish-change-hands", group: "Natural nails", name: "Natural polish change (hands)", price: "$20+" },
  { id: "polish-change-toes", group: "Natural nails", name: "Natural polish change (toes)", price: "$30+" },
  { id: "gel-polish-change-hands", group: "Natural nails", name: "Gel/Shellac polish change (hands)", price: "$35+" },
  { id: "gel-polish-change-toes", group: "Natural nails", name: "Gel/Shellac polish change (toes)", price: "$40+" },
  { id: "removal-natural-manicure", group: "Natural nails", name: "Artificial nail removal with natural manicure", price: "$45" },
  { id: "removal-gel-manicure", group: "Natural nails", name: "Artificial nail removal with Gel/Shellac manicure", price: "$55" },
  { id: "gel-removal", group: "Natural nails", name: "Gel/Shellac polish removal", price: "$15" },
  { id: "paraffin-wax", group: "Natural nails", name: "Paraffin wax", price: "$15" },
  { id: "natural-nail-art", group: "Natural nails", name: "Nail art and designs (add-on)", price: "$5+" },

  // Nail enhancements and extensions
  { id: "solar-set", group: "Enhancements", name: "Solar set", price: "$60+" },
  { id: "solar-fill", group: "Enhancements", name: "Solar fill", price: "$50+" },
  { id: "bio-builder-set", group: "Enhancements", name: "Bio/Builder set", price: "$65+" },
  { id: "bio-builder-fill", group: "Enhancements", name: "Bio/Builder fill", price: "$55+" },
  { id: "enhancement-polish-change", group: "Enhancements", name: "Polish change (trim and shaping)", price: "$40+" },
  { id: "length-reduction", group: "Enhancements", name: "Length reduction (trim and shaping)", price: "$25" },
  { id: "artificial-removal", group: "Enhancements", name: "Artificial nail removal", price: "$25" },
  { id: "nail-repair", group: "Enhancements", name: "Nail repair or replacement", price: "$5+" },
  { id: "enhancement-nail-art", group: "Enhancements", name: "Nail art and designs (add-on)", price: "$5+" },

  // Waxing
  { id: "wax-eyebrow", group: "Waxing", name: "Eyebrow wax", price: "$15" },
  { id: "wax-eyebrow-tint", group: "Waxing", name: "Eyebrow wax and tint", price: "$35" },
  { id: "eyebrow-tint", group: "Waxing", name: "Eyebrow tint", price: "$25" },
  { id: "wax-lip-chin", group: "Waxing", name: "Lip, chin, sideburns or neck", price: "$7" },
  { id: "wax-nose-ears", group: "Waxing", name: "Nose or ears", price: "$15+" },
  { id: "wax-full-face", group: "Waxing", name: "Full face", price: "$35+" },
  { id: "wax-toes-fingers", group: "Waxing", name: "Toes or fingers", price: "$5" },
  { id: "wax-underarms", group: "Waxing", name: "Underarms", price: "$15+" },
  { id: "wax-half-arms", group: "Waxing", name: "Half arms", price: "$35+" },
  { id: "wax-full-arms", group: "Waxing", name: "Full arms", price: "$45+" },
  { id: "wax-upper-legs", group: "Waxing", name: "Upper legs", price: "$45+" },
  { id: "wax-lower-legs", group: "Waxing", name: "Lower legs", price: "$40+" },
  { id: "wax-full-legs", group: "Waxing", name: "Full legs", price: "$60+" },
  { id: "wax-bikini", group: "Waxing", name: "Bikini line", price: "$40+" },
  { id: "wax-brazilian", group: "Waxing", name: "Brazilian", price: "$50+" },
  { id: "wax-chest-back", group: "Waxing", name: "Chest or back", price: "$55+" },

  // Facials
  {
    id: "microdermabrasion",
    group: "Facials",
    name: "Microdermabrasion (1 hr)",
    price: "$105",
    description: "Lightens and brightens skin, reduces pore size, refines skin texture and exfoliates.",
  },
  {
    id: "five-elements-anti-aging",
    group: "Facials",
    name: "Five Elements anti-aging (1 hr 15 min)",
    price: "$125",
    description:
      "Deep exfoliation with an enzyme peel, extractions and microdermabrasion, then pore refining and a serum treatment with an ultrasound device.",
  },

  // Foot massage
  { id: "foot-massage-30", group: "Foot massage", name: "Foot massage (30 min)", price: "$40" },
  { id: "foot-massage-45", group: "Foot massage", name: "Foot massage (45 min)", price: "$60" },
  { id: "foot-massage-60", group: "Foot massage", name: "Foot massage (60 min)", price: "$70" },

  // Children's services (10 and under)
  { id: "kids-manicure", group: "Kids", name: "Manicure", price: "$20" },
  { id: "kids-pedicure", group: "Kids", name: "Pedicure", price: "$35" },
  { id: "kids-polish", group: "Kids", name: "Polish (hands / toes)", price: "$15 / $20" },
  { id: "kids-shellac", group: "Kids", name: "Shellac (add-on)", price: "$10" },
  { id: "kids-nail-art", group: "Kids", name: "Nail art, chrome, French or ombre (add-on)", price: "$5+" },
];
