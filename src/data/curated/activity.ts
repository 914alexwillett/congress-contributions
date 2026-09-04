import { curatedContributionSeeds } from "./contributions";
import type {
  ActivityChangeTag,
  ActivityRecord,
  ActivityRecordType,
  MeasureReference,
} from "../../domain/models";

interface CuratedActivitySeed {
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

const contributionBackedActivitySeeds: CuratedActivitySeed[] = curatedContributionSeeds.map(
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

const standaloneActivitySeeds: CuratedActivitySeed[] = [
  {
    id: "activity-raskin-mental-health-slate",
    memberId: "jamie-raskin",
    date: "2026-03-26",
    type: "bill_introduction",
    headline: "Raskin introduced a bipartisan mental-health package focused on crisis response.",
    summary:
      "He introduced the STOP Suicide Act and the 9-8-8 Connect Act as a bipartisan push to expand crisis-response capacity and local support pathways.",
    proceduralNote:
      "These were formal bill introductions backed by a member office release, but this lightweight activity record does not yet load full deep-contribution treatment for each measure.",
    issueIds: ["healthcare"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Raskin press release on mental-health legislation",
        sourceRecordId: "source-raskin-mental-health-slate",
        sourceType: "member_office",
        supports: "Bill introductions, date, and stated policy focus.",
      },
    ],
  },
  {
    id: "activity-raskin-poda",
    memberId: "jamie-raskin",
    date: "2026-05-14",
    type: "bill_introduction",
    headline: "Raskin unveiled the Protecting Our Democracy Act.",
    summary:
      "He joined a bicameral effort to introduce the Protecting Our Democracy Act as a package aimed at tighter transparency, accountability, and election-protection rules.",
    proceduralNote:
      "This is recorded as a formal legislative introduction described by the member office rather than a fully expanded contribution record.",
    measure: {
      id: "Protecting Our Democracy Act",
      title: "Protecting Our Democracy Act",
      shortTitle: "PODA",
    },
    issueIds: ["judiciary", "elections-democracy"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Raskin press release on the Protecting Our Democracy Act",
        sourceRecordId: "source-raskin-poda",
        sourceType: "member_office",
        supports: "Date, bill title, and introduction context.",
      },
    ],
  },
  {
    id: "activity-raskin-foreign-money",
    memberId: "jamie-raskin",
    date: "2026-07-22",
    type: "bill_introduction",
    headline: "Raskin introduced legislation to close a foreign-money elections loophole.",
    summary:
      "He introduced the Get Foreign Money Out of U.S. Elections Act with a Senate partner to address campaign-finance rules tied to foreign ownership.",
    measure: {
      id: "Get Foreign Money Out of U.S. Elections Act",
      title: "Get Foreign Money Out of U.S. Elections Act",
      shortTitle: "Get Foreign Money Out of U.S. Elections Act",
    },
    issueIds: ["elections-democracy", "civil-rights"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Raskin press release on foreign-money elections legislation",
        sourceRecordId: "source-raskin-foreign-money",
        sourceType: "member_office",
        supports: "Bill introduction, date, and subject matter.",
      },
    ],
  },
  {
    id: "activity-vanhollen-power-for-people",
    memberId: "chris-van-hollen",
    date: "2026-01-15",
    type: "bill_introduction",
    headline: "Van Hollen introduced the Power for the People Act.",
    summary:
      "He introduced legislation aimed at shifting data-center expansion costs away from households and addressing grid-reliability concerns.",
    measure: {
      id: "Power for the People Act",
      title: "Power for the People Act",
      shortTitle: "Power for the People Act",
    },
    issueIds: ["technology", "environment-climate"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Van Hollen press release on the Power for the People Act",
        sourceRecordId: "source-vanhollen-power-for-the-people",
        sourceType: "member_office",
        supports: "Bill introduction, date, and stated purpose.",
      },
    ],
  },
  {
    id: "activity-vanhollen-social-security",
    memberId: "chris-van-hollen",
    date: "2026-03-25",
    type: "bill_introduction",
    headline: "Van Hollen reintroduced legislation tied to Social Security solvency and estate taxes.",
    summary:
      "He introduced the Strengthen Social Security by Taxing Dynastic Wealth Act as a tax-and-retirement policy measure aimed at the Social Security trust fund.",
    measure: {
      id: "Strengthen Social Security by Taxing Dynastic Wealth Act",
      title: "Strengthen Social Security by Taxing Dynastic Wealth Act",
      shortTitle: "Taxing Dynastic Wealth Act",
    },
    issueIds: ["taxation", "healthcare"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Van Hollen press release on Social Security legislation",
        sourceRecordId: "source-vanhollen-social-security",
        sourceType: "member_office",
        supports: "Bill title, date, and purpose.",
      },
    ],
  },
  {
    id: "activity-vanhollen-community-schools",
    memberId: "chris-van-hollen",
    date: "2026-05-12",
    type: "bill_introduction",
    headline: "Van Hollen reintroduced the Full-Service Community School Expansion Act.",
    summary:
      "He helped reintroduce legislation to expand federal support for community schools and wraparound student services.",
    measure: {
      id: "Full-Service Community School Expansion Act",
      title: "Full-Service Community School Expansion Act",
      shortTitle: "Full-Service Community School Expansion Act",
    },
    issueIds: ["healthcare", "civil-rights"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Van Hollen press release on community schools legislation",
        sourceRecordId: "source-vanhollen-community-schools",
        sourceType: "member_office",
        supports: "Bill reintroduction, date, and policy focus.",
      },
    ],
  },
  {
    id: "activity-alsobrooks-transportation-accountability",
    memberId: "angela-alsobrooks",
    date: "2026-01-13",
    type: "bill_introduction",
    headline: "Alsobrooks introduced the Transportation Project Accountability Act of 2026.",
    summary:
      "She introduced legislation to require stronger transparency and performance reporting for large state transportation projects.",
    measure: {
      id: "Transportation Project Accountability Act of 2026",
      title: "Transportation Project Accountability Act of 2026",
      shortTitle: "Transportation Project Accountability Act",
    },
    issueIds: ["transportation-environment"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Alsobrooks press release on transportation-project transparency legislation",
        sourceRecordId: "source-alsobrooks-transportation-accountability",
        sourceType: "member_office",
        supports: "Bill introduction, date, and purpose.",
      },
    ],
  },
  {
    id: "activity-alsobrooks-financial-access",
    memberId: "angela-alsobrooks",
    date: "2026-04-30",
    type: "bill_introduction",
    headline: "Alsobrooks introduced the Financial Access Protection Act.",
    summary:
      "She introduced legislation to stop banks from collecting and disclosing customers' citizenship or immigration-status information for immigration enforcement.",
    measure: {
      id: "Financial Access Protection Act",
      title: "Financial Access Protection Act",
      shortTitle: "Financial Access Protection Act",
    },
    issueIds: ["immigration", "financial-regulation", "civil-rights"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Alsobrooks press release on the Financial Access Protection Act",
        sourceRecordId: "source-alsobrooks-financial-access",
        sourceType: "member_office",
        supports: "Bill introduction, date, and issue framing.",
      },
    ],
  },
  {
    id: "activity-alsobrooks-hbcu-arts",
    memberId: "angela-alsobrooks",
    date: "2026-05-13",
    type: "bill_introduction",
    headline: "Alsobrooks introduced the HBCU Arts Act.",
    summary:
      "She introduced bipartisan legislation to expand arts-education uses for grant funds that support historically Black colleges and universities.",
    measure: {
      id: "HBCU Arts Act",
      title: "HBCU Arts Act",
      shortTitle: "HBCU Arts Act",
    },
    issueIds: ["history-culture", "civil-rights"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Alsobrooks press release on the HBCU Arts Act",
        sourceRecordId: "source-alsobrooks-hbcu-arts",
        sourceType: "member_office",
        supports: "Bill introduction, date, and purpose.",
      },
    ],
  },
  {
    id: "activity-alsobrooks-senior-housing",
    memberId: "angela-alsobrooks",
    date: "2026-08-03",
    type: "bill_introduction",
    headline: "Alsobrooks introduced a tax-credit bill for senior home modifications.",
    summary:
      "She introduced the Senior Accessible Housing Tax Credit Act of 2026 to help seniors finance aging-related home modifications.",
    measure: {
      id: "Senior Accessible Housing Tax Credit Act of 2026",
      title: "Senior Accessible Housing Tax Credit Act of 2026",
      shortTitle: "Senior Accessible Housing Tax Credit Act",
    },
    issueIds: ["housing-disaster", "taxation", "healthcare"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Alsobrooks press release on senior housing tax-credit legislation",
        sourceRecordId: "source-alsobrooks-senior-housing",
        sourceType: "member_office",
        supports: "Bill introduction, date, and housing focus.",
      },
    ],
  },
  {
    id: "activity-pelosi-aca-floor",
    memberId: "nancy-pelosi",
    date: "2026-01-08",
    type: "other",
    headline: "Pelosi urged House passage of a bill extending ACA premium tax credits.",
    summary:
      "She delivered House floor remarks backing legislation to extend Affordable Care Act premium tax credits and framed the vote as a healthcare-affordability fight.",
    proceduralNote:
      "This is a lightweight floor-activity record drawn from Pelosi's office statement rather than a deeper contribution or vote record.",
    issueIds: ["healthcare"],
    outcomeLabel: "floor advocacy",
    changeTags: ["new_activity"],
    evidence: [
      {
        label: "Pelosi floor speech on ACA tax credits bill",
        sourceRecordId: "source-pelosi-aca-floor",
        sourceType: "member_office",
        supports: "Date, bill subject, and Pelosi's floor position.",
      },
    ],
  },
  {
    id: "activity-pelosi-iran-war-powers",
    memberId: "nancy-pelosi",
    date: "2026-04-16",
    type: "other",
    headline: "Pelosi spoke on the House floor ahead of a vote on the Iran War Powers Resolution.",
    summary:
      "She used floor remarks to support congressional war-powers oversight before House action on the Iran War Powers Resolution.",
    proceduralNote:
      "This records visible floor advocacy tied to a named House measure, without overstating what the current curated slice proves about the final vote path.",
    issueIds: ["defense", "judiciary"],
    outcomeLabel: "floor advocacy",
    changeTags: ["new_activity"],
    evidence: [
      {
        label: "Pelosi floor speech on the Iran War Powers Resolution",
        sourceRecordId: "source-pelosi-iran-war-powers",
        sourceType: "member_office",
        supports: "Date, floor context, and Pelosi's position.",
      },
    ],
  },
  {
    id: "activity-pelosi-ukraine-support",
    memberId: "nancy-pelosi",
    date: "2026-06-04",
    type: "other",
    headline: "Pelosi spoke in support of the Ukraine Support Act on the House floor.",
    summary:
      "She delivered House floor remarks supporting the Ukraine Support Act and linked it to broader congressional backing for Ukraine.",
    proceduralNote:
      "This is a lightweight floor-activity record based on Pelosi's official office statement.",
    issueIds: ["defense"],
    outcomeLabel: "floor advocacy",
    changeTags: ["new_activity"],
    evidence: [
      {
        label: "Pelosi floor speech on the Ukraine Support Act",
        sourceRecordId: "source-pelosi-ukraine-support",
        sourceType: "member_office",
        supports: "Date, bill identity, and Pelosi's support statement.",
      },
    ],
  },
  {
    id: "activity-pelosi-fisa",
    memberId: "nancy-pelosi",
    date: "2026-06-11",
    type: "other",
    headline: "Pelosi opposed a House GOP move to extend FISA Section 702 without reforms.",
    summary:
      "She delivered remarks opposing the FISA extension effort under the current leadership structure and argued for stronger oversight safeguards.",
    proceduralNote:
      "This adds visible floor activity to the recent feed without pretending the app has a full bill-status reconstruction for the underlying measure yet.",
    issueIds: ["judiciary", "civil-rights"],
    outcomeLabel: "floor advocacy",
    changeTags: ["new_activity"],
    evidence: [
      {
        label: "Pelosi remarks opposing the FISA extension effort",
        sourceRecordId: "source-pelosi-fisa",
        sourceType: "member_office",
        supports: "Date, floor context, and Pelosi's stated position.",
      },
    ],
  },
  {
    id: "activity-padilla-farm-workers",
    memberId: "alex-padilla",
    date: "2026-08-06",
    type: "bill_introduction",
    headline: "Padilla introduced a trio of farm and food-system worker bills.",
    summary:
      "He introduced the Fairness for Farm Workers Act, Supporting Our Farm and Food System Workforce Act, and Voice for Farm Workers Act as a package focused on labor protections and representation.",
    proceduralNote:
      "This activity captures a source-backed package of introductions without requiring separate deep contribution records for each bill.",
    issueIds: ["labor", "civil-rights"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Padilla press release on farm and food-system worker legislation",
        sourceRecordId: "source-padilla-farm-workers",
        sourceType: "member_office",
        supports: "Bill package, date, and policy goals.",
      },
    ],
  },
  {
    id: "activity-padilla-cows",
    memberId: "alex-padilla",
    date: "2026-08-07",
    type: "bill_introduction",
    headline: "Padilla reintroduced the COWS Act.",
    summary:
      "He reintroduced the Converting Our Waste Sustainably Act to reduce greenhouse-gas emissions and support alternative manure-management practices.",
    measure: {
      id: "Converting Our Waste Sustainably Act",
      title: "Converting Our Waste Sustainably Act",
      shortTitle: "COWS Act",
    },
    issueIds: ["environment-climate", "transportation-environment"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Padilla press release on the COWS Act",
        sourceRecordId: "source-padilla-cows",
        sourceType: "member_office",
        supports: "Bill title, date, and environmental focus.",
      },
    ],
  },
  {
    id: "activity-padilla-paid-vacation",
    memberId: "alex-padilla",
    date: "2026-08-10",
    type: "bill_introduction",
    headline: "Padilla reintroduced the Guaranteed Paid Vacation Act.",
    summary:
      "He introduced legislation to guarantee at least two weeks of paid vacation for full-time workers.",
    measure: {
      id: "Guaranteed Paid Vacation Act",
      title: "Guaranteed Paid Vacation Act",
      shortTitle: "Guaranteed Paid Vacation Act",
    },
    issueIds: ["labor"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Padilla press release on paid vacation legislation",
        sourceRecordId: "source-padilla-paid-vacation",
        sourceType: "member_office",
        supports: "Bill introduction, date, and labor-policy purpose.",
      },
    ],
  },
  {
    id: "activity-padilla-offshore-wind",
    memberId: "alex-padilla",
    date: "2026-08-11",
    type: "bill_introduction",
    headline: "Padilla introduced legislation to speed offshore wind permitting and reward lease holders who stay in projects.",
    summary:
      "He introduced a bill to support offshore wind developers who continue operating despite pressure to abandon leased projects.",
    issueIds: ["environment-climate", "technology"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Padilla press release on offshore wind legislation",
        sourceRecordId: "source-padilla-offshore-wind",
        sourceType: "member_office",
        supports: "Bill introduction, date, and stated policy objective.",
      },
    ],
  },
  {
    id: "activity-schiff-s5291",
    memberId: "adam-schiff",
    date: "2026-08-19",
    type: "bill_introduction",
    headline: "Schiff introduced the Small Business Cybersecurity Assistance Evaluation Act of 2026.",
    summary:
      "His Senate legislation page lists S.5291 as sponsored legislation referred to the Committee on Small Business and Entrepreneurship.",
    measure: {
      id: "S.5291",
      title: "Small Business Cybersecurity Assistance Evaluation Act of 2026",
      shortTitle: "Small Business Cybersecurity Assistance Evaluation Act",
      congress: 119,
      type: "bill",
      number: "5291",
    },
    issueIds: ["technology", "workforce-government"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Schiff legislation page entry for S.5291",
        sourceRecordId: "source-schiff-legislation-page",
        sourceType: "member_office",
        supports: "Bill number, title, introduction date, and referral.",
      },
    ],
  },
  {
    id: "activity-schiff-s5182",
    memberId: "adam-schiff",
    date: "2026-08-12",
    type: "bill_introduction",
    headline: "Schiff introduced the Tracking Plastic Act of 2026.",
    summary:
      "His Senate legislation page lists S.5182 as sponsored legislation referred to the Commerce, Science, and Transportation Committee.",
    measure: {
      id: "S.5182",
      title: "Tracking Plastic Act of 2026",
      shortTitle: "Tracking Plastic Act",
      congress: 119,
      type: "bill",
      number: "5182",
    },
    issueIds: ["environment-climate", "technology"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Schiff legislation page entry for S.5182",
        sourceRecordId: "source-schiff-legislation-page",
        sourceType: "member_office",
        supports: "Bill number, title, introduction date, and referral.",
      },
    ],
  },
  {
    id: "activity-schiff-s5105",
    memberId: "adam-schiff",
    date: "2026-08-11",
    type: "bill_introduction",
    headline: "Schiff introduced the Collaboration on Adversarial Threats and Security Risks Act.",
    summary:
      "His Senate legislation page lists S.5105 as sponsored legislation referred to the Judiciary Committee.",
    measure: {
      id: "S.5105",
      title: "Collaboration on Adversarial Threats and Security Risks Act",
      shortTitle: "Collaboration on Adversarial Threats and Security Risks Act",
      congress: 119,
      type: "bill",
      number: "5105",
    },
    issueIds: ["technology", "judiciary"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Schiff legislation page entry for S.5105",
        sourceRecordId: "source-schiff-legislation-page",
        sourceType: "member_office",
        supports: "Bill number, title, introduction date, and referral.",
      },
    ],
  },
  {
    id: "activity-schiff-s5136",
    memberId: "adam-schiff",
    date: "2026-08-11",
    type: "bill_introduction",
    headline: "Schiff introduced the Promoting Authenticity with Influencer Disclaimers Act.",
    summary:
      "His Senate legislation page lists S.5136 as sponsored legislation referred to the Rules and Administration Committee.",
    measure: {
      id: "S.5136",
      title: "Promoting Authenticity with Influencer Disclaimers Act",
      shortTitle: "Promoting Authenticity with Influencer Disclaimers Act",
      congress: 119,
      type: "bill",
      number: "5136",
    },
    issueIds: ["technology", "elections-democracy"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Schiff legislation page entry for S.5136",
        sourceRecordId: "source-schiff-legislation-page",
        sourceType: "member_office",
        supports: "Bill number, title, introduction date, and referral.",
      },
    ],
  },
  {
    id: "activity-schiff-s5135",
    memberId: "adam-schiff",
    date: "2026-08-11",
    type: "bill_introduction",
    headline: "Schiff introduced the AI Ads Act.",
    summary:
      "His Senate legislation page lists S.5135 as sponsored legislation referred to the Rules and Administration Committee.",
    measure: {
      id: "S.5135",
      title: "AI Ads Act",
      shortTitle: "AI Ads Act",
      congress: 119,
      type: "bill",
      number: "5135",
    },
    issueIds: ["technology", "elections-democracy"],
    outcomeLabel: "introduced",
    changeTags: ["new_activity", "bill_introduced"],
    evidence: [
      {
        label: "Schiff legislation page entry for S.5135",
        sourceRecordId: "source-schiff-legislation-page",
        sourceType: "member_office",
        supports: "Bill number, title, introduction date, and referral.",
      },
    ],
  },
];

// These remain lightweight because the official releases establish the action, not a full bill dossier.
const additionalOfficialActivitySeeds: CuratedActivitySeed[] = [
  ["jamie-raskin","2026-07-23","bill_status_change","Raskin celebrated House passage of bipartisan legislation protecting pension payments for uniformed-service corps.","The official release identifies Raskin as part of the bipartisan House-passage effort.",["workforce-government"],"House passed","source-raskin-press-releases",["new_activity","bill_passed_chamber"]],
  ["jamie-raskin","2026-07-15","amendment_activity","Raskin issued a statement on Massie Amendment #8 during appropriations consideration.","The current record documents his stated position during House consideration, without loading the amendment's full later path.",["appropriations"],"floor position","source-raskin-press-releases",["new_activity"]],
  ["jamie-raskin","2026-07-08","bill_introduction","Raskin and Representative Spartz introduced legislation concerning a Thomas Paine memorial.","The official release records a House bill introduction.",["history-culture"],"introduced","source-raskin-press-releases",["new_activity","bill_introduced"]],
  ["jamie-raskin","2026-06-25","other","Raskin joined colleagues seeking reversal of grant-rule changes affecting health research.","This is a documented congressional oversight request rather than a bill action.",["healthcare"],"oversight request","source-raskin-press-releases",["new_activity"]],
  ["jamie-raskin","2026-06-26","other","Raskin joined members requesting removal of demolished East Wing debris from a national park.","This is a documented congressional oversight request.",["environment-climate"],"oversight request","source-raskin-press-releases",["new_activity"]],
  ["jamie-raskin","2026-07-30","other","Raskin joined colleagues opposing a rushed redevelopment plan for East Potomac Park.","The official release documents a congressional intervention on a public-land decision.",["environment-climate"],"oversight request","source-raskin-press-releases",["new_activity"]],
  ["jamie-raskin","2026-08-12","other","Raskin led colleagues requesting restoration of cancelled health-care research grants.","The official release documents a congressional request related to federal health-research funding.",["healthcare","appropriations"],"oversight request","source-raskin-press-releases",["new_activity"]],
  ["chris-van-hollen","2026-03-04","bill_introduction","Van Hollen introduced the BRAVE Burma Act with Senator Young.","The official release records bipartisan introduction of legislation concerning sanctions and accountability in Burma.",["defense","civil-rights"],"introduced","source-vanhollen-press-releases",["new_activity","bill_introduced"]],
  ["chris-van-hollen","2026-02-04","bill_cosponsorship","Van Hollen joined legislation addressing climate-related financial risk.","The official release records his participation in introducing the Addressing Climate Financial Risk Act.",["environment-climate","financial-regulation"],"introduced","source-vanhollen-press-releases",["new_activity","cosponsorship_added"]],
  ["chris-van-hollen","2026-03-09","bill_cosponsorship","Van Hollen joined colleagues in introducing the FCPA Reinforcement Act.","The official release records his participation in an anti-corruption enforcement bill introduction.",["financial-regulation","judiciary"],"introduced","source-vanhollen-press-releases",["new_activity","cosponsorship_added"]],
  ["chris-van-hollen","2026-07-14","bill_cosponsorship","Van Hollen joined legislation to strengthen supports for airport service workers.","The official release records his participation in the bill's reintroduction.",["labor"],"introduced","source-vanhollen-press-releases",["new_activity","cosponsorship_added"]],
  ["chris-van-hollen","2026-07-15","bill_cosponsorship","Van Hollen joined colleagues introducing a bill restricting a president's retention of a Qatari jet.","The official release records his participation in the bill introduction.",["judiciary"],"introduced","source-vanhollen-press-releases",["new_activity","cosponsorship_added"]],
  ["chris-van-hollen","2026-07-16","bill_introduction","Van Hollen led legislation on disclosure of tax havens and job offshoring.","The official release records a bicameral bill reintroduction.",["taxation","workforce-government"],"introduced","source-vanhollen-press-releases",["new_activity","bill_introduced"]],
  ["chris-van-hollen","2026-07-23","other","Van Hollen put forward an Iran war-powers resolution.","The official release records his floor effort to end the war through a Senate resolution.",["defense"],"floor action","source-vanhollen-press-releases",["new_activity"]],
  ["angela-alsobrooks","2026-07-14","bill_introduction","Alsobrooks joined EPW leadership in introducing the Water Resources Development Act of 2026.","The official release establishes her role in the bipartisan committee-led introduction.",["transportation-environment"],"introduced","source-alsobrooks-wrda-introduction",["new_activity","bill_introduced","committee_advanced"]],
  ["angela-alsobrooks","2026-07-15","committee_movement","Alsobrooks voted at an EPW markup to advance the Water Resources Development Act of 2026.","The committee unanimously advanced the measure after the documented markup.",["transportation-environment"],"advanced unanimously","source-alsobrooks-wrda-markup",["new_activity","committee_advanced"]],
  ["angela-alsobrooks","2026-07-17","bill_cosponsorship","Alsobrooks joined more than 60 senators cosponsoring the Sanctioning Russia Act of 2026.","The official release lists her as a cosponsor on legislation addressing purchasers of Russian oil and gas.",["defense"],"cosponsored","source-alsobrooks-russian-oil",["new_activity","cosponsorship_added"]],
  ["angela-alsobrooks","2026-07-22","bill_introduction","Alsobrooks introduced the Modal Parity in Permitting Act.","The official release records bipartisan Senate introduction of transit-permitting legislation.",["transportation-environment"],"introduced","source-alsobrooks-transit-permitting",["new_activity","bill_introduced"]],
  ["angela-alsobrooks","2026-07-23","floor_vote","Alsobrooks voted for Van Hollen's Iran War Powers Resolution.","The official release reports that the resolution was not agreed to, 47-49.",["defense"],"not agreed to, 47-49","source-alsobrooks-iran-vote",["new_activity","floor_vote_cast"]],
  ["angela-alsobrooks","2026-08-06","bill_introduction","Alsobrooks led introduction of the Back-to-School Supplies Affordability Act.","The official release records introduction with Van Hollen and other senators.",["taxation","labor"],"introduced","source-alsobrooks-back-to-school",["new_activity","bill_introduced"]],
  ["angela-alsobrooks","2026-07-11","bill_status_change","Alsobrooks reported that the ROAD to Housing Act became law.","The official release states that the measure became law without the President's signature.",["housing-disaster"],"became law","source-alsobrooks-road-law",["new_activity","bill_became_law"]],
  ["nancy-pelosi","2026-08-31","other","Pelosi joined California Democrats seeking release of withheld Medicaid funding.","The official press-release index documents the congressional letter to federal health officials.",["healthcare","appropriations"],"congressional letter","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-08-25","other","Pelosi joined colleagues opposing an EEOC proposal to end workplace demographic-data collection.","The official press-release index documents the congressional letter.",["labor","civil-rights"],"congressional letter","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-08-21","other","Pelosi joined California lawmakers in a coastal-management intervention.","The official press-release index documents the congressional response to a federal review of California's coastal program.",["environment-climate"],"congressional letter","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-09-02","other","Pelosi called for the freedom of Hong Kong pro-democracy advocates on the House floor.","The official release documents her floor remarks about Joshua Wong and Jimmy Lai.",["civil-rights","elections-democracy"],"floor advocacy","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-06-04","other","Pelosi delivered House-floor remarks in support of the Ukraine Support Act.","The official release documents the floor remarks and support for the named bill.",["defense"],"floor advocacy","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-04-16","other","Pelosi spoke on the House floor before action on the Iran War Powers Resolution.","The official release documents her floor position and the resolution context.",["defense","judiciary"],"floor advocacy","source-pelosi-press-releases",["new_activity"]],
  ["nancy-pelosi","2026-01-22","floor_vote","Pelosi stated opposition to the Homeland Security Appropriations Act.","The existing official release documents her stated vote position on H.R.7147.",["appropriations","immigration"],"vote position","source-pelosi-hr7147",["new_activity","floor_vote_cast"]],
  ["nancy-pelosi","2026-04-17","other","Pelosi joined a House Democratic letter tied to the Women's History Museum bill.","The existing official release documents the legislative intervention tied to H.R.1329.",["history-culture","civil-rights"],"congressional letter","source-pelosi-hr1329-letter",["new_activity"]],
  ["alex-padilla","2026-08-04","bill_introduction","Padilla introduced the Stop Corrupt Trading Act.","The official release records legislation concerning paid advance access to presidential announcements.",["financial-regulation","judiciary"],"introduced","source-padilla-stop-corrupt-trading",["new_activity","bill_introduced"]],
  ["alex-padilla","2026-07-22","bill_introduction","Padilla led introduction of the Health Equity and Accountability Act of 2026.","The official release records the Tri-Caucus-backed bill introduction.",["healthcare","civil-rights"],"introduced","source-padilla-health-equity",["new_activity","bill_introduced"]],
  ["alex-padilla","2026-08-06","bill_cosponsorship","Padilla's farm-worker package included a bill cosponsored by Schiff.","The official release documents a farm and food-system workforce bill with Schiff as a cosponsor.",["labor"],"cosponsored","source-padilla-farm-workers",["new_activity","cosponsorship_added"]],
  ["alex-padilla","2026-08-07","bill_cosponsorship","Padilla's COWS Act listed Schiff as a cosponsor.","The official release documents the California Senate delegation's participation in the bill.",["environment-climate","transportation-environment"],"cosponsored","source-padilla-cows",["new_activity","cosponsorship_added"]],
  ["alex-padilla","2026-05-12","bill_cosponsorship","Padilla cosponsored the Full-Service Community School Expansion Act.","Van Hollen's official release lists Padilla among Senate cosponsors.",["healthcare","civil-rights"],"cosponsored","source-vanhollen-community-schools",["new_activity","cosponsorship_added"]],
  ["alex-padilla","2026-08-11","bill_introduction","Padilla introduced offshore-wind permitting legislation with Senator King.","The official release documents the introduction and stated permitting focus.",["environment-climate"],"introduced","source-padilla-offshore-wind",["new_activity","bill_introduced"]],
  ["alex-padilla","2026-07-23","other","Padilla joined Schiff in a California delegation event at the Capitol.","The official Schiff press-release index documents their joint Senate activity.",["history-culture"],"delegation activity","source-schiff-legislation-page",["new_activity"]],
  ["adam-schiff","2026-06-08","bill_introduction","Schiff introduced the HALO Act of 2026 on Defense Department AI safeguards.","The official release records the bill introduction and its stated accountability focus.",["defense","technology"],"introduced","source-schiff-halo",["new_activity","bill_introduced"]],
  ["adam-schiff","2026-06-09","bill_introduction","Schiff introduced the Preventing Payouts for Insurrectionists Act.","The official release records the bill introduction and stated eligibility restriction.",["judiciary","elections-democracy"],"introduced","source-schiff-payouts",["new_activity","bill_introduced"]],
  ["adam-schiff","2026-07-14","bill_introduction","Schiff joined EPW leadership in introducing the Water Resources Development Act of 2026.","Alsobrooks' official release names Schiff among the committee leaders introducing WRDA 2026.",["transportation-environment"],"introduced","source-alsobrooks-wrda-introduction",["new_activity","bill_introduced","committee_advanced"]],
  ["adam-schiff","2026-07-17","bill_cosponsorship","Schiff cosponsored the Sanctioning Russia Act of 2026.","Alsobrooks' official release lists Schiff among the bill's Senate cosponsors.",["defense"],"cosponsored","source-alsobrooks-russian-oil",["new_activity","cosponsorship_added"]],
  ["adam-schiff","2026-08-06","bill_cosponsorship","Schiff cosponsored a farm and food-system workforce bill introduced by Padilla.","Padilla's official release lists Schiff among the Senate cosponsors.",["labor"],"cosponsored","source-padilla-farm-workers",["new_activity","cosponsorship_added"]],
  ["adam-schiff","2026-08-07","bill_cosponsorship","Schiff cosponsored Padilla's COWS Act.","Padilla's official release lists Schiff among the Senate cosponsors.",["environment-climate","transportation-environment"],"cosponsored","source-padilla-cows",["new_activity","cosponsorship_added"]],
].map(([memberId, date, type, headline, summary, issueIds, outcomeLabel, sourceRecordId, changeTags]) => ({
  id: `activity-${memberId}-${date}-${sourceRecordId}`,
  memberId: memberId as string,
  date: date as string,
  type: type as ActivityRecordType,
  headline: headline as string,
  summary: summary as string,
  issueIds: issueIds as string[],
  outcomeLabel: outcomeLabel as string,
  changeTags: changeTags as ActivityChangeTag[],
  evidence: [{ label: "Official member-office release", sourceRecordId: sourceRecordId as string, sourceType: "member_office" as const, supports: "The dated action described in this activity record." }],
}));

export const curatedActivitySeeds: CuratedActivitySeed[] = [
  ...contributionBackedActivitySeeds,
  ...standaloneActivitySeeds,
  ...additionalOfficialActivitySeeds,
].sort((left, right) => right.date.localeCompare(left.date));

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
    measure: seed.measureId ? measuresById[seed.measureId]?.measure : seed.measure,
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
