"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { scrollToId } from "@/lib/smoothScroll";
import type { PostCard } from "@/lib/types";
import { Pager } from "./Pager";
import styles from "./Journal.module.css";

const PER_PAGE = 3;

export function Journal({ posts, headingLevel = 2 }: { posts: PostCard[]; headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const [page, setPage] = useState(0);
  const count = Math.ceil(posts.length / PER_PAGE);
  const shown = posts.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section id="journal" aria-labelledby="journal-title" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className="stack">
          <p className="eyebrow">Journal</p>
          <Heading id="journal-title" className="h2">
            Notes from <span className="accent">the chair.</span>
          </Heading>
        </div>

        <ul className={styles.grid}>
          {shown.map((p) => (
            <li key={p.slug}>
              {/* scroll={false}: the card opens as a modal over the page, which must stay where it is. */}
              <Link href={`/journal/${p.slug}`} scroll={false} className={styles.card}>
                <span className={styles.cover}>
                  {p.cover && (
                    <Image
                      src={p.cover.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                      placeholder={p.cover.lqip ? "blur" : "empty"}
                      blurDataURL={p.cover.lqip}
                      style={{ objectFit: "cover", objectPosition: p.cover.position }}
                    />
                  )}
                </span>
                <span className="label">{[p.tag, formatDate(p.date)].filter(Boolean).join(" · ")}</span>
                <span className={styles.title}>{p.title}</span>
                {p.excerpt && <span className={styles.excerpt}>{p.excerpt}</span>}
                <span className={styles.more} aria-hidden="true">
                  Read post
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Pager
          page={page}
          count={count}
          label="Journal pages"
          onChange={(n) => {
            setPage(n);
            scrollToId("journal");
          }}
        />
      </div>
    </section>
  );
}
