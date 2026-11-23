import s from "./studio.module.css";

type Status = { production: boolean; kv: boolean; blob: boolean; hosted: boolean; backend: string };

/** Loud warning when the live site can't save; gentle note on a local machine. */
export function StorageBanner({ status, problems }: { status: Status; problems: string[] }) {
  const missing: string[] = [];
  if (status.hosted && !status.kv) {
    missing.push("Saving is OFF: Vercel KV (Upstash Redis) is not connected, so edits cannot be stored.");
  }
  if (status.hosted && !status.blob) {
    missing.push("Uploading is OFF: Vercel Blob is not connected, so new photos and videos cannot be stored.");
  }
  return (
    <>
      {missing.length || problems.length ? (
        <div className={s.banner} role="alert">
          <strong>Action needed before the family can edit the live site</strong>
          {[...missing, ...problems].map((m) => (
            <span key={m}>• {m}</span>
          ))}
          <span>See docs/DEPLOYMENT.md (step “Connect storage”).</span>
        </div>
      ) : null}
      {!status.hosted ? (
        <div className={s.bannerInfo} role="note">
          <strong>Local mode — this computer</strong>
          <span>
            Edits save to <code>data/cms/</code> and uploads to <code>public/media/uploads/</code>.
            {status.kv ? " Vercel KV is connected, so text saves go to KV." : ""}
            {status.blob ? " Vercel Blob is connected, so uploads go to Blob." : ""} Commit these folders to publish
            local changes.
          </span>
        </div>
      ) : null}
    </>
  );
}
