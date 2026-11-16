"use client";

import Image from "next/image";
import { useState } from "react";
import type { WorkPhoto } from "@/lib/types";
import { AskApril } from "./AskApril";
import { Lightbox, type LightboxItem } from "./Lightbox";
import styles from "./SalonGallery.module.css";

/** Every photo marked "Photo of the salon" in the Studio, uncropped, in a masonry wall. */
export function SalonGallery({ photos }: { photos: WorkPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const items: LightboxItem[] = photos.map((p) => ({ ...p, title: p.caption }));

  return (
    <section aria-labelledby="salon-title" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className="stack">
          <p className="eyebrow">The salon</p>
          <h1 id="salon-title" className="h2">
            Step into <span className="accent">Lovely Nails.</span>
          </h1>
          <p className={`body ${styles.intro}`}>A look around our Burton Ave salon before you visit.</p>
        </div>

        {photos.length === 0 ? (
          <p>
            <AskApril>photos of the salon</AskApril>
          </p>
        ) : (
          <ul className={styles.wall}>
            {photos.map((p, i) => (
              <li key={p.key} className={styles.item}>
                <button
                  type="button"
                  className={styles.tile}
                  aria-label={`Open photo: ${p.caption ?? p.alt}`}
                  onClick={() => setOpen(i)}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 50vw"
                    placeholder={p.lqip ? "blur" : "empty"}
                    blurDataURL={p.lqip}
                    priority={i < 3}
                    className={styles.photo}
                  />
                  {p.caption && (
                    <span className={styles.caption} aria-hidden="true">
                      {p.caption}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Lightbox items={items} index={open} onIndex={setOpen} label="Salon photo viewer" />
    </section>
  );
}
