/** "2026-11-05" -> "Nov 5, 2026". Fixed locale and UTC so server and client always agree. */
export function formatDate(date?: string) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
