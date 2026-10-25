#!/usr/bin/env node
/**
 * Local site audit for History: Church of Pakistan.
 * Hits live routes on BASE_URL (default http://127.0.0.1:4000),
 * writes docs/AUDIT_REPORT.md — no invented content checks beyond presence.
 */
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");
const BASE = process.env.AUDIT_BASE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:4000";

const ROUTES = [
  "/",
  "/about",
  "/archive",
  "/interviews",
  "/churches",
  "/people",
  "/contribute",
  "/sources",
  "/blog",
];

const REQUIRED_FILES = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/content/homepage.ts",
  "src/content/cathedrals.ts",
  "src/content/sources.ts",
  "src/content/nav.ts",
  "src/content/family-archives.ts",
  "src/styles/tokens.css",
  "src/lib/fonts.ts",
  "public/media/founder/founder-portrait-hero.webp",
  "public/media/founder/founder-portrait-square.webp",
];

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(relative(root, p));
  }
  return acc;
}

async function probe(path) {
  const url = `${BASE.replace(/\/$/, "")}${path}`;
  const started = Date.now();
  try {
    const res = await fetch(url, { redirect: "manual" });
    const text = await res.text();
    const ms = Date.now() - started;
    const checks = {
      hasMain: /id=["']main["']/.test(text),
      hasHeader: /Primary|site-header|History: Church of Pakistan/.test(text),
      hasFooter: /Sources|Contribute|footer/i.test(text),
      noFakeSuccess:
        path !== "/contribute" ||
        !/thank you for (your )?submission|successfully submitted/i.test(text),
      forthcomingHonest:
        !["/interviews", "/people"].includes(path) ||
        /forthcoming|coming soon/i.test(text),
    };
    return {
      path,
      url,
      status: res.status,
      ok: res.status === 200,
      bytes: text.length,
      ms,
      checks,
    };
  } catch (err) {
    return {
      path,
      url,
      status: 0,
      ok: false,
      bytes: 0,
      ms: Date.now() - started,
      error: String(err?.message ?? err),
      checks: {},
    };
  }
}

const fileChecks = REQUIRED_FILES.map((f) => ({
  file: f,
  present: existsSync(join(root, f)),
}));

const appPages = walk(join(root, "src/app")).filter((f) => f.endsWith("page.tsx"));
const results = [];
for (const route of ROUTES) {
  results.push(await probe(route));
}

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);
const missingFiles = fileChecks.filter((f) => !f.present);
const failedChecks = results.filter((r) => Object.values(r.checks).some((ok) => !ok));

const now = new Date().toISOString();
const lines = [
  `# Site Audit Report — History: Church of Pakistan`,
  ``,
  `- Generated: ${now}`,
  `- Base URL: ${BASE}`,
  `- Routes probed: ${ROUTES.length}`,
  `- HTTP 200: ${passed}/${ROUTES.length}`,
  `- Required files missing: ${missingFiles.length}`,
  ``,
  `## Route results`,
  ``,
  `| Route | Status | Bytes | ms | Notes |`,
  `|---|---:|---:|---:|---|`,
];

for (const r of results) {
  const notes = r.error
    ? `ERROR: ${r.error}`
    : Object.entries(r.checks)
        .filter(([, v]) => !v)
        .map(([k]) => `fail:${k}`)
        .join(", ") || "ok";
  lines.push(`| \`${r.path}\` | ${r.status} | ${r.bytes} | ${r.ms} | ${notes} |`);
}

lines.push(
  ``,
  `## App Router pages found`,
  ``,
  ...appPages.map((p) => `- \`${p}\``),
  ``,
  `## Required file presence`,
  ``,
);

for (const f of fileChecks) {
  lines.push(`- ${f.present ? "✅" : "❌"} \`${f.file}\``);
}

lines.push(
  ``,
  `## Content / honesty gaps (manual)`,
  ``,
  `- Interviews: existing youth programs; additional oral-history interviews remain forthcoming. People biographies remain forthcoming.`,
  `- Archive: CMS-backed family records with source and verification notes.`,
  `- Contribute: no fake success when \`CONTRIBUTE_WEBHOOK_URL\` unset.`,
  `- Curator public name: **Javed Qadir Bakhsh**, confirmed in the content register.`,
  `- Cathedral photos: Faisalabad / Hyderabad / Raiwind remain permission-needed SVGs.`,
  `- Timeline & cathedral facts sourced from \`src/content/*\` only.`,
  ``,
  `## Summary`,
  ``,
  failed.length === 0 && missingFiles.length === 0 && failedChecks.length === 0
    ? `All probed routes returned HTTP 200 and required scaffold files are present.`
    : `Failures remain: ${failed.map((f) => f.path).join(", ") || "none (routes)"}; missing files: ${missingFiles.map((m) => m.file).join(", ") || "none"}; failed content checks: ${failedChecks.map((r) => r.path).join(", ") || "none"}.`,
  ``,
);

mkdirSync(join(root, "docs"), { recursive: true });
const out = join(root, "docs/AUDIT_REPORT.md");
writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out}`);
console.log(`Routes OK: ${passed}/${ROUTES.length}`);
if (failed.length || missingFiles.length || failedChecks.length) {
  console.error("Failed routes:", failed.map((f) => `${f.path} (${f.status || f.error})`).join("; "));
  process.exitCode = 1;
}
