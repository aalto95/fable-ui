import { randomBytes } from "node:crypto";
import "../src/env";
import { insertAdminApiKey } from "@/db/adminApiKeysRepo";
import { runMigrations } from "@/db/migrate";
import { isPostgresConfigured } from "@/db/postgres";
import { hashAdminKey } from "@/lib/auth";

function parseArgs(): { name: string } {
  const args = process.argv.slice(2);
  const nameIndex = args.indexOf("--name");
  const name = nameIndex >= 0 ? args[nameIndex + 1] : undefined;
  if (!name?.trim()) {
    console.error('Usage: pnpm admin:create-key --name "CI"');
    process.exit(1);
  }
  return { name: name.trim() };
}

async function main() {
  if (!isPostgresConfigured()) {
    console.error(
      "PostgreSQL URL required: set DATABASE_URL or POSTGRES_URL / POSTGRES_URL_NON_POOLING.",
    );
    process.exit(1);
  }

  const { name } = parseArgs();
  await runMigrations();

  const secret = randomBytes(24).toString("base64url");
  const key = `sdui_${secret}`;
  await insertAdminApiKey({
    name,
    keyHash: hashAdminKey(key),
    keyPrefix: `sdui_${secret.slice(0, 8)}`,
  });

  console.log(`Created admin API key "${name}":`);
  console.log(key);
  console.log("\nStore this token now — only its hash is kept, it cannot be shown again.");
  console.log("Send it as: Authorization: Bearer <token>");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
