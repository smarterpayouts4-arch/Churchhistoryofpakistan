import { randomUUID } from "crypto";
import { readDoc, writeDoc } from "@/lib/cms/store";
import type { AdminRole, AdminUser, UsersFile } from "@/lib/cms/types";
import { isBcryptHash, verifyPassword, burnPasswordCheck } from "./password";

/**
 * Per-person admin accounts, stored in the private `users.json` document
 * (Vercel KV in production, data/local-store/ locally — never in git).
 *
 * Bootstrap: while no active admin exists, the env pair
 *   ADMIN_EMAIL (or legacy ADMIN_USERNAME) + ADMIN_PASSWORD_HASH (bcrypt)
 * can sign in once; that creates the first admin account in the store.
 * After that, people and passwords are managed in Admin → Accounts,
 * no redeploy needed. ADMIN_RECOVERY_LOGIN=true re-enables the env login
 * as a break-glass recovery path.
 */

export type PublicUser = Omit<AdminUser, "passwordHash">;

export function toPublicUser(u: AdminUser): PublicUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = u;
  return rest;
}

export async function getUsers(): Promise<AdminUser[]> {
  const file = await readDoc<UsersFile>("users.json");
  return file.users ?? [];
}

export async function saveUsers(users: AdminUser[]) {
  await writeDoc("users.json", { users } satisfies UsersFile);
}

export async function getUserById(id: string) {
  return (await getUsers()).find((u) => u.id === id) ?? null;
}

function normalise(login: string) {
  return login.trim().toLowerCase();
}

export function envAdminLogin(): string | null {
  const v = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
  return v ? normalise(v) : null;
}

export function envAdminHash(): string | null {
  const h = process.env.ADMIN_PASSWORD_HASH?.trim();
  return isBcryptHash(h) ? h : null;
}

/** Problems with the admin env configuration, shown to maintainers. */
export function authConfigProblems(): string[] {
  const problems: string[] = [];
  const prod = process.env.NODE_ENV === "production";
  if (process.env.ADMIN_PASSWORD) {
    problems.push(
      "ADMIN_PASSWORD (plain text) is set but ignored. Remove it and use ADMIN_PASSWORD_HASH.",
    );
  }
  if (process.env.ADMIN_PASSWORD_HASH && !envAdminHash()) {
    problems.push(
      "ADMIN_PASSWORD_HASH is not a valid bcrypt hash. In .env.local every $ must be written as \\$.",
    );
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (prod && (!secret || secret.length < 32)) {
    problems.push("ADMIN_SESSION_SECRET must be at least 32 characters in production.");
  }
  return problems;
}

export async function hasActiveAdmin(users?: AdminUser[]) {
  const list = users ?? (await getUsers());
  return list.some((u) => u.active && u.role === "admin");
}

/**
 * Verify a login. Returns the user (creating the bootstrap admin when
 * allowed) or null. Always spends one bcrypt comparison to keep timing flat.
 */
export async function authenticate(
  login: string,
  password: string,
): Promise<AdminUser | null> {
  const id = normalise(login);
  const users = await getUsers();
  const user = users.find((u) => normalise(u.email) === id);

  if (user) {
    if (!user.active) {
      await burnPasswordCheck(password);
      return null;
    }
    if (await verifyPassword(password, user.passwordHash)) return user;
    // fall through: recovery login may still match the env credentials
  }

  const envLogin = envAdminLogin();
  const envHash = envAdminHash();
  const bootstrapAllowed =
    !(await hasActiveAdmin(users)) || process.env.ADMIN_RECOVERY_LOGIN === "true";
  if (envLogin && envHash && id === envLogin && bootstrapAllowed) {
    if (await verifyPassword(password, envHash)) {
      const now = new Date().toISOString();
      if (user) {
        const restored: AdminUser = {
          ...user,
          active: true,
          role: "admin",
          passwordHash: envHash,
          tokenVersion: user.tokenVersion + 1,
          updatedAt: now,
        };
        await saveUsers(users.map((u) => (u.id === user.id ? restored : u)));
        return restored;
      }
      const created: AdminUser = {
        id: randomUUID(),
        email: envLogin,
        name: process.env.ADMIN_NAME?.trim() || "Site administrator",
        role: "admin",
        passwordHash: envHash,
        active: true,
        tokenVersion: 1,
        createdAt: now,
        updatedAt: now,
      };
      await saveUsers([...users, created]);
      return created;
    }
    return null;
  }
  if (!user) await burnPasswordCheck(password);
  return null;
}

export async function touchLastLogin(userId: string) {
  const users = await getUsers();
  const now = new Date().toISOString();
  await saveUsers(users.map((u) => (u.id === userId ? { ...u, lastLoginAt: now } : u)));
}

export function roleAllows(role: AdminRole, needed: AdminRole) {
  return needed === "editor" || role === "admin";
}
