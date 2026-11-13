"use client";

import { useState, type ReactNode } from "react";
import { scrollToId } from "@/lib/smoothScroll";
import { Pager } from "./Pager";
import styles from "./Services.module.css";

type Page = { label: string; content: ReactNode };

/**
 * The menu, one page at a time: tabs name each page's groups, page numbers sit underneath.
 * Every page stays in the HTML (hidden, not removed) so search engines still see the full menu.
 */
export function ServicePages({ pages }: { pages: Page[] }) {
  const [page, setPage] = useState(0);

  return (
    <>
      {pages.length > 1 && (
        <div role="group" aria-label="Service categories" className={styles.tabs}>
          {pages.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={i === page}
              className={`${styles.tab} ${i === page ? styles.on : ""}`}
              onClick={() => setPage(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.card} aria-live="polite">
        {pages.map((p, i) => (
          <div key={p.label} hidden={i !== page}>
            {p.content}
          </div>
        ))}
      </div>

      <Pager
        page={page}
        count={pages.length}
        label="Service pages"
        onChange={(n) => {
          setPage(n);
          scrollToId("services");
        }}
      />
    </>
  );
}
