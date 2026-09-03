export type Chamber = "house" | "senate";

export type LegislativeContributionType =
  | "bill_sponsorship"
  | "cosponsorship"
  | "floor_amendment"
  | "committee_amendment"
  | "substitute_amendment"
  | "appropriations_provision"
  | "committee_action"
  | "procedural_vote"
  | "final_passage_vote"
  | "other_documented_change";

export type EvidenceConfidence = "high" | "medium" | "low" | "unknown";

export type LegislativeOutcome =
  | "introduced"
  | "adopted"
  | "rejected"
  | "withdrawn"
  | "passed_chamber"
  | "became_law"
  | "no_further_action"
  | "unknown";

export type EvidenceSourceType =
  | "congress_gov"
  | "govinfo"
  | "house"
  | "senate"
  | "committee"
  | "member_office"
  | "fec"
  | "lobbying_disclosure"
  | "usaspending"
  | "other_official";

export type VenueType = "committee" | "floor" | "other";

export type GlossaryTermId =
  | "markup"
  | "committee_hearing"
  | "committee_report"
  | "floor_amendment"
  | "committee_amendment"
  | "substitute_amendment"
  | "motion_to_recommit"
  | "cloture"
  | "unanimous_consent"
  | "final_passage"
  | "conference_committee"
  | "appropriations"
  | "authorization"
  | "cosponsorship"
  | "bill_sponsorship"
  | "roll_call_vote"
  | "procedural_vote";

export interface SourceRecord {
  id: string;
  source:
    | "congress_gov"
    | "govinfo"
    | "house"
    | "senate"
    | "committee"
    | "fec"
    | "lda"
    | "usaspending"
    | "member_office"
    | "other_official";
  externalId?: string;
  title: string;
  sourceUrl: string;
  retrievedAt: string;
  sourceUpdatedAt?: string;
  payload: unknown;
}

export interface EvidenceReference {
  label: string;
  url: string;
  sourceType: EvidenceSourceType;
  sourceRecordId?: string;
  supports: string;
}

export interface CommitteeMembership {
  committeeId?: string;
  committeeName: string;
  role: string;
}

export interface IssueArea {
  id: string;
  label: string;
  description: string;
}

export interface CommitteeContext {
  id: string;
  chamber: Chamber;
  name: string;
  purpose: string;
  whyItMatters: string;
  responsibilities: string[];
  sourceRecordIds: string[];
}

export interface Legislator {
  id: string;
  name: string;
  chamber: Chamber;
  state: string;
  district?: string;
  party: string;
  officeTitle: string;
  imageUrl: string;
  bio: string;
  committeeMemberships: CommitteeMembership[];
  sourceRecordIds: string[];
}

export interface MeasureReference {
  id?: string;
  congress?: number;
  type?: string;
  number?: string;
  title: string;
  shortTitle?: string;
}

export interface LegislativeLineage {
  proposed?: boolean | null;
  committee?: boolean | null;
  house?: boolean | null;
  senate?: boolean | null;
  enacted?: boolean | null;
}

export interface TextChangeSummary {
  previousText?: string;
  proposedText?: string;
  resultingText?: string;
  reconstructionMethod?:
    | "official_text"
    | "deterministic_diff"
    | "manual_research"
    | "unknown";
  confidence?: EvidenceConfidence;
}

export interface LegislativeContribution {
  id: string;
  memberId: string;
  chamber: Chamber;
  type: LegislativeContributionType;
  measureId: string;
  measure: MeasureReference;
  date: string;
  venue?: {
    type: VenueType;
    name?: string;
  };
  headline: string;
  context: {
    plainEnglishAction: string;
    proceduralMeaning: string;
    immediateConsequence: string;
    laterOutcome?: string;
    nextStep?: string;
  };
  issueIds: string[];
  committeeIds?: string[];
  glossaryTermIds: GlossaryTermId[];
  textChange?: TextChangeSummary;
  outcome: LegislativeOutcome;
  lineage?: LegislativeLineage;
  attribution: {
    statement: string;
    confidence: EvidenceConfidence;
    literalDraftingKnown: boolean | null;
  };
  evidence: EvidenceReference[];
}

export type ActivityRecordType =
  | "bill_introduction"
  | "bill_cosponsorship"
  | "committee_movement"
  | "amendment_activity"
  | "floor_vote"
  | "bill_status_change"
  | "other";

export type ActivityChangeTag =
  | "new_activity"
  | "bill_introduced"
  | "cosponsorship_added"
  | "committee_advanced"
  | "amendment_adopted"
  | "amendment_rejected"
  | "floor_vote_cast"
  | "bill_became_law"
  | "bill_passed_chamber";

export interface ActivityRecord {
  id: string;
  memberId: string;
  date: string;
  type: ActivityRecordType;
  headline: string;
  summary: string;
  proceduralNote?: string;
  measure?: MeasureReference;
  measureId?: string;
  issueIds: string[];
  outcomeLabel?: string;
  changeTags: ActivityChangeTag[];
  evidence: EvidenceReference[];
  relatedContributionId?: string;
}

export interface BillContext {
  id: string;
  measure: MeasureReference;
  originChamber: Chamber;
  broadPurpose: string;
  currentState: string;
  legislativeState: LegislativeOutcome;
  issueIds: string[];
  committeeIds?: string[];
  committeeNames: string[];
  majorVersions?: string[];
  lineage?: LegislativeLineage;
  becameLaw: boolean | null;
  evidence: EvidenceReference[];
}

export type ContributionFilter =
  | "all"
  | "bills"
  | "amendments"
  | "committee"
  | "votes"
  | "adopted"
  | "became_law";

export type InfluenceRelationshipStrength =
  | "DIRECT_BILL_MATCH"
  | "POLICY_AREA_MATCH"
  | "INDUSTRY_CONTEXT";

export interface FutureContextRelationship {
  sourceEntityType:
    | "organization"
    | "campaign_committee"
    | "pac"
    | "lobbying_filing"
    | "federal_award";
  targetEntityType: "member" | "bill" | "issue" | "industry";
  strength: InfluenceRelationshipStrength;
  statement: string;
}

export interface DelegationChangeSummary {
  totalRecentActions: number;
  introducedBills: number;
  cosponsorshipsAdded: number;
  committeeAdvances: number;
  floorVotes: number;
  billOutcomeChanges: number;
}
