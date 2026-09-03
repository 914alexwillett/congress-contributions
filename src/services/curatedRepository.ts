import { buildCuratedActivityRecords } from "../data/curated/activity";
import { curatedBills } from "../data/curated/bills";
import { curatedCommittees } from "../data/curated/committees";
import { buildCuratedContributions } from "../data/curated/contributions";
import {
  curatedConstituentAreas,
  curatedDelegationsByZip,
  supportedZipCodes,
} from "../data/curated/delegations";
import { curatedInfluenceSnapshots } from "../data/curated/influence";
import { curatedIssues } from "../data/curated/issues";
import { curatedMembers } from "../data/curated/members";
import { sourceRecords } from "../data/curated/sourceRecords";
import type {
  ActivityRecord,
  BillContext,
  CommitteeContext,
  FutureContextRelationship,
  IssueArea,
  LegislativeContribution,
  Legislator,
  SourceRecord,
} from "../domain/models";
import type { InfluenceContextSnapshot } from "../data/curated/influence";

const sourceRecordById = Object.fromEntries(
  sourceRecords.map((record) => [record.id, record]),
) as Record<string, SourceRecord>;

const billsById = Object.fromEntries(
  curatedBills.map((bill) => [bill.id, bill]),
) as Record<string, BillContext>;

const membersById = Object.fromEntries(
  curatedMembers.map((member) => [member.id, member]),
) as Record<string, Legislator>;
const committeesById = Object.fromEntries(
  curatedCommittees.map((committee) => [committee.id, committee]),
) as Record<string, CommitteeContext>;
const issuesById = Object.fromEntries(
  curatedIssues.map((issue) => [issue.id, issue]),
) as Record<string, IssueArea>;

const contributionSourceUrlById = Object.fromEntries(
  sourceRecords.map((record) => [record.id, record.sourceUrl]),
) as Record<string, string>;

const contributions = buildCuratedContributions(billsById, contributionSourceUrlById);
const activityRecords = buildCuratedActivityRecords(billsById, contributionSourceUrlById);
const influenceSnapshotsByMember = Object.fromEntries(
  curatedInfluenceSnapshots.map((snapshot) => [snapshot.memberId, snapshot]),
) as Record<string, InfluenceContextSnapshot>;

export function getSupportedZipCodes() {
  return supportedZipCodes;
}

export function getSupportedConstituentAreas() {
  return curatedConstituentAreas;
}

export function getConstituentAreaByZip(zip: string) {
  return curatedConstituentAreas.find((area) => area.zip === zip);
}

export function isSupportedZip(zip: string) {
  return zip in curatedDelegationsByZip;
}

export function getDelegationByZip(zip: string) {
  return (curatedDelegationsByZip[zip] ?? [])
    .map((memberId) => membersById[memberId])
    .filter(Boolean);
}

export function getSourceRecordById(sourceRecordId: string) {
  return sourceRecordById[sourceRecordId];
}

export function getContributionsByMember(memberId: string) {
  return contributions
    .filter((entry) => entry.memberId === memberId)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getActivityRecordsByMember(memberId: string) {
  return activityRecords
    .filter((entry) => entry.memberId === memberId)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getMemberById(memberId: string) {
  return membersById[memberId];
}

export function getMembersById() {
  return membersById;
}

export function getContributionsForDelegation(memberIds: string[]) {
  return contributions
    .filter((entry) => memberIds.includes(entry.memberId))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getActivityRecordsForDelegation(memberIds: string[]) {
  return activityRecords
    .filter((entry) => memberIds.includes(entry.memberId))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getBillById(billId: string) {
  return billsById[billId];
}

export function getBillsForDelegation(memberIds: string[]) {
  const billIds = new Set(
    contributions
      .filter((entry) => memberIds.includes(entry.memberId))
      .map((entry) => entry.measureId),
  );

  return [...billIds]
    .map((billId) => billsById[billId])
    .filter(Boolean);
}

export function getBillForContribution(contribution: LegislativeContribution | undefined) {
  return contribution ? getBillById(contribution.measureId) : undefined;
}

export function getRelatedContributionsForMemberAndBill(memberId: string, billId: string) {
  return contributions
    .filter((entry) => entry.memberId === memberId && entry.measureId === billId)
    .sort((left, right) => right.date.localeCompare(left.date));
}

export function getInfluenceSnapshotForMember(
  memberId: string,
  billId?: string,
) {
  const snapshot = influenceSnapshotsByMember[memberId];

  if (!snapshot) {
    return undefined;
  }

  if (!billId || !snapshot.billIds?.length) {
    return snapshot;
  }

  if (snapshot.billIds.includes(billId)) {
    return snapshot;
  }

  return {
    ...snapshot,
    relationships: [] as FutureContextRelationship[],
    lobbying: {
      ...snapshot.lobbying,
      summary:
        "No lobbying-disclosure filings are loaded yet for this member and the currently selected bill.",
    },
    federalSpending: {
      ...snapshot.federalSpending,
      summary:
        "No USAspending-linked award context is loaded yet for this member and the currently selected bill.",
    },
  };
}

export function getCommitteeById(committeeId: string) {
  return committeesById[committeeId];
}

export function getCommitteesById() {
  return committeesById;
}

export function getIssueById(issueId: string) {
  return issuesById[issueId];
}

export function getAllIssues() {
  return curatedIssues;
}

export function getIssuesById() {
  return issuesById;
}
