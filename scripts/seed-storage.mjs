#!/usr/bin/env node
/**
 * Seed Vercel KV (Upstash Redis REST) from data/cms/*.json.
 * Usage: KV_REST_API_URL=... KV_REST_API_TOKEN=... node scripts/seed-storage.mjs [--dry-run]
 * Never prints token values. Existing KV keys are overwritten with the
 * bundled file content — run only when you intend files to win.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry-run");
const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN (names only — set them in your shell/Vercel env).");
  process.exit(1);
}
const dir = join(root, "data", "cms");
for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const doc = JSON.parse(readFileSync(join(dir, name), "utf8"));
  const key = `cms:${name}`;
  if (dry) { console.log(`dry-run would SET ${key} (${JSON.stringify(doc).length} bytes)`); continue; }
  const res = await fetch(`${url.replace(/\/$/, "")}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) { console.error(`SET ${key} failed (${res.status})`); process.exit(1); }
  console.log(`SET ${key} ok`);
}
console.log("Seed complete.");
