import Image from "next/image";
import { groupHours } from "@/lib/hours";
import type { DayHours, Img, Settings } from "@/lib/types";
import { AskApril } from "./AskApril";
import styles from "./Visit.module.css";

export function mapQuery(s: Settings) {
  return [s.businessName, [s.street, s.unit].filter(Boolean).join(" "), s.city, [s.region, s.postalCode].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

export function directionsUrl(s: Settings) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery(s))}`;
}

type Props = { settings: Settings; hours: DayHours[]; background?: Img };

export function Visit({ settings, hours, background }: Props) {
  const q = encodeURIComponent(mapQuery(settings));
  const hasAddress = Boolean(settings.street && settings.city);

  return (
    <section id="visit" aria-labelledby="visit-title" className={styles.section}>
      {background && (
        <>
          <Image src={background.src} alt="" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: background.position }} />
          <div aria-hidden="true" className={styles.wash} />
        </>
      )}
      <div className={`container ${styles.grid}`}>
        <div className={styles.card}>
          {settings.logo && (
            <Image
              src={settings.logo.src}
              alt={settings.logo.alt}
              width={120}
              height={Math.round((120 * settings.logo.height) / settings.logo.width)}
              className={styles.logo}
            />
          )}
          <h2 id="visit-title" className={`h2 ${styles.title}`}>
            Come visit.
            <br />
            <span className="accent">We saved you a chair.</span>
          </h2>

          <dl className={styles.facts}>
            <div>
              <dt className="label">Address</dt>
              <dd>
                {hasAddress ? (
                  <address>
                    {[settings.street, settings.unit].filter(Boolean).join(", ")}
                    <br />
                    {settings.city}, {settings.region} {settings.postalCode}
                    {settings.landmark && (
                      <>
                        <br />
                        <span className={styles.landmark}>{settings.landmark}</span>
                      </>
                    )}
                  </address>
                ) : (
                  <AskApril>address</AskApril>
                )}
              </dd>
            </div>
            <div>
              <dt className="label">Hours</dt>
              <dd>
                {hours.length ? (
                  <ul className={styles.hours}>
                    {groupHours(hours).map((r) => (
                      <li key={r.days}>
                        {r.days} · {r.hours}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <AskApril>opening hours</AskApril>
                )}
              </dd>
            </div>
            <div>
              <dt className="label">Phone</dt>
              <dd>
                {settings.phoneE164 ? (
                  <a href={`tel:${settings.phoneE164}`} className={styles.contact}>
                    {settings.phone}
                  </a>
                ) : (
                  <AskApril>phone</AskApril>
                )}
              </dd>
            </div>
            <div>
              <dt className="label">Email</dt>
              <dd>
                {settings.email ? (
                  <a href={`mailto:${settings.email}`} className={styles.contact}>
                    {settings.email}
                  </a>
                ) : (
                  <AskApril>email</AskApril>
                )}
              </dd>
            </div>
          </dl>

          <div className="btnRow">
            {settings.phoneE164 && (
              <a href={`tel:${settings.phoneE164}`} className="btn btnCyan">
                Call to book
              </a>
            )}
            {hasAddress && (
              <a href={directionsUrl(settings)} className="btn btnOutline" rel="noopener" target="_blank">
                Get directions
                <span className="visuallyHidden">(opens Google Maps in a new tab)</span>
              </a>
            )}
          </div>
        </div>

        <div className={styles.map}>
          {hasAddress && (
            <iframe
              title={`Map showing ${settings.businessName} at ${settings.street}, ${settings.city}`}
              src={`https://www.google.com/maps?q=${q}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}
