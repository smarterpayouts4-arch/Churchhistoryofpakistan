#!/usr/bin/env node
/**
 * Make a bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run admin:hash-password                 (asks for the password, hidden)
 *   npm run admin:hash-password -- "my secret"  (non-interactive)
 *
 * Prints two lines:
 *  - for .env.local (every $ escaped as \$ — Next.js would otherwise expand them)
 *  - for the Vercel dashboard (paste the raw hash, no escaping)
 * The password itself is never printed or stored.
 */
import bcrypt from "bcryptjs";
import readline from "node:readline";

async function ask() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  process.stdout.write("New admin password (at least 10 characters): ");
  const muted = rl;
  muted._writeToOutput = () => {};
  const pw = await new Promise((resolve) => rl.question("", resolve));
  rl.close();
  process.stdout.write("\n");
  return pw;
}

const pw = process.argv[2] ?? (await ask());
if (!pw || pw.length < 10) {
  console.error("Please use at least 10 characters (a short sentence is ideal).");
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 12);
console.log("\n# .env.local (local machine):");
console.log(`ADMIN_PASSWORD_HASH=${hash.replace(/\$/g, "\\$")}`);
console.log("\n# Vercel → Settings → Environment Variables (paste as-is):");
console.log(`ADMIN_PASSWORD_HASH  ${hash}`);
