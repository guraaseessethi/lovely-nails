import type { Service, ServiceGroup } from "@/lib/types";
import { AskApril } from "./AskApril";
import styles from "./Services.module.css";

const GROUP_LABELS: Record<ServiceGroup, string> = {
  Nails: "Nails",
  Pedicure: "Pedicures",
  Skin: "Skin",
  Waxing: "Waxing",
};

export function Services({ services, headingLevel = 2 }: { services: Service[]; headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const groups = Object.keys(GROUP_LABELS)
    .map((g) => ({ group: g as ServiceGroup, items: services.filter((s) => s.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <section id="services" aria-labelledby="services-title" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className="sectionHead">
          <div className="stack">
            <p className="eyebrow">Services</p>
            <Heading id="services-title" className="h2">
              The Menu.
              <br />
              <span className="accent">Crafted with care.</span>
            </Heading>
          </div>
          <p className={styles.note}>
            Prices are a starting point. Ask about add-ons and custom designs when you call. We use OPI, CND Shellac,
            Bio Seaweed Gel and CND Solar.
          </p>
        </div>

        <div className={styles.card}>
          {groups.length === 0 && (
            <p className={styles.empty}>
              <AskApril>the current service menu and prices</AskApril>
            </p>
          )}
          {groups.map(({ group, items }) => (
            <div key={group} className={styles.group}>
              <h3 className={`label ${styles.groupLabel}`}>{GROUP_LABELS[group]}</h3>
              <ul className={styles.list}>
                {items.map((s) => (
                  <li key={s.id} className={styles.item}>
                    <div className={styles.row}>
                      <h4 className={styles.name}>{s.name}</h4>
                      <span className={styles.price}>{s.price || <AskApril>price</AskApril>}</span>
                    </div>
                    {s.description && <p className={styles.desc}>{s.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
