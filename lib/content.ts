// Data access for the site. Phase (a) stub with verified facts only; replaced by Sanity queries in phase (c).
import type { DayHours, Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  return {
    businessName: "Lovely Nails Spa",
    phone: "(705) 739-8289",
    phoneE164: "+17057398289",
    email: "info@lovelynailsbarrie.com",
    street: "274 Burton Ave",
    unit: "Unit 11",
    city: "Barrie",
    region: "ON",
    postalCode: "L4N 5W4",
    instagram: "https://www.instagram.com/lovelynailsspabarrie/",
    facebook: "https://www.facebook.com/lovely.nailsbarrie",
    googleRating: 4.7,
    googleReviewCount: 328,
    instagramExclude: [],
  };
}

export async function getHours(): Promise<DayHours[]> {
  const weekday = { closed: false, open: "10:00", close: "19:00" };
  return [
    { day: "Monday", ...weekday },
    { day: "Tuesday", ...weekday },
    { day: "Wednesday", ...weekday },
    { day: "Thursday", ...weekday },
    { day: "Friday", ...weekday },
    { day: "Saturday", closed: false, open: "10:00", close: "16:00" },
    { day: "Sunday", closed: true },
  ];
}

export async function hasPublishedPosts() {
  return true;
}

export async function getYear() {
  "use cache";
  return new Date().getFullYear();
}
