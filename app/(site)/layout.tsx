import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";
import { cormorant, poppins } from "@/lib/fonts";
import { getHours, getSettings, getYear, hasPublishedPosts } from "@/lib/content";
import { hoursSummary } from "@/lib/hours";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default async function SiteLayout({ children, modal }: LayoutProps<"/">) {
  const [settings, hours, showJournal, year] = await Promise.all([
    getSettings(),
    getHours(),
    hasPublishedPosts(),
    getYear(),
  ]);

  return (
    <html lang="en-CA" className={`${cormorant.variable} ${poppins.variable}`}>
      <body>
        <a href="#main" className="skipLink">
          Skip to content
        </a>
        {children}
        {modal}
        <Footer settings={settings} year={year} />
        <MobileNav
          phoneE164={settings.phoneE164}
          hoursSummary={hoursSummary(hours)}
          instagram={settings.instagram}
          facebook={settings.facebook}
          showJournal={showJournal}
        />
      </body>
    </html>
  );
}
