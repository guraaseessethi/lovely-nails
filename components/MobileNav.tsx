"use client";

import { useCallback, useRef, useState } from "react";
import { useDialog } from "@/lib/useDialog";
import { Icon } from "./Icon";
import { Logo } from "./Header";
import { ScrollLink } from "./ScrollLink";
import styles from "./MobileNav.module.css";

type Props = {
  phoneE164?: string;
  hoursSummary: string;
  instagram?: string;
  facebook?: string;
  showJournal: boolean;
};

/** Floating app-style tab bar and bottom-sheet menu, shown under 1024px. */
export function MobileNav({ phoneE164, hoursSummary, instagram, facebook, showJournal }: Props) {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDialog(sheet, open, close);

  const links = [
    { id: "april", label: "Meet April" },
    { id: "reviews", label: "Reviews" },
    ...(showJournal ? [{ id: "journal", label: "Journal" }] : []),
    { id: "visit", label: "Hours and directions" },
  ];

  return (
    <>
      <nav aria-label="Quick links" className={styles.bar}>
        <ScrollLink to="services" className={styles.tab}>
          <Icon name="polish" size={22} />
          Services
        </ScrollLink>
        <ScrollLink to="gallery" className={styles.tab}>
          <Icon name="image" size={22} />
          Work
        </ScrollLink>
        {phoneE164 && (
          <a href={`tel:${phoneE164}`} className={`${styles.tab} ${styles.call}`}>
            <Icon name="phone" size={22} />
            Call
          </a>
        )}
        <button
          type="button"
          className={styles.tab}
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={22} />
          Menu
        </button>
      </nav>

      {open && (
        <div className={styles.backdrop} onClick={close}>
          <div
            id="menu-sheet"
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className={styles.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <span aria-hidden="true" className={styles.handle} />
            <div className={styles.sheetHead}>
              <Logo className={styles.sheetLogo} />
              <button type="button" className={styles.closeBtn} aria-label="Close menu" onClick={close}>
                <Icon name="close" />
              </button>
            </div>
            <ul className={styles.list}>
              {links.map((l) => (
                <li key={l.id}>
                  <ScrollLink to={l.id} className={styles.item} onNavigate={close}>
                    {l.label}
                    <Icon name="right" />
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <div className={styles.meta}>
              {instagram && (
                <a href={instagram} onClick={close}>
                  Instagram
                </a>
              )}
              {facebook && (
                <a href={facebook} onClick={close}>
                  Facebook
                </a>
              )}
              {hoursSummary && <span className={styles.hours}>{hoursSummary}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
