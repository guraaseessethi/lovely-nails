"use client";

import { Icon } from "./Icon";
import styles from "./Pager.module.css";

type Props = { page: number; count: number; onChange: (page: number) => void; label: string };

/** Page numbers with previous/next. `page` is zero-based. */
export function Pager({ page, count, onChange, label }: Props) {
  if (count <= 1) return null;
  return (
    <nav aria-label={label} className={styles.pager}>
      <button
        type="button"
        className={styles.btn}
        aria-label="Previous page"
        disabled={page === 0}
        onClick={() => onChange(page - 1)}
      >
        <Icon name="left" size={16} />
      </button>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`${styles.btn} ${i === page ? styles.current : ""}`}
          aria-current={i === page ? "page" : undefined}
          aria-label={`Page ${i + 1}`}
          onClick={() => i !== page && onChange(i)}
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        className={styles.btn}
        aria-label="Next page"
        disabled={page >= count - 1}
        onClick={() => onChange(page + 1)}
      >
        <Icon name="right" size={16} />
      </button>
    </nav>
  );
}
