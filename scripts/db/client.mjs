import pg from "pg";

export function createPool(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for PostgreSQL commands. Add it to .env; see .env.example.");
  }

  return new pg.Pool({ connectionString: databaseUrl });
}
