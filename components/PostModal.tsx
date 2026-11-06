"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, type ReactNode } from "react";
import { useDialog } from "@/lib/useDialog";
import { Icon } from "./Icon";
import styles from "./PostModal.module.css";

/** Journal post opened from a card: overlays the page; closing goes back, so the page keeps its scroll position. */
export function PostModal({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => router.back(), [router]);
  useDialog(ref, true, close);

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={styles.dialog}>
        <button type="button" className={styles.close} aria-label="Close post" onClick={close}>
          <Icon name="close" strokeWidth={1.8} />
        </button>
        {children}
      </div>
    </div>
  );
}
