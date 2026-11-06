"use client";

import { useSyncExternalStore } from "react";
import { formatTime } from "@/lib/hours";
import type { DayHours } from "@/lib/types";
import { ScrollLink } from "./ScrollLink";
import styles from "./TodayPill.module.css";

// The salon's clock, not the visitor's.
function torontoNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

function label(hours: DayHours[]) {
  if (hours.length === 0) return "Hours";
  const { day, minutes } = torontoNow();
  const today = hours.find((d) => d.day === day);
  if (!today || today.closed || !today.open || !today.close) return "Closed today";
  if (minutes < toMinutes(today.open)) return `Opens ${formatTime(today.open)}`;
  if (minutes < toMinutes(today.close)) return `Open until ${formatTime(today.close)}`;
  return "Closed now";
}

const subscribe = () => () => {};

/** Mobile header pill. Server renders a neutral label; the client fills in today's status. */
export function TodayPill({ hours, className = "" }: { hours: DayHours[]; className?: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => label(hours),
    () => "Hours",
  );
  return (
    <ScrollLink to="visit" className={`${styles.pill} ${className}`}>
      {text}
    </ScrollLink>
  );
}
