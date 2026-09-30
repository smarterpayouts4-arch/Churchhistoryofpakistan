export type NavItem = {
  href: string;
  label: string;
};

/** Primary nav — no dead search. Timeline lives on the homepage. */
export const primaryNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
  { href: "/interviews", label: "Interviews" },
  { href: "/churches", label: "Churches" },
  { href: "/people", label: "People" },
  { href: "/contribute", label: "Contribute" },
];

export const footerNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/archive", label: "Archive" },
  { href: "/interviews", label: "Interviews" },
  { href: "/churches", label: "Churches" },
  { href: "/people", label: "People" },
  { href: "/sources", label: "Sources" },
  { href: "/contribute", label: "Contribute" },
];

/** Confirmed by curator — use on all public labels. */
export const CURATOR_DISPLAY_NAME = "Javed Qadir Bakhsh";

export const CURATOR_ROLE_LINE =
  "Founder & curator · Executive Committee, Church of Pakistan (1991–2017)";
