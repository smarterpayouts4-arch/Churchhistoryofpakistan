import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";

export const ADMIN_SESSION_COOKIE = "hcop_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

export type AdminSession = {
  sub: string;
  role: "curator";
};

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to a string of at least 32 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export function getAdminUsername(): string {
  return (process.env.ADMIN_USERNAME || "javed").trim();
}

/** Compare candidate password to ADMIN_PASSWORD_HASH or ADMIN_PASSWORD. */
export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (hash) {
    return bcrypt.compare(candidate, hash);
  }
  const plain = process.env.ADMIN_PASSWORD;
  if (!plain) return false;
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(plain).digest();
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ role: "curator" } satisfies Omit<AdminSession, "sub">)
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function readSessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "curator" || typeof payload.sub !== "string") {
      return null;
    }
    return { sub: payload.sub, role: "curator" };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  return readSessionToken(token);
}

/**
 * Session cookie flags:
 * - httpOnly: true (no JS access)
 * - secure: true in production (HTTPS only)
 * - sameSite: "lax" (CSRF mitigation; Strict also acceptable)
 * - path: "/" so the cookie is sent to both /admin and /api/admin/*
 */
export function sessionCookieOptions(maxAge = SESSION_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
