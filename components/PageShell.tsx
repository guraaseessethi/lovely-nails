import type { ReactNode } from "react";
import { getHours, getSettings, hasPublishedPosts } from "@/lib/content";
import { Header } from "./Header";

/** Inner pages: solid black header, then the page content. */
export async function PageShell({ children }: { children: ReactNode }) {
  const [settings, hours, showJournal] = await Promise.all([getSettings(), getHours(), hasPublishedPosts()]);
  return (
    <>
      <Header
        variant="solid"
        phone={settings.phone}
        phoneE164={settings.phoneE164}
        hours={hours}
        showJournal={showJournal}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
