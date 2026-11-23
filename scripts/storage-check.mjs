#!/usr/bin/env node
/** Report which storage the current environment selects. Prints names only, never values. */
const has = (k) => Boolean(process.env[k]);
const kv = has("KV_REST_API_URL") && has("KV_REST_API_TOKEN");
console.log({
  KV_REST_API_URL: has("KV_REST_API_URL"),
  KV_REST_API_TOKEN: has("KV_REST_API_TOKEN"),
  BLOB_READ_WRITE_TOKEN: has("BLOB_READ_WRITE_TOKEN"),
  CONTRIBUTIONS_BLOB_TOKEN: has("CONTRIBUTIONS_BLOB_TOKEN"),
  ADMIN_PASSWORD_HASH: has("ADMIN_PASSWORD_HASH"),
  ADMIN_SESSION_SECRET: has("ADMIN_SESSION_SECRET"),
  content: kv ? "vercel-kv" : "files (data/cms)",
  media: has("BLOB_READ_WRITE_TOKEN") ? "vercel-blob" : "local (public/media/uploads)",
});
