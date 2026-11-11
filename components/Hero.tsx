import Image from "next/image";
import type { DayHours, Img, Notice, Settings } from "@/lib/types";
import { Header } from "./Header";
import { ScrollLink } from "./ScrollLink";
import styles from "./Hero.module.css";

type Props = {
  settings: Settings;
  hours: DayHours[];
  showJournal: boolean;
  background?: Img;
  notice: Notice;
};

export function Hero({ settings, hours, showJournal, background, notice }: Props) {
  return (
    <section id="top" className={`${styles.hero} onDark`} aria-label="Welcome">
      {background && (
        <Image
          src={background.src}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder={background.lqip ? "blur" : "empty"}
          blurDataURL={background.lqip}
          className={styles.bg}
        />
      )}
      <div aria-hidden="true" className={styles.overlay} />
      {notice && (
        <p className={styles.notice} role="status">
          {notice.text}
        </p>
      )}
      <Header
        phone={settings.phone}
        phoneE164={settings.phoneE164}
        hours={hours}
        showJournal={showJournal}
      />
      <div id="main" tabIndex={-1} className={styles.content}>
        <p className={styles.kicker}>
          {settings.street ?? "Burton Ave"} · {settings.city ?? "Barrie"}
        </p>
        <h1 className={styles.title}>
          Lovely Nails.
          <br />
          <span className={styles.accent}>Barrie&rsquo;s nail spa</span>
          <br />
          since {settings.since ?? 2008}.
        </h1>
        <p className={styles.lede}>
          Gel, shellac, nail art and pedicures in a clean, calm salon. The whole family is welcome.
        </p>
        <div className="btnRow">
          {settings.phoneE164 && (
            <a href={`tel:${settings.phoneE164}`} className={`btn btnCyan ${styles.cta}`}>
              Call to book
            </a>
          )}
          <ScrollLink to="services" className={`btn btnOutlineLight ${styles.cta}`}>
            View the menu
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
