import type { ReactNode } from "react";

/** Visible marker for content that is still waiting on April. Never replaced with a made-up value. */
export function AskApril({ children }: { children: ReactNode }) {
  return <span className="askApril">[Ask April: {children}]</span>;
}

/** Renders `value`, or the Ask April marker when it is missing. */
export function OrAsk({ value, ask }: { value?: ReactNode; ask: string }) {
  return value ? <>{value}</> : <AskApril>{ask}</AskApril>;
}
