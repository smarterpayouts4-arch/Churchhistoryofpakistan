# Featured Interviews — Facebook Reels UI (2026-09-20)

## Spec (Meta / industry)
- Facebook Reels: **9:16**, typically **1080×1920**
- Site cards use uniform **9:16** frames so the row aligns like a Reels shelf

## Duplicate check
- Home 3 videos are **distinct** files (different SHA-256, durations, frame hashes)
- youth-empowerment vs prince-oneil-2 look similar in setting but hamming distances 78–122/256 → **not the same video**

## Source file sizes vs frame
| ID | Native pixels | In 9:16 card |
|----|---------------|--------------|
| rab-ki-khidmat-4 | 720×1280 (true Reel) | fills frame |
| prince-oneil-2 | 720×900 (4:5) | slight letterbox |
| youth-empowerment | 960×720 (landscape) | letterboxed in Reel frame |
| nahum-1-7 | 1280×720 (landscape) | letterboxed on /interviews |

`object-fit: contain` keeps talking heads intact (no side-crop).
