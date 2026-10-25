"use client";

import { useEffect } from "react";

/**
 * Tasteful scroll reveal: sections fade/rise 10px as they enter.
 * Progressive enhancement only — markup is fully visible without JS,
 * and nothing is hidden when the user prefers reduced motion.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main .section, main .pageHeader, main .pageBody",
      ),
    );
    if (els.length === 0) return;

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
      { threshold: 0.02, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
