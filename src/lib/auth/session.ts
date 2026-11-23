import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import type { AdminRole } from "@/lib/cms/types";
import { getUserById } from "./users";

export const ADMIN_SESSION_COOKIE = "hcop_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export type AdminSession = {
  userId: string;
  /** Display name (kept as `sub` for older call sites). */
  sub: string;
  email: string;
  role: AdminRole;
};

let devSecret: Uint8Array | null = null;

/**
 * Production: ADMIN_SESSION_SECRET (≥32 chars) is required.
 * Local dev: if it is missing, a random secret is generated once and kept in
 * data/local-store/.session-secret so admin works out of the box.
 */
async function getSecretKey(): Promise<Uint8Array> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return new TextEncoder().encode(secret);
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set to at least 32 characters.");
  }
  if (devSecret) return devSecret;
  const file = path.join(process.cwd(), "data", "local-store", ".session-secret");
  let value = await fs.readFile(file, "utf8").catch(() => "");
  if (value.trim().length < 32) {
    value = randomBytes(32).toString("hex");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, value, "utf8");
  }
  devSecret = new TextEncoder().encode(value.trim());
  return devSecret;
}

export async function createSessionToken(user: {
  id: string;
  role: AdminRole;
  tokenVersion: number;
}): Promise<string> {
  return new SignJWT({ role: user.role, tv: user.tokenVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(await getSecretKey());
}

/**
 * Verify the JWT, then confirm the account still exists, is active, and has
 * not changed password since (tokenVersion) — so removing someone or
 * resetting a password ends their sessions immediately.
 */
export async function readSessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, await getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string") return null;
    const user = await getUserById(payload.sub);
    if (!user || !user.active || user.tokenVersion !== payload.tv) return null;
    return { userId: user.id, sub: user.name, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  return readSessionToken(jar.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Session cookie: HttpOnly, Secure in production, SameSite=Strict,
 * host-only. Path "/" so it reaches both /admin and /api/admin/*.
 */
export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}
