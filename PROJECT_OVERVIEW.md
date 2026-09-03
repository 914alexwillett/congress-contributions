# Congress Contributions

## Mission

Congress Contributions is an evidence-first civic application for making political representation observable between elections.

Its purpose is to help an ordinary constituent answer questions like:

- What is my representative doing right now?
- What changed since I last looked?
- What are they trying to change in legislation?
- Did those attempts succeed?
- What happened to the underlying bill?
- What issues are receiving their legislative attention?
- What committees and positions give them influence?
- What money, lobbying, or spending context surrounds the legislation they are working on?

The application should clarify observable political activity without telling the citizen what political judgment to make.

## Core Thesis

Congressional records are not enough on their own.

The deeper problem is that representatives act continuously while citizens exercise formal electoral power intermittently.

The product aims to shorten that feedback loop:

```text
Representative acts
        ->
Action becomes understandable
        ->
Citizen can inspect consequences
        ->
Citizen develops an ongoing picture of representation
        ->
Election arrives with an accumulated factual record
```

This project is a persistent civic magnifying glass.

## Core Principle

Congressional records translated into context, without translating them into opinion.

The app is an evidence interface, not a political recommender.

## Current Scope

The current vertical slice supports two ZIP codes:

- `20852`
- `94102`

Those ZIPs currently map to:

- `20852`
  - Jamie Raskin, House, Maryland 8th District
  - Chris Van Hollen, Senate, Maryland
  - Angela Alsobrooks, Senate, Maryland
- `94102`
  - Nancy Pelosi, House, California 11th District
  - Alex Padilla, Senate, California
  - Adam Schiff, Senate, California

This limited geography is intentional. The product should expand vertically before expanding universally.

## Current Product Shape

The V3 application is no longer primarily a profile browser.

It now emphasizes:

- delegation-wide recent activity
- what changed in the observable record
- active bills touched by the delegation
- issue attention across the loaded dataset
- member detail and contribution detail
- bill context
- committee power
- visible but non-accusatory money and influence context

The core user path is still rooted in:

`ZIP -> delegation -> contribution -> bill context -> evidence`

But the main experience now increasingly answers:

`What has my representation been doing?`

## Primary Concepts

### LegislativeContribution

The most important domain object remains `LegislativeContribution`.

A contribution is an observable, evidence-backed congressional action by a member.

Examples:

- bill sponsorship
- cosponsorship
- floor amendment
- committee amendment
- substitute amendment
- appropriations-related change
- committee action
- procedural vote
- final-passage vote

The project must preserve the distinction between:

- formal sponsorship
- observable text-shaping
- literal drafting authorship

### Contribution Outcome vs Bill Outcome

The app now treats these as distinct concepts.

Examples:

```text
Contribution: Amendment adopted
Bill: Passed House, passed Senate, did not become law
```

```text
Contribution: Amendment rejected
Bill: Continued and later passed
```

Users should not be forced to infer this distinction from raw legislative data.

### Legislative Attention

The project now includes issue tagging so users can see which subjects appear repeatedly in a member's or delegation's legislative record.

Examples:

- appropriations
- judiciary
- press freedom
- D.C. governance
- gun policy
- financial regulation
- transportation and environment

This represents observed legislative attention, not ideology or approval.

### Committee Power

Committee membership is not merely decorative profile metadata.

The product should increasingly communicate:

```text
Institutional position
        ->
Opportunity to influence legislation
        ->
Observable member action
```

Committee context should explain:

- what the committee does
- why membership matters
- how the member's activity connects to that institutional position

## Explanation Hierarchy

Contribution detail should generally follow this order:

1. What happened?
2. What did the member actually do?
3. What does that congressional procedure mean?
4. What immediate consequence did the action have?
5. What happened to the bill afterward?
6. What is the contribution lineage?
7. What is the bill's broader status?
8. What are the detailed records?
9. Why are we saying this?

A beginner should be able to understand the upper portion without already knowing Congress.

## Evidence Model

The intended data flow remains:

```text
Official source
        ->
Source record
        ->
Normalization
        ->
Canonical entity
        ->
Derived contribution or context
        ->
UI explanation
```

Not:

```text
LLM reads a website
        ->
App asserts a conclusion
```

Every important claim in the UI should remain auditable.

Preferred evidence sources:

- Congress.gov
- GovInfo
- official House records
- official Senate records
- official committee records
- official member office pages
- eventually FEC / OpenFEC
- eventually Lobbying Disclosure Act records
- eventually USAspending

## Shared Glossary Requirement

Procedural explanations must come from a centralized glossary, not ad hoc strings scattered across components.

Examples:

- markup
- committee hearing
- committee report
- floor amendment
- committee amendment
- substitute amendment
- cloture
- unanimous consent
- final passage
- appropriations
- authorization
- bill sponsorship
- cosponsorship
- roll call vote

## Bill Context Requirement

Bill views should help a user understand:

- what the legislation broadly does
- where it is in the process
- which chamber originated it
- which committees handled it
- what the user's delegation did on it
- whether it became law
- what major versions are known

Bill views should not devolve into raw action-log dumps.

## Money, Lobbying, and Spending Context

The broader product vision includes:

- campaign finance
- lobbying context
- federal spending context

Important rule:

These provide context, not accusations.

The application must keep relationship strength explicit. For example:

- `DIRECT_BILL_MATCH`
- `POLICY_AREA_MATCH`
- `INDUSTRY_CONTEXT`

Only direct evidence should support claims like:

> Organization X reported lobbying on H.R.1234.

It does not automatically support:

> Organization X caused Member Y to support H.R.1234.

The current UI includes a visible money-and-influence panel even when no verified finance or lobbying records are loaded yet, so the product direction remains visible without fake certainty.

## Current Codebase Shape

Important folders:

- `src/domain/`
  - Canonical models and derived presentation logic.
- `src/data/curated/`
  - Manually curated members, bills, issues, committees, contributions, source records, and influence placeholders.
- `src/services/`
  - Repository-style access to normalized curated data.
- `src/glossary/`
  - Shared procedural definitions.
- `src/components/`
  - UI building blocks for activity, bills, issues, committee power, evidence, and detail views.

## Current V3 Screens and Views

The app now supports top-level views oriented around understanding representation over time:

- `Overview`
  - Delegation summary, recent activity, what changed, active bills, issue attention.
- `Delegation`
  - Member selection, member overview, filtered contributions, committee power, influence panel.
- `Activity`
  - Chronological delegation-wide feed of structured congressional actions.
- `Bills`
  - Measures touched by the delegation and their broader legislative status.
- `Issues`
  - Issue-linked contribution browsing driven by observed legislative attention.

## Architecture Direction

The long-term architecture still aims toward:

```text
Congress.gov / GovInfo / House / Senate / Committees / FEC / LDA / USAspending
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
Derived context
        ->
Application store or backend
        ->
Frontend
```

The frontend should continue consuming project-owned domain models rather than raw third-party response shapes.

## AI Guidance

AI must not become the source of record.

AI may eventually help with:

- summarizing difficult bill text
- explaining legal or procedural language
- assisting with issue classification
- identifying possible relationships that humans or deterministic logic can verify

But authoritative factual claims must come from source data.

Prefer deterministic interpretation when possible.

## What This Project Must Not Do

- Do not create partisan scores.
- Do not rank politicians.
- Do not infer ideology from sparse records.
- Do not infer corruption from contextual relationships.
- Do not collapse weak relationship types into strong claims.
- Do not present uncertainty as certainty.
- Do not build gamification.
- Do not personalize the UI based on inferred expertise.

## Guidance For Humans Extending This Project

- Preserve the distinction between evidence and interpretation.
- Keep the code understandable.
- Prefer small components and explicit types.
- Use domain or service layers for derived context instead of embedding everything in UI components.
- If adding new contribution types, update explanation logic and glossary together.
- If adding money or lobbying context, keep confidence and relationship strength explicit.
- If a fact is not well supported, say unknown.

## Guidance For AI Agents Working On This Project

When modifying this repo:

1. Preserve `LegislativeContribution` as a central domain concept.
2. Do not invent legislative facts to fill gaps.
3. Do not wire raw external API response shapes directly into components.
4. Keep evidence attached to important claims.
5. Maintain the distinction between contribution outcome and bill outcome.
6. Treat committee position as part of political-power context where supported.
7. Treat issue attention as observed activity, not ideology.
8. Treat finance and lobbying context as contextual relationships, not causal proof.
9. Prefer a smaller number of well-sourced records over a large number of weak ones.
10. Keep the interface politically neutral and evidence-oriented.

## Good Next Steps

- Add one real, source-backed lobbying or campaign-finance slice.
- Improve amendment text-change capture where official text supports it.
- Add more committee-backed contribution examples.
- Add clearer provision-level lineage groundwork.
- Expand the “what changed” derivation logic.
- Add better bill-level explanation of contested points derived from observable amendment or vote activity.

## Non-Goals For The Current Stage

- National ZIP resolution
- All members of Congress
- Full historical ingestion
- Comprehensive committee scraping
- Full amendment execution
- Perfect bill-text lineage
- Full FEC ingestion
- Full lobbying ingestion
- Full USAspending ingestion
- Constituent commenting or polling
- Social features
- Corruption detection
- Ideological scoring
- Politician rankings

## Positioning Summary

Congress Contributions is a civic evidence interface for continuous political observation.

It helps citizens inspect what their federal representatives are doing inside the legislative process, understand what those actions mean, see what changed, follow what happened to the legislation, and trace the explanation back to primary evidence.
