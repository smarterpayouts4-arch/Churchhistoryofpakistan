"use client";

import { useActionState } from "react";
import { submitContribution, type ContributeState } from "./actions";
import styles from "../pages.module.css";

const initial: ContributeState = { ok: false, message: "" };

const FIELD_MAP: Record<string, { name: string; type: "text" | "email" | "textarea" | "file" | "checkbox" }> = {
  "Contributor name": { name: "contributor_name", type: "text" },
  "Private contact email": { name: "contact_email", type: "email" },
  "Person/place/event represented": { name: "subject", type: "text" },
  "Approximate date": { name: "approx_date", type: "text" },
  "Story/description": { name: "story", type: "textarea" },
  "Source/context": { name: "source_context", type: "textarea" },
  "Photo/document uploads": { name: "uploads", type: "file" },
  "Rights confirmation": { name: "rights_confirmation", type: "checkbox" },
  "Publication consent": { name: "publication_consent", type: "checkbox" },
  "Preferred public credit": { name: "public_credit", type: "text" },
};

type Props = {
  contributionFields: string[];
};

export function ContributeForm({ contributionFields }: Props) {
  const [state, action, pending] = useActionState(submitContribution, initial);

  return (
    <form className={styles.form} action={action}>
      {contributionFields.map((label) => {
        const meta = FIELD_MAP[label] ?? {
          name: label.toLowerCase().replace(/\W+/g, "_"),
          type: "text" as const,
        };
        if (meta.type === "checkbox") {
          return (
            <div className={styles.field} key={label}>
              <label>
                <input type="checkbox" name={meta.name} /> {label}
              </label>
            </div>
          );
        }
        if (meta.type === "textarea") {
          return (
            <div className={styles.field} key={label}>
              <label htmlFor={meta.name}>{label}</label>
              <textarea id={meta.name} name={meta.name} />
            </div>
          );
        }
        if (meta.type === "file") {
          return (
            <div className={styles.field} key={label}>
              <label htmlFor={meta.name}>{label}</label>
              <input id={meta.name} name={meta.name} type="file" multiple />
              <span className={styles.meta}>
                Files are only transmitted if a contribution backend is configured.
              </span>
            </div>
          );
        }
        return (
          <div className={styles.field} key={label}>
            <label htmlFor={meta.name}>{label}</label>
            <input id={meta.name} name={meta.name} type={meta.type} />
          </div>
        );
      })}

      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? "Checking…" : "Submit contribution"}
      </button>

      {state.message ? (
        <p
          className={styles.notice}
          role="status"
          aria-live="polite"
          style={{
            borderLeftColor: state.ok ? "var(--color-antique-gold)" : "var(--color-burgundy)",
          }}
        >
          <strong>{state.ok ? "Received" : "Not submitted"}.</strong> {state.message}
        </p>
      ) : null}
    </form>
  );
}
