import { DAYS } from "./hours";
import { SITE_URL } from "./seo";
import type { DayHours, Img, Settings } from "./types";

/** schema.org NailSalon. Name, address, phone and hours must match the Google listing character for character. */
export function nailSalonJsonLd(settings: Settings, hours: DayHours[], image?: Img) {
  const open = hours.filter((d) => !d.closed && d.open && d.close && DAYS.includes(d.day as (typeof DAYS)[number]));
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    "@id": `${SITE_URL}/#salon`,
    name: settings.businessName,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: image?.src,
    logo: settings.logo?.src,
    foundingDate: settings.since ? String(settings.since) : undefined,
    address: settings.street
      ? {
          "@type": "PostalAddress",
          streetAddress: [settings.street, settings.unit].filter(Boolean).join(", "),
          addressLocality: settings.city,
          addressRegion: settings.region,
          postalCode: settings.postalCode,
          addressCountry: "CA",
        }
      : undefined,
    geo:
      settings.lat && settings.lng
        ? { "@type": "GeoCoordinates", latitude: settings.lat, longitude: settings.lng }
        : undefined,
    openingHoursSpecification: open.map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${d.day}`,
      opens: d.open,
      closes: d.close,
    })),
    hasMap: settings.googleUrl,
    sameAs: [settings.instagram, settings.facebook, settings.googleUrl].filter(Boolean),
  };
}

/** Safe to drop into a <script type="application/ld+json">. */
export function serializeJsonLd(data: object) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
