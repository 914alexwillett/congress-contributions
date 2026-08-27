import type { BillContext, FutureContextRelationship, Legislator } from "../../domain/models";

export interface InfluenceContextSnapshot {
  memberId: Legislator["id"];
  billIds?: BillContext["id"][];
  campaignFinance: {
    loadedRecords: number;
    summary: string;
  };
  lobbying: {
    loadedRecords: number;
    summary: string;
  };
  federalSpending: {
    loadedRecords: number;
    summary: string;
  };
  relationships: FutureContextRelationship[];
}

export const curatedInfluenceSnapshots: InfluenceContextSnapshot[] = [
  {
    memberId: "jamie-raskin",
    campaignFinance: {
      loadedRecords: 0,
      summary:
        "No FEC-backed campaign-finance relationships are loaded yet in this POC.",
    },
    lobbying: {
      loadedRecords: 0,
      summary:
        "No lobbying-disclosure filings are loaded yet for Raskin or the selected bills.",
    },
    federalSpending: {
      loadedRecords: 0,
      summary:
        "No USAspending-linked award context is loaded yet for this member view.",
    },
    relationships: [],
  },
  {
    memberId: "chris-van-hollen",
    billIds: ["bill-hr1968"],
    campaignFinance: {
      loadedRecords: 0,
      summary:
        "No FEC-backed campaign-finance relationships are loaded yet in this POC.",
    },
    lobbying: {
      loadedRecords: 0,
      summary:
        "No lobbying-disclosure filings are loaded yet for Van Hollen or H.R.1968.",
    },
    federalSpending: {
      loadedRecords: 0,
      summary:
        "No USAspending-linked award context is loaded yet for this member or bill view.",
    },
    relationships: [],
  },
  {
    memberId: "angela-alsobrooks",
    billIds: ["bill-hr1968"],
    campaignFinance: {
      loadedRecords: 0,
      summary:
        "No FEC-backed campaign-finance relationships are loaded yet in this POC.",
    },
    lobbying: {
      loadedRecords: 0,
      summary:
        "No lobbying-disclosure filings are loaded yet for Alsobrooks or H.R.1968.",
    },
    federalSpending: {
      loadedRecords: 0,
      summary:
        "No USAspending-linked award context is loaded yet for this member or bill view.",
    },
    relationships: [],
  },
];
