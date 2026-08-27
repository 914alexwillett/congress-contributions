import { proceduralGlossary } from "../glossary/terms";
import type {
  BillContext,
  ContributionFilter,
  EvidenceConfidence,
  LegislativeContribution,
  LegislativeContributionType,
  LegislativeLineage,
  LegislativeOutcome,
} from "./models";

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function getContributionTypeLabel(type: LegislativeContributionType) {
  switch (type) {
    case "bill_sponsorship":
      return "Bill sponsorship";
    case "cosponsorship":
      return "Cosponsorship";
    case "floor_amendment":
      return "Floor amendment";
    case "committee_amendment":
      return "Committee amendment";
    case "substitute_amendment":
      return "Substitute amendment";
    case "appropriations_provision":
      return "Appropriations provision";
    case "committee_action":
      return "Committee action";
    case "procedural_vote":
      return "Procedural vote";
    case "final_passage_vote":
      return "Final passage vote";
    case "other_documented_change":
      return "Other documented change";
  }
}

export function getOutcomeLabel(outcome: LegislativeOutcome) {
  switch (outcome) {
    case "introduced":
      return "Introduced";
    case "adopted":
      return "Adopted";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Withdrawn";
    case "passed_chamber":
      return "Passed chamber";
    case "became_law":
      return "Became law";
    case "no_further_action":
      return "No further action";
    case "unknown":
      return "Unknown";
  }
}

export function getConfidenceLabel(confidence: EvidenceConfidence) {
  return confidence.replace("_", " ");
}

export function filterContributions(
  entries: LegislativeContribution[],
  filter: ContributionFilter,
) {
  switch (filter) {
    case "all":
      return entries;
    case "bills":
      return entries.filter(
        (entry) =>
          entry.type === "bill_sponsorship" || entry.type === "cosponsorship",
      );
    case "amendments":
      return entries.filter((entry) =>
        [
          "floor_amendment",
          "committee_amendment",
          "substitute_amendment",
          "appropriations_provision",
        ].includes(entry.type),
      );
    case "committee":
      return entries.filter(
        (entry) =>
          entry.venue?.type === "committee" || entry.type === "committee_action",
      );
    case "votes":
      return entries.filter(
        (entry) =>
          entry.type === "procedural_vote" || entry.type === "final_passage_vote",
      );
    case "adopted":
      return entries.filter((entry) => entry.outcome === "adopted");
    case "became_law":
      return entries.filter((entry) => entry.outcome === "became_law");
  }
}

export function getContributionCounts(entries: LegislativeContribution[]) {
  return {
    total: entries.length,
    bills: entries.filter((entry) =>
      ["bill_sponsorship", "cosponsorship"].includes(entry.type),
    ).length,
    amendments: entries.filter((entry) =>
      [
        "floor_amendment",
        "committee_amendment",
        "substitute_amendment",
        "appropriations_provision",
      ].includes(entry.type),
    ).length,
    votes: entries.filter((entry) =>
      ["procedural_vote", "final_passage_vote"].includes(entry.type),
    ).length,
    adopted: entries.filter((entry) => entry.outcome === "adopted").length,
    becameLaw: entries.filter((entry) => entry.outcome === "became_law").length,
  };
}

function buildLineageStages(lineage: LegislativeLineage | undefined) {
  const source = lineage ?? {};

  return [
    { label: "Proposed", reached: source.proposed ?? true },
    { label: "Committee", reached: source.committee ?? null },
    { label: "House", reached: source.house ?? null },
    { label: "Senate", reached: source.senate ?? null },
    { label: "Enacted", reached: source.enacted ?? null },
  ];
}

export function getContributionLineageStages(entry: LegislativeContribution) {
  return buildLineageStages(entry.lineage);
}

export function getBillLineageStages(bill: BillContext) {
  return buildLineageStages(bill.lineage);
}

export function getGlossaryTerms(termIds: LegislativeContribution["glossaryTermIds"]) {
  return termIds.map((termId) => proceduralGlossary[termId]);
}
