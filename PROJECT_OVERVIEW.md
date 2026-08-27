# Congress Contributions

## What This Project Is

Congress Contributions is an evidence-first civic application for helping an ordinary constituent answer:

> What did my representative actually do in Congress, what does that action mean, what happened because of it, and what evidence supports that conclusion?

The project begins with legislative activity, especially actions that help reveal how members shaped legislation.

It is not meant to be just another voting tracker.

## Core Product Thesis

The app should translate congressional records into understandable civic context without translating them into opinion.

The intended flow is:

`ZIP code -> federal delegation -> member -> legislative contributions -> contribution detail -> bill context -> evidence`

The long-term differentiator is:

`Member -> Amendment -> Text Change -> Outcome`

In its strongest form, the product should help a user answer:

- What exact language did this member try to add, remove, or alter?
- Was the amendment adopted?
- Did the language survive into later versions?
- Did the bill pass the House?
- Did it pass the Senate?
- Did it ultimately become law?

## Product Principles

1. Actions before interpretation.
2. Context before jargon.
3. Evidence before scoring.
4. Sponsorship is not literal authorship.
5. Cosponsorship is formal support, not necessarily drafting.
6. Amendments are especially valuable evidence of text-shaping.
7. Observable relationships are not automatically causal relationships.
8. Unknown is an acceptable answer.
9. Every important claim should be auditable.
10. Teach through consistent structure, not personalized UI.
11. Primary sources should remain accessible even when the interface simplifies them.
12. The citizen should make the political judgment; the application should clarify the factual record.

## What The App Must Not Do

- Do not create partisan scores or performance rankings.
- Do not infer ideology, intent, virtue, corruption, or effectiveness from sparse records.
- Do not say a member wrote all legislative text unless the evidence supports that.
- Do not collapse weak contextual relationships into strong claims.
- Do not use an LLM as the source of record.

## Current Scope

The current proof of concept supports only ZIP code `20852`.

That ZIP maps to:

- Jamie Raskin, House, Maryland 8th District
- Chris Van Hollen, Senate, Maryland
- Angela Alsobrooks, Senate, Maryland

This is intentionally narrow. The code should not be hard-coded in ways that make broader expansion difficult, but geographic generalization is not the priority yet.

## Central Domain Concept

The most important object in the system is a `LegislativeContribution`.

A contribution represents an observable, evidence-backed congressional action by a member.

Examples:

- introducing a bill
- cosponsoring a bill
- offering a floor amendment
- offering a committee amendment
- proposing a substitute amendment
- making an appropriations-related text change
- participating in a meaningful committee action
- casting a procedural vote
- casting a final-passage vote

The distinction between these ideas must remain explicit:

- formal sponsorship
- observable legislative text-shaping
- literal drafting authorship

## Evidence Model

The preferred information flow is:

`official source -> source record -> normalization -> domain object -> deterministic interpretation -> interface`

Not:

`LLM reads a website -> app asserts a conclusion`

Every meaningful claim shown in the UI should trace back to evidence.

Preferred source types:

- Congress.gov
- GovInfo
- official House records
- official Senate records
- official committee records
- official member office pages
- eventually FEC / OpenFEC
- eventually Lobbying Disclosure Act data
- eventually USAspending

## Explanation Hierarchy

Contribution detail should generally follow this order:

1. What happened?
2. What did the member actually do?
3. What does that mean procedurally?
4. What happened because of it?
5. What happened next?
6. What is the legislative path?
7. What are the detailed records?
8. Why are we saying this?

This hierarchy exists so a beginner can understand the top half without already knowing Congress.

## Shared Glossary Requirement

Procedural explanations should come from a centralized glossary layer rather than being redefined in random components.

Examples of glossary concepts:

- markup
- committee hearing
- committee report
- floor amendment
- committee amendment
- substitute amendment
- motion to recommit
- cloture
- unanimous consent
- final passage
- conference committee
- appropriations
- authorization
- cosponsorship
- bill sponsorship
- roll call vote

## Bill Context Requirement

Legislative actions should be legible within the broader bill context.

For a bill, the user should be able to understand:

- what the bill broadly does
- where it is in the process
- which chamber originated it
- which committees handled it
- what the selected member did in relation to it
- whether it became law
- which major versions are known

## Money, Lobbying, and Spending Context

This project is no longer only about legislative records.

The broader product vision is an evidence-based interface for understanding how federal political power operates.

That means the system should eventually incorporate context such as:

- campaign finance
- lobbying activity
- federal spending relationships

Important rule:

These relationships provide context, not accusations.

Relationship strength must remain explicit. For example:

- `DIRECT_BILL_MATCH`
- `POLICY_AREA_MATCH`
- `INDUSTRY_CONTEXT`

Only the first supports a strong statement like:

> Organization X reported lobbying on H.R.1234.

## Target Architecture Direction

The project should be able to evolve toward:

```text
Congress.gov / GovInfo / House / Senate / Committees
        ->
Raw source records
        ->
Normalization
        ->
Canonical entities
        ->
Relationship builder
        ->
Legislative contribution builder
        ->
Application data store / API
        ->
Frontend
```

The frontend should consume stable project-owned domain models, not raw third-party response shapes.

## Current Codebase Shape

Important folders:

- `src/domain/`
  - Core domain models and presentation helpers.
- `src/data/curated/`
  - Manually curated source records, members, bills, contributions, and future-facing influence placeholders.
- `src/services/`
  - Repository-like access to the curated domain data.
- `src/components/`
  - UI components for member views, contribution detail, bill context, evidence, glossary, and influence context.
- `src/glossary/`
  - Centralized procedural definitions.

## Guidance For Humans Extending This Project

- Keep the code understandable.
- Prefer small components.
- Prefer explicit types over clever abstraction.
- Prefer deterministic explanation builders where possible.
- Keep evidence visible in the UI.
- If a field is not reliably known, represent it as unknown.
- Expand vertically before expanding universally.

## Guidance For AI Agents Working On This Project

When modifying this repo:

1. Preserve the distinction between evidence and interpretation.
2. Do not invent legislative facts to fill UI space.
3. Do not replace curated domain models with raw API-shaped objects in components.
4. Prefer deterministic logic for procedural explanations before introducing AI-generated summaries.
5. Keep source provenance attached to claims.
6. If adding finance or lobbying context, model relationship strength explicitly.
7. If adding new contribution types, update the glossary and explanation logic together.
8. If adding new data, prefer a smaller number of well-sourced records over a large number of weak records.
9. Avoid premature backend complexity unless the work truly requires it.
10. Preserve political neutrality in language and design.

## Near-Term Good Next Steps

- Add one real, source-backed lobbying or campaign-finance slice for a selected bill or member.
- Improve text-change capture for amendments using official text where available.
- Add more committee-action examples backed by official records.
- Add a clearer comparison between amendment outcome and bill outcome.
- Introduce a lightweight source-record normalization layer for future ingestion.

## Non-Goals For The Current Iteration

- Full national ZIP-to-district resolution
- All members of Congress
- Full historical ingestion
- Comprehensive committee scraping
- Full bill-text lineage reconstruction
- Full FEC ingestion
- Full lobbying ingestion
- Full USAspending ingestion
- Corruption detection
- Ideological scoring
- Performance rankings

## Short Positioning Summary

Congress Contributions is a civic evidence interface.

It helps people inspect what their federal representatives actually did inside the legislative process, understand what those actions mean, and trace the explanation back to official records.
