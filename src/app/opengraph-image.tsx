import { ImageResponse } from "next/og";
import { loadHomepage } from "@/content/homepage";

export const alt = "History: Church of Pakistan — a living archive of faith and memory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social-share card in the site's own palette (parchment, burgundy, ink). */
export default async function OpengraphImage() {
  const homepage = await loadHomepage();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3e7cf",
          color: "#292522",
          padding: "72px 80px",
          borderBottom: "14px solid #6d2227",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#6d2227" }}>
          {homepage.hero.eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, fontFamily: "serif" }}>{homepage.site_title}</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#5c4a3d" }}>{homepage.strapline}</div>
        </div>
        <div style={{ display: "flex", width: 220, height: 3, background: "#af8b58" }} />
      </div>
    ),
    size,
  );
}
