"use client";

import { useCallback, useId, useRef, useState } from "react";
import { useDialog } from "@/lib/useDialog";
import { Icon } from "./Icon";
import styles from "./BookButton.module.css";

type Props = {
  phone?: string;
  phoneE164?: string;
  email?: string;
  className?: string;
  label?: string;
};

const SMS_BODY = "Hi Lovely Nails, I'd like to book an appointment for ";
const EMAIL_SUBJECT = "Appointment request";
const EMAIL_BODY = "Hi Lovely Nails,\n\nI'd like to book:\nService:\nPreferred day and time:\nName:\nPhone:\n\nThank you!";

/** "Book now" button that opens a bottom sheet (same style as the mobile menu) with Call, Text and Email. */
export function BookButton({ phone, phoneE164, email, className, label = "Book now" }: Props) {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const titleId = useId();
  useDialog(sheet, open, close);

  if (!phoneE164 && !email) return null;

  const options = [
    phoneE164 && { href: `tel:${phoneE164}`, icon: "phone" as const, title: "Call the salon", detail: phone ?? phoneE164 },
    phoneE164 && {
      // "?&body=" works on both iPhone and Android.
      href: `sms:${phoneE164}?&body=${encodeURIComponent(SMS_BODY)}`,
      icon: "message" as const,
      title: "Send a text",
      detail: phone ?? phoneE164,
    },
    email && {
      href: `mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}&body=${encodeURIComponent(EMAIL_BODY)}`,
      icon: "mail" as const,
      title: "Send an email",
      detail: email,
    },
  ].filter(Boolean) as { href: string; icon: "phone" | "message" | "mail"; title: string; detail: string }[];

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className={styles.backdrop} onClick={close}>
          <div
            ref={sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={styles.sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <span aria-hidden="true" className={styles.handle} />
            <div className={styles.head}>
              <h2 id={titleId} className={styles.title}>
                Book an appointment
              </h2>
              <button type="button" className={styles.closeBtn} aria-label="Close" onClick={close}>
                <Icon name="close" />
              </button>
            </div>
            <ul className={styles.list}>
              {options.map((o) => (
                <li key={o.icon}>
                  <a href={o.href} className={styles.item} onClick={close}>
                    <span className={styles.icon}>
                      <Icon name={o.icon} size={20} />
                    </span>
                    <span className={styles.text}>
                      <span className={styles.itemTitle}>{o.title}</span>
                      <span className={styles.detail}>{o.detail}</span>
                    </span>
                    <Icon name="right" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
