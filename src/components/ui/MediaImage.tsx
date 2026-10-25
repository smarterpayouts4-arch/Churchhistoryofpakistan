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
};

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
}: MediaImageProps) {
  if (isSvg(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={className}
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
      style={style}
    />
  );
}
