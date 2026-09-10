import { resolve } from "node:path";
import { createPool } from "./client.mjs";
import { loadLocalEnvironment } from "./env.mjs";
import { inspectDatabase } from "./repository.mjs";

const root = resolve(import.meta.dirname, "..", "..");
await loadLocalEnvironment(resolve(root, ".env"));
const pool = createPool(process.env.DATABASE_URL);
try {
  console.table(await inspectDatabase(pool));
} finally {
  await pool.end();
}
