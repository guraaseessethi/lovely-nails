import { CleanBand } from "@/components/CleanBand";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { MeetApril } from "@/components/MeetApril";
import { Reviews } from "@/components/Reviews";
import { Services } from "@/components/Services";
import { Visit } from "@/components/Visit";
import {
  getAbout,
  getBackgrounds,
  getHours,
  getNotice,
  getReviews,
  getServices,
  getSettings,
  hasPublishedPosts,
} from "@/lib/content";

export default async function HomePage() {
  const [settings, hours, notice, showJournal, backgrounds, about, services, reviews] = await Promise.all([
    getSettings(),
    getHours(),
    getNotice(),
    hasPublishedPosts(),
    getBackgrounds(),
    getAbout(),
    getServices(),
    getReviews(),
  ]);

  return (
    <main>
      <Hero settings={settings} hours={hours} showJournal={showJournal} background={backgrounds.hero} notice={notice} />
      <Highlights settings={settings} />
      <MeetApril about={about} settings={settings} />
      <Services services={services} />
      <CleanBand background={backgrounds.clean} />
      <section id="gallery" className="container" />
      <Reviews reviews={reviews} settings={settings} />
      <Visit settings={settings} hours={hours} background={backgrounds.visit} />
    </main>
  );
}
