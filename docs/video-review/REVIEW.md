# Video cleanup review

## Duplicate decision

Removed the `prince-oneil-2` listing from the live CMS collection. Kept `youth-empowerment`, the longer landscape edition. The homepage now has two featured videos; the Interviews page has three videos. Original media files and reference records remain available.

The old hash-only audit missed this content duplicate because these are differently encoded/edited versions. Evidence:

- `youth-empowerment`: 960x720, 463.53 seconds.
- `prince-oneil-2`: 720x900, 448.17 seconds.
- Sampled frames show the same introduction and subsequent speaker/setting.
- Best overall 50ms audio-envelope match occurs at a 15.35-second offset (correlation 0.7727).
- Aligned 30-second speech segments at 120, 240, and 360 seconds correlate at 0.9630, 0.9603, and 0.9475. The opening edits differ, so they are redundant editions of the same talk, not byte-identical copies.
- The other two published programs have distinct sampled imagery and remain listed.

## Cutoff diagnosis and minimal correction

The old 1080x1350 cover images were already cropped: the landscape program's title and picture edges were absent from the cover itself. CSS `object-fit: cover` and the fixed 4:5 stage reinforced this presentation. Playing videos already used contain sizing.

Removed cropped-cover overrides from the three remaining CMS entries, so their original native-size posters are used. The shared player now uses each source's width/height aspect ratio; preview images use contain sizing, as playback already did. Black padding embedded in the recordings is preserved; no source videos were re-encoded or content-cropped.

## Checks

- Homepage: two play cards; duplicate absent.
- Interviews: three distinct play cards; duplicate absent.
- Desktop playback: native controls, correct landscape ratio, no media error.
- Mobile at 375px: three original posters, contain sizing, correct native ratios, no horizontal overflow.
- No broken preview images.
- TypeScript, focused ESLint, and production build passed. The existing admin upload filesystem-tracing warning remains unrelated.

`interviews-after.png` shows the final page. The four sample contact sheets document the inspected source frames.

Full-file verification: all four original MP4s decoded from start to finish with FFmpeg, exit code 0 and no decoder errors. No file corruption was detected.

## 2026-11-23 — interviews clean-up

Each video was checked frame by frame (start, 25/50/75%, end), with audio level and
line-angle (tilt) measurements:

| Video | Verdict | Why |
|---|---|---|
| nahum-1-7 (1280×720, 4:27) | **Kept** | Tripod-steady, level framing (measured tilt ≈ 0°), clean intro card, ~3 s quiet lead-in and a silent ending. |
| rab-ki-khidmat-4 (720×1280, 5:22) | Removed | Hand-held phone reel: framing swings and tilts (verticals measured up to ~9–15° off), letterboxed intro then full-frame, social-media captions burned in. |
| youth-empowerment (576×716, 7:44) | Removed | Starts with speech already under way and ends mid-sentence (speech at full level in the final 1.5 s); 14 s of dead air near 0:57. |
| prince-oneil-2 (720×900, 7:28) | Removed (was not on the site) | Same recording as youth-empowerment (audio matches at a 15 s offset); also cut off at both ends. |

Removed files were moved, not deleted, to `media-originals/removed-from-site/interviews/youth/`
(git-ignored). To bring one back, move it into `public/media/archive/interviews/youth/` and add
its entry to `data/cms/featured-interviews.json`.
