import type { LegislativeContribution } from "../models/legislative";

// This seed data is intentionally small and manually curated. Where the public
// record clearly supports sponsorship or an observed amendment, the record says
// so directly; where downstream survival is not established here, the app says
// unknown rather than filling gaps with inference.
export const contributions: LegislativeContribution[] = [
  {
    id: "raskin-press-act",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "bill_sponsorship",
    title: "Sponsored the PRESS Act",
    billOrMeasure: {
      id: "H.R.4330",
      title: "PRESS Act",
      congress: 117,
    },
    date: "2021-07-01",
    venue: {
      type: "other",
      name: "House introduction",
    },
    summary:
      "Raskin formally introduced H.R.4330, the PRESS Act. Congress.gov shows the bill later passed the House before being received in the Senate.",
    outcome: "passed_chamber",
    survivalStage: {
      committee: true,
      house: true,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "Formal sponsorship is directly documented by Congress.gov. The public record supports that he introduced the bill, not that he personally drafted every provision.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for H.R.4330",
        url: "https://www.congress.gov/bill/117th-congress/house-bill/4330",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "raskin-hres21",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "bill_sponsorship",
    title: "Introduced H.Res.21 and saw it agreed to in the House",
    billOrMeasure: {
      id: "H.Res.21",
      title:
        "Calling on the Vice President to activate section 4 of the 25th Amendment",
      congress: 117,
    },
    date: "2021-01-11",
    venue: {
      type: "floor",
      name: "House",
    },
    summary:
      "Raskin sponsored H.Res.21. Congress.gov records that the resolution was agreed to in the House on January 12, 2021.",
    outcome: "passed_chamber",
    survivalStage: {
      committee: null,
      house: true,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "The claim here is limited to formal sponsorship and House action recorded on Congress.gov.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov resolution page for H.Res.21",
        url: "https://www.congress.gov/bill/117th-congress/house-resolution/21",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "raskin-hamdt190",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "amendment",
    title: "Offered H.Amdt.190 to the MORE Act",
    billOrMeasure: {
      id: "H.R.3617",
      title: "MORE Act",
      congress: 117,
    },
    date: "2022-04-01",
    venue: {
      type: "floor",
      name: "House floor",
    },
    summary:
      "Raskin offered H.Amdt.190 to state that cannabis use should not be the reason for denying or rescinding a security clearance. Congress.gov records that the amendment failed by a recorded vote.",
    proposedText:
      "State that cannabis use shall not be the reason for denying or rescinding a security clearance.",
    outcome: "rejected",
    survivalStage: {
      committee: null,
      house: false,
      senate: false,
      enacted: false,
    },
    attributionNote:
      "This is strong attribution because Congress.gov identifies Raskin as the amendment sponsor and records the floor outcome.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov amendments page for H.R.3617",
        url: "https://www.congress.gov/bill/117th-congress/house-bill/3617/amendments",
        sourceType: "congress_gov",
      },
      {
        label: "Congress.gov all actions for H.R.3617",
        url: "https://www.congress.gov/bill/117th-congress/house-bill/3617/all-actions",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "raskin-hamdt455",
    memberId: "jamie-raskin",
    chamber: "house",
    type: "appropriations_provision",
    title: "Won adoption of H.Amdt.455 on military construction funding",
    billOrMeasure: {
      id: "H.R.3055",
      title:
        "Further Continuing Appropriations Act, 2020, and Further Health Extenders Act of 2019",
      congress: 116,
    },
    date: "2019-06-21",
    venue: {
      type: "floor",
      name: "House floor",
    },
    summary:
      "Raskin offered H.Amdt.455 to increase and decrease funding by $1,000,000 for Military Construction, Navy and Marine Corps to support construction projects on facilities serving military communities where health and safety were at risk. Congress.gov records that the amendment was agreed to by voice vote.",
    proposedText:
      "Increase and decrease funding by $1,000,000 for Military Construction, Navy and Marine Corps to support construction projects where health and safety are at risk.",
    outcome: "adopted",
    survivalStage: {
      committee: null,
      house: true,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "Congress.gov's action log directly ties the amendment offer and adoption to Raskin. The public record here shows floor text-shaping activity, not complete authorship of the underlying bill.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov all actions for H.R.3055",
        url: "https://www.congress.gov/bill/116th-congress/house-bill/3055/all-actions",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "vanhollen-s51",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored the Washington, D.C. Admission Act",
    billOrMeasure: {
      id: "S.51",
      title: "Washington, D.C. Admission Act",
      congress: 119,
    },
    date: "2025-01-09",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Van Hollen formally introduced S.51. Congress.gov records the measure as introduced and referred to committee.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "This is a formal sponsorship record from Congress.gov only. The app does not infer that he authored every line of the bill text.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.51",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/51",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "vanhollen-s123",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored the Handgun Permit to Purchase Act",
    billOrMeasure: {
      id: "S.123",
      title: "Handgun Permit to Purchase Act",
      congress: 119,
    },
    date: "2025-01-16",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Van Hollen introduced S.123. Congress.gov shows the bill was read twice and referred to the Judiciary Committee.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "Only formal sponsorship and recorded legislative status are claimed here.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.123",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/123",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "vanhollen-s1932",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored the VALID Act of 2025",
    billOrMeasure: {
      id: "S.1932",
      title: "VALID Act of 2025",
      congress: 119,
    },
    date: "2025-06-03",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Van Hollen introduced S.1932. Congress.gov shows the bill was referred to the Committee on Banking, Housing, and Urban Affairs.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "The record supports formal sponsorship and referral. No broader authorship claim is made.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.1932",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/1932",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "vanhollen-samdt1887",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "amendment",
    title: "Submitted S.Amdt.1887 on veterans emergency treatment reimbursement",
    billOrMeasure: {
      id: "H.R.815",
      title:
        "Making emergency supplemental appropriations for the fiscal year ending September 30, 2024, and for other purposes",
      congress: 118,
    },
    date: "2024-04-23",
    venue: {
      type: "floor",
      name: "Senate floor",
    },
    summary:
      "Van Hollen submitted S.Amdt.1887 to amend title 38 of the United States Code and improve eligibility for veterans to receive reimbursement for emergency treatment through the Veterans Community Care program.",
    proposedText:
      "Amend title 38, United States Code, to improve eligibility for reimbursement for emergency treatment under the Veterans Community Care program.",
    outcome: "unknown",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "Congress.gov directly identifies Van Hollen as sponsor of the submitted amendment. The available source confirms the proposed change but does not establish later adoption in the seed record.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov amendment page for S.Amdt.1887",
        url: "https://www.congress.gov/amendment/118th-congress/senate-amendment/1887",
        sourceType: "congress_gov",
      },
      {
        label: "Congress.gov amendment text for S.Amdt.1887",
        url: "https://www.congress.gov/amendment/118th-congress/senate-amendment/1887/text",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "vanhollen-samdt3496",
    memberId: "chris-van-hollen",
    chamber: "senate",
    type: "amendment",
    title: "Submitted S.Amdt.3496 to the FY2026 NDAA",
    billOrMeasure: {
      id: "S.2296",
      title: "National Defense Authorization Act for Fiscal Year 2026",
      congress: 119,
    },
    date: "2025-08-01",
    venue: {
      type: "floor",
      name: "Senate floor",
    },
    summary:
      "Van Hollen submitted S.Amdt.3496 to S.2296. The Congress.gov amendment text page documents the submission and ties it to the Senate's consideration of the FY2026 NDAA.",
    outcome: "unknown",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "This is a source-backed amendment sponsorship record. The seed data does not claim more than the submitted text and its official filing.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov amendment page for S.Amdt.3496",
        url: "https://www.congress.gov/amendment/119th-congress/senate-amendment/3496",
        sourceType: "congress_gov",
      },
      {
        label: "Congress.gov amendment text for S.Amdt.3496",
        url: "https://www.congress.gov/amendment/119th-congress/senate-amendment/3496/text",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "alsobrooks-s3556",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored the Wildlife Crossings Program Reauthorization Act of 2025",
    billOrMeasure: {
      id: "S.3556",
      title: "Wildlife Crossings Program Reauthorization Act of 2025",
      congress: 119,
    },
    date: "2025-12-17",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Alsobrooks introduced S.3556. Congress.gov records that it was read twice and referred to the Committee on Environment and Public Works.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "This is a formal sponsorship record from Congress.gov.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.3556",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/3556",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "alsobrooks-s3844",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored a GAO study bill on federal reductions in force",
    billOrMeasure: {
      id: "S.3844",
      title:
        "A bill to require the Comptroller General of the United States to conduct a study of the impact of Federal reductions in force on State and local governments, and for other purposes",
      congress: 119,
    },
    date: "2026-02-11",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Alsobrooks introduced S.3844. Congress.gov shows the bill was read twice and referred to the Committee on Homeland Security and Governmental Affairs.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "The app is only claiming formal sponsorship and committee referral as reflected in Congress.gov.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.3844",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/3844",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "alsobrooks-s3890",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "bill_sponsorship",
    title: "Sponsored a bill to establish a National Council on African American History and Culture",
    billOrMeasure: {
      id: "S.3890",
      title:
        "A bill to establish a National Council on African American History and Culture within the National Endowment for the Humanities, and for other purposes",
      congress: 119,
    },
    date: "2026-02-12",
    venue: {
      type: "other",
      name: "Senate introduction",
    },
    summary:
      "Alsobrooks introduced S.3890. Congress.gov records its referral to the Committee on Health, Education, Labor, and Pensions.",
    outcome: "introduced",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: false,
    },
    attributionNote:
      "This is a straightforward sponsorship record with no claim about who drafted each provision.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov bill page for S.3890",
        url: "https://www.congress.gov/bill/119th-congress/senate-bill/3890",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "alsobrooks-samdt1267",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "appropriations_provision",
    title: "Submitted S.Amdt.1267 on D.C. local funds in H.R.1968",
    billOrMeasure: {
      id: "H.R.1968",
      title: "Full-Year Continuing Appropriations and Extensions Act, 2025",
      congress: 119,
    },
    date: "2025-03-12",
    venue: {
      type: "floor",
      name: "Senate floor",
    },
    summary:
      "Alsobrooks submitted S.Amdt.1267 to allow the District of Columbia to expend local funds under its FY2025 local budget framework and to update a related appropriations reference. Congress.gov records the amendment as submitted.",
    proposedText:
      "Permit the District of Columbia to expend local funds at the rate set forth in the Fiscal Year 2025 Local Budget Act of 2024 and update a related appropriations cross-reference to fiscal year 2026.",
    outcome: "unknown",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "Congress.gov provides high-confidence attribution for the submitted amendment text. The seed data does not claim adoption because that outcome is not established in the linked source summary.",
    confidence: "high",
    evidence: [
      {
        label: "Congress.gov amendment page for S.Amdt.1267",
        url: "https://www.congress.gov/amendment/119th-congress/senate-amendment/1267",
        sourceType: "congress_gov",
      },
      {
        label: "Congress.gov amendment text for S.Amdt.1267",
        url: "https://www.congress.gov/amendment/119th-congress/senate-amendment/1267/text",
        sourceType: "congress_gov",
      },
    ],
  },
  {
    id: "alsobrooks-samdt1279",
    memberId: "angela-alsobrooks",
    chamber: "senate",
    type: "appropriations_provision",
    title: "Submitted S.Amdt.1279 to adjust HIV/AIDS program funding",
    billOrMeasure: {
      id: "H.R.1968",
      title: "Full-Year Continuing Appropriations and Extensions Act, 2025",
      congress: 119,
    },
    date: "2025-03-14",
    venue: {
      type: "floor",
      name: "Senate floor",
    },
    summary:
      "Alsobrooks, with Senator Blumenthal, submitted S.Amdt.1279 to increase a funding amount in H.R.1968. The Congressional Record text preserved on Congress.gov shows the specific dollar changes proposed.",
    proposedText:
      "Strike $40,395,072,000 and insert $41,254,072,000, with a corresponding increase to a related program amount.",
    affectedText:
      "Appropriations text in H.R.1968 concerning program funding levels.",
    outcome: "unknown",
    survivalStage: {
      committee: null,
      house: null,
      senate: null,
      enacted: null,
    },
    attributionNote:
      "The source supports high-confidence attribution for the filed amendment and its text. It does not, by itself, establish later adoption.",
    confidence: "high",
    evidence: [
      {
        label: "Congressional Record text for Senate Amendment 1279",
        url: "https://www.congress.gov/congressional-record/volume-171/issue-49/senate-section/article/S1784-5",
        sourceType: "congress_gov",
      },
    ],
  },
];
