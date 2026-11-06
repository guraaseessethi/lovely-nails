import Image from "next/image";
import type { Img } from "@/lib/types";
import styles from "./CleanBand.module.css";

export function CleanBand({ background }: { background?: Img }) {
  return (
    <section aria-labelledby="clean-title" className={`${styles.band} onDark`}>
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
        <h2 id="clean-title" className={styles.title}>
          Clean. <span className="accent">Always.</span>
        </h2>
        <p className={styles.text}>
          Tools are sanitized for every client and stations stay spotless, so everyone from kids to seniors feels
          comfortable in the chair.
        </p>
      </div>
    </section>
  );
}
