import Image from "next/image";
import type { DayHours, Img, Notice, Settings } from "@/lib/types";
import { BookButton } from "./BookButton";
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
        <p className={styles.tagline}>Hey, where did you get those&hellip;</p>
        <h1 className={styles.title}>
          Lovely Nails Spa.
          <br />
          <span className={styles.accent}>Barrie&rsquo;s nail salon</span>
          <br />
          since {settings.since ?? 2008}.
        </h1>
        <div className={styles.lede}>
          <p className={styles.ledeTitle}>Family Nail &amp; Beauty Care</p>
          <ul className={styles.services}>
            <li>Nail Extensions: Solar / Builder Bio Gel</li>
            <li>Pedicure</li>
            <li>Shellac Gel Manicure</li>
            <li>Waxing</li>
            <li>Facial</li>
            <li>Foot Massage</li>
          </ul>
        </div>
        <div className="btnRow">
          <BookButton
            phone={settings.phone}
            phoneE164={settings.phoneE164}
            email={settings.email}
            className={`btn btnCyan ${styles.cta}`}
          />
          <ScrollLink to="services" className={`btn btnOutlineLight ${styles.cta}`}>
            View the menu
          </ScrollLink>
        </div>
      </div>
    </section>
  );
}
