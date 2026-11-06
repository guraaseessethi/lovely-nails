// Custom in-page scrolling that matches the approved prototype:
// easeInOutCubic, duration = clamp(520ms, distance * 0.35, 950ms).

let frame = 0;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToY(target: number) {
  const scroller = document.scrollingElement ?? document.documentElement;
  const start = scroller.scrollTop;
  const end = Math.max(0, Math.min(target, scroller.scrollHeight - window.innerHeight));
  const distance = end - start;
  if (Math.abs(distance) < 2) return;

  cancelAnimationFrame(frame);
  if (prefersReducedMotion()) {
    scroller.scrollTop = end;
    return;
  }

  const duration = Math.min(950, Math.max(520, Math.abs(distance) * 0.35));
  let startTime: number | null = null;

  // Any user input cancels the animation so we never fight the reader.
  const cancel = () => cancelAnimationFrame(frame);
  window.addEventListener("wheel", cancel, { once: true, passive: true });
  window.addEventListener("touchstart", cancel, { once: true, passive: true });

  const step = (now: number) => {
    if (startTime === null) startTime = now;
    const progress = Math.min(1, (now - startTime) / duration);
    scroller.scrollTop = start + distance * easeInOutCubic(progress);
    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    }
  };
  frame = requestAnimationFrame(step);
}

/** Smooth-scrolls to an element id and moves keyboard focus there. Returns false if the id is not on this page. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.getBoundingClientRect().top + window.scrollY;
  scrollToY(top);
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
  return true;
}
