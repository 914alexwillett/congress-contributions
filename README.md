# Congress Contributions

Congress Contributions is an evidence-first civic application for making federal political representation easier to understand between elections.

The application is designed around a simple question:

> What did my representative actually do in Congress, what does that action mean, what happened because of it, and what evidence supports that conclusion?

Rather than functioning as another voting scorecard or congressional database, the project aims to turn public legislative records into understandable, auditable civic context.

The citizen makes the political judgment.

The application clarifies the record.

---

## Current Status

Congress Contributions is currently an early vertical-slice application.

The working geography currently includes two curated ZIP codes:

```text
20852
94102
```

which currently expose:

### 20852

**Jamie Raskin**
Maryland's 8th Congressional District

**Chris Van Hollen**
Maryland

**Angela Alsobrooks**
Maryland

### 94102

**Nancy Pelosi**
California's 11th Congressional District

**Alex Padilla**
California

**Adam Schiff**
California

The narrow geographic scope is intentional.

The current goal is to develop a deep, convincing model of legislative activity before expanding to every member of Congress.

---

## Product Direction

The project began as a way to inspect legislative contributions by individual representatives.

It is evolving toward a broader goal:

> Make political representation continuously observable between elections.

Representatives act continuously, while citizens often evaluate those actions only during election cycles.

Congress Contributions aims to shorten that feedback loop by making congressional activity:

* easier to find;
* easier to understand;
* easier to contextualize;
* easier to trace through the legislative process;
* easier to verify against primary sources.

---

## Core Experience

The basic product flow is:

```text
ZIP code
    ↓
Federal delegation
    ↓
Recent legislative activity
    ↓
Member
    ↓
Legislative contribution
    ↓
Bill context
    ↓
Outcome / lineage
    ↓
Evidence
```

The long-term signature capability is:

```text
Member
    ↓
Amendment
    ↓
Text Change
    ↓
Outcome
    ↓
Later Bill Version
    ↓
House / Senate
    ↓
Final Law
```

---

## Legislative Contributions

The central domain object is a `LegislativeContribution`.

A contribution represents an observable, evidence-backed action by a member of Congress.

Examples include:

* sponsoring a bill;
* cosponsoring legislation;
* offering a floor amendment;
* offering a committee amendment;
* proposing a substitute amendment;
* participating in a meaningful committee action;
* casting a procedural vote;
* casting a final-passage vote;
* making a documented appropriations-related contribution;
* proposing legislative text that can be traced into later bill versions.

The application explicitly distinguishes:

* formal sponsorship;
* political support;
* observable legislative text-shaping;
* literal drafting authorship.

For example:

> Member X introduced a bill

does not automatically mean:

> Member X personally wrote every word of the bill.

---

## Context Before Jargon

Congressional records are often technically available but difficult for non-specialists to interpret.

Contribution views should therefore explain:

1. What happened?
2. What did the member actually do?
3. What does the congressional procedure mean?
4. What immediate consequence did the action have?
5. What happened next?
6. What happened to the underlying bill?
7. What evidence supports the explanation?

A beginner should be able to understand the primary explanation.

A more experienced user should still be able to inspect detailed congressional metadata and primary-source evidence.

---

## Evidence Philosophy

Important claims should be auditable.

Preferred sources include:

* Congress.gov;
* GovInfo;
* official House records;
* official Senate records;
* official committee records;
* official member office pages.

Future contextual data may include:

* FEC / OpenFEC campaign-finance records;
* Lobbying Disclosure Act records;
* USAspending federal-award data.

The intended information flow is:

```text
Official source
    ↓
Source record
    ↓
Normalization
    ↓
Project-owned domain model
    ↓
Deterministic interpretation where possible
    ↓
Human-readable interface
```

AI should not be used as the factual source of record.

---

## Political Neutrality

The application is intentionally not designed to produce:

* partisan scores;
* ideological rankings;
* legislator grades;
* corruption scores;
* simplistic effectiveness scores.

It should not infer:

* intent;
* virtue;
* corruption;
* ideology;
* quid pro quo;
* causality between lobbying, donations, and legislative actions.

Observable relationships can be displayed as context.

The user should decide what those facts mean politically.

---

## Long-Term Power Context

The broader product vision extends beyond legislation alone.

Future versions may connect:

```text
Member
Committee
Bill
Amendment
Vote
Organization
Lobbying activity
Campaign finance
Federal spending
```

Potential future questions include:

* Which organizations reported lobbying on this bill?
* Which policy areas are receiving lobbying attention?
* What campaign-finance relationships surround a member?
* What committees give the member institutional influence?
* What federal spending relationships exist around affected industries or organizations?

These relationships provide context, not accusations.

---

## Current Technology

The current frontend uses:

* React
* TypeScript
* Vite

The project intentionally avoids premature backend complexity.

A backend will likely become appropriate when the application begins automatic ingestion, normalization, source storage, entity resolution, and cross-dataset joins.

---

## Getting Started

### Requirements

Install:

* Node.js
* npm
* Git

Verify:

```bash
node --version
npm --version
git --version
```

### Install dependencies

From the project root:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

It is commonly:

```text
http://localhost:5173
```

but use the URL printed by the current development server.

### Production build

```bash
npm run build
```

The Vite production output should be generated in:

```text
dist/
```

### Preview the production build

If the project currently includes the standard Vite preview script:

```bash
npm run preview
```

---

## Repository Documentation

This repository uses four project-level documents with different responsibilities.

### `PROJECT_OVERVIEW.md`

The product source of truth.

Read this for:

* mission;
* product thesis;
* evidence philosophy;
* domain direction;
* architecture direction;
* non-goals;
* broader political-power vision.

### `AGENTS.md`

Instructions for AI coding agents.

Read this for:

* required project-reading order;
* implementation constraints;
* evidence rules;
* coding expectations;
* verification expectations;
* documentation responsibilities.

### `PLANS.md`

The active implementation roadmap.

Read this for:

* current milestone;
* priority order;
* near-term features;
* open questions;
* intentionally deferred work.

### `README.md`

Human-facing repository guide.

This document covers:

* project purpose;
* current scope;
* technology;
* setup;
* basic architecture;
* documentation map.

---

## Codebase Structure

The current project is intended to maintain responsibilities broadly similar to:

```text
src/
  components/
  data/
    curated/
  domain/
  glossary/
  pages/
  services/
  utils/
```

Exact structure may evolve.

### `src/domain/`

Project-owned domain models and domain logic.

Examples may include:

* members;
* bills;
* legislative contributions;
* activity records;
* evidence;
* lineage;
* presentation helpers.

### `src/data/curated/`

Manually researched data used by the current vertical slice.

Curated records should remain source-backed.

Do not place fabricated legislative data here merely to make the UI look full.

### `src/services/`

Repository-like or query-like access to application data.

The frontend should interact with stable project models rather than raw third-party API payloads.
As the project prepares for future persistence, frontend components should prefer a storage-agnostic repository boundary rather than importing curated-data implementation details directly.

### `src/components/`

Reusable UI components.

### `src/glossary/`

Centralized congressional procedural definitions.

Examples include:

* markup;
* cloture;
* committee amendment;
* final passage;
* substitute amendment;
* cosponsorship;
* appropriations.

Definitions should be reused rather than duplicated throughout components.

---

## Current Data Strategy

The current application uses a manually curated vertical slice.

The near-term goal is to increase both the recency and density of data for:

* Jamie Raskin;
* Chris Van Hollen;
* Angela Alsobrooks;
* Nancy Pelosi;
* Alex Padilla;
* Adam Schiff.

The project may distinguish between:

### Activity records

Lightweight structured events used for recent-activity feeds.

Examples:

* newly sponsored bill;
* vote;
* cosponsorship;
* committee action;
* amendment filed;
* bill advanced.

### Deep legislative contributions

More thoroughly researched records containing:

* procedural context;
* attribution;
* evidence;
* text change where available;
* legislative lineage;
* bill outcome.

This allows the product to feel current without requiring every routine congressional action to receive the same level of manual research.

---

## Future Data Architecture

The project is expected to evolve toward:

```text
Congress.gov
GovInfo
House
Senate
Committee records
FEC
Lobbying Disclosure Act data
USAspending
        ↓
Raw source records
        ↓
Normalization
        ↓
Canonical entities
        ↓
Relationship building
        ↓
Legislative contribution derivation
        ↓
Application data store
        ↓
Backend API
        ↓
Frontend
```

The frontend should not depend directly on third-party API response formats.

For a more specific assessment of when to introduce PostgreSQL and how the migration should work, see:

`docs/persistence-architecture.md`

---

## Likely Future Backend

A future backend may be responsible for:

* scheduled data ingestion;
* raw source storage;
* normalization;
* entity resolution;
* source provenance;
* legislative contribution derivation;
* amendment/text lineage;
* campaign-finance joins;
* lobbying joins;
* federal-spending joins.

PostgreSQL is the likely default datastore unless the application develops a concrete need for something different.

A graph database is not currently required.

---

## Deployment

The frontend is intended to be deployable to Vercel.

Typical Vite deployment settings are:

```text
Build command:
npm run build

Output directory:
dist
```

Before deployment:

```bash
npm run build
```

should complete successfully.

If the application uses client-side routes that need SPA fallback behavior, deployment configuration may need to provide the appropriate rewrite.

Do not migrate the project to another framework solely for deployment.

---

## Product Principles

The project should preserve the following principles:

1. Actions before interpretation.
2. Context before jargon.
3. Evidence before scoring.
4. Sponsorship is not literal authorship.
5. Cosponsorship is formal support, not necessarily drafting.
6. Amendments are especially valuable evidence of text-shaping.
7. Contribution outcome and bill outcome are distinct.
8. Institutional position is relevant to understanding political power.
9. Observable relationships are not automatically causal relationships.
10. Unknown is acceptable.
11. Every important claim should be auditable.
12. Teach through consistent structure rather than adaptive UI.
13. Primary evidence should remain accessible.
14. Representation should be understandable between elections.
15. The citizen makes the judgment; the application clarifies the record.

---

## Current Development Priority

Do not prioritize national expansion yet.

The current preferred order is:

```text
More current delegation data
        ↓
Recent activity
        ↓
"What changed?"
        ↓
Contribution outcome vs bill outcome
        ↓
Legislative lineage
        ↓
Bill context
        ↓
Committee context
        ↓
Issue / legislative attention
        ↓
Source normalization
        ↓
First lobbying or campaign-finance context slice
```

For the authoritative current roadmap, read:

`PLANS.md`

For the full product thesis and long-term direction, read:

`PROJECT_OVERVIEW.md`

For AI-agent implementation rules, read:

`AGENTS.md`
