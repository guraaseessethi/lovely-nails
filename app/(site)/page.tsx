import { CleanBand } from "@/components/CleanBand";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { InstagramStrip } from "@/components/InstagramStrip";
import { Journal } from "@/components/Journal";
import { APRIL_STORY_SLUG, MeetApril } from "@/components/MeetApril";
import { Mission } from "@/components/Mission";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import { Visit } from "@/components/Visit";
import { WorkGallery } from "@/components/WorkGallery";
import {
  getAbout,
  getBackgrounds,
  getHours,
  getNotice,
  getPosts,
  getReviews,
  getServices,
  getSettings,
  getNailPhotos,
  getYear,
} from "@/lib/content";
import { getInstagramPosts } from "@/lib/instagram";
import { nailSalonJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("home");
}

export default async function HomePage() {
  const [settings, hours, notice, posts, backgrounds, about, services, reviews, photos, instagram, year] = await Promise.all([
    getSettings(),
    getHours(),
    getNotice(),
    getPosts(),
    getBackgrounds(),
    getAbout(),
    getServices(),
    getReviews(),
    getNailPhotos(),
    getInstagramPosts(),
    getYear(),
  ]);
  const showJournal = posts.length > 0;
  const storyHref = posts.some((p) => p.slug === APRIL_STORY_SLUG) ? `/journal/${APRIL_STORY_SLUG}` : undefined;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(nailSalonJsonLd(settings, hours, backgrounds.hero)) }}
      />
      <Hero settings={settings} hours={hours} showJournal={showJournal} background={backgrounds.hero} notice={notice} />
      <Highlights settings={settings} />
      <MeetApril about={about} settings={settings} storyHref={storyHref} />
      <Mission settings={settings} year={year} />
      <Services services={services} />
      <CleanBand background={backgrounds.clean} />
      <WorkGallery photos={photos} />
      {instagram.length > 0 && <InstagramStrip posts={instagram} profileUrl={settings.instagram} />}
      <Reviews reviews={reviews} settings={settings} />
      {showJournal && <Journal posts={posts} />}
      <Visit settings={settings} hours={hours} background={backgrounds.visit} />
    </main>
  );
}
