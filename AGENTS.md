# AGENTS.md

This file defines how AI coding agents should work in the Congress Contributions repository.

`PROJECT_OVERVIEW.md` is the primary source of truth for product intent, evidence philosophy, domain concepts, and long-term direction.

`PLANS.md` is the primary source of truth for current implementation priorities and sequencing.

`README.md` is the primary human-facing setup and repository guide.

---

## 1. Required Reading

Before making meaningful changes to this repository:

1. Read `PROJECT_OVERVIEW.md`.
2. Read `PLANS.md`.
3. Read `README.md` when setup, scripts, architecture, or repository structure are relevant.
4. Inspect the actual current codebase before proposing structural changes.
5. Do not assume prior chat context is available or authoritative if it conflicts with repository documentation.

When documentation and implementation differ, identify the mismatch explicitly rather than silently choosing one.

---

## 2. Product Mission

Congress Contributions is an evidence-first civic application intended to make federal political representation more understandable and continuously observable between elections.

The central user question is:

> What did my representative actually do in Congress, what does that action mean, what happened because of it, and what evidence supports that conclusion?

The product is not intended to be:

* a partisan scorecard;
* a legislator-ranking system;
* a generic vote tracker;
* a political-news feed;
* a corruption detector;
* an ideological recommender;
* an AI-generated interpretation layer without source provenance.

The application should clarify the factual record and allow the citizen to make the political judgment.

---

## 3. Core Product Rules

Preserve these principles throughout implementation.

1. Actions before interpretation.
2. Context before jargon.
3. Evidence before scoring.
4. Sponsorship is not literal authorship.
5. Cosponsorship indicates formal support, not necessarily drafting.
6. Amendments are especially valuable evidence of legislative text-shaping.
7. Contribution outcome and underlying bill outcome are separate concepts.
8. Institutional position matters when explaining political power.
9. Observable lobbying or financial relationships are not proof of causation.
10. Unknown is an acceptable answer.
11. Every important factual claim should be auditable.
12. Primary sources should remain accessible.
13. Teach through consistent structure rather than adaptive or gamified UI.
14. Do not use an LLM as the source of record.
15. Political activity should be legible between elections, not only during campaigns.

---

## 4. Evidence and Attribution Rules

Every meaningful legislative claim displayed by the application should trace back to evidence.

Preferred sources include:

* Congress.gov;
* GovInfo;
* official House records;
* official Senate records;
* official House and Senate committee records;
* official member office pages;
* later, FEC / OpenFEC;
* later, Lobbying Disclosure Act data;
* later, USAspending.

When using secondary sources, preserve the distinction between secondary context and primary evidence.

Never invent legislative facts to fill UI space.

Never infer a stronger attribution than the evidence supports.

Examples:

Valid:

> Member X introduced H.R. 1234.

Valid:

> Member X offered Amendment 17.

Potentially valid when text lineage is supported:

> Amendment 17 proposed replacing X with Y.

Not automatically valid:

> Member X personally wrote every word of H.R. 1234.

Not automatically valid:

> Organization Y caused Member X to vote this way.

If evidence is incomplete, use explicit states such as:

* unknown;
* not established;
* incomplete lineage;
* attribution confidence: medium;
* attribution confidence: low.

---

## 5. Evidence vs Interpretation

Maintain a clear conceptual pipeline:

```text
Official source
    ↓
Source record
    ↓
Normalization
    ↓
Canonical domain object
    ↓
Deterministic interpretation where possible
    ↓
Human-readable interface
```

Do not collapse source retrieval, inference, and presentation into one opaque step.

Prefer deterministic explanation logic for recurring congressional procedures.

For example, a rejected committee amendment can deterministically support an explanation such as:

> The proposed language was not added during this committee action.

Do not call an AI model to generate facts that can be represented directly from structured records.

---

## 6. Domain Modeling

The central domain object remains `LegislativeContribution`.

A contribution represents an observable, evidence-backed congressional action by a member.

Potential contribution types include:

* bill sponsorship;
* cosponsorship;
* floor amendment;
* committee amendment;
* substitute amendment;
* appropriations provision;
* committee action;
* procedural vote;
* final-passage vote;
* other documented text-shaping activity.

Keep domain logic separate from presentation components where practical.

Do not make frontend components depend directly on raw Congress.gov, FEC, lobbying, or other third-party response shapes.

External data should eventually be normalized into project-owned models.

---

## 7. Legislative Lineage

The long-term differentiator is:

```text
Member
  ↓
Amendment
  ↓
Text Change
  ↓
Immediate Outcome
  ↓
Later Bill Version
  ↓
House / Senate
  ↓
Final Law
```

Do not fabricate missing stages.

Support incomplete lineage explicitly.

Examples:

```text
Proposed → Rejected
```

```text
Proposed → Adopted → House-passed → Senate status unknown
```

```text
Introduced → Committee → No further action
```

Where possible, distinguish:

* contribution success;
* bill success;
* survival of exact legislative language.

---

## 8. Context and Explanation

The preferred contribution-detail hierarchy is:

1. What happened?
2. What did the member actually do?
3. What does the procedure mean?
4. What immediate consequence did the action have?
5. What happened next?
6. What is the legislative path?
7. What is the broader bill context?
8. What are the detailed records?
9. Why are we saying this?

A beginner should be able to understand the upper portion of the page.

A knowledgeable user should be able to skim directly to structured details and evidence.

Procedural definitions should come from the centralized glossary rather than being re-created in random components.

---

## 9. Continuous Representation

The product should increasingly make congressional activity feel observable in motion.

Important experience concepts include:

* recent delegation activity;
* what changed;
* active legislation involving the delegation;
* amendment outcome vs bill outcome;
* legislative attention by issue;
* committee context;
* eventually term-in-review summaries.

Do not convert these into a generic political-news feed.

Activity should be grounded in structured congressional actions.

---

## 10. Current Geographic Scope

The current vertical slice supports ZIP code:

`20852`

with:

* Jamie Raskin — House — Maryland 8th District;
* Chris Van Hollen — Senate — Maryland;
* Angela Alsobrooks — Senate — Maryland.

Do not prematurely generalize nationally at the expense of depth.

Follow the project principle:

> Expand vertically before expanding universally.

Avoid hard-coding architectural assumptions that would make future expansion unnecessarily difficult.

---

## 11. Activity Data vs Deep Contributions

The application may use different levels of record depth.

A lightweight activity record can support a current/recent activity feed.

A deeper `LegislativeContribution` can support:

* procedural context;
* attribution analysis;
* bill context;
* text change;
* lineage;
* detailed evidence.

Do not require every routine vote or cosponsorship to receive the same research depth as a significant amendment.

Prefer:

```text
broad recent activity
        +
smaller set of deeply researched contributions
```

over either an empty app or a large collection of weakly sourced records.

---

## 12. Future Influence Context

The architecture should remain capable of incorporating:

* campaign finance;
* lobbying;
* organizations;
* industries;
* committee power;
* federal spending.

Preserve relationship-strength distinctions.

Examples:

### DIRECT_BILL_MATCH

A lobbying filing explicitly identifies a bill.

### POLICY_AREA_MATCH

A lobbying filing identifies a related issue or policy area.

### INDUSTRY_CONTEXT

An organization operates in a relevant industry.

Do not display all three as equivalent evidence.

Do not infer bribery, corruption, quid pro quo, or causality from timing or financial relationships alone.

---

## 13. Coding Guidance

Prefer:

* TypeScript strictness where practical;
* small understandable components;
* explicit domain types;
* readable naming;
* simple functions;
* deterministic logic;
* minimal dependencies;
* clear separation of data, domain logic, services, glossary, and UI.

Avoid:

* premature abstraction;
* large generic utility layers;
* framework churn;
* unnecessary state-management frameworks;
* graph databases without a concrete requirement;
* backend infrastructure added solely for architectural aesthetics;
* AI APIs without a current product need.

Do not migrate the frontend framework or major toolchain without a clear project-level reason.

---

## 14. Repository Responsibilities

The repository should broadly preserve responsibilities such as:

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

Exact folder names may evolve.

The important separation is:

* domain models describe the product;
* curated data contains manually researched records;
* services provide access to data/domain objects;
* glossary contains shared procedural definitions;
* components/pages render the experience.

Do not place raw third-party API payload handling directly inside UI components.

---

## 15. Documentation Responsibilities

Update documentation when changes materially alter the project.

### Update `PROJECT_OVERVIEW.md` when:

* the product thesis changes;
* a major product principle changes;
* the long-term domain model changes;
* evidence philosophy changes;
* major architectural direction changes.

### Update `PLANS.md` when:

* a milestone is completed;
* implementation priorities change;
* new blockers appear;
* a new phase begins;
* a planned feature is intentionally deferred.

### Update `README.md` when:

* setup steps change;
* scripts change;
* environment variables change;
* directory structure materially changes;
* deployment requirements change.

### Update `AGENTS.md` when:

* agent workflow changes;
* coding or verification expectations change;
* new repository-wide constraints are introduced.

Do not duplicate entire sections across all four documents unnecessarily.

---

## 16. Working Process

Before implementing a substantial task:

1. Inspect relevant files.
2. Understand the existing implementation.
3. Identify reusable work.
4. Avoid replacing working structures without a reason.
5. Make the smallest coherent change that advances the product.

During implementation:

1. Keep domain and evidence rules intact.
2. Add or update types before spreading new data shapes through components.
3. Update glossary/explanation logic when adding new procedural concepts.
4. Preserve provenance.
5. Represent unknowns honestly.

Before finishing:

1. Run the relevant type check.
2. Run tests if present.
3. Run the production build.
4. Fix errors caused by the changes.
5. Review the diff for unnecessary complexity.
6. Update relevant documentation.
7. Summarize what changed and any remaining limitations.

Do not stop after planning when the requested task is implementation.

---

## 17. Current Priorities

Use `PLANS.md` for the authoritative current task sequence.

At the present stage, expect work to prioritize:

* richer and more current activity for the three-member Maryland delegation;
* recent activity / “What changed?” experiences;
* stronger legislative contribution detail;
* contribution outcome vs bill outcome;
* better legislative lineage;
* improved bill and committee context;
* source normalization preparation;
* later, carefully scoped lobbying and campaign-finance slices.

Do not jump ahead to full national ingestion unless `PLANS.md` has been intentionally changed to make that the current milestone.
