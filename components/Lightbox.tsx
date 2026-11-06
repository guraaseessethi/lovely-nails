"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useDialog } from "@/lib/useDialog";
import type { Img } from "@/lib/types";
import { Icon } from "./Icon";
import styles from "./Lightbox.module.css";

export type LightboxItem = Img & { key: string; title?: string; meta?: string; unoptimized?: boolean };

type Props = {
  items: LightboxItem[];
  index: number | null;
  onIndex: (index: number | null) => void;
  label: string;
};

/** Photo viewer: white rounded frame over a dark backdrop, prev/next, "N of M", Esc or backdrop click to close. */
export function Lightbox({ items, index, onIndex, label }: Props) {
  const ref = useRef<HTMLElement>(null);
  const open = index !== null && items.length > 0;
  const close = useCallback(() => onIndex(null), [onIndex]);
  useDialog(ref, open, close);

  const i = open ? Math.min(index, items.length - 1) : 0;
  const go = useCallback((delta: number) => onIndex((i + delta + items.length) % items.length), [i, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (!open) return null;
  const item = items[i];

  return (
    <div className={styles.backdrop} onClick={close}>
      <figure
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={styles.frame}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} aria-label="Close photo" onClick={close}>
          <Icon name="close" strokeWidth={1.8} />
        </button>
        <div className={styles.photo}>
          <Image
            key={item.key}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(min-width: 700px) 620px, 100vw"
            placeholder={item.lqip ? "blur" : "empty"}
            blurDataURL={item.lqip}
            unoptimized={item.unoptimized}
            className={styles.img}
          />
        </div>
        <figcaption className={styles.caption}>
          <div className={styles.text}>
            <span className="label" aria-live="polite">
              {[item.meta, `${i + 1} of ${items.length}`].filter(Boolean).join(" · ")}
            </span>
            {item.title && <span className={styles.title}>{item.title}</span>}
          </div>
          {items.length > 1 && (
            <div className={styles.nav}>
              <button type="button" className="iconBtn" aria-label="Previous photo" onClick={() => go(-1)}>
                <Icon name="left" size={16} strokeWidth={1.8} />
              </button>
              <button type="button" className={`iconBtn ${styles.next}`} aria-label="Next photo" onClick={() => go(1)}>
                <Icon name="right" size={16} strokeWidth={1.8} />
              </button>
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  );
}
