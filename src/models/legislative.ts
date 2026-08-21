export type Chamber = "house" | "senate";

export type LegislativeContributionType =
  | "bill_sponsorship"
  | "amendment"
  | "committee_amendment"
  | "substitute_amendment"
  | "appropriations_provision"
  | "other_documented_change";

export type LegislativeOutcome =
  | "introduced"
  | "adopted"
  | "rejected"
  | "withdrawn"
  | "passed_chamber"
  | "became_law"
  | "unknown";

export type EvidenceSourceType =
  | "congress_gov"
  | "govinfo"
  | "committee"
  | "member_office"
  | "other_official";

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
}

export interface LegislativeEvidence {
  label: string;
  url: string;
  sourceType: EvidenceSourceType;
}

export interface ContributionStage {
  label: string;
  reached: boolean | null;
}

export interface LegislativeContribution {
  id: string;
  memberId: string;
  chamber: Chamber;
  type: LegislativeContributionType;
  title: string;
  billOrMeasure: {
    id?: string;
    title: string;
    congress?: number;
  };
  date: string;
  venue?: {
    type: "committee" | "floor" | "other";
    name?: string;
  };
  summary: string;
  proposedText?: string;
  affectedText?: string;
  outcome: LegislativeOutcome;
  survivalStage?: {
    committee?: boolean | null;
    house?: boolean | null;
    senate?: boolean | null;
    enacted?: boolean | null;
  };
  attributionNote: string;
  confidence: "high" | "medium" | "low";
  evidence: LegislativeEvidence[];
}

export type ContributionFilter =
  | "all"
  | "bills"
  | "amendments"
  | "committee"
  | "adopted"
  | "became_law";
