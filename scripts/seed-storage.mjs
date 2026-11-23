#!/usr/bin/env node
/**
 * Copy the bundled content (data/cms/*.json) into Vercel KV / Upstash Redis.
 *
 *   node scripts/seed-storage.mjs            # only fills keys that are empty
 *   node scripts/seed-storage.mjs --force    # overwrite what editors saved online
 *   node scripts/seed-storage.mjs --dry-run
 *
 * Needs KV_REST_API_URL and KV_REST_API_TOKEN in the shell (names only —
 * values are never printed). The site also seeds empty keys on first read,
 * so this is optional. Accounts, the media index and contributions are
 * never touched.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const url = (process.env.KV_REST_API_URL || "").replace(/\/$/, "");
const token = process.env.KV_REST_API_TOKEN;
if (!url || !token) {
  console.error("Missing KV_REST_API_URL or KV_REST_API_TOKEN (set them in your shell; see docs/DEPLOYMENT.md).");
  process.exit(1);
}

async function kv(command) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`${command[0]} failed (${res.status})`);
  return (await res.json()).result;
}

const dir = join(root, "data", "cms");
for (const name of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const doc = readFileSync(join(dir, name), "utf8");
  JSON.parse(doc); // fail loudly on a broken file
  const key = `cms:${name}`;
  if (dry) {
    console.log(`dry-run: would ${force ? "overwrite" : "fill if empty"} ${key}`);
    continue;
  }
  const command = ["SET", key, JSON.stringify(JSON.parse(doc))];
  if (!force) command.push("NX");
  const result = await kv(command);
  console.log(`${key}: ${result === "OK" ? (force ? "overwritten" : "seeded") : "kept (already has content)"}`);
}
console.log("Done.");
