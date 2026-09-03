import {
  getActivityRecordsByMember,
  getActivityRecordsForDelegation,
  getBillById,
  getBillForContribution,
  getCommitteesById,
  getConstituentAreaByZip,
  getContributionsByMember,
  getContributionsForDelegation,
  getDelegationByZip,
  getInfluenceSnapshotForMember,
  getIssueById,
  getIssuesById,
  getMemberById,
  getMembersById,
  getRelatedContributionsForMemberAndBill,
  getSourceRecordById,
  getSupportedConstituentAreas,
  getSupportedZipCodes,
  getBillsForDelegation,
  isSupportedZip,
} from "./curatedRepository";

export interface CongressDataRepository {
  getActivityRecordsByMember: typeof getActivityRecordsByMember;
  getActivityRecordsForDelegation: typeof getActivityRecordsForDelegation;
  getBillById: typeof getBillById;
  getBillForContribution: typeof getBillForContribution;
  getBillsForDelegation: typeof getBillsForDelegation;
  getCommitteesById: typeof getCommitteesById;
  getConstituentAreaByZip: typeof getConstituentAreaByZip;
  getContributionsByMember: typeof getContributionsByMember;
  getContributionsForDelegation: typeof getContributionsForDelegation;
  getDelegationByZip: typeof getDelegationByZip;
  getInfluenceSnapshotForMember: typeof getInfluenceSnapshotForMember;
  getIssueById: typeof getIssueById;
  getIssuesById: typeof getIssuesById;
  getMemberById: typeof getMemberById;
  getMembersById: typeof getMembersById;
  getRelatedContributionsForMemberAndBill: typeof getRelatedContributionsForMemberAndBill;
  getSourceRecordById: typeof getSourceRecordById;
  getSupportedConstituentAreas: typeof getSupportedConstituentAreas;
  getSupportedZipCodes: typeof getSupportedZipCodes;
  isSupportedZip: typeof isSupportedZip;
}

export const congressDataRepository: CongressDataRepository = {
  getActivityRecordsByMember,
  getActivityRecordsForDelegation,
  getBillById,
  getBillForContribution,
  getBillsForDelegation,
  getCommitteesById,
  getConstituentAreaByZip,
  getContributionsByMember,
  getContributionsForDelegation,
  getDelegationByZip,
  getInfluenceSnapshotForMember,
  getIssueById,
  getIssuesById,
  getMemberById,
  getMembersById,
  getRelatedContributionsForMemberAndBill,
  getSourceRecordById,
  getSupportedConstituentAreas,
  getSupportedZipCodes,
  isSupportedZip,
};
