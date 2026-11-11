import Image from "next/image";
import type { Img } from "@/lib/types";
import styles from "./CleanBand.module.css";

// "Our Standards of Care, Cleanliness & Safety", wording from April's document (Nov 2026).
const STANDARDS = [
  {
    title: "Professional tool sterilization",
    text: "Reusable metal implements are thoroughly cleaned, disinfected as required, and sterilized in an autoclave according to health inspection procedures.",
  },
  {
    title: "Surface disinfection",
    text: "Manicure tables, pedicure stations, chairs and other work surfaces are cleaned and disinfected between every client using professional-grade disinfectants.",
  },
  {
    title: "Single-use supplies",
    text: "Disposable items are used only once and safely discarded after each service.",
  },
  {
    title: "Daily hygiene practices",
    text: "Our team follows consistent cleaning and sanitation procedures to maintain a clean, safe and welcoming environment.",
  },
];

export function CleanBand({ background }: { background?: Img }) {
  return (
    <section id="care" aria-labelledby="clean-title" className={`${styles.band} onDark`}>
      {background && (
        <Image
          src={background.src}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: background.position }}
        />
      )}
      <div aria-hidden="true" className={styles.overlay} />
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={styles.eyebrow}>Clean. Always.</p>
          <h2 id="clean-title" className={styles.title}>
            Our Standards of <span className="accent">Care, Cleanliness &amp; Safety</span>
          </h2>
          <p className={styles.text}>
            At Lovely Nails, your health, safety and comfort are our top priorities. We take pride in maintaining high
            standards of cleanliness and sanitation throughout our salon.
          </p>
        </div>

        <ul className={styles.list}>
          {STANDARDS.map((s, i) => (
            <li key={s.title} className={styles.item}>
              <span aria-hidden="true" className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.itemTitle}>{s.title}</h3>
              <p className={styles.itemText}>{s.text}</p>
            </li>
          ))}
        </ul>

        <p className={styles.closing}>
          Your trust is important to us. We are committed to providing every client with a beautiful experience in an
          environment where cleanliness, safety and care come first.
        </p>
      </div>
    </section>
  );
}
