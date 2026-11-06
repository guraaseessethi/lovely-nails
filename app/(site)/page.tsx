import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { getHours, getSettings, hasPublishedPosts } from "@/lib/content";

export default async function HomePage() {
  const [settings, hours, showJournal] = await Promise.all([getSettings(), getHours(), hasPublishedPosts()]);
  return (
    <main>
      <Hero settings={settings} hours={hours} showJournal={showJournal} notice={null} />
      <Highlights settings={settings} />
      {["april", "services", "gallery", "reviews", "journal", "visit"].map((id) => (
        <section key={id} id={id} className="container" style={{ minHeight: 600 }}>
          <h2 className="h2">{id}</h2>
        </section>
      ))}
    </main>
  );
}
