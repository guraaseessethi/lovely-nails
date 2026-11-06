import { CleanBand } from "@/components/CleanBand";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Journal } from "@/components/Journal";
import { MeetApril } from "@/components/MeetApril";
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
  getWorkPhotos,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return pageMetadata("home");
}

export default async function HomePage() {
  const [settings, hours, notice, posts, backgrounds, about, services, reviews, photos] = await Promise.all([
    getSettings(),
    getHours(),
    getNotice(),
    getPosts(),
    getBackgrounds(),
    getAbout(),
    getServices(),
    getReviews(),
    getWorkPhotos(),
  ]);
  const showJournal = posts.length > 0;

  return (
    <main>
      <Hero settings={settings} hours={hours} showJournal={showJournal} background={backgrounds.hero} notice={notice} />
      <Highlights settings={settings} />
      <MeetApril about={about} settings={settings} />
      <Services services={services} />
      <CleanBand background={backgrounds.clean} />
      <WorkGallery photos={photos} />
      <Reviews reviews={reviews} settings={settings} />
      {showJournal && <Journal posts={posts} />}
      <Visit settings={settings} hours={hours} background={backgrounds.visit} />
    </main>
  );
}
