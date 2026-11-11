import type { Settings } from "@/lib/types";
import styles from "./Mission.module.css";

// Wording from April's "Our Mission and Values" document (Nov 2026).
export function Mission({ settings, year }: { settings: Settings; year: number }) {
  const since = settings.since ?? 2008;
  const years = year - since;

  return (
    <section id="mission" aria-labelledby="mission-title" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <p className="eyebrow">Our mission and values</p>
          <h2 id="mission-title" className="h2">
            Welcome to <span className="accent">Lovely Nails Spa.</span>
          </h2>
          <p className={styles.lede}>A place to relax, feel good and enjoy a little time for yourself.</p>
          <p className="body">
            Established in {since}, Lovely Nails Spa is a locally owned nail salon in Barrie, Ontario, founded and
            operated by April Thu Hoegy.
          </p>
        </div>

        <div className={styles.cards}>
          <article className={styles.card}>
            <p className="label">For our clients</p>
            <h3 className={styles.cardTitle}>Our mission</h3>
            <p className="body">
              For over {years} years, our mission has been to provide a warm, welcoming and relaxing environment where
              every client feels comfortable, valued and cared for.
            </p>
            <p className="body">
              We want our clients to enjoy the services they love, feel appreciated and leave with a smile. We believe a
              great salon experience goes beyond beautiful nails. It is about genuine connections, thoughtful service,
              trust and creating a place people are happy to return to.
            </p>
            <p className={styles.motto}>Your satisfaction is our success.</p>
          </article>

          <article className={styles.card}>
            <p className="label">For our team</p>
            <h3 className={styles.cardTitle}>Our vision</h3>
            <p className="body">
              We believe a happy workplace creates a better experience for everyone. We want our team to feel
              respected, secure, valued, appreciated and proud to work here.
            </p>
            <p className="body">
              We value teamwork, honesty, kindness and mutual respect. We want our team to feel proud of their work and
              know that they are valued and an important part of Lovely Nails.
            </p>
          </article>
        </div>

        <blockquote className={styles.quote}>
          <p>&ldquo;Be so happy that when others look at you, they become happy too.&rdquo;</p>
        </blockquote>
      </div>
    </section>
  );
}
