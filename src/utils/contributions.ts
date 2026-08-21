import type {
  ContributionFilter,
  LegislativeContribution,
  LegislativeOutcome,
  LegislativeContributionType,
} from "../models/legislative";

export function formatDisplayDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function getTypeLabel(type: LegislativeContributionType) {
  switch (type) {
    case "bill_sponsorship":
      return "Bill sponsorship";
    case "amendment":
      return "Floor amendment";
    case "committee_amendment":
      return "Committee amendment";
    case "substitute_amendment":
      return "Substitute amendment";
    case "appropriations_provision":
      return "Appropriations provision";
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
    case "unknown":
      return "Unknown";
  }
}

export function filterContributions(
  entries: LegislativeContribution[],
  filter: ContributionFilter,
) {
  switch (filter) {
    case "all":
      return entries;
    case "bills":
      return entries.filter((entry) => entry.type === "bill_sponsorship");
    case "amendments":
      return entries.filter((entry) => entry.type !== "bill_sponsorship");
    case "committee":
      return entries.filter(
        (entry) =>
          entry.type === "committee_amendment" || entry.venue?.type === "committee",
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
    bills: entries.filter((entry) => entry.type === "bill_sponsorship").length,
    amendments: entries.filter((entry) => entry.type !== "bill_sponsorship").length,
    adopted: entries.filter((entry) => entry.outcome === "adopted").length,
    becameLaw: entries.filter((entry) => entry.outcome === "became_law").length,
  };
}

export function getLineageStages(entry: LegislativeContribution) {
  const source = entry.survivalStage ?? {};

  return [
    { label: "Proposed", reached: true },
    { label: "Committee", reached: source.committee ?? null },
    { label: "House", reached: source.house ?? null },
    { label: "Senate", reached: source.senate ?? null },
    { label: "Enacted", reached: source.enacted ?? null },
  ];
}
