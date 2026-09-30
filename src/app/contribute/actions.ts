"use server";

export type ContributeState = {
  ok: boolean;
  message: string;
};

export async function submitContribution(
  _prev: ContributeState,
  formData: FormData,
): Promise<ContributeState> {
  const webhook = process.env.CONTRIBUTE_WEBHOOK_URL;

  // Always validate presence of consent fields for honesty when backend exists.
  const rights = formData.get("rights_confirmation");
  const consent = formData.get("publication_consent");
  if (rights !== "on" || consent !== "on") {
    return {
      ok: false,
      message:
        "Please confirm rights and publication consent before submitting. Nothing was sent.",
    };
  }

  if (!webhook) {
    return {
      ok: false,
      message:
        "Contribution intake is not configured on this deployment. Your message was not submitted or stored. Please contact the Project Curator directly, or set CONTRIBUTE_WEBHOOK_URL when a real backend is ready.",
    };
  }

  // Backend wired: still do not invent success — attempt and report honestly.
  try {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTRIBUTE_API_KEY
          ? { Authorization: `Bearer ${process.env.CONTRIBUTE_API_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return {
        ok: false,
        message: `The contribution service returned HTTP ${res.status}. Nothing was confirmed as saved.`,
      };
    }
    return {
      ok: true,
      message:
        "Your contribution was accepted by the configured intake endpoint. The Project Curator will review rights and citations before any publication.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Could not reach the contribution service. Nothing was submitted. Please try again later or contact the Project Curator.",
    };
  }
}
