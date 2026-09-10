import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createPool } from "./client.mjs";
import { loadLocalEnvironment } from "./env.mjs";

export async function applyMigrations(pool, migrationDirectory) {
  await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())");
  const migrations = (await readdir(migrationDirectory)).filter((name) => name.endsWith(".sql")).sort();
  for (const id of migrations) {
    const existing = await pool.query("SELECT 1 FROM schema_migrations WHERE id = $1", [id]);
    if (existing.rowCount) continue;
    const sql = await readFile(resolve(migrationDirectory, id), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id) VALUES ($1)", [id]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

async function main() {
  const root = resolve(import.meta.dirname, "..", "..");
  await loadLocalEnvironment(resolve(root, ".env"));
  const pool = createPool(process.env.DATABASE_URL);
  try {
    await applyMigrations(pool, resolve(root, "db/migrations"));
    console.log("PostgreSQL migrations are current.");
  } finally {
    await pool.end();
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
