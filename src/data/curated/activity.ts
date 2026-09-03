import { curatedContributionSeeds } from "./contributions";
import type { ActivityChangeTag, ActivityRecord, ActivityRecordType } from "../../domain/models";

interface CuratedActivitySeed {
  id: string;
  memberId: string;
  date: string;
  type: ActivityRecordType;
  headline: string;
  summary: string;
  proceduralNote?: string;
  measureId?: string;
  issueIds: string[];
  outcomeLabel?: string;
  changeTags: ActivityChangeTag[];
  relatedContributionId?: string;
  evidence: Array<{
    label: string;
    sourceRecordId: string;
    sourceType: ActivityRecord["evidence"][number]["sourceType"];
    supports: string;
  }>;
}

function inferActivityType(
  contributionType: typeof curatedContributionSeeds[number]["type"],
): ActivityRecordType {
  switch (contributionType) {
    case "bill_sponsorship":
      return "bill_introduction";
    case "cosponsorship":
      return "bill_cosponsorship";
    case "committee_action":
      return "committee_movement";
    case "committee_amendment":
      return "committee_movement";
    case "floor_amendment":
    case "substitute_amendment":
    case "appropriations_provision":
      return "amendment_activity";
    case "procedural_vote":
    case "final_passage_vote":
      return "floor_vote";
    default:
      return "other";
  }
}

function inferChangeTags(
  contribution: typeof curatedContributionSeeds[number],
): ActivityChangeTag[] {
  const tags: ActivityChangeTag[] = ["new_activity"];

  if (contribution.type === "bill_sponsorship") {
    tags.push("bill_introduced");
  }

  if (contribution.type === "cosponsorship") {
    tags.push("cosponsorship_added");
  }

  if (contribution.type === "committee_action" || contribution.venue?.type === "committee") {
    tags.push("committee_advanced");
  }

  if (contribution.outcome === "adopted") {
    tags.push("amendment_adopted");
  }

  if (contribution.outcome === "rejected") {
    tags.push("amendment_rejected");
  }

  if (
    contribution.type === "procedural_vote" ||
    contribution.type === "final_passage_vote"
  ) {
    tags.push("floor_vote_cast");
  }

  if (contribution.outcome === "became_law") {
    tags.push("bill_became_law");
  }

  if (contribution.outcome === "passed_chamber") {
    tags.push("bill_passed_chamber");
  }

  return [...new Set(tags)];
}

export const curatedActivitySeeds: CuratedActivitySeed[] = curatedContributionSeeds.map(
  (contribution) => ({
    id: `activity-${contribution.id}`,
    memberId: contribution.memberId,
    date: contribution.date,
    type: inferActivityType(contribution.type),
    headline: contribution.headline,
    summary: contribution.actionText,
    proceduralNote:
      contribution.proceduralMeaning ??
      contribution.immediateConsequence ??
      contribution.nextStep,
    measureId: contribution.measureId,
    issueIds: contribution.issueIds,
    outcomeLabel: contribution.outcome.replaceAll("_", " "),
    changeTags: inferChangeTags(contribution),
    relatedContributionId: contribution.id,
    evidence: contribution.evidence.map((reference) => ({
      label: reference.label,
      sourceRecordId: reference.sourceRecordId,
      sourceType: reference.sourceType,
      supports: reference.supports,
    })),
  }),
);

export function buildCuratedActivityRecords(
  measuresById: Record<string, { measure: ActivityRecord["measure"] }>,
  sourceUrlById: Record<string, string>,
) {
  return curatedActivitySeeds.map((seed) => ({
    id: seed.id,
    memberId: seed.memberId,
    date: seed.date,
    type: seed.type,
    headline: seed.headline,
    summary: seed.summary,
    proceduralNote: seed.proceduralNote,
    measure: seed.measureId ? measuresById[seed.measureId]?.measure : undefined,
    measureId: seed.measureId,
    issueIds: seed.issueIds,
    outcomeLabel: seed.outcomeLabel,
    changeTags: seed.changeTags,
    relatedContributionId: seed.relatedContributionId,
    evidence: seed.evidence.map((reference) => ({
      label: reference.label,
      url: sourceUrlById[reference.sourceRecordId],
      sourceType: reference.sourceType,
      sourceRecordId: reference.sourceRecordId,
      supports: reference.supports,
    })),
  }));
}
