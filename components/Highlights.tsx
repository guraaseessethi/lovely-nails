import type { Settings } from "@/lib/types";
import { AskApril } from "./AskApril";
import styles from "./Highlights.module.css";

export function Highlights({ settings }: { settings: Settings }) {
  return (
    <section aria-label="Highlights" className={`${styles.bar} onDark`}>
      <ul className={styles.inner}>
        <li>
          {settings.googleRating ? (
            <>{settings.googleRating} stars on Google</>
          ) : (
            <AskApril>Google rating</AskApril>
          )}
        </li>
        <li className={styles.sky}>Walk-ins welcome</li>
        <li>Kids to seniors</li>
        <li className={styles.sky}>Sanitized tools, every client</li>
      </ul>
    </section>
  );
}
