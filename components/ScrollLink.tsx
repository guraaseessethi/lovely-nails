"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToId } from "@/lib/smoothScroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Section id on the homepage, e.g. "services" */
  to: string;
  /** Runs before scrolling, e.g. to close the menu sheet */
  onNavigate?: () => void;
};

/** In-page link: smooth-scrolls on the homepage, navigates to /#id from other pages. */
export function ScrollLink({ to, onNavigate, onClick, ...rest }: Props) {
  const pathname = usePathname();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    onNavigate?.();
    if (pathname !== "/") return;
    e.preventDefault();
    // Let any overlay release its scroll lock before animating.
    setTimeout(() => scrollToId(to), 0);
  };

  return <Link href={`/#${to}`} scroll={pathname !== "/"} onClick={handle} {...rest} />;
}
