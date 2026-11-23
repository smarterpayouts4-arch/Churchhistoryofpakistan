"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Tasteful scroll reveal: sections fade and rise 12px as they enter.
 * Progressive enhancement only — markup is fully visible without JS,
 * anything already on screen is shown at once (no flash), and nothing
 * moves when the visitor prefers reduced motion. Re-runs on navigation.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main .section, main .pageBody > *, main [data-reveal]",
      ),
    ).filter((el) => !el.classList.contains("is-visible"));
    if (els.length === 0) return;

    const fold = window.innerHeight * 0.94;
    for (const el of els) {
      if (el.getBoundingClientRect().top < fold) el.classList.add("is-visible");
    }
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.04, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
