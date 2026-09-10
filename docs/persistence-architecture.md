# Persistence Architecture

Date: 2026-09-10

## Decision

Phase 3 uses PostgreSQL through the lightweight `pg` client and explicit SQL migrations. This project does not need an ORM yet: the schema is small enough to be understandable as SQL, queries remain visible, and the repository can be exercised with a PostgreSQL-compatible isolated test database.

The public Vite application does not connect to PostgreSQL. Phase 4 adds a small Node API and explicit read-query repository under `server/`; the browser makes only relative `/api` requests. The API maps PostgreSQL rows to compact project-domain DTOs, keeps raw source payloads server-side, and returns official source URLs as evidence. Curated deep contributions remain file-backed behind the application repository while generated routine activity is refreshed through the API. Static generated data remains a deployment fallback until a hosted API and PostgreSQL service are configured.

## Data Layers

`source_records` holds the current complete official payload and identity metadata. `source_record_versions` stores each distinct payload hash, so unchanged records do not duplicate while changed upstream state remains inspectable.

Canonical relational entities are separate: `members`, `external_identifiers`, `constituent_areas`, `constituent_area_members`, `bills`, `bill_actions`, `amendments`, `committees`, `committee_memberships`, and `bill_committees`.

Product-facing routine records are stored in `activity_records`. `change_events` records observed insertions and updates by ingestion run. `evidence_records` prepares a normalized evidence path for the curated contribution layer, which remains source-backed TypeScript in this phase.

## Historical Behavior

Each `ingestion_runs` row records operational status and aggregate inserted, updated, unchanged, skipped, and error counts. Source payload hashes and version rows answer whether a record changed between runs without snapshotting the whole database. Current indexes support member activity, bill activity, constituent-area delegation activity, date-range activity, and run-scoped change queries.

## Local Workflow

Set the server-only `DATABASE_URL` in `.env`; never prefix it with `VITE_`.

```text
npm run db:migrate
npm run db:seed
npm run db:inspect
npm run ingest:congress
```

`db:seed` imports the existing generated Phase 2 dataset and uses `data/raw/congress-latest.json` when present to preserve complete raw payloads. `db:reset` is destructive and requires `CONFIRM_DB_RESET=RESET_CONGRESS_CONTRIBUTIONS`.

Any standard PostgreSQL provider usable from a server environment is compatible. Production requires a managed `DATABASE_URL`, a server-side ingestion runner, migration deployment, and operational monitoring; Phase 3 does not claim to provide those operations.
