import bcrypt from "bcryptjs";

export const BCRYPT_COST = 12;
export const MIN_PASSWORD_LENGTH = 10;

export function isBcryptHash(value: string | undefined | null): value is string {
  return Boolean(value && /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value));
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  if (!isBcryptHash(hash)) return Promise.resolve(false);
  return bcrypt.compare(plain, hash);
}

/** Keeps timing equal when a user does not exist (one real bcrypt compare). */
let dummyHash: Promise<string> | null = null;
export async function burnPasswordCheck(plain: string) {
  dummyHash ??= bcrypt.hash("timing-equaliser", BCRYPT_COST);
  await bcrypt.compare(plain, await dummyHash).catch(() => false);
}

export function passwordProblem(plain: string): string | null {
  if (plain.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters. A short sentence works well.`;
  }
  if (plain.length > 200) return "That password is too long.";
  return null;
}
