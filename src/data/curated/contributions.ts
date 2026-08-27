import type {
  LegislativeContribution,
  LegislativeContributionType,
  LegislativeLineage,
  LegislativeOutcome,
  VenueType,
} from "../../domain/models";

interface CuratedContributionSeed {
  id: string;
  memberId: string;
  chamber: "house" | "senate";
  type: LegislativeContributionType;
  measureId: string;
  date: string;
  venue?: {
    type: VenueType;
    name?: string;
  };
  headline: string;
  issueIds: string[];
  committeeIds?: string[];
  glossaryTermIds: LegislativeContribution["glossaryTermIds"];
  actionText: string;
  proceduralMeaning?: string;
  immediateConsequence?: string;
  laterOutcome?: string;
  nextStep?: string;
  textChange?: LegislativeContribution["textChange"];
  outcome: LegislativeOutcome;
  lineage?: LegislativeLineage;
  attribution: LegislativeContribution["attribution"];
  evidence: Array<{
    label: string;
    sourceRecordId: string;
    sourceType: LegislativeContribution["evidence"][number]["sourceType"];
    supports: string;
  }>;
}

export const curatedContributionSeeds: CuratedContributionSeed[] = [
  {
    id: "raskin-press-act",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "bill_sponsorship",
    measureId: "bill-hr4330",
    date: "2021-07-01",
    venue: { type: "other", name: "House introduction" },
    headline: "Raskin introduced the PRESS Act.",
    issueIds: ["press-freedom", "judiciary", "civil-rights"],
    committeeIds: ["house-judiciary"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "He formally introduced H.R.4330, placing the measure into the House legislative process under his sponsorship.",
    laterOutcome:
      "Congress.gov shows the bill later passed the House.",
    nextStep:
      "After House passage, the bill still needed Senate action to continue toward enactment.",
    outcome: "passed_chamber",
    lineage: {
      proposed: true,
      committee: true,
      house: true,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement:
        "Congress.gov directly supports the claim that Raskin sponsored and introduced H.R.4330.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for H.R.4330",
        sourceRecordId: "source-hr4330",
        sourceType: "congress_gov",
        supports: "Formal sponsorship and House-passage status.",
      },
    ],
  },
  {
    id: "raskin-hres21",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "bill_sponsorship",
    measureId: "bill-hres21",
    date: "2021-01-11",
    venue: { type: "floor", name: "House floor" },
    headline: "Raskin introduced H.Res.21, and the House agreed to it the next day.",
    issueIds: ["judiciary"],
    glossaryTermIds: ["bill_sponsorship", "final_passage"],
    actionText:
      "He sponsored the resolution and moved it into House consideration as the chamber's formal text.",
    laterOutcome:
      "The House agreed to the resolution on January 12, 2021.",
    nextStep:
      "Because this was a House resolution, House agreement completed the chamber action described in the source set.",
    outcome: "passed_chamber",
    lineage: {
      proposed: true,
      committee: null,
      house: true,
      senate: null,
      enacted: null,
    },
    attribution: {
      statement:
        "The official resolution page supports sponsorship and House agreement, but does not establish who drafted each line of text.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov resolution page for H.Res.21",
        sourceRecordId: "source-hres21",
        sourceType: "congress_gov",
        supports: "Sponsor, text, and House action.",
      },
    ],
  },
  {
    id: "raskin-hamdt190",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "floor_amendment",
    measureId: "bill-hr3617",
    date: "2022-04-01",
    venue: { type: "floor", name: "House floor" },
    headline:
      "Raskin proposed adding security-clearance protections to the MORE Act, but the amendment failed.",
    issueIds: ["judiciary", "civil-rights"],
    committeeIds: ["house-judiciary"],
    glossaryTermIds: ["floor_amendment", "roll_call_vote"],
    actionText:
      "He offered H.Amdt.190 to say that cannabis use should not be the reason for denying or rescinding a security clearance.",
    immediateConsequence:
      "Because the amendment was rejected, the proposed language was not added during that floor action.",
    laterOutcome:
      "The House still passed the underlying bill later that day without this change.",
    nextStep:
      "The bill moved forward in the House in its post-amendment form, but not with Raskin's rejected language.",
    textChange: {
      proposedText:
        "Cannabis use should not be the reason for denying or rescinding a security clearance.",
      reconstructionMethod: "manual_research",
      confidence: "high",
    },
    outcome: "rejected",
    lineage: {
      proposed: true,
      committee: null,
      house: false,
      senate: false,
      enacted: false,
    },
    attribution: {
      statement:
        "Congress.gov identifies Raskin as the amendment sponsor and records that the amendment failed by recorded vote.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov amendment page for H.Amdt.190",
        sourceRecordId: "source-hamdt190",
        sourceType: "congress_gov",
        supports: "Sponsor, amendment purpose, and rejection.",
      },
      {
        label: "Congress.gov actions for H.R.3617",
        sourceRecordId: "source-hr3617-actions",
        sourceType: "congress_gov",
        supports: "Placement of the amendment within House consideration of the bill.",
      },
    ],
  },
  {
    id: "raskin-hamdt455",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "appropriations_provision",
    measureId: "bill-hr3055",
    date: "2019-06-21",
    venue: { type: "floor", name: "House floor" },
    headline:
      "Raskin won House adoption of an appropriations amendment tied to military construction funding.",
    issueIds: ["appropriations"],
    glossaryTermIds: ["floor_amendment", "appropriations"],
    actionText:
      "He offered H.Amdt.455 to shift $1,000,000 in military construction funding toward projects for facilities serving military communities with health and safety risks.",
    immediateConsequence:
      "Because the House agreed to the amendment by voice vote, the funding language was accepted during floor consideration.",
    laterOutcome:
      "The larger appropriations vehicle later became law, though this POC does not reconstruct the exact survival of the amendment text through later versions.",
    nextStep:
      "The amended House package continued through the appropriations process after the amendment was adopted.",
    textChange: {
      proposedText:
        "Increase and decrease funding by $1,000,000 for Military Construction, Navy and Marine Corps to support projects addressing health and safety risks.",
      reconstructionMethod: "manual_research",
      confidence: "high",
    },
    outcome: "adopted",
    lineage: {
      proposed: true,
      committee: null,
      house: true,
      senate: null,
      enacted: null,
    },
    attribution: {
      statement:
        "Congress.gov supports that Raskin offered the amendment and that the House agreed to it by voice vote.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov actions for H.R.3055",
        sourceRecordId: "source-hr3055-actions",
        sourceType: "congress_gov",
        supports: "Official record of amendment offer and adoption.",
      },
      {
        label: "GovInfo statute compilation for the enacted appropriations law",
        sourceRecordId: "source-govinfo-comps-15520",
        sourceType: "govinfo",
        supports: "Later enacted status of the larger vehicle.",
      },
    ],
  },
  {
    id: "raskin-more-vote",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "final_passage_vote",
    measureId: "bill-hr3617",
    date: "2022-04-01",
    venue: { type: "floor", name: "House floor" },
    headline: "Raskin voted yes on House passage of the MORE Act.",
    issueIds: ["judiciary", "civil-rights"],
    committeeIds: ["house-judiciary"],
    glossaryTermIds: ["final_passage", "roll_call_vote"],
    actionText:
      "He cast a recorded Yea vote when the House voted on final passage of H.R.3617.",
    immediateConsequence:
      "The House passed the bill, so the chamber sent its version onward in the process.",
    nextStep:
      "After House passage, the bill still needed Senate action to continue toward enactment.",
    outcome: "passed_chamber",
    lineage: {
      proposed: true,
      committee: true,
      house: true,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement:
        "The official House Clerk roll call names Raskin and records his Yea vote.",
      confidence: "high",
      literalDraftingKnown: false,
    },
    evidence: [
      {
        label: "House Roll Call 107 on H.R.3617",
        sourceRecordId: "source-house-vote-2022107",
        sourceType: "house",
        supports: "Raskin's recorded Yea vote and the House-passage result.",
      },
    ],
  },
  {
    id: "vanhollen-s51",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s51",
    date: "2025-01-09",
    venue: { type: "other", name: "Senate introduction" },
    headline: "Van Hollen introduced the Washington, D.C. Admission Act in the Senate.",
    issueIds: ["dc-governance"],
    committeeIds: ["senate-hsgac"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "He formally introduced S.51 under his sponsorship, starting its Senate legislative path.",
    nextStep:
      "After introduction, the next formal step was committee consideration.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement:
        "Congress.gov supports formal sponsorship and committee referral.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.51",
        sourceRecordId: "source-s51",
        sourceType: "congress_gov",
        supports: "Sponsor and introduced status.",
      },
    ],
  },
  {
    id: "vanhollen-s123",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s123",
    date: "2025-01-16",
    venue: { type: "other", name: "Senate introduction" },
    headline: "Van Hollen introduced the Handgun Permit to Purchase Act.",
    issueIds: ["gun-policy", "judiciary"],
    committeeIds: ["senate-judiciary"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "He formally introduced S.123 and sent it into the Senate process under his sponsorship.",
    nextStep:
      "The bill was then referred to the Judiciary Committee.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement:
        "The official bill page supports sponsorship and referral, but not any claim of complete drafting authorship.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.123",
        sourceRecordId: "source-s123",
        sourceType: "congress_gov",
        supports: "Sponsor and committee referral.",
      },
    ],
  },
  {
    id: "vanhollen-s1932",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s1932",
    date: "2025-06-03",
    venue: { type: "other", name: "Senate introduction" },
    headline: "Van Hollen introduced the VALID Act of 2025.",
    issueIds: ["financial-regulation", "technology"],
    committeeIds: ["senate-banking"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "He formally introduced S.1932 and became the measure's Senate sponsor of record.",
    nextStep:
      "The next official step in the loaded record is referral to the Banking Committee.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement: "Congress.gov directly documents formal sponsorship.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.1932",
        sourceRecordId: "source-s1932",
        sourceType: "congress_gov",
        supports: "Sponsor and committee referral.",
      },
    ],
  },
  {
    id: "vanhollen-samdt1272",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "appropriations_provision",
    measureId: "bill-hr1968",
    date: "2025-03-14",
    venue: { type: "floor", name: "Senate floor" },
    headline:
      "Van Hollen offered an amendment to bar DOGE from using appropriated funds, but the Senate rejected it.",
    issueIds: ["appropriations"],
    committeeIds: ["senate-appropriations"],
    glossaryTermIds: ["floor_amendment", "appropriations", "roll_call_vote"],
    actionText:
      "He offered S.Amdt.1272 to H.R.1968, with the stated purpose of prohibiting the use of appropriated amounts by DOGE.",
    immediateConsequence:
      "Because the amendment was rejected, that restriction was not added through this Senate vote.",
    laterOutcome:
      "The Senate later passed the underlying appropriations bill without adopting this amendment.",
    nextStep:
      "The chamber moved on to other amendments and then final passage of the bill.",
    textChange: {
      proposedText: "Prohibit the use of appropriated amounts by DOGE.",
      reconstructionMethod: "official_text",
      confidence: "high",
    },
    outcome: "rejected",
    lineage: {
      proposed: true,
      committee: null,
      house: false,
      senate: false,
      enacted: false,
    },
    attribution: {
      statement:
        "The official Senate roll call identifies Van Hollen's amendment number, its purpose, and the rejection vote.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Senate Roll Call Vote 131 on Van Hollen Amendment 1272",
        sourceRecordId: "source-samdt1272-vote",
        sourceType: "senate",
        supports: "Amendment sponsor, purpose, vote result, and recorded positions.",
      },
    ],
  },
  {
    id: "vanhollen-hr1968-vote",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "final_passage_vote",
    measureId: "bill-hr1968",
    date: "2025-03-14",
    venue: { type: "floor", name: "Senate floor" },
    headline: "Van Hollen voted no on final Senate passage of H.R.1968.",
    issueIds: ["appropriations"],
    committeeIds: ["senate-appropriations"],
    glossaryTermIds: ["final_passage", "roll_call_vote", "appropriations"],
    actionText:
      "He cast a recorded Nay vote when the Senate voted on passage of the continuing appropriations bill.",
    immediateConsequence:
      "The bill still passed the Senate despite his vote.",
    laterOutcome:
      "GovInfo links H.R.1968 to Public Law 119-4, meaning the measure later became law.",
    nextStep:
      "After Senate passage, the bill moved to enrollment and enactment.",
    outcome: "became_law",
    lineage: {
      proposed: true,
      committee: true,
      house: true,
      senate: true,
      enacted: true,
    },
    attribution: {
      statement:
        "The official Senate roll call records Van Hollen's Nay vote and the chamber's passage result.",
      confidence: "high",
      literalDraftingKnown: false,
    },
    evidence: [
      {
        label: "Senate Roll Call Vote 133 on H.R.1968",
        sourceRecordId: "source-hr1968-vote",
        sourceType: "senate",
        supports: "Van Hollen's recorded vote and Senate-passage result.",
      },
      {
        label: "GovInfo law status for H.R.1968",
        sourceRecordId: "source-hr1968-law",
        sourceType: "govinfo",
        supports: "Later enacted status as Public Law 119-4.",
      },
    ],
  },
  {
    id: "alsobrooks-s3556",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s3556",
    date: "2025-12-17",
    venue: { type: "other", name: "Senate introduction" },
    headline:
      "Alsobrooks introduced the Wildlife Crossings Program Reauthorization Act of 2025.",
    issueIds: ["transportation-environment"],
    committeeIds: ["senate-epw"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "She formally introduced S.3556, becoming the measure's sponsor of record in the Senate.",
    nextStep:
      "The next step shown in the official record is committee referral.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement: "Congress.gov supports sponsorship and referral.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.3556",
        sourceRecordId: "source-s3556",
        sourceType: "congress_gov",
        supports: "Formal sponsorship and referral.",
      },
    ],
  },
  {
    id: "alsobrooks-s3844",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s3844",
    date: "2026-02-11",
    venue: { type: "other", name: "Senate introduction" },
    headline:
      "Alsobrooks introduced a bill ordering a GAO study on federal reductions in force.",
    issueIds: ["workforce-government"],
    committeeIds: ["senate-hsgac"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "She formally introduced S.3844 and placed the proposal into the Senate process under her sponsorship.",
    nextStep:
      "The bill was referred to the Homeland Security and Governmental Affairs Committee.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement:
        "The official bill page supports sponsorship and committee referral only.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.3844",
        sourceRecordId: "source-s3844",
        sourceType: "congress_gov",
        supports: "Sponsor and committee referral.",
      },
    ],
  },
  {
    id: "alsobrooks-s3890",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    measureId: "bill-s3890",
    date: "2026-02-12",
    venue: { type: "other", name: "Senate introduction" },
    headline:
      "Alsobrooks introduced a bill to establish a National Council on African American History and Culture.",
    issueIds: ["history-culture"],
    committeeIds: ["senate-help"],
    glossaryTermIds: ["bill_sponsorship", "authorization"],
    actionText:
      "She formally introduced S.3890 and became its sponsor of record.",
    nextStep:
      "The bill was referred to the Health, Education, Labor, and Pensions Committee.",
    outcome: "introduced",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attribution: {
      statement: "Congress.gov supports sponsorship and referral.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov bill page for S.3890",
        sourceRecordId: "source-s3890",
        sourceType: "congress_gov",
        supports: "Sponsor and committee referral.",
      },
    ],
  },
  {
    id: "alsobrooks-samdt1267",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "appropriations_provision",
    measureId: "bill-hr1968",
    date: "2025-03-12",
    venue: { type: "floor", name: "Senate floor" },
    headline:
      "Alsobrooks submitted an appropriations amendment about D.C. local funds during Senate consideration of H.R.1968.",
    issueIds: ["appropriations", "dc-governance"],
    glossaryTermIds: ["floor_amendment", "appropriations"],
    actionText:
      "She submitted S.Amdt.1267 to let the District of Columbia spend local funds under its FY2025 local budget framework and to update a related appropriations reference.",
    immediateConsequence:
      "The source set confirms the amendment was officially submitted, but this POC does not load a later adoption record for it.",
    laterOutcome:
      "The underlying appropriations bill later became law, but the survival of this specific submitted language is not established here.",
    nextStep:
      "Without a recorded adoption in the current seed set, the safest next-step description is unknown.",
    textChange: {
      proposedText:
        "Permit the District of Columbia to expend local funds under the Fiscal Year 2025 Local Budget Act of 2024 and update a related fiscal year reference.",
      reconstructionMethod: "official_text",
      confidence: "high",
    },
    outcome: "unknown",
    lineage: {
      proposed: true,
      committee: null,
      house: null,
      senate: null,
      enacted: null,
    },
    attribution: {
      statement:
        "Congress.gov directly links Alsobrooks to the submitted amendment text. The later path of that specific language remains unknown in this seed record.",
      confidence: "high",
      literalDraftingKnown: null,
    },
    evidence: [
      {
        label: "Congress.gov amendment page for S.Amdt.1267",
        sourceRecordId: "source-samdt1267",
        sourceType: "congress_gov",
        supports: "Amendment sponsor and submitted text context.",
      },
    ],
  },
  {
    id: "alsobrooks-hr1968-vote",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "final_passage_vote",
    measureId: "bill-hr1968",
    date: "2025-03-14",
    venue: { type: "floor", name: "Senate floor" },
    headline: "Alsobrooks voted no on final Senate passage of H.R.1968.",
    issueIds: ["appropriations"],
    glossaryTermIds: ["final_passage", "roll_call_vote", "appropriations"],
    actionText:
      "She cast a recorded Nay vote on final passage of the continuing appropriations bill.",
    immediateConsequence:
      "The Senate still passed the bill despite her vote.",
    laterOutcome:
      "GovInfo later links the measure to Public Law 119-4, meaning it became law.",
    nextStep:
      "After Senate passage, the bill moved toward enrollment and enactment.",
    outcome: "became_law",
    lineage: {
      proposed: true,
      committee: true,
      house: true,
      senate: true,
      enacted: true,
    },
    attribution: {
      statement:
        "The official Senate roll call identifies Alsobrooks by name and records her Nay vote on passage.",
      confidence: "high",
      literalDraftingKnown: false,
    },
    evidence: [
      {
        label: "Senate Roll Call Vote 133 on H.R.1968",
        sourceRecordId: "source-hr1968-vote",
        sourceType: "senate",
        supports: "Alsobrooks' recorded vote and Senate-passage result.",
      },
      {
        label: "GovInfo law status for H.R.1968",
        sourceRecordId: "source-hr1968-law",
        sourceType: "govinfo",
        supports: "Later enacted status as Public Law 119-4.",
      },
    ],
  },
];

function buildDefaultProceduralMeaning(type: LegislativeContributionType): string {
  switch (type) {
    case "bill_sponsorship":
      return "Sponsoring a bill or resolution means the member formally introduced the measure into the chamber's process.";
    case "floor_amendment":
    case "committee_amendment":
    case "substitute_amendment":
      return "An amendment is an effort to change legislative text during consideration of a broader measure.";
    case "appropriations_provision":
      return "Appropriations activity concerns how federal money may be provided, restricted, or redirected in a funding measure.";
    case "procedural_vote":
      return "This is a vote about process rather than a final yes-or-no decision on the whole bill.";
    case "final_passage_vote":
      return "A final-passage vote decides whether the chamber will approve the measure in its current form.";
    case "cosponsorship":
      return "Cosponsorship is formal support for another member's measure, not necessarily proof of drafting authorship.";
    case "committee_action":
      return "Committee action can shape whether a measure advances and what text leaves committee.";
    case "other_documented_change":
      return "The record shows a documented legislative action, but the procedural significance depends on the source context.";
  }
}

function buildDefaultImmediateConsequence(outcome: LegislativeOutcome): string {
  switch (outcome) {
    case "introduced":
      return "The action placed the measure or proposal into the legislative process, but it did not by itself change law.";
    case "adopted":
      return "The chamber accepted the proposal during that stage of consideration.";
    case "rejected":
      return "The proposal did not carry at that stage, so it was not added through that action.";
    case "withdrawn":
      return "The proposal was pulled back before further action was completed.";
    case "passed_chamber":
      return "The chamber approved the measure in that form.";
    case "became_law":
      return "The measure completed the process and became law.";
    case "no_further_action":
      return "The loaded record does not show the proposal moving forward after this step.";
    case "unknown":
      return "The available seed record does not establish a reliable immediate consequence beyond the action itself.";
  }
}

export function buildCuratedContributions(
  billsById: Record<string, { measure: LegislativeContribution["measure"] }>,
  sourceUrlById: Record<string, string>,
): LegislativeContribution[] {
  return curatedContributionSeeds.map((seed) => ({
    id: seed.id,
    memberId: seed.memberId,
    chamber: seed.chamber,
    type: seed.type,
    measureId: seed.measureId,
    measure: billsById[seed.measureId].measure,
    date: seed.date,
    venue: seed.venue,
    headline: seed.headline,
    context: {
      plainEnglishAction: seed.actionText,
      proceduralMeaning:
        seed.proceduralMeaning ?? buildDefaultProceduralMeaning(seed.type),
      immediateConsequence:
        seed.immediateConsequence ?? buildDefaultImmediateConsequence(seed.outcome),
      laterOutcome: seed.laterOutcome,
      nextStep: seed.nextStep,
    },
    issueIds: seed.issueIds,
    committeeIds: seed.committeeIds,
    glossaryTermIds: seed.glossaryTermIds,
    textChange: seed.textChange,
    outcome: seed.outcome,
    lineage: seed.lineage,
    attribution: seed.attribution,
    evidence: seed.evidence.map((reference) => ({
      label: reference.label,
      url: sourceUrlById[reference.sourceRecordId],
      sourceType: reference.sourceType,
      sourceRecordId: reference.sourceRecordId,
      supports: reference.supports,
    })),
  }));
}
