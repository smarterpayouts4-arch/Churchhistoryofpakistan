import { promises as fs } from "fs";
import path from "path";
import { imageSize } from "image-size";
import type {
  CathedralsFile,
  FamilyArchivesFile,
  FeaturedInterviewsFile,
  HomepageFile,
  PeopleFramesFile,
} from "@/lib/cms/types";

export type MediaSourceClass =
  | "facebook"
  | "cathedral"
  | "interview"
  | "people"
  | "hero";
export type CropRisk = "high" | "medium" | "low";
export type FitRecommendation = "contain" | "cover";

export type MediaInspectItem = {
  id: string;
  title: string;
  publicPath: string;
  sourceClass: MediaSourceClass;
  mediaKind: "image" | "video";
  posterPath?: string;
  nativeWidth: number | null;
  nativeHeight: number | null;
  nativeAspect: number | null;
  nativeOrientation: "portrait" | "landscape" | "square" | "unknown";
  storedOrientation?: "portrait" | "landscape";
  cardAspect: number;
  cardAspectLabel: string;
  fitRecommendation: FitRecommendation;
  cropRisk: CropRisk;
  exists: boolean;
  fileBytes: number | null;
};

type Candidate = {
  id: string;
  title: string;
  publicPath: string;
  sourceClass: MediaSourceClass;
  mediaKind: "image" | "video";
  posterPath?: string;
  storedWidth?: number;
  storedHeight?: number;
  storedOrientation?: "portrait" | "landscape";
  cardAspect: number;
  cardAspectLabel: string;
};

const PUBLIC_DIR = path.join(process.cwd(), "public");
const CMS_DIR = path.join(process.cwd(), "data", "cms");

async function readCms<T>(filename: string): Promise<T> {
  const raw = await fs.readFile(path.join(CMS_DIR, filename), "utf8");
  return JSON.parse(raw) as T;
}

function localPublicFile(publicPath: string): string | null {
  if (!publicPath.startsWith("/")) return null;
  const resolved = path.resolve(PUBLIC_DIR, `.${publicPath}`);
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    return null;
  }
  return resolved;
}

function orientation(
  width: number | null,
  height: number | null,
): MediaInspectItem["nativeOrientation"] {
  if (!width || !height) return "unknown";
  if (width === height) return "square";
  return width > height ? "landscape" : "portrait";
}

function assess(
  width: number | null,
  height: number | null,
  cardAspect: number,
): Pick<MediaInspectItem, "nativeAspect" | "nativeOrientation" | "fitRecommendation" | "cropRisk"> {
  if (!width || !height) {
    return {
      nativeAspect: null,
      nativeOrientation: "unknown",
      fitRecommendation: "contain",
      cropRisk: "medium",
    };
  }

  const nativeAspect = width / height;
  const nativeOrientation = orientation(width, height);
  const cardOrientation = cardAspect > 1 ? "landscape" : "portrait";
  const orientationMismatch =
    nativeOrientation !== "square" && nativeOrientation !== cardOrientation;
  const aspectDelta = Math.abs(nativeAspect - cardAspect);
  const fitRecommendation =
    orientationMismatch || aspectDelta > 0.25 ? "contain" : "cover";
  const cropRisk: CropRisk =
    orientationMismatch || aspectDelta > 0.4
      ? "high"
      : aspectDelta > 0.25
        ? "medium"
        : "low";

  return {
    nativeAspect,
    nativeOrientation,
    fitRecommendation,
    cropRisk,
  };
}

async function inspectCandidate(candidate: Candidate): Promise<MediaInspectItem> {
  const file = localPublicFile(candidate.publicPath);
  let exists = false;
  let fileBytes: number | null = null;
  let width = candidate.storedWidth ?? null;
  let height = candidate.storedHeight ?? null;

  if (file) {
    try {
      const stats = await fs.stat(file);
      exists = stats.isFile();
      fileBytes = stats.size;
    } catch {
      exists = false;
    }

    if (exists && candidate.mediaKind === "image") {
      try {
        const dimensions = imageSize(await fs.readFile(file));
        width = dimensions.width ?? null;
        height = dimensions.height ?? null;
      } catch {
        // Keep the file listed even when its native dimensions are unreadable.
      }
    }
  }

  return {
    ...candidate,
    nativeWidth: width,
    nativeHeight: height,
    fileBytes,
    exists,
    ...assess(width, height, candidate.cardAspect),
  };
}

export async function getMediaInspectItems(): Promise<MediaInspectItem[]> {
  const [archives, cathedrals, interviews, homepage, people] = await Promise.all([
    readCms<FamilyArchivesFile>("family-archives.json"),
    readCms<CathedralsFile>("cathedrals.json"),
    readCms<FeaturedInterviewsFile>("featured-interviews.json"),
    readCms<HomepageFile>("homepage.json"),
    readCms<PeopleFramesFile>("people-frames.json"),
  ]);

  const candidates: Candidate[] = [];

  for (const item of archives.items) {
    candidates.push({
      id: item.id,
      title: item.title,
      publicPath: item.imageSrc,
      sourceClass: "facebook",
      mediaKind: "image",
      cardAspect: 4 / 3,
      cardAspectLabel: "4:3 archive",
    });
  }

  for (const item of cathedrals.items) {
    candidates.push({
      id: `${item.id}-local`,
      title: `${item.diocese} · local file`,
      publicPath: item.local_file,
      sourceClass: "cathedral",
      mediaKind: "image",
      cardAspect: 4 / 3,
      cardAspectLabel: "4:3 church",
    });
    if (item.fallback_file) {
      candidates.push({
        id: `${item.id}-fallback`,
        title: `${item.diocese} · fallback file`,
        publicPath: item.fallback_file,
        sourceClass: "cathedral",
        mediaKind: "image",
        cardAspect: 4 / 3,
        cardAspectLabel: "4:3 church",
      });
    }
  }

  for (const item of interviews.items) {
    candidates.push(
      {
        id: `${item.id}-video`,
        title: `${item.title} · video`,
        publicPath: item.videoSrc,
        sourceClass: "interview",
        mediaKind: "video",
        posterPath: item.posterSrc,
        storedWidth: item.width,
        storedHeight: item.height,
        storedOrientation: item.orientation,
        cardAspect: 9 / 16,
        cardAspectLabel: "9:16 interview",
      },
      {
        id: `${item.id}-poster`,
        title: `${item.title} · poster`,
        publicPath: item.posterSrc,
        sourceClass: "interview",
        mediaKind: "image",
        storedOrientation: item.orientation,
        cardAspect: 9 / 16,
        cardAspectLabel: "9:16 interview",
      },
    );
  }

  for (const frame of people.frames) {
    candidates.push({
      id: `people-${frame.id}`,
      title: frame.title,
      publicPath: frame.src,
      sourceClass: "people",
      mediaKind: "image",
      cardAspect: 4 / 3,
      cardAspectLabel: "4:3 people archive",
    });
  }

  candidates.push({
    id: "homepage-hero-portrait",
    title: "Homepage hero portrait",
    publicPath: homepage.hero.portrait,
    sourceClass: "hero",
    mediaKind: "image",
    cardAspect: 3 / 4,
    cardAspectLabel: "3:4 portrait hero",
  });

  return Promise.all(candidates.map(inspectCandidate));
}
