import { curatedBills } from "../data/curated/bills";
import { buildCuratedContributions } from "../data/curated/contributions";
import { curatedDelegationsByZip, supportedZipCodes } from "../data/curated/delegations";
import { curatedInfluenceSnapshots } from "../data/curated/influence";
import { curatedMembers } from "../data/curated/members";
import { sourceRecords } from "../data/curated/sourceRecords";
import type {
  BillContext,
  FutureContextRelationship,
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

const contributionSourceUrlById = Object.fromEntries(
  sourceRecords.map((record) => [record.id, record.sourceUrl]),
) as Record<string, string>;

const contributions = buildCuratedContributions(billsById, contributionSourceUrlById);
const influenceSnapshotsByMember = Object.fromEntries(
  curatedInfluenceSnapshots.map((snapshot) => [snapshot.memberId, snapshot]),
) as Record<string, InfluenceContextSnapshot>;

export function getSupportedZipCodes() {
  return supportedZipCodes;
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

export function getBillById(billId: string) {
  return billsById[billId];
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
