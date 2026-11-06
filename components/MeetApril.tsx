import Image from "next/image";
import type { About, Settings } from "@/lib/types";
import { AskApril } from "./AskApril";
import { Icon } from "./Icon";
import styles from "./MeetApril.module.css";

export function MeetApril({ about, settings }: { about: About; settings: Settings }) {
  return (
    <section id="april" aria-labelledby="april-title" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.photo}>
          {about.photo ? (
            <Image
              src={about.photo.src}
              alt={about.photo.alt}
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              placeholder={about.photo.lqip ? "blur" : "empty"}
              blurDataURL={about.photo.lqip}
              style={{ objectFit: "cover", objectPosition: about.photo.position }}
            />
          ) : (
            <span className={styles.photoNote}>
              <AskApril>a photo of April at her station</AskApril>
            </span>
          )}
        </div>
        <div className={styles.text}>
          <p className="eyebrow">Meet the owner</p>
          <h2 id="april-title" className="h2">
            April.
            <br />
            <span className="accent">Every client matters.</span>
          </h2>
          <p className="body">
            {about.story || (
              <AskApril>
                her story in 2 to 3 lines: how she started in {settings.since ?? 2011}, and what she wants every client to
                feel when they leave
              </AskApril>
            )}
          </p>
          {about.secondParagraph && <p className="body">{about.secondParagraph}</p>}
          {settings.rogersTvUrl && (
            <a href={settings.rogersTvUrl} className={styles.tv} rel="noopener" target="_blank">
              Watch April on Rogers TV Barrie
              <Icon name="arrowUpRight" size={16} />
              <span className="visuallyHidden">(opens YouTube in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
