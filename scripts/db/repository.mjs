import { createHash } from "node:crypto";

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function emptyMetrics() {
  return Object.fromEntries(["sources", "bills", "activities"].map((name) => [name, { inserted: 0, updated: 0, unchanged: 0 }]));
}

async function addChangeEvent(client, { runId, entityType, entityId, changeType, before, after, occurredAt }) {
  await client.query(
    `INSERT INTO change_events (id, entity_type, entity_id, change_type, occurred_at, ingestion_run_id, before_json, after_json)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)
     ON CONFLICT (ingestion_run_id, entity_type, entity_id, change_type) DO NOTHING`,
    [`${runId}:${entityType}:${entityId}:${changeType}`, entityType, entityId, changeType, occurredAt, runId, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null],
  );
}

async function upsertSourceRecord(client, source, runId, now) {
  const payloadHash = hash(source.payload);
  const current = await client.query("SELECT payload_hash, payload_json FROM source_records WHERE id = $1", [source.id]);
  if (!current.rowCount) {
    await client.query(
      `INSERT INTO source_records (id, source, resource_type, external_id, title, source_url, source_updated_at, payload_json, payload_hash, first_seen_at, last_seen_at, last_ingestion_run_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $10, $11)`,
      [source.id, source.source, source.resourceType, source.externalId, source.title, source.sourceUrl, source.sourceUpdatedAt ?? null, JSON.stringify(source.payload), payloadHash, now, runId],
    );
    await client.query(
      "INSERT INTO source_record_versions (id, source_record_id, payload_hash, retrieved_at, ingestion_run_id, payload_json) VALUES ($1, $2, $3, $4, $5, $6::jsonb)",
      [`${source.id}:${payloadHash}`, source.id, payloadHash, now, runId, JSON.stringify(source.payload)],
    );
    await addChangeEvent(client, { runId, entityType: "source_record", entityId: source.id, changeType: "inserted", after: source.payload, occurredAt: now });
    return "inserted";
  }

  if (current.rows[0].payload_hash === payloadHash) {
    await client.query("UPDATE source_records SET last_seen_at = $2, last_ingestion_run_id = $3 WHERE id = $1", [source.id, now, runId]);
    return "unchanged";
  }

  await client.query(
    `UPDATE source_records SET title = $2, source_url = $3, source_updated_at = $4, payload_json = $5::jsonb, payload_hash = $6,
       last_seen_at = $7, last_ingestion_run_id = $8 WHERE id = $1`,
    [source.id, source.title, source.sourceUrl, source.sourceUpdatedAt ?? null, JSON.stringify(source.payload), payloadHash, now, runId],
  );
  await client.query(
    "INSERT INTO source_record_versions (id, source_record_id, payload_hash, retrieved_at, ingestion_run_id, payload_json) VALUES ($1, $2, $3, $4, $5, $6::jsonb) ON CONFLICT (source_record_id, payload_hash) DO NOTHING",
    [`${source.id}:${payloadHash}`, source.id, payloadHash, now, runId, JSON.stringify(source.payload)],
  );
  await addChangeEvent(client, { runId, entityType: "source_record", entityId: source.id, changeType: "updated", before: current.rows[0].payload_json, after: source.payload, occurredAt: now });
  return "updated";
}

async function upsertMember(client, member, now) {
  const [firstName, ...remaining] = member.displayName.split(" ");
  await client.query(
    `INSERT INTO members (id, display_name, first_name, last_name, chamber, state, district, party, current, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)
     ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name,
       chamber = EXCLUDED.chamber, state = EXCLUDED.state, district = EXCLUDED.district, party = EXCLUDED.party, current = TRUE, updated_at = EXCLUDED.updated_at`,
    [member.id, member.displayName, firstName, remaining.join(" ") || null, member.chamber, member.state, member.district ?? null, member.party ?? null, now],
  );
  await client.query(
    "INSERT INTO external_identifiers (id, entity_type, entity_id, source, external_id) VALUES ($1, 'member', $2, 'congress_gov', $3) ON CONFLICT (entity_type, source, external_id) DO UPDATE SET entity_id = EXCLUDED.entity_id",
    [`external-member-${member.id}-congress-gov`, member.id, member.bioguideId],
  );
}

async function upsertConstituentArea(client, area) {
  await client.query(
    `INSERT INTO constituent_areas (id, zip, label, city, state, summary) VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (id) DO UPDATE SET zip = EXCLUDED.zip, label = EXCLUDED.label, city = EXCLUDED.city, state = EXCLUDED.state, summary = EXCLUDED.summary`,
    [area.id, area.zip, area.label, area.city, area.state, area.summary],
  );
  for (const memberId of area.memberIds) {
    await client.query("INSERT INTO constituent_area_members (constituent_area_id, member_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [area.id, memberId]);
  }
}

async function upsertBill(client, bill, rawBill, sourceRecordId, now) {
  const next = { title: bill.broadPurpose, currentState: bill.currentState, sourceRecordId };
  const existing = await client.query("SELECT title, current_status, source_record_id FROM bills WHERE id = $1", [bill.id]);
  await client.query(
    `INSERT INTO bills (id, congress, type, number, title, short_title, origin_chamber, introduced_at, current_status, source_record_id, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, short_title = EXCLUDED.short_title, origin_chamber = EXCLUDED.origin_chamber,
       introduced_at = EXCLUDED.introduced_at, current_status = EXCLUDED.current_status, source_record_id = EXCLUDED.source_record_id, updated_at = EXCLUDED.updated_at`,
    [bill.id, bill.measure.congress, bill.measure.type, bill.measure.number, bill.broadPurpose, bill.measure.shortTitle ?? null, bill.originChamber, rawBill?.introducedDate ?? null, bill.currentState, sourceRecordId, now],
  );
  if (!existing.rowCount) return "inserted";
  const previous = existing.rows[0];
  return previous.title === next.title && previous.current_status === next.currentState && previous.source_record_id === next.sourceRecordId ? "unchanged" : "updated";
}

async function upsertBillAction(client, bill, rawBill, sourceRecordId) {
  const action = rawBill?.latestAction;
  if (!action?.text) return;
  const occurredAt = action.actionDate ?? rawBill.introducedDate;
  if (!occurredAt) return;
  const id = `bill-action-${bill.id}-${occurredAt}-${hash(action.text).slice(0, 12)}`;
  await client.query(
    `INSERT INTO bill_actions (id, bill_id, occurred_at, action_type, action_code, action_text, source_record_id)
     VALUES ($1, $2, $3, 'latest_action', NULL, $4, $5) ON CONFLICT (bill_id, occurred_at, action_text) DO NOTHING`,
    [id, bill.id, occurredAt, action.text, sourceRecordId],
  );
}

async function upsertActivity(client, activity, now) {
  const sourceRecordId = activity.evidence.find((entry) => entry.sourceRecordId)?.sourceRecordId;
  if (!sourceRecordId) throw new Error(`Activity ${activity.id} has no source record.`);
  const next = { headline: activity.headline, summary: activity.summary, outcome: activity.outcomeLabel ?? null, sourceRecordId };
  const existing = await client.query("SELECT headline, summary, outcome, source_record_id FROM activity_records WHERE id = $1", [activity.id]);
  await client.query(
    `INSERT INTO activity_records (id, member_id, bill_id, amendment_id, occurred_at, type, headline, summary, outcome, source_record_id, issue_ids, change_tags, evidence_json, related_contribution_id)
     VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13)
     ON CONFLICT (id) DO UPDATE SET occurred_at = EXCLUDED.occurred_at, type = EXCLUDED.type, headline = EXCLUDED.headline, summary = EXCLUDED.summary,
       outcome = EXCLUDED.outcome, source_record_id = EXCLUDED.source_record_id, issue_ids = EXCLUDED.issue_ids, change_tags = EXCLUDED.change_tags,
       evidence_json = EXCLUDED.evidence_json, related_contribution_id = EXCLUDED.related_contribution_id`,
    [activity.id, activity.memberId, activity.measureId ?? null, activity.date, activity.type, activity.headline, activity.summary, activity.outcomeLabel ?? null, sourceRecordId, JSON.stringify(activity.issueIds), JSON.stringify(activity.changeTags), JSON.stringify(activity.evidence), activity.relatedContributionId ?? null],
  );
  if (!existing.rowCount) return "inserted";
  const previous = existing.rows[0];
  return previous.headline === next.headline && previous.summary === next.summary && previous.outcome === next.outcome && previous.source_record_id === next.sourceRecordId ? "unchanged" : "updated";
}

export async function persistCongressIngestion(pool, { members, constituentAreas = [], normalized, rawBillsBySourceId, startedAt, errors, skippedRecords }) {
  const client = await pool.connect();
  const runId = `congress-${startedAt.replaceAll(/[^0-9]/g, "")}`;
  const metrics = emptyMetrics();
  try {
    await client.query("BEGIN");
    await client.query("INSERT INTO ingestion_runs (id, source, started_at, status, records_seen, records_skipped, errors_json) VALUES ($1, 'congress_gov', $2, 'running', $3, $4, $5::jsonb)", [runId, startedAt, normalized.length, skippedRecords, JSON.stringify(errors)]);
    for (const member of members) await upsertMember(client, member, startedAt);
    for (const area of constituentAreas) await upsertConstituentArea(client, area);
    const sourceEntries = [...new Map(normalized.map((entry) => [entry.sourceRecord.id, entry])).values()];
    for (const entry of sourceEntries) {
      const rawBill = rawBillsBySourceId.get(entry.sourceRecord.id);
      const source = { ...entry.sourceRecord, payload: rawBill ?? entry.sourceRecord.payload };
      const sourceState = await upsertSourceRecord(client, source, runId, startedAt);
      metrics.sources[sourceState] += 1;
    }
    const billEntries = [...new Map(normalized.map((entry) => [entry.bill.id, entry])).values()];
    for (const entry of billEntries) {
      const rawBill = rawBillsBySourceId.get(entry.sourceRecord.id);
      const billState = await upsertBill(client, entry.bill, rawBill, entry.sourceRecord.id, startedAt);
      metrics.bills[billState] += 1;
      await upsertBillAction(client, entry.bill, rawBill, entry.sourceRecord.id);
    }
    for (const entry of normalized) {
      const activityState = await upsertActivity(client, entry.activity, startedAt);
      metrics.activities[activityState] += 1;
    }
    const totals = Object.values(metrics).reduce((summary, category) => ({
      inserted: summary.inserted + category.inserted,
      updated: summary.updated + category.updated,
      unchanged: summary.unchanged + category.unchanged,
    }), { inserted: 0, updated: 0, unchanged: 0 });
    await client.query(
      `UPDATE ingestion_runs SET completed_at = $2, status = $3, records_inserted = $4, records_updated = $5, records_unchanged = $6,
       records_skipped = $7, errors_json = $8::jsonb WHERE id = $1`,
      [runId, new Date().toISOString(), errors.length ? "completed_with_errors" : "completed", totals.inserted, totals.updated, totals.unchanged, skippedRecords, JSON.stringify(errors)],
    );
    await client.query("COMMIT");
    return { runId, metrics };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function inspectDatabase(pool) {
  const tables = ["ingestion_runs", "source_records", "source_record_versions", "members", "constituent_areas", "bills", "bill_actions", "activity_records", "change_events"];
  const counts = {};
  for (const table of tables) {
    const result = await pool.query(`SELECT COUNT(*)::int AS count FROM ${table}`);
    counts[table] = result.rows[0].count;
  }
  return counts;
}
