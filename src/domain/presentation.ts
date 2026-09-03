import { proceduralGlossary } from "../glossary/terms";
import type {
  BillContext,
  CommitteeContext,
  ContributionFilter,
  DelegationChangeSummary,
  EvidenceConfidence,
  IssueArea,
  LegislativeContribution,
  LegislativeContributionType,
  LegislativeLineage,
  LegislativeOutcome,
  Legislator,
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

export function getRelativeTimeLabel(date: string) {
  const now = new Date();
  const then = new Date(`${date}T00:00:00`);
  const days = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 7) {
    return "This week";
  }

  if (days <= 31) {
    return "This month";
  }

  if (days <= 180) {
    return "This half-year";
  }

  if (days <= 365) {
    return "This year";
  }

  return "Earlier";
}

export function getOutcomeTone(outcome: LegislativeOutcome) {
  switch (outcome) {
    case "adopted":
    case "passed_chamber":
    case "became_law":
      return "positive";
    case "rejected":
    case "withdrawn":
    case "no_further_action":
      return "negative";
    default:
      return "neutral";
  }
}

export function getContributionOutcomeSummary(
  contribution: LegislativeContribution,
  bill: BillContext | undefined,
) {
  return {
    contributionOutcome: getOutcomeLabel(contribution.outcome),
    billOutcome: bill ? getOutcomeLabel(bill.legislativeState) : "Unknown",
    billOutcomeDetail: bill?.currentState ?? "Bill context not loaded.",
  };
}

export function buildDelegationChangeSummary(
  contributions: LegislativeContribution[],
  bills: BillContext[],
): DelegationChangeSummary {
  const recentActions = contributions.filter((entry) => {
    const days =
      (new Date().getTime() - new Date(`${entry.date}T00:00:00`).getTime()) /
      (1000 * 60 * 60 * 24);

    return days <= 730;
  });

  return {
    totalRecentActions: recentActions.length,
    introducedBills: recentActions.filter((entry) => entry.type === "bill_sponsorship").length,
    cosponsorshipsAdded: recentActions.filter((entry) => entry.type === "cosponsorship").length,
    committeeAdvances: recentActions.filter(
      (entry) =>
        entry.type === "committee_action" ||
        (entry.venue?.type === "committee" &&
          ["adopted", "passed_chamber", "became_law"].includes(entry.outcome)),
    ).length,
    floorVotes: recentActions.filter((entry) =>
      ["procedural_vote", "final_passage_vote"].includes(entry.type),
    ).length,
    billOutcomeChanges: bills.filter((bill) =>
      ["passed_chamber", "became_law"].includes(bill.legislativeState),
    ).length,
  };
}

export function buildIssueAttention(
  contributions: LegislativeContribution[],
  issuesById: Record<string, IssueArea>,
) {
  const counts = new Map<string, number>();

  contributions.forEach((entry) => {
    entry.issueIds.forEach((issueId) => {
      counts.set(issueId, (counts.get(issueId) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([issueId, count]) => ({
      issue: issuesById[issueId],
      count,
    }))
    .filter((entry) => entry.issue)
    .sort((left, right) => right.count - left.count);
}

export function buildActiveBillSummaries(
  bills: BillContext[],
  contributions: LegislativeContribution[],
  membersById: Record<string, Legislator>,
) {
  return bills
    .map((bill) => {
      const related = contributions.filter((entry) => entry.measureId === bill.id);
      const memberIds = [...new Set(related.map((entry) => entry.memberId))];
      const latestDate = related[0]?.date;

      return {
        bill,
        relatedContributionCount: related.length,
        memberNames: memberIds.map((memberId) => membersById[memberId]?.name).filter(Boolean),
        latestDate,
      };
    })
    .sort((left, right) => (right.latestDate ?? "").localeCompare(left.latestDate ?? ""));
}

export function buildCommitteePowerSummaries(
  member: Legislator,
  committeesById: Record<string, CommitteeContext>,
  contributions: LegislativeContribution[],
) {
  return member.committeeMemberships
    .map((membership) => {
      const committee = membership.committeeId
        ? committeesById[membership.committeeId]
        : undefined;
      const relatedContributions = contributions.filter((entry) =>
        entry.committeeIds?.includes(membership.committeeId ?? ""),
      );

      return {
        membership,
        committee,
        relatedContributions,
      };
    })
    .filter((entry) => entry.committee);
}
