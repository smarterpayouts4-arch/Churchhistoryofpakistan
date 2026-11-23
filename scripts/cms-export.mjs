#!/usr/bin/env node
/**
 * Download the live content from Vercel KV into data/cms/*.json, so edits
 * made in the online admin can be reviewed and committed to git.
 *
 *   node scripts/cms-export.mjs            # writes data/cms/*.json
 *   node scripts/cms-export.mjs --dry-run  # lists what would change
 *
 * Needs KV_REST_API_URL and KV_REST_API_TOKEN (values are never printed).
 * Only public content documents are exported — never accounts or
 * contributions.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry-run");
const url = (process.env.KV_REST_API_URL || "").replace(/\/$/, "");
const token = process.env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN (set them in your shell; see docs/DEPLOYMENT.md).");
  process.exit(1);
}

const DOCS = [
  "homepage.json",
  "home-layout.json",
  "site.json",
  "family-archives.json",
  "featured-interviews.json",
  "people-frames.json",
  "cathedrals.json",
  "curator-profile.json",
  "blog.json",
];

for (const name of DOCS) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(["GET", `cms:${name}`]),
  });
  if (!res.ok) throw new Error(`GET cms:${name} failed (${res.status})`);
  const raw = (await res.json()).result;
  if (!raw) {
    console.log(`${name}: not in KV yet (unchanged)`);
    continue;
  }
  const next = JSON.stringify(JSON.parse(raw), null, 2) + "\n";
  const file = join(root, "data", "cms", name);
  const current = existsSync(file) ? readFileSync(file, "utf8").replace(/\r\n/g, "\n") : "";
  if (current === next) {
    console.log(`${name}: same as git`);
    continue;
  }
  if (!dry) writeFileSync(file, next);
  console.log(`${name}: ${dry ? "would update" : "updated"}`);
}
