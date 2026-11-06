import type { Review, Settings } from "@/lib/types";
import { AskApril } from "./AskApril";
import { Icon } from "./Icon";
import styles from "./Reviews.module.css";

export function Reviews({ reviews, settings }: { reviews: Review[]; settings: Settings }) {
  const { googleRating, googleReviewCount, googleUrl } = settings;
  return (
    <section id="reviews" aria-labelledby="reviews-title" className={`${styles.section} onDark`}>
      <div className={`container ${styles.inner}`}>
        <div className="sectionHead">
          <div className="stack">
            <p className={`eyebrow ${styles.eyebrow}`}>Words from clients</p>
            <h2 id="reviews-title" className={`h2 ${styles.title}`}>
              Loved.
              <br />
              <span className="accent">For years.</span>
            </h2>
          </div>
          <div className={styles.rating}>
            {googleRating && googleReviewCount ? (
              <span>
                {googleRating} stars · {googleReviewCount} Google reviews
              </span>
            ) : (
              <AskApril>Google rating and review count</AskApril>
            )}
            {googleUrl && (
              <a href={googleUrl} className={styles.all} rel="noopener" target="_blank">
                Read all{googleReviewCount ? ` ${googleReviewCount}` : ""} reviews on Google
                <Icon name="arrowUpRight" size={16} />
                <span className="visuallyHidden">(opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className={styles.grid}>
            {reviews.map((r) => (
              <figure key={r.id} className={styles.review}>
                <blockquote className={styles.quote}>
                  <p>{r.quote}</p>
                </blockquote>
                <figcaption className={styles.name}>
                  {r.sourceUrl ? (
                    <a href={r.sourceUrl} rel="noopener" target="_blank">
                      {r.name}, on Google
                    </a>
                  ) : (
                    <>{r.name}, on Google</>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
