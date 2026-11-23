/** Small line icons for the admin (inherit colour; decorative only). */
const PATHS: Record<string, string> = {
  photo: "M4 6h16v12H4z M4 15l4.5-4.5 3.5 3.5 2.5-2.5L20 17 M15.5 9.5h.01",
  archive: "M4 5h16v4H4z M5 9v10h14V9 M10 13h4",
  home: "M4 11l8-6 8 6 M6 10v9h12v-9 M10 19v-5h4v5",
  layout: "M5 5h14v4H5z M5 11h14v4H5z M5 17h14v2H5z",
  church: "M12 3v4 M10 5h4 M7 21V11l5-4 5 4v10 M4 21h16 M10 21v-4a2 2 0 0 1 4 0v4",
  video: "M4 6h12v12H4z M16 10l4-2.5v9L16 14",
  pen: "M5 19l1-4 9.5-9.5 3 3L9 18z M14 7l3 3",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  upload: "M12 16V5 M7.5 9.5 12 5l4.5 4.5 M5 15v4h14v-4",
};

export function Icon({ name, size = 22 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name] ?? PATHS.photo} />
    </svg>
  );
}
