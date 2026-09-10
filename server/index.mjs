import { resolve } from "node:path";
import { createPool } from "../scripts/db/client.mjs";
import { loadLocalEnvironment } from "../scripts/db/env.mjs";
import { createApiServer } from "./app.mjs";
import { createCuratedContributionRepository } from "./curatedContributionRepository.mjs";
import { createReadRepository } from "./db/readRepository.mjs";

const root = resolve(import.meta.dirname, "..");
await loadLocalEnvironment(resolve(root, ".env"));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the API. Add it to .env; see .env.example.");
}

const pool = createPool(process.env.DATABASE_URL);
const databaseRepository = createReadRepository(pool);
const curatedContributions = createCuratedContributionRepository(resolve(root, "data/generated/curated-contributions.json"));
const server = createApiServer({
  ...databaseRepository,
  memberContributions: (memberId) => curatedContributions.byMemberId(memberId),
});
const port = Number(process.env.API_PORT ?? 8787);
server.listen(port, "127.0.0.1", () => console.log(`Congress Contributions API listening on http://127.0.0.1:${port}`));

async function close() {
  server.close();
  await pool.end();
}
process.once("SIGINT", close);
process.once("SIGTERM", close);
