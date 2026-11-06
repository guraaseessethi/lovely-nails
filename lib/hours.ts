import type { DayHours } from "./types";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

/** "19:00" -> "7PM", "09:30" -> "9:30AM" */
export function formatTime(t: string, compact = false) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const mins = m ? `:${String(m).padStart(2, "0")}` : "";
  return compact ? `${hour}${mins}` : `${hour}${mins}${suffix}`;
}

function span(d: DayHours, compact: boolean) {
  if (d.closed || !d.open || !d.close) return "Closed";
  return `${formatTime(d.open, compact)} to ${formatTime(d.close, compact)}`;
}

/** Collapses consecutive days with identical hours: [{days: "Mon to Fri", hours: "10AM to 7PM"}, ...] */
export function groupHours(days: DayHours[], compact = false) {
  const rows: { days: string; hours: string }[] = [];
  let i = 0;
  while (i < days.length) {
    let j = i;
    const value = span(days[i], compact);
    while (j + 1 < days.length && span(days[j + 1], compact) === value) j++;
    const first = SHORT[days[i].day] ?? days[i].day;
    const last = SHORT[days[j].day] ?? days[j].day;
    rows.push({ days: i === j ? first : `${first} to ${last}`, hours: value });
    i = j + 1;
  }
  return rows;
}

/** Short one-liner for the menu sheet, open days only: "Mon to Fri 10 to 7 · Sat 10 to 4" */
export function hoursSummary(days: DayHours[]) {
  return groupHours(days, true)
    .filter((r) => r.hours !== "Closed")
    .map((r) => `${r.days} ${r.hours}`)
    .join(" · ");
}
