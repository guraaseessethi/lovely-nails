"use client";

import Image from "next/image";
import { useState } from "react";
import type { InstagramPost } from "@/lib/types";
import { Lightbox, type LightboxItem } from "./Lightbox";
import styles from "./InstagramStrip.module.css";

/** Latest Instagram photos. The server only renders this when there are posts to show. */
export function InstagramStrip({ posts, profileUrl }: { posts: InstagramPost[]; profileUrl?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const handle = profileUrl?.match(/instagram\.com\/([^/?#]+)/)?.[1];
  const items: LightboxItem[] = posts.map((p) => ({ ...p, key: p.id, meta: "Instagram", unoptimized: true }));

  return (
    <section aria-labelledby="ig-title" className={styles.section}>
      <div className={styles.inner}>
        <div className="sectionHead">
          <div className="stack">
            <p className={`eyebrow ${styles.eyebrow}`}>Instagram</p>
            <h2 id="ig-title" className={`h2 ${styles.title}`}>
              Fresh from <span className="accent">the salon.</span>
            </h2>
          </div>
          {profileUrl && handle && (
            <a href={profileUrl} className={styles.handle}>
              @{handle}
            </a>
          )}
        </div>
        <ul className={styles.row}>
          {posts.map((p, i) => (
            <li key={p.id}>
              <button type="button" className={styles.tile} aria-label={`Open Instagram photo: ${p.alt}`} onClick={() => setOpen(i)}>
                <Image src={p.src} alt={p.alt} fill unoptimized sizes="236px" style={{ objectFit: "cover" }} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox items={items} index={open} onIndex={setOpen} label="Instagram photo viewer" />
    </section>
  );
}
