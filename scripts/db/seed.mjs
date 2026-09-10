import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createPool } from "./client.mjs";
import { loadLocalEnvironment } from "./env.mjs";
import { applyMigrations } from "./migrate.mjs";
import { persistCongressIngestion } from "./repository.mjs";
import { supportedConstituentAreas, supportedMembers } from "../congress/supported-members.mjs";

function readGeneratedExport(contents, name, nextName) {
  const start = contents.indexOf(`export const ${name}`);
  const next = nextName ? contents.indexOf(`export const ${nextName}`, start) : -1;
  const end = next === -1 ? contents.length : next;
  const assignment = contents.slice(start, end);
  const json = assignment.slice(assignment.indexOf("= ") + 2, assignment.lastIndexOf(";"));
  return JSON.parse(json);
}

function rawBillMap(raw) {
  const map = new Map();
  for (const member of raw.members ?? []) {
    for (const bill of [...(member.sponsored ?? []), ...(member.cosponsored ?? [])]) {
      map.set(`congress-bill-${bill.congress}-${String(bill.type).toLowerCase()}-${bill.number}`, bill);
    }
  }
  return map;
}

async function main() {
  const root = resolve(import.meta.dirname, "..", "..");
  await loadLocalEnvironment(resolve(root, ".env"));
  const pool = createPool(process.env.DATABASE_URL);
  try {
    await applyMigrations(pool, resolve(root, "db/migrations"));
    const generated = await readFile(resolve(root, "src/data/generated/congress.ts"), "utf8");
    const sources = readGeneratedExport(generated, "generatedCongressSourceRecords", "generatedCongressBills");
    const bills = readGeneratedExport(generated, "generatedCongressBills", "generatedCongressActivity");
    const activities = readGeneratedExport(generated, "generatedCongressActivity");
    let rawBills = new Map();
    try {
      rawBills = rawBillMap(JSON.parse(await readFile(resolve(root, "data/raw/congress-latest.json"), "utf8")));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const billById = new Map(bills.map((bill) => [bill.id, bill]));
    const normalized = activities.map((activity) => {
      const sourceRecordId = activity.evidence.find((evidence) => evidence.sourceRecordId)?.sourceRecordId;
      return { activity, bill: billById.get(activity.measureId), sourceRecord: sourceById.get(sourceRecordId) };
    }).filter((entry) => entry.bill && entry.sourceRecord);
    const result = await persistCongressIngestion(pool, {
      members: supportedMembers,
      constituentAreas: supportedConstituentAreas,
      normalized,
      rawBillsBySourceId: rawBills,
      startedAt: new Date().toISOString(),
      errors: [],
      skippedRecords: 0,
    });
    console.log(`Seeded PostgreSQL run ${result.runId}.`);
  } finally {
    await pool.end();
  }
}

main();
