import { resolve } from "node:path";
import { createPool } from "./client.mjs";
import { loadLocalEnvironment } from "./env.mjs";
import { applyMigrations } from "./migrate.mjs";

if (process.env.CONFIRM_DB_RESET !== "RESET_CONGRESS_CONTRIBUTIONS") {
  throw new Error("Refusing to reset. Set CONFIRM_DB_RESET=RESET_CONGRESS_CONTRIBUTIONS for this command.");
}

const root = resolve(import.meta.dirname, "..", "..");
await loadLocalEnvironment(resolve(root, ".env"));
const pool = createPool(process.env.DATABASE_URL);
try {
  await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
  await applyMigrations(pool, resolve(root, "db/migrations"));
  console.log("Database reset and migrations applied.");
} finally {
  await pool.end();
}
