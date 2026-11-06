import type { DayHours } from "@/lib/types";
import { ScrollLink } from "./ScrollLink";
import { TodayPill } from "./TodayPill";
import styles from "./Header.module.css";

export const SECTIONS = [
  { id: "april", label: "April" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Work" },
  { id: "reviews", label: "Reviews" },
  { id: "journal", label: "Journal" },
  { id: "visit", label: "Visit" },
] as const;

type Props = {
  phone?: string;
  phoneE164?: string;
  hours: DayHours[];
  showJournal: boolean;
  /** "overlay" sits over the hero photo; "solid" is the black bar on inner pages */
  variant?: "overlay" | "solid";
};

export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      Lovely Nails<span className={styles.dot}>.</span>
    </span>
  );
}

export function Header({ phone, phoneE164, hours, showJournal, variant = "overlay" }: Props) {
  const links = SECTIONS.filter((s) => s.id !== "journal" || showJournal);
  return (
    <header className={`${styles.header} ${variant === "solid" ? styles.solid : ""} onDark`}>
      <div className={styles.inner}>
        <ScrollLink to="top" className={styles.logo} aria-label="Lovely Nails Spa, back to top">
          <Logo />
        </ScrollLink>
        <nav aria-label="Main" className={styles.nav}>
          {links.map((s) => (
            <ScrollLink key={s.id} to={s.id} className={styles.navLink}>
              {s.label}
            </ScrollLink>
          ))}
        </nav>
        {phoneE164 && (
          <a href={`tel:${phoneE164}`} className={styles.phone}>
            {phone}
          </a>
        )}
        <TodayPill hours={hours} className={styles.today} />
      </div>
    </header>
  );
}
