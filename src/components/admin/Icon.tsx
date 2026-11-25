/** Small line icons for the admin (inherit colour; decorative only). */
const PATHS: Record<string, string> = {
  photo: "M4 6h16v12H4z M4 15l4.5-4.5 3.5 3.5 2.5-2.5L20 17 M15.5 9.5h.01",
  archive: "M4 5h16v4H4z M5 9v10h14V9 M10 13h4",
  home: "M4 11l8-6 8 6 M6 10v9h12v-9 M10 19v-5h4v5",
  video: "M4 6h12v12H4z M16 10l4-2.5v9L16 14",
  upload: "M12 16V5 M7.5 9.5 12 5l4.5 4.5 M5 15v4h14v-4",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M3 19c0-3 3-5 6-5s6 2 6 5 M16 5a3 3 0 0 1 0 6 M18 14c2 .6 3 2.4 3 5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 11v5 M12 8h.01",
  grip: "M8 7h8 M8 12h8 M8 17h8",
  church: "M12 2v4 M10 4h4 M7 10l5-4 5 4 M7 10v10h10V10 M4 20h16 M10.5 20v-4h3v4",
  book: "M12 6.5C10.5 5.3 8.2 5 4 5v13c4.2 0 6.5.3 8 1.5 1.5-1.2 3.8-1.5 8-1.5V5c-4.2 0-6.5.3-8 1.5z M12 6.5v13",
  person: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21c0-4 3.6-7 8-7s8 3 8 7",
  crop: "M6 2v14h14 M2 6h14v14",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9 M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9",
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
