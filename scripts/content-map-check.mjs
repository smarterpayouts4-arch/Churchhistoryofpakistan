#!/usr/bin/env node
/**
 * Content-map check: crawl every public route and assert that strings and
 * images rendered on the page match the CMS values in data/cms/*.json
 * (the seed/fallback store; in KV mode these files are the seed source).
 * Usage: node scripts/content-map-check.mjs [baseUrl]
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const base = (process.argv[2] ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cms = (n) => JSON.parse(readFileSync(join(root, "data", "cms", n), "utf8"));
const home = cms("homepage.json"), site = cms("site.json"), cats = cms("cathedrals.json"),
  fam = cms("family-archives.json"), ints = cms("featured-interviews.json"),
  ppl = cms("people-frames.json"), blog = cms("blog.json");

const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ");
let pass = 0, fail = 0;
const failures = [];
async function check(route, strings = [], images = []) {
  const res = await fetch(`${base}${route}`);
  const html = await res.text();
  const text = strip(html);
  const miss = [];
  const expect404 = route === "/no-such-page-xyz";
  if (expect404 ? res.status !== 404 : res.status !== 200) miss.push(`HTTP ${res.status}`);
  for (const s of strings.filter(Boolean)) if (!text.includes(s.replace(/\s+/g, " "))) miss.push(`text: ${s.slice(0, 70)}…`);
  for (const src of images.filter(Boolean)) if (!html.includes(src) && !html.includes(encodeURIComponent(src))) miss.push(`img: ${src}`);
  if (miss.length) { fail++; failures.push(`${route} -> ${miss.join(" | ")}`); }
  else pass++;
}

await check("/", [home.hero.eyebrow, home.hero.intro, home.strapline, site.hero_ctas.primary_label, site.home_sections.purpose.heading, home.hero.purpose, home.timeline[0]?.title, site.home_sections.connection.heading, home.page_context.contribute_heading, home.guiding_principle.replace(/\.$/, ""), site.footer.about_copy], [home.hero.portrait, ...(home.hero.band_images ?? []).map(i => i.src)]);
await check("/about", [site.pages.about.title, home.hero.intro]);
await check("/archive", [site.pages.archive.eyebrow, fam.items[0]?.title], [fam.items[0]?.imageSrc]);
await check("/interviews", [home.page_context.interviews_intro, ints.items[0]?.title], [ints.items[0]?.posterSrc]);
await check("/churches", [site.pages.churches.title, cats.items[0]?.cathedral], []);
await check("/people", [home.page_context.people_intro, ppl.frames[0]?.title], [ppl.frames[0]?.src]);
await check("/contribute", [home.page_context.contribute_intro, site.pages.contribute_notice.strong], []);
await check("/sources", [site.pages.sources.title], []);
await check("/blog", blog.posts.filter(p=>p.status==="published").length ? blog.posts.filter(p=>p.status==="published").map(p=>p.title) : ["First stories are being prepared"], []);
await check("/no-such-page-xyz", [site.pages.not_found.title], []);
for (const p of blog.posts.filter(p=>p.status==="published")) await check(`/blog/${p.slug}`, [p.title, p.author], p.coverSrc ? [p.coverSrc] : []);

console.log(`content-map: ${pass} passed, ${fail} failed`);
for (const f of failures) console.log("FAIL", f);
process.exit(fail ? 1 : 0);
