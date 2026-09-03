# PLANS.md

This document tracks the current implementation direction and near-term roadmap for Congress Contributions.

For product principles, evidence philosophy, and long-term direction, read `PROJECT_OVERVIEW.md`.

For agent working rules, read `AGENTS.md`.

This file should remain practical and current.

---

# Current Product Stage

The project has moved beyond its original proof-of-concept question:

> Can we display source-backed legislative contributions for a constituent's federal delegation?

The next stage is:

> Can we make congressional representation feel continuously observable and understandable between elections?

The application currently remains intentionally narrow around two curated ZIP codes and six federal legislators:

* `20852`: Jamie Raskin, Chris Van Hollen, Angela Alsobrooks;
* `94102`: Nancy Pelosi, Alex Padilla, Adam Schiff.

The next major gains should come from **depth, recency, and context**, not national geographic expansion.

---

# Current Strategic Goal

Build a convincing vertical slice in which a user can open the application and immediately feel that Congress is actively happening.

The application should increasingly answer:

* What has my delegation done recently?
* What changed?
* Which bills are moving?
* Which amendments succeeded or failed?
* What happened to the underlying bill afterward?
* What issues are receiving legislative attention?
* What committees give these members influence?
* What evidence supports every important claim?

The app should feel alive without turning into a political-news feed.

---

# Current Milestone: V3 — Continuous Representation

## Goal

Transform the existing member/profile-oriented POC into an experience centered more strongly around ongoing congressional activity.

## Success Criteria

A user entering a supported ZIP such as `20852` or `94102` should be able to:

1. See the three-member federal delegation.
2. See meaningful recent activity without opening each member individually.
3. Understand each action in plain English.
4. Distinguish routine activity from deeper legislative contributions.
5. Open important contributions for detailed context.
6. Distinguish contribution outcome from bill outcome.
7. Follow known legislative lineage.
8. Understand committee and bill context.
9. See issue areas represented in recent activity.
10. Inspect the evidence supporting factual claims.

---

# Phase 1 — Increase Current Data Density

## Objective

Make the product feel populated and current while retaining the existing evidence standard.

## Work

Add substantially more recent records for:

* Jamie Raskin;
* Chris Van Hollen;
* Angela Alsobrooks;
* Nancy Pelosi;
* Alex Padilla;
* Adam Schiff.

Target a useful working dataset rather than an arbitrary maximum.

A reasonable initial goal is approximately:

* 15–25 recent activity records per member;
* 5–8 deeper contribution records per member where sufficient evidence exists.

These are working targets, not quotas.

Prefer accuracy over volume.

## Activity Types

Include a useful mix of:

* newly sponsored bills;
* cosponsorships;
* committee activity;
* committee amendments;
* floor amendments;
* adopted amendments;
* rejected amendments;
* procedural votes;
* final-passage votes;
* legislation advancing to a new stage;
* legislation becoming law;
* appropriations-related actions where attribution is sufficiently strong.

## Important Modeling Decision

Do not require every activity item to become a fully researched `LegislativeContribution`.

Introduce or formalize a lighter activity model if needed.

Conceptually:

```text
ActivityRecord
    ↓ optionally references
LegislativeContribution
```

An `ActivityRecord` should support the broad chronological feed.

A `LegislativeContribution` should support deeper research, attribution, lineage, text change, and evidence.

---

# Phase 2 — Delegation Activity Experience

## Objective

Make recent representation the primary landing experience after ZIP lookup.

## Potential Sections

### Your Delegation

* Jamie Raskin
* Chris Van Hollen
* Angela Alsobrooks

### Recent Activity

A chronological feed of meaningful structured congressional activity.

### What Changed

Summaries derived from the current dataset, such as:

* new amendments;
* adopted amendments;
* bills advancing;
* newly sponsored legislation;
* contributions reaching a later stage.

### Active Bills

Bills with recent meaningful activity involving one or more members of the delegation.

### Legislative Attention

Issue areas represented in the current activity dataset.

## Constraint

Do not make this a generic newsfeed.

Items should originate from congressional actions and source-backed records.

---

# Phase 3 — Contribution Outcome vs Bill Outcome

## Objective

Make it immediately clear that a member's individual action and the fate of the underlying bill are not the same thing.

## Example

```text
AMENDMENT
✓ Adopted

UNDERLYING BILL
✓ Passed House
✓ Passed Senate
✕ Did not become law
```

or:

```text
AMENDMENT
✕ Rejected

UNDERLYING BILL
✓ Continued without amendment
✓ Passed House
```

This should become a first-class visual pattern.

---

# Phase 4 — Legislative Lineage

## Objective

Improve the ability to show what happened after a contribution.

The long-term target remains:

```text
Member
  ↓
Amendment
  ↓
Text Change
  ↓
Outcome
  ↓
Later Version
  ↓
House / Senate
  ↓
Law
```

## Near-Term Implementation

Support partial lineage honestly.

Examples:

```text
Proposed → Rejected
```

```text
Proposed → Adopted → Included in committee version
```

```text
Introduced → Committee → No further action
```

```text
Proposed → Adopted → House-passed → Senate status unknown
```

Do not infer missing stages.

---

# Phase 5 — Better Bill Context

## Objective

A user should not need to understand a contribution in isolation.

Bill views should increasingly answer:

* What does this bill broadly do?
* Why is Congress considering it?
* Which chamber originated it?
* Which committees handled it?
* Where is it now?
* What did my delegation do in relation to it?
* What happened to relevant amendments?
* Did the bill become law?

Avoid leading with raw congressional action logs.

Expose raw records as a deeper layer.

---

# Phase 6 — Committee Context and Institutional Power

## Objective

Help users understand why committee membership matters.

For relevant committees, support:

* concise description of jurisdiction;
* member's role;
* recent member activity in that committee;
* connection between committee responsibility and observable actions.

Conceptually:

```text
Institutional position
        ↓
Opportunity to influence
        ↓
Observable legislative action
```

Do not convert committee membership into a subjective power score.

---

# Phase 7 — Issue / Legislative Attention Model

## Objective

Allow the app to show what areas are receiving a member's legislative attention.

Potential issue categories include:

* judiciary;
* immigration;
* civil rights;
* housing;
* healthcare;
* defense;
* taxation;
* labor;
* technology;
* appropriations;
* government oversight.

Issue classification should represent observable subject matter.

Do not infer ideology.

## Future Experience

```text
RECENT LEGISLATIVE ATTENTION

Housing
Judiciary
Civil rights
Government oversight
```

Eventually this can support issue-centric browsing across the user's delegation.

---

# Phase 8 — Source Record Normalization

## Objective

Prepare the project for real API ingestion without prematurely building a large backend.

Current curated data should increasingly resemble normalized project-owned records rather than arbitrary frontend data.

Target architecture:

```text
Congress.gov / GovInfo / House / Senate / Committees
        ↓
Raw source records
        ↓
Normalization
        ↓
Canonical entities
        ↓
Relationships
        ↓
Legislative contributions
        ↓
Application data
```

## Near-Term Tasks

* formalize source-record types;
* preserve external identifiers;
* preserve retrieval/source metadata where available;
* prevent UI components from depending on third-party API schemas;
* make curated data conform to the same domain concepts future ingestion will produce.

---

# Phase 9 — First Real Influence Context Slice

This phase should begin only after the recent-activity and contribution experience is strong.

## Goal

Demonstrate one carefully researched example of contextual political influence data.

Choose either:

* lobbying; or
* campaign finance.

Do not attempt full ingestion.

## Lobbying Candidate

For one selected bill:

* identify lobbying filings that explicitly name the bill where possible;
* distinguish `DIRECT_BILL_MATCH` from weaker policy-area relationships;
* show organizations and filings;
* link back to public records;
* avoid causal claims.

## Campaign Finance Candidate

For one selected member:

* identify authorized campaign committee data;
* show a limited, clearly sourced finance context;
* preserve underlying records;
* avoid unsupported industry aggregation.

The purpose is to validate the contextual model, not to build a complete finance platform.

---

# Phase 10 — Backend / Ingestion Decision

Do not introduce a complex backend simply because the long-term architecture will need one.

Revisit backend introduction when one or more of these becomes true:

* automatic Congress.gov synchronization is required;
* normalization jobs need persistence;
* source provenance needs database-backed storage;
* entity resolution becomes necessary;
* FEC/LDA joins become difficult to manage statically;
* legislative lineage processing requires scheduled computation;
* frontend bundle/data size becomes impractical.

Likely long-term direction:

```text
External sources
    ↓
ingestion jobs
    ↓
raw source storage
    ↓
normalization
    ↓
PostgreSQL
    ↓
derived contribution/context layer
    ↓
backend API
    ↓
frontend
```

PostgreSQL should be preferred over a graph database unless a concrete requirement emerges.

---

# Data Sources Roadmap

## Legislative

Primary:

* Congress.gov
* GovInfo
* official House records
* official Senate records
* House committee sites
* Senate committee sites

## Campaign Finance

Future:

* FEC
* OpenFEC

## Lobbying

Future:

* Lobbying Disclosure Act public records
* Senate lobbying disclosure
* House lobbying disclosure

## Federal Spending

Future:

* USAspending

Third-party sources may be useful for enrichment, but primary public records should remain the preferred evidentiary foundation.

---

# Deployment

The application is intended to be deployable to Vercel.

Before production deployment:

* verify `npm run build`;
* verify TypeScript compilation;
* confirm SPA routing requirements;
* ensure secrets and `.env` files are ignored;
* confirm no environment variables are required unless deliberately introduced.

Do not migrate to Next.js solely for Vercel deployment.

---

# Current Non-Goals

Do not prioritize:

* all 535 members;
* nationwide ZIP resolution;
* complete historical congressional ingestion;
* full amendment-execution engine;
* complete legislative provision lineage;
* comprehensive committee scraping;
* full FEC ingestion;
* full LDA ingestion;
* full USAspending ingestion;
* corruption detection;
* causal inference between money and votes;
* ideological scoring;
* legislator performance rankings;
* public comments;
* constituent polling;
* social networking;
* gamification;
* adaptive civic-learning profiles.

---

# Open Product Questions

These are intentionally unresolved.

## 1. Activity vs significance

How should the app distinguish routine activity from particularly meaningful legislative contributions without introducing subjective political scoring?

## 2. Text-change reconstruction

How much amendment-to-text lineage can be deterministically reconstructed from public records?

## 3. Issue classification

Should issue tags remain manually curated initially, use official subject classifications, or eventually use a verified hybrid approach?

## 4. “What changed?”

Should this eventually mean:

* recent activity in a fixed time window;
* changes since the user's previous visit;
* both?

Do not implement invasive behavioral tracking merely to answer this question.

## 5. Influence context

Should the first influence slice be lobbying, campaign finance, or a bill where both can be displayed responsibly?

## 6. Provision lineage

How should the product represent a specific provision that changes across House, Senate, and final enacted versions?

---

# Completed / Established Foundations

The project has already established:

* product mission and evidence philosophy;
* the `LegislativeContribution` concept;
* distinction between sponsorship, support, and drafting;
* initial Maryland delegation vertical slice;
* centralized procedural glossary direction;
* evidence/provenance requirements;
* bill-context direction;
* lineage direction;
* future lobbying/finance/spending architecture;
* explicit rejection of partisan scoring;
* explicit rejection of unsupported causal claims;
* React + TypeScript + Vite frontend direction.

Do not repeatedly redesign these foundations without a substantive reason.

---

# Working Priority Order

Unless this file is intentionally updated, the preferred sequence is:

1. Current and richer delegation data.
2. Lightweight recent activity model.
3. Delegation activity / “What changed?” experience.
4. Contribution outcome vs bill outcome.
5. Legislative lineage.
6. Bill context.
7. Committee context.
8. Issue / legislative-attention model.
9. Source normalization.
10. One carefully scoped lobbying or campaign-finance slice.
11. Decide when real backend ingestion is justified.

The guiding principle remains:

> Expand vertically before expanding universally.
