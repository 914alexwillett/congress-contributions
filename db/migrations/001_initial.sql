CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ingestion_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  records_seen INTEGER NOT NULL DEFAULT 0,
  records_inserted INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  records_unchanged INTEGER NOT NULL DEFAULT 0,
  records_skipped INTEGER NOT NULL DEFAULT 0,
  errors_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS source_records (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_updated_at TIMESTAMPTZ,
  payload_json JSONB NOT NULL,
  payload_hash TEXT NOT NULL,
  first_seen_at TIMESTAMPTZ NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL,
  last_ingestion_run_id TEXT REFERENCES ingestion_runs(id),
  UNIQUE (source, resource_type, external_id)
);

CREATE TABLE IF NOT EXISTS source_record_versions (
  id TEXT PRIMARY KEY,
  source_record_id TEXT NOT NULL REFERENCES source_records(id),
  payload_hash TEXT NOT NULL,
  retrieved_at TIMESTAMPTZ NOT NULL,
  ingestion_run_id TEXT NOT NULL REFERENCES ingestion_runs(id),
  payload_json JSONB NOT NULL,
  UNIQUE (source_record_id, payload_hash)
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  chamber TEXT NOT NULL CHECK (chamber IN ('house', 'senate')),
  state TEXT NOT NULL,
  district TEXT,
  party TEXT,
  current BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS external_identifiers (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  UNIQUE (entity_type, source, external_id)
);

CREATE TABLE IF NOT EXISTS constituent_areas (
  id TEXT PRIMARY KEY,
  zip TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  summary TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS constituent_area_members (
  constituent_area_id TEXT NOT NULL REFERENCES constituent_areas(id),
  member_id TEXT NOT NULL REFERENCES members(id),
  PRIMARY KEY (constituent_area_id, member_id)
);

CREATE TABLE IF NOT EXISTS bills (
  id TEXT PRIMARY KEY,
  congress INTEGER NOT NULL,
  type TEXT NOT NULL,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  origin_chamber TEXT NOT NULL CHECK (origin_chamber IN ('house', 'senate')),
  introduced_at DATE,
  current_status TEXT NOT NULL,
  source_record_id TEXT REFERENCES source_records(id),
  updated_at TIMESTAMPTZ NOT NULL,
  UNIQUE (congress, type, number)
);

CREATE TABLE IF NOT EXISTS bill_actions (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL REFERENCES bills(id),
  occurred_at DATE NOT NULL,
  action_type TEXT NOT NULL,
  action_code TEXT,
  action_text TEXT NOT NULL,
  source_record_id TEXT NOT NULL REFERENCES source_records(id),
  UNIQUE (bill_id, occurred_at, action_text)
);

CREATE TABLE IF NOT EXISTS amendments (
  id TEXT PRIMARY KEY,
  congress INTEGER NOT NULL,
  type TEXT NOT NULL,
  number TEXT NOT NULL,
  bill_id TEXT REFERENCES bills(id),
  sponsor_member_id TEXT REFERENCES members(id),
  offered_at DATE,
  status TEXT,
  UNIQUE (congress, type, number)
);

CREATE TABLE IF NOT EXISTS committees (
  id TEXT PRIMARY KEY,
  chamber TEXT NOT NULL CHECK (chamber IN ('house', 'senate')),
  name TEXT NOT NULL,
  purpose TEXT,
  source_record_id TEXT REFERENCES source_records(id)
);

CREATE TABLE IF NOT EXISTS committee_memberships (
  committee_id TEXT NOT NULL REFERENCES committees(id),
  member_id TEXT NOT NULL REFERENCES members(id),
  role TEXT NOT NULL,
  PRIMARY KEY (committee_id, member_id)
);

CREATE TABLE IF NOT EXISTS bill_committees (
  bill_id TEXT NOT NULL REFERENCES bills(id),
  committee_id TEXT NOT NULL REFERENCES committees(id),
  PRIMARY KEY (bill_id, committee_id)
);

CREATE TABLE IF NOT EXISTS activity_records (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  bill_id TEXT REFERENCES bills(id),
  amendment_id TEXT REFERENCES amendments(id),
  occurred_at DATE NOT NULL,
  type TEXT NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  outcome TEXT,
  source_record_id TEXT NOT NULL REFERENCES source_records(id),
  issue_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  change_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  related_contribution_id TEXT
);

CREATE TABLE IF NOT EXISTS evidence_records (
  id TEXT PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_record_id TEXT REFERENCES source_records(id),
  label TEXT NOT NULL,
  retrieved_at TIMESTAMPTZ,
  UNIQUE (source_url, label)
);

CREATE TABLE IF NOT EXISTS change_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  change_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  ingestion_run_id TEXT NOT NULL REFERENCES ingestion_runs(id),
  before_json JSONB,
  after_json JSONB,
  UNIQUE (ingestion_run_id, entity_type, entity_id, change_type)
);

CREATE INDEX IF NOT EXISTS activity_records_member_date_idx ON activity_records (member_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS activity_records_bill_date_idx ON activity_records (bill_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS change_events_run_idx ON change_events (ingestion_run_id, occurred_at DESC);
