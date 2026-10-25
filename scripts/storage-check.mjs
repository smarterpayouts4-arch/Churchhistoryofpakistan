#!/usr/bin/env node
/** Report which CMS storage backend the current env selects. Names only. */
console.log({
  KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
  KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
  BLOB_READ_WRITE_TOKEN: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  backend: process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN ? "vercel-kv" : "file",
  media: process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "local-public/media",
});
