import { Fraunces, Inter } from "next/font/google";

/**
 * Redesign (Emerald & Gilt): Fraunces (display serif, optical sizing) + Inter (body/UI).
 * Self-hosted at build time by next/font — no runtime Google Fonts requests (CSP-safe).
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal"],
  variable: "--font-fraunces",
  display: "swap",
});

/**
 * Fraunces italic is used only for a few display accents (hero kicker,
 * pull-quotes, footer strapline). Keeping it in its own non-preloaded face
 * takes ~118 KB off the critical path of every page; it swaps in on use.
 */
export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["italic"],
  variable: "--font-fraunces-italic",
  display: "swap",
  preload: false,
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
