"use client";

import Image from "next/image";
import { useState } from "react";
import { scrollToId } from "@/lib/smoothScroll";
import { WORK_CATEGORIES, type WorkCategory, type WorkPhoto } from "@/lib/types";
import { useMedia } from "@/lib/useMedia";
import { AskApril } from "./AskApril";
import { Lightbox, type LightboxItem } from "./Lightbox";
import { Pager } from "./Pager";
import styles from "./WorkGallery.module.css";

type Filter = "All" | WorkCategory;

export function WorkGallery({ photos, headingLevel = 2 }: { photos: WorkPhoto[]; headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const isPhone = useMedia("(max-width: 767px)");
  // Only offer categories that have at least one photo.
  const filters: Filter[] = ["All", ...WORK_CATEGORIES.filter((c) => photos.some((p) => p.category === c))];

  const perPage = isPhone ? 4 : 6;
  const filtered = filter === "All" ? photos : photos.filter((p) => p.category === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pageCount - 1);
  const shown = filtered.slice(current * perPage, current * perPage + perPage);

  const items: LightboxItem[] = filtered.map((p) => ({ ...p, title: p.caption, meta: p.category }));

  const turn = (n: number) => {
    setPage(n);
    scrollToId("gallery");
  };

  return (
    <section id="gallery" aria-labelledby="gallery-title" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className="sectionHead">
          <div className="stack">
            <p className="eyebrow">Portfolio</p>
            <Heading id="gallery-title" className="h2">
              The <span className="accent">Work.</span>
            </Heading>
          </div>
          <div role="group" aria-label="Filter the work" className={styles.filters}>
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={f === filter}
                className={`${styles.filter} ${f === filter ? styles.on : ""}`}
                onClick={() => {
                  setFilter(f);
                  setPage(0);
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {photos.length === 0 ? (
          <p>
            <AskApril>photos of recent sets</AskApril>
          </p>
        ) : shown.length === 0 ? (
          <p className={styles.empty} role="status">
            No {filter.toLowerCase()} photos yet. Try another filter.
          </p>
        ) : (
          <ul className={styles.grid} aria-live="polite">
            {shown.map((p, i) => (
              <li key={p.key}>
                <button
                  type="button"
                  className={styles.tile}
                  aria-label={`Open photo: ${p.caption ?? p.alt}`}
                  onClick={() => setOpen(current * perPage + i)}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 50vw"
                    placeholder={p.lqip ? "blur" : "empty"}
                    blurDataURL={p.lqip}
                    style={{ objectFit: "cover", objectPosition: p.position }}
                  />
                  {(p.category || p.caption) && (
                    <span className={styles.meta} aria-hidden="true">
                      {p.category && <span className={styles.cat}>{p.category}</span>}
                      {p.caption && <span className={styles.caption}>{p.caption}</span>}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <Pager page={current} count={pageCount} onChange={turn} label="Work pages" />
      </div>
      <Lightbox items={items} index={open} onIndex={setOpen} label="Photo viewer" />
    </section>
  );
}
