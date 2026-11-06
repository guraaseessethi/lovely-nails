import { about, backgrounds, pageSeo, review, service, siteSettings } from "./admin";
import { hours } from "./hours";
import { post } from "./post";
import { workPhotos } from "./workPhotos";

export const schemaTypes = [workPhotos, post, hours, siteSettings, service, review, about, pageSeo, backgrounds];

/** One-of-a-kind documents: fixed IDs, no create/duplicate/delete. */
export const SINGLETONS = ["workPhotos", "hours", "siteSettings", "about", "pageSeo", "backgrounds"];

/** Types only an administrator can see or create. */
export const ADMIN_TYPES = ["siteSettings", "service", "review", "about", "pageSeo", "backgrounds"];
