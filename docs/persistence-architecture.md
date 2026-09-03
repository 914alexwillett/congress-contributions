# Persistence Architecture Assessment

Date: 2026-09-03

## Current Decision

Recommended option: `Option A`

Remain frontend and curated-data driven for now, while preparing explicit interfaces for future persistence.

## Why Not Add PostgreSQL Yet

The project has grown past a single-area proof of concept, but it has not yet crossed the threshold where a live database and backend clearly pay for their operational cost.

Current constraints:

* the application still runs on a manually curated dataset;
* there is no automated ingestion job to persist;
* there is no normalization pipeline to schedule or observe;
* there is no public API contract yet that multiple clients depend on;
* there is no query volume or dataset size pressure that static in-repo data cannot handle today.

Adding PostgreSQL now would mostly create infrastructure around data that is still being hand-authored.

## Why Preparation Is Justified Now

The repo has reached the point where persistence planning materially helps.

Signals:

* multiple constituent areas now exist;
* member coverage spans both chambers and multiple states;
* source provenance is first-class;
* time is already central to activity and contribution queries;
* future goals include amendments, bill histories, lineage, lobbying, campaign finance, and spending context;
* the frontend should remain insulated from storage details.

## Current Architectural Assessment

The existing repo already has three promising conceptual layers:

* `src/data/curated/`
  Source-backed seed data and placeholders.
* `src/domain/`
  Project-owned models and derived presentation logic.
* `src/services/`
  Repository-style access between UI and data.

Main gaps before a durable backend:

* `ActivityRecord` exists as a type but is not yet a first-class dataset or feed source.
* canonical identity and external identity mapping are still implicit in handcrafted IDs.
* geographic resolution is still deterministic ZIP-to-delegation mapping rather than a broader area model with district identity.
* source records are preserved, but not yet organized for re-normalization workflows.
* derived records and normalized entities still live in the same in-repo seed layer.

## Recommended Future Data Layers

### 1. Raw Source Records

Preserve fetched public records close to original form.

Suggested tables:

* `source_records`
* `source_record_blobs` or JSON payload column

Suggested fields:

* `id`
* `source`
* `source_category`
* `external_id`
* `source_url`
* `retrieved_at`
* `source_updated_at`
* `payload_json`
* `content_hash`

Purpose:

* re-normalize later without re-fetching;
* audit what was actually retrieved;
* compare changed source payloads over time.

### 2. Canonical Normalized Entities

Project-owned identities, not third-party API shapes.

Suggested tables:

* `states`
* `members`
* `member_external_identifiers`
* `congressional_districts`
* `constituent_areas`
* `constituent_area_mappings`
* `committees`
* `committee_memberships`
* `issues`
* `bills`
* `bill_external_identifiers`
* `bill_versions`
* `amendments`
* `amendment_external_identifiers`
* `votes`
* `vote_positions`
* `organizations`

Important rule:

Internal IDs should be canonical. Congress.gov IDs, FEC IDs, amendment numbers, and future source keys should be linked through external-identifier tables rather than becoming the primary key strategy.

### 3. Derived Application Records

Project-specific interpretations built from normalized evidence.

Suggested tables:

* `activity_records`
* `activity_record_evidence`
* `legislative_contributions`
* `contribution_evidence`
* `contribution_lineage_claims`
* `contribution_issue_tags`
* `bill_issue_tags`

Purpose:

* support product-facing questions cleanly;
* separate raw evidence from derived interpretation;
* attach evidence directly to contribution and lineage claims.

## Geographic Model

Recommended shape:

```text
constituent_area
  -> may resolve to one or more district mappings over time
district
  -> current or historical House member
state
  -> Senate member terms
```

The current app should keep deterministic ZIP support, but future persistence should support:

* ZIP-based demo mappings;
* later address-based district resolution;
* time-bounded district and member assignments;
* separate House and Senate resolution paths.

## Historical Time Modeling

Time should be first-class across:

* member terms;
* committee memberships;
* bill actions;
* amendment actions;
* vote events;
* activity records;
* contribution records;
* source retrieval timestamps.

Recommended query posture:

* filter by congress number;
* filter by event date range;
* preserve source retrieval dates separately from event dates.

## Legislative Lineage Direction

Do not implement full automated text lineage yet, but make room for it.

Suggested lineage-oriented records:

* `bill_versions`
* `amendments`
* `amendment_targets`
* `text_change_claims`
* `lineage_stage_claims`
* `claim_evidence`

This should support:

* partial lineage;
* unknown stages;
* bill-version references;
* contribution outcome versus bill outcome;
* evidence-backed claims about text survival.

## Future Lobbying and Finance Compatibility

A PostgreSQL schema can support this cleanly without a graph database.

Suggested future tables:

* `campaign_committees`
* `campaign_contributions`
* `pacs`
* `lobbying_filings`
* `lobbying_clients`
* `lobbyists`
* `lobbying_bill_matches`
* `organization_issue_matches`
* `federal_awards`

Relationship strength should remain explicit in derived application tables:

* `DIRECT_BILL_MATCH`
* `POLICY_AREA_MATCH`
* `INDUSTRY_CONTEXT`

Do not encode causal conclusions in schema names or joins.

## API Boundary

The frontend should continue consuming application-oriented queries, not database tables and not raw government responses.

Recommended backend surface:

* `GET /api/constituent-areas/:zip/delegation`
* `GET /api/members/:id`
* `GET /api/members/:id/activity`
* `GET /api/members/:id/contributions`
* `GET /api/contributions/:id`
* `GET /api/bills/:id`
* `GET /api/bills/:id/activity`
* `GET /api/issues/:id/activity`
* `GET /api/source-records/:id`

The route shapes can change. The principle should not.

## Data Explorer Role

A future internal explorer is justified, but not yet as a full second app.

Near-term best use:

* inspect canonical entities;
* inspect source records;
* trace contribution evidence;
* compare normalized data with derived activity/contribution records;
* help distinguish data-quality bugs from UI bugs.

Recommended timing:

* after persistence exists;
* after a minimal API or local query layer exists;
* before large-scale ingestion makes debugging opaque.

## Migration Path From Today

```text
Current curated files
        ->
seed/import transforms
        ->
canonical PostgreSQL tables
        ->
derived activity/contribution builders
        ->
backend API
        ->
frontend repository implementation
```

Recommended order:

1. Keep curated data as the source-backed seed set.
2. Formalize a frontend-facing repository interface.
3. Introduce explicit activity-record data when the feed diverges from deep contributions.
4. Define PostgreSQL schema and seed/import scripts.
5. Add a lightweight backend API only when there is persistent data to serve.
6. Swap the frontend repository implementation from static to API-backed with minimal UI churn.

## What Should Stay Curated

Even after persistence exists, some things should remain curated or editorial:

* explanatory copy;
* issue classification overrides;
* attribution caveats;
* lineage notes where deterministic reconstruction is incomplete;
* influence-context interpretation rules.

## What Should Become Persistent First

First persistence candidates:

* raw source records;
* canonical members, districts, states, and committees;
* bills, amendments, votes, and bill versions;
* derived activity records;
* derived legislative contributions;
* evidence joins;
* time-bounded geographic mappings.

## Next Trigger For Introducing PostgreSQL

Move to `Option B` when one or more of these becomes active work rather than a future intention:

* automated ingestion from Congress.gov or GovInfo;
* repeat normalization over changing source payloads;
* multiple time-bounded geographic areas;
* historical timelines across many Congresses;
* amendment or bill-version lineage processing;
* first real lobbying or finance joins;
* need for internal data debugging beyond reading TypeScript seed files.
