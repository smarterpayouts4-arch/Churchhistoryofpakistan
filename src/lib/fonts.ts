import { Fraunces, Inter } from "next/font/google";

/**
 * Redesign (Emerald & Gilt): Fraunces (display serif, optical sizing) + Inter (body/UI).
 * Self-hosted at build time by next/font — no runtime Google Fonts requests (CSP-safe).
 */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
