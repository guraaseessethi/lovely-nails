import type { Settings } from "@/lib/types";
import { Logo } from "./Header";
import styles from "./Footer.module.css";

export function Footer({ settings, year }: { settings: Settings; year: number }) {
  const city = [settings.city, settings.region === "ON" ? "Ontario" : settings.region].filter(Boolean).join(", ");
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Logo className={styles.logo} />
        <ul className={styles.links}>
          {settings.instagram && (
            <li>
              <a href={settings.instagram}>Instagram</a>
            </li>
          )}
          {settings.facebook && (
            <li>
              <a href={settings.facebook}>Facebook</a>
            </li>
          )}
          {settings.email && (
            <li>
              <a href={`mailto:${settings.email}`}>Email</a>
            </li>
          )}
        </ul>
        <p className={styles.legal}>
          © {year} {settings.businessName}
          {city && ` · ${city}`}
        </p>
      </div>
    </footer>
  );
}
