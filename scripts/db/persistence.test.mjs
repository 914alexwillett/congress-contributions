import assert from "node:assert/strict";
import test from "node:test";
import { newDb } from "pg-mem";
import { resolve } from "node:path";
import { applyMigrations } from "./migrate.mjs";
import { persistCongressIngestion } from "./repository.mjs";
import { normalizeLegislation } from "../congress/normalizers.mjs";

const member = { id: "test-member", bioguideId: "T000001", displayName: "Test Member", chamber: "senate", state: "Maryland", party: "Independent" };
const area = { id: "test-area", zip: "00000", label: "Test Area", city: "Test City", state: "Maryland", summary: "Test area", memberIds: [member.id] };
const rawBill = { congress: 119, type: "S", number: "42", title: "Test Bill", introducedDate: "2026-01-02", latestAction: { actionDate: "2026-01-03", text: "Referred to committee." }, policyArea: { name: "Health" }, url: "https://api.congress.gov/v3/bill/119/s/42" };

async function database() {
  const memory = newDb({ noAstCoverageCheck: true });
  const { Pool } = memory.adapters.createPg();
  const pool = new Pool();
  await applyMigrations(pool, resolve(import.meta.dirname, "../../db/migrations"));
  return pool;
}

function normalizedFor(bill) {
  return [normalizeLegislation({ memberId: member.id, chamber: member.chamber, kind: "sponsored", bill, retrievedAt: "2026-09-10T00:00:00.000Z" })];
}

test("persists canonical records and reports an unchanged second ingestion", async () => {
  const pool = await database();
  try {
    const normalized = normalizedFor(rawBill);
    const first = await persistCongressIngestion(pool, { members: [member], constituentAreas: [area], normalized, rawBillsBySourceId: new Map([[normalized[0].sourceRecord.id, rawBill]]), startedAt: "2026-09-10T00:00:00.000Z", errors: [], skippedRecords: 0 });
    const second = await persistCongressIngestion(pool, { members: [member], constituentAreas: [area], normalized, rawBillsBySourceId: new Map([[normalized[0].sourceRecord.id, rawBill]]), startedAt: "2026-09-10T00:00:01.000Z", errors: [], skippedRecords: 0 });
    assert.deepEqual(first.metrics.sources, { inserted: 1, updated: 0, unchanged: 0 });
    assert.deepEqual(second.metrics.sources, { inserted: 0, updated: 0, unchanged: 1 });
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM members")).rows[0].count, 1);
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM bills")).rows[0].count, 1);
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM activity_records")).rows[0].count, 1);
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM source_record_versions")).rows[0].count, 1);
    const delegation = await pool.query("SELECT activity_records.id FROM activity_records JOIN constituent_area_members ON constituent_area_members.member_id = activity_records.member_id WHERE constituent_area_members.constituent_area_id = $1 AND activity_records.occurred_at BETWEEN $2 AND $3", [area.id, "2026-01-01", "2026-01-31"]);
    assert.equal(delegation.rowCount, 1);
  } finally {
    await pool.end();
  }
});

test("tracks a changed official payload as a new source version", async () => {
  const pool = await database();
  try {
    const firstNormalized = normalizedFor(rawBill);
    await persistCongressIngestion(pool, { members: [member], normalized: firstNormalized, rawBillsBySourceId: new Map([[firstNormalized[0].sourceRecord.id, rawBill]]), startedAt: "2026-09-10T00:00:00.000Z", errors: [], skippedRecords: 0 });
    const changedBill = { ...rawBill, latestAction: { actionDate: "2026-01-04", text: "Reported by committee." } };
    const secondNormalized = normalizedFor(changedBill);
    const result = await persistCongressIngestion(pool, { members: [member], normalized: secondNormalized, rawBillsBySourceId: new Map([[secondNormalized[0].sourceRecord.id, changedBill]]), startedAt: "2026-09-10T00:00:01.000Z", errors: [], skippedRecords: 0 });
    assert.deepEqual(result.metrics.sources, { inserted: 0, updated: 1, unchanged: 0 });
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM source_record_versions")).rows[0].count, 2);
    assert.equal((await pool.query("SELECT COUNT(*)::int AS count FROM change_events WHERE entity_type = 'source_record'")).rows[0].count, 2);
  } finally {
    await pool.end();
  }
});
