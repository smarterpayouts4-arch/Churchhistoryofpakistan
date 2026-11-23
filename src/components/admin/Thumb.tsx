import Image from "next/image";

/** Small optimised preview for the admin (next/image keeps big scans light). */
export function Thumb({
  src,
  alt = "",
  kind = "image",
  sizes = "180px",
  position,
}: {
  src: string;
  alt?: string;
  kind?: "image" | "video";
  sizes?: string;
  position?: string;
}) {
  if (kind === "video") {
    return <video src={`${src}#t=0.5`} muted playsInline preload="metadata" aria-label={alt || "Video"} />;
  }
  const svg = src.toLowerCase().endsWith(".svg");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={svg}
      style={{ objectFit: "cover", objectPosition: position ?? "50% 50%" }}
    />
  );
}
