import type { ReactNode } from "react";

/** Shared header band for secondary routes. Presents existing copy only. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <header className="pageHeader">
      <div className="shell">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="rise2">{title}</h1>
        {intro ? <p className="pageHeaderIntro rise3">{intro}</p> : null}
      </div>
    </header>
  );
}
