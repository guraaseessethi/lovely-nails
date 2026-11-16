import type { Metadata } from "next";
import Image from "next/image";
import { BookButton } from "@/components/BookButton";
import { Icon } from "@/components/Icon";
import { directionsUrl } from "@/components/Visit";
import { getBackgrounds, getHours, getSettings } from "@/lib/content";
import { hoursSummary } from "@/lib/hours";
import styles from "./links.module.css";

// The page the salon's QR code opens: one tap to the website, Instagram, Facebook or booking.
export const metadata: Metadata = {
  title: "Links",
  description: "Book, visit our website, or follow Lovely Nails Spa in Barrie on Instagram and Facebook.",
  alternates: { canonical: "/links" },
  robots: { index: false, follow: true },
};

export default async function LinksPage() {
  const [settings, hours, backgrounds] = await Promise.all([getSettings(), getHours(), getBackgrounds()]);
  const handle = settings.instagram?.match(/instagram\.com\/([^/?#]+)/)?.[1];
  const address = [[settings.street, settings.unit].filter(Boolean).join(", "), settings.city]
    .filter(Boolean)
    .join(" · ");

  const links = [
    { href: "/", label: "Visit our website", detail: "Services, prices and our work", icon: "globe" as const },
    settings.instagram && {
      href: settings.instagram,
      label: "Instagram",
      detail: handle ? `@${handle}` : "Follow us",
      icon: "instagram" as const,
      external: true,
    },
    settings.facebook && {
      href: settings.facebook,
      label: "Facebook",
      detail: "Lovely Nails Spa",
      icon: "facebook" as const,
      external: true,
    },
    settings.street && {
      href: directionsUrl(settings),
      label: "Get directions",
      detail: address,
      icon: "pin" as const,
      external: true,
    },
  ].filter(Boolean) as { href: string; label: string; detail: string; icon: "globe" | "instagram" | "facebook" | "pin"; external?: boolean }[];

  return (
    <main id="main" tabIndex={-1} className={`${styles.page} onDark`} data-links-page>
      {backgrounds.hero && (
        <Image src={backgrounds.hero.src} alt="" fill priority sizes="100vw" className={styles.bg} />
      )}
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.inner}>
        <p className={styles.tagline}>Hey, where did you get those&hellip;</p>
        <h1 className={styles.title}>
          Lovely Nails Spa<span className={styles.dot}>.</span>
        </h1>
        <p className={styles.sub}>Family Nail &amp; Beauty Care in Barrie since {settings.since ?? 2008}</p>

        <BookButton
          phone={settings.phone}
          phoneE164={settings.phoneE164}
          email={settings.email}
          className={`btn btnCyan ${styles.book}`}
          label="Book an appointment"
        />

        <ul className={styles.list}>
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className={styles.link}
                {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              >
                <span className={styles.icon}>
                  <Icon name={l.icon} size={20} />
                </span>
                <span className={styles.text}>
                  <span className={styles.label}>{l.label}</span>
                  <span className={styles.detail}>{l.detail}</span>
                </span>
                <Icon name={l.external ? "arrowUpRight" : "right"} />
                {l.external && <span className="visuallyHidden">(opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>

        {hours.length > 0 && <p className={styles.hours}>{hoursSummary(hours)}</p>}
      </div>
    </main>
  );
}
