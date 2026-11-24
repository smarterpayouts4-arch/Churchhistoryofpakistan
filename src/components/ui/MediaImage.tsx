import Image from "next/image";

type MediaImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  unoptimized?: boolean;
  style?: React.CSSProperties;
  /** Tiny base64 preview (from the media manifest) shown while loading. */
  blurDataURL?: string;
  /** next/image quality; must be listed in images.qualities (next.config.ts). */
  quality?: number;
};

/** Site-wide photo quality: visually lossless for archival scans at AVIF/WebP sizes. */
export const PHOTO_QUALITY = 80;

function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

export function MediaImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
  fill,
  unoptimized,
  style,
  blurDataURL,
  quality = PHOTO_QUALITY,
}: MediaImageProps) {
  const blur = blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {};
  if (isSvg(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            ...style,
          }}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={style}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        unoptimized={unoptimized}
        sizes={sizes ?? "100vw"}
        quality={quality}
        {...blur}
        style={{ objectFit: "contain", ...style }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      unoptimized={unoptimized}
      sizes={sizes}
      quality={quality}
      {...blur}
      style={style}
    />
  );
}
