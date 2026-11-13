import { SERVICE_GROUPS, type Service, type ServiceGroup } from "@/lib/types";
import { AskApril } from "./AskApril";
import { ServicePages } from "./ServicePages";
import styles from "./Services.module.css";

const GROUP_LABELS: Record<ServiceGroup, string> = {
  "Natural nails": "Natural nails",
  Enhancements: "Nail enhancements and extensions",
  Waxing: "Waxing",
  Facials: "Facials",
  "Foot massage": "Foot massage",
  Kids: "Children's services (10 and under)",
};

// Short names for the page tabs.
const TAB_LABELS: Record<ServiceGroup, string> = {
  "Natural nails": "Natural nails",
  Enhancements: "Enhancements",
  Waxing: "Waxing",
  Facials: "Facials",
  "Foot massage": "Foot massage",
  Kids: "Kids",
};

// Whole groups are kept together on a page; small groups share one.
const MAX_PER_PAGE = 16;

// Footnotes from the 2026 price list.
const GROUP_NOTES: Partial<Record<ServiceGroup, string>> = {
  Enhancements: "Prices vary with length and design.",
};

export function Services({ services, headingLevel = 2 }: { services: Service[]; headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const groups = SERVICE_GROUPS.map((group) => ({ group, items: services.filter((s) => s.group === group) })).filter(
    (g) => g.items.length > 0,
  );

  const pages: (typeof groups)[] = [];
  for (const g of groups) {
    const last = pages.at(-1);
    const count = last?.reduce((n, x) => n + x.items.length, 0) ?? Infinity;
    if (last && count + g.items.length <= MAX_PER_PAGE) last.push(g);
    else pages.push([g]);
  }

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
            Prices are a starting point. Ask about add-ons and custom designs when you call. Walk-ins are welcome, but
            appointments are highly recommended.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className={styles.card}>
            <p className={styles.empty}>
              <AskApril>the current service menu and prices</AskApril>
            </p>
          </div>
        ) : (
          <ServicePages
            pages={pages.map((page) => ({
              label: page.map(({ group }) => TAB_LABELS[group]).join(" · "),
              content: page.map(({ group, items }) => (
                <div key={group} className={styles.group}>
                  <h3 className={`label ${styles.groupLabel}`}>{GROUP_LABELS[group]}</h3>
                  {GROUP_NOTES[group] && <p className={styles.groupNote}>{GROUP_NOTES[group]}</p>}
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
              )),
            }))}
          />
        )}
      </div>
    </section>
  );
}
