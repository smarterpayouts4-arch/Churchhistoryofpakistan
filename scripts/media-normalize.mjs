#!/usr/bin/env node
/**
 * Normalize the site's media and refresh the media manifest.
 *
 *   npm run media:normalize                 # images: orientation, size cap, manifest (blur + dimensions)
 *   npm run media:normalize -- --videos     # also re-encode videos (needs ffmpeg + ffprobe on PATH)
 *   npm run media:normalize -- --dry-run    # report only
 *
 * Images (JPEG/PNG/WebP under public/media):
 *   - EXIF orientation is applied to the pixels (then stripped)
 *   - anything larger than MAX_EDGE px on the long edge is scaled down
 *   - small images are NOT upscaled (that adds no detail); they are listed
 *   - every image gets a tiny blur placeholder + width/height in
 *     src/lib/media/media-meta.json, used by next/image and the gallery tiles
 * Videos (MP4/MOV/WebM under public/media), with --videos:
 *   - baked-in black bars are detected (ffmpeg cropdetect) and cropped
 *   - re-encoded to H.264 High / yuv420p, CRF 23 with a size-based bitrate cap, long edge <= 1280,
 *     <= 30 fps, AAC-LC 128 kb/s stereo, loudness-normalised, +faststart
 *   - a poster JPEG (<name>-poster.jpg) is regenerated from the new file
 *   - files that already comply (H.264 + AAC, yuv420p, faststart, no rotation,
 *     no bars, <= 1280 px, <= 30 fps, <= 1.2 Mb/s) are left untouched to avoid a needless
 *     generation loss; --force re-encodes them anyway
 * Every file that is changed is first copied, untouched, to media-originals/
 * (gitignored). Nothing is ever deleted.
 */
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(root, "public");
const MEDIA = path.join(PUBLIC, "media");
const ORIGINALS = path.join(root, "media-originals");
const MANIFEST = path.join(root, "src", "lib", "media", "media-meta.json");
const MAX_EDGE = 2560;
const SMALL_EDGE = 900;
const VIDEO_MAX_EDGE = 1280;
const TAG = "hcop-normalized-v1";
const args = new Set(process.argv.slice(2));
const dry = args.has("--dry-run");
const doVideos = args.has("--videos");
const force = args.has("--force");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".m4v"]);

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const urlOf = (p) => "/" + path.relative(PUBLIC, p).split(path.sep).join("/");

async function backup(file) {
  const dest = path.join(ORIGINALS, path.relative(PUBLIC, file));
  if (existsSync(dest)) return dest; // keep the first, truly original copy
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(file, dest);
  return dest;
}

async function blurFor(input) {
  const buf = await sharp(input).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

const report = { changed: [], small: [], videos: [] };
const manifest = {};

const files = (await walk(MEDIA)).sort();

/* ------------------------------ posters -------------------------------- */
// Video posters often carry the clip's baked-in black bars; trim them so the
// preview frame shows the picture, not the bars.
async function trimPoster(file) {
  const input = await fs.readFile(file);
  const m = await sharp(input).metadata();
  const { info } = await sharp(input).trim({ background: "#000000", threshold: 28 }).toBuffer({ resolveWithObject: true });
  const shrunk = info.width < m.width * 0.92 || info.height < m.height * 0.92;
  const sane = info.width * info.height >= m.width * m.height * 0.4;
  if (!shrunk || !sane) return null;
  if (!dry) {
    await backup(file);
    const out = await sharp(input).trim({ background: "#000000", threshold: 28 }).jpeg({ quality: 88, mozjpeg: true, progressive: true }).toBuffer();
    await fs.writeFile(file, out);
  }
  return `${m.width}x${m.height} -> ${info.width}x${info.height}`;
}
for (const file of files) {
  if (!/-poster\.jpe?g$/i.test(file)) continue;
  const r = await trimPoster(file);
  if (r) report.changed.push({ url: urlOf(file), poster: `black bars trimmed ${r}` });
}

/* ------------------------------- images -------------------------------- */
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (!IMAGE_EXT.has(ext)) continue;
  const url = urlOf(file);
  const before = await fs.stat(file);
  let meta = await sharp(file).metadata();
  const orientation = meta.orientation ?? 1;
  const w0 = orientation >= 5 ? meta.height : meta.width;
  const h0 = orientation >= 5 ? meta.width : meta.height;
  const long = Math.max(w0, h0);
  if ((orientation !== 1 || long > MAX_EDGE) && !dry) {
    await backup(file);
    const input = await fs.readFile(file);
    let pipe = sharp(input).rotate();
    if (long > MAX_EDGE) pipe = pipe.resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });
    pipe = pipe.withIccProfile("srgb");
    if (ext === ".png") pipe = pipe.png({ compressionLevel: 9 });
    else if (ext === ".webp") pipe = pipe.webp({ quality: 88 });
    else pipe = pipe.jpeg({ quality: 88, mozjpeg: true, progressive: true });
    await fs.writeFile(file, await pipe.toBuffer());
    meta = await sharp(file).metadata();
    report.changed.push({ url, from: `${w0}x${h0} ${before.size}B o${orientation}`, to: `${meta.width}x${meta.height} ${(await fs.stat(file)).size}B` });
  }
  const width = orientation >= 5 && dry ? h0 : meta.width;
  const height = orientation >= 5 && dry ? w0 : meta.height;
  if (Math.max(width, height) < SMALL_EDGE) report.small.push(`${url} (${width}x${height})`);
  manifest[url] = { w: width, h: height, blur: await blurFor(file) };
}

/* ------------------------------- videos -------------------------------- */
function run(cmd, argv) {
  const r = spawnSync(cmd, argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  return r;
}
function probe(file) {
  const r = run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file]);
  return JSON.parse(r.stdout);
}
/** moov atom before mdat = playback can start before the whole file downloads. */
async function isFaststart(file) {
  const fh = await fs.open(file, "r");
  try {
    let pos = 0;
    const head = Buffer.alloc(16);
    for (let i = 0; i < 64; i++) {
      const { bytesRead } = await fh.read(head, 0, 16, pos);
      if (bytesRead < 8) return false;
      let size = head.readUInt32BE(0);
      const type = head.toString("latin1", 4, 8);
      if (type === "moov") return true;
      if (type === "mdat") return false;
      if (size === 1) size = Number(head.readBigUInt64BE(8));
      if (size < 8) return false;
      pos += size;
    }
    return false;
  } finally {
    await fh.close();
  }
}
function detectCrop(file, width, height) {
  const r = run("ffmpeg", ["-hide_banner", "-i", file, "-vf", "fps=1/4,cropdetect=limit=20:round=2:reset=1", "-an", "-f", "null", "-"]);
  const counts = new Map();
  for (const m of r.stderr.matchAll(/crop=(\d+):(\d+):(\d+):(\d+)/g)) counts.set(m[0], (counts.get(m[0]) ?? 0) + 1);
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) return null;
  const [, cw, ch, cx, cy] = best[0].match(/crop=(\d+):(\d+):(\d+):(\d+)/).map(Number);
  // Only crop clear letter/pillar-boxing (> 8% of the frame on an axis).
  if (cw >= width * 0.92 && ch >= height * 0.92) return null;
  return { w: cw - (cw % 2), h: ch - (ch % 2), x: cx, y: cy };
}

if (doVideos) {
  const hasFfmpeg = !run("ffmpeg", ["-version"]).error;
  if (!hasFfmpeg) throw new Error("ffmpeg/ffprobe not found on PATH");
  for (const file of files) {
    if (!VIDEO_EXT.has(path.extname(file).toLowerCase())) continue;
    const url = urlOf(file);
    const info = probe(file);
    if ((info.format?.tags?.comment ?? "").includes(TAG)) {
      report.videos.push({ url, skipped: "already normalized" });
      continue;
    }
    const v = info.streams.find((s) => s.codec_type === "video");
    const a = info.streams.find((s) => s.codec_type === "audio");
    const rotation = Number(v.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? v.tags?.rotate ?? 0);
    const crop = detectCrop(file, v.width, v.height);
    const [fn, fd] = String(v.r_frame_rate || "30/1").split("/").map(Number);
    const compliant =
      v.codec_name === "h264" && v.pix_fmt === "yuv420p" && (!a || a.codec_name === "aac") &&
      !rotation && !crop && Math.max(v.width, v.height) <= VIDEO_MAX_EDGE && fn / (fd || 1) <= 30.5 &&
      Number(info.format.bit_rate) <= 1_200_000 && // heavier files are re-encoded smaller
      (await isFaststart(file));
    const before = `${v.width}x${v.height} ${v.codec_name} ${Math.round(Number(info.format.bit_rate) / 1000)}kb/s ${Number(info.format.size)}B rot${rotation}`;
    const posterPath = file.replace(/\.[^.]+$/, "-poster.jpg");
    if (compliant && !force) {
      report.videos.push({ url, before, kept: "already compliant (H.264/AAC, faststart, no bars)" });
      if (existsSync(posterPath)) {
        const pm = await sharp(posterPath).metadata();
        manifest[urlOf(posterPath)] ??= { w: pm.width, h: pm.height, blur: await blurFor(posterPath) };
        manifest[url] = { w: v.width, h: v.height, blur: manifest[urlOf(posterPath)].blur, poster: urlOf(posterPath) };
      } else {
        manifest[url] = { w: v.width, h: v.height };
      }
      continue;
    }
    if (dry) {
      report.videos.push({ url, before, crop, wouldReencode: true });
      continue;
    }
    const original = await backup(file);
    const filters = [];
    if (crop) filters.push(`crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`);
    filters.push(
      `scale='if(gte(iw,ih),min(${VIDEO_MAX_EDGE},iw),-2)':'if(gte(iw,ih),-2,min(${VIDEO_MAX_EDGE},ih))':flags=lanczos`,
      "fps=fps='min(30,source_fps)'",
      "format=yuv420p",
      "setsar=1",
    );
    const tmp = file + ".tmp.mp4";
    const outW = crop ? crop.w : v.width;
    const outH = crop ? crop.h : v.height;
    const scale = Math.min(1, VIDEO_MAX_EDGE / Math.max(outW, outH));
    const maxKbps = Math.max(450, Math.round((1100 * outW * scale * outH * scale) / (1280 * 720)));
    const argv = [
      "-hide_banner", "-loglevel", "error", "-y", "-i", original,
      "-map", "0:v:0", ...(a ? ["-map", "0:a:0"] : []),
      "-vf", filters.join(","),
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "23",
      // Cap the bitrate by picture size (about 1.1 Mb/s at 720p) so phone
      // clips stay light; CRF alone inflates already-compressed sources.
      "-maxrate", `${maxKbps}k`, "-bufsize", `${maxKbps * 2}k`,
      "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
      ...(a ? ["-c:a", "aac", "-b:a", "128k", "-ac", "2", "-ar", "48000", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11"] : []),
      "-movflags", "+faststart", "-metadata", `comment=${TAG}`, tmp,
    ];
    const r = run("ffmpeg", argv);
    if (r.status !== 0) throw new Error(`ffmpeg failed for ${url}: ${r.stderr}`);
    await fs.rename(tmp, file);
    const out = probe(file);
    const ov = out.streams.find((s) => s.codec_type === "video");
    // Poster: a frame ~10% in (avoids black lead-in), full resolution.
    if (existsSync(posterPath)) await backup(posterPath);
    const at = Math.min(8, Number(out.format.duration) * 0.1).toFixed(2);
    run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", at, "-i", file, "-frames:v", "1", "-vf", "thumbnail=30", "-q:v", "3", posterPath]);
    await trimPoster(posterPath);
    const pm = await sharp(posterPath).metadata();
    manifest[urlOf(posterPath)] = { w: pm.width, h: pm.height, blur: await blurFor(posterPath) };
    manifest[url] = { w: ov.width, h: ov.height, blur: manifest[urlOf(posterPath)].blur, poster: urlOf(posterPath) };
    report.videos.push({
      url,
      before,
      after: `${ov.width}x${ov.height} ${ov.codec_name} ${Math.round(Number(out.format.bit_rate) / 1000)}kb/s ${Number(out.format.size)}B`,
      crop,
    });
  }
}

/* Keep manifest entries for videos normalised on an earlier run. */
if (existsSync(MANIFEST)) {
  const prev = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  for (const [k, v] of Object.entries(prev)) if (!manifest[k] && existsSync(path.join(PUBLIC, k))) manifest[k] = v;
}
if (!dry) {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 1) + "\n");
}
console.log(JSON.stringify(report, null, 2));
console.log(`${Object.keys(manifest).length} manifest entries${dry ? " (dry run)" : ` written to ${path.relative(root, MANIFEST)}`}`);
