function sourceRecord(row) {
  return {
    id: row.source_record_id,
    source: row.source,
    externalId: row.external_id,
    title: row.source_title,
    sourceUrl: row.source_url,
    retrievedAt: new Date(row.last_seen_at).toISOString(),
    sourceUpdatedAt: row.source_updated_at ? new Date(row.source_updated_at).toISOString() : undefined,
    resourceType: row.resource_type,
    // Raw payloads remain server-side; this marker preserves the source-record shape.
    payload: null,
  };
}

function dateOnly(value) {
  return typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

function member(row) {
  return {
    id: row.id,
    name: row.display_name,
    chamber: row.chamber,
    state: row.state,
    district: row.district ?? undefined,
    party: row.party ?? "Unknown",
  };
}

function bill(row) {
  const evidence = row.source_record_id ? [{
    label: row.source_title,
    url: row.source_url,
    sourceType: "congress_gov",
    sourceRecordId: row.source_record_id,
    supports: "Official Congress.gov bill record.",
  }] : [];
  return {
    id: row.id,
    measure: {
      id: row.id,
      congress: row.congress,
      type: row.type,
      number: row.number,
      title: row.title,
      shortTitle: row.short_title ?? undefined,
    },
    originChamber: row.origin_chamber,
    broadPurpose: row.title,
    currentState: row.current_status,
    legislativeState: "unknown",
    issueIds: [],
    committeeNames: [],
    lineage: { proposed: true, committee: null, house: null, senate: null, enacted: null },
    becameLaw: null,
    evidence,
  };
}

function activity(row) {
  return {
    id: row.id,
    memberId: row.member_id,
    date: dateOnly(row.occurred_at),
    type: row.type,
    headline: row.headline,
    summary: row.summary,
    measureId: row.bill_id ?? undefined,
    measure: row.bill_id ? {
      id: row.bill_id,
      congress: row.congress,
      type: row.bill_type,
      number: row.bill_number,
      title: row.bill_title,
      shortTitle: row.bill_short_title ?? undefined,
    } : undefined,
    issueIds: row.issue_ids,
    outcomeLabel: row.outcome ?? undefined,
    changeTags: row.change_tags,
    evidence: row.evidence_json,
    relatedContributionId: row.related_contribution_id ?? undefined,
  };
}

const areaSelect = `SELECT id, zip, label, city, state, summary FROM constituent_areas WHERE zip = $1`;
const memberSelect = `SELECT m.* FROM members m
  JOIN constituent_area_members cam ON cam.member_id = m.id
  WHERE cam.constituent_area_id = $1 ORDER BY m.chamber, m.display_name`;
const billSelect = `SELECT b.*, sr.id AS source_record_id, sr.title AS source_title, sr.source_url
  FROM bills b LEFT JOIN source_records sr ON sr.id = b.source_record_id`;

export function createReadRepository(pool) {
  return {
    async health() {
      await pool.query("SELECT 1");
      return { database: "ready" };
    },

    async delegationByZip(zip) {
      const areaResult = await pool.query(areaSelect, [zip]);
      if (!areaResult.rowCount) return undefined;
      const area = areaResult.rows[0];
      const members = (await pool.query(memberSelect, [area.id])).rows.map(member);
      const memberIds = members.map((entry) => entry.id);
      const activityResult = await pool.query(
        `SELECT a.*, b.congress, b.type AS bill_type, b.number AS bill_number, b.title AS bill_title, b.short_title AS bill_short_title
         FROM activity_records a LEFT JOIN bills b ON b.id = a.bill_id
         WHERE a.member_id = ANY($1::text[]) ORDER BY a.occurred_at DESC, a.id ASC`,
        [memberIds],
      );
      const activityRows = activityResult.rows;
      const activities = activityRows.map(activity);
      const billIds = [...new Set(activityRows.map((entry) => entry.bill_id).filter(Boolean))];
      const bills = billIds.length
        ? (await pool.query(`${billSelect} WHERE b.id = ANY($1::text[]) ORDER BY b.introduced_at DESC NULLS LAST, b.id`, [billIds])).rows.map(bill)
        : [];
      const sourceIds = [...new Set(activityRows.map((entry) => entry.source_record_id))];
      const sources = sourceIds.length
        ? (await pool.query(
          `SELECT id AS source_record_id, source, external_id, title AS source_title, source_url, source_updated_at, last_seen_at, resource_type
           FROM source_records WHERE id = ANY($1::text[])`,
          [sourceIds],
        )).rows.map(sourceRecord)
        : [];
      return {
        area: { zip: area.zip, label: area.label, city: area.city, state: area.state, summary: area.summary, memberIds },
        members,
        activities,
        bills,
        sources,
      };
    },

    async memberById(memberId) {
      const result = await pool.query("SELECT * FROM members WHERE id = $1", [memberId]);
      return result.rowCount ? member(result.rows[0]) : undefined;
    },

    async memberActivity(memberId) {
      const result = await pool.query(
        `SELECT a.*, b.congress, b.type AS bill_type, b.number AS bill_number, b.title AS bill_title, b.short_title AS bill_short_title
         FROM activity_records a LEFT JOIN bills b ON b.id = a.bill_id
         WHERE a.member_id = $1 ORDER BY a.occurred_at DESC, a.id ASC`,
        [memberId],
      );
      return result.rows.map(activity);
    },

    async billById(billId) {
      const result = await pool.query(`${billSelect} WHERE b.id = $1`, [billId]);
      return result.rowCount ? bill(result.rows[0]) : undefined;
    },
  };
}
