# Interviews / youth videos QA — 2026-09-20

## Duplicate check
| Check | Result |
|-------|--------|
| Homepage featured count | **3** unique IDs (`rab-ki-khidmat-4`, `youth-empowerment`, `prince-oneil-2`) |
| /interviews count | **4** unique IDs (+ `nahum-1-7`) |
| SHA-256 collisions among published mp4s | **None** |
| `cross-talking-head` on site | **No** (same ~267s length as Nahum but different hash/URL; excluded — no caption) |

## Native dimensions (ffprobe)
| ID | Size | Orientation | Duration |
|----|------|-------------|----------|
| rab-ki-khidmat-4 | 720×1280 | portrait 9:16 | ~322s |
| youth-empowerment | 960×720 | landscape 4:3 | ~464s |
| prince-oneil-2 | 720×900 | portrait 4:5 | ~448s |
| nahum-1-7 | 1280×720 | landscape 16:9 | ~267s |

Posters match native pixel sizes.

## Presentation fix applied
Previously all cards forced `aspect-ratio: 9/16` + `object-fit: cover`, which **cropped** landscape talks. Now:
- each card sets `aspectRatio: width/height` from ffprobe
- `object-fit: contain` so the full video is visible
- portrait vs landscape width helpers

## Caption fidelity
Titles/copy match inventory / Facebook captions; Dr. Prince O'Neil Iqbal only because named in caption.
